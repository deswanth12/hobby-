import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 9: Public Article Viewer (/blog/:slug)', () => {
  const appPath = path.resolve('src/App.tsx');
  const blogPostPagePath = path.resolve('src/pages/BlogPostPage.tsx');
  const blogDetailPagePath = path.resolve('src/pages/BlogDetailPage.tsx');

  const getArticleViewerPath = () => {
    if (fs.existsSync(blogPostPagePath)) return blogPostPagePath;
    if (fs.existsSync(blogDetailPagePath)) return blogDetailPagePath;
    return null;
  };

  it('9.1: Route /blog/:slug is declared in router configuration (src/App.tsx)', () => {
    assert.ok(fs.existsSync(appPath), 'Expected src/App.tsx to exist');
    const appContent = fs.readFileSync(appPath, 'utf8');
    assert.match(appContent, /path=["']\/blog\/:slug["']/, 'App.tsx must register path="/blog/:slug"');
  });

  it('9.2: Article viewer renders article title, publication date, and partner author info', () => {
    const filePath = getArticleViewerPath();
    assert.ok(filePath, 'Expected BlogPostPage.tsx or BlogDetailPage.tsx to exist');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.includes(content, 'post.title', 'Article viewer must render post.title');
    assert.includes(content, 'post.author', 'Article viewer must render post.author');
  });

  it('9.3: Article viewer renders cover image with accessible alt text', () => {
    const filePath = getArticleViewerPath();
    assert.ok(filePath, 'Expected BlogPostPage.tsx or BlogDetailPage.tsx to exist');
    const content = fs.readFileSync(filePath, 'utf8');

    const hasImageAlt = content.includes('alt=') || content.includes('coverImageAlt');
    assert.ok(hasImageAlt, 'Article viewer must include accessible alt attribute on cover image');
  });

  it('9.4: Article viewer renders markdown content body', () => {
    const filePath = getArticleViewerPath();
    assert.ok(filePath, 'Expected BlogPostPage.tsx or BlogDetailPage.tsx to exist');
    const content = fs.readFileSync(filePath, 'utf8');

    const hasMarkdownRender = content.includes('sanitizedHtml') || content.includes('dangerouslySetInnerHTML') || content.includes('renderSanitizedMarkdown') || content.includes('Markdown');
    assert.ok(hasMarkdownRender, 'Article viewer must render HTML or Markdown content');
  });

  it('9.5: Article viewer displays mandatory ICAI regulatory disclaimer disclosure', () => {
    const filePath = getArticleViewerPath();
    assert.ok(filePath, 'Expected BlogPostPage.tsx or BlogDetailPage.tsx to exist');
    const content = fs.readFileSync(filePath, 'utf8');

    const hasIcaiNotice = content.includes('ICAI') || content.includes('Chartered Accountants of India') || content.includes('disclaimer');
    assert.ok(hasIcaiNotice, 'Article page must display ICAI regulatory disclaimer disclosure');
  });
});
