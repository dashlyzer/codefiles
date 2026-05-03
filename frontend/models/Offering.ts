import mongoose, { Schema, model, models } from "mongoose";

const OfferingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
}, { timestamps: true });

if (models.Offering) {
  delete (mongoose as any).models.Offering;
}
const Offering = model("Offering", OfferingSchema);

export default Offering;
