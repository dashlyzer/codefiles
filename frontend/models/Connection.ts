import mongoose, { Schema } from "mongoose";

const ConnectionSchema = new Schema(
  {
    token: { type: String, required: true, unique: true },
    userA: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userB: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userABizName: { type: String, default: "" },
    userBBizName: { type: String, default: "" },
    dealType: { type: String, default: "" },
    requestId: { type: Schema.Types.ObjectId, ref: "IntroRequest", required: true },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    meetingIds: [{ type: Schema.Types.ObjectId, ref: "Meeting" }],
  },
  { timestamps: true }
);

const Connection = mongoose.models.Connection || mongoose.model("Connection", ConnectionSchema);

export default Connection;
