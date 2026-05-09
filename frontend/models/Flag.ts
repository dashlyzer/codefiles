import mongoose, { Schema } from "mongoose";

// User-submitted abuse reports against other businesses/users.
// Resolved by admin in the "Reports & Flags" section.
// Serious flags (Fraudulent Activity) should trigger immediate suspension review.

const FlagSchema = new Schema(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Fake Business",
        "Spam",
        "Abusive Behavior",
        "Fraudulent Activity",
        "Misleading Information",
        "Other",
      ],
      required: true,
    },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Open", "Under Review", "Resolved", "Dismissed"],
      default: "Open",
    },
    adminNotes: { type: String, default: "" },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Prevent the same user from filing duplicate reports against the same person
FlagSchema.index({ reporterId: 1, reportedUserId: 1, type: 1 });
FlagSchema.index({ status: 1, createdAt: -1 });

const Flag = mongoose.models.Flag || mongoose.model("Flag", FlagSchema);

export default Flag;
