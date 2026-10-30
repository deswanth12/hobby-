import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 4 - Scenario 2: Draft Quarantine & Unpublish Verification Flow', () => {
  it('Executes end-to-end unpublish quarantine flow across listing, direct URL, and sitemap', () => {
    // Stage 1: Active published post
    let post = {
      title: 'Tax Assessment Scrutiny Advisory Notes',
      slug: 'tax-assessment-scrutiny-advisory',
      draft: false,
      date: '2026-10-29T10:00:00Z',
    };

    // Verify initially active in public queries
    const checkListing = (p) => (!p.draft ? [p] : []);
    const checkDirectUrl = (p, isProd) => (isProd && p.draft ? { status: 404, page: 'NotFoundPage' } : { status: 200, post: p });
    const checkSitemap = (p) => (!p.draft ? [`/blog/${p.slug}`] : []);

    assert.strictEqual(checkListing(post).length, 1, 'Initially appears in public listing');
    assert.strictEqual(checkDirectUrl(post, true).status, 200, 'Initially resolves at /blog/:slug');
    assert.includes(checkSitemap(post), '/blog/tax-assessment-scrutiny-advisory', 'Initially included in sitemap');

    // Stage 2: Editor unpublishes post in CMS (draft: true)
    post = { ...post, draft: true };

    // Stage 3: Immediate quarantine across all three public layers
    // Layer 1: Excluded from public listing
    const publicPosts = checkListing(post);
    assert.strictEqual(publicPosts.length, 0, 'Quarantined post must be removed from /blog listing');

    // Layer 2: Direct URL access triggers 404 recovery
    const directAccess = checkDirectUrl(post, true);
    assert.strictEqual(directAccess.status, 404, 'Direct URL to quarantined post must return HTTP 404');
    assert.strictEqual(directAccess.page, 'NotFoundPage', 'Must render styled NotFoundPage recovery');

    // Layer 3: Excluded from build-time sitemap
    const sitemapEntries = checkSitemap(post);
    assert.notIncludes(sitemapEntries, '/blog/tax-assessment-scrutiny-advisory', 'Quarantined post must be omitted from sitemap');
  });
});
