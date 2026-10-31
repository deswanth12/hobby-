import fs from 'fs';

// 1. Fix src/pages/admin/AdminContentPage.tsx
let contentPage = fs.readFileSync('src/pages/admin/AdminContentPage.tsx', 'utf8');
contentPage = contentPage.replace('  Clock,\n  Tag,\n  FileText\n', '  Clock,\n  Tag\n');
contentPage = contentPage.replace('  Clock,\r\n  Tag,\r\n  FileText\r\n', '  Clock,\r\n  Tag\r\n');
fs.writeFileSync('src/pages/admin/AdminContentPage.tsx', contentPage, 'utf8');
console.log('Fixed AdminContentPage.tsx');

// 2. Fix src/services/blogService.ts
let blogService = fs.readFileSync('src/services/blogService.ts', 'utf8');

blogService = blogService.replace(
  /getAllPosts:\s*\(includeDrafts:\s*boolean\s*=\s*false\):\s*BlogPost\[\]\s*=>\s*\{[\s\S]*?return allLoadedPosts\.filter\(p => !p\.draft\);\s*\}/,
  `getAllPosts: (includeDrafts: boolean = false): BlogPost[] => {
    const posts = getEffectivePosts();
    if (includeDrafts) {
      return posts;
    }
    return posts.filter(p => !p.draft);
  }`
);

blogService = blogService.replace(
  /getPostBySlug:\s*\(slug:\s*string,\s*includeDrafts:\s*boolean\s*=\s*false\):\s*BlogPost \| undefined\s*=>\s*\{[\s\S]*?return allLoadedPosts\.find\([\s\S]*?\);\s*\}/,
  `getPostBySlug: (slug: string, includeDrafts: boolean = false): BlogPost | undefined => {
    if (!slug) return undefined;
    const cleanSlug = slug.toLowerCase().trim();
    const posts = getEffectivePosts();
    return posts.find(p => p.slug.toLowerCase() === cleanSlug && (includeDrafts || !p.draft));
  }`
);

fs.writeFileSync('src/services/blogService.ts', blogService, 'utf8');
console.log('Fixed blogService.ts');
