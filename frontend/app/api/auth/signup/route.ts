import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_taplyzer_jwt_key_2026";

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    
    // Validate inputs
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.errors[0].message;
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: email.toLowerCase() === "admin@taplyzer.com" ? "SUPER_ADMIN" : "USER"
    });

    console.log(`DEBUG: User created successfully: ${newUser.email}. Password stored: ${!!newUser.password}`);

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return success without password
    const userToReturn = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      verified: newUser.verified
    };

    const response = NextResponse.json(
      { message: "User created successfully", user: userToReturn },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set("taplyzer_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;

  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error during signup" }, { status: 500 });
  }
}
