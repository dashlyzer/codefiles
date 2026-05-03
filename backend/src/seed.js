// ===============================
// SEED SCRIPT — Test Data for Match Engine
// Run: node src/seed.js
// ===============================
require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected — Seeding..."))
  .catch((err) => { console.error(err); process.exit(1); });

// ---- Schemas (must mirror matchEngine.js) ----
const User = mongoose.model("User", new mongoose.Schema({
  name: String, industry: String, location: String,
  lastActive: Date, verified: Boolean,
}));

const Intent = mongoose.model("Intent", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId, text: String, embedding: [Number],
}));

const Offering = mongoose.model("Offering", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId, text: String, embedding: [Number],
}));

const Match = mongoose.model("Match", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId, matchedUserId: mongoose.Schema.Types.ObjectId,
  score: Number, reasons: [String], createdAt: { type: Date, default: Date.now },
}));

// ---- Fake embedding (1536-dim random unit vector) ----
function fakeEmbedding(seed = 1) {
  const arr = Array.from({ length: 1536 }, (_, i) =>
    Math.sin(seed * 1000 + i) * 0.5
  );
  const mag = Math.sqrt(arr.reduce((s, v) => s + v * v, 0));
  return arr.map((v) => v / mag);
}

// Similar embedding — dot product > 0.75 with seed 1
function similarEmbedding(baseSeed = 1, noise = 0.05) {
  const base = fakeEmbedding(baseSeed);
  const noisy = base.map((v) => v + (Math.random() - 0.5) * noise);
  const mag = Math.sqrt(noisy.reduce((s, v) => s + v * v, 0));
  return noisy.map((v) => v / mag);
}

async function seed() {
  // Wipe previous test data
  await User.deleteMany({});
  await Intent.deleteMany({});
  await Offering.deleteMany({});
  await Match.deleteMany({});
  console.log("Old data cleared.");

  // ---- Users ----
  const users = await User.insertMany([
    { name: "Riya Shah", industry: "Marketing", location: "Bangalore", lastActive: new Date(), verified: true },
    { name: "Arjun Mehta", industry: "Manufacturing", location: "Bangalore", lastActive: new Date(), verified: true },
    { name: "Priya Nair", industry: "Software", location: "Mumbai", lastActive: new Date(Date.now() - 2 * 86400000), verified: false },
    { name: "Vikram Rao", industry: "Finance", location: "Bangalore", lastActive: new Date(Date.now() - 10 * 86400000), verified: true },
    { name: "Sneha Kapoor", industry: "Marketing", location: "Hyderabad", lastActive: new Date(Date.now() - 40 * 86400000), verified: false },
  ]);

  const [riya, arjun, priya, vikram, sneha] = users;
  console.log(`Created ${users.length} users.`);

  // ---- Intents (what each user is LOOKING FOR) ----
  // Riya is looking for distributors — embedding seed 1
  await Intent.insertMany([
    { userId: riya._id, text: "Looking for manufacturing distributors in Bangalore", embedding: fakeEmbedding(1) },
    { userId: arjun._id, text: "Need marketing agency to grow B2B sales", embedding: fakeEmbedding(2) },
    { userId: priya._id, text: "Seeking SaaS channel partners in India", embedding: fakeEmbedding(3) },
    { userId: vikram._id, text: "Need fintech clients for investment advisory", embedding: fakeEmbedding(4) },
    { userId: sneha._id, text: "Looking for SEO and lead generation services", embedding: fakeEmbedding(5) },
  ]);
  console.log("Intents created.");

  // ---- Offerings (what each user PROVIDES) ----
  // Arjun's offering is similar to Riya's intent (manufacturing distribution) — so Arjun should be Riya's top match
  await Offering.insertMany([
    { userId: riya._id, text: "SEO, Paid Ads, Content Marketing for B2B companies", embedding: similarEmbedding(2, 0.04) }, // similar to Arjun's intent
    { userId: arjun._id, text: "Manufacturing supply, OEM bulk orders, distribution Bangalore", embedding: similarEmbedding(1, 0.03) }, // similar to Riya's intent ✅
    { userId: priya._id, text: "SaaS development, API integration, cloud solutions", embedding: fakeEmbedding(6) },
    { userId: vikram._id, text: "Financial advisory, investment planning, wealth management", embedding: similarEmbedding(4, 0.06) }, // similar to Vikram's own intent (niche)
    { userId: sneha._id, text: "Lead generation, paid campaigns, digital marketing agency", embedding: similarEmbedding(5, 0.04) }, // similar to Sneha's intent
  ]);
  console.log("Offerings created.");

  console.log("\n=== SEED COMPLETE ===");
  console.log("Test user IDs (use these in API calls):");
  users.forEach((u) => console.log(`  ${u.name.padEnd(16)} → ${u._id}`));
  console.log("\nExample — generate matches for Riya:");
  console.log(`  POST http://localhost:5000/generate-matches/${riya._id}`);
  console.log("\nExpected top match for Riya: Arjun Mehta (same city + highly relevant offering)");

  await mongoose.disconnect();
  console.log("\nDisconnected. Ready to test!");
}

seed().catch((err) => { console.error(err); process.exit(1); });
