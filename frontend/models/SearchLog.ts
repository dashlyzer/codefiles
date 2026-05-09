import mongoose, { Schema } from "mongoose";

// Records every search query executed on the Explore page.
// This data powers the "Explore Monitoring" admin section,
// revealing market demand, trending industries, and unmet needs.
// Only log anonymous query data — never personal information.

const SearchLogSchema = new Schema(
  {
    query: { type: String, required: true, trim: true },
    resultsCount: { type: Number, default: 0 },
    // null = anonymous / logged-out visitor
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    // industry filter applied during search, if any
    industryFilter: { type: String, default: "" },
  },
  { timestamps: true }
);

// Index for fast admin analytics queries
SearchLogSchema.index({ createdAt: -1 });
SearchLogSchema.index({ query: 1, createdAt: -1 });

const SearchLog =
  mongoose.models.SearchLog || mongoose.model("SearchLog", SearchLogSchema);

export default SearchLog;
