import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Business from "@/models/Business";
import MatchRecord from "@/models/MatchRecord";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    const { userId } = await params;

    const userBusiness = await Business.findOne({ ownerId: userId });
    if (!userBusiness) {
      return NextResponse.json({ msg: "Business profile not found for user." }, { status: 404 });
    }

    const userOfferings = userBusiness.offerings.map((o: string) => o.toLowerCase().trim());
    const userNeeds = userBusiness.needs.map((n: string) => n.toLowerCase().trim());

    // Fetch all other business profiles
    const otherBusinesses = await Business.find({ ownerId: { $ne: userId } });

    const results = [];

    for (const other of otherBusinesses) {
      const otherOfferings = other.offerings.map((o: string) => o.toLowerCase().trim());
      const otherNeeds = other.needs.map((n: string) => n.toLowerCase().trim());

      let overlapScore = 0;
      const reasons = [];

      // Check if my offerings intersect their needs
      const matchingMyOfferings = userOfferings.filter((o: string) => otherNeeds.includes(o));
      if (matchingMyOfferings.length > 0) {
        overlapScore += matchingMyOfferings.length;
        reasons.push(`They need: ${matchingMyOfferings.join(', ')}`);
      }

      // Check if my needs intersect their offerings
      const matchingMyNeeds = userNeeds.filter((n: string) => otherOfferings.includes(n));
      if (matchingMyNeeds.length > 0) {
        overlapScore += matchingMyNeeds.length;
        reasons.push(`They offer: ${matchingMyNeeds.join(', ')}`);
      }

      if (overlapScore > 0) {
        // Fetch User to get Name and verified status
        const candidateUser = await User.findById(other.ownerId);

        results.push({
          matchedUserId: other.ownerId,
          candidateName: candidateUser?.name || other.ownerName || "Unknown",
          companyName: other.companyName || "",
          industry: other.industry || "",
          location: other.location?.city ? `${other.location.city}, ${other.location.country}` : "Unknown Location",
          offerings: other.offerings,
          needs: other.needs,
          goal: other.intent?.currentGoal || "",
          score: overlapScore,
          reasons,
          verified: candidateUser?.verified || other.trust?.verificationStatus === "Business Verified",
        });
      }
    }

    // Sort descending by highest overlap
    results.sort((a, b) => b.score - a.score);
    const top20 = results.slice(0, 20);

    // Persist top matches
    await MatchRecord.deleteMany({ userId });
    await MatchRecord.insertMany(
      top20.map((item) => ({
        userId,
        matchedUserId: item.matchedUserId,
        score: item.score,
        reasons: item.reasons,
      }))
    );

    return NextResponse.json({ count: top20.length, matches: top20 });

  } catch (err: any) {
    console.error("Match engine error:", err);
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    await dbConnect();
    const data = await MatchRecord.find({ userId: params.userId }).sort({ score: -1 });
    return NextResponse.json({ count: data.length, matches: data });
  } catch (err: any) {
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}
