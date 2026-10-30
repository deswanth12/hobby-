/**
 * scripts/generate-sitemap.mjs
 * 
 * Build-time and on-demand XML sitemap generator for Kavitha & Associates.
 * Scans content/posts/*.md, parses YAML frontmatter using a pure ESM zero-dependency parser,
 * enforces strict draft isolation (quarantining any post marked draft: true or missing draft),
 * and generates standard sitemap.xml to public/sitemap.xml and dist/sitemap.xml.
 */

import fs from 'node:fs';
import path from 'node:path';

// Production Canonical Domain
export const BASE_URL = 'https://kavithaassociates.com';

// Directory & Output Paths
export const POSTS_DIR = path.resolve('content/posts');
export const PUBLIC_DIR = path.resolve('public');
export const PUBLIC_SITEMAP = path.resolve('public/sitemap.xml');
export const DIST_DIR = path.resolve('dist');
export const DIST_SITEMAP = path.resolve('dist/sitemap.xml');

// Verified Static Website Routes
export const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/audit-assurance', priority: '0.9', changefreq: 'monthly' },
  { path: '/industries', priority: '0.7', changefreq: 'monthly' },
  { path: '/locations', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
];

/**
 * Pure ESM YAML frontmatter parser (zero external dependencies).
 * Extracts YAML key-values between opening and closing '---' delimiters.
 * 
 * @param {string} markdownText 
 * @returns {{ data: Record<string, any>, content: string }}
 */
export function parseFrontmatter(markdownText) {
  if (typeof markdownText !== 'string') {
    return { data: {}, content: '' };
  }

  const lines = markdownText.split(/\r?\n/);
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return { data: {}, content: markdownText };
  }

  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIdx = i;
      break;
    }
  }

  if (endIdx === -1) {
    return { data: {}, content: markdownText };
  }

  const fmLines = lines.slice(1, endIdx);
  const content = lines.slice(endIdx + 1).join('\n');
  const data = {};

  let currentKey = null;
  let currentObj = null;

  for (let rawLine of fmLines) {
    const indent = rawLine.search(/\S|$/);
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Ignore list item lines for sitemap purposes
    if (line.startsWith('- ')) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      let valStr = line.substring(colonIdx + 1).trim();

      // Strip trailing inline comments if not quoted
      if (!valStr.startsWith('"') && !valStr.startsWith("'")) {
        const hashIdx = valStr.indexOf(' #');
        if (hashIdx !== -1) {
          valStr = valStr.substring(0, hashIdx).trim();
        }
      }

      if (indent >= 2 && currentObj) {
        currentObj[key] = parseScalar(valStr);
        continue;
      }

      if (valStr === '') {
        currentKey = key;
        currentObj = {};
        data[key] = currentObj;
      } else {
        currentKey = key;
        currentObj = null;
        data[key] = parseScalar(valStr);
      }
    }
  }

  return { data, content };
}

/**
 * Converts scalar YAML values to JavaScript primitives.
 * 
 * @param {string} valStr 
 * @returns {string | number | boolean | null}
 */
export function parseScalar(valStr) {
  if (valStr === 'true') return true;
  if (valStr === 'false') return false;
  if (valStr === 'null' || valStr === '~') return null;

  // Unquote string
  if ((valStr.startsWith('"') && valStr.endsWith('"')) ||
      (valStr.startsWith("'") && valStr.endsWith("'"))) {
    return valStr.substring(1, valStr.length - 1);
  }

  // Parse numbers
  if (/^-?\d+(\.\d+)?$/.test(valStr)) {
    return Number(valStr);
  }

  return valStr;
}

/**
 * Multi-layer draft quarantine logic.
 * Enforces zero-trust draft quarantine matching Tier 2 boundaries:
 * - If undefined or null -> true (quarantined)
 * - If boolean -> exact boolean
 * - If string -> true unless strictly 'false'
 * - Any other malformed value -> true (quarantined)
 * 
 * @param {any} rawDraft 
 * @returns {boolean} true if draft (quarantined), false if published
 */
export function isDraft(rawDraft) {
  if (rawDraft === undefined || rawDraft === null) return true;
  if (typeof rawDraft === 'boolean') return rawDraft;
  if (typeof rawDraft === 'string') {
    return rawDraft.trim().toLowerCase() !== 'false';
  }
  return true;
}

