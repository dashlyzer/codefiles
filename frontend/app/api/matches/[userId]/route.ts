import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Business from "@/models/Business";
import User from "@/models/User";
import MatchRecord from "@/models/MatchRecord";

export const dynamic = "force-dynamic";

// ─── Gemini client (Stage 3 only) ────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Cache TTL ────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── Stage 0: Hard Filter ────────────────────────────────────────────────────
// Returns false for:
//   • No directional synergy (neither side needs what the other offers)
//   • Competitors (same industry + >60% offering overlap)

function tokenize(arr: string[]): string[] {
  return arr
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function overlapRatio(arrA: string[], arrB: string[]): number {
  if (!arrA.length || !arrB.length) return 0;
  const setA = new Set(arrA.map((s) => s.toLowerCase().trim()));
  const setB = new Set(arrB.map((s) => s.toLowerCase().trim()));
  const intersection = [...setA].filter((w) => setB.has(w));
  const union = new Set([...setA, ...setB]);
  return intersection.length / union.size;
}

function isValidMatch(A: any, B: any): boolean {
  const aNeedsArr: string[] = A.needs || [];
  const aOffersArr: string[] = A.offerings || [];
  const bNeedsArr: string[] = B.needs || [];
  const bOffersArr: string[] = B.offerings || [];

  // Hard filter: Both target and candidate MUST have at least 1 need, 1 offering, and a goal
  if (!aNeedsArr.length || !aOffersArr.length || !(A.intent?.currentGoal?.trim())) return false;
  if (!bNeedsArr.length || !bOffersArr.length || !(B.intent?.currentGoal?.trim())) return false;


  // Direction check — at least one side must need what the other offers
  const ANeedsBOffers = aNeedsArr.some((n) =>
    bOffersArr.some((o) => o.toLowerCase().trim() === n.toLowerCase().trim())
  );
  const BNeedsAOffers = bNeedsArr.some((n) =>
    aOffersArr.some((o) => o.toLowerCase().trim() === n.toLowerCase().trim())
  );

  if (!ANeedsBOffers && !BNeedsAOffers) return false;

  // Competitor filter — same industry AND >60% offering overlap
  if (A.industry && B.industry && A.industry.toLowerCase() === B.industry.toLowerCase()) {
    const competitorOverlap = overlapRatio(aOffersArr, bOffersArr);
    if (competitorOverlap > 0.6) return false;
  }

  return true;
}

// ─── Stage 1: BM25-Style Keyword Similarity ──────────────────────────────────
// Score 0–100: how much do their needs+offerings vocabularies overlap?

function basicSimilarity(A: any, B: any): number {
  const textA = tokenize([...(A.needs || []), ...(A.offerings || [])]);
  const textB = tokenize([...(B.needs || []), ...(B.offerings || [])]);

  if (!textA.length || !textB.length) return 0;

  const setA = new Set(textA);
  const setB = new Set(textB);
  const intersection = [...setA].filter((w) => setB.has(w));

  // Asymmetric: how much of A's vocab does B satisfy?
  return Math.round((intersection.length / setA.size) * 100);
}

// ─── Stage 2: Deterministic Weighted Score ───────────────────────────────────

/** 35 pts — directional needs↔offerings intent match */
function intentMatchScore(A: any, B: any): number {
  const aNeedsArr: string[] = A.needs || [];
  const aOffersArr: string[] = A.offerings || [];
  const bNeedsArr: string[] = B.needs || [];
  const bOffersArr: string[] = B.offerings || [];

  let matchedTerms = 0;
  let totalTerms = aNeedsArr.length + bNeedsArr.length;
  if (totalTerms === 0) return 0;

  for (const n of aNeedsArr) {
    if (bOffersArr.some((o) => o.toLowerCase().trim() === n.toLowerCase().trim())) matchedTerms++;
  }
  for (const n of bNeedsArr) {
    if (aOffersArr.some((o) => o.toLowerCase().trim() === n.toLowerCase().trim())) matchedTerms++;
  }

  return Math.round((matchedTerms / totalTerms) * 100);
}

/** 15 pts — geographic proximity */
function locationScore(A: any, B: any): number {
  const norm = (s?: string) => (s || "").toLowerCase().trim();

  const aCity = norm(A.location?.city);
  const aState = norm(A.location?.state);
  const aCountry = norm(A.location?.country);

  const bCity = norm(B.location?.city);
  const bState = norm(B.location?.state);
  const bCountry = norm(B.location?.country);

  if (aCity && bCity && aCity === bCity) return 100;       // same city
  if (aState && bState && aState === bState) return 70;    // same state
  if (aCountry && bCountry && aCountry === bCountry) return 40; // same country

  // Reach bonus
  const reach = (B.location?.operatesIn || "").toLowerCase();
  if (reach === "global") return 30;
  if (reach === "national") return 20;

  return 10; // different country, no special reach
}

/** 10 pts — industry fit (penalise cross-industry mismatch, reward same sector) */
function businessFitScore(A: any, B: any): number {
  const aInd = (A.industry || "").toLowerCase().trim();
  const bInd = (B.industry || "").toLowerCase().trim();
  if (!aInd || !bInd) return 50; // unknown — neutral
  if (aInd === bInd) return 80;  // same sector, still relevant (complementary roles)
  return 40;                     // cross-industry — valid but less contextual
}

/** 10 pts — profile completeness (50%) + intent freshness (50%) */
function intentQualityScore(B: any, bUser: any): number {
  let score = 0;

  // ── Profile Completeness (max 50 pts) ─────────────────────────────────────
  // Each missing field penalises the candidate's rank.
  if (B.companyName && B.companyName.trim().length > 0) score += 10; // has company name
  if (B.industry   && B.industry.trim().length   > 0) score += 10;   // has industry
  if (B.location?.city && B.location.city.trim().length > 0) score += 10; // has city
  if ((B.offerings || []).length >= 2) score += 10;                   // 2+ offerings
  if ((B.needs     || []).length >= 2) score += 10;                   // 2+ needs

  // ── Intent Freshness (max 50 pts) ─────────────────────────────────────────
  if (B.intent?.currentGoal && B.intent.currentGoal.trim().length > 0) score += 25;
  if (bUser?.intentLastUpdated) {
    const daysSinceUpdate =
      (Date.now() - new Date(bUser.intentLastUpdated).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 7)  score += 25; // updated this week
    else if (daysSinceUpdate < 30) score += 15; // updated this month
    else if (daysSinceUpdate < 90) score += 5;  // updated this quarter
  }

  return score; // 0–100, weighted at 10% of final score = 0–10 pts
}


/** 10 pts — how recently the candidate was active */
function activityScore(bUser: any): number {
  if (!bUser?.lastActive) return 10;
  const daysSince =
    (Date.now() - new Date(bUser.lastActive).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince < 1) return 100;
  if (daysSince < 7) return 80;
  if (daysSince < 30) return 50;
  if (daysSince < 90) return 25;
  return 10;
}

/** 5 pts — verification tier */
function verificationScore(bUser: any, bBiz: any): number {
  if (bUser?.verified) return 100;
  const status = bBiz?.trust?.verificationStatus || "Not Verified";
  if (status === "Trusted Partner") return 90;
  if (status === "Business Verified") return 70;
  if (status === "Basic Verified") return 50;
  return 30;
}

/** Final weighted composite — 0 to 100 */
function computeDeterministicScore(
  userBiz: any,
  candidate: any,
  candidateUser: any
): {
  total: number;
  breakdown: {
    intentMatch: number;
    semantic: number;
    location: number;
    businessFit: number;
    intentQuality: number;
    activity: number;
    verification: number;
  };
} {
  const intent   = intentMatchScore(userBiz, candidate);    // 0–100
  const semantic = basicSimilarity(userBiz, candidate);      // 0–100
  const location = locationScore(userBiz, candidate);        // 0–100
  const fit      = businessFitScore(userBiz, candidate);     // 0–100
  const quality  = intentQualityScore(candidate, candidateUser); // 0–100
  const activity = activityScore(candidateUser);             // 0–100
  const verify   = verificationScore(candidateUser, candidate); // 0–100

  const total = Math.round(
    intent   * 0.35 +
    semantic * 0.15 +
    location * 0.15 +
    fit      * 0.10 +
    quality  * 0.10 +
    activity * 0.10 +
    verify   * 0.05
  );

  return {
    total,
    breakdown: {
      intentMatch:   Math.round(intent   * 0.35),
      semantic:      Math.round(semantic * 0.15),
      location:      Math.round(location * 0.15),
      businessFit:   Math.round(fit      * 0.10),
      intentQuality: Math.round(quality  * 0.10),
      activity:      Math.round(activity * 0.10),
      verification:  Math.round(verify   * 0.05),
    },
  };
}

// ─── Stage 3: Gemini Rerank (Top 10 only, opt-in) ────────────────────────────
// Controlled by GEMINI_RERANK_ENABLED=true in .env.local
// Adds up to 30 bonus points. 10 calls MAX — never 30+.

async function geminiRerank(
  userBiz: any,
  candidates: Array<{ item: any; score: number; breakdown: any }>
): Promise<Map<string, number>> {
  const boostMap = new Map<string, number>();

  if (process.env.GEMINI_RERANK_ENABLED !== "true") return boostMap;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
    systemInstruction: `You are a B2B matchmaker. Given a target business and a candidate, rate the commercial synergy from 0–100.
Focus only on whether a real business deal (as buyer, seller, partner or referral) is realistic.
Return JSON: { "score": number, "reason": "one short sentence" }`,
  });

  for (const { item } of candidates) {
    const cId = item.ownerId.toString();
    try {
      const prompt = `Target needs: ${JSON.stringify(userBiz.needs)}
Target offers: ${JSON.stringify(userBiz.offerings)}
Candidate offers: ${JSON.stringify(item.offerings)}
Candidate needs: ${JSON.stringify(item.needs)}
Industry target: ${userBiz.industry} | Industry candidate: ${item.industry}`;

      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      boostMap.set(cId, Number(parsed.score) || 0);
    } catch {
      boostMap.set(cId, 0);
    }
  }

  return boostMap;
}

