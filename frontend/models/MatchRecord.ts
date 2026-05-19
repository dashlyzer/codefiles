import mongoose, { Schema, model, models } from "mongoose";

const MatchRecordSchema = new Schema({
  userId:        { type: Schema.Types.ObjectId, ref: "User", required: true },
  matchedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  score:         { type: Number, required: true },
  reasons:       { type: [String], default: [] },

  // ── Denormalized Profile Data (for instant cache reads) ───────────────
  candidateName: { type: String, default: "" },
  companyName:   { type: String, default: "" },
  industry:      { type: String, default: "" },
  location:      { type: String, default: "" },
  offerings:     { type: [String], default: [] },
  needs:         { type: [String], default: [] },
  goal:          { type: String, default: "" },
  verified:      { type: Boolean, default: false },

  // ── Per-Signal Score Breakdown ─────────────────────────────────────────────
  // Weighted scoring signals from the Stable Hybrid Engine.
  scoreBreakdown: {
    intentMatch:      { type: Number, default: 0 }, // 0–35  directional needs↔offerings
    semantic:         { type: Number, default: 0 }, // 0–15  BM25-style keyword similarity
    location:         { type: Number, default: 0 }, // 0–15  city/state/country proximity
    businessFit:      { type: Number, default: 0 }, // 0–10  industry fit (non-competitor)
    intentQuality:    { type: Number, default: 0 }, // 0–10  profile completeness + freshness
    activity:         { type: Number, default: 0 }, // 0–10  recency of last active
    verification:     { type: Number, default: 0 }, // 0–5   trust badge
    aiBoost:          { type: Number, default: 0 }, // 0–30  optional Gemini rerank bonus
  },

  // ── Cache Metadata ────────────────────────────────────────────────────────
  // Used to detect stale caches and enforce 24-hour TTL.
  generatedAt:   { type: Date, default: Date.now },
  cacheVersion:  { type: Number, default: 1 },

  // ── Match Outcome Tracking ─────────────────────────────────────────────────
  // Feedback loop for match quality. Admin monitors in Analytics panel.
  outcome: {
    type: String,
    enum: ["Meeting", "Partnership", "ClientDeal", "VendorDeal", "Ignored", "NoOutcome", ""],
    default: "",
  },
  outcomeUpdatedAt: { type: Date,   default: null },
  outcomeNotes:     { type: String, default: "" },
}, { timestamps: true });

// Index for fast cache lookup by userId
MatchRecordSchema.index({ userId: 1, score: -1 });

if (models.MatchRecord) {
  delete (mongoose as any).models.MatchRecord;
}
const MatchRecord = model("MatchRecord", MatchRecordSchema);

export default MatchRecord;
