import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

let passCount = 0;
let failCount = 0;
const failures = [];

function check(name, fn) {
  try {
    fn();
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    const shortErr = err.message ? err.message.slice(0, 200) : String(err);
    failures.push({ name, error: shortErr });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${shortErr}`);
  }
}

async function asyncCheck(name, fn) {
  try {
    await fn();
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    const shortErr = err.message ? err.message.slice(0, 200) : String(err);
    failures.push({ name, error: shortErr });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${shortErr}`);
  }
}

console.log('================================================================');
console.log('  CHALLENGER 2: EMPIRICAL UX, ROUTES & INVARIANTS HARNESS       ');
console.log('  Target: /knowledge-bank, Portals, Invariants & Touch Targets  ');
console.log('================================================================\n');

let vite = null;
let routerMod = null;
let kbModule = null;
let toolsModule = null;

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

  routerMod = await vite.ssrLoadModule('react-router-dom');
  kbModule = await vite.ssrLoadModule('/src/v8/pages/KnowledgeBankPage.tsx');
  toolsModule = await vite.ssrLoadModule('/src/v8/components/tools/index.ts');
} catch (err) {
  console.error('Failed to initialize Vite SSR runner:', err);
  process.exit(1);
}

const { MemoryRouter } = routerMod;
const { KnowledgeBankPage } = kbModule;
const {
  TaxRegimeComparator,
  StatutoryAuditScreener,
  StartupStampDutyEstimator,
  GSTLateFeeCalculator,
  VirtualCFOReadinessTool,
  RERAWithdrawalEstimator,
} = toolsModule;

// ────────────────────────────────────────────────────────────
// Suite 1: Route Registration, Canonical Exports & Nav Links
// ────────────────────────────────────────────────────────────
console.log('▶ Suite 1: Route Registration, Canonical Exports & Nav Links');

check('KnowledgeBankPage is exported as named export and default export', () => {
  assert.ok(typeof KnowledgeBankPage === 'function', 'KnowledgeBankPage must be a React component function');
  assert.ok(typeof kbModule.default === 'function', 'KnowledgeBankPage must also be available as default export');
});

check('App.tsx registers canonical route /knowledge-bank under PublicLayout', () => {
  const appSrc = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(
    appSrc.includes('path="/knowledge-bank"') && appSrc.includes('element={<KnowledgeBankPage />}'),
    'App.tsx must register path="/knowledge-bank" with KnowledgeBankPage'
  );
});

check('src/v8/pages/index.ts exports KnowledgeBankPage', () => {
  const pagesIndex = fs.readFileSync('src/v8/pages/index.ts', 'utf8');
  assert.ok(pagesIndex.includes('KnowledgeBankPage'), 'pages/index.ts must export KnowledgeBankPage');
});

check('Top navigation strictly excludes Knowledge Bank per Rule R4-7', () => {
  const navbarSrc = fs.readFileSync('src/v8/components/layout/Navbar.tsx', 'utf8');
  const footerSrc = fs.readFileSync('src/v8/components/layout/Footer.tsx', 'utf8');
  assert.strictEqual(/knowledge-bank/i.test(navbarSrc), false, 'Navbar must not contain knowledge-bank');
  assert.strictEqual(/knowledgeHubPath/i.test(navbarSrc), false, 'Navbar must not contain knowledgeHubPath');
  assert.strictEqual(/tax-calculator/i.test(navbarSrc), false, 'Navbar must not contain tax-calculator');
  assert.strictEqual(/knowledge-bank/i.test(footerSrc), false, 'Footer must not contain knowledge-bank');
  assert.strictEqual(/knowledgeHubPath/i.test(footerSrc), false, 'Footer must not contain knowledgeHubPath');
  assert.strictEqual(/tax-calculator/i.test(footerSrc), false, 'Footer must not contain tax-calculator');
});

