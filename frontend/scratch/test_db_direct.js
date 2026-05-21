const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const dbConnect = require('../lib/db').default;
const User = require('../models/User').default;

async function run() {
  console.log("Connecting directly to Firestore using frontend lib/db.ts...");
  try {
    await dbConnect();
    console.log("Connected! Counting documents...");
    const count = await User.countDocuments();
    console.log(`User count: ${count}`);
    process.exit(0);
  } catch (e) {
    console.error("Error during Firestore query:", e);
    process.exit(1);
  }
}

run();
