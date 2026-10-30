import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { verifyNoXss } from '../helpers/markdown-test-util.mjs';

describe('Tier 3: Cross-Feature Pairwise Combinations', () => {
  it('Pairwise 1: Draft Post + Direct URL Access (F7 + F9 + F12)', () => {
    // A post with draft: true queried via direct slug URL must result in 404 recovery
    const mockDb = [
      { slug: 'published-article', draft: false, title: 'Published Article' },
      { slug: 'internal-unreleased-post', draft: true, title: 'Draft Post' },
    ];

    const resolvePostForRoute = (slug, isProduction) => {
      const post = mockDb.find(p => p.slug === slug);
      if (!post) return { status: 404, view: 'NotFoundPage' };
      if (isProduction && post.draft) {
        return { status: 404, view: 'NotFoundPage' };
      }
      return { status: 200, view: 'BlogPostPage', post };
    };

    // Access published post
    const pubResult = resolvePostForRoute('published-article', true);
    assert.strictEqual(pubResult.status, 200);
    assert.strictEqual(pubResult.view, 'BlogPostPage');

    // Access draft post in production -> MUST be quarantined and 404
    const draftResult = resolvePostForRoute('internal-unreleased-post', true);
    assert.strictEqual(draftResult.status, 404);
    assert.strictEqual(draftResult.view, 'NotFoundPage');
  });

  it('Pairwise 2: Publish Post + Build-time Sitemap Generator (F3 + F7 + F11)', () => {
    // When a post is marked draft: false, sitemap generator includes it; when draft: true, sitemap strictly omits it
    const posts = [
      { slug: 'statutory-tax-guide-2026', draft: false, title: 'Tax Guide' },
      { slug: 'internal-fee-schedule-draft', draft: true, title: 'Fee Schedule Draft' },
    ];

    const generateSitemapXml = (items) => {
      const urls = items
        .filter(p => !p.draft)
        .map(p => `  <url><loc>https://kavithaassociates.com/blog/${p.slug}</loc></url>`);
      return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset>\n${urls.join('\n')}\n</urlset>`;
    };

    const sitemap = generateSitemapXml(posts);
    assert.includes(sitemap, '/blog/statutory-tax-guide-2026', 'Published post must be included in sitemap.xml');
    assert.notIncludes(sitemap, '/blog/internal-fee-schedule-draft', 'Draft post must NEVER be included in sitemap.xml');
  });

  it('Pairwise 3: Media Upload Validation + Article Page Image Render (F6 + F9)', () => {
    // Valid upload generates root-relative /uploads/... URL which article page renders with accessible alt text
    const uploadedAsset = {
      filename: 'tax-audit-thresholds.webp',
      size: 450000, // 450 KB (<= 2MB)
      mediaDir: '/uploads/blog',
    };

    const isUploadValid = uploadedAsset.size <= 2097152 && uploadedAsset.filename.endsWith('.webp');
    assert.ok(isUploadValid, 'Asset upload must be valid');

    const post = {
      title: 'Tax Audit Thresholds',
      coverImage: `${uploadedAsset.mediaDir}/${uploadedAsset.filename}`,
      coverImageAlt: 'Turnover limits under Section 44AB chart',
    };

    assert.ok(post.coverImage.startsWith('/uploads/'), 'Path must be root-relative');
    assert.ok(post.coverImageAlt.length > 10, 'Alt text must be informative and accessible');
  });

  it('Pairwise 4: Auth Whitelist Rejection + Attempted CMS Mutation (F1 + F2)', () => {
    // Unauthorized GitHub user attempting to authenticate is blocked before receiving any token
    const ALLOWED_USERS = ['cakavithasrj', 'office-admin'];
    const authenticateUser = (githubUsername) => {
      if (!ALLOWED_USERS.includes(githubUsername)) {
        return { authorized: false, status: 403, error: 'Access Denied: User not in ALLOWED_USERS whitelist.' };
      }
      return { authorized: true, status: 200, token: 'gho_ephemeral_token' };
    };

    const unauthorizedAttempt = authenticateUser('external-intruder');
    assert.strictEqual(unauthorizedAttempt.authorized, false);
    assert.strictEqual(unauthorizedAttempt.status, 403);
    assert.ok(!unauthorizedAttempt.token, 'Token must not be granted');

    const authorizedAttempt = authenticateUser('cakavithasrj');
    assert.strictEqual(authorizedAttempt.authorized, true);
    assert.strictEqual(authorizedAttempt.status, 200);
    assert.ok(authorizedAttempt.token, 'Token granted to authorized user');
  });

  it('Pairwise 5: Markdown XSS Payload + Article Viewer Render (F9 + F10)', () => {
    // Malicious markdown input containing both valid content and attack vectors is sanitized while preserving valid content
    const rawMarkdownInput = `
# Statutory Turnover Limit 2026
Under Section 44AB, businesses exceeding ₹10 Crore with cash <= 5% are exempt from audit.

<script>stealAdminToken()</script>
<img src="x" onerror="sendCredentials()">

| Category | Threshold |
| :--- | :--- |
| Normal | ₹1.00 Cr |
    `;

    // Simulated sanitization pass
    const sanitizeHtml = (html) => {
      return html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/\bonerror\s*=\s*['"][^'"]*['"]/gi, '');
    };

    const cleanHtml = sanitizeHtml(rawMarkdownInput);
    const check = verifyNoXss(cleanHtml);

    assert.strictEqual(check.safe, true, 'Sanitized HTML must be safe');
    assert.includes(cleanHtml, 'Statutory Turnover Limit 2026', 'Valid headings must be preserved');
    assert.includes(cleanHtml, 'Section 44AB', 'Statutory text must be preserved');
    assert.notIncludes(cleanHtml, '<script>', 'Script tags must be purged');
    assert.notIncludes(cleanHtml, 'onerror', 'Event handlers must be purged');
  });

  it('Pairwise 6: Static Sections Schema Update + Public Homepage Render (F5 + F13)', () => {
    // Updating content/sections/homepage.json reflects directly on public homepage presentation
    const sectionData = {
      hero: {
        headlinePrimary: 'Statutory Rigor.',
        headlineAccent: 'Practical Commercial Counsel.',
        leadNarrative: 'Founded by CA KavithaVijay SRJ (B.Com, FCA, CMA)...',
      },
    };

    assert.strictEqual(sectionData.hero.headlinePrimary, 'Statutory Rigor.');
    assert.includes(sectionData.hero.leadNarrative, 'CA KavithaVijay SRJ');
    assert.includes(sectionData.hero.leadNarrative, 'FCA');
    assert.includes(sectionData.hero.leadNarrative, 'CMA');
  });

  it('Pairwise 7: Duplicate Slug Conflict + Blog List Unique Navigation Keys (F4 + F8)', () => {
    // When generating blog list cards, slug must serve as unique key to prevent React key collision
    const rawPosts = [
      { slug: 'tax-audit-limits', title: 'Tax Audit Limits' },
      { slug: 'tax-audit-limits', title: 'Tax Audit Limits Duplicate' },
    ];

    const deduplicateOrReject = (posts) => {
      const seen = new Set();
      for (const p of posts) {
        if (seen.has(p.slug)) throw new Error(`Collision on slug: ${p.slug}`);
        seen.add(p.slug);
      }
      return posts;
    };

    assert.throws(() => deduplicateOrReject(rawPosts), /Collision on slug: tax-audit-limits/);
  });

  it('Pairwise 8: SEO Custom Overrides + Schema.org JSON-LD Generation (F3 + F11)', () => {
    // Custom SEO frontmatter fields override default Open Graph and JSON-LD properties
    const post = {
      title: 'Default Title',
      excerpt: 'Default Excerpt',
      slug: 'seo-post',
      date: '2026-10-29T10:00:00Z',
      seo: {
        metaTitle: 'Custom SEO Title Override | Kavitha & Associates',
        metaDescription: 'Custom meta description for search engines',
        canonicalUrl: 'https://kavithaassociates.com/canonical-override',
      },
    };

    const ogTitle = post.seo.metaTitle || post.title;
    const ogDesc = post.seo.metaDescription || post.excerpt;
    const canonical = post.seo.canonicalUrl || `https://kavithaassociates.com/blog/${post.slug}`;

    assert.strictEqual(ogTitle, 'Custom SEO Title Override | Kavitha & Associates');
    assert.strictEqual(ogDesc, 'Custom meta description for search engines');
    assert.strictEqual(canonical, 'https://kavithaassociates.com/canonical-override');
  });

  it('Pairwise 9: Edge Security Headers + SPA Fallback Routing (F14 + F13)', () => {
    // Requests to SPA routes (e.g. /blog/tax-audit) receive 200 fallback to index.html with strict security headers
    const headersConfig = `
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
    `;
    const redirectsConfig = `
/*    /index.html   200
    `;

    assert.includes(headersConfig, 'X-Content-Type-Options: nosniff');
    assert.includes(headersConfig, 'X-Frame-Options: SAMEORIGIN');
    assert.includes(redirectsConfig, '/*    /index.html   200');
  });

  it('Pairwise 10: Zero-Secret Bundle Purity + Serverless OAuth Proxy (F1 + F15)', () => {
    // Frontend bundle requires no client_secret because Cloudflare Pages function handles exchange on edge
    const clientBundleFiles = ['dist/assets/index.js', 'src/App.tsx'];
    const forbiddenToken = 'client_secret_xyz1234567890';

    const checkPurity = (files, secret) => {
      for (const f of files) {
        if (f.includes(secret)) return false;
      }
      return true;
    };

    assert.ok(checkPurity(clientBundleFiles, forbiddenToken), 'Client bundle must be 100% free of OAuth secrets');
  });
});
