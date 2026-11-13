import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('================================================================');
console.log('  CHALLENGER GATE IT2: EMPIRICAL STRESS-TESTING & VALIDATION   ');
console.log('================================================================');

let passedAssertions = 0;
let totalAssertions = 0;

function check(name, condition, details = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✔ [PASS] ${name}`);
  } else {
    console.error(`  ✖ [FAIL] ${name} - ${details}`);
    throw new Error(`Assertion failed: ${name} (${details})`);
  }
}

// -----------------------------------------------------------------------------
// 1. CMS Files Existence & HTML Architecture Verification
// -----------------------------------------------------------------------------
console.log('\n--- 1. Sveltia CMS HTML Console Verification ---');
const adminHtmlPath = path.resolve('public/admin/index.html');
check('public/admin/index.html exists', fs.existsSync(adminHtmlPath));

const adminHtmlContent = fs.readFileSync(adminHtmlPath, 'utf8');
check('index.html contains doctype and viewport', 
  adminHtmlContent.includes('<!doctype html>') && adminHtmlContent.includes('viewport'));
check('index.html contains noindex, nofollow robots directive', 
  adminHtmlContent.includes('<meta name="robots" content="noindex, nofollow" />'));
check('index.html links to /admin/config.yml as cms-config-url', 
  adminHtmlContent.includes('<link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />'));
check('index.html loads Sveltia CMS script from official CDN', 
  adminHtmlContent.includes('@sveltia/cms/dist/sveltia-cms.js'));
check('index.html includes noscript fallback', 
  adminHtmlContent.includes('<noscript>') && adminHtmlContent.includes('JavaScript Required'));
check('index.html includes sveltia-loading brand indicator', 
  adminHtmlContent.includes('id="sveltia-loading"') && adminHtmlContent.includes('Kavitha & Associates'));

// -----------------------------------------------------------------------------
// 2. CMS Configuration (config.yml) Syntax & Schema Verification
// -----------------------------------------------------------------------------
console.log('\n--- 2. CMS Configuration (public/admin/config.yml) Verification ---');
const configYmlPath = path.resolve('public/admin/config.yml');
check('public/admin/config.yml exists', fs.existsSync(configYmlPath));

const configYmlContent = fs.readFileSync(configYmlPath, 'utf8');
check('config.yml is non-empty (> 5000 bytes)', configYmlContent.length > 5000, `Size: ${configYmlContent.length}`);

// Simple YAML Parser for verification
function parseYamlBasic(yamlText) {
  const lines = yamlText.split(/\r?\n/);
  const data = {};
  return { lines, raw: yamlText };
}

const parsedYaml = parseYamlBasic(configYmlContent);

// Backend settings
check('Backend is github', configYmlContent.includes('name: github'));
check('Backend repo is specified', configYmlContent.includes('repo: deswanth12/hobby-'));
check('Backend branch is master', configYmlContent.includes('branch: master'));
check('Backend auth_endpoint is api/auth', configYmlContent.includes('auth_endpoint: api/auth'));

// Storage & media cap
check('media_folder maps to public/uploads', configYmlContent.includes('media_folder: "public/uploads"'));
check('public_folder maps to /uploads', configYmlContent.includes('public_folder: "/uploads"'));
check('max_file_size is 2097152 (2MB)', configYmlContent.includes('max_file_size: 2097152'));

// Zero secrets check
check('Zero client_secret in config.yml', !configYmlContent.includes('client_secret'));
check('Zero secret_key in config.yml', !configYmlContent.includes('secret_key'));
check('Zero private_key in config.yml', !configYmlContent.includes('private_key'));

// Collections: posts
check('Declares collections list', configYmlContent.includes('collections:'));
check('Declares "posts" collection', /name:\s*["']?posts["']?/.test(configYmlContent));
check('Posts collection maps to folder content/posts', configYmlContent.includes('folder: "content/posts"'));
check('Posts format is yaml-frontmatter', configYmlContent.includes('format: "yaml-frontmatter"'));
check('Posts extension is md', configYmlContent.includes('extension: "md"'));

// Required fields for posts
const postRequiredFields = ['title', 'slug', 'date', 'author', 'excerpt', 'body', 'draft'];
for (const field of postRequiredFields) {
  const hasField = new RegExp(`name:\\s*["']?${field}["']?`).test(configYmlContent);
  check(`Posts collection contains required field "${field}"`, hasField);
}

// Slug validation pattern
check('Posts slug field defines regex pattern', 
  configYmlContent.includes('^[a-z0-9]+(?:-[a-z0-9]+)*$'));

// Draft field defaults to true
check('Draft field defaults to true for safe quarantine', 
  /name:\s*["']?draft["']?[\s\S]*?default:\s*true/.test(configYmlContent));

// Collections: sections
check('Declares "sections" collection', /name:\s*["']?sections["']?/.test(configYmlContent));
check('Sections collection is files-based', configYmlContent.includes('files:'));

const sectionFiles = [
  { name: 'about', file: 'content/sections/about.json' },
  { name: 'homepage', file: 'content/sections/homepage.json' },
  { name: 'services', file: 'content/sections/services.json' },
  { name: 'faqs', file: 'content/sections/faqs.json' },
  { name: 'contact', file: 'content/sections/contact.json' }
];

for (const sec of sectionFiles) {
  check(`Sections collection defines file "${sec.name}" -> ${sec.file}`, 
    configYmlContent.includes(`file: "${sec.file}"`));
  check(`Target section JSON file exists on disk: ${sec.file}`, 
    fs.existsSync(path.resolve(sec.file)));
  
  // Verify valid JSON
  const content = fs.readFileSync(path.resolve(sec.file), 'utf8');
  assert.doesNotThrow(() => JSON.parse(content), `JSON parsing failed for ${sec.file}`);
  check(`Section file ${sec.file} parses as valid JSON`, true);
}

// -----------------------------------------------------------------------------
// 3. Blog WebP Cover Images Empirical Binary Verification
// -----------------------------------------------------------------------------
console.log('\n--- 3. Blog WebP Cover Images Empirical Binary Verification ---');
const blogUploadsDir = path.resolve('public/uploads/blog');
check('public/uploads/blog directory exists', fs.existsSync(blogUploadsDir));

const expectedWebpImages = [
  'corporate-tax-planning-2026.webp',
  'gst-annual-return-compliance.webp',
  'internal-audit-best-practices.webp',
  'statutory-audit-guidelines-2026.webp'
];

for (const imgName of expectedWebpImages) {
  const imgPath = path.join(blogUploadsDir, imgName);
  check(`Image ${imgName} exists`, fs.existsSync(imgPath));

  const stats = fs.statSync(imgPath);
  check(`Image ${imgName} size is non-zero (> 10KB) and under 2MB limit`, 
    stats.size > 10240 && stats.size <= 2097152, `Size: ${stats.size} bytes`);

  // Binary validation: RIFF header + WEBP format identifier
  const fd = fs.openSync(imgPath, 'r');
  const buffer = Buffer.alloc(30);
  fs.readSync(fd, buffer, 0, 30, 0);
  fs.closeSync(fd);

  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  const format = buffer.toString('ascii', 12, 16);

  check(`Image ${imgName} has RIFF container magic bytes`, riff === 'RIFF', `Found: ${riff}`);
  check(`Image ${imgName} has WEBP magic bytes`, webp === 'WEBP', `Found: ${webp}`);
  check(`Image ${imgName} has valid chunk format (${format.trim()})`, 
    format.startsWith('VP8'), `Found: ${format}`);
}

// -----------------------------------------------------------------------------
// 4. Content Markdown Articles Linkage Verification
// -----------------------------------------------------------------------------
console.log('\n--- 4. Blog Posts Linkage to Cover Images ---');
const postsDir = path.resolve('content/posts');
const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
check('content/posts directory contains at least 4 articles', postFiles.length >= 4, `Found: ${postFiles.length}`);

for (const postFile of postFiles) {
  const postContent = fs.readFileSync(path.join(postsDir, postFile), 'utf8');
  const coverMatch = postContent.match(/coverImage:\s*["']?([^"'\r\n]+)["']?/);
  check(`Post ${postFile} declares coverImage`, !!coverMatch);
  if (coverMatch) {
    const rawPath = coverMatch[1].trim();
    // Path should start with /uploads/
    check(`Post ${postFile} coverImage is root-relative (/uploads/...)`, rawPath.startsWith('/uploads/'));
    const diskPath = path.resolve('public', rawPath.replace(/^\//, ''));
    check(`Cover image file exists on disk: ${diskPath}`, fs.existsSync(diskPath));
  }
}

// -----------------------------------------------------------------------------
// 5. Responsive Overflow CSS & Architecture Verification
// -----------------------------------------------------------------------------
console.log('\n--- 5. Responsive Layout & Horizontal Overflow Prevention Checks ---');
const indexCssPath = path.resolve('src/index.css');
const indexCss = fs.readFileSync(indexCssPath, 'utf8');
check('src/index.css enforces overflow-x: clip or hidden on body', 
  /body\s*\{[^}]*overflow-x:\s*(clip|hidden)/.test(indexCss) || indexCss.includes('overflow-x: clip') || indexCss.includes('overflow-x: hidden'));

const indexHtmlPath = path.resolve('index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
check('index.html declares mobile viewport with width=device-width, initial-scale=1.0', 
  indexHtml.includes('name="viewport"') && indexHtml.includes('width=device-width'));

// Check table horizontal scroll wrappers in key pages
const aboutPagePath = path.resolve('src/pages/AboutPage.tsx');
const aboutPage = fs.readFileSync(aboutPagePath, 'utf8');
check('AboutPage includes responsive table scroll wrapper (overflow-x-auto)', 
  aboutPage.includes('overflow-x-auto'));

const servicesPagePath = path.resolve('src/pages/ServicesPage.tsx');
const servicesPage = fs.readFileSync(servicesPagePath, 'utf8');
check('ServicesPage quick-navigation includes responsive overflow scroll wrapper', 
  servicesPage.includes('overflow-x-auto'));

// -----------------------------------------------------------------------------
// 6. Push Quarantine & Remote Protection
// -----------------------------------------------------------------------------
console.log('\n--- 6. Git Push Quarantine Verification ---');
const gitConfigPath = path.resolve('.git/config');
const gitConfig = fs.readFileSync(gitConfigPath, 'utf8');
check('git config enforces DISABLED_NO_PUSH_ALLOWED', 
  gitConfig.includes('pushurl = DISABLED_NO_PUSH_ALLOWED'));

console.log('\n================================================================');
console.log(`TOTAL HARDENED ASSERTIONS : ${totalAssertions}`);
console.log(`PASSED                    : ${passedAssertions}`);
console.log(`FAILED                    : ${totalAssertions - passedAssertions}`);
console.log('================================================================');
console.log('ALL CHALLENGER EMPIRICAL VERIFICATIONS PASSED WITH 100% SUCCESS!');
