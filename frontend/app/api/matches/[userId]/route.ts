import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Business from "@/models/Business";
import User from "@/models/User";
import MatchRecord from "@/models/MatchRecord";
import Offering from "@/models/Offering";
import Intent from "@/models/Intent";

export const dynamic = "force-dynamic";

// ─── Gemini client (Stage 3 only) ────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Cache TTL ────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── Tokenization & Stopwords ────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "by",
  "of", "is", "are", "it", "we", "you", "they", "i", "not", "no", "this", "that",
  "our", "their", "your", "my", "us", "from", "as", "about"
]);

function cleanAndTokenize(text: string | string[]): string[] {
  const arr = Array.isArray(text) ? text : [text];
  return arr
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

// ─── Fuzzy Similarity & Phrase Compatibility ───────────────────────────────

function phraseSimilarity(phraseA: string, phraseB: string): number {
  const pA = phraseA.toLowerCase().trim();
  const pB = phraseB.toLowerCase().trim();

  if (!pA || !pB) return 0;
  if (pA === pB) return 1.0;
  if (pA.includes(pB) || pB.includes(pA)) return 0.8;

  const tokensA = cleanAndTokenize(pA);
  const tokensB = cleanAndTokenize(pB);

  if (!tokensA.length || !tokensB.length) return 0;

  const intersection = tokensA.filter((t) => tokensB.includes(t));
  if (intersection.length === 0) return 0;

  // Fraction of tokens in phraseA that are present in phraseB
  return intersection.length / tokensA.length;
}

// How well B's offerings satisfy A's needs (40% weight target)
function computeNeedsMetByOfferingsScore(needs: string[], offerings: string[]): number {
  if (!needs.length || !offerings.length) return 0;

  let totalScore = 0;
  for (const need of needs) {
    let maxSim = 0;
    for (const offering of offerings) {
      const sim = phraseSimilarity(need, offering);
      if (sim > maxSim) maxSim = sim;
    }
    totalScore += maxSim;
  }

  return Math.round((totalScore / needs.length) * 100);
}

// How well B's offerings satisfy A's strategic goal (20% weight target)
function computeGoalSatisfiedByOfferingsScore(goal: string, offerings: string[]): number {
  if (!goal || !offerings.length) return 0;
  const cleanGoal = goal.toLowerCase().trim();

  let maxSim = 0;
  for (const offering of offerings) {
    const cleanOffering = offering.toLowerCase().trim();
    let sim = 0;
    if (cleanGoal.includes(cleanOffering) || cleanOffering.includes(cleanGoal)) {
      sim = 1.0;
    } else {
      const tokensOff = cleanAndTokenize(cleanOffering);
      const tokensGoal = cleanAndTokenize(cleanGoal);
      if (tokensOff.length > 0) {
        const intersection = tokensOff.filter((t) => tokensGoal.includes(t));
        sim = intersection.length / tokensOff.length;
      }
    }
    if (sim > maxSim) maxSim = sim;
  }

  return Math.round(maxSim * 100);
}

// ─── Geographic Proximity Score (15% weight target) ─────────────────────────
function locationScore(A: any, B: any): number {
  const norm = (s?: string) => (s || "").toLowerCase().trim();

  const aCity = norm(A.location?.city);
  const aState = norm(A.location?.state);
  const aCountry = norm(A.location?.country);

  const bCity = norm(B.location?.city);
  const bState = norm(B.location?.state);
  const bCountry = norm(B.location?.country);

  if (aCity && bCity && aCity === bCity) return 100;           // same city
  if (aState && bState && aState === bState) return 70;        // same state
  if (aCountry && bCountry && aCountry === bCountry) return 40; // same country

  // Reach bonus
  const reach = (B.location?.operatesIn || "").toLowerCase();
  if (reach === "global") return 30;
  if (reach === "national") return 20;

  return 10; // different country, no special reach
}

// ─── Strict Competitor Filter ────────────────────────────────────────────────
function isCompetitor(A: any, B: any): boolean {
  const aOffersArr: string[] = A.offerings || [];
  const bOffersArr: string[] = B.offerings || [];

  if (aOffersArr.length === 0 || bOffersArr.length === 0) return false;

  const aInd = (A.industry || "").toLowerCase().trim();
  const bInd = (B.industry || "").toLowerCase().trim();

  // 1. Exact case-insensitive offering match
  const setA = new Set(aOffersArr.map((s) => s.toLowerCase().trim()));
  const setB = new Set(bOffersArr.map((s) => s.toLowerCase().trim()));
  for (const item of setA) {
    if (setB.has(item)) {
      return true; // Shares an exact offering phrase -> direct competitor!
    }
  }

  // 2. Tokenized word overlap
  const tokensA = cleanAndTokenize(aOffersArr);
  const tokensB = cleanAndTokenize(bOffersArr);
  if (tokensA.length === 0 || tokensB.length === 0) return false;

  const setTokensA = new Set(tokensA);
  const setTokensB = new Set(tokensB);

  const intersection = [...setTokensA].filter((t) => setTokensB.has(t));
  if (intersection.length > 0) {
    // If in the same industry and share ANY offering token, they are competitors
    if (aInd && bInd && aInd === bInd) {
      return true;
    }

    // If they share more than 20% of their offering tokens (Jaccard similarity), they are competitors
    const union = new Set([...setTokensA, ...setTokensB]);
    const overlap = intersection.length / union.size;
    if (overlap > 0.20) {
      return true;
    }
  }

  return false;
}

// ─── Profile Enrichment Helper ────────────────────────────────────────────────
function enrichProfile(biz: any, offeringsMap: Map<string, string>, intentsMap: Map<string, string>) {
  if (!biz) return biz;

  const ownerId = biz.ownerId?.toString();
  if (!ownerId) return biz;

  let offerings = Array.isArray(biz.offerings) ? [...biz.offerings] : [];
  let needs = Array.isArray(biz.needs) ? [...biz.needs] : [];

  // Fallback offerings if they contain only generic values or are empty
  const isGenericOff = offerings.length === 0 || 
    (offerings.length === 1 && (offerings[0] === "Service" || offerings[0] === "Services"));
  if (isGenericOff) {
    const richOff = offeringsMap.get(ownerId);
    if (richOff) {
      offerings = richOff.split(",").map(s => s.trim()).filter(Boolean);
    }
  }

  // Fallback needs if they contain only generic values or are empty
  const isGenericNeed = needs.length === 0 || 
    (needs.length === 1 && (needs[0] === "Client" || needs[0] === "Clients" || needs[0] === "Customer" || needs[0] === "Customers"));
  if (isGenericNeed) {
    const richIntent = intentsMap.get(ownerId) || biz.intent?.currentGoal;
    if (richIntent) {
      needs = [richIntent];
    }
  }

  return {
    ...biz,
    offerings,
    needs
  };
}

// ─── Hard Validation Filter ──────────────────────────────────────────────────
function isValidMatch(A: any, B: any): boolean {
  const aNeedsArr: string[] = A.needs || [];
  const aOffersArr: string[] = A.offerings || [];
  const bNeedsArr: string[] = B.needs || [];
  const bOffersArr: string[] = B.offerings || [];

  // Hard filter: Both target and candidate MUST have at least 1 need, 1 offering, and a goal
  if (!aNeedsArr.length || !aOffersArr.length || !(A.intent?.currentGoal?.trim())) return false;
  if (!bNeedsArr.length || !bOffersArr.length || !(B.intent?.currentGoal?.trim())) return false;

  // Strict competitor filter
  if (isCompetitor(A, B)) return false;

  // Direction check — A needs B's offerings OR A's goal is satisfied by B's offerings OR B needs A's offerings
  const aNeedsMet = computeNeedsMetByOfferingsScore(aNeedsArr, bOffersArr);
  const bNeedsMet = computeNeedsMetByOfferingsScore(bNeedsArr, aOffersArr);
  const aGoalMet = computeGoalSatisfiedByOfferingsScore(A.intent.currentGoal, bOffersArr);

  if (aNeedsMet === 0 && bNeedsMet === 0 && aGoalMet === 0) {
    return false;
  }

  return true;
}

// ─── Helper Functions for Verification & Completeness ──────────────────────
function getVerificationScore(candidateUser: any, B: any): number {
  const status = (B.trust?.verificationStatus || "").trim().toLowerCase();
  
  if (status === "trusted partner") return 100;
  if (status === "business verified" || candidateUser?.verified === true) return 80;
  if (status === "basic verified" || status === "basic") return 60;
  if (status === "verified user") return 80;
  if (status === "not verified" || status === "") return 20;

  return 20;
}

function getProfileCompletenessScore(candidateUser: any, B: any): number {
  if (typeof B.profileScore === "number") {
    return B.profileScore;
  }

  // Fallback completeness calculation matching profile/route.ts
  let score = 0;
  if (candidateUser?.name && candidateUser?.phone) score += 15;
  if (B.companyName && B.industry) score += 15;
  if (B.location?.country && B.location?.city) score += 10;
  if (B.strength?.teamSize) score += 5;
  if (B.offerings && B.offerings.length > 0) score += 15;
  if (B.needs && B.needs.length > 0) score += 15;
  if (B.intent && B.intent.currentGoal) score += 15;
  if (B.trust && B.trust.website) score += 10;

  return Math.min(score, 100);
}

// ─── TargetedSynergy-v3.1 Scoring Engine ────────────────────────────────────
function computeDeterministicScore(
  userBiz: any,
  candidate: any,
  candidateUser: any
): {
  total: number;
  breakdown: {
    aNeedsMetByBOffers: number;
    aGoalSatisfiedByBOffers: number;
    bNeedsMetByAOffers: number;
    bGoalSatisfiedByAOffers: number;
    locationProximity: number;
    verification: number;
    profileCompleteness: number;
    intentRelevance: number;
    location: number;
  };
} {
  const aNeedsMetByBOffers = computeNeedsMetByOfferingsScore(userBiz.needs || [], candidate.offerings || []);
  const aGoalSatisfiedByBOffers = computeGoalSatisfiedByOfferingsScore(userBiz.intent?.currentGoal || "", candidate.offerings || []);

  const bNeedsMetByAOffers = computeNeedsMetByOfferingsScore(candidate.needs || [], userBiz.offerings || []);
  const bGoalSatisfiedByAOffers = computeGoalSatisfiedByOfferingsScore(candidate.intent?.currentGoal || "", userBiz.offerings || []);

  const locationProximity = locationScore(userBiz, candidate); // Returns 0-100
  const verification = getVerificationScore(candidateUser, candidate); // Returns 0-100
  const profileCompleteness = getProfileCompletenessScore(candidateUser, candidate); // Returns 0-100

  const total = Math.round(
    aNeedsMetByBOffers      * 0.35 +
    aGoalSatisfiedByBOffers * 0.20 +
    bNeedsMetByAOffers      * 0.15 +
    bGoalSatisfiedByAOffers * 0.10 +
    locationProximity       * 0.10 +
    verification            * 0.05 +
    profileCompleteness     * 0.05
  );

  return {
    total,
    breakdown: {
      aNeedsMetByBOffers: Math.round(aNeedsMetByBOffers * 0.35),
      aGoalSatisfiedByBOffers: Math.round(aGoalSatisfiedByBOffers * 0.20),
      bNeedsMetByAOffers: Math.round(bNeedsMetByAOffers * 0.15),
      bGoalSatisfiedByAOffers: Math.round(bGoalSatisfiedByAOffers * 0.10),
      locationProximity: Math.round(locationProximity * 0.10),
      verification: Math.round(verification * 0.05),
      profileCompleteness: Math.round(profileCompleteness * 0.05),
      intentRelevance: Math.round(
        aNeedsMetByBOffers      * 0.35 +
        aGoalSatisfiedByBOffers * 0.20 +
        bNeedsMetByAOffers      * 0.15 +
        bGoalSatisfiedByAOffers * 0.10
      ),
      location: Math.round(locationProximity * 0.10),
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
  breakdown: any,
  aiReason?: string
): string[] {
  const reasons: string[] = [];

  // 1. Direct need satisfaction
  const matchedNeeds = (userBiz.needs || []).filter((n: string) =>
    (candidate.offerings || []).some((o: string) => phraseSimilarity(n, o) > 0.5)
  );
  if (matchedNeeds.length > 0) {
    reasons.push(`🎯 They offer what you need: ${matchedNeeds.slice(0, 2).join(", ")}`);
  }

  // 2. Goal satisfaction
  const goalSim = computeGoalSatisfiedByOfferingsScore(userBiz.intent?.currentGoal || "", candidate.offerings || []);
  if (goalSim > 50) {
    reasons.push(`✨ Matches your strategic goal: "${userBiz.intent.currentGoal}"`);
  }

  // 3. Mutual need satisfaction
  const matchedOffers = (candidate.needs || []).filter((n: string) =>
    (userBiz.offerings || []).some((o: string) => phraseSimilarity(n, o) > 0.5)
  );
  if (matchedOffers.length > 0) {
    reasons.push(`🤝 They need what you offer: ${matchedOffers.slice(0, 2).join(", ")}`);
  }

  // 4. Location
  if (breakdown.locationProximity > 0) {
    const locScore = breakdown.locationProximity / 0.15; // get raw score back
    if (locScore >= 100) {
      reasons.push(`📍 Same city — ${candidate.location?.city || ""}`);
    } else if (locScore >= 70) {
      reasons.push(`📍 Same state — ${candidate.location?.state || ""}`);
    } else if (locScore >= 40) {
      reasons.push(`📍 Same country — ${candidate.location?.country || ""}`);
    }
  }

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
    const rawUserBiz = await Business.findOne({ ownerId: userId }).lean() as any;
    if (!rawUserBiz) {
      return NextResponse.json(
        { msg: "Business profile not found. Please complete your profile first." },
        { status: 404 }
      );
    }

    // Fetch rich offerings and intents from Firestore to enrich the profiles
    const [allOfferings, allIntents] = await Promise.all([
      Offering.find({}).exec() as Promise<any[]>,
      Intent.find({}).exec() as Promise<any[]>
    ]);

    // Create lookup maps by userId
    const offeringsMap = new Map<string, string>();
    const intentsMap = new Map<string, string>();

    for (const off of allOfferings) {
      if (off.userId && off.text) {
        offeringsMap.set(off.userId.toString(), off.text);
      }
    }
    for (const intent of allIntents) {
      if (intent.userId && intent.text) {
        intentsMap.set(intent.userId.toString(), intent.text);
      }
    }

    // Enrich User A's profile
    const userBiz = enrichProfile(rawUserBiz, offeringsMap, intentsMap);

    // ── Stage 0+1: Candidate Retrieval with Hard Filter ───────────────────────
    // Fetch all active users' businesses (excluding self + suspended)
    const candidates: any[] = await Business.aggregate([
      { $match: { ownerId: { $ne: userId } } },
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

    // Enrich all candidate profiles using lookup maps
    const enrichedCandidates = candidates.map(c => {
      const enriched = enrichProfile(c, offeringsMap, intentsMap);
      return {
        ...enriched,
        ownerData: c.ownerData
      };
    });

    // Stage 0: Hard filter — direction + competitor check
    const filtered = enrichedCandidates.filter((c) => isValidMatch(userBiz, c));
    console.log(`[MATCH] userId=${userId} | total=${candidates.length} | after hard filter=${filtered.length}`);

    // Stage 1: Score all filtered non-competitor candidates directly using the composite formula
    const scored = filtered
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
        algorithm: "TargetedSynergy-v3.1",
        signals: [
          "aNeedsMetByBOffers(35%)",
          "aGoalSatisfiedByBOffers(20%)",
          "bNeedsMetByAOffers(15%)",
          "bGoalSatisfiedByAOffers(10%)",
          "locationProximity(10%)",
          "verification(5%)",
          "profileCompleteness(5%)"
        ],
        aiRerankEnabled: process.env.GEMINI_RERANK_ENABLED === "true",
        evaluatedCandidates: filtered.length,
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
