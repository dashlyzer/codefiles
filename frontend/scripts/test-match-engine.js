/**
 * Test script: verifies the new BM25 match engine returns scored results.
 * Run: node scripts/test-match-engine.js
 */
const mongoose = require('mongoose');
const dns = require('node:dns');

try { dns.setServers(["1.1.1.1", "8.8.8.8"]); } catch(e) {}

const MONGO_URI = 'mongodb+srv://Tapadmin:tap123@cluster0.i0sga0f.mongodb.net/?appName=Cluster0';

// ── Inline BM25 (mirrors lib/bm25.ts) ────────────────────────────────────────
const K1 = 1.5, B = 0.75;
const STOP_WORDS = new Set(["a","an","the","and","or","in","on","at","to","for","of","with","by","is","are","it","we","you","they","i","not","no"]);

function tokenize(text) {
  if (!text) return [];
  return text.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

function bm25Score(queryTokens, corpus) {
  const N = corpus.length;
  if (!N || !queryTokens.length) return new Array(N).fill(0);
  const avgdl = corpus.reduce((s, d) => s + d.length, 0) / N;
  const idfMap = new Map();
  for (const term of queryTokens) {
    if (idfMap.has(term)) continue;
    const df = corpus.filter(d => d.includes(term)).length;
    idfMap.set(term, Math.log((N - df + 0.5) / (df + 0.5) + 1));
  }
  return corpus.map(doc => {
    const dl = doc.length;
    const tf = new Map();
    doc.forEach(t => tf.set(t, (tf.get(t)||0)+1));
    let s = 0;
    for (const term of queryTokens) {
      const f = tf.get(term) || 0;
      if (!f) continue;
      s += (idfMap.get(term)||0) * (f*(K1+1)) / (f + K1*(1-B+B*dl/avgdl));
    }
    return s;
  });
}
function normalize(scores) {
  const max = Math.max(...scores);
  if (max === 0) return scores.map(() => 0);
  const ref = Math.max(max, 2.5);
  return scores.map(s => Math.min(s/ref, 1.0));
}

async function runTest() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected\n');

  const db = mongoose.connection;

  // Pick a specific SaaS user for testing
  const userOwner = await db.collection('users').findOne({ email: 'saas.founder1.hyderabad@example.com' });
  if (!userOwner) { console.log('❌ Test user not found'); process.exit(1); }
  
  const userBiz = await db.collection('businesses').findOne({ ownerId: userOwner._id });
  if (!userBiz) { console.log('❌ No business profile found for test user'); process.exit(1); }
  console.log(`🔍 Testing matches for: ${userBiz.companyName || userBiz.brandName} (${userOwner?.email})`);
  console.log(`   Offerings: ${(userBiz.offerings||[]).join(', ')}`);
  console.log(`   Needs:     ${(userBiz.needs||[]).join(', ')}\n`);

  // Fetch candidates
  const candidates = await db.collection('businesses').find({
    ownerId: { $ne: userBiz.ownerId }
  }).toArray();

  console.log(`📦 Scoring ${candidates.length} candidates...\n`);

  // BM25 corpora (REMOVED goal/desc from needs check to match production)
  const offeringCorpus = candidates.map(c => tokenize([...(c.offerings||[]), c.intent?.currentGoal||''].join(' ')));
  const needsCorpus = candidates.map(c => tokenize((c.needs||[]).join(' ')));

  const userNeedsTok    = tokenize([...(userBiz.needs||[]), userBiz.intent?.currentGoal||''].join(' '));
  const userOfferTok    = tokenize((userBiz.offerings||[]).join(' '));

  const s1 = normalize(bm25Score(userNeedsTok, offeringCorpus)); // Can they help ME?
  const s2 = normalize(bm25Score(userOfferTok, needsCorpus));     // Can I help THEM?

  // Fetch all ratings
  const ratingsAgg = await db.collection('ratings').aggregate([
    { $group: { _id: '$toUserId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]).toArray();
  const ratingMap = new Map(ratingsAgg.map(r => [r._id.toString(), r]));

  // Score each
  const scored = candidates.map((c, i) => {
    // 70/30 weighting for Intent (out of 50)
    const intentPts = Math.round(((s1[i]*0.7) + (s2[i]*0.3)) * 50);
    if (intentPts < 2) return null;

    const city = (s => s?.toLowerCase().trim())(c.location?.city);
    const uCity = (s => s?.toLowerCase().trim())(userBiz.location?.city);
    const state = (c.location?.state||'').toLowerCase();
    const uState = (userBiz.location?.state||'').toLowerCase();
    let locPts = 0;
    const reach = (c.location?.operatesIn||'').toLowerCase();
    if (reach === 'global') locPts = 10;
    else if (reach === 'national') locPts = 8;
    
    if (city && uCity && city === uCity) locPts = 15; // MAX 15
    else if (state && uState && state === uState) locPts = Math.max(locPts, 10);
    else if ((c.location?.country||'').toLowerCase() === (userBiz.location?.country||'').toLowerCase()) locPts = Math.max(locPts, 5);

    const verMap = { 'Trusted Partner':15,'Business Verified':12,'Basic Verified':8 };
    const verPts = verMap[c.trust?.verificationStatus] || 0;

    const r = ratingMap.get((c.ownerId||'').toString());
    const repPts = r ? (r.avg>=4.5?10:r.avg>=4?8:r.avg>=3?5:2) : 5;

    const total = intentPts + locPts + verPts + repPts;
    return { name: c.companyName||c.brandName, total, intentPts, locPts, verPts, repPts };
  }).filter(Boolean).sort((a,b) => b.total - a.total).slice(0, 10);

  console.log('🏆 TOP 10 MATCHES (FIXED ALGORITHM):');
  console.log('─'.repeat(80));
  scored.forEach((m, i) => {
    console.log(`${i+1}. ${m.name}`);
    console.log(`   Score: ${m.total}/95 | Intent:${m.intentPts}/50 | Loc:${m.locPts}/15 | Verify:${m.verPts}/15 | Rep:${m.repPts}/10`);
  });

  console.log(`\n✅ Engine working — ${scored.length} relevant matches found out of ${candidates.length} candidates`);
  process.exit(0);
}

runTest().catch(e => { console.error(e); process.exit(1); });