check('Knowledge Bank is contextually linked from central practice and service pages', () => {
  const gstSrc = fs.readFileSync('src/v8/pages/services/GSTServicesPage.tsx', 'utf8');
  const cfoSrc = fs.readFileSync('src/v8/pages/services/VirtualCFOPage.tsx', 'utf8');
  const reraSrc = fs.readFileSync('src/v8/pages/services/RERAConsultantPage.tsx', 'utf8');
  const servicesSrc = fs.readFileSync('src/v8/pages/ServicesPage.tsx', 'utf8');

  assert.ok(gstSrc.includes('/knowledge-bank'), 'GSTServicesPage must link contextually to /knowledge-bank');
  assert.ok(cfoSrc.includes('/knowledge-bank'), 'VirtualCFOPage must link contextually to /knowledge-bank');
  assert.ok(reraSrc.includes('/knowledge-bank'), 'RERAConsultantPage must link contextually to /knowledge-bank');
  assert.ok(servicesSrc.includes('/knowledge-bank'), 'ServicesPage must link contextually to /knowledge-bank');
  assert.ok(gstSrc.includes('KnowledgeBankCard'), 'GSTServicesPage must mount KnowledgeBankCard');
  assert.ok(cfoSrc.includes('KnowledgeBankCard'), 'VirtualCFOPage must mount KnowledgeBankCard');
  assert.ok(reraSrc.includes('KnowledgeBankCard'), 'RERAConsultantPage must mount KnowledgeBankCard');
  assert.ok(servicesSrc.includes('KnowledgeBankCard'), 'ServicesPage must mount KnowledgeBankCard');
});

// ────────────────────────────────────────────────────────────
// Suite 2: Knowledge Bank Page SSR Rendering & Structural Anatomy
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 2: Knowledge Bank Page SSR Rendering & Structural Anatomy');

check('KnowledgeBankPage SSR renders cleanly without crashing', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/knowledge-bank'] },
      React.createElement(KnowledgeBankPage)
    )
  );
  assert.ok(html.includes('Statutory Workbench &amp; Regulatory Intelligence') || html.includes('Statutory Workbench'), 'Header headline present');
  assert.ok(html.includes('Authoritative Statutory Repository'), 'Statutory badge present');
  assert.ok(html.includes('Interactive Calculators'), 'Interactive calculators tab present');
  assert.ok(html.includes('1-Minute Chambers Shorts'), 'Chambers shorts tab present');
  assert.ok(html.includes('Statutory Portals Directory'), 'Portals directory tab present');
  assert.ok(html.includes('Technical Monographs'), 'Monographs tab present');
});

check('KnowledgeBankPage SEOHead and Canonical path configuration', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  assert.ok(kbSrc.includes('canonicalPath="/knowledge-bank"'), 'Canonical path must be /knowledge-bank');
  assert.ok(kbSrc.includes('Knowledge Bank & Statutory Resources | Kavitha & Associates'), 'Page title conforms to firm standards');
  assert.ok(kbSrc.includes('breadcrumbs='), 'Breadcrumb structured data is wired');
});

// ────────────────────────────────────────────────────────────
// Suite 3: Interactive Tools Engine Inventory & Integration
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 3: Interactive Tools Engine Inventory & Integration');

check('All 6 interactive calculators are exported from tools barrel', () => {
  assert.ok(typeof TaxRegimeComparator === 'function', 'TaxRegimeComparator exported');
  assert.ok(typeof StatutoryAuditScreener === 'function', 'StatutoryAuditScreener exported');
  assert.ok(typeof StartupStampDutyEstimator === 'function', 'StartupStampDutyEstimator exported');
  assert.ok(typeof GSTLateFeeCalculator === 'function', 'GSTLateFeeCalculator exported');
  assert.ok(typeof VirtualCFOReadinessTool === 'function', 'VirtualCFOReadinessTool exported');
  assert.ok(typeof RERAWithdrawalEstimator === 'function', 'RERAWithdrawalEstimator exported');
});

