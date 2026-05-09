import mongoose, { Schema, model, models } from "mongoose";

const MatchRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  matchedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
  reasons: { type: [String], default: [] },

  // ── Match Outcome Tracking ─────────────────────────────────────────────────
  // Feedback loop for match quality. Admin monitors in Analytics panel.
  // Updated when a connection leads to a meeting, deal, or is ignored.
  outcome: {
    type: String,
    enum: ["Meeting", "Partnership", "ClientDeal", "VendorDeal", "Ignored", "NoOutcome", ""],
    default: ""
  },
  outcomeUpdatedAt: { type: Date, default: null },
  outcomeNotes: { type: String, default: "" },
}, { timestamps: true });

if (models.MatchRecord) {
  delete (mongoose as any).models.MatchRecord;
}
const MatchRecord = model("MatchRecord", MatchRecordSchema);

export default MatchRecord;
