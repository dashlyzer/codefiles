import mongoose, { Schema } from "mongoose";

// Support & Ticket model — user-submitted issues, tracked and resolved by admin.
// Phase 1: simple operational tracking only (no SLA, no email).

const TicketSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    userName: { type: String, default: "" },
    userEmail: { type: String, default: "" },

    category: {
      type: String,
      enum: ["Verification", "Bug", "Abuse", "Payments", "Meeting Issues", "Other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },

    // Admin-side
    adminNotes: { type: String, default: "" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

TicketSchema.index({ status: 1, createdAt: -1 });
TicketSchema.index({ category: 1, status: 1 });
TicketSchema.index({ userId: 1 });

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);
export default Ticket;
