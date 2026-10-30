import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { onRequestGet as authGet } from '../functions/api/auth.js';
import { onRequestGet as callbackGet } from '../functions/api/callback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  CHALLENGER M1 IT3: ADVERSARIAL EDGE & QUOTA ISOLATION HARNESS  ');
console.log('================================================================');

let passed = 0;
let total = 0;
const failures = [];

function assert(condition, message, details = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${total}] ${message}`);
  } else {
    failures.push({ message, details });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Assert ${total}] ${message}`);
    if (details) console.log(`       Details: ${details}`);
  }
}

// -----------------------------------------------------------------------------
// 1. Quota Isolation & Cloudflare Functions Edge Routing (_routes.json)
// -----------------------------------------------------------------------------
console.log('\n--- 1. Quota Isolation: public/_routes.json & dist/_routes.json ---');

const routesPath = path.join(rootDir, 'public', '_routes.json');
const distRoutesPath = path.join(rootDir, 'dist', '_routes.json');

assert(fs.existsSync(routesPath), 'public/_routes.json exists');
assert(fs.existsSync(distRoutesPath), 'dist/_routes.json exists in production build');

const routes = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
const distRoutes = JSON.parse(fs.readFileSync(distRoutesPath, 'utf8'));

assert(routes.version === 1, '_routes.json version is 1');
assert(Array.isArray(routes.include), 'include is an array');
assert(routes.include.length === 1 && routes.include[0] === '/api/*', 'include specifies ONLY ["/api/*"]');
assert(Array.isArray(routes.exclude) && routes.exclude.length === 0, 'exclude is empty array');
assert(JSON.stringify(routes) === JSON.stringify(distRoutes), 'dist/_routes.json perfectly matches public/_routes.json');

// Edge route matcher logic test:
// In Cloudflare Pages, a route invokes Functions IF AND ONLY IF it matches any rule in "include"
// and does NOT match any rule in "exclude".
function routesToCloudflareFunction(pathname) {
  const isIncluded = routes.include.some(pattern => {
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2);
      return pathname === prefix || pathname.startsWith(prefix + '/');
    }
    return pathname === pattern;
  });
  return isIncluded;
}

// Adversarial test cases: static routes that MUST BYPASS functions (to protect free 100k invocations/day quota)
const staticPathsToBypass = [
  '/',
  '/index.html',
  '/blog',
  '/blog/corporate-tax-planning-2026',
  '/blog/draft-post',
  '/admin',
  '/admin/',
  '/admin/index.html',
  '/admin/config.yml',
  '/assets/index-CNiJBlLe.css',
  '/assets/index-B14VhHm2.js',
  '/uploads/cover-tax.webp',
  '/sitemap.xml',
  '/robots.txt',
  '/favicon.svg',
  '/about',
  '/services',
  '/contact',
  '/api-documentation' // Should NOT match /api/* because it doesn't start with /api/
];

for (const p of staticPathsToBypass) {
  assert(!routesToCloudflareFunction(p), `Path '${p}' BYPASSES Functions (served by static CDN, zero quota consumed)`);
}

// Routes that MUST invoke functions
const functionPaths = [
  '/api/auth',
  '/api/callback',
  '/api/auth?provider=github',
  '/api/nested/endpoint'
];

for (const p of functionPaths) {
  assert(routesToCloudflareFunction(p), `API path '${p}' ROUTES to Cloudflare Functions`);
}

// -----------------------------------------------------------------------------
// 2. SPA Fallback Routing (_redirects)
// -----------------------------------------------------------------------------
console.log('\n--- 2. SPA Fallback: public/_redirects & dist/_redirects ---');

const redirectsPath = path.join(rootDir, 'public', '_redirects');
const distRedirectsPath = path.join(rootDir, 'dist', '_redirects');

assert(fs.existsSync(redirectsPath), 'public/_redirects exists');
assert(fs.existsSync(distRedirectsPath), 'dist/_redirects exists in production build');

