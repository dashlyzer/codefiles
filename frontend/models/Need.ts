import mongoose, { Schema, model, models } from "mongoose";

const NeedSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
}, { timestamps: true });

if (models.Need) {
  delete (mongoose as any).models.Need;
}
const Need = model("Need", NeedSchema);

export default Need;
