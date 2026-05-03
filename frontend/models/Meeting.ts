import mongoose, { Schema } from "mongoose";

const MeetingSchema = new Schema(
  {
    connectionId: {
      type: Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },
    organizerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    googleEventId: {
      type: String,
      required: true,
    },
    meetLink: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "CANCELLED", "COMPLETED"],
      default: "SCHEDULED",
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);

export default Meeting;