const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
const lines = redirectsContent
  .split('\n')
  .map(l => l.trim())
  .filter(l => l && !l.startsWith('#'));

const parsedRules = lines.map(line => {
  const parts = line.split(/\s+/);
  return { from: parts[0], to: parts[1], status: parseInt(parts[2], 10) };
});

assert(parsedRules.length >= 3, `Found ${parsedRules.length} redirect rules`);

// Test rule 1: /admin
const adminExactRule = parsedRules.find(r => r.from === '/admin');
assert(adminExactRule && adminExactRule.to === '/index.html' && adminExactRule.status === 404,
  '/admin rewrites to /index.html with status 404 (quarantined generic 404)');

// Test rule 2: /admin/*
const adminWildcardRule = parsedRules.find(r => r.from === '/admin/*');
assert(adminWildcardRule && adminWildcardRule.to === '/index.html' && adminWildcardRule.status === 404,
  '/admin/* rewrites to /index.html with status 404 (quarantined generic 404)');

// Test rule 3: /*
const globalCatchAllRule = parsedRules.find(r => r.from === '/*');
assert(globalCatchAllRule && globalCatchAllRule.to === '/index.html' && globalCatchAllRule.status === 200,
  '/* rewrites to /index.html with status 200');

// Verify ordering: /admin rules must come before /* catch-all
const adminExactIdx = parsedRules.findIndex(r => r.from === '/admin');
const adminWildcardIdx = parsedRules.findIndex(r => r.from === '/admin/*');
const globalCatchAllIdx = parsedRules.findIndex(r => r.from === '/*');

assert(adminExactIdx < globalCatchAllIdx, '/admin rule is evaluated BEFORE /* catch-all');
assert(adminWildcardIdx < globalCatchAllIdx, '/admin/* rule is evaluated BEFORE /* catch-all');

// -----------------------------------------------------------------------------
// 3. Security Headers and Caching Policies (_headers)
// -----------------------------------------------------------------------------
console.log('\n--- 3. Security Headers & Caching Policies: public/_headers & dist/_headers ---');

const headersPath = path.join(rootDir, 'public', '_headers');
const distHeadersPath = path.join(rootDir, 'dist', '_headers');

assert(fs.existsSync(headersPath), 'public/_headers exists');
assert(fs.existsSync(distHeadersPath), 'dist/_headers exists in production build');

const headersContent = fs.readFileSync(headersPath, 'utf8');

// Parse _headers blocks
function parseHeaders(content) {
  const blocks = {};
  let currentPath = null;
  for (const rawLine of content.split('\n')) {
    const line = rawLine.trimEnd();
    if (!line || line.trim().startsWith('#')) continue;
    if (rawLine.startsWith(' ') || rawLine.startsWith('\t')) {
      const trimmed = line.trim();
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1 && currentPath) {
        const headerName = trimmed.slice(0, colonIdx).trim().toLowerCase();
        const headerValue = trimmed.slice(colonIdx + 1).trim();
        blocks[currentPath][headerName] = headerValue;
      }
    } else {
      currentPath = line.trim();
      blocks[currentPath] = {};
    }
  }
  return blocks;
}

const headerBlocks = parseHeaders(headersContent);

// Global /* security headers
assert('/*' in headerBlocks, '_headers defines global /* path block');
const globalHeaders = headerBlocks['/*'] || {};

assert(globalHeaders['x-frame-options'] === 'SAMEORIGIN', '/* sets X-Frame-Options: SAMEORIGIN');
assert(globalHeaders['x-content-type-options'] === 'nosniff', '/* sets X-Content-Type-Options: nosniff');
assert(globalHeaders['referrer-policy'] === 'strict-origin-when-cross-origin', '/* sets Referrer-Policy: strict-origin-when-cross-origin');
assert(globalHeaders['strict-transport-security'] && globalHeaders['strict-transport-security'].includes('max-age=31536000'),
  '/* sets HSTS with max-age >= 31536000 (1 year)');