// ─── Build human-readable reason strings ─────────────────────────────────────
function buildReasons(
  userBiz: any,
  candidate: any,
  breakdown: ReturnType<typeof computeDeterministicScore>["breakdown"],
  aiReason?: string
): string[] {
  const reasons: string[] = [];

  // Intent match
  const matchedNeeds = (userBiz.needs || []).filter((n: string) =>
    (candidate.offerings || []).some((o: string) => o.toLowerCase() === n.toLowerCase())
  );
  const matchedOffers = (candidate.needs || []).filter((n: string) =>
    (userBiz.offerings || []).some((o: string) => o.toLowerCase() === n.toLowerCase())
  );

  if (matchedNeeds.length > 0)
    reasons.push(`🎯 They offer what you need: ${matchedNeeds.slice(0, 2).join(", ")}`);
  if (matchedOffers.length > 0)
    reasons.push(`🤝 They need what you offer: ${matchedOffers.slice(0, 2).join(", ")}`);

  // Location
  if (breakdown.location >= Math.round(100 * 0.15))
    reasons.push(`📍 Same city — ${candidate.location?.city || ""}`);
  else if (breakdown.location >= Math.round(70 * 0.15))
    reasons.push(`📍 Same state — ${candidate.location?.state || ""}`);

  // Verification
  if (breakdown.verification >= Math.round(70 * 0.05))
    reasons.push("✅ Verified business");

  // AI reason (if rerank ran)
  if (aiReason) reasons.push(`🤖 ${aiReason}`);

  return reasons.slice(0, 4);
}

