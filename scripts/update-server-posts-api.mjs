import fs from 'fs';

// 1. Update server/db.cjs
let dbCode = fs.readFileSync('server/db.cjs', 'utf8');

if (!dbCode.includes('posts: [],')) {
  dbCode = dbCode.replace('enquiries: [],', 'posts: [],\n  enquiries: [],');
}

if (!dbCode.includes('parsed.posts = parsed.posts || [];')) {
  dbCode = dbCode.replace(
    'const raw = fs.readFileSync(DB_PATH, \'utf8\');\n    return JSON.parse(raw);',
    `const raw = fs.readFileSync(DB_PATH, 'utf8');\n    const parsed = JSON.parse(raw);\n    parsed.posts = parsed.posts || [];\n    return parsed;`
  );
}

fs.writeFileSync('server/db.cjs', dbCode, 'utf8');
console.log('Successfully updated server/db.cjs');

// 2. Update server/apiRouter.cjs
let apiCode = fs.readFileSync('server/apiRouter.cjs', 'utf8');

// Update public /api/content
const oldContentEndpoint = `    return sendJson(res, 200, {
      services: db.services.filter(s => s.status === 'published'),
      allServices: db.services,
      faqs: db.faqs.filter(f => f.status === 'published'),
      allFaqs: db.faqs,
      settings: db.settings
    });`;

const newContentEndpoint = `    return sendJson(res, 200, {
      services: db.services.filter(s => s.status === 'published'),
      allServices: db.services,
      faqs: db.faqs.filter(f => f.status === 'published'),
      allFaqs: db.faqs,
      posts: (db.posts || []).filter(p => !p.draft),
      allPosts: db.posts || [],
      settings: db.settings
    });`;

apiCode = apiCode.replace(oldContentEndpoint, newContentEndpoint);

// Add post update & delete endpoints
const postEndpoints = `  // --- E2. Update / Create Post Content ---
  if ((method === 'PUT' || method === 'POST') && pathname.startsWith('/api/admin/content/posts/')) {
    const slug = pathname.replace('/api/admin/content/posts/', '').toLowerCase().trim();
    const body = await parseJsonBody(req);
    db.posts = db.posts || [];
    let post = db.posts.find(p => p.slug.toLowerCase().trim() === slug);

    if (!post) {
      post = { slug };
      db.posts.push(post);
    }

    if (body.title) post.title = body.title.trim();
    if (body.excerpt !== undefined) post.excerpt = body.excerpt.trim();
    if (body.content !== undefined) post.content = body.content;
    if (body.tags !== undefined) post.tags = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',').map(t => t.trim()).filter(Boolean);
    if (body.author) post.author = body.author.trim();
    if (body.authorRole) post.authorRole = body.authorRole.trim();
    if (body.coverImage !== undefined) post.coverImage = body.coverImage.trim();
    if (body.coverImageAlt !== undefined) post.coverImageAlt = body.coverImageAlt.trim();
    if (body.draft !== undefined) post.draft = Boolean(body.draft);
    if (body.readingTime !== undefined) post.readingTime = body.readingTime;
    if (body.seo !== undefined) post.seo = body.seo;
    if (!post.date) post.date = new Date().toISOString();
    post.updatedAt = new Date().toISOString();

    writeDb(db);
    return sendJson(res, 200, { success: true, post });
  }

  // --- E3. Delete Post Content ---
  if (method === 'DELETE' && pathname.startsWith('/api/admin/content/posts/')) {
    const slug = pathname.replace('/api/admin/content/posts/', '').toLowerCase().trim();
    db.posts = (db.posts || []).filter(p => p.slug.toLowerCase().trim() !== slug);
    writeDb(db);
    return sendJson(res, 200, { success: true, message: \`Post \${slug} removed.\` });
  }

`;

const resetContentAnchor = `  // --- F. Reset Content to Baseline ---`;
if (!apiCode.includes('// --- E2. Update / Create Post Content ---')) {
  apiCode = apiCode.replace(resetContentAnchor, postEndpoints + resetContentAnchor);
}

// Update reset endpoint
const oldReset = `    db.services = JSON.parse(JSON.stringify(BASELINE_DATA.services));
    db.faqs = JSON.parse(JSON.stringify(BASELINE_DATA.faqs));`;

const newReset = `    db.services = JSON.parse(JSON.stringify(BASELINE_DATA.services));
    db.faqs = JSON.parse(JSON.stringify(BASELINE_DATA.faqs));
    db.posts = JSON.parse(JSON.stringify(BASELINE_DATA.posts || []));`;

apiCode = apiCode.replace(oldReset, newReset);

fs.writeFileSync('server/apiRouter.cjs', apiCode, 'utf8');
console.log('Successfully updated server/apiRouter.cjs');