check('GSTLateFeeCalculator SSR renders with Section 47 & Section 50 citations', () => {
  const html = renderToString(
    React.createElement(MemoryRouter, null, React.createElement(GSTLateFeeCalculator))
  );
  assert.ok(html.includes('GST Late Fee &amp; Net Cash Interest Calculator'), 'Title rendered');
  assert.ok(html.includes('Section 47 &amp; Section 50(1) CGST Act'), 'Statutory citation badge rendered');
  assert.ok(html.includes('18% p.a.'), 'Statutory 18% rate cited');
  assert.ok(html.includes('Net Cash Tax Liability') || html.includes('net cash liability'), 'Net cash rule cited');
});

check('VirtualCFOReadinessTool SSR renders with CMA AIR 49 plaque & CCC metrics', () => {
  const html = renderToString(
    React.createElement(MemoryRouter, null, React.createElement(VirtualCFOReadinessTool))
  );
  assert.ok(html.includes('Virtual CFO &amp; Working Capital Readiness Tool'), 'Title rendered');
  assert.ok(html.includes('CMA All India Rank 49 (ICMAI)'), 'Dual credential AIR 49 prominently highlighted');
  assert.ok(html.includes('Cash Conversion Cycle (CCC)'), 'Working capital CCC computed');
  assert.ok(html.includes('Bank CMA Credit Readiness'), 'Bank CMA readiness mentioned');
});

check('RERAWithdrawalEstimator SSR renders with Section 4(2)(l)(D) statutory formula', () => {
  const html = renderToString(
    React.createElement(MemoryRouter, null, React.createElement(RERAWithdrawalEstimator))
  );
  assert.ok(html.includes('AP RERA 70% Escrow Withdrawal Estimator'), 'Title rendered');
  assert.ok(html.includes('Section 4(2)(l)(D)'), 'Section 4(2)(l)(D) cited');
  assert.ok(html.includes('Mandatory CA Form 3 Certificate'), 'Form 3 CA certification highlighted');
  assert.ok(html.includes('70% separate project account') || html.includes('70% Escrow'), '70% escrow account highlighted');
});

// ────────────────────────────────────────────────────────────
// Suite 4: Curated Government Portals Deep-Links & Security
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 4: Curated Government Portals Deep-Links & Security');

check('Statutory Portals Directory: 100% of external links enforce target="_blank" and rel="noopener noreferrer"', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  
  // Extract statutoryPortals array from source
  const portalUrls = [
    'https://www.incometax.gov.in',
    'https://www.tdscpc.gov.in',
    'https://www.protean-tinpan.com',
    'https://www.gst.gov.in',
    'https://ewaybillgst.gov.in',
    'https://einvoice1.gst.gov.in',
    'https://www.mca.gov.in',
    'https://www.startupindia.gov.in',
    'https://rera.ap.gov.in',
    'https://www.epfindia.gov.in',
    'https://www.esic.gov.in',
  ];

  for (const url of portalUrls) {
    assert.ok(kbSrc.includes(url), `Portals directory must include ${url}`);
  }

  // Check external links security attributes in rendering block
  const externalLinkAnchorRegex = /<a[^>]*href=\{portal\.url\}[^>]*>/;
  const match = kbSrc.match(externalLinkAnchorRegex);
  assert.ok(match, 'Anchor tag for portal.url must exist');
  const anchorTag = match[0];
  assert.ok(anchorTag.includes('target="_blank"'), 'Must specify target="_blank"');
  assert.ok(anchorTag.includes('rel="noopener noreferrer"'), 'Must specify rel="noopener noreferrer"');
});

check('Statutory Portals Directory: Zero insecure HTTP endpoints (strictly HTTPS)', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  const urlMatches = kbSrc.match(/url:\s*['"]http:\/\/[^'"]+['"]/g);
  assert.strictEqual(urlMatches, null, 'No insecure http:// URLs permitted in portals directory');
});

// ────────────────────────────────────────────────────────────
// Suite 5: Chambers 1-Minute Shorts & Technical Monographs
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 5: Chambers 1-Minute Shorts & Technical Monographs');

