/**
 * lib/bm25.ts
 * Lightweight BM25Okapi implementation — no npm dependency required.
 * Used by the Taplyzer match engine to score keyword relevance between
 * a user's needs/offerings and every candidate business.
 *
 * BM25 parameters (standard research defaults):
 *   k1 = 1.5  — term frequency saturation
 *   b  = 0.75 — document length normalization
 */

const K1 = 1.5;
const B  = 0.75;

// Common English stop-words that add noise to matching
const STOP_WORDS = new Set([
  // ── English function words ────────────────────────────────────────────────
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","as","is","are","was","were","be","been","has","have","had",
  "do","does","did","will","would","could","should","may","might","shall",
  "it","its","this","that","these","those","we","our","you","your","they",
  "their","i","my","me","us","he","she","him","her","not","no","so","if",

  // ── Generic business descriptors ─────────────────────────────────────────
  "company","services","solutions","business","provide","offering","needs",
  "looking","seeking","specializing","expert","professional","team","agency",
  "firm","group","partners","partnership","ventures","enterprise","startup",
  "industry","sector","domain","field","space","market","segment","vertical",

  // ── Business model / go-to-market labels (CROSS-NICHE NOISE) ─────────────
  // These describe HOW a business operates, NOT what it offers.
  // Including them causes a digital marketing agency to match a steel factory
  // just because both selected "B2B" in their profile.
  "b2b","b2c","d2c","dtc","b2g","saas","paas","iaas","ecommerce","ecom",
  "marketplace","platform","subscription","enterprise","smb","sme","msme",
  "wholesale","retail","direct","indirect","omnichannel","multichannel",

  // ── Generic intent / outcome words ──────────────────────────────────────
  "clients","customers","users","buyers","sellers","vendors","suppliers",
  "growth","scale","revenue","profit","deals","sales","leads","pipeline",
  "opportunities","results","outcomes","success","goals","targets","metrics",
  "new","existing","potential","ideal","qualified","premium","high","low",
]);

/**
 * Tokenise a raw string into lowercase, de-stopworded, alphanumeric tokens.
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

/**
 * Business model noise terms that should NOT influence semantic matching.
 * These describe HOW a company operates (go-to-market model), NOT what it
 * actually offers or needs. Including them causes a digital marketing agency
 * to match a steel factory simply because both selected "B2B".
 */
export const NOISE_TERMS = new Set([
  "b2b","b2c","d2c","dtc","b2g","c2c",
  "saas","paas","iaas","xaas",
  "ecommerce","ecom","marketplace","platform",
  "smb","sme","msme","enterprise","startup","unicorn",
  "wholesale","retail","direct","indirect","omnichannel","multichannel",
  "subscription","freemium","on-demand",
  "clients","customers","users","buyers","sellers","vendors","leads",
  "growth","scale","revenue","profit","sales","pipeline",
  "agency","firm","group","startup","company","solutions","services",
]);

/** Strip business model noise terms from a string before embedding or tokenizing */
export function denoiseText(text: string): string {
  return text
    .split(/[,\s]+/)
    .filter(word => !NOISE_TERMS.has(word.toLowerCase().replace(/[^a-z0-9]/g, "")))
    .join(" ")
    .trim();
}

/**
 * Compute BM25 scores for a single query against a corpus of tokenised docs.
 *
 * @param queryTokens  - Tokens from the search query (user's needs / offerings)
 * @param corpus       - Array of token arrays, one per candidate document
 * @returns            - Score array, same length & order as corpus
 */
export function bm25Score(
  queryTokens: string[],
  corpus: string[][]
): number[] {
  const N = corpus.length;
  if (N === 0 || queryTokens.length === 0) return new Array(N).fill(0);

  // Average document length across corpus
  const avgdl = corpus.reduce((s, doc) => s + doc.length, 0) / N;

  // Precompute IDF for each unique query term
  const idfMap = new Map<string, number>();
  for (const term of queryTokens) {
    if (idfMap.has(term)) continue;
    const df = corpus.filter((doc) => doc.includes(term)).length;
    // Robertson-Sparck Jones IDF with +1 smoothing to avoid negative values
    // We cap N at 100 to avoid extreme IDF values in small collections
    const effectiveN = Math.max(N, 10);
    idfMap.set(term, Math.log((effectiveN - df + 0.5) / (df + 0.5) + 1));
  }

  // Score each document
  return corpus.map((doc) => {
    const dl = doc.length;
    // Build term-frequency map for this document
    const tfMap = new Map<string, number>();
    for (const token of doc) {
      tfMap.set(token, (tfMap.get(token) ?? 0) + 1);
    }

    let score = 0;
    for (const term of queryTokens) {
      const tf  = tfMap.get(term) ?? 0;
      if (tf === 0) continue;
      const idf = idfMap.get(term) ?? 0;
      // BM25Okapi formula
      score += idf * (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * (dl / avgdl)));
    }
    return score;
  });
}

/**
 * Normalise an array of raw BM25 scores into [0, 1].
 * Uses a "Soft Ceiling" approach: 
 * - If max score is high (> 2.0), use min-max scaling.
 * - If max score is low (< 2.0), scale relative to 2.0 (preserving weak match signals).
 */
export function normalizeBM25(scores: number[]): number[] {
  const max = Math.max(...scores);
  if (max === 0) return scores.map(() => 0);
  
  // A "healthy" BM25 score for a good match is typically > 2.0 in small corpora.
  // We use 2.5 as a reference for a "perfect" keyword match.
  const referenceMax = Math.max(max, 2.5);
  
  return scores.map((s) => Math.min(s / referenceMax, 1.0));
}
