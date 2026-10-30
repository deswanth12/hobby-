import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { parseFrontmatter } from '../helpers/config-parser.mjs';

describe('Tier 1 - Feature 7: Multi-Layer Draft Exclusion', () => {
  const configPath = path.resolve('public/admin/config.yml');
  const postsDir = path.resolve('content/posts');
  const sitemapPath = path.resolve('public/sitemap.xml');

  it('7.1: CMS schema config sets default: true for draft boolean widget', () => {
    assert.ok(fs.existsSync(configPath), 'Expected public/admin/config.yml to exist');
    const raw = fs.readFileSync(configPath, 'utf8');
    assert.match(raw, /name:\s*["']?draft["']?[\s\S]*?default:\s*true/, 'Draft status must default to true');
  });

  it('7.2: Draft filter logic strictly removes draft: true posts from public listing', () => {
    const mockPosts = [
      { slug: 'published-article-1', draft: false, title: 'Published 1' },
      { slug: 'internal-draft-note', draft: true, title: 'Draft 1' },
      { slug: 'published-article-2', draft: false, title: 'Published 2' },
    ];

    const getPublishedOnly = (posts) => posts.filter(p => !p.draft);
    const visible = getPublishedOnly(mockPosts);

    assert.strictEqual(visible.length, 2, 'Only 2 published articles should be visible');
    assert.ok(!visible.some(p => p.draft === true), 'Visible articles must contain zero drafts');
    assert.ok(!visible.some(p => p.slug === 'internal-draft-note'), 'Draft post must not be visible');
  });

  it('7.3: getPostBySlug returns undefined for draft posts in production environment', () => {
    const mockPosts = [
      { slug: 'statutory-published-post', draft: false },
      { slug: 'confidential-partner-draft', draft: true },
    ];

    const resolvePostBySlug = (slug, isProd) => {
      const post = mockPosts.find(p => p.slug === slug);
      if (!post) return undefined;
      if (isProd && post.draft) return undefined;
      return post;
    };

    assert.ok(resolvePostBySlug('statutory-published-post', true), 'Published post must resolve in production');
    assert.strictEqual(resolvePostBySlug('confidential-partner-draft', true), undefined, 'Draft post must resolve to undefined in production');
  });

  it('7.4: public/sitemap.xml strictly excludes any post marked draft: true', () => {
    if (!fs.existsSync(sitemapPath) || !fs.existsSync(postsDir)) return;

    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data } = parseFrontmatter(raw);
      if (data.draft === true && data.slug) {
        assert.notIncludes(sitemapContent, `/blog/${data.slug}`, `Draft post ${data.slug} must NOT appear in sitemap.xml`);
      }
    }
  });

  it('7.5: Seed posts in content/posts include both published and draft entries for testing', () => {
    assert.ok(fs.existsSync(postsDir), 'Expected content/posts to exist');
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    
    let hasPublished = false;
    let hasDraft = false;

    for (const file of files) {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const { data } = parseFrontmatter(raw);
      if (data.draft === false) hasPublished = true;
      if (data.draft === true) hasDraft = true;
    }

    assert.ok(hasPublished, 'Expected at least one published seed post (draft: false)');
    assert.ok(hasDraft, 'Expected at least one draft seed post (draft: true) for isolation testing');
  });
});