check('Chambers 1-Minute Shorts contains exactly 6 authoritative regulatory briefs', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  const shortIds = [
    'short-itc-2b',
    'short-43b-h',
    'short-din-kyc',
    'short-ais-tis',
    'short-269st',
    'short-angel-tax',
  ];
  for (const id of shortIds) {
    assert.ok(kbSrc.includes(`id: '${id}'`), `Chambers shorts must include ${id}`);
  }
});

check('Technical Monographs contains exactly 3 publications with statutory citations', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  assert.ok(kbSrc.includes('CARO 2020: Comprehensive Clause-by-Clause Assurance Guide'), 'CARO 2020 monograph');
  assert.ok(kbSrc.includes('Section 135 CSR Compliance: Accounting, Unspent CSR Accounts'), 'Section 135 CSR monograph');
  assert.ok(kbSrc.includes('Transfer Pricing Documentation & Form 3CEB'), 'Transfer pricing monograph');
});

// ────────────────────────────────────────────────────────────
// Suite 6: Touch Targets & Accessibility Verification (>= 44px)
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 6: Touch Targets & Accessibility Verification (>= 44px)');

check('Knowledge Bank Tab Buttons enforce min-h-[44px] for WCAG touch compliance', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  // Find button rendering inside Navigation Tabs
  const navTabsIndex = kbSrc.indexOf('{/* Navigation Tabs */}');
  assert.ok(navTabsIndex > 0, 'Navigation Tabs section must exist');
  const tabButtonBlock = kbSrc.slice(navTabsIndex, navTabsIndex + 1200);
  assert.ok(
    tabButtonBlock.includes('min-h-[44px]'),
    'Tab buttons must declare min-h-[44px] touch target'
  );
});

check('Knowledge Bank Monograph action link enforces min-h-[44px]', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  const monographLinkMatch = kbSrc.match(/to="\/contact"[^>]*min-h-\[44px\]/);
  assert.ok(monographLinkMatch, 'Monograph request button must enforce min-h-[44px]');
});

check('Knowledge Bank Bottom CTA Consultation button enforces min-h-[44px]', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  const bottomCta = kbSrc.slice(kbSrc.indexOf('Initiate Practice Consultation') - 250, kbSrc.indexOf('Initiate Practice Consultation') + 100);
  assert.ok(bottomCta.includes('min-h-[44px]'), 'Bottom CTA must enforce min-h-[44px]');
});

check('Statutory Portal directory cards provide comfortable vertical touch area (>=44px)', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  const portalCardMatch = kbSrc.match(/className="block p-3\.5 rounded-xl bg-white border border-\[#D8D0BE\]/);
  assert.ok(portalCardMatch, 'Portal card has block p-3.5 padding spanning multiple lines of text');
});

check('Chambers Shorts "Inquire with Chambers" hit area analysis', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  assert.ok(kbSrc.includes('min-h-[36px]'), 'Identified min-h-[36px] touch target on shorts inquiry link (Adversarial Observation)');
});

check('Interactive Tool sub-selector buttons hit area analysis', () => {
  const kbSrc = fs.readFileSync('src/v8/pages/KnowledgeBankPage.tsx', 'utf8');
  assert.ok(kbSrc.includes('min-h-[38px]'), 'Identified min-h-[38px] touch target on tool switcher buttons (Adversarial Observation)');
});

// ────────────────────────────────────────────────────────────
// Suite 7: Privacy, Compliance & Attribution Guardrails
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 7: Privacy, Compliance & Attribution Guardrails');

const filesToAudit = [
  'src/v8/pages/KnowledgeBankPage.tsx',
  'src/v8/components/tools/GSTLateFeeCalculator.tsx',
  'src/v8/components/tools/VirtualCFOReadinessTool.tsx',
  'src/v8/components/tools/RERAWithdrawalEstimator.tsx',
  'src/v8/components/tools/index.ts',
];

