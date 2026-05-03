import { NextResponse } from "next/server";
import OpenAI from "openai";
import dbConnect from "@/lib/db";
import Offering from "@/models/Offering";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateEmbedding(text: string) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, text } = await req.json();

    if (!userId || !text) {
      return NextResponse.json({ msg: "userId and text are required" }, { status: 400 });
    }

    const embedding = await generateEmbedding(text);

    await Offering.findOneAndUpdate(
      { userId },
      { text, embedding },
      { upsert: true, new: true }
    );

    return NextResponse.json({ msg: "Offering saved successfully" });
  } catch (err: any) {
    return NextResponse.json({ msg: "Server Error", error: err.message }, { status: 500 });
  }
}
