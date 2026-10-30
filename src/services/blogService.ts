/**
 * src/services/blogService.ts
 * 
 * Zero-cost, static Git-based blog loader for Kavitha & Associates.
 * Reads Markdown articles from content/posts/*.md at build time using Vite's import.meta.glob,
 * parses YAML frontmatter with strict type checking, calculates reading times,
 * and enforces strict draft exclusion for public website rendering.
 */

export interface BlogPostSEO {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  authorRole: string;
  coverImage?: string;
  coverImageAlt?: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  content: string;
  readingTime: number;
  seo?: BlogPostSEO;
}

/**
 * Pure TypeScript YAML frontmatter parser.
 * Securely extracts frontmatter attributes without eval or external dependencies.
 */
function parseFrontmatter(raw: string): { data: Record<string, any>; content: string } {
  if (!raw || typeof raw !== 'string') {
    return { data: {}, content: '' };
  }

  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: raw.trim() };
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const data: Record<string, any> = {};

  const lines = yamlBlock.split(/\r?\n/);
  let currentArrayKey: string | null = null;
  let currentNestedObjKey: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Check for nested indentation (2 spaces)
    if (line.startsWith('  ') && currentNestedObjKey) {
      const nestedMatch = trimmed.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (nestedMatch) {
        const k = nestedMatch[1];
        let val = nestedMatch[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!data[currentNestedObjKey]) data[currentNestedObjKey] = {};
        data[currentNestedObjKey][k] = val;
      }
      continue;
    }

    // Check for list item (- item)
    if (trimmed.startsWith('- ') && currentArrayKey) {
      let val = trimmed.slice(2).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!Array.isArray(data[currentArrayKey])) {
        data[currentArrayKey] = [];
      }
      data[currentArrayKey].push(val);
      continue;
    }

    // Top-level key
    currentArrayKey = null;
    currentNestedObjKey = null;

    const keyMatch = trimmed.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!keyMatch) continue;

    const key = keyMatch[1];
    let val = keyMatch[2].trim();

    if (val === '') {
      // Possible start of array or object
      currentArrayKey = key;
      currentNestedObjKey = key;
      continue;
    }

    // Handle quoted string
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      data[key] = val.slice(1, -1);
      continue;
    }

    // Handle boolean
    if (val === 'true') {
      data[key] = true;
      continue;
    }
    if (val === 'false') {
      data[key] = false;
      continue;
    }

    // Handle number
    if (!isNaN(Number(val))) {
      data[key] = Number(val);
      continue;
    }

    data[key] = val;
  }

  return { data, content };
}

/**
 * Calculates estimated reading time in minutes (avg 200 words per minute).
 */
function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}

// Vite glob import of all markdown posts in /content/posts/
const rawPostFiles = import.meta.glob('/content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Transform raw files into typed BlogPost models
const allLoadedPosts: BlogPost[] = Object.entries(rawPostFiles).map(([filePath, rawContent]) => {
  const { data, content } = parseFrontmatter(rawContent);

  // Derive fallback slug from filename if not specified in frontmatter
  const filename = filePath.split('/').pop()?.replace(/\.md$/, '') || '';
  const slug = data.slug || filename;

  return {
    slug,
    title: data.title || 'Untitled Professional Commentary',
    date: data.date || new Date().toISOString(),
    author: data.author || 'CA Kavitha Vijay',
    authorRole: data.authorRole || 'Managing Partner (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49)',
    coverImage: data.coverImage,
    coverImageAlt: data.coverImageAlt,
    excerpt: data.excerpt || 'Technical commentary and statutory advisory from Kavitha & Associates.',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: data.draft === true,
    content,
    readingTime: calculateReadingTime(content),
    seo: data.seo,
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

/**
 * Public Blog API:
 * Strictly excludes drafts unless includeDrafts is explicitly passed as true.
 */
export const BlogService = {
  /**
   * Retrieves all published blog posts (drafts strictly excluded by default).
   */
  getAllPosts: (includeDrafts: boolean = false): BlogPost[] => {
    if (includeDrafts) {
      return allLoadedPosts;
    }
    return allLoadedPosts.filter(p => !p.draft);
  },

  /**
   * Retrieves a single post by slug.
   * By default, returns undefined if the post is marked draft: true.
   */
  getPostBySlug: (slug: string, includeDrafts: boolean = false): BlogPost | undefined => {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().trim();
    return allLoadedPosts.find(p => p.slug.toLowerCase() === cleanSlug && (includeDrafts || !p.draft));
  },

  /**
   * Retrieves related articles based on matching tags, excluding the current article and all drafts.
   */
  getRelatedPosts: (currentSlug: string, limit: number = 3): BlogPost[] => {
    const current = BlogService.getPostBySlug(currentSlug, false);
    if (!current) return [];

    const published = BlogService.getAllPosts(false).filter(p => p.slug !== current.slug);
    
    // Score posts by common tags
    const scored = published.map(post => {
      const common = post.tags.filter(t => current.tags.includes(t)).length;
      return { post, score: common };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(s => s.post);
  },

  /**
   * Retrieves all unique categories/tags across published articles.
   */
  getAllTags: (): string[] => {
    const tagsSet = new Set<string>();
    BlogService.getAllPosts(false).forEach(p => {
      p.tags.forEach(t => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }
};
