/**
 * ==============================================================================
 * CHALLENGER M6-1: EMPIRICAL REGRESSION, BUILD & ADVERSARIAL STRESS HARNESS
 * Kavitha & Associates — Milestone 6 Final Verification & Quality Certification
 * ==============================================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

let totalPassed = 0;
let totalFailed = 0;
const findings = [];

function assert(condition, testName, details = '') {
  if (condition) {
    totalPassed++;
    console.log(`  ✔ [PASS] ${testName}`);
  } else {
    totalFailed++;
    console.error(`  ✖ [FAIL] ${testName} ${details ? '(' + details + ')' : ''}`);
    findings.push({ severity: 'CRITICAL', testName, details });
  }
}

function suite(name) {
  console.log(`\n▶ ${name}`);
}

console.log('===================================================================================');
console.log('  CHALLENGER M6-1: EMPIRICAL REGRESSION, BUILD & ADVERSARIAL STRESS HARNESS');
console.log('===================================================================================');
console.log(`Target Repository: ${ROOT}`);

// ==============================================================================
// SUITE 1: 13 ROOT DELIVERABLES EMPIRICAL VERIFICATION (>250 LINES EACH)
// ==============================================================================
suite('Suite 1: Root V80 Deliverables Quantification & Substantive Review');

const REQUIRED_DELIVERABLES = [
  'V80_BACKEND_INTEGRATION_MAP.md',
  'V80_FRONTEND_ARCHITECTURE.md',
  'V80_DESIGN_SYSTEM.md',
  'V80_PAGE_AND_ROUTE_PLAN.md',
  'V80_IMPLEMENTATION_REPORT.md',
  'V80_BLOG_IMPLEMENTATION_REPORT.md',
  'V80_SECURITY_REPORT.md',
  'V80_ACCESSIBILITY_REPORT.md',
  'V80_PERFORMANCE_REPORT.md',
  'V80_RESPONSIVE_QA.md',
  'V80_TEST_RESULTS.md',
  'V80_MIGRATION_AND_ROLLBACK_REPORT.md',
  'V80_IMPLEMENTATION_CHANGELOG.md'
];

for (const deliv of REQUIRED_DELIVERABLES) {
  const filePath = path.join(ROOT, deliv);
  const exists = fs.existsSync(filePath);
  assert(exists, `Deliverable exists: ${deliv}`);
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').length;
    assert(lines >= 250, `Deliverable line count: ${deliv} has ${lines} lines (>= 250)`);
  }
}

// ==============================================================================
// SUITE 2: PRODUCTION BUILD & DIST ARTIFACTS FORENSIC AUDIT
// ==============================================================================
suite('Suite 2: Production Build & Distribution Artifacts Forensic Audit');

const distPath = path.join(ROOT, 'dist');
assert(fs.existsSync(distPath), 'dist/ directory exists and is populated');

const distIndexPath = path.join(distPath, 'index.html');
assert(fs.existsSync(distIndexPath), 'dist/index.html exists');

if (fs.existsSync(distIndexPath)) {
  const indexHtml = fs.readFileSync(distIndexPath, 'utf8');
  assert(indexHtml.includes('<!doctype html>') || indexHtml.includes('<!DOCTYPE html>'), 'dist/index.html contains valid HTML5 doctype');
  assert(indexHtml.includes('<div id="root"></div>'), 'dist/index.html contains mounting target #root');
  assert(indexHtml.includes('https://kavithaassociates.com/'), 'dist/index.html declares canonical domain');
  assert(indexHtml.includes('Cormorant+Garamond') && indexHtml.includes('Inter'), 'dist/index.html links Botanical Ledger fonts');
  assert(!indexHtml.includes('eval(') && !indexHtml.includes('new Function('), 'dist/index.html contains zero eval/unsafe-eval calls');
  assert(indexHtml.includes('type="application/ld+json"'), 'dist/index.html injects Schema.org JSON-LD structured data');
}

// Sitemap validation
const sitemapPath = path.join(distPath, 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'dist/sitemap.xml exists');

if (fs.existsSync(sitemapPath)) {
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
  const locMatches = sitemapXml.match(/<loc>(.*?)<\/loc>/g) || [];
  const urls = locMatches.map(m => m.replace(/<\/?loc>/g, '').trim());

  assert(urls.length === 16, `dist/sitemap.xml contains exactly 16 URLs (found: ${urls.length})`);
  
  // All URLs must start with https://kavithaassociates.com/
  const validDomain = urls.every(u => u.startsWith('https://kavithaassociates.com/'));
  assert(validDomain, 'All sitemap URLs match canonical production domain https://kavithaassociates.com/');

  // Strict draft exclusion
  const hasDraft = urls.some(u => u.includes('internal-audit-best-practices'));
  assert(!hasDraft, 'Sitemap strictly excludes draft article "internal-audit-best-practices"');

  // Zero admin or api URLs
  const hasAdmin = urls.some(u => u.includes('/admin') || u.includes('/sec-ca-') || u.includes('/api'));
  assert(!hasAdmin, 'Sitemap strictly excludes admin and API routes');

  // Required 6 practice corridors
  const corridors = [
    'audit-assurance',
    'income-tax-consultant-tirupati',
    'gst-consultant-tirupati',
    'company-registration-tirupati',
    'virtual-cfo-tirupati',
    'rera-consultant-tirupati'
  ];
  for (const c of corridors) {
    assert(urls.includes(`https://kavithaassociates.com/services/${c}`), `Sitemap includes corridor: /services/${c}`);
  }

  // Required 3 published blog articles
  const blogSlugs = [
    'corporate-tax-planning-2026',
    'gst-annual-return-compliance',
    'statutory-audit-guidelines-2026'
  ];
  for (const b of blogSlugs) {
    assert(urls.includes(`https://kavithaassociates.com/blog/${b}`), `Sitemap includes published article: /blog/${b}`);
  }
}

// Robots.txt validation
const robotsPath = path.join(distPath, 'robots.txt');
assert(fs.existsSync(robotsPath), 'dist/robots.txt exists');
if (fs.existsSync(robotsPath)) {
  const robotsTxt = fs.readFileSync(robotsPath, 'utf8');
  assert(robotsTxt.includes('Disallow: /admin'), 'robots.txt disallows /admin');
  assert(robotsTxt.includes('Disallow: /api'), 'robots.txt disallows /api');
  assert(robotsTxt.includes('Sitemap: https://kavithaassociates.com/sitemap.xml'), 'robots.txt points to canonical sitemap');
}

// Redirects validation
const redirectsPath = path.join(distPath, '_redirects');
assert(fs.existsSync(redirectsPath), 'dist/_redirects exists');
if (fs.existsSync(redirectsPath)) {
  const redirects = fs.readFileSync(redirectsPath, 'utf8');
  assert(redirects.includes('/admin') && redirects.includes('404'), '_redirects quarantees /admin to 404');
  assert(redirects.includes('/*') && redirects.includes('/index.html') && redirects.includes('200'), '_redirects handles SPA catch-all 200');
}

// ==============================================================================
// SUITE 3: CODE-SPLITTING & ASSET HYGIENE AUDIT
// ==============================================================================
suite('Suite 3: Code-Splitting, Chunk Decoupling & Asset Hygiene');

const assetsDir = path.join(distPath, 'assets');
assert(fs.existsSync(assetsDir), 'dist/assets directory exists');

const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];

const adminPages = [
  'AdminLoginPage',
  'AdminLayout',
  'AdminOverviewPage',
  'AdminEnquiriesPage',
  'AdminSettingsPage',
  'AdminContentPage'
];

for (const adminPage of adminPages) {
  const found = assetFiles.some(f => f.startsWith(adminPage) && f.endsWith('.js'));
  assert(found, `Admin route physically code-split into asynchronous chunk: ${adminPage}`);
}

const vendorReactFound = assetFiles.some(f => f.startsWith('vendor-react') && f.endsWith('.js'));
assert(vendorReactFound, 'React/ReactDOM isolated into vendor-react chunk');

const vendorSupabaseFound = assetFiles.some(f => f.startsWith('vendor-supabase') && f.endsWith('.js'));
assert(vendorSupabaseFound, 'Supabase client isolated into vendor-supabase chunk');

const publicIndexBundle = assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
assert(Boolean(publicIndexBundle), `Public application index bundle exists: ${publicIndexBundle}`);

if (publicIndexBundle) {
  const publicBundlePath = path.join(assetsDir, publicIndexBundle);
  const bundleStat = fs.statSync(publicBundlePath);
  assert(bundleStat.size < 650000, `Public bundle uncompressed size is within budget (${(bundleStat.size / 1024).toFixed(1)} kB < 650 kB)`);

  const publicBundleContent = fs.readFileSync(publicBundlePath, 'utf8');
  assert(!publicBundleContent.includes('AdminOverviewPage initialized with mock metrics'), 'AdminOverviewPage internal code is not inlined in public bundle');
}

// ==============================================================================
// SUITE 4: ZERO SECRET, PII & REGULATORY PRIVACY LEAK SWEEP IN DIST
// ==============================================================================
suite('Suite 4: Dist Bundle Privacy, Secret & Regulatory Quarantine Sweep');

for (const file of assetFiles) {
  if (!file.endsWith('.js') && !file.endsWith('.css')) continue;
  const filePath = path.join(assetsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check 1: No private keys
  assert(!content.includes('BEGIN RSA PRIVATE KEY') && !content.includes('BEGIN OPENSSH PRIVATE KEY'), `Zero private keys in dist asset: ${file}`);

  // Check 2: No Supabase service_role secret
  assert(!content.includes('service_role') && !content.includes('SUPABASE_SERVICE_ROLE_KEY'), `Zero service role keys in dist asset: ${file}`);

  // Check 3: Zero partner portrait filename
  assert(!content.includes('ca-kavitha-vijay.webp'), `Zero partner portrait references in dist asset: ${file}`);
}

// Public bundle regulatory check
if (publicIndexBundle) {
  const publicBundleContent = fs.readFileSync(path.join(assetsDir, publicIndexBundle), 'utf8');
  assert(publicBundleContent.includes('ICMAI') || publicBundleContent.includes('AIR 49'), 'CMA AIR 49 ICMAI attribution present in public bundle');
}

// ==============================================================================
// SUITE 5: LIVE RUNTIME SSR MODULE EVALUATION & FUZZING
// ==============================================================================
suite('Suite 5: Live SSR Module Evaluation & Adversarial Fuzzing');

let viteRunner = null;
try {
  viteRunner = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: {
      noDiscovery: true,
      entries: [],
      include: []
    },
    resolve: {
      alias: {
        'react-router-dom': path.resolve('node_modules/react-router-dom/dist/index.mjs')
      }
    }
  });

  const backendAdapter = await viteRunner.ssrLoadModule('/src/v8/adapters/backendAdapter.ts');
  const contentAdapter = await viteRunner.ssrLoadModule('/src/v8/adapters/contentAdapter.ts');

  assert(Boolean(backendAdapter), 'backendAdapter module loaded via SSR');
  assert(Boolean(contentAdapter), 'contentAdapter module loaded via SSR');

  // Content Adapter Tests
  const publishedArticles = contentAdapter.getPublishedArticles();
  assert(Array.isArray(publishedArticles) && publishedArticles.length === 3, `getPublishedArticles returns exactly 3 published articles (found: ${publishedArticles.length})`);

  // Draft quarantine test
  const draftArticle = contentAdapter.getArticleBySlug('internal-audit-best-practices');
  assert(draftArticle === undefined, 'getArticleBySlug strictly returns undefined for known draft "internal-audit-best-practices"');

  const isDraft = contentAdapter.isDraftArticle('internal-audit-best-practices');
  assert(isDraft === true, 'isDraftArticle correctly flags "internal-audit-best-practices" as draft');

  // Valid article test
  const validArticle = contentAdapter.getArticleBySlug('corporate-tax-planning-2026');
  assert(Boolean(validArticle && validArticle.title), 'getArticleBySlug retrieves valid published article "corporate-tax-planning-2026"');

  // Adversarial slug injection fuzzing
  const fuzzedSlugs = [
    '../../etc/passwd',
    '../services/audit-assurance',
    "'; DROP TABLE content_posts;--",
    '<script>alert(1)</script>',
    'corporate-tax-planning-2026\0.js',
    '__proto__',
    'constructor',
    'toString',
    '   ',
    ''
  ];

  for (const slug of fuzzedSlugs) {
    let safeReturn = false;
    try {
      const res = contentAdapter.getArticleBySlug(slug);
      safeReturn = res === undefined;
    } catch {
      safeReturn = false;
    }
    assert(safeReturn, `Adversarial slug safely returns undefined without exception: "${slug}"`);
  }

  // Canonical Corridors PRAC-01 through PRAC-06
  const corridors = [
    'audit-assurance',
    'income-tax-consultant-tirupati',
    'gst-consultant-tirupati',
    'company-registration-tirupati',
    'virtual-cfo-tirupati',
    'rera-consultant-tirupati'
  ];

  for (const corridor of corridors) {
    const s = contentAdapter.getServiceBySlug(corridor);
    assert(Boolean(s && s.title), `Canonical corridor resolves via getServiceBySlug: ${corridor}`);
  }

  // Backend Adapter Anti-Spam Stress
  const botPayloadFast = {
    fullName: 'Bot Script',
    phone: '+91 99999 88888',
    email: 'bot@automated.ru',
    message: 'Instantaneous submission attack test',
    website_fax_hp: '',
    formLoadedAt: Date.now() - 200 // 200ms < 1500ms
  };
  const fastResult = backendAdapter.checkAntiSpam(botPayloadFast);
  assert(fastResult.passed === false && fastResult.reason === 'VELOCITY_TOO_FAST', 'checkAntiSpam rejects sub-1500ms submission with VELOCITY_TOO_FAST');

  const botPayloadHoneypot = {
    fullName: 'Bot Script',
    phone: '+91 99999 88888',
    email: 'bot@automated.ru',
    message: 'Honeypot attack test',
    website_fax_hp: 'http://malicious-spam.ru',
    formLoadedAt: Date.now() - 5000 // 5s elapsed
  };
  const hpResult = backendAdapter.checkAntiSpam(botPayloadHoneypot);
  assert(hpResult.passed === false && hpResult.reason === 'HONEYPOT_TRIGGERED', 'checkAntiSpam rejects populated honeypot with HONEYPOT_TRIGGERED');

  const legitimatePayload = {
    fullName: 'CA Kavitha Client',
    phone: '+91 98765 43210',
    email: 'client@legitimatebusiness.com',
    message: 'Requesting statutory audit for FY 2025-26',
    website_fax_hp: '',
    formLoadedAt: Date.now() - 3500 // 3.5s elapsed
  };
  const humanResult = backendAdapter.checkAntiSpam(legitimatePayload);
  assert(humanResult.passed === true, 'checkAntiSpam permits legitimate human submission');

} catch (err) {
  console.error('SSR Runner evaluation error:', err);
  assert(false, 'Live SSR runner execution failed', err.message);
} finally {
  if (viteRunner) {
    await viteRunner.close();
  }
}

// ==============================================================================
// SUITE 6: STATUTORY TAX AUDIT ENGINE CODE INTEGRITY
// ==============================================================================
suite('Suite 6: Statutory Tax Audit Engine Code Integrity');

const taxTestFile = path.join(ROOT, 'tests', 'tax-calculators.test.mjs');
assert(fs.existsSync(taxTestFile), 'tests/tax-calculators.test.mjs exists');
const taxTestContent = fs.readFileSync(taxTestFile, 'utf8');

const itMatches = (taxTestContent.match(/\bit\(['"]TC/g) || []).length;
assert(itMatches === 23, `tax-calculators.test.mjs defines exactly 23 statutory it() test assertions (found: ${itMatches})`);
assert(taxTestContent.includes('stateTurnover'), 'GSTR-9 requires stateTurnover parameter');
assert(taxTestContent.includes('12,75,000') || taxTestContent.includes('1275000'), 'Includes FY 2025-26 ₹12,75,000 zero-tax rebate test');
assert(taxTestContent.includes('7,75,000') || taxTestContent.includes('775000'), 'Includes FY 2024-25 ₹7,75,000 zero-tax rebate test');

// ==============================================================================
// SUITE 7: INTAKE ANTI-SPAM & VELOCITY IMPLEMENTATION CONFORMANCE
// ==============================================================================
suite('Suite 7: Intake Anti-Spam & Velocity Implementation Conformance');

const contactFormFile = path.join(ROOT, 'src', 'v8', 'components', 'forms', 'ContactForm.tsx');
assert(fs.existsSync(contactFormFile), 'ContactForm.tsx exists');

const contactFormCode = fs.readFileSync(contactFormFile, 'utf8');
assert(contactFormCode.includes('website_fax_hp'), 'ContactForm implements website_fax_hp honeypot field');
assert(contactFormCode.includes('formLoadedAt'), 'ContactForm tracks formLoadedAt timestamp');
assert(contactFormCode.includes('tabIndex={-1}'), 'Honeypot field is inaccessible to keyboard tab navigation');
assert(contactFormCode.includes('aria-hidden="true"'), 'Honeypot field is hidden from assistive technologies');

const backendAdapterFile = path.join(ROOT, 'src', 'v8', 'adapters', 'backendAdapter.ts');
assert(fs.existsSync(backendAdapterFile), 'backendAdapter.ts exists');

const backendAdapterCode = fs.readFileSync(backendAdapterFile, 'utf8');
assert(backendAdapterCode.includes('1500'), 'Velocity defense requires >= 1500ms interaction time');
assert(backendAdapterCode.includes('HONEYPOT_TRIGGERED'), 'Honeypot violation emits explicit honeypot code');
assert(backendAdapterCode.includes('VELOCITY_TOO_FAST'), 'Velocity violation emits VELOCITY_TOO_FAST code');
assert(backendAdapterCode.includes('+91 96263 50900') || backendAdapterCode.includes('919626350900'), 'Official chambers telephonedesk bound to WhatsApp URL');

// ==============================================================================
// SUITE 8: PROJECT GOVERNANCE & REPOSITORY HYGIENE
// ==============================================================================
suite('Suite 8: Project Governance & Compliance Verification');

const projectMd = fs.readFileSync(path.join(ROOT, 'PROJECT.md'), 'utf8');
assert(projectMd.includes('| M5 | Admin Preservation'), 'PROJECT.md documents Milestone 5');
assert(projectMd.includes('| M6 | Final Verification'), 'PROJECT.md documents Milestone 6');

// Verify that .git remote has no unauthorized push URLs
const gitConfigFile = path.join(ROOT, '.git', 'config');
if (fs.existsSync(gitConfigFile)) {
  const gitConfig = fs.readFileSync(gitConfigFile, 'utf8');
  assert(gitConfig.includes('DISABLED_NO_PUSH_ALLOWED') || !gitConfig.includes('pushurl'), 'Local git repository forbids accidental remote push');
}

// ==============================================================================
// SUMMARY & VERDICT
// ==============================================================================
console.log('\n===================================================================================');
console.log('                          CHALLENGER M6-1 FINAL AUDIT REPORT                       ');
console.log('===================================================================================');
console.log(`Total Empirical Assertions: ${totalPassed + totalFailed}`);
console.log(`Passed: ${totalPassed}`);
console.log(`Failed: ${totalFailed}`);

if (findings.length > 0) {
  console.log('\nFindings:');
  findings.forEach(f => console.log(`  [${f.severity}] ${f.testName}: ${f.details}`));
}

console.log(`Overall Empirical Verdict: ${totalFailed === 0 ? 'APPROVE' : 'REJECT'}`);
console.log('===================================================================================');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
