import mongoose, { Schema } from "mongoose";

// Banner/Content model — manages dynamic platform content stored in MongoDB.
// Phase 1: homepage banners, announcements, featured businesses only.
// DO NOT extend into full CMS.

const BannerSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["banner", "announcement", "featured_business"],
      required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    ctaText: { type: String, default: "" },
    ctaLink: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    // For featured_business type
    businessId: { type: Schema.Types.ObjectId, ref: "Business", default: null },
    businessName: { type: String, default: "" },
    // Display ordering
    order: { type: Number, default: 0 },
    // Optional date range for time-limited announcements
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    // Who created it
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

BannerSchema.index({ type: 1, isActive: 1, order: 1 });

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
export default Banner;
