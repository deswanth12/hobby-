import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log('=== KAVITHA & ASSOCIATES — V4.5 COMPLIANCE & VERIFICATION HARNESS ===\n');

let failed = 0;
let passed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✔ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`✖ [FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

// 1. Rejected Features Verification
test('App.tsx does not mount /knowledge-bank route', () => {
  const content = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(!content.includes('/knowledge-bank'), 'App.tsx must not contain /knowledge-bank');
  assert.ok(!content.includes('KnowledgeBankPage'), 'App.tsx must not import KnowledgeBankPage');
});

test('Navbar.tsx does not link to /knowledge-bank', () => {
  const content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
  assert.ok(!content.includes('/knowledge-bank'), 'Navbar must not link to /knowledge-bank');
  assert.ok(!content.includes('Tax Calculators & Knowledge Bank'), 'Navbar must not mention Knowledge Bank');
});

test('Footer.tsx does not link to /knowledge-bank or #knowledge-faq', () => {
  const content = fs.readFileSync('src/components/Footer.tsx', 'utf8');
  assert.ok(!content.includes('/knowledge-bank'), 'Footer must not link to /knowledge-bank');
  assert.ok(!content.includes('#knowledge-faq'), 'Footer must not link to #knowledge-faq');
});

test('HomePage.tsx does not mount KnowledgeFAQ or #knowledge-faq anchor', () => {
  const content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
  assert.ok(!content.includes('KnowledgeFAQ'), 'HomePage must not import or render KnowledgeFAQ');
  assert.ok(!content.includes('id="knowledge-faq"'), 'HomePage must not contain id="knowledge-faq"');
  assert.ok(!content.includes('href="#knowledge-faq"'), 'HomePage must not contain href="#knowledge-faq"');
  assert.ok(!content.includes("'knowledge-faq'"), 'HomePage sectionIds must not include knowledge-faq');
});

test('ServicesPage.tsx does not mount StatutoryEntityAdvisor or #statutory-advisor anchor', () => {
  const content = fs.readFileSync('src/pages/ServicesPage.tsx', 'utf8');
  assert.ok(!content.includes('StatutoryEntityAdvisor'), 'ServicesPage must not import or render StatutoryEntityAdvisor');
  assert.ok(!content.includes('id="statutory-advisor"'), 'ServicesPage must not contain id="statutory-advisor"');
  assert.ok(!content.includes('href="#statutory-advisor"'), 'ServicesPage must not contain href="#statutory-advisor"');
});

test('Sitemap generator strictly excludes /knowledge-bank', () => {
  const content = fs.readFileSync('scripts/generate-sitemap.mjs', 'utf8');
  assert.ok(!content.includes("'/knowledge-bank'"), 'STATIC_ROUTES must not include /knowledge-bank');
});

test('public/sitemap.xml and dist/sitemap.xml strictly exclude /knowledge-bank', () => {
  const pubSitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
  assert.ok(!pubSitemap.includes('/knowledge-bank'), 'public/sitemap.xml must not include /knowledge-bank');
  if (fs.existsSync('dist/sitemap.xml')) {
    const distSitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
    assert.ok(!distSitemap.includes('/knowledge-bank'), 'dist/sitemap.xml must not include /knowledge-bank');
  }
});

test('public/llms.txt and public/llms-full.txt exclude /knowledge-bank', () => {
  const llms = fs.readFileSync('public/llms.txt', 'utf8');
  assert.ok(!llms.includes('/knowledge-bank'), 'llms.txt must not link to /knowledge-bank');
  const llmsFull = fs.readFileSync('public/llms-full.txt', 'utf8');
  assert.ok(!llmsFull.includes('/knowledge-bank'), 'llms-full.txt must not link to /knowledge-bank');
});

// 2. Misleading Guarantees Expunction Verification
test('AboutPage.tsx replaces "Complete Legal Immunity & Clean Audit Reports"', () => {
  const content = fs.readFileSync('src/pages/AboutPage.tsx', 'utf8');
  assert.ok(!content.includes('Complete Legal Immunity &amp; Clean Audit Reports'), 'Guarantee must be removed');
  assert.ok(!content.includes('Complete Legal Immunity & Clean Audit Reports'), 'Guarantee must be removed');
  assert.ok(content.includes('Statutory Assurance Compliance &amp; Objective True and Fair Reporting'), 'Replacement text must exist');
});

test('CompanyRegistrationPage.tsx replaces "Guaranteed ROC Compliance"', () => {
  const content = fs.readFileSync('src/pages/CompanyRegistrationPage.tsx', 'utf8');
  assert.ok(!content.includes('Guaranteed ROC Compliance'), 'Guarantee must be removed');
  assert.ok(content.includes('Diligent Annual ROC Secretarial Compliance'), 'Replacement text must exist');
});

test('GSTServicesPage.tsx replaces "Zero Late Fee Guarantee"', () => {
  const content = fs.readFileSync('src/pages/GSTServicesPage.tsx', 'utf8');
  assert.ok(!content.includes('Zero Late Fee Guarantee'), 'Guarantee must be removed');
  assert.ok(content.includes('Scheduled GST Compliance & Penalty Mitigation'), 'Replacement text must exist');
});

// 3. Confirmed Data Issues Verification
test('AdminSettingsPage.tsx secondary phone placeholder is +91 95421 53906', () => {
  const content = fs.readFileSync('src/pages/admin/AdminSettingsPage.tsx', 'utf8');
  assert.ok(!content.includes('+91 94443 89800'), 'Old placeholder must not exist');
  assert.ok(content.includes('placeholder="+91 95421 53906"'), 'New verified placeholder must exist');
});

test('WorkingProcess.tsx alt text replaces "dedicated Chartered Accountant team"', () => {
  const content = fs.readFileSync('src/components/WorkingProcess.tsx', 'utf8');
  assert.ok(!content.includes('dedicated Chartered Accountant team'), 'Misleading team claim must be removed');
  assert.ok(content.includes('Continuous business advisory and dedicated professional audit team'), 'Rephrased alt text must exist');
});

test('src/ codebase contains ZERO instances of [REDACTED_MEMBERSHIP_NO]', () => {
  function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        searchDir(full);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const c = fs.readFileSync(full, 'utf8');
        assert.ok(!c.includes('[REDACTED_MEMBERSHIP_NO]'), `Found [REDACTED_MEMBERSHIP_NO] in ${full}`);
      }
    }
  }
  searchDir('src');
});

// 4. Protected Disputed Information Verification
test('Entire codebase does NOT introduce unverified +91 99896 89025', () => {
  function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        if (f !== 'node_modules' && f !== '.git' && f !== 'dist') searchDir(full);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.json') || f.endsWith('.html')) {
        const c = fs.readFileSync(full, 'utf8');
        assert.ok(!c.includes('9989689025') && !c.includes('99896 89025'), `Found disputed phone in ${full}`);
      }
    }
  }
  searchDir('src');
});

test('Verified primary contact information is preserved', () => {
  const firmData = fs.readFileSync('src/data/firmData.ts', 'utf8');
  assert.ok(firmData.includes('+91 96263 50900'), 'Primary phone must be preserved');
  assert.ok(firmData.includes('+91 95421 53906'), 'Secondary phone must be preserved');
  assert.ok(firmData.includes('cakavithasrj@gmail.com'), 'Primary active email must be preserved');
});

// 5. Backend Calculation Engines Preservation Verification
test('Backend calculation engine and tax rules remain intact in src/components/knowledge-bank', () => {
  assert.ok(fs.existsSync('src/components/knowledge-bank/calculationEngine.ts'), 'calculationEngine.ts must exist');
  assert.ok(fs.existsSync('src/components/knowledge-bank/taxRules.ts'), 'taxRules.ts must exist');
  assert.ok(fs.existsSync('src/components/knowledge-bank/GSTCalculator.tsx'), 'GSTCalculator.tsx must exist');
  assert.ok(fs.existsSync('src/components/knowledge-bank/IncomeTaxCalculator.tsx'), 'IncomeTaxCalculator.tsx must exist');
  assert.ok(fs.existsSync('src/components/knowledge-bank/TaxAuditChecker.tsx'), 'TaxAuditChecker.tsx must exist');
});

// 6. Obsolete Angel Tax & Section 56(2)(viib) Expunction
test('Obsolete Angel Tax & Section 56(2)(viib) are eliminated from src/', () => {
  function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        searchDir(full);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const c = fs.readFileSync(full, 'utf8');
        assert.ok(!c.includes('56(2)(viib)'), `Found obsolete 56(2)(viib) in ${full}`);
        assert.ok(!c.includes('Angel Tax'), `Found obsolete Angel Tax in ${full}`);
      }
    }
  }
  searchDir('src');
});

// 7. Prohibited Price Range Removal
test('HomePage.tsx JSON-LD schema does NOT contain prohibited priceRange', () => {
  const homeContent = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
  assert.ok(!homeContent.includes('priceRange:'), 'HomePage.tsx must not contain priceRange');
});

// 8. CARO 2020 and IFC Reporting Accuracy in Content Post
test('statutory-audit-guidelines-2026.md contains verified CARO and IFC thresholds', () => {
  const postContent = fs.readFileSync('content/posts/statutory-audit-guidelines-2026.md', 'utf8');
  assert.ok(postContent.includes('Applicable if Turnover > ₹10 Cr, Borrowings > ₹1 Cr, or Capital+Reserves > ₹1 Cr'), 'CARO threshold must be accurate');
  assert.ok(postContent.includes('Applicable only if Turnover ≥ ₹50 Cr or Borrowings ≥ ₹25 Cr'), 'IFC threshold must be accurate');
});

console.log(`\n================================================================`);
console.log(`TOTAL AUDIT CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log(`================================================================\n`);

if (failed > 0) process.exit(1);

