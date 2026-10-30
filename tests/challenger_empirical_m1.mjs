import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve('.');
const DIST = path.join(ROOT, 'dist');

console.log('================================================================');
console.log('  CHALLENGER M1: EMPIRICAL STRESS-TEST & VERIFICATION HARNESS   ');
console.log('================================================================');

let passedAssertions = 0;
let totalAssertions = 0;
const failures = [];

function assert(condition, message, details = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Assert ${totalAssertions}] ${message}`);
  } else {
    failures.push({ message, details });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Assert ${totalAssertions}] ${message}`);
    if (details) console.log(`       Details: ${details}`);
  }
}

// -----------------------------------------------------------------------------
// 1. Production Build Timing and Exit Code
// -----------------------------------------------------------------------------
console.log('\n--- 1. Testing Production Build Timing & Exit Code ---');
const startTime = performance.now();
try {
  const buildOutput = execSync('npm run build', { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  const durationSec = (performance.now() - startTime) / 1000;
  console.log(`Build completed in ${durationSec.toFixed(2)}s`);
  assert(durationSec < 10, `Build time (${durationSec.toFixed(2)}s) is strictly under 10.0s`, `Duration: ${durationSec}s`);
  assert(true, 'npm run build completed with exit code 0');
} catch (err) {
  assert(false, 'npm run build failed', err.message);
}

// -----------------------------------------------------------------------------
// 2. Testing dist/admin/index.html
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing dist/admin/index.html ---');
const adminHtmlPath = path.join(DIST, 'admin', 'index.html');
assert(fs.existsSync(adminHtmlPath), 'dist/admin/index.html exists');

if (fs.existsSync(adminHtmlPath)) {
  const content = fs.readFileSync(adminHtmlPath, 'utf8');
  assert(content.length > 500, 'dist/admin/index.html has non-trivial size', `Size: ${content.length} bytes`);
  
  // Sveltia script
  const hasSveltiaScript = /<script\s+src=["']https:\/\/unpkg\.com\/@sveltia\/cms(?:\@[^"']*)?\/dist\/sveltia-cms\.js["']><\/script>/i.test(content);
  assert(hasSveltiaScript, 'dist/admin/index.html contains Sveltia CMS script tag pointing to unpkg CDN', content.slice(0, 300));

  // Favicon link
  const hasFavicon = /<link\s+[^>]*rel=["']icon["'][^>]*href=["']\/favicon\.svg["']/i.test(content) ||
                     /<link\s+[^>]*href=["']\/favicon\.svg["'][^>]*rel=["']icon["']/i.test(content);
  assert(hasFavicon, 'dist/admin/index.html contains link rel="icon" referencing /favicon.svg');

  // Config discovery link
  const hasConfigLink = /<link\s+[^>]*href=["']\/admin\/config\.yml["'][^>]*rel=["']cms-config-url["']/i.test(content) ||
                        /<link\s+[^>]*rel=["']cms-config-url["'][^>]*href=["']\/admin\/config\.yml["']/i.test(content);
  assert(hasConfigLink, 'dist/admin/index.html contains rel="cms-config-url" pointing to /admin/config.yml');

  // Noindex robots tag
  const hasNoIndex = /<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow["']/i.test(content);
  assert(hasNoIndex, 'dist/admin/index.html enforces meta robots noindex, nofollow for admin security');
}

// -----------------------------------------------------------------------------
// 3. Testing dist/admin/config.yml Syntax & Schema
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing dist/admin/config.yml ---');
const configYmlPath = path.join(DIST, 'admin', 'config.yml');
assert(fs.existsSync(configYmlPath), 'dist/admin/config.yml exists');

if (fs.existsSync(configYmlPath)) {
  const ymlContent = fs.readFileSync(configYmlPath, 'utf8');
  assert(ymlContent.length > 500, 'dist/admin/config.yml has non-trivial size', `Size: ${ymlContent.length} bytes`);

  // Validate YAML syntax using Python PyYAML
  try {
    const pyValidate = execSync(`python -c "import yaml; data = yaml.safe_load(open(r'${configYmlPath}', 'r', encoding='utf-8')); assert isinstance(data, dict); print('YAML_OK')"`, { encoding: 'utf8' });
    assert(pyValidate.includes('YAML_OK'), 'dist/admin/config.yml parses successfully with strict PyYAML parser');
  } catch (err) {
    assert(false, 'dist/admin/config.yml YAML syntax validation error', err.message);
  }

  // Check required config directives
  assert(ymlContent.includes('name: github') || ymlContent.includes('name: "github"'), 'config.yml specifies backend.name: github');
  assert(ymlContent.includes('repo: deswanth12/hobby-') || ymlContent.includes('repo: "deswanth12/hobby-"'), 'config.yml specifies backend.repo: deswanth12/hobby-');
  assert(ymlContent.includes('branch: master') || ymlContent.includes('branch: "master"'), 'config.yml specifies backend.branch: master');
  assert(ymlContent.includes('auth_endpoint: api/auth') || ymlContent.includes('auth_endpoint: "api/auth"'), 'config.yml specifies auth_endpoint: api/auth');
  assert(ymlContent.includes('media_folder: "public/uploads"') || ymlContent.includes("media_folder: 'public/uploads'"), 'config.yml sets media_folder: "public/uploads"');
  assert(ymlContent.includes('public_folder: "/uploads"') || ymlContent.includes("public_folder: '/uploads'"), 'config.yml sets public_folder: "/uploads"');
  assert(ymlContent.includes('name: "posts"') || ymlContent.includes('name: posts'), 'config.yml defines posts collection');
  assert(ymlContent.includes('name: "sections"') || ymlContent.includes('name: sections'), 'config.yml defines sections collection');
}

// -----------------------------------------------------------------------------
// 4. Testing dist/_routes.json
// -----------------------------------------------------------------------------
console.log('\n--- 4. Testing dist/_routes.json ---');
const routesPath = path.join(DIST, '_routes.json');
assert(fs.existsSync(routesPath), 'dist/_routes.json exists');

if (fs.existsSync(routesPath)) {
  try {
    const routesRaw = fs.readFileSync(routesPath, 'utf8');
    const routes = JSON.parse(routesRaw);
    assert(routes.version === 1, '_routes.json version is strictly 1', `Got: ${routes.version}`);
    assert(Array.isArray(routes.include), '_routes.json include is an array');
    assert(routes.include.length === 1 && routes.include[0] === '/api/*', '_routes.json include is strictly ["/api/*"]', JSON.stringify(routes.include));
    assert(Array.isArray(routes.exclude), '_routes.json exclude is an array');
  } catch (err) {
    assert(false, 'dist/_routes.json failed JSON parsing', err.message);
  }
}

// -----------------------------------------------------------------------------
// 5. Testing dist/_redirects
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing dist/_redirects ---');
const redirectsPath = path.join(DIST, '_redirects');
assert(fs.existsSync(redirectsPath), 'dist/_redirects exists');

if (fs.existsSync(redirectsPath)) {
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
  const lines = redirectsContent.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  
  // Find indices of rules
  const adminIndex = lines.findIndex(l => /^\/admin\s+\/admin\/index\.html\s+200/.test(l));
  const adminStarIndex = lines.findIndex(l => /^\/admin\/\*\s+\/admin\/index\.html\s+200/.test(l));
  const catchAllIndex = lines.findIndex(l => /^\/\*\s+\/index\.html\s+200/.test(l));

  assert(adminIndex !== -1, 'dist/_redirects contains /admin -> /admin/index.html 200');
  assert(adminStarIndex !== -1, 'dist/_redirects contains /admin/* -> /admin/index.html 200');
  assert(catchAllIndex !== -1, 'dist/_redirects contains /* -> /index.html 200');

  // Verify ordering: /admin rules MUST be ahead of /*
  assert(adminIndex < catchAllIndex, 'First-match rule: /admin is defined BEFORE /* catch-all', `adminIndex=${adminIndex}, catchAllIndex=${catchAllIndex}`);
  assert(adminStarIndex < catchAllIndex, 'First-match rule: /admin/* is defined BEFORE /* catch-all', `adminStarIndex=${adminStarIndex}, catchAllIndex=${catchAllIndex}`);
}

// -----------------------------------------------------------------------------
// 6. Testing dist/_headers
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing dist/_headers ---');
const headersPath = path.join(DIST, '_headers');
assert(fs.existsSync(headersPath), 'dist/_headers exists');

if (fs.existsSync(headersPath)) {
  const headersContent = fs.readFileSync(headersPath, 'utf8');
  
  // Parse headers by block
  const rawLines = headersContent.split(/\r?\n/);
  const blocks = {};
  let currentBlock = null;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      // Path line
      currentBlock = trimmed;
      blocks[currentBlock] = {};
    } else if (currentBlock) {
      // Header line
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx > 0) {
        const hKey = trimmed.substring(0, colonIdx).trim().toLowerCase();
        const hVal = trimmed.substring(colonIdx + 1).trim();
        blocks[currentBlock][hKey] = hVal;
      }
    }
  }

  assert(!!blocks['/*'], 'dist/_headers defines global /* path block');
  
  const rootHeaders = blocks['/*'] || {};
  assert(rootHeaders['x-frame-options'] === 'SAMEORIGIN', '/* sets X-Frame-Options: SAMEORIGIN', rootHeaders['x-frame-options']);
  assert(!!rootHeaders['content-security-policy'], '/* sets Content-Security-Policy header');
  
  // Assert NO Cache-Control pollution in /*
  assert(rootHeaders['cache-control'] === undefined, 'CRITICAL: /* DOES NOT contain singleton Cache-Control pollution (avoids comma-merge bug)', rootHeaders['cache-control']);

  // Check CSP directives
  const csp = rootHeaders['content-security-policy'] || '';
  assert(csp.includes("https://unpkg.com"), 'CSP script-src allows https://unpkg.com (for Sveltia CMS)');
  assert(csp.includes("https://api.github.com"), 'CSP connect-src allows https://api.github.com');
  assert(csp.includes("https://github.com"), 'CSP connect-src allows https://github.com');
  assert(csp.includes("frame-ancestors 'self'"), "CSP contains frame-ancestors 'self'");

  // Check asset caching rules
  assert(!!blocks['/assets/*'] && blocks['/assets/*']['cache-control'].includes('immutable'), '/assets/* sets Cache-Control: immutable');
  assert(!!blocks['/admin/*'] && blocks['/admin/*']['cache-control'].includes('must-revalidate'), '/admin/* sets Cache-Control: must-revalidate');
  assert(!!blocks['/index.html'] && blocks['/index.html']['cache-control'].includes('must-revalidate'), '/index.html sets Cache-Control: must-revalidate');
}

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL ASSERTIONS: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================');

if (failures.length > 0) {
  console.log('\nFAILURES:');
  failures.forEach((f, i) => console.log(`[${i + 1}] ${f.message}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\nALL EMPIRICAL ASSERTIONS PASSED WITH ZERO ERRORS!');
  process.exit(0);
}