// ─── POST — Run Stable Hybrid Match Engine ────────────────────────────────────
export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;

    // ── Load User A's profile ─────────────────────────────────────────────────
    const userBiz = await Business.findOne({ ownerId: userId }).lean() as any;
    if (!userBiz) {
      return NextResponse.json(
        { msg: "Business profile not found. Please complete your profile first." },
        { status: 404 }
      );
    }

    // ── Stage 0+1: Candidate Retrieval with Hard Filter ───────────────────────
    // Fetch all active users' businesses (excluding self + suspended)
    const candidates: any[] = await Business.aggregate([
      { $match: { ownerId: { $ne: new mongoose.Types.ObjectId(userId) } } },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      { $unwind: { path: "$ownerData", preserveNullAndEmptyArrays: true } },
      { $match: { "ownerData.status": { $ne: "SUSPENDED" } } },
    ]);

    if (candidates.length === 0) {
      return NextResponse.json({ count: 0, matches: [], meta: { fromCache: false } });
    }

    // Stage 0: Hard filter — direction + competitor check
    const filtered = candidates.filter((c) => isValidMatch(userBiz, c));
    console.log(`[MATCH] userId=${userId} | total=${candidates.length} | after hard filter=${filtered.length}`);

    // Stage 1: BM25 pre-score to get top 50 candidates
    const prescored = filtered
      .map((c) => ({ c, pre: basicSimilarity(userBiz, c) }))
      .sort((a, b) => b.pre - a.pre)
      .slice(0, 50)
      .map((x) => x.c);

    // ── Stage 2: Deterministic Scoring ───────────────────────────────────────
    const scored = prescored
      .map((c) => {
        const user = c.ownerData;
        const { total, breakdown } = computeDeterministicScore(userBiz, c, user);
        return { item: c, score: total, breakdown, user };
      })
      .filter((x) => x.score >= 15) // minimum quality gate
      .sort((a, b) => b.score - a.score);

    // Top 10 go to Gemini rerank (if enabled)
    const top10 = scored.slice(0, 10);
    const rest  = scored.slice(10, 20);

    // ── Stage 3: Gemini Rerank (Top 10 only) ─────────────────────────────────
    let aiBoostMap = new Map<string, number>();
    if (top10.length > 0) {
      console.log(`[MATCH] Running Gemini rerank on ${top10.length} candidates (GEMINI_RERANK_ENABLED=${process.env.GEMINI_RERANK_ENABLED})`);
      aiBoostMap = await geminiRerank(userBiz, top10);
    }

    // Merge AI boost into top 10 scores, leave rest as-is
    const top10Boosted = top10.map(({ item, score, breakdown, user }) => {
      const cId = item.ownerId.toString();
      const rawAiScore = aiBoostMap.get(cId) ?? 0;
      // Blend: 70% deterministic + 30% AI
      const blended = Math.round(score * 0.7 + rawAiScore * 0.3);
      const aiBoostPts = Math.round(rawAiScore * 0.3);
      return { item, score: blended, breakdown: { ...breakdown, aiBoost: aiBoostPts }, user, aiScore: rawAiScore };
    });

    // Deduplicate by ownerId — guards against duplicate Business docs in MongoDB
    const seenIds = new Set<string>();
    const allFinal = [
      ...top10Boosted,
      ...rest.map(({ item, score, breakdown, user }) => ({
        item, score, breakdown: { ...breakdown, aiBoost: 0 }, user, aiScore: 0,
      })),
    ]
      .sort((a, b) => b.score - a.score)
      .filter(({ item }) => {
        const id = item.ownerId.toString();
        if (seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      })
      .slice(0, 20);

    // ── Stage 4: Format + Persist Results ────────────────────────────────────
    const now = new Date();
    const formattedMatches = allFinal.map(({ item, score, breakdown, user }) => {
      const reasons = buildReasons(userBiz, item, breakdown as any);

      return {
        matchedUserId: item.ownerId,
        candidateName: user?.name || item.ownerName || "Unknown",
        companyName:   item.companyName || item.brandName || "",
        industry:      item.industry || "",
        location:      item.location?.city
          ? `${item.location.city}${item.location.state ? ", " + item.location.state : ""}`
          : item.location?.country || "Unknown",
        offerings:     item.offerings || [],
        needs:         item.needs || [],
        goal:          item.intent?.currentGoal || "",
        verified:      user?.verified ?? false,
        verificationStatus: item.trust?.verificationStatus || "Not Verified",
        subscriptionPlan: user?.subscriptionPlan || "FREE",
        score,
        scoreBreakdown: breakdown,
        reasons,
      };
    });

    // Atomic replace: delete old cache, insert new
    await MatchRecord.deleteMany({ userId });
    if (formattedMatches.length > 0) {
      await MatchRecord.insertMany(
        formattedMatches.map((m) => ({
          userId,
          matchedUserId: m.matchedUserId,
          candidateName: m.candidateName,
          companyName: m.companyName,
          industry: m.industry,
          location: m.location,
          offerings: m.offerings,
          needs: m.needs,
          goal: m.goal,
          verified: m.verified,
          score: m.score,
          reasons: m.reasons,
          scoreBreakdown: m.scoreBreakdown,
          generatedAt: now,
          cacheVersion: 1,
        }))
      );
    }

    console.log(
      `[MATCH] userId=${userId} | scored=${scored.length} | saved=${formattedMatches.length} | aiRerank=${aiBoostMap.size > 0}`
    );

    return NextResponse.json({
      count: formattedMatches.length,
      matches: formattedMatches,
      meta: {
        fromCache: false,
        algorithm: "StableHybrid-v2",
        signals: ["intentMatch(35%)", "semantic(15%)", "location(15%)", "businessFit(10%)", "intentQuality(10%)", "activity(10%)", "verification(5%)"],
        aiRerankEnabled: process.env.GEMINI_RERANK_ENABLED === "true",
        evaluatedCandidates: filtered.length,
        prescreenedCandidates: prescored.length,
      },
    });

  } catch (err: any) {
    console.error("[MATCH] Engine error:", err);
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}

// ─── GET — Return cached match results ───────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const data = await MatchRecord.find({ userId }).sort({ score: -1 }).lean();

    // Check if cache is still fresh
    const first = data[0] as any;
    const cacheAge = first
      ? Date.now() - new Date(first.generatedAt ?? first.createdAt).getTime()
      : null;
    const isStale = cacheAge === null || cacheAge >= CACHE_TTL_MS;

    return NextResponse.json({
      count: data.length,
      matches: data,
      meta: {
        fromCache: data.length > 0,
        isStale,
        cacheAgeMinutes: cacheAge ? Math.round(cacheAge / 60000) : null,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}
