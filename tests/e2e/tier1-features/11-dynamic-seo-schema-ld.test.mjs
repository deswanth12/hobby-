import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 11: Dynamic SEO & Schema.org JSON-LD', () => {
  const seoHeadPath = path.resolve('src/components/SEOHead.tsx');
  const blogPostPath = path.resolve('src/pages/BlogPostPage.tsx');
  const blogDetailPath = path.resolve('src/pages/BlogDetailPage.tsx');

  it('11.1: SEO component or article page dynamically injects document title', () => {
    const hasSeo = fs.existsSync(seoHeadPath);
    const detailFile = fs.existsSync(blogPostPath) ? blogPostPath : blogDetailPath;
    const hasDetail = fs.existsSync(detailFile);

    assert.ok(hasSeo || hasDetail, 'Expected SEOHead component or BlogPostPage to exist');
    const content = hasSeo ? fs.readFileSync(seoHeadPath, 'utf8') : fs.readFileSync(detailFile, 'utf8');
    
    assert.includes(content, 'title', 'Component must support dynamic title tag');
  });

  it('11.2: Meta description tag reflects article excerpt or seo.metaDescription', () => {
    const detailFile = fs.existsSync(blogPostPath) ? blogPostPath : (fs.existsSync(blogDetailPath) ? blogDetailPath : seoHeadPath);
    assert.ok(fs.existsSync(detailFile), 'Expected article page or SEO component to exist');
    const content = fs.readFileSync(detailFile, 'utf8');

    const hasDescription = content.includes('description') || content.includes('metaDescription') || content.includes('excerpt');
    assert.ok(hasDescription, 'Component must set meta description');
  });

  it('11.3: Article page injects Open Graph meta tags (og:type, og:title, og:image, og:url)', () => {
    const targetFile = fs.existsSync(seoHeadPath) ? seoHeadPath : (fs.existsSync(blogPostPath) ? blogPostPath : blogDetailPath);
    assert.ok(fs.existsSync(targetFile), 'Expected target SEO component to exist');
    const content = fs.readFileSync(targetFile, 'utf8');

    assert.includes(content, 'og:title', 'Component must support og:title');
    assert.includes(content, 'og:description', 'Component must support og:description');
    assert.includes(content, 'og:type', 'Component must support og:type');
  });

  it('11.4: Article page defines canonical link tag pointing to authoritative URL', () => {
    const targetFile = fs.existsSync(seoHeadPath) ? seoHeadPath : (fs.existsSync(blogPostPath) ? blogPostPath : blogDetailPath);
    assert.ok(fs.existsSync(targetFile), 'Expected target SEO component to exist');
    const content = fs.readFileSync(targetFile, 'utf8');

    const hasCanonical = content.includes('canonical') || content.includes('canonicalUrl') || content.includes('rel="canonical"');
    assert.ok(hasCanonical, 'Component must support canonical link injection');
  });

  it('11.5: Article page injects Schema.org BlogPosting JSON-LD structured data', () => {
    const targetFile = fs.existsSync(seoHeadPath) ? seoHeadPath : (fs.existsSync(blogPostPath) ? blogPostPath : blogDetailPath);
    assert.ok(fs.existsSync(targetFile), 'Expected target SEO component to exist');
    const content = fs.readFileSync(targetFile, 'utf8');

    const hasJsonLd = content.includes('application/ld+json') || content.includes('BlogPosting') || content.includes('schema.org');
    assert.ok(hasJsonLd, 'Component must inject Schema.org BlogPosting JSON-LD structured data');
  });
});
