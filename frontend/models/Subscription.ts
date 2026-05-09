import mongoose, { Schema } from "mongoose";

// Tracks active and past subscriptions for users.
// While actual payments are deferred, this model acts as the source of truth
// for what features a user has access to.

const SubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Assuming one active subscription doc per user for now
    },
    plan: {
      type: String,
      enum: ["FREE", "PRO", "ENTERPRISE"],
      default: "FREE",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "PAST_DUE", "TRIAL"],
      default: "ACTIVE",
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null }, // Null means active recurring or lifetime

    // ── Future Payment Gateway Integration (Phase 4+) ──
    razorpaySubscriptionId: { type: String, default: "" },
    razorpayCustomerId: { type: String, default: "" },
    lastPaymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for fast status checking
SubscriptionSchema.index({ status: 1, endDate: 1 });

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
