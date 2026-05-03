import mongoose, { Schema, model, models } from "mongoose";

const MatchRecordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  matchedUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  score: { type: Number, required: true },
  reasons: { type: [String], default: [] },
}, { timestamps: true });

if (models.MatchRecord) {
  delete (mongoose as any).models.MatchRecord;
}
const MatchRecord = model("MatchRecord", MatchRecordSchema);

export default MatchRecord;
