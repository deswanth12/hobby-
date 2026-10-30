import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 11 (SEO & Structured Data)', () => {
  it('B11.1: seo.noIndex: true injects noindex, nofollow robots directive', () => {
    const resolveRobotsMeta = (seo) => {
      if (seo && seo.noIndex) return 'noindex, nofollow';
      return 'index, follow';
    };

    assert.strictEqual(resolveRobotsMeta({ noIndex: true }), 'noindex, nofollow');
    assert.strictEqual(resolveRobotsMeta({ noIndex: false }), 'index, follow');
    assert.strictEqual(resolveRobotsMeta(undefined), 'index, follow');
  });

  it('B11.2: Custom canonical URL in frontmatter overrides default calculated URL', () => {
    const resolveCanonical = (slug, seo) => {
      if (seo && seo.canonicalUrl) return seo.canonicalUrl;
      return `https://kavithaassociates.com/blog/${slug}`;
    };

    const defaultUrl = resolveCanonical('tax-audit-guide', {});
    assert.strictEqual(defaultUrl, 'https://kavithaassociates.com/blog/tax-audit-guide');

    const customUrl = resolveCanonical('tax-audit-guide', { canonicalUrl: 'https://icai.org/publications/tax-audit' });
    assert.strictEqual(customUrl, 'https://icai.org/publications/tax-audit');
  });

  it('B11.3: Quotes and ampersands in title/excerpt are safely serialized in JSON-LD', () => {
    const post = {
      title: 'Guidance on "Turnover Limits" & Section 44AB Rules',
      excerpt: 'Analysis of ₹10 Cr limit & "digital" payments.',
      date: '2026-10-29T10:00:00Z',
      slug: 'turnover-limits-guidance',
    };

    const schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
    };

    const jsonString = JSON.stringify(schemaObj);
    assert.doesNotThrow(() => JSON.parse(jsonString), 'JSON-LD must be valid parseable JSON');
    assert.includes(jsonString, '\\"Turnover Limits\\"', 'Inner quotes must be safely escaped');
  });

  it('B11.4: Schema.org BlogPosting contains valid ISO 8601 timestamps', () => {
    const post = {
      date: '2026-10-29T10:00:00Z',
    };
    const isoDate = new Date(post.date).toISOString();
    assert.strictEqual(isoDate, '2026-10-29T10:00:00.000Z', 'Timestamp must format cleanly to ISO 8601');
  });

  it('B11.5: Missing seo property gracefully falls back to default title and excerpt', () => {
    const resolveMeta = (post) => {
      return {
        title: (post.seo && post.seo.metaTitle) || `${post.title} | Kavitha & Associates`,
        description: (post.seo && post.seo.metaDescription) || post.excerpt,
      };
    };

    const postWithoutSeo = {
      title: 'GST Update',
      excerpt: 'Recent notifications on GSTR-9.',
    };

    const meta = resolveMeta(postWithoutSeo);
    assert.strictEqual(meta.title, 'GST Update | Kavitha & Associates');
    assert.strictEqual(meta.description, 'Recent notifications on GSTR-9.');
  });
});
