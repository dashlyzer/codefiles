import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Meeting from "@/models/Meeting";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "";
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;

    const [meetings, total] = await Promise.all([
      Meeting.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("organizerId", "name email")
        .populate("attendeeId", "name email"),
      Meeting.countDocuments(query),
    ]);

    // Status breakdown stats
    const [scheduled, completed, cancelled] = await Promise.all([
      Meeting.countDocuments({ status: "SCHEDULED" }),
      Meeting.countDocuments({ status: "COMPLETED" }),
      Meeting.countDocuments({ status: "CANCELLED" }),
    ]);

    return NextResponse.json({
      meetings,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats: { scheduled, completed, cancelled, total: scheduled + completed + cancelled },
    });
  } catch (err: any) {
    console.error("Admin meetings error:", err);
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}
