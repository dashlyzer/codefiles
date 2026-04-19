import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  
  // Step 1: Owner Details
  designation: { type: String },
  phone: { type: String },
  linkedin: { type: String },

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
}, { timestamps: true });

if (models.User) {
  delete (mongoose as any).models.User;
}
const User = model("User", UserSchema);

export default User;
