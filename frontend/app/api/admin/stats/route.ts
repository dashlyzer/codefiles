import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Business from "@/models/Business";
import IntroRequest from "@/models/IntroRequest";
import Meeting from "@/models/Meeting";
import Rating from "@/models/Rating";
import MatchRecord from "@/models/MatchRecord";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // ── User Stats ─────────────────────────────────────────────────────────
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      newToday,
      verifiedUsers,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ status: "ACTIVE" }),
      User.countDocuments({ status: "SUSPENDED" }),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ verified: true }),
    ]);

    // ── Business Stats ─────────────────────────────────────────────────────
    const [
      totalBusinesses,
      pendingVerification,
      verifiedBusinesses,
      flaggedUsers,
    ] = await Promise.all([
      Business.countDocuments({}),
      Business.countDocuments({ "trust.verificationStatus": "Not Verified" }),
      Business.countDocuments({ "trust.verificationStatus": "Business Verified" }),
      User.countDocuments({ flaggedAt: { $ne: null } }),
    ]);

    // ── Activity Stats ─────────────────────────────────────────────────────
    const [
      totalRequests,
      acceptedRequests,
      pendingRequests,
      matchesToday,
      meetingsScheduled,
      meetingsCompleted,
      meetingsCancelled,
    ] = await Promise.all([
      IntroRequest.countDocuments({}),
      IntroRequest.countDocuments({ status: "accepted" }),
      IntroRequest.countDocuments({ status: "pending" }),
      MatchRecord.countDocuments({ createdAt: { $gte: todayStart } }),
      Meeting.countDocuments({ status: "SCHEDULED" }),
      Meeting.countDocuments({ status: "COMPLETED" }),
      Meeting.countDocuments({ status: "CANCELLED" }),
    ]);

    // ── Trust & Safety ─────────────────────────────────────────────────────
    const [
      totalRatings,
      lowRatedCount,
    ] = await Promise.all([
      Rating.countDocuments({}),
      Rating.countDocuments({ rating: { $lte: 2 } }),
    ]);

    // ── Funnel Conversion ─────────────────────────────────────────────────
    // Signup → Profile: how many users have completed their profile
    const profileComplete = await Business.countDocuments({ isProfileCompleted: true });
    const signupToProfile = totalUsers > 0
      ? Math.round((profileComplete / totalUsers) * 100)
      : 0;

    // Profile → Request: how many profile-complete users sent a request
    const requestToMeeting = totalRequests > 0
      ? Math.round((meetingsScheduled / totalRequests) * 100)
      : 0;

    const acceptanceRate = totalRequests > 0
      ? Math.round((acceptedRequests / totalRequests) * 100)
      : 0;

    const meetingCompletionRate =
      meetingsScheduled + meetingsCancelled > 0
        ? Math.round((meetingsCompleted / (meetingsScheduled + meetingsCancelled + meetingsCompleted)) * 100)
        : 0;

    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        newToday,
        verified: verifiedUsers,
        flagged: flaggedUsers,
      },
      businesses: {
        total: totalBusinesses,
        pendingVerification,
        verified: verifiedBusinesses,
        profileComplete,
      },
      activity: {
        matchesToday,
        requestsSent: totalRequests,
        requestsAccepted: acceptedRequests,
        requestsPending: pendingRequests,
        meetingsScheduled,
        meetingsCompleted,
        meetingsCancelled,
      },
      trust: {
        pendingVerification,
        flagged: flaggedUsers,
        lowRated: lowRatedCount,
        totalRatings,
      },
      funnel: {
        signupToProfile,
        acceptanceRate,
        requestToMeeting,
        meetingCompletionRate,
      },
    });
  } catch (err: any) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { msg: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}
