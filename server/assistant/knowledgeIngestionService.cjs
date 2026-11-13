/**
 * server/assistant/knowledgeIngestionService.cjs
 * 
 * Idempotent Knowledge Ingestion & Chunking Pipeline for Kavitha & Associates.
 * 
 * Pipeline:
 * 1. Fetch approved sources from knowledgeRegistry.
 * 2. Validate publication and approval status.
 * 3. Normalize & sanitize text.
 * 4. Chunk preserving paragraph boundaries (target 450-650 tokens, ~60-100 token overlap).
 * 5. Compute content hashes to avoid redundant recalculation.
 * 6. Generate 384-dimensional semantic vectors.
 * 7. Persist index to data/assistant_knowledge_index.json.
 */

const fs = require('fs');
const path = require('path');
const { getApprovedKnowledgeSources, sha256 } = require('./knowledgeRegistry.cjs');
const { generateLocalEmbedding } = require('./embeddingService.cjs');

const INDEX_FILE = path.join(__dirname, '..', '..', 'data', 'assistant_knowledge_index.json');

/**
 * Splits text into logical chunks honoring paragraph and sentence breaks.
 */
function chunkDocument(source, maxChars = 1800, overlapChars = 200) {
  const chunks = [];
  const content = source.content.trim();

  // If document is small enough, keep as single cohesive chunk
  if (content.length <= maxChars) {
    return [{
      chunk_id: `${source.source_id}-c1`,
      source_id: source.source_id,
      source_type: source.source_type,
      title: source.title,
      canonical_url: source.canonical_url,
      content: content,
      content_hash: sha256(content),
      token_estimate: Math.ceil(content.length / 4),
      publication_status: source.publication_status,
      approval_status: source.approval_status,
      visibility: source.visibility,
      published_at: source.published_at,
      source_version: source.source_version
    }];
  }

  // Split along paragraph boundaries
  const paragraphs = content.split(/\n\s*\n/);
  let currentChunk = '';
  let chunkIndex = 1;

  for (const para of paragraphs) {
    if ((currentChunk.length + para.length + 2) <= maxChars) {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    } else {
      if (currentChunk.trim()) {
        chunks.push({
          chunk_id: `${source.source_id}-c${chunkIndex++}`,
          source_id: source.source_id,
          source_type: source.source_type,
          title: source.title,
          canonical_url: source.canonical_url,
          content: currentChunk.trim(),
          content_hash: sha256(currentChunk.trim()),
          token_estimate: Math.ceil(currentChunk.length / 4),
          publication_status: source.publication_status,
          approval_status: source.approval_status,
          visibility: source.visibility,
          published_at: source.published_at,
          source_version: source.source_version
        });
      }
      // Overlap with trailing context
      const overlapText = currentChunk.slice(-overlapChars);
      currentChunk = (overlapText.length > 50 ? overlapText + '\n\n' : '') + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      chunk_id: `${source.source_id}-c${chunkIndex++}`,
      source_id: source.source_id,
      source_type: source.source_type,
      title: source.title,
      canonical_url: source.canonical_url,
      content: currentChunk.trim(),
      content_hash: sha256(currentChunk.trim()),
      token_estimate: Math.ceil(currentChunk.length / 4),
      publication_status: source.publication_status,
      approval_status: source.approval_status,
      visibility: source.visibility,
      published_at: source.published_at,
      source_version: source.source_version
    });
  }

  return chunks;
}

/**
 * Ingests all approved knowledge sources and saves the indexed knowledge store.
 */
function ingestKnowledge(force = false) {
  const sources = getApprovedKnowledgeSources();
  let existingIndex = { chunks: [], indexedAt: null, totalChunks: 0 };

  if (!force && fs.existsSync(INDEX_FILE)) {
    try {
      existingIndex = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
    } catch {
      existingIndex = { chunks: [] };
    }
  }

  const existingMap = new Map();
  if (Array.isArray(existingIndex.chunks)) {
    existingIndex.chunks.forEach(c => existingMap.set(c.chunk_id, c));
  }

  const allChunks = [];
  let addedCount = 0;
  let reusedCount = 0;

  for (const source of sources) {
    // Strictly verify publication and approval status
    if (source.publication_status !== 'published' || source.approval_status !== 'approved') {
      continue;
    }

    const docChunks = chunkDocument(source);
    for (const chunk of docChunks) {
      const existing = existingMap.get(chunk.chunk_id);
      if (existing && existing.content_hash === chunk.content_hash && existing.embedding) {
        // Reuse precomputed embedding
        allChunks.push(existing);
        reusedCount++;
      } else {
        // Generate new embedding
        chunk.embedding = generateLocalEmbedding(chunk.content);
        chunk.last_indexed_at = new Date().toISOString();
        allChunks.push(chunk);
        addedCount++;
      }
    }
  }

  const indexPayload = {
    version: '1.0',
    indexedAt: new Date().toISOString(),
    totalSources: sources.length,
    totalChunks: allChunks.length,
    chunks: allChunks
  };

  fs.writeFileSync(INDEX_FILE, JSON.stringify(indexPayload, null, 2), 'utf8');

  return {
    success: true,
    totalSources: sources.length,
    totalChunks: allChunks.length,
    addedOrUpdated: addedCount,
    reused: reusedCount,
    indexedAt: indexPayload.indexedAt
  };
}

/**
 * Loads the current active knowledge index into memory.
 */
function loadIndex() {
  if (!fs.existsSync(INDEX_FILE)) {
    ingestKnowledge(true);
  }
  try {
    return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  } catch (err) {
    console.error('[Assistant] Error reading index file:', err);
    return { chunks: [] };
  }
}

module.exports = {
  chunkDocument,
  ingestKnowledge,
  loadIndex,
  INDEX_FILE
};
