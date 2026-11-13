/**
 * server/assistant/sourceCitationService.cjs
 * 
 * Source Citation Formatting & Validation for Kavitha & Associates Assistant.
 * Ensures factual answers are paired with canonical, verified website links.
 * 
 * Requirements:
 * 1. Clean display title and canonical internal route.
 * 2. Deduplicates multiple chunks pointing to the same page.
 * 3. Never leaks internal chunk IDs, database specifics, or unverified URLs.
 * 4. Only returns citations actually present in the retrieved evidence set.
 */

/**
 * Builds verified citations from retrieved chunks.
 */
function buildCitations(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    return [];
  }

  const seenUrls = new Set();
  const citations = [];

  for (const chunk of chunks) {
    if (!chunk || !chunk.canonical_url) continue;

    // Validate that canonical URL is a relative internal link
    const url = chunk.canonical_url.trim();
    if (!url.startsWith('/')) continue;

    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      citations.push({
        title: chunk.title || 'Kavitha & Associates Official Publication',
        url: url
      });
    }
  }

  return citations;
}

/**
 * Validates that all citations in a response belong to approved routes.
 */
function validateCitations(citations) {
  if (!Array.isArray(citations)) return false;
  return citations.every(c => (
    typeof c.title === 'string' &&
    c.title.length > 0 &&
    typeof c.url === 'string' &&
    c.url.startsWith('/') &&
    !c.url.includes('internal-audit-best-practices') // draft quarantine check
  ));
}

module.exports = {
  buildCitations,
  validateCitations
};
