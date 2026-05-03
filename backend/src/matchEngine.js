// ===============================
// TAPLYZER MATCH ENGINE
// Node.js + MongoDB + OpenAI Embeddings
// ===============================
// npm install express mongoose dotenv openai
// ===============================

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ===============================
// MONGODB CONNECTION
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===============================
// SCHEMAS
// ===============================

const userSchema = new mongoose.Schema({
  name: String,
  industry: String,
  location: String,
  lastActive: Date,
  verified: Boolean,
});

const intentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
  embedding: [Number],
});

const offeringSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  text: String,
  embedding: [Number],
});

const matchSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  matchedUserId: mongoose.Schema.Types.ObjectId,
  score: Number,
  reasons: [String],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Intent = mongoose.model("Intent", intentSchema);
const Offering = mongoose.model("Offering", offeringSchema);
const Match = mongoose.model("Match", matchSchema);

// ===============================
// EMBEDDING FUNCTION
// ===============================
async function generateEmbedding(text) {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

// ===============================
// COSINE SIMILARITY
// ===============================
function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ===============================
// SCORE ENGINE
// Weights (must total 100):
//   relevance  45  — semantic alignment of intent vs offering
//   location   25  — same city / region
//   freshness  30  — how recently the candidate was active
// ===============================
function calculateFinalScore({ relevance, location, freshness }) {
  return relevance * 45 + location * 25 + freshness * 30;
}

// ===============================
// FRESHNESS HELPER
// ===============================
function getFreshnessScore(lastActive) {
  if (!lastActive) return 0.1;
  const days = (Date.now() - new Date(lastActive)) / (1000 * 60 * 60 * 24);
  if (days <= 3) return 1.0;
  if (days <= 7) return 0.75;
  if (days <= 30) return 0.4;
  return 0.1;
}

// ===============================
// MATCH API
// POST /generate-matches/:userId
// ===============================
app.post("/generate-matches/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const intent = await Intent.findOne({ userId });
    if (!intent) return res.status(404).json({ msg: "No intent found. Add an intent first." });

    // All offerings from OTHER users
    const candidates = await Offering.find({ userId: { $ne: userId } });

    if (candidates.length === 0) {
      return res.json({ msg: "No candidates found", matches: [] });
    }

    // Score every candidate
    const results = [];

    for (const candidate of candidates) {
      const candidateUser = await User.findById(candidate.userId);
      if (!candidateUser) continue;

      // 1. Semantic Relevance (intent ↔ offering)
      const relevance = cosineSimilarity(intent.embedding, candidate.embedding);

      // 2. Location Score
      const locationScore =
        user.location && candidateUser.location &&
          user.location.toLowerCase() === candidateUser.location.toLowerCase()
          ? 1.0
          : 0.3;

      // 3. Freshness
      const freshness = getFreshnessScore(candidateUser.lastActive);

      // Final weighted score
      const score = calculateFinalScore({ relevance, location: locationScore, freshness });

      // Human-readable reasons
      const reasons = [];
      if (relevance > 0.75) reasons.push("Highly relevant offering");
      if (relevance > 0.5) reasons.push("Relevant to your intent");
      if (locationScore === 1.0) reasons.push("Same city");
      if (candidateUser.verified) reasons.push("Verified business");
      if (freshness >= 0.75) reasons.push("Recently active");

      results.push({
        matchedUserId: candidate.userId,
        candidateName: candidateUser.name,
        offeringText: candidate.text,
        score: parseFloat(score.toFixed(4)),
        reasons,
      });
    }

    // Sort descending by score
    results.sort((a, b) => b.score - a.score);
    const top20 = results.slice(0, 20);

    // Persist top matches (replace previous)
    await Match.deleteMany({ userId });
    await Match.insertMany(
      top20.map((item) => ({
        userId,
        matchedUserId: item.matchedUserId,
        score: item.score,
        reasons: item.reasons,
      }))
    );

    return res.json({ count: top20.length, matches: top20 });

  } catch (err) {
    console.error("Match engine error:", err);
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// ===============================
// GET SAVED MATCHES
// GET /matches/:userId
// ===============================
app.get("/matches/:userId", async (req, res) => {
  try {
    const data = await Match.find({ userId: req.params.userId }).sort({ score: -1 });
    return res.json({ count: data.length, matches: data });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// ===============================
// SAVE / UPDATE INTENT
// POST /intent/:userId   { "text": "Need 3 distributors in Bangalore" }
// ===============================
app.post("/intent/:userId", async (req, res) => {
  try {
    if (!req.body.text) return res.status(400).json({ msg: "text field is required" });

    const embedding = await generateEmbedding(req.body.text);

    await Intent.findOneAndUpdate(
      { userId: req.params.userId },
      { text: req.body.text, embedding },
      { upsert: true, new: true }
    );

    return res.json({ msg: "Intent saved" });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// ===============================
// SAVE / UPDATE OFFERING
// POST /offering/:userId  { "text": "We provide OEM supply and bulk manufacturing" }
// ===============================
app.post("/offering/:userId", async (req, res) => {
  try {
    if (!req.body.text) return res.status(400).json({ msg: "text field is required" });

    const embedding = await generateEmbedding(req.body.text);

    await Offering.findOneAndUpdate(
      { userId: req.params.userId },
      { text: req.body.text, embedding },
      { upsert: true, new: true }
    );

    return res.json({ msg: "Offering saved" });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error", error: err.message });
  }
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Match engine running on port ${PORT}`));
