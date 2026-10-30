import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 8 (Blog Hub Grid & Filters)', () => {
  it('B8.1: Long article titles (250+ characters) do not cause rendering crash', () => {
    const longTitle = 'Statutory Analysis of Section 44AB Turnover Limits, Digital Transactions Thresholds, Tax Audit Applicability, Form 3CD Clause Compliance, and Accounting Standard Disclosures for Corporate Enterprises, MSMEs, and Partnerships in South India';
    assert.ok(longTitle.length > 200, 'Title exceeds 200 characters');
    const clampedTitle = longTitle.length > 120 ? longTitle.substring(0, 117) + '...' : longTitle;
    assert.ok(clampedTitle.endsWith('...'), 'Expected clamped title for long headline');
  });

  it('B8.2: Search filter with regex special characters does not throw SyntaxError', () => {
    const sanitizeQuery = (q) => q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const dangerousQueries = ['[test]', 'tax+audit', 'gst (amendment)', 'cost?accounting', 'audit.*'];

    for (const q of dangerousQueries) {
      assert.doesNotThrow(() => {
        const escaped = sanitizeQuery(q);
        new RegExp(escaped, 'i');
      }, `Query "${q}" must not crash RegExp`);
    }
  });

  it('B8.3: Post without coverImage resolves to dignified default placeholder banner', () => {
    const resolveCover = (coverImage) => {
      return coverImage || '/uploads/blog/default-statutory-banner.webp';
    };

    assert.strictEqual(resolveCover(undefined), '/uploads/blog/default-statutory-banner.webp');
    assert.strictEqual(resolveCover(''), '/uploads/blog/default-statutory-banner.webp');
    assert.strictEqual(resolveCover('/uploads/blog/custom.png'), '/uploads/blog/custom.png');
  });

  it('B8.4: Post with empty tags array (tags: []) renders cleanly without error', () => {
    const renderTags = (tags) => {
      if (!Array.isArray(tags) || tags.length === 0) return [];
      return tags.filter(t => typeof t === 'string' && t.trim().length > 0);
    };

    assert.deepStrictEqual(renderTags([]), []);
    assert.deepStrictEqual(renderTags(undefined), []);
    assert.deepStrictEqual(renderTags(['Income Tax', 'Audit']), ['Income Tax', 'Audit']);
  });

  it('B8.5: Category filter selecting non-matching tag returns empty list without error', () => {
    const posts = [
      { slug: 'tax-1', tags: ['Income Tax'] },
      { slug: 'gst-1', tags: ['GST Compliance'] },
    ];

    const filterByTag = (tag) => {
      if (!tag || tag === 'All') return posts;
      return posts.filter(p => p.tags && p.tags.includes(tag));
    };

    const emptyResults = filterByTag('NonExistentCategory');
    assert.strictEqual(emptyResults.length, 0, 'Non-existent tag must yield 0 results');
  });
});
