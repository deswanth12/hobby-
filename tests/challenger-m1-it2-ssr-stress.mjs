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
    const shortErr = err.message ? err.message.slice(0, 300) : String(err);
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
    const shortErr = err.message ? err.message.slice(0, 300) : String(err);
    failures.push({ name, error: shortErr });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${shortErr}`);
  }
}

console.log('================================================================');
console.log('  CHALLENGER 2: ADVERSARIAL SSR, ROUTES & INVARIANTS HARNESS    ');
console.log('  Testing KnowledgeBankCard SSR Across 4 Core Service Pages     ');
console.log('================================================================\n');

let vite = null;
let routerMod = null;
let kbcModule = null;
let gstPageMod = null;
let cfoPageMod = null;
let reraPageMod = null;
let servicesPageMod = null;

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
  kbcModule = await vite.ssrLoadModule('/src/v8/components/common/KnowledgeBankCard.tsx');
  gstPageMod = await vite.ssrLoadModule('/src/v8/pages/services/GSTServicesPage.tsx');
  cfoPageMod = await vite.ssrLoadModule('/src/v8/pages/services/VirtualCFOPage.tsx');
  reraPageMod = await vite.ssrLoadModule('/src/v8/pages/services/RERAConsultantPage.tsx');
  servicesPageMod = await vite.ssrLoadModule('/src/v8/pages/ServicesPage.tsx');
} catch (err) {
  console.error('Failed to initialize Vite SSR runner:', err);
  process.exit(1);
}

const { MemoryRouter } = routerMod;
const { KnowledgeBankCard } = kbcModule;
const { GSTServicesPage } = gstPageMod;
const { VirtualCFOPage } = cfoPageMod;
const { RERAConsultantPage } = reraPageMod;
const { ServicesPage } = servicesPageMod;

// ────────────────────────────────────────────────────────────
// Suite 1: KnowledgeBankCard Component SSR & Matrix Combinatorics
// ────────────────────────────────────────────────────────────
console.log('▶ Suite 1: KnowledgeBankCard Component SSR & Matrix Combinatorics');

const contexts = ['general', 'gst', 'cfo', 'rera', 'audit', 'income-tax'];
const variants = ['dark', 'forest', 'light'];

for (const ctx of contexts) {
  for (const vr of variants) {
    check(`KnowledgeBankCard SSR renders context="${ctx}" with variant="${vr}"`, () => {
      const html = renderToString(
        React.createElement(
          MemoryRouter,
          null,
          React.createElement(KnowledgeBankCard, { context: ctx, variant: vr })
        )
      );
      assert.ok(html.length > 200, 'HTML output must be substantial');
      assert.ok(html.includes('href="/knowledge-bank"'), 'Link to /knowledge-bank rendered');
      assert.ok(html.includes('Chambers Knowledge Repository'), 'Shield marker rendered');
      assert.ok(html.includes('min-h-[44px]'), 'Touch target >= 44px preserved on CTA button');
      
      if (vr === 'dark') {
        assert.ok(html.includes('bg-[#071B14]'), 'Dark container background applied');
      } else if (vr === 'forest') {
        assert.ok(html.includes('bg-[#183529]'), 'Forest container background applied');
      } else if (vr === 'light') {
        assert.ok(html.includes('bg-[#FAF7F0]'), 'Light container background applied');
      }
    });
  }
}

// ────────────────────────────────────────────────────────────
// Suite 2: KnowledgeBankCard Stress Testing & Custom Overrides
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 2: KnowledgeBankCard Stress Testing & Custom Overrides');

check('KnowledgeBankCard SSR handles completely custom overrides without errors', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(KnowledgeBankCard, {
        kicker: 'CUSTOM STATUTORY KICKER',
        title: 'Custom Forensic Assurance Title',
        description: 'Adversarial description testing custom copy & special chars: & < > "',
        highlightPills: ['Custom Pill A', 'Custom Pill B', 'Special & Co'],
        ctaLabel: 'Custom Action Button',
        to: '/custom-route',
      })
    )
  );
  assert.ok(html.includes('CUSTOM STATUTORY KICKER'), 'Custom kicker rendered');
  assert.ok(html.includes('Custom Forensic Assurance Title'), 'Custom title rendered');
  assert.ok(html.includes('href="/custom-route"'), 'Custom destination link rendered');
  assert.ok(html.includes('Custom Action Button'), 'Custom CTA label rendered');
  assert.ok(html.includes('Custom Pill A'), 'Custom pill A rendered');
  assert.ok(html.includes('Special &amp; Co'), 'HTML entities escaped cleanly');
});

check('KnowledgeBankCard SSR handles empty highlightPills gracefully', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(KnowledgeBankCard, { highlightPills: [] })
    )
  );
  assert.ok(html.includes('Knowledge Bank &amp; Statutory Filing Portals Directory'), 'Default title rendered');
  assert.ok(!html.includes('undefined'), 'No undefined string in rendered HTML');
  assert.ok(!html.includes('null'), 'No null string in rendered HTML');
});

// ────────────────────────────────────────────────────────────
// Suite 3: Empirical SSR of 4 Service Pages Mounting KnowledgeBankCard
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 3: Empirical SSR of 4 Service Pages Mounting KnowledgeBankCard');

check('GSTServicesPage: SSR renders successfully and contains KnowledgeBankCard with GST context', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/services/gst-compliance-tirupati'] },
      React.createElement(GSTServicesPage)
    )
  );
  assert.ok(html.includes('Complete GST Services for Tirupati Businesses'), 'GST page headline rendered');
  assert.ok(html.includes('GST Late Fee &amp; Net Cash Interest Calculator'), 'GST late fee calculator mounted');
  assert.ok(html.includes('GST Common Portal (GSTN)'), 'KnowledgeBankCard GST pill rendered');
  assert.ok(html.includes('National E-Way Bill System'), 'KnowledgeBankCard E-Way Bill pill rendered');
  assert.ok(html.includes('NIC E-Invoice System'), 'KnowledgeBankCard E-Invoice pill rendered');
  assert.ok(html.includes('Section 16(2)(aa) 2B Reconciliation'), 'KnowledgeBankCard 2B reconciliation pill rendered');
  assert.ok(html.includes('href="/knowledge-bank"'), 'Contextual link to /knowledge-bank rendered');
});

check('VirtualCFOPage: SSR renders successfully and contains KnowledgeBankCard with CFO context', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/services/virtual-cfo-tirupati'] },
      React.createElement(VirtualCFOPage)
    )
  );
  assert.ok(html.includes('Strategic Financial Governance &amp; Virtual CFO'), 'Virtual CFO page rendered');
  assert.ok(html.includes('Virtual CFO &amp; Working Capital Readiness Tool'), 'Virtual CFO tool mounted');
  assert.ok(html.includes('MCA21 V3 Portal'), 'KnowledgeBankCard CFO pill rendered');
  assert.ok(html.includes('CARO 2020 Monograph'), 'KnowledgeBankCard CARO monograph pill rendered');
  assert.ok(html.includes('Section 43B(h) MSME Brief'), 'KnowledgeBankCard 43B(h) pill rendered');
  assert.ok(html.includes('Startup India Portal'), 'KnowledgeBankCard Startup India pill rendered');
  assert.ok(html.includes('href="/knowledge-bank"'), 'Contextual link to /knowledge-bank rendered');
});

check('RERAConsultantPage: SSR renders successfully and contains KnowledgeBankCard with RERA context', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/services/rera-consultant-tirupati'] },
      React.createElement(RERAConsultantPage)
    )
  );
  assert.ok(html.includes('Complete RERA Compliance Solutions'), 'RERA page rendered');
  assert.ok(html.includes('AP RERA 70% Escrow Withdrawal Estimator'), 'RERA estimator mounted');
  assert.ok(html.includes('AP RERA Official Portal'), 'KnowledgeBankCard RERA pill rendered');
  assert.ok(html.includes('Section 269ST Cash Compliance'), 'KnowledgeBankCard 269ST pill rendered');
  assert.ok(html.includes('SPV Stamp Duty Estimator'), 'KnowledgeBankCard Stamp Duty pill rendered');
  assert.ok(html.includes('Form 3 Escrow Rules'), 'KnowledgeBankCard Form 3 pill rendered');
  assert.ok(html.includes('href="/knowledge-bank"'), 'Contextual link to /knowledge-bank rendered');
});

check('ServicesPage: SSR renders successfully and contains KnowledgeBankCard with general context', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/services'] },
      React.createElement(ServicesPage)
    )
  );
  assert.ok(html.includes('Explore Our Specialized CA Disciplines'), 'Services page rendered');
  assert.ok(html.includes('Enterprise Statutory Audit &amp; Tax Screener'), 'Statutory audit screener mounted');
  assert.ok(html.includes('Knowledge Bank &amp; Statutory Filing Portals Directory'), 'KnowledgeBankCard general title rendered');
  assert.ok(html.includes('6 Interactive Calculators'), 'KnowledgeBankCard general pill 1 rendered');
  assert.ok(html.includes('11 Official Government Portals'), 'KnowledgeBankCard general pill 2 rendered');
  assert.ok(html.includes('6 Chambers 1-Minute Shorts'), 'KnowledgeBankCard general pill 3 rendered');
  assert.ok(html.includes('3 Technical Monographs'), 'KnowledgeBankCard general pill 4 rendered');
  assert.ok(html.includes('href="/knowledge-bank"'), 'Contextual link to /knowledge-bank rendered');
});

// ────────────────────────────────────────────────────────────
// Suite 4: Adversarial Obfuscation & Evasion Audit on Nav & Footer
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 4: Adversarial Obfuscation & Evasion Audit on Nav & Footer');

const navFiles = [
  'src/v8/components/layout/Navbar.tsx',
  'src/v8/components/layout/Footer.tsx',
];

for (const nf of navFiles) {
  const content = fs.readFileSync(nf, 'utf8');

  check(`Zero literal 'knowledge-bank' in ${nf}`, () => {
    assert.strictEqual(/knowledge-bank/i.test(content), false, `Found knowledge-bank in ${nf}`);
  });

  check(`Zero literal 'tax-calculator' in ${nf}`, () => {
    assert.strictEqual(/tax-calculator/i.test(content), false, `Found tax-calculator in ${nf}`);
  });

  check(`Zero split/join evasion patterns targeting knowledge or bank in ${nf}`, () => {
    assert.strictEqual(content.includes('knowledgeHubPath'), false, `Found knowledgeHubPath in ${nf}`);
    assert.strictEqual(/\['\/knowledge',\s*'bank'\]/.test(content), false, `Found split array in ${nf}`);
    assert.strictEqual(/['"]\/know['"]\s*\+\s*['"]ledge['"]/.test(content), false, `Found string concatenation evasion in ${nf}`);
  });

  check(`Zero hex/unicode character escape evasion in ${nf}`, () => {
    // Check for \x or \u escapes that could spell knowledge or bank
    assert.strictEqual(/\\x[0-9a-fA-F]{2}/.test(content), false, `Found hex escape in ${nf}`);
    assert.strictEqual(/\\u[0-9a-fA-F]{4}/.test(content), false, `Found unicode escape in ${nf}`);
  });
}

// ────────────────────────────────────────────────────────────
// Suite 5: Regulatory Compliance & Zero Privacy Leak Invariants
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 5: Regulatory Compliance & Zero Privacy Leak Invariants');

const auditedPages = [
  'src/v8/components/common/KnowledgeBankCard.tsx',
  'src/v8/pages/services/GSTServicesPage.tsx',
  'src/v8/pages/services/VirtualCFOPage.tsx',
  'src/v8/pages/services/RERAConsultantPage.tsx',
  'src/v8/pages/ServicesPage.tsx',
];

for (const pagePath of auditedPages) {
  const src = fs.readFileSync(pagePath, 'utf8');

  check(`Zero PAN numbers in ${pagePath}`, () => {
    const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g;
    const matches = src.match(panRegex);
    assert.strictEqual(matches, null, `Found PAN in ${pagePath}: ${matches}`);
  });

  check(`Zero 12-digit Aadhaar patterns in ${pagePath}`, () => {
    const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
    const matches = src.match(aadhaarRegex);
    assert.strictEqual(matches, null, `Found Aadhaar in ${pagePath}: ${matches}`);
  });

  check(`Zero unredacted ICAI membership numbers in ${pagePath}`, () => {
    const memRegex = /(?:M\.?\s*No\.?|Membership\s*No\.?)\s*:?\s*(\d{6})\b/i;
    const match = src.match(memRegex);
    assert.strictEqual(match, null, `Found unredacted ICAI membership number in ${pagePath}`);
  });
}

check('Dual credential AIR 49 is attributed to ICMAI across all pages', () => {
  for (const pagePath of auditedPages) {
    const src = fs.readFileSync(pagePath, 'utf8');
    if (src.includes('AIR 49') || src.includes('Rank 49')) {
      assert.ok(
        src.includes('ICMAI') || src.includes('CMA'),
        `AIR 49 in ${pagePath} must specify ICMAI or CMA`
      );
    }
  }
});

// ────────────────────────────────────────────────────────────
// Summary
// ────────────────────────────────────────────────────────────
console.log('\n================================================================');
console.log(`TOTAL ADVERSARIAL SSR ASSERTIONS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('================================================================');

if (vite) await vite.close();

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('\nVERDICT: ALL ADVERSARIAL SSR & INVARIANT ASSERTIONS PASSED WITH ZERO ERRORS!\n');
}
