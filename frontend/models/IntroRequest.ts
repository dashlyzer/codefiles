import mongoose, { Schema } from "mongoose";

const IntroRequestSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderBizName: { type: String, default: "" },
    receiverBizName: { type: String, default: "" },
    dealType: { type: String, required: true },
    message: { type: String, required: true },
    summary: { type: String, default: "" },
    matchScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    connectionToken: { type: String, default: null },
  },
  { timestamps: true }
);

const IntroRequest = mongoose.models.IntroRequest || mongoose.model("IntroRequest", IntroRequestSchema);

export default IntroRequest;
