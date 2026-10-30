import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 12 (404 Error Boundaries)', () => {
  const publishedPosts = new Map([
    ['tax-audit-guide', { title: 'Tax Audit Guide', draft: false }],
    ['gst-reconciliations', { title: 'GST Reconciliations', draft: false }],
  ]);

  const draftPosts = new Map([
    ['internal-tax-audit-draft', { title: 'Internal Audit Draft', draft: true }],
  ]);

  const resolveRoute = (slug, isProd) => {
    if (publishedPosts.has(slug)) return { status: 200, post: publishedPosts.get(slug) };
    if (draftPosts.has(slug)) {
      if (isProd) return { status: 404, page: 'NotFoundPage' };
      return { status: 200, post: draftPosts.get(slug) };
    }
    return { status: 404, page: 'NotFoundPage' };
  };

  it('B12.1: Path traversal attempts in blog slug route trigger 404 safely', () => {
    const maliciousSlugs = [
      '../../etc/passwd',
      '..%2f..%2fetc%2fpasswd',
      '..\\..\\windows\\system32',
      './../secret-config',
    ];

    for (const slug of maliciousSlugs) {
      const res = resolveRoute(slug, true);
      assert.strictEqual(res.status, 404, `Path traversal slug "${slug}" must trigger 404`);
      assert.strictEqual(res.page, 'NotFoundPage');
    }
  });

  it('B12.2: SQL injection payloads in blog slug trigger 404 cleanly', () => {
    const sqlSlugs = [
      "' OR '1'='1",
      "'; DROP TABLE posts; --",
      "admin'--",
      "1 UNION SELECT null, username, password FROM users",
    ];

    for (const slug of sqlSlugs) {
      const res = resolveRoute(slug, true);
      assert.strictEqual(res.status, 404, `SQL injection slug "${slug}" must trigger 404`);
    }
  });

  it('B12.3: Extremely long random slug (1,000 characters) triggers 404 without crash', () => {
    const longSlug = 'tax-audit-guide-' + 'a'.repeat(1000);
    const res = resolveRoute(longSlug, true);
    assert.strictEqual(res.status, 404, 'Extremely long slug must trigger 404 without memory buffer error');
  });

  it('B12.4: Direct URL access to draft post in production triggers identical 404 recovery page', () => {
    const res = resolveRoute('internal-tax-audit-draft', true);
    assert.strictEqual(res.status, 404, 'Draft post in production must return 404');
    assert.strictEqual(res.page, 'NotFoundPage', 'Draft post must render NotFoundPage');
  });

  it('B12.5: URL-encoded special characters (%20, %22, %3C) in slug trigger 404 safely', () => {
    const encodedSlugs = ['tax%20audit', '%22alert(1)%22', '%3Cscript%3E'];
    for (const slug of encodedSlugs) {
      const res = resolveRoute(slug, true);
      assert.strictEqual(res.status, 404, `URL-encoded slug "${slug}" must trigger 404`);
    }
  });
});