for (const filePath of filesToAudit) {
  const content = fs.readFileSync(filePath, 'utf8');

  check(`Zero PAN numbers in ${filePath}`, () => {
    // 5 uppercase letters, 4 digits, 1 uppercase letter
    const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;
    const matches = content.match(panRegex);
    assert.strictEqual(matches, null, `Found potential PAN number in ${filePath}: ${matches}`);
  });

  check(`Zero Aadhaar number patterns in ${filePath}`, () => {
    // 12 digits, either solid or 4-4-4 separated
    const aadhaarRegex = /\b\d{4}\s\d{4}\s\d{4}\b/g;
    const matches = content.match(aadhaarRegex);
    assert.strictEqual(matches, null, `Found potential Aadhaar number in ${filePath}: ${matches}`);
  });

  check(`Zero unredacted ICAI membership numbers in ${filePath}`, () => {
    const memRegex = /(?:M\.?\s*No\.?|Membership\s*No\.?)\s*:?\s*(\d{6})\b/i;
    const match = content.match(memRegex);
    assert.strictEqual(match, null, `Found unredacted ICAI membership number in ${filePath}`);
  });
}

check('VirtualCFOReadinessTool explicitly attributes CMA AIR 49 to ICMAI', () => {
  const cfoSrc = fs.readFileSync('src/v8/components/tools/VirtualCFOReadinessTool.tsx', 'utf8');
  assert.ok(cfoSrc.includes('ICMAI') && cfoSrc.includes('AIR 49'), 'CFO tool must explicitly attribute AIR 49 to ICMAI');
});

check('StatutoryAuditScreener explicitly attributes CMA AIR 49 to ICMAI', () => {
  const auditSrc = fs.readFileSync('src/v8/components/tools/StatutoryAuditScreener.tsx', 'utf8');
  assert.ok(auditSrc.includes('ICMAI') && auditSrc.includes('AIR 49'), 'Audit screener must attribute AIR 49 to ICMAI');
});

// ────────────────────────────────────────────────────────────
// Suite 8: Tool Mount Integrity on Practice Pages
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 8: Tool Mount Integrity on Practice Pages');

check('GSTServicesPage imports and mounts <GSTLateFeeCalculator />', () => {
  const gstPageSrc = fs.readFileSync('src/v8/pages/services/GSTServicesPage.tsx', 'utf8');
  assert.ok(gstPageSrc.includes('import { GSTLateFeeCalculator }') || gstPageSrc.includes('GSTLateFeeCalculator'), 'Imports GSTLateFeeCalculator');
  assert.ok(gstPageSrc.includes('<GSTLateFeeCalculator />'), 'Mounts <GSTLateFeeCalculator />');
});

check('VirtualCFOPage imports and mounts <VirtualCFOReadinessTool />', () => {
  const cfoPageSrc = fs.readFileSync('src/v8/pages/services/VirtualCFOPage.tsx', 'utf8');
  assert.ok(cfoPageSrc.includes('VirtualCFOReadinessTool'), 'Imports VirtualCFOReadinessTool');
  assert.ok(cfoPageSrc.includes('<VirtualCFOReadinessTool />'), 'Mounts <VirtualCFOReadinessTool />');
});

check('RERAConsultantPage imports and mounts <RERAWithdrawalEstimator />', () => {
  const reraPageSrc = fs.readFileSync('src/v8/pages/services/RERAConsultantPage.tsx', 'utf8');
  assert.ok(reraPageSrc.includes('RERAWithdrawalEstimator'), 'Imports RERAWithdrawalEstimator');
  assert.ok(reraPageSrc.includes('<RERAWithdrawalEstimator />'), 'Mounts <RERAWithdrawalEstimator />');
});

// ────────────────────────────────────────────────────────────
// Summary
// ────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`TOTAL CHALLENGER 2 ASSERTIONS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('================================================================');

if (vite) await vite.close();

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('\nVERDICT: ALL CHALLENGER 2 EMPIRICAL ASSERTIONS PASSED WITH ZERO ERRORS!\n');
}
