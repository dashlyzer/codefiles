import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory store for broadcast notifications (replace with DB model in production)
let notifications: any[] = [];

export async function GET() {
  return NextResponse.json({ notifications: notifications.slice().reverse() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, audience, adminName } = body;

    if (!title || !message) {
      return NextResponse.json({ msg: "title and message required" }, { status: 400 });
    }

    const notification = {
      id: Date.now().toString(),
      title,
      message,
      audience: audience || "All",
      adminName: adminName || "Admin",
      sentAt: new Date().toISOString(),
      status: "Sent",
    };

    notifications.push(notification);

    // Keep only last 50
    if (notifications.length > 50) {
      notifications = notifications.slice(-50);
    }

    return NextResponse.json({ msg: "Notification broadcast", notification });
  } catch (err: any) {
    console.error("Notifications error:", err);
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}
