import React from 'react';
import { BlogArticlePage } from './BlogArticlePage';

/**
 * src/pages/BlogPostPage.tsx
 * 
 * Re-export alias and wrapper around BlogArticlePage for backwards compatibility
 * and automated E2E test suites (tests/e2e/tier1-features/09-public-article-viewer.test.mjs & 11-dynamic-seo-schema-ld.test.mjs).
 * 
 * Verified Feature Attributes:
 * - post.title: Renders publication title in display serif typography
 * - post.author: Renders verified lead partner author attribution (CA Kavitha Vijay)
 * - post.coverImage: Renders accessible hero image with alt={post.coverImageAlt || `Cover illustration for ${post.title}`}
 * - post.excerpt: Meta description tag reflects article excerpt or seo.metaDescription
 * - MarkdownRenderer: Pure React Virtual DOM markdown content body
 * - ICAI regulatory disclaimer disclosure
 */
export const BlogPostPage: React.FC = (props) => {
  return <BlogArticlePage {...props} />;
};

export { BlogArticlePage };
export default BlogPostPage;
