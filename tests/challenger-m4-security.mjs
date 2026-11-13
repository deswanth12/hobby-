/**
 * tests/challenger-m4-security.mjs
 * 
 * Standalone Adversarial Verification Suite for Milestone 4:
 * 1. Triple-Layer Draft Quarantine Penetration (internal-audit-best-practices.md)
 * 2. XSS & Frontmatter Injection Immunity (Pure Virtual DOM, zero dangerouslySetInnerHTML)
 * 3. R4 Regulatory Compliance & Privacy Safeguards (CMA AIR 49 ICMAI attribution, zero PANs/Aadhaar/MRNs)
 * 4. Blog Ergonomics & Touch Target Compliance (16:10 aspect ratio, 100% overlay clickability, min-h-[44px])
 * 
 * Executed independently by challenger_m4_2.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

console.log('========================================================================');
console.log('  CHALLENGER M4-2: ADVERSARIAL SECURITY, DRAFT QUARANTINE & R4 AUDIT   ');
console.log('========================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];
const findings = [];

function test(name, fn) {
  try {
    fn();
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    failures.push({ name, error: err.message });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${err.message}`);
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    failures.push({ name, error: err.message });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${err.message}`);
  }
}

// Recursive file scanner helper
function getAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx', '.json']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.some(ext => file.endsWith(ext))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// Initialize Vite SSR Runner
let vite = null;
let blogServiceModule = null;
let contentAdapterModule = null;
let markdownLibModule = null;
let markdownRendererModule = null;
let pagesModule = null;

try {
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: {
      noDiscovery: true,
      entries: [],
      include: [],
    },
    resolve: {
      alias: {
        'react-router-dom': path.resolve('node_modules/react-router-dom/dist/index.mjs'),
      },
    },
  });

  blogServiceModule = await vite.ssrLoadModule('/src/services/blogService.ts');
  contentAdapterModule = await vite.ssrLoadModule('/src/v8/adapters/contentAdapter.ts');
  markdownLibModule = await vite.ssrLoadModule('/src/lib/markdown.ts');
  markdownRendererModule = await vite.ssrLoadModule('/src/components/MarkdownRenderer.tsx');
  pagesModule = await vite.ssrLoadModule('/src/v8/pages/index.ts');
} catch (err) {
  console.error('FATAL: Vite SSR server initialization failed:', err);
  process.exit(1);
}

// ============================================================================
// SUITE 1: TRIPLE-LAYER DRAFT QUARANTINE PENETRATION ATTACK
// ============================================================================
console.log('▶ Suite 1: Triple-Layer Draft Quarantine Penetration Attack');

const DRAFT_SLUG = 'internal-audit-best-practices';

test('[Quarantine-1] Target draft vector file exists on disk with draft: true frontmatter', () => {
  const filePath = path.resolve('content/posts/internal-audit-best-practices.md');
  assert.ok(fs.existsSync(filePath), `Expected draft file at ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert.match(content, /^draft:\s*true/m, 'Frontmatter must have draft: true');
  assert.match(content, /^slug:\s*["']?internal-audit-best-practices["']?/m, 'Frontmatter must have correct slug');
});

test('[Quarantine-2] BlogService.getPostBySlug(slug, false) returns undefined for draft article', () => {
  const post = blogServiceModule.BlogService.getPostBySlug(DRAFT_SLUG, false);
  assert.strictEqual(post, undefined, 'Public lookup of draft article must return undefined');
});

test('[Quarantine-3] BlogService.getPostBySlug(slug, true) returns post with draft: true (Internal/Admin only)', () => {
  const post = blogServiceModule.BlogService.getPostBySlug(DRAFT_SLUG, true);
  assert.ok(post, 'Admin/internal lookup must be able to retrieve post');
  assert.strictEqual(post.draft, true, 'Draft flag must be boolean true');
  assert.strictEqual(post.slug, DRAFT_SLUG, 'Slug must match');
});

test('[Quarantine-4] BlogService.getPostBySlug adversarial input mutations return undefined', () => {
  const attackVectors = [
    'INTERNAL-AUDIT-BEST-PRACTICES',
    'Internal-Audit-Best-Practices',
    '  internal-audit-best-practices  ',
    'internal-audit-best-practices.md',
    '/blog/internal-audit-best-practices',
    'internal-audit-best-practices/',
    '../posts/internal-audit-best-practices',
    'internal-audit-best-practices%00',
    'internal-audit-best-practices?preview=true',
    "internal-audit-best-practices' OR '1'='1",
  ];

  for (const v of attackVectors) {
    const post = blogServiceModule.BlogService.getPostBySlug(v, false);
    assert.strictEqual(post, undefined, `Bypass attempt with "${v}" must return undefined`);
  }
});

test('[Quarantine-5] contentAdapter.getArticleBySlug(slug) returns undefined for draft article', () => {
  const post = contentAdapterModule.getArticleBySlug(DRAFT_SLUG);
  assert.strictEqual(post, undefined, 'contentAdapter public accessor must return undefined for draft');
});

test('[Quarantine-6] contentAdapter.getPublishedArticles() excludes draft article and contains only published articles', () => {
  const published = contentAdapterModule.getPublishedArticles();
  assert.ok(Array.isArray(published), 'getPublishedArticles must return an array');
  assert.ok(published.length > 0, 'Must have at least 1 published article');
  
  const foundDraft = published.find(p => p.slug === DRAFT_SLUG);
  assert.strictEqual(foundDraft, undefined, 'Draft article must NOT appear in getPublishedArticles');
  
  for (const p of published) {
    assert.strictEqual(p.draft, false, `Article "${p.slug}" in published list must have draft: false`);
  }
});

test('[Quarantine-7] contentAdapter.getFeaturedInsights() excludes draft article', () => {
  const featured = contentAdapterModule.getFeaturedInsights();
  assert.ok(featured, 'Featured insights bundle must exist');
  assert.notStrictEqual(featured.leadArticle.slug, DRAFT_SLUG, 'Lead article must not be draft');
  assert.strictEqual(featured.leadArticle.draft, false, 'Lead article draft property must be false');
  
  for (const companion of featured.companionArticles) {
    assert.notStrictEqual(companion.slug, DRAFT_SLUG, 'Companion article must not be draft');
    assert.strictEqual(companion.draft, false, 'Companion article draft property must be false');
  }
});

test('[Quarantine-8] contentAdapter.getRelatedArticles() never leaks draft article', () => {
  const published = contentAdapterModule.getPublishedArticles();
  for (const pub of published) {
    const related = contentAdapterModule.getRelatedArticles(pub.slug, 5);
    const leakedDraft = related.find(p => p.slug === DRAFT_SLUG);
    assert.strictEqual(leakedDraft, undefined, `Related articles for ${pub.slug} must not include draft`);
    for (const r of related) {
      assert.strictEqual(r.draft, false, `Related article "${r.slug}" must have draft: false`);
    }
  }
});

test('[Quarantine-9] contentAdapter.searchPublishedArticles() with draft keywords yields zero draft results', () => {
  const draftQueries = [
    'internal audit',
    'Risk-Based Internal Audit',
    'Section 138',
    'RBIA',
    'Operational Risk Appraisal',
    'Companies (Accounts) Rules, 2014',
    'Procure-to-Pay',
    'DRAFT WORKING PAPER',
  ];

  for (const q of draftQueries) {
    const results = contentAdapterModule.searchPublishedArticles(q);
    const foundDraft = results.find(p => p.slug === DRAFT_SLUG);
    assert.strictEqual(foundDraft, undefined, `Search query "${q}" must NOT surface draft article`);
    for (const res of results) {
      assert.strictEqual(res.draft, false, `Search query "${q}" returned item with draft: false`);
    }
  }
});

test('[Quarantine-10] isDraft() helper enforces fail-closed behavior on null, undefined, and non-false values', () => {
  const isDraftFn = blogServiceModule.isDraft;
  assert.strictEqual(isDraftFn(undefined), true, 'undefined must fail-closed to draft: true');
  assert.strictEqual(isDraftFn(null), true, 'null must fail-closed to draft: true');
  assert.strictEqual(isDraftFn(true), true, 'boolean true must be draft: true');
  assert.strictEqual(isDraftFn('true'), true, 'string "true" must be draft: true');
  assert.strictEqual(isDraftFn('True'), true, 'string "True" must be draft: true');
  assert.strictEqual(isDraftFn('unknown'), true, 'unknown string must fail-closed to draft: true');
  assert.strictEqual(isDraftFn({}), true, 'object must fail-closed to draft: true');
  assert.strictEqual(isDraftFn(1), true, 'number 1 must fail-closed to draft: true');
  assert.strictEqual(isDraftFn(false), false, 'boolean false must be draft: false');
  assert.strictEqual(isDraftFn('false'), false, 'string "false" must be draft: false');
  assert.strictEqual(isDraftFn('  false  '), false, 'padded "false" must be draft: false');
});

test('[Quarantine-11] public/sitemap.xml and dist/sitemap.xml strictly exclude draft article', () => {
  const sitemapPublicPath = path.resolve('public/sitemap.xml');
  const sitemapDistPath = path.resolve('dist/sitemap.xml');

  assert.ok(fs.existsSync(sitemapPublicPath), 'public/sitemap.xml must exist');
  const publicContent = fs.readFileSync(sitemapPublicPath, 'utf8');
  assert.strictEqual(publicContent.includes('internal-audit-best-practices'), false, 'public/sitemap.xml must NOT contain draft slug');

  // Verify published articles are present in sitemap
  assert.ok(publicContent.includes('corporate-tax-planning-2026'), 'Published article 1 must be in sitemap');
  assert.ok(publicContent.includes('gst-annual-return-compliance'), 'Published article 2 must be in sitemap');
  assert.ok(publicContent.includes('statutory-audit-guidelines-2026'), 'Published article 3 must be in sitemap');

  if (fs.existsSync(sitemapDistPath)) {
    const distContent = fs.readFileSync(sitemapDistPath, 'utf8');
    assert.strictEqual(distContent.includes('internal-audit-best-practices'), false, 'dist/sitemap.xml must NOT contain draft slug');
  }
});

test('[Quarantine-12] BlogArticlePage source code verifies canonical 404 gate when post is undefined/draft', () => {
  const articlePagePath = path.resolve('src/v8/pages/BlogArticlePage.tsx');
  const code = fs.readFileSync(articlePagePath, 'utf8');
  assert.match(code, /getArticleBySlug/, 'Must call getArticleBySlug to resolve post');
  assert.match(code, /if\s*\(!post\)\s*\{\s*return\s*<NotFoundPage\s*\/>;\s*\}/, 'Must immediately return <NotFoundPage /> if post is falsy');
});

// ============================================================================
// SUITE 2: XSS & FRONTMATTER INJECTION ATTACK SUITE
// ============================================================================
console.log('\n▶ Suite 2: XSS & Frontmatter Injection Attack Suite');

test('[XSS-1] Zero dangerouslySetInnerHTML in all V8 components and pages', () => {
  const v8Files = getAllFiles(path.resolve('src/v8'), ['.ts', '.tsx']);
  assert.ok(v8Files.length > 20, 'Should find > 20 V8 source files');
  
  const dangerousOccurrences = [];
  for (const file of v8Files) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('dangerouslySetInnerHTML')) {
      dangerousOccurrences.push(path.relative(process.cwd(), file));
    }
  }

  assert.deepStrictEqual(dangerousOccurrences, [], `Found dangerouslySetInnerHTML in: ${dangerousOccurrences.join(', ')}`);
});

test('[XSS-2] MarkdownRenderer and markdown utility do not use innerHTML, outerHTML, or eval', () => {
  const markdownRendererPath = path.resolve('src/components/MarkdownRenderer.tsx');
  const markdownLibPath = path.resolve('src/lib/markdown.ts');

  for (const p of [markdownRendererPath, markdownLibPath]) {
    const content = fs.readFileSync(p, 'utf8');
    assert.strictEqual(content.includes('dangerouslySetInnerHTML'), false, `${p} must not contain dangerouslySetInnerHTML`);
    assert.strictEqual(/\.innerHTML\s*=/.test(content), false, `${p} must not assign to innerHTML`);
    assert.strictEqual(/\.outerHTML\s*=/.test(content), false, `${p} must not assign to outerHTML`);
    assert.strictEqual(/\beval\s*\(/.test(content), false, `${p} must not call eval()`);
    assert.strictEqual(/new\s+Function\s*\(/.test(content), false, `${p} must not construct Function()`);
  }
});

test('[XSS-3] isSafeUrl() oracle blocks all dangerous protocols, obfuscation, and control chars', () => {
  const isSafeUrl = markdownLibModule.isSafeUrl;

  const maliciousUrls = [
    'javascript:alert(1)',
    'JAVASCRIPT:alert(document.cookie)',
    '  javascript:alert(1)  ',
    'javascript\x00:alert(1)',
    'javascript%3Aalert(1)',
    'data:text/html,<script>alert(1)</script>',
    'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
    'vbscript:msgbox(1)',
    'VBSCRIPT:msgbox(1)',
    'file:///etc/passwd',
    'FILE:///C:/Windows/win.ini',
    '//evil.com/xss.js',
    '\\\\evil.com\\share',
    '/\\evil.com',
    '/ /evil.com',
    'https://evil.com\x00/exploit',
    'https://evil.com\x07/exploit',
  ];

  for (const url of maliciousUrls) {
    assert.strictEqual(isSafeUrl(url), false, `isSafeUrl must reject dangerous URL: "${url}"`);
  }

  const legitimateUrls = [
    'https://kavithaassociates.com/blog',
    'https://www.icai.org/post.html?id=123',
    'http://localhost:5173',
    '/services/audit-assurance',
    '/blog/corporate-tax-planning-2026',
    'mailto:office@kavithaassociates.com',
    'tel:+919985336699',
  ];

  for (const url of legitimateUrls) {
    assert.strictEqual(isSafeUrl(url), true, `isSafeUrl must accept legitimate URL: "${url}"`);
  }
});

test('[XSS-4] sanitizeMarkdown() strips active executable tags and dangerous links', () => {
  const sanitizeMarkdown = markdownLibModule.sanitizeMarkdown;

  const testVectors = [
    {
      input: 'Normal text <script>alert(1)</script> continues here.',
      expectedNotMatch: /<script/i,
    },
    {
      input: '<script src="https://evil.com/payload.js"></script>',
      expectedNotMatch: /<script/i,
    },
    {
      input: '<iframe src="https://evil.com"></iframe>',
      expectedNotMatch: /<iframe/i,
    },
    {
      input: '<object data="exploit.swf"></object>',
      expectedNotMatch: /<object/i,
    },
    {
      input: '<embed src="exploit.pdf">',
      expectedNotMatch: /<embed/i,
    },
    {
      input: '<style>body { display: none; }</style>',
      expectedNotMatch: /<style/i,
    },
    {
      input: '<img src="x" onerror="alert(1)">',
      expectedNotMatch: /onerror/i,
    },
    {
      input: '<a href="javascript:alert(1)">Click Me</a>',
      expectedNotMatch: /href="javascript:/i,
    },
    {
      input: '[Exploit Link](javascript:alert(1))',
      expectedNotMatch: /\(javascript:/i,
    },
    {
      input: '[Data Link](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)',
      expectedNotMatch: /\(data:/i,
    },
  ];

  for (const { input, expectedNotMatch } of testVectors) {
    const cleaned = sanitizeMarkdown(input);
    assert.strictEqual(expectedNotMatch.test(cleaned), false, `sanitizeMarkdown failed to neutralize: "${input}" -> got "${cleaned}"`);
  }
});

test('[XSS-5] MarkdownRenderer renders complex markdown to React Virtual DOM safely', () => {
  const MarkdownRenderer = markdownRendererModule.MarkdownRenderer;
  assert.ok(MarkdownRenderer, 'MarkdownRenderer component must be exported');

  const adversarialMarkdown = `
# Main Advisory Heading <script>alert("H1_XSS")</script>

An executive paragraph with **bold legislation** and *italicized statute*, plus \`code inline\`.

[Malicious Markdown Link](javascript:alert("LINK_XSS"))
[Legitimate Guide](https://kavithaassociates.com/services/audit-assurance)

| Header 1 | Header 2 |
| :--- | :--- |
| Normal Cell | <img src="x" onerror="alert('IMG_XSS')"> |
| [Row Link](javascript:void(0)) | Safe Reference |

> Statutory Blockquote citation under Section 143(3).

\`\`\`typescript
const x = 10;
// Code sample
\`\`\`

- Bullet item 1
- Bullet item 2 with [Link](javascript:alert(1))

1. Ordered item 1
2. Ordered item 2
`;

  const element = React.createElement(MarkdownRenderer, { content: adversarialMarkdown, demoteHeadings: true });
  const htmlOutput = renderToStaticMarkup(element);

  // Assert output is valid HTML string and contains NO executable scripts or javascript: hrefs
  assert.ok(typeof htmlOutput === 'string' && htmlOutput.length > 100, 'HTML output must be produced');
  assert.strictEqual(/<script/i.test(htmlOutput), false, 'Output must NOT contain <script> tags');
  assert.strictEqual(/javascript:/i.test(htmlOutput), false, 'Output must NOT contain javascript: protocols');
  assert.strictEqual(/onerror=/i.test(htmlOutput), false, 'Output must NOT contain onerror attributes');
  assert.strictEqual(/<h1\b/i.test(htmlOutput), false, 'Headings must be demoted (no H1 when demoteHeadings: true)');
  assert.ok(/<h2\b/i.test(htmlOutput), 'H1 should be demoted to H2');
});

// ============================================================================
// SUITE 3: STRICT R4 REGULATORY COMPLIANCE & PRIVACY LEAKAGE SCAN
// ============================================================================
console.log('\n▶ Suite 3: Strict R4 Regulatory Compliance & Privacy Leakage Scan');

const allV8SourceFiles = getAllFiles(path.resolve('src/v8'), ['.ts', '.tsx']);

test('[R4-1] Absolute quarantine of partner portrait filename across all V8 code', () => {
  const bannedPortraits = [
    'ca-kavitha-vijay.webp',
    'ca-kavitha-vijay.png',
    'ca-kavitha-vijay.jpg',
    'ca-kavitha-vijay.jpeg',
    'kavitha-photo',
    'kavitha-portrait',
  ];

  for (const file of allV8SourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const banned of bannedPortraits) {
      assert.strictEqual(
        content.includes(banned), 
        false, 
        `Prohibited partner portrait string "${banned}" found in ${path.relative(process.cwd(), file)}`
      );
    }
  }
});

test('[R4-2] Absolute privacy scan: Zero personal Indian Tax IDs (PAN) in V8 code', () => {
  // Indian PAN pattern: 5 uppercase letters + 4 digits + 1 uppercase letter
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;

  for (const file of allV8SourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(panRegex);
    if (matches) {
      // Exclude common false positives like PRAC01, COVID19, etc.
      const realPans = matches.filter(m => !['COVID19', 'PRAC01', 'PRAC02', 'PRAC03', 'PRAC04', 'PRAC05', 'PRAC06'].includes(m));
      assert.deepStrictEqual(
        realPans, 
        [], 
        `Possible personal PAN detected in ${path.relative(process.cwd(), file)}: ${realPans.join(', ')}`
      );
    }
  }
});

test('[R4-3] Absolute privacy scan: Zero personal Indian Aadhaar numbers in V8 code', () => {
  // Aadhaar pattern: 12 digits, often formatted as 4-4-4
  const aadhaarSpaced = /\b[2-9]{1}\d{3}\s\d{4}\s\d{4}\b/g;

  for (const file of allV8SourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(aadhaarSpaced);
    assert.strictEqual(
      matches, 
      null, 
      `Possible Aadhaar number detected in ${path.relative(process.cwd(), file)}: ${matches ? matches.join(', ') : ''}`
    );
  }
});

test('[R4-4] Absolute privacy scan: Zero individual ICAI membership numbers (MRN) leaked', () => {
  const mrnRegex = /\bMRN\s*[:#-]?\s*\d{5,6}\b/i;
  const icaiMembershipRegex = /\bICAI\s*(?:Membership|Reg)\s*[:#-]?\s*\d{5,6}\b/i;

  for (const file of allV8SourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    assert.strictEqual(
      mrnRegex.test(content), 
      false, 
      `Prohibited MRN leak in ${path.relative(process.cwd(), file)}`
    );
    assert.strictEqual(
      icaiMembershipRegex.test(content), 
      false, 
      `Prohibited ICAI Membership Number leak in ${path.relative(process.cwd(), file)}`
    );
  }
});

test('[R4-5] CMA AIR 49 is explicitly attributed to ICMAI in all occurrences across V8', () => {
  let cmaAirCount = 0;
  for (const file of allV8SourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('CMA AIR 49')) {
      cmaAirCount++;
      const hasProperAttribution = 
        content.includes('CMA AIR 49 (ICMAI)') || 
        content.includes('CMA AIR 49 ICMAI') ||
        content.includes('CMA AIR 49 from the Institute of Cost Accountants of India (ICMAI)') ||
        content.includes('ICMAI');
      
      assert.ok(
        hasProperAttribution, 
        `File ${path.relative(process.cwd(), file)} references "CMA AIR 49" without explicit ICMAI attribution`
      );
    }
  }
  assert.ok(cmaAirCount >= 4, `Expected CMA AIR 49 in multiple files (found in ${cmaAirCount} files)`);
});

test('[R4-6] Author plaque and leadership profiles use neutral crest monogram (KV / KA)', () => {
  const blogArticlePageCode = fs.readFileSync(path.resolve('src/v8/pages/BlogArticlePage.tsx'), 'utf8');
  assert.match(blogArticlePageCode, />\s*KV\s*<\/div>/, 'BlogArticlePage author plaque must use neutral KV monogram');

  const locationsPageCode = fs.readFileSync(path.resolve('src/v8/pages/LocationsPage.tsx'), 'utf8');
  assert.match(locationsPageCode, />\s*KA\s*<\/div>/, 'LocationsPage chambers plaque must use neutral KA monogram');
});

test('[R4-7] Exclusion of rejected features: Zero public tax calculators or Knowledge Bank in public V8 navigation', () => {
  const navbarPath = path.resolve('src/v8/components/layout/Navbar.tsx');
  const footerPath = path.resolve('src/v8/components/layout/Footer.tsx');

  for (const navFile of [navbarPath, footerPath]) {
    const content = fs.readFileSync(navFile, 'utf8');
    assert.strictEqual(/tax-calculator/i.test(content), false, `Prohibited tax calculator found in ${navFile}`);
    assert.strictEqual(/knowledge-bank/i.test(content), false, `Prohibited Knowledge Bank found in ${navFile}`);
  }
});

// ============================================================================
// SUITE 4: BLOG ERGONOMICS & INTERACTION AUDIT
// ============================================================================
console.log('\n▶ Suite 4: Blog Ergonomics, Card Clickability & Touch Targets');

const blogPageCode = fs.readFileSync(path.resolve('src/v8/pages/BlogPage.tsx'), 'utf8');
const blogArticlePageCode = fs.readFileSync(path.resolve('src/v8/pages/BlogArticlePage.tsx'), 'utf8');

test('[Ergonomics-1] BlogPage listing cards enforce 16:10 aspect ratio photographic frame', () => {
  assert.match(blogPageCode, /aspect-\[16\/10\]/, 'BlogPage card cover image must enforce aspect-[16/10]');
});

test('[Ergonomics-2] BlogPage implements 100% full-card clickable stretched link overlay', () => {
  assert.match(
    blogPageCode, 
    /<Link[^>]+to=\{`\/blog\/\$\{post\.slug\}`\}[^>]+className="[^"]*absolute inset-0 z-10[^"]*"/, 
    'BlogPage card must implement absolute inset-0 z-10 stretched Link'
  );
  // Ensure child tag pills pass pointer events so click hits stretched overlay
  assert.match(blogPageCode, /pointer-events-none/, 'Overlay elements must use pointer-events-none');
});

test('[Ergonomics-3] BlogArticlePage enforces comfortable 65-75ch reading width (max-w-4xl)', () => {
  const maxW4xlMatches = blogArticlePageCode.match(/max-w-4xl\s+mx-auto/g);
  assert.ok(maxW4xlMatches && maxW4xlMatches.length >= 2, 'BlogArticlePage header and body must use max-w-4xl mx-auto');
});

test('[Ergonomics-4] BlogArticlePage renders Executive Statutory Summary callout with Antique Bronze left accent', () => {
  assert.match(blogArticlePageCode, /EXECUTIVE STATUTORY SUMMARY &amp; SCOPE/);
  assert.match(blogArticlePageCode, /border-l-4 border-l-\[#B49A64\]/);
});

test('[Ergonomics-5] BlogPage and BlogArticlePage interactive controls satisfy min-h-[44px] touch target rule', () => {
  const blogPageMinHeight = blogPageCode.match(/min-h-\[44px\]/g);
  assert.ok(blogPageMinHeight && blogPageMinHeight.length >= 7, `BlogPage has ${blogPageMinHeight?.length || 0} min-h-[44px] controls (expected >= 7)`);

  const articleMinHeight = blogArticlePageCode.match(/min-h-\[44px\]/g);
  assert.ok(articleMinHeight && articleMinHeight.length >= 8, `BlogArticlePage has ${articleMinHeight?.length || 0} min-h-[44px] controls (expected >= 8)`);
});

// Clean up Vite SSR
await vite.close();

// ============================================================================
// FINAL ADVERSARIAL VERDICT SYNTHESIS
// ============================================================================
console.log('\n========================================================================');
console.log(`  CHALLENGER M4-2 AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('========================================================================\n');

if (failCount > 0) {
  console.error('\x1b[31mCRITICAL ADVERSARIAL FAILURES DETECTED:\x1b[0m');
  for (const f of failures) {
    console.error(`- ${f.name}: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('\x1b[32m✔ EMPIRICAL VERDICT: ALL ADVERSARIAL ATTACKS DEFEATED. SYSTEM SECURE.\x1b[0m');
  process.exit(0);
}
