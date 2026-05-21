require('dotenv').config();
const { db } = require('../src/lib/db');
console.log("CONNECTED TO FIRESTORE DATABASE INSTANCE SUCCESS!");
db.collection('users').limit(1).get()
  .then((snap) => {
    console.log("FIRESTORE QUERY SUCCESSFUL! Docs found:", snap.size);
    process.exit(0);
  })
  .catch((err) => {
    console.error("FIRESTORE QUERY FAILED:", err);
    process.exit(1);
  });
