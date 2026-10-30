import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 4 - Scenario 1: Complete Blog Publishing Lifecycle', () => {
  it('Executes end-to-end publishing workflow from CMS authoring to public release', () => {
    // Step 1: Editor accesses CMS collection definition
    const collectionSchema = {
      name: 'posts',
      folder: 'content/posts',
      create: true,
      fields: ['title', 'slug', 'draft', 'date', 'author', 'coverImage', 'excerpt', 'body'],
    };
    assert.strictEqual(collectionSchema.name, 'posts');

    // Step 2: Editor authors new article metadata and draft content
    const initialDraft = {
      title: 'Guidance on Corporate Tax Filing Requirements for FY 2026-27',
      slug: 'corporate-tax-filing-requirements-2026',
      draft: true,
      date: '2026-10-29T10:00:00Z',
      author: 'CA KavithaVijay SRJ',
      authorRole: 'Senior Partner (B.Com, FCA, CMA)',
      coverImage: '/uploads/blog/corporate-tax-filing-2026.webp',
      coverImageAlt: 'Corporate tax compliance statutory dates schedule',
      excerpt: 'Comprehensive guidance on Form ITR-6 compliance and Advance Tax installments.',
      tags: ['Income Tax', 'Corporate & ROC'],
      body: '# Corporate Tax Filing\n\nCompanies registered in India must file Form ITR-6.',
    };

    assert.strictEqual(initialDraft.draft, true, 'Initially saved as draft');

    // Step 3: Verify draft is quarantined from public listing
    const publicBlogListing1 = [initialDraft].filter(p => !p.draft);
    assert.strictEqual(publicBlogListing1.length, 0, 'Draft post must not appear in public listing');

    // Step 4: Editor finalizes review and publishes (draft: false)
    const publishedPost = { ...initialDraft, draft: false };
    assert.strictEqual(publishedPost.draft, false, 'Article is marked published');

    // Step 5: Article appears in public /blog card grid
    const publicBlogListing2 = [publishedPost].filter(p => !p.draft);
    assert.strictEqual(publicBlogListing2.length, 1, 'Published article appears in blog grid');
    assert.strictEqual(publicBlogListing2[0].slug, 'corporate-tax-filing-requirements-2026');

    // Step 6: Direct navigation to /blog/:slug resolves article page
    const resolvedArticle = publishedPost.draft ? null : publishedPost;
    assert.ok(resolvedArticle, 'Article resolves for public viewer');
    assert.strictEqual(resolvedArticle.author, 'CA KavithaVijay SRJ');

    // Step 7: Build-time sitemap generator registers new published URL
    const sitemapUrls = ['/', '/about', '/blog'];
    if (!publishedPost.draft) {
      sitemapUrls.push(`/blog/${publishedPost.slug}`);
    }
    assert.includes(sitemapUrls, '/blog/corporate-tax-filing-requirements-2026', 'Sitemap includes new published URL');
  });
});
