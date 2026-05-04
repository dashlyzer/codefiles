import mongoose, { Schema } from "mongoose";

const RatingSchema = new Schema(
  {
    fromUserId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUserId:     { type: Schema.Types.ObjectId, ref: "User", required: true },
    meetingId:    { type: Schema.Types.ObjectId, ref: "Meeting", default: null },
    connectionId: { type: Schema.Types.ObjectId, ref: "Connection", default: null },
    fromBizName:  { type: String, default: "" },
    toBizName:    { type: String, default: "" },
    dealType:     { type: String, default: "" },
    rating:       { type: Number, min: 1, max: 5, required: true },
    tags:         [{ type: String }],
    communication:   { type: String, enum: ["Good", "Average", "Poor", ""], default: "" },
    reliability:     { type: String, enum: ["High", "Medium", "Low", ""],   default: "" },
    dealSeriousness: { type: String, enum: ["Strong", "Weak", ""],          default: "" },
    comment:      { type: String, default: "" },
  },
  { timestamps: true }
);

// One rating per (fromUser, toUser, connection)
RatingSchema.index({ fromUserId: 1, toUserId: 1, connectionId: 1 }, { unique: true });

const Rating = mongoose.models.Rating || mongoose.model("Rating", RatingSchema);
export default Rating;
