import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 8: Public Blog Hub (/blog)', () => {
  const appPath = path.resolve('src/App.tsx');
  const blogListPagePath = path.resolve('src/pages/BlogListPage.tsx');
  const blogPagePath = path.resolve('src/pages/BlogPage.tsx');

  const getBlogHubPath = () => {
    if (fs.existsSync(blogListPagePath)) return blogListPagePath;
    if (fs.existsSync(blogPagePath)) return blogPagePath;
    return null;
  };

  it('8.1: Route /blog is declared in application routing configuration (src/App.tsx)', () => {
    assert.ok(fs.existsSync(appPath), 'Expected src/App.tsx to exist');
    const appContent = fs.readFileSync(appPath, 'utf8');
    assert.match(appContent, /path=["']\/blog["']/, 'App.tsx must register path="/blog"');
  });

  it('8.2: Blog list component exists and renders practice articles header', () => {
    const filePath = getBlogHubPath();
    assert.ok(filePath, 'Expected BlogListPage.tsx or BlogPage.tsx to exist');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Header should contain authoritative wording
    const hasHeader = content.includes('Articles') || content.includes('Regulatory') || content.includes('Insights') || content.includes('Publications');
    assert.ok(hasHeader, 'Blog hub must contain title with Articles, Regulatory, or Insights');
  });

  it('8.3: Blog hub component renders responsive article card metadata (date, title, excerpt, author)', () => {
    const filePath = getBlogHubPath();
    assert.ok(filePath, 'Expected BlogListPage.tsx or BlogPage.tsx to exist');
    const content = fs.readFileSync(filePath, 'utf8');

    assert.includes(content, 'title', 'Card must render article title');
    assert.includes(content, 'excerpt', 'Card must render excerpt');
    assert.includes(content, 'author', 'Card must render author');
  });

  it('8.4: Blog hub supports category/tag filtering across practice disciplines', () => {
    const filePath = getBlogHubPath();
    assert.ok(filePath, 'Expected BlogListPage.tsx or BlogPage.tsx to exist');
    const content = fs.readFileSync(filePath, 'utf8');

    // Should contain tag or category filter logic
    const hasTagFilter = content.includes('tag') || content.includes('category') || content.includes('selectedTag') || content.includes('filter');
    assert.ok(hasTagFilter, 'Blog hub must support tag or category filtering');
  });

  it('8.5: Blog hub provides dignified empty state when zero posts match filter criteria', () => {
    const filePath = getBlogHubPath();
    assert.ok(filePath, 'Expected BlogListPage.tsx or BlogPage.tsx to exist');
    const content = fs.readFileSync(filePath, 'utf8');

    const hasEmptyState = content.includes('No articles') || content.includes('No publications') || content.includes('No posts') || content.includes('length === 0');
    assert.ok(hasEmptyState, 'Blog hub must implement empty state feedback');
  });
});
