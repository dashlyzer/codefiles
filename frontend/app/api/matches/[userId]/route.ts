import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Business from "@/models/Business";
import MatchRecord from "@/models/MatchRecord";
import Rating from "@/models/Rating";
import { tokenize, bm25Score, normalizeBM25 } from "@/lib/bm25";

export const dynamic = "force-dynamic";

// ─── Scoring constants ────────────────────────────────────────────────────────
const MAX_INTENT = 50;
const MAX_LOCATION = 15;
const MAX_VERIFICATION = 15;
const MAX_REPUTATION = 10;
const MAX_PROFILE = 5;
const MAX_PLAN = 5;
// Total max = 100

// ─── Helpers ──────────────────────────────────────────────────────────────────

function verificationScore(status: string | undefined): number {
  switch (status) {
    case "Trusted Partner": return 20;
    case "Business Verified": return 16;
    case "Basic Verified": return 10;
    default: return 0;
  }
}

function locationScore(
  userBiz: any,
  candidateBiz: any
): number {
  // Geo proximity (compare normalised lowercase strings)
  const normalise = (s?: string) => (s || "").toLowerCase().trim();

  const userCity = normalise(userBiz.location?.city);
  const userState = normalise(userBiz.location?.state);
  const userCountry = normalise(userBiz.location?.country);

  const cCity = normalise(candidateBiz.location?.city);
  const cState = normalise(candidateBiz.location?.state);
  const cCountry = normalise(candidateBiz.location?.country);

  let geoScore = 0;
  if (userCity && cCity && userCity === cCity) {
    geoScore = 20; // Same city — best geo match
  } else if (userState && cState && userState === cState) {
    geoScore = 12; // Same state
  } else if (userCountry && cCountry && userCountry === cCountry) {
    geoScore = 6;  // Same country
  }

  // Reach bonus — businesses that operate beyond their city
  const operatesIn = (candidateBiz.location?.operatesIn || "").toLowerCase();
  let reachScore = 0;
  if (operatesIn === "global") reachScore = 10;
  if (operatesIn === "national") reachScore = 8;

  // Take the higher of geo match or reach score
  return Math.min(Math.max(geoScore, reachScore), MAX_LOCATION);
}

function reputationScore(avgRating: number | null): number {
  if (avgRating === null) return 5; // Neutral for no ratings yet
  if (avgRating >= 4.5) return 10;
  if (avgRating >= 4.0) return 8;
  if (avgRating >= 3.0) return 5;
  return 2;
}

function profileScore(score: number | undefined): number {
  const s = score ?? 0;
  if (s >= 80) return 5;
  if (s >= 60) return 3;
  return 1;
}

function subscriptionScore(plan: string | undefined): number {
  switch (plan) {
    case "ENTERPRISE": return 5;
    case "PRO": return 3;
    default: return 0;
  }
}

function buildReasons(
  breakdown: Record<string, number>,
  candidateBiz: any,
  candidateUser: any,
  avgRating: number | null,
  userNeeds: string[],
  userOfferings: string[],
): string[] {
  const reasons: string[] = [];

  // Intent relevance
  if (breakdown.intentRelevance > 0) {
    const theyOffer = (candidateBiz.offerings || []).slice(0, 3).join(", ");
    const theyNeed = (candidateBiz.needs || []).slice(0, 3).join(", ");
    if (theyOffer) reasons.push(`They offer: ${theyOffer}`);
    if (theyNeed) reasons.push(`They need: ${theyNeed}`);
  }

  // Location
  if (breakdown.location >= 20) {
    reasons.push(`📍 Same city — ${candidateBiz.location?.city}`);
  } else if (breakdown.location >= 12) {
    reasons.push(`📍 Same state — ${candidateBiz.location?.state}`);
  } else if (breakdown.location >= 10) {
    reasons.push(`🌍 Operates ${candidateBiz.location?.operatesIn}`);
  } else if (breakdown.location >= 6) {
    reasons.push(`📍 Same country — ${candidateBiz.location?.country}`);
  }

  // Verification
  const vs = candidateBiz.trust?.verificationStatus;
  if (vs && vs !== "Not Verified") reasons.push(`✅ ${vs}`);

  // Reputation
  if (avgRating !== null) {
    reasons.push(`⭐ ${avgRating.toFixed(1)} avg rating`);
  }

  return reasons;
}