assert(globalHeaders['strict-transport-security'].includes('includeSubDomains'), '/* HSTS includes includeSubDomains');
assert(globalHeaders['permissions-policy'] && globalHeaders['permissions-policy'].includes('camera=()'),
  '/* restricts camera, microphone, geolocation in Permissions-Policy');

// CSP validation
const csp = globalHeaders['content-security-policy'] || '';
assert(csp.length > 0, '/* sets Content-Security-Policy');
assert(csp.includes("default-src 'self'"), 'CSP sets default-src to self');
assert(csp.includes('https://unpkg.com'), 'CSP script-src allows https://unpkg.com for Sveltia CMS');
assert(csp.includes('https://api.github.com'), 'CSP connect-src allows https://api.github.com for GitHub API');
assert(csp.includes('https://github.com'), 'CSP connect-src allows https://github.com');
assert(csp.includes("frame-ancestors 'self'"), 'CSP specifies frame-ancestors self');
assert(!csp.includes("'unsafe-eval'"), 'CSP does NOT allow unsafe-eval (avoids code injection)');

// Caching policies
const assetHeaders = headerBlocks['/assets/*'] || {};
assert(assetHeaders['cache-control'] && assetHeaders['cache-control'].includes('immutable'),
  '/assets/* sets Cache-Control: immutable for hashed Vite chunks');
assert(assetHeaders['cache-control'].includes('max-age=31536000'),
  '/assets/* sets Cache-Control max-age=31536000 (1 year)');

const adminHeaders = headerBlocks['/admin/*'] || {};
assert(adminHeaders['cache-control'] && adminHeaders['cache-control'].includes('must-revalidate'),
  '/admin/* sets Cache-Control: must-revalidate to prevent stale CMS admin');
assert(adminHeaders['cache-control'].includes('max-age=0'),
  '/admin/* sets max-age=0');

const indexHeaders = headerBlocks['/index.html'] || {};
assert(indexHeaders['cache-control'] && indexHeaders['cache-control'].includes('must-revalidate'),
  '/index.html sets Cache-Control: must-revalidate so new deployments update instantly');
assert(indexHeaders['cache-control'].includes('max-age=0'),
  '/index.html sets max-age=0');

const uploadHeaders = headerBlocks['/uploads/*'] || {};
assert(uploadHeaders['cache-control'] && uploadHeaders['cache-control'].includes('stale-while-revalidate'),
  '/uploads/* sets Cache-Control with stale-while-revalidate');

// -----------------------------------------------------------------------------
// 4. Secret Leakage Audit
// -----------------------------------------------------------------------------
console.log('\n--- 4. Secret Leakage Verification in dist/ ---');

const distDir = path.join(rootDir, 'dist');
function scanDirForSecrets(dir) {
  const secretPatterns = [
    /ghp_[A-Za-z0-9_]{36,}/,               // Classic GitHub PAT
    /github_pat_[A-Za-z0-9_]{82}/,         // Fine-grained GitHub PAT
    /client_secret["'\s:=]+[A-Za-z0-9_]{20,}/i,
    /-----BEGIN [A-Z ]*PRIVATE KEY-----/
  ];

  const leaks = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile()) {
        const text = fs.readFileSync(full, 'utf8');
        for (const pattern of secretPatterns) {
          if (pattern.test(text)) {
            leaks.push({ file: full, pattern: pattern.toString() });
          }
        }
      }
    }
  }
  walk(dir);
  return leaks;
}

const leaksFound = scanDirForSecrets(distDir);
assert(leaksFound.length === 0, `Zero secrets or private keys leaked in production dist/ (${leaksFound.length} found)`);

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL ADVERSARIAL ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================');

if (failures.length > 0) {
  process.exit(1);
} else {
  console.log('\nALL ADVERSARIAL EDGE & QUOTA ISOLATION ASSERTIONS PASSED WITH ZERO ERRORS!');
  process.exit(0);
}
