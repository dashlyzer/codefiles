import mongoose, { Schema } from "mongoose";

// Full audit trail of every admin action taken on the platform.
// Every approval, rejection, suspension, flag, and delete is recorded here.
// Critical for accountability — you need to know who did what and when.

const AdminLogSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      // Examples: "USER_SUSPENDED", "BUSINESS_APPROVED", "BUSINESS_REJECTED",
      // "USER_FLAGGED", "USER_DELETED", "REVIEW_REMOVED", "FLAG_RESOLVED"
    },
    targetId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    targetType: {
      type: String,
      enum: ["User", "Business", "Meeting", "Request", "Rating", "Flag", ""],
      default: "",
    },
    // Human-readable context for what was done and why
    notes: { type: String, default: "" },
    // Snapshot of data before action (for reversibility in v2)
    previousState: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

AdminLogSchema.index({ adminId: 1, createdAt: -1 });
AdminLogSchema.index({ targetId: 1, targetType: 1 });

const AdminLog =
  mongoose.models.AdminLog || mongoose.model("AdminLog", AdminLogSchema);

export default AdminLog;