// ─── POST — run match engine for a user ──────────────────────────────────────
export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;

    // 1. Load requester's business profile
    const userBiz = await Business.findOne({ ownerId: userId }).lean() as any;
    if (!userBiz) {
      return NextResponse.json(
        { msg: "Business profile not found. Please complete your profile first." },
        { status: 404 }
      );
    }

    // 2. Fetch all OTHER businesses + their owners in one aggregation
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
      // Only active users
      { $match: { "ownerData.status": { $ne: "SUSPENDED" } } },
    ]);

    if (candidates.length === 0) {
      return NextResponse.json({ count: 0, matches: [] });
    }

    // 3. Batch-fetch all ratings for all candidate users in ONE query
    const candidateUserIds = candidates.map((c: any) => c.ownerId);
    const ratingsAgg: any[] = await Rating.aggregate([
      { $match: { toUserId: { $in: candidateUserIds } } },
      {
        $group: {
          _id: "$toUserId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);
    const ratingMap = new Map<string, { avg: number; count: number }>();
    for (const r of ratingsAgg) {
      ratingMap.set(r._id.toString(), { avg: r.avgRating, count: r.count });
    }

    // 4. Build BM25 corpora
    // Corpus A: each candidate's OFFERINGS + goal text (to match against user's NEEDS)
    // Removed businessDescription to reduce noise (prevents hardware matching marketing if mentioned in desc)
    const offeringCorpus = candidates.map((c: any) => {
      const text = [
        ...(c.offerings || []),
        c.intent?.currentGoal || "",
      ].join(" ");
      return tokenize(text);
    });

    // Corpus B: each candidate's NEEDS text (to match against user's OFFERINGS)
    const needsCorpus = candidates.map((c: any) => {
      const text = [...(c.needs || [])].join(" ");
      return tokenize(text);
    });

    // User's query tokens
    const userNeedsTokens = tokenize([...(userBiz.needs || []), userBiz.intent?.currentGoal || ""].join(" "));
    const userOfferingTokens = tokenize([...(userBiz.offerings || [])].join(" "));

    // BM25 scores — bidirectional
    const bm25NeedsVsOfferings = bm25Score(userNeedsTokens, offeringCorpus);    // how well candidates serve MY needs
    const bm25OfferingsVsNeeds = bm25Score(userOfferingTokens, needsCorpus);    // how well I serve their needs

    // Normalise each direction independently
    const normNeedsVsOff = normalizeBM25(bm25NeedsVsOfferings);
    const normOffVsNeeds = normalizeBM25(bm25OfferingsVsNeeds);

    // 5. Score every candidate
    const scored: any[] = [];

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i];
      const owner = c.ownerData;

      // ── Intent Relevance (0–50) ───────────────────────────────────────────
      // Weighted average: 70% "Can they help me?", 30% "Can I help them?"
      const weightedIntent = (normNeedsVsOff[i] * 0.7) + (normOffVsNeeds[i] * 0.3);
      const intentPts = Math.round(weightedIntent * MAX_INTENT);

      // Skip completely irrelevant candidates
      if (intentPts < 2) continue;

      // ── Location (0–20) ───────────────────────────────────────────────────
      const locationPts = locationScore(userBiz, c);

      // ── Verification (0–20) ───────────────────────────────────────────────
      const verifyPts = verificationScore(c.trust?.verificationStatus);

      // ── Reputation (0–10) ─────────────────────────────────────────────────
      const ratingData = ratingMap.get((c.ownerId || "").toString()) ?? null;
      const avgRating = ratingData ? ratingData.avg : null;
      const reputationPts = reputationScore(avgRating);

      // ── Profile Quality (0–5) ─────────────────────────────────────────────
      const profilePts = profileScore(owner?.profileCompletenessScore);

      // ── Subscription Bonus (0–5) ──────────────────────────────────────────
      const planPts = subscriptionScore(owner?.subscriptionPlan);

      // ── Final Score ───────────────────────────────────────────────────────
      const totalScore =
        intentPts + locationPts + verifyPts + reputationPts + profilePts + planPts;

      const breakdown = {
        intentRelevance: intentPts,
        location: locationPts,
        verification: verifyPts,
        reputation: reputationPts,
        profileQuality: profilePts,
        subscriptionBonus: planPts,
      };

      const reasons = buildReasons(
        breakdown,
        c,
        owner,
        avgRating,
        userBiz.needs || [],
        userBiz.offerings || [],
      );

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
        avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null,
        ratingCount: ratingData?.count ?? 0,
        profileScore: owner?.profileCompletenessScore ?? 0,
        subscriptionPlan: owner?.subscriptionPlan || "FREE",
        score: totalScore,
        scoreBreakdown: breakdown,
        reasons,
      });
    }

    // 6. Sort descending by score, take top 20
    scored.sort((a, b) => b.score - a.score);
    const top20 = scored.slice(0, 20);

    // 7. Persist to MatchRecord (replace previous run)
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

    return NextResponse.json({
      count: top20.length,
      matches: top20,
      meta: {
        algorithm: "BM25-Hybrid-v1",
        signals: ["intentRelevance", "location", "verification", "reputation", "profileQuality", "subscriptionBonus"],
        maxScore: MAX_INTENT + MAX_LOCATION + MAX_VERIFICATION + MAX_REPUTATION + MAX_PROFILE + MAX_PLAN,
      },
    });

  } catch (err: any) {
    console.error("Match engine error:", err);
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}

// ─── GET — fetch cached match results for a user ─────────────────────────────
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
