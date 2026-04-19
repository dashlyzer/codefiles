import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}).sort({ joinedAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("API Error (GET USERS):", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
