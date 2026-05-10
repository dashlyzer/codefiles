import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import AdminLog from "@/models/AdminLog";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const role = searchParams.get("role") || "";
    const sort = searchParams.get("sort") || "-createdAt";

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "business.company": { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;
    if (role) query.role = role;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password -__v")
        .lean(),
      User.countDocuments(query),
    ]);

    // Stat breakdown
    const [totalCount, activeCount, suspendedCount, newToday] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "ACTIVE" }),
      User.countDocuments({ status: "SUSPENDED" }),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 86400000) } }),
    ]);

    return NextResponse.json({
      users,
      total,
      pages: Math.ceil(total / limit),
      stats: { total: totalCount, active: activeCount, suspended: suspendedCount, newToday },
    });
  } catch (err) {
    console.error("Users GET error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, action, adminId, reason } = await req.json();

    const actionMap: Record<string, { update: any; logAction: string; notes: string }> = {
      suspend: { update: { status: "SUSPENDED", isFlagged: true }, logAction: "USER_SUSPENDED", notes: reason || "Suspended by admin" },
      unsuspend: { update: { status: "ACTIVE", isFlagged: false }, logAction: "USER_ACTIVATED", notes: "Account reactivated" },
      verify: { update: { verified: true }, logAction: "USER_VERIFIED", notes: "Business verified by admin" },
      ban: { update: { status: "BANNED" }, logAction: "USER_BANNED", notes: reason || "Banned by admin" },
    };

    const op = actionMap[action];
    if (!op) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    await User.findByIdAndUpdate(userId, op.update);
    if (adminId) {
      await AdminLog.create({ adminId, action: op.logAction, targetType: "User", targetId: userId, notes: op.notes });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Users PATCH error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
