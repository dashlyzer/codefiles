import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Business from "@/models/Business";
import Offering from "@/models/Offering";
import MatchRecord from "@/models/MatchRecord";
import { tokenize, bm25Score, normalizeBM25 } from "@/lib/bm25";

export const dynamic = "force-dynamic";

// ─── Gemini client ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Scoring weights (max = 100) ──────────────────────────────────────────────
// Rule: User A's NEEDS → User B's OFFERINGS
const MAX_SEMANTIC = 70; // cosine similarity (Gemini embeddings)
const MAX_BM25     = 10; // keyword overlap tie-breaker
const MAX_LOCATION = 20; // geo proximity

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a Gemini embedding vector for a text string */
async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Business model noise terms that should NOT influence semantic matching.
 * These describe HOW a company operates (go-to-market model), NOT what it
 * actually offers or needs. Including them causes a digital marketing agency
 * to match a steel factory simply because both selected "B2B".
 */
const NOISE_TERMS = new Set([
  "b2b","b2c","d2c","dtc","b2g","c2c",
  "saas","paas","iaas","xaas",
  "ecommerce","ecom","marketplace","platform",
  "smb","sme","msme","enterprise","startup","unicorn",
  "wholesale","retail","direct","indirect","omnichannel","multichannel",
  "subscription","freemium","on-demand",
  "clients","customers","users","buyers","sellers","vendors","leads",
  "growth","scale","revenue","profit","sales","pipeline",
  "agency","firm","group","startup","company","solutions","services",
]);

/** Strip business model noise terms from a string before embedding or tokenizing */
function denoiseText(text: string): string {
  return text
    .split(/[,\s]+/)
    .filter(word => !NOISE_TERMS.has(word.toLowerCase().replace(/[^a-z0-9]/g, "")))
    .join(" ")
    .trim();
}

/** Cosine similarity between two equal-length vectors (returns 0–1) */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/** Location proximity score (0–20) */
function locationScore(userBiz: any, c: any): number {
  const norm = (s?: string) => (s || "").toLowerCase().trim();
  const uCity    = norm(userBiz.location?.city);
  const uState   = norm(userBiz.location?.state);
  const uCountry = norm(userBiz.location?.country);
  const cCity    = norm(c.location?.city);
  const cState   = norm(c.location?.state);
  const cCountry = norm(c.location?.country);

  if (uCity    && cCity    && uCity    === cCity)    return 20; // same city
  if (uState   && cState   && uState   === cState)   return 12; // same state
  if (uCountry && cCountry && uCountry === cCountry) return 6;  // same country

  // Reach bonus for globally / nationally operating businesses
  const reach = (c.location?.operatesIn || "").toLowerCase();
  if (reach === "global")   return 15;
  if (reach === "national") return 10;
  return 0;
}

/** Human-readable match reasons */
function buildReasons(
  semanticPts: number,
  bm25Pts: number,
  locationPts: number,
  c: any
): string[] {
  const reasons: string[] = [];
  if (semanticPts > 0) {
    const theyNeed = (c.needs    || []).slice(0, 2).join(", ");
    const theyOffer= (c.offerings|| []).slice(0, 3).join(", ");
    if (theyOffer) reasons.push(`They offer: ${theyOffer}`);
    if (theyNeed)  reasons.push(`They need: ${theyNeed}`);
  }
  if (bm25Pts > 5) reasons.push("🔑 Strong keyword match");
  if (locationPts >= 20)      reasons.push(`📍 Same city — ${c.location?.city}`);
  else if (locationPts >= 12) reasons.push(`📍 Same state — ${c.location?.state}`);
  else if (locationPts >= 15) reasons.push(`🌍 Operates ${c.location?.operatesIn}`);
  else if (locationPts >= 6)  reasons.push(`📍 Same country — ${c.location?.country}`);
  return reasons;
}

