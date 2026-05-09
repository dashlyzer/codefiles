import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },

  // Step 1: Owner Details
  designation: { type: String },
  phone: { type: String },
  linkedin: { type: String },

  // Google Calendar Auth
  googleRefreshToken: { type: String, select: false },
  googleEmail: { type: String },

  role: {
    type: String,
    enum: ["USER", "ADMIN", "SUPER_ADMIN"],
    default: "USER"
  },
  status: {
    type: String,
    enum: ["ACTIVE", "SUSPENDED"],
    default: "ACTIVE"
  },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },

  // ── Business Intent Fields ────────────────────────────────────────────────
  // Critical for semantic matching and future embeddings.
  // Do NOT leave empty — drives match quality directly.
  businessDescription: { type: String, default: "" },

  // What the business is actively seeking right now
  activelyLookingFor: {
    type: String,
    enum: ["Clients", "Partners", "Investors", "Vendors", "Distribution", ""],
    default: ""
  },

  // Freshness signal — stale intent = low quality match
  intentLastUpdated: { type: Date, default: null },

  // ── Profile Quality ───────────────────────────────────────────────────────
  // 0-100 score. Calculated on each profile save.
  // Breakdown: offerings(15) + needs(15) + goal(15) + description(15) +
  //            website(10) + linkedin(10) + verification(20)
  profileCompletenessScore: { type: Number, default: 0, min: 0, max: 100 },

  // ── Admin Management Fields ───────────────────────────────────────────────
  flaggedAt: { type: Date, default: null },
  flagReason: { type: String, default: "" },
  adminNotes: { type: String, default: "" },

  // ── Monetization ──────────────────────────────────────────────────────────
  subscriptionPlan: {
    type: String,
    enum: ["FREE", "PRO", "ENTERPRISE"],
    default: "FREE"
  },
}, { timestamps: true });

if (models.User) {
  delete (mongoose as any).models.User;
}
const User = model("User", UserSchema);

export default User;
