import fs from 'fs';

let code = fs.readFileSync('src/services/blogService.ts', 'utf8');

// 1. Add adminStorage import at top if not present
if (!code.includes("import { adminStorage } from './adminStorage';")) {
  code = `import { adminStorage } from './adminStorage';\n` + code;
}

// 2. Add getEffectivePosts function
const getEffectivePostsCode = `
/**
 * Resolves effective posts merging static repository files with dynamic admin console overrides.
 */
function getEffectivePosts(): BlogPost[] {
  const map = new Map<string, BlogPost>();
  // 1. Static posts from repository
  allLoadedPosts.forEach(p => {
    map.set(p.slug.toLowerCase().trim(), p);
  });
  // 2. Dynamic posts and overrides from adminStorage
  if (typeof window !== 'undefined') {
    try {
      const customPosts = adminStorage.getPosts();
      customPosts.forEach(cp => {
        map.set(cp.slug.toLowerCase().trim(), {
          slug: cp.slug,
          title: cp.title,
          date: cp.date,
          author: cp.author,
          authorRole: cp.authorRole,
          coverImage: cp.coverImage,
          coverImageAlt: cp.coverImageAlt,
          excerpt: cp.excerpt,
          tags: cp.tags,
          draft: cp.draft,
          content: cp.content,
          readingTime: cp.readingTime || calculateReadingTime(cp.content),
          seo: cp.seo
        });
      });
    } catch {
      // Fallback to static posts
    }
  }
  return Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
`;

if (!code.includes('function getEffectivePosts()')) {
  code = code.replace('export const BlogService = {', getEffectivePostsCode + '\nexport const BlogService = {');
}

// 3. Update getAllPosts and getPostBySlug inside BlogService
const oldGetAllPosts = `  getAllPosts: (includeDrafts: boolean = false): BlogPost[] => {
    if (includeDrafts) {
      return allLoadedPosts;
    }
    return allLoadedPosts.filter(p => !p.draft);
  },`;

const newGetAllPosts = `  getAllPosts: (includeDrafts: boolean = false): BlogPost[] => {
    const effective = getEffectivePosts();
    if (includeDrafts) {
      return effective;
    }
    return effective.filter(p => !p.draft);
  },`;

code = code.replace(oldGetAllPosts, newGetAllPosts);

const oldGetPostBySlug = `  getPostBySlug: (slug: string, includeDrafts: boolean = false): BlogPost | undefined => {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().trim();
    return allLoadedPosts.find(p => p.slug.toLowerCase() === cleanSlug && (includeDrafts || !p.draft));
  },`;

const newGetPostBySlug = `  getPostBySlug: (slug: string, includeDrafts: boolean = false): BlogPost | undefined => {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().trim();
    const effective = getEffectivePosts();
    return effective.find(p => p.slug.toLowerCase() === cleanSlug && (includeDrafts || !p.draft));
  },`;

code = code.replace(oldGetPostBySlug, newGetPostBySlug);

fs.writeFileSync('src/services/blogService.ts', code, 'utf8');
console.log('Successfully updated src/services/blogService.ts');