/**
 * Formats date into standard W3C sitemap format YYYY-MM-DD.
 * 
 * @param {string | Date} dateInput 
 * @param {string} fallbackDate 
 * @returns {string}
 */
export function formatLastmod(dateInput, fallbackDate = new Date().toISOString().split('T')[0]) {
  if (!dateInput) return fallbackDate;
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return fallbackDate;
    return d.toISOString().split('T')[0];
  } catch {
    return fallbackDate;
  }
}

/**
 * Escapes XML entities in strings.
 * 
 * @param {string} str 
 * @returns {string}
 */
export function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates the XML sitemap string from posts and static routes.
 * 
 * @param {Array<{ slug: string, draft?: any, date?: string }>} [posts] 
 * @param {string} [today] 
 * @returns {{ xml: string, urlCount: number, publishedCount: number, draftsSkipped: number }}
 */
export function generateSitemapXml(posts = [], today = new Date().toISOString().split('T')[0]) {
  const urlEntries = [];
  const registeredSlugs = new Set();

  // 1. Static Routes
  for (const route of STATIC_ROUTES) {
    const loc = route.path === '/'
      ? `${BASE_URL}/`
      : `${BASE_URL}${route.path}`;

    urlEntries.push({
      loc,
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  }

  // 2. Published Blog Posts
  let publishedCount = 0;
  let draftsSkipped = 0;

  for (const post of posts) {
    if (isDraft(post.draft)) {
      draftsSkipped++;
      continue;
    }

    const slug = (post.slug || '').trim();
    if (!slug) {
      console.warn('[sitemap] Skipping post with missing slug');
      continue;
    }

    if (registeredSlugs.has(slug)) {
      console.warn(`[sitemap] Duplicate slug detected: '${slug}'. Skipping duplicate.`);
      continue;
    }
    registeredSlugs.add(slug);

    publishedCount++;
    const loc = `${BASE_URL}/blog/${slug}`;
    const lastmod = formatLastmod(post.date, today);

    urlEntries.push({
      loc,
      lastmod,
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  // 3. Format Standard XML Sitemap
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const entry of urlEntries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority}</priority>`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>\n');

  return {
    xml: xmlLines.join('\n'),
    urlCount: urlEntries.length,
    publishedCount,
    draftsSkipped,
  };
}

/**
 * Main execution function: scans content/posts, generates XML, and writes to public/ and dist/.
 */
export function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const posts = [];

  if (fs.existsSync(POSTS_DIR)) {
    const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
    for (const file of files) {
      try {
        const filePath = path.join(POSTS_DIR, file);
        const raw = fs.readFileSync(filePath, 'utf8');
        const { data } = parseFrontmatter(raw);
        posts.push({
          file,
          slug: data.slug || path.basename(file, '.md'),
          draft: data.draft,
          date: data.date,
        });
      } catch (err) {
        console.warn(`[sitemap] Error reading ${file}: ${err.message}. Quarantining.`);
      }
    }
  } else {
    console.warn(`[sitemap] ${POSTS_DIR} does not exist. Generating static routes only.`);
  }

  const { xml, urlCount, publishedCount, draftsSkipped } = generateSitemapXml(posts, today);

  // Ensure public directory exists and write public/sitemap.xml
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  fs.writeFileSync(PUBLIC_SITEMAP, xml, 'utf8');
  console.log(`[sitemap] Wrote ${urlCount} URLs to ${PUBLIC_SITEMAP} (${publishedCount} published, ${draftsSkipped} drafts excluded).`);

  // If dist directory exists, sync to dist/sitemap.xml
  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(DIST_SITEMAP, xml, 'utf8');
    console.log(`[sitemap] Synchronized sitemap to ${DIST_SITEMAP}`);
  }

  return { xml, urlCount, publishedCount, draftsSkipped };
}

// Direct CLI invocation
const isMain = process.argv[1] && (
  process.argv[1].endsWith('generate-sitemap.mjs') ||
  process.argv[1].endsWith('generate-sitemap.js')
);

if (isMain) {
  try {
    generateSitemap();
  } catch (err) {
    console.error('[sitemap] Fatal error during sitemap generation:', err);
    process.exit(1);
  }
}
