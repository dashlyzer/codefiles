import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Business from "@/models/Business";
import User from "@/models/User";
import AdminLog from "@/models/AdminLog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const query: any = {};
    if (status) query.verificationStatus = status;
    else query.verificationStatus = { $in: ["Pending", "Under Review", "Need More Info", "Approved", "Rejected"] };
    if (search) query.$or = [
      { name: { $regex: search, $options: "i" } },
      { industry: { $regex: search, $options: "i" } },
    ];

    const [businesses, total] = await Promise.all([
      Business.find(query)
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Business.countDocuments(query),
    ]);

    const [pending, underReview, needMore, approved, rejected] = await Promise.all([
      Business.countDocuments({ verificationStatus: "Pending" }),
      Business.countDocuments({ verificationStatus: "Under Review" }),
      Business.countDocuments({ verificationStatus: "Need More Info" }),
      Business.countDocuments({ verificationStatus: "Approved" }),
      Business.countDocuments({ verificationStatus: "Rejected" }),
    ]);

    return NextResponse.json({
      businesses, total, pages: Math.ceil(total / limit),
      stats: { pending, underReview, needMore, approved, rejected },
    });
  } catch (err) {
    console.error("Verification GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { businessId, status, adminNotes, reason, adminId } = await req.json();

    const validStatuses = ["Pending", "Under Review", "Need More Info", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    await Business.findByIdAndUpdate(businessId, {
      verificationStatus: status,
      ...(adminNotes ? { adminNotes } : {}),
    });

    if (status === "Approved") {
      const biz = await Business.findById(businessId).select("userId");
      if (biz) await User.findByIdAndUpdate(biz.userId, { verified: true });
    }

    if (adminId) {
      await AdminLog.create({
        adminId, action: `BUSINESS_${status.toUpperCase().replace(/ /g, "_")}`,
        targetType: "Business", targetId: businessId,
        notes: reason || adminNotes || `Status changed to ${status}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verification PATCH error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
