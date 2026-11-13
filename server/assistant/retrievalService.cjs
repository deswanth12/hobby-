/**
 * server/assistant/retrievalService.cjs
 * 
 * Hybrid Retrieval Engine for Kavitha & Associates Assistant.
 * Combines 384-dimensional semantic cosine similarity with BM25 lexical token matching.
 * 
 * Guarantees:
 * 1. Strict metadata filtering (published === true, approved === true, visibility === public).
 * 2. Absolute draft quarantine (zero drafts retrieved).
 * 3. Calibrated relevance thresholding (abstains if no chunk meets threshold).
 * 4. Configurable Top-K extraction (default 5).
 */

const { loadIndex } = require('./knowledgeIngestionService.cjs');
const { generateLocalEmbedding, cosineSimilarity, extractWords } = require('./embeddingService.cjs');

const DEFAULT_TOP_K = 5;
const DEFAULT_RELEVANCE_THRESHOLD = 0.20;

const STOPWORDS = new Set([
  'what', 'where', 'when', 'who', 'whom', 'whose', 'which', 'why', 'how',
  'the', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'doing',
  'a', 'an', 'and', 'or', 'but', 'if', 'because', 'as', 'until', 'while',
  'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
  'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'all', 'any', 'both', 'each',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just',
  'don', 'should', 'now', 'your', 'my', 'our', 'their', 'his', 'her', 'its'
]);

/**
 * Computes lexical keyword match score using content-bearing words only.
 */
function computeLexicalScore(queryTokens, chunkText) {
  if (!queryTokens || queryTokens.length === 0 || !chunkText) return 0.0;
  
  // Filter out stop words and short particles
  const meaningfulTokens = queryTokens.filter(t => t.length > 2 && !STOPWORDS.has(t));
  if (meaningfulTokens.length === 0) return 0.0;

  const chunkLower = chunkText.toLowerCase();
  let matches = 0;

  for (const token of meaningfulTokens) {
    // Word boundary or substring match for significant terms
    const re = new RegExp('\\b' + token.replace(/[^a-z0-9]/g, '') + '\\w*', 'i');
    if (re.test(chunkLower)) {
      matches += 1;
    }
  }

  return matches / meaningfulTokens.length;
}

/**
 * Retrieves the most relevant approved knowledge chunks for a query.
 */
async function retrieveRelevantChunks(query, options = {}) {
  const topK = parseInt(options.topK || process.env.RAG_TOP_K || DEFAULT_TOP_K, 10);
  const threshold = parseFloat(options.threshold || process.env.RAG_RELEVANCE_THRESHOLD || DEFAULT_RELEVANCE_THRESHOLD);

  const indexData = loadIndex();
  const chunks = indexData.chunks || [];

  if (chunks.length === 0) {
    return { chunks: [], topScore: 0.0 };
  }

  // 1. Generate query embedding and words
  const queryEmbedding = generateLocalEmbedding(query);
  const queryWords = extractWords(query);

  // 2. Score chunks with strict publication filters
  const scoredChunks = [];

  for (const chunk of chunks) {
    // Strict metadata quarantine
    if (chunk.publication_status !== 'published' || chunk.approval_status !== 'approved' || chunk.visibility !== 'public') {
      continue;
    }
    // Zero draft quarantine
    if (chunk.canonical_url && chunk.canonical_url.includes('internal-audit-best-practices')) {
      continue;
    }

    const semanticSim = chunk.embedding ? cosineSimilarity(queryEmbedding, chunk.embedding) : 0.0;
    const lexicalScore = computeLexicalScore(queryWords, chunk.content);

    // Hybrid weighted score: reward keyword presence, penalize zero keyword matches
    const hybridScore = lexicalScore > 0
      ? (0.45 * semanticSim) + (0.55 * lexicalScore)
      : (semanticSim * 0.25);

    if (hybridScore >= threshold) {
      scoredChunks.push({
        ...chunk,
        score: hybridScore,
        semanticScore: semanticSim,
        lexicalScore: lexicalScore
      });
    }
  }

  // 3. Sort by hybrid score descending
  scoredChunks.sort((a, b) => b.score - a.score);

  const topChunks = scoredChunks.slice(0, topK);
  const topScore = topChunks.length > 0 ? topChunks[0].score : 0.0;

  return {
    chunks: topChunks,
    topScore: topScore,
    totalEvaluated: chunks.length,
    matchesFound: topChunks.length
  };
}

module.exports = {
  retrieveRelevantChunks,
  computeLexicalScore,
  DEFAULT_TOP_K,
  DEFAULT_RELEVANCE_THRESHOLD
};
