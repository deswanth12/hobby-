import fs from 'fs';

let code = fs.readFileSync('src/services/adminStorage.ts', 'utf8');

// 1. Update import
code = code.replace(
  /SettingsOverrides\s*[\r\n]+}\s*from '\.\.\/types\/admin';/,
  `SettingsOverrides,
  AdminPost
} from '../types/admin';`
);

// 2. In fetchContentRemote, parse posts
const parseFaqsAnchor = 'current.faqs = current.faqs || {};';
const postsParseCode = `current.posts = current.posts || {};
        (body.allPosts || body.posts || []).forEach((p: AdminPost) => {
          if (p.slug) {
            current.posts![p.slug.toLowerCase().trim()] = p;
          }
        });

        `;

if (!code.includes('current.posts = current.posts || {};')) {
  code = code.replace(parseFaqsAnchor, postsParseCode + parseFaqsAnchor);
}

// 3. Add getPosts, getPostBySlug, savePost, deletePost
const methodsAnchor = 'resetContentOverrides(): boolean {';
const postMethods = `getPosts(): AdminPost[] {
    const current = this.getContentOverrides();
    const postsObj = current.posts || {};
    return Object.values(postsObj).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getPostBySlug(slug: string): AdminPost | undefined {
    const current = this.getContentOverrides();
    return current.posts?.[slug.toLowerCase().trim()];
  },

  savePost(post: AdminPost): boolean {
    const cleanSlug = (post.slug || '').toLowerCase().trim();
    if (!cleanSlug) return false;

    const current = this.getContentOverrides();
    current.posts = current.posts || {};
    current.posts[cleanSlug] = {
      ...post,
      slug: cleanSlug,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
    } catch (e) {
      console.error('Failed to save post override:', e);
      return false;
    }

    const session = this.getSession();

    fetch(\`/api/admin/content/posts/\${cleanSlug}\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': \`Bearer \${session.token}\` } : {})
      },
      body: JSON.stringify(post)
    }).catch(() => {});

    return true;
  },

  deletePost(slug: string): boolean {
    const cleanSlug = (slug || '').toLowerCase().trim();
    if (!cleanSlug) return false;

    const current = this.getContentOverrides();
    if (current.posts && current.posts[cleanSlug]) {
      delete current.posts[cleanSlug];
      try {
        localStorage.setItem(CONTENT_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent(FIRM_DATA_UPDATE_EVENT));
      } catch (e) {
        console.error('Failed to delete post:', e);
        return false;
      }
    }

    const session = this.getSession();

    fetch(\`/api/admin/content/posts/\${cleanSlug}\`, {
      method: 'DELETE',
      headers: {
        ...(session ? { 'Authorization': \`Bearer \${session.token}\` } : {})
      }
    }).catch(() => {});

    return true;
  },

  `;

if (!code.includes('getPosts(): AdminPost[]')) {
  code = code.replace(methodsAnchor, postMethods + methodsAnchor);
}

fs.writeFileSync('src/services/adminStorage.ts', code, 'utf8');
console.log('Successfully updated src/services/adminStorage.ts');
