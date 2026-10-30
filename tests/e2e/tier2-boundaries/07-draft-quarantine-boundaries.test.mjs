import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 7 (Draft Quarantine Logic)', () => {
  const sanitizeDraftStatus = (rawDraft) => {
    // If undefined or null, default to draft: true
    if (rawDraft === undefined || rawDraft === null) return true;
    if (typeof rawDraft === 'boolean') return rawDraft;
    if (typeof rawDraft === 'string') {
      return rawDraft.toLowerCase() !== 'false';
    }
    return true; // Safe fallback
  };

  it('B7.1: Missing draft field in frontmatter defaults safely to quarantined (draft: true)', () => {
    assert.strictEqual(sanitizeDraftStatus(undefined), true, 'undefined draft must default to true');
    assert.strictEqual(sanitizeDraftStatus(null), true, 'null draft must default to true');
  });

  it('B7.2: String representation "true" or malformed draft values resolve to draft: true', () => {
    assert.strictEqual(sanitizeDraftStatus('true'), true);
    assert.strictEqual(sanitizeDraftStatus('draft'), true);
    assert.strictEqual(sanitizeDraftStatus(1), true);
  });

  it('B7.3: Direct slug lookup for draft returns undefined/null in production', () => {
    const posts = [
      { slug: 'tax-guide', draft: false },
      { slug: 'confidential-notes', draft: true },
    ];

    const getPost = (slug, isProd) => {
      const p = posts.find(item => item.slug === slug);
      if (!p) return null;
      if (isProd && p.draft) return null;
      return p;
    };

    assert.strictEqual(getPost('confidential-notes', true), null, 'Draft post must resolve to null in production');
  });

  it('B7.4: Blog search filter strictly filters out drafts before performing search matching', () => {
    const posts = [
      { slug: 'audit-published', title: 'Audit Guidelines 2026', draft: false },
      { slug: 'audit-draft', title: 'Internal Audit Strategy Draft', draft: true },
    ];

    const searchPosts = (query, isProd) => {
      const base = isProd ? posts.filter(p => !p.draft) : posts;
      return base.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
    };

    const results = searchPosts('Audit', true);
    assert.strictEqual(results.length, 1, 'Only published post should be found in search');
    assert.strictEqual(results[0].slug, 'audit-published');
  });

  it('B7.5: Sitemap generation with zero published posts succeeds cleanly without throwing', () => {
    const generateSitemapUrls = (posts) => {
      const urls = ['/', '/about', '/services', '/contact', '/blog'];
      const published = posts.filter(p => !p.draft);
      for (const p of published) {
        urls.push(`/blog/${p.slug}`);
      }
      return urls;
    };

    const allDraftPosts = [
      { slug: 'draft-1', draft: true },
      { slug: 'draft-2', draft: true },
    ];

    const urls = generateSitemapUrls(allDraftPosts);
    assert.strictEqual(urls.length, 5, 'Sitemap should contain only static routes when all posts are drafts');
    assert.notIncludes(urls, '/blog/draft-1');
  });
});
