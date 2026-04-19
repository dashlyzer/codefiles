import mongoose, { Schema, model, models } from "mongoose";

const BusinessSchema = new Schema({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  ownerName: { type: String },

  // Step 2: Business Identity
  companyName: { type: String, default: "" },
  brandName: { type: String },
  industry: { type: String, default: "" },
  subIndustry: { type: String },
  businessType: { 
    type: String, 
    enum: ["Startup", "Agency", "SME", "Enterprise", "Freelancer", "Manufacturer", "Distributor", "Consultant", "Service Provider", ""]
  },

  // Step 3: Location & Market Reach
  location: {
    country: { type: String },
    state: { type: String },
    city: { type: String },
    operatesIn: { type: String, enum: ["Local", "National", "Global", ""] }
  },

  // Step 4: Business Strength
  strength: {
    yearsInBusiness: { type: Number },
    teamSize: { type: String },
    monthlyCapacity: { type: String },
    revenueRange: { type: String }
  },

  // Step 5 & 6: Offerings and Needs
  offerings: [{ type: String }],
  needs: [{ type: String }],

  // Step 7: Current Intent (Live Goal)
  intent: {
    currentGoal: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High", "Immediate", ""] },
    budget: { type: String },
    timeline: { type: String }
  },

  // Step 8: Trust & Verification
  trust: {
    website: { type: String },
    linkedin: { type: String },
    gst: { type: String },
    portfolio: { type: String },
    caseStudy: { type: String },
    verificationStatus: { 
      type: String, 
      enum: ["Not Verified", "Basic Verified", "Business Verified", "Trusted Partner"],
      default: "Not Verified"
    }
  },

  // Profile System
  profileScore: { type: Number, default: 0 },
  isProfileCompleted: { type: Boolean, default: false },

  // Legacy fields for backward compatibility if needed, though they shouldn't be used
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"],
    default: "PENDING"
  },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

if (models.Business) {
  delete (mongoose as any).models.Business;
}
const Business = model("Business", BusinessSchema);

export default Business;
