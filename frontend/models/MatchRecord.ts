import mongoose, { Schema, model, models } from "mongoose";

const MatchRecordSchema = new Schema({
  userId:        { type: Schema.Types.ObjectId, ref: "User", required: true },
  matchedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  score:         { type: Number, required: true },
  reasons:       { type: [String], default: [] },

  // ── Per-Signal Score Breakdown ─────────────────────────────────────────────
  // Populated by the enhanced match engine (Phase 1+).
  // Used for admin analytics and "why this match" UI explanations.
  scoreBreakdown: {
    intentRelevance:  { type: Number, default: 0 }, // 0–40  BM25 keyword match
    location:         { type: Number, default: 0 }, // 0–20  city/state/country proximity
    verification:     { type: Number, default: 0 }, // 0–20  trust tier
    reputation:       { type: Number, default: 0 }, // 0–10  avg rating
    profileQuality:   { type: Number, default: 0 }, // 0–5   profile completeness
    subscriptionBonus:{ type: Number, default: 0 }, // 0–5   plan tier
  },

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

if (models.MatchRecord) {
  delete (mongoose as any).models.MatchRecord;
}
const MatchRecord = model("MatchRecord", MatchRecordSchema);

export default MatchRecord;