// ─── POST — run hybrid match engine ──────────────────────────────────────────
export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;

    // 1. Load User A's business profile
    const userBiz = await Business.findOne({ ownerId: userId }).lean() as any;
    if (!userBiz) {
      return NextResponse.json(
        { msg: "Business profile not found. Please complete your profile first." },
        { status: 404 }
      );
    }

    const needsText = [
      ...(userBiz.needs || []),
      userBiz.intent?.currentGoal || "",
    ].filter(Boolean).join(", ");

    // Clean noise terms BEFORE embedding — prevents B2B/D2C etc. from
    // creating false cross-niche matches via semantic similarity
    const cleanNeedsText = denoiseText(needsText);
    if (!cleanNeedsText.trim()) {
      return NextResponse.json(
        { msg: "Please add specific needs to your profile to get matches.", count: 0, matches: [] },
        { status: 200 }
      );
    }

    // 2. Generate Gemini embedding for User A's NEEDS (1 API call)
    let needsEmbedding: number[] = [];
    try {
      needsEmbedding = await generateEmbedding(cleanNeedsText);
    } catch (embErr: any) {
      console.error("[MATCH] Gemini embedding failed, falling back to BM25 only:", embErr.message);
    }

    // 3. Fetch all OTHER businesses + their owner data
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
      return NextResponse.json({ count: 0, matches: [] });
    }

    // 4. Fetch all candidates' pre-stored OFFERINGS embeddings in ONE query
    const candidateOwnerIds = candidates.map((c: any) => c.ownerId);
    const offeringDocs = await Offering.find({ userId: { $in: candidateOwnerIds } }).lean() as any[];
    // Map userId → embedding for fast lookup
    const embeddingMap = new Map<string, number[]>();
    for (const od of offeringDocs) {
      if (od.embedding?.length > 0) {
        embeddingMap.set(od.userId.toString(), od.embedding);
      }
    }

    // 5. Build BM25 corpus (keyword tie-breaker, and fallback for missing embeddings)
    // Apply denoiseText to strip B2B/D2C/SaaS noise from both sides
    const myNeedTokens  = tokenize(denoiseText(needsText));
    const offeringCorpus = candidates.map((c: any) => {
      const parts = [
        ...(c.offerings  || []),
        c.industry       || "",
        c.subIndustry    || "",
        c.ownerData?.businessDescription || "",
      ];
      return tokenize(denoiseText(parts.join(" ")));
    });

    const rawBm25   = bm25Score(myNeedTokens, offeringCorpus);
    const normBm25  = normalizeBM25(rawBm25);

    // 6. Score every candidate
    const scored: any[] = [];
    let semanticUsed = 0;
    let bm25Fallback = 0;

    for (let i = 0; i < candidates.length; i++) {
      const c     = candidates[i];
      const owner = c.ownerData;
      const cId   = (c.ownerId || "").toString();

      // ── Semantic score (0–70) ─────────────────────────────────────────────
      let semanticPts = 0;
      const offeringEmb = embeddingMap.get(cId);
      if (needsEmbedding.length > 0 && offeringEmb && offeringEmb.length > 0) {
        const sim = cosineSimilarity(needsEmbedding, offeringEmb);
        // Cosine similarity is 0–1; map to 0–70
        // Threshold: similarity < 0.3 is too weak, treat as 0
        semanticPts = sim >= 0.3 ? Math.round(sim * MAX_SEMANTIC) : 0;
        semanticUsed++;
      }

      // ── BM25 keyword score (0–10) ─────────────────────────────────────────
      const bm25Pts = Math.round(normBm25[i] * MAX_BM25);

      // Skip if both signals are zero (completely irrelevant)
      if (semanticPts === 0 && bm25Pts < 2) continue;

      // If no embedding available but BM25 is non-zero, use BM25 as proxy
      if (semanticPts === 0 && bm25Pts > 0) bm25Fallback++;

      // ── Location (0–20) ───────────────────────────────────────────────────
      const locationPts = locationScore(userBiz, c);

      // ── Final Score ───────────────────────────────────────────────────────
      const totalScore = semanticPts + bm25Pts + locationPts;

      const breakdown = {
        semantic: semanticPts,
        keywordBoost: bm25Pts,
        location: locationPts,
      };

      const reasons = buildReasons(semanticPts, bm25Pts, locationPts, c);

      scored.push({
        matchedUserId: c.ownerId,
        candidateName: owner?.name || c.ownerName || "Unknown",
        companyName: c.companyName || c.brandName || "",
        industry: c.industry || "",
        location: c.location?.city
          ? `${c.location.city}${c.location.state ? ", " + c.location.state : ""}`
          : c.location?.country || "Unknown",
        offerings: c.offerings || [],
        needs: c.needs || [],
        goal: c.intent?.currentGoal || "",
        verified: owner?.verified ?? false,
        verificationStatus: c.trust?.verificationStatus || "Not Verified",
        subscriptionPlan: owner?.subscriptionPlan || "FREE",
        score: totalScore,
        scoreBreakdown: breakdown,
        reasons,
      });
    }

    // 7. Sort descending, take top 20
    scored.sort((a, b) => b.score - a.score);
    const top20 = scored.slice(0, 20);

    // 8. Persist results
    await MatchRecord.deleteMany({ userId });
    if (top20.length > 0) {
      await MatchRecord.insertMany(
        top20.map((item) => ({
          userId,
          matchedUserId: item.matchedUserId,
          score: item.score,
          reasons: item.reasons,
          scoreBreakdown: item.scoreBreakdown,
        }))
      );
    }

    console.log(`[MATCH] userId=${userId} | candidates=${candidates.length} | semantic=${semanticUsed} | bm25Fallback=${bm25Fallback} | results=${top20.length}`);

    return NextResponse.json({
      count: top20.length,
      matches: top20,
      meta: {
        algorithm: "Hybrid-Gemini-BM25-v1",
        signals: ["semantic (Gemini cosine)", "keywordBoost (BM25)", "location"],
        semanticCoverage: `${semanticUsed}/${candidates.length} candidates had embedding`,
        maxScore: MAX_SEMANTIC + MAX_BM25 + MAX_LOCATION,
      },
    });

  } catch (err: any) {
    console.error("Match engine error:", err);
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}

// ─── GET — return cached match results ───────────────────────────────────────
export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;
    const data = await MatchRecord.find({ userId })
      .sort({ score: -1 })
      .lean();
    return NextResponse.json({ count: data.length, matches: data });
  } catch (err: any) {
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}
