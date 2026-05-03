import mongoose, { Schema, model, models } from "mongoose";

const IntentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
}, { timestamps: true });

if (models.Intent) {
  delete (mongoose as any).models.Intent;
}
const Intent = model("Intent", IntentSchema);

export default Intent;
