import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Business from "@/models/Business";
import MatchRecord from "@/models/MatchRecord";

export const dynamic = "force-dynamic";

// ─── Gemini client ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ─── Scoring weights (max = 100) ──────────────────────────────────────────────
const MAX_AI_SCORE = 80; // Gemini 1.5 Flash LLM Judge score
const MAX_LOCATION = 20; // Geographic proximity score

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

// ─── POST — run Pure AI match engine (LLM Judge) ─────────────────────────────
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

    // 2. Fetch active candidate businesses (limit to top 30 for fast, high-quality LLM evaluation)
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
      { $limit: 30 }
    ]);

    if (candidates.length === 0) {
      return NextResponse.json({ count: 0, matches: [] });
    }

    // 3. Construct JSON prompt for Gemini 1.5 Flash
    const promptData = {
      targetBusiness: {
        companyName: userBiz.companyName || userBiz.brandName || "My Business",
        industry: userBiz.industry || "",
        offerings: userBiz.offerings || [],
        needs: userBiz.needs || [],
        goal: userBiz.intent?.currentGoal || "",
      },
      candidates: candidates.map(c => ({
        id: c.ownerId.toString(),
        companyName: c.companyName || c.brandName || "Unknown Candidate",
        industry: c.industry || "",
        offerings: c.offerings || [],
        needs: c.needs || [],
        goal: c.intent?.currentGoal || "",
        description: c.ownerData?.businessDescription || "",
      }))
    };

    const systemInstruction = `You are an expert B2B matchmaker and AI judge. Your job is to evaluate the commercial synergy between a 'targetBusiness' and a list of 'candidates'.

Evaluate bidirectional synergy:
1. Does the targetBusiness need what the candidate offers? (Target is Buyer)
2. Does the candidate need what the targetBusiness offers? (Target is Seller)

CRITICAL INSTRUCTION: To save bandwidth, ONLY return candidates that have genuine commercial synergy (aiScore >= 10). Do NOT include candidates with 0 synergy or direct competitors.

Return a JSON array of objects with this exact structure:
[
  {
    "candidateId": "string (must match candidate id precisely)",
    "aiScore": number (10 to 80, where 80 is a perfect commercial match, 40 is moderate synergy),
    "aiReason": "string (1 clear, compelling sentence explaining exactly why they match or what the synergy is)"
  }
]`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1, // Low temperature for consistent, analytical scoring
      },
      systemInstruction,
    });

    console.log(`[MATCH] Sending ${candidates.length} candidates to Gemini 1.5 Flash Judge for userId=${userId}...`);
    const startTime = Date.now();
    
    const result = await model.generateContent(JSON.stringify(promptData));
    const responseText = result.response.text();
    
    console.log(`[MATCH] Gemini response received in ${Date.now() - startTime}ms`);

    let aiEvaluations: any[] = [];
    try {
      aiEvaluations = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn("[MATCH] Standard JSON parse failed, attempting regex extraction on partial JSON...");
      // Fallback: extract all valid object blocks from partial JSON
      const matches = responseText.match(/{\s*"candidateId"[^}]+}/g);
      if (matches) {
        aiEvaluations = matches.map(m => {
          try { return JSON.parse(m); } catch (e) { return null; }
        }).filter(Boolean);
      }
      if (aiEvaluations.length === 0) {
        console.error("[MATCH] Fatal AI Parsing Error. Raw output:", responseText);
        return NextResponse.json({ msg: "AI Parsing Error", raw: responseText }, { status: 500 });
      }
    }

    // Map AI evaluations by candidateId for fast merging (support flexible ID keys from LLM)
    const evalMap = new Map<string, { aiScore: number; aiReason: string }>();
    for (const item of aiEvaluations) {
      const id = item?.candidateId || item?.id || item?.candidateID || item?.ID;
      if (id) {
        evalMap.set(id.toString(), { aiScore: Number(item.aiScore) || 0, aiReason: item.aiReason || "" });
      }
    }

    // 4. Merge AI scores with Location scores and format final results
    const scored: any[] = [];

    for (const c of candidates) {
      const owner = c.ownerData;
      const cId   = c.ownerId.toString();
      const evaluation = evalMap.get(cId) || { aiScore: 0, aiReason: "No synergy detected." };

      const aiPts = Math.min(Math.max(evaluation.aiScore, 0), MAX_AI_SCORE);
      const locationPts = locationScore(userBiz, c);
      const totalScore = aiPts + locationPts;

      // Skip candidates with virtually no synergy
      if (aiPts < 10) continue;

      const breakdown = {
        aiJudgeScore: aiPts,
        location: locationPts,
      };

      const reasons = [evaluation.aiReason];
      if (locationPts >= 20)      reasons.push(`📍 Same city — ${c.location?.city}`);
      else if (locationPts >= 12) reasons.push(`📍 Same state — ${c.location?.state}`);
      else if (locationPts >= 15) reasons.push(`🌍 Operates ${c.location?.operatesIn}`);

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

    // 5. Sort descending, take top 20
    scored.sort((a, b) => b.score - a.score);
    const top20 = scored.slice(0, 20);

    // 6. Persist results
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

    console.log(`[MATCH] userId=${userId} | candidates=${candidates.length} | topMatches=${top20.length}`);

    return NextResponse.json({
      count: top20.length,
      matches: top20,
      meta: {
        algorithm: "Pure-AI-LLM-Judge-v1",
        model: "gemini-1.5-flash",
        signals: ["aiJudge (Gemini 1.5 Flash)", "location"],
        evaluatedCandidates: candidates.length,
        maxScore: MAX_AI_SCORE + MAX_LOCATION,
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
