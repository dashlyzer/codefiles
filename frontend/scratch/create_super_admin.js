const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error("Error: Missing Firebase credentials in .env.local!");
  process.exit(1);
}

// Clean private key
let cleanKey = privateKey.replace(/^"|"$/g, '').replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: cleanKey,
    }),
  });
}

const db = admin.firestore();
const email = "admin@taplyzer.com";
const password = "AdminPass123!";

async function run() {
  console.log("Connecting to Firestore to create Super Admin...");
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const usersCollection = db.collection('users');

  // Check if admin already exists
  const existingSnap = await usersCollection.where('email', '==', email).limit(1).get();
  if (!existingSnap.empty) {
    const docId = existingSnap.docs[0].id;
    console.log(`Admin user already exists with ID: ${docId}. Updating password...`);
    await usersCollection.doc(docId).update({
      password: hashedPassword,
      role: "SUPER_ADMIN",
      verified: true,
      updatedAt: new Date()
    });
    console.log("Password updated successfully!");
  } else {
    // Create new super admin
    const newDoc = await usersCollection.add({
      name: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      verified: true,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`Super Admin created successfully with ID: ${newDoc.id}`);
  }
  
  console.log("\nCredentials to log in:");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}

run().catch(err => {
  console.error("Error creating Super Admin:", err);
  process.exit(1);
});
