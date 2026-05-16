import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import Intent from "@/models/Intent";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function generateEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}



export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, text } = await req.json();

    if (!userId || !text) {
      return NextResponse.json({ msg: "userId and text are required" }, { status: 400 });
    }

    const embedding = await generateEmbedding(text);

    await Intent.findOneAndUpdate(
      { userId },
      { text, embedding },
      { upsert: true, new: true }
    );

    return NextResponse.json({ msg: "Intent saved successfully" });
  } catch (err: any) {
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}
