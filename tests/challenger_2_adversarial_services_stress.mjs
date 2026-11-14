/**
 * tests/challenger_2_adversarial_services_stress.mjs
 * 
 * Adversarial Challenger 2 Stress Test Suite:
 * Requirements: R3 (Services Filter Tabs, Search & Empty State, Touch Targets) & R4 (ICAI Compliance, Responsiveness)
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { spawn } from 'child_process';
import { createServer } from 'vite';

console.log('================================================================================');
console.log('  CHALLENGER 2: ADVERSARIAL STRESS TEST & ORACLE HARNESS (R3 & R4)              ');
console.log('================================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${totalTests.toString().padStart(3, '0')}] ${name}`);
  } catch (err) {
    failedTests++;
    const errMsg = err.message || String(err);
    failures.push({ name, error: errMsg });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${totalTests.toString().padStart(3, '0')}] ${name}`);
    console.log(`       Details: ${errMsg}`);
  }
}

async function testAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${totalTests.toString().padStart(3, '0')}] ${name}`);
  } catch (err) {
    failedTests++;
    const errMsg = err.message || String(err);
    failures.push({ name, error: errMsg });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${totalTests.toString().padStart(3, '0')}] ${name}`);
    console.log(`       Details: ${errMsg}`);
  }
}

// --------------------------------------------------------------------------------
// SECTION 1: STATIC CODE AUDIT (R3 TABS, SEARCH, TOUCH TARGETS)
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 1: R3 Tab Architecture & Logic Oracle ---');

const servicesSrcPath = path.resolve('src/v8/pages/ServicesPage.tsx');
const servicesSrc = fs.readFileSync(servicesSrcPath, 'utf8');

test('R3: DISCIPLINE_TABS contains exactly 6 tabs with correct ids, labels, and counts', () => {
  const expectedTabs = [
    { id: 'all', count: 8 },
    { id: 'audit', count: 1 },
    { id: 'direct-tax', count: 1 },
    { id: 'indirect-tax', count: 1 },
    { id: 'corporate', count: 2 },
    { id: 'advisory', count: 3 },
  ];

  for (const exp of expectedTabs) {
    const regex = new RegExp(`id:\\s*'${exp.id}'.*?count:\\s*${exp.count}`, 's');
    assert.match(servicesSrc, regex, `Tab ${exp.id} must be defined with count ${exp.count}`);
  }
});

let vite;
let contentAdapter;
let ServicesPageModule;

try {
  const rrdPath = path.resolve('node_modules/react-router-dom/dist/index.mjs');
  vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true },
    resolve: { alias: { 'react-router-dom': rrdPath } },
  });

  contentAdapter = await vite.ssrLoadModule('/src/v8/adapters/contentAdapter.ts');
  ServicesPageModule = await vite.ssrLoadModule('/src/v8/pages/ServicesPage.tsx');
} catch (e) {
  console.error('CRITICAL: Vite SSR initialization failed:', e);
  process.exit(1);
}

test('R3 Oracle: DISCIPLINE_TABS export from ServicesPage.tsx matches specification', () => {
  const { DISCIPLINE_TABS } = ServicesPageModule;
  assert.ok(Array.isArray(DISCIPLINE_TABS), 'DISCIPLINE_TABS must be an array');
  assert.strictEqual(DISCIPLINE_TABS.length, 6, `Expected 6 discipline tabs, got ${DISCIPLINE_TABS.length}`);

  const counts = Object.fromEntries(DISCIPLINE_TABS.map(t => [t.id, t.count]));
  assert.strictEqual(counts['all'], 8);
  assert.strictEqual(counts['audit'], 1);
  assert.strictEqual(counts['direct-tax'], 1);
  assert.strictEqual(counts['indirect-tax'], 1);
  assert.strictEqual(counts['corporate'], 2);
  assert.strictEqual(counts['advisory'], 3);
});

test('R3 Oracle: All 8 practice card IDs exist in ServicesPage.tsx', () => {
  const allCardIds = [
    'audit-assurance',
    'income-tax',
    'gst',
    'corporate-business',
    'rera-compliance',
    'virtual-cfo',
    'project-finance',
    'strategic-advisory',
  ];

  for (const id of allCardIds) {
    assert.match(servicesSrc, new RegExp(`id:\\s*'${id}'`), `Practice card ${id} must be defined in ServicesPage`);
  }
});

// --------------------------------------------------------------------------------
// SECTION 2: ADVERSARIAL FILTERING & SEARCH ORACLE
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 2: Adversarial Filtering & Search Matrix Simulation ---');

const auditServices = contentAdapter.getAuditSpotlightServices();
const baseServices = contentAdapter.getAllServices();
const projectFinance = contentAdapter.getProjectFinanceService();
const strategicAdvisory = contentAdapter.getStrategicAdvisoryService();
const incomeTax = baseServices.find(s => s.id === 'income-tax');
const gst = baseServices.find(s => s.id === 'gst');
const corporate = baseServices.find(s => s.id === 'corporate-business');
const rera = baseServices.find(s => s.id === 'rera-compliance');

const allPractices = [
  {
    id: 'audit-assurance',
    disciplineId: 'audit',
    code: 'PRAC-01',
    title: 'Statutory Audit & Assurance Practice',
    statutoryFramework: 'Companies Act, 2013 | Income Tax Act, 1961 | ICAI Standards on Auditing (SAs)',
    fullDescription: 'Comprehensive independent audit and assurance portfolio covering statutory company audits...',
    services: auditServices.map(s => `${s.name}: ${s.scope}`),
  },
  {
    id: 'income-tax',
    disciplineId: 'direct-tax',
    code: 'PRAC-02',
    title: incomeTax.title,
    statutoryFramework: incomeTax.statutoryFramework,
    fullDescription: incomeTax.fullDescription,
    services: incomeTax.services,
  },
  {
    id: 'gst',
    disciplineId: 'indirect-tax',
    code: 'PRAC-03',
    title: gst.title,
    statutoryFramework: gst.statutoryFramework,
    fullDescription: gst.fullDescription,
    services: gst.services,
  },
  {
    id: 'corporate-business',
    disciplineId: 'corporate',
    code: 'PRAC-04',
    title: corporate.title,
    statutoryFramework: corporate.statutoryFramework,
    fullDescription: corporate.fullDescription,
    services: corporate.services,
  },
  {
    id: 'rera-compliance',
    disciplineId: 'corporate',
    code: 'PRAC-05',
    title: rera.title,
    statutoryFramework: rera.statutoryFramework,
    fullDescription: rera.fullDescription,
    services: rera.services,
  },
  {
    id: 'virtual-cfo',
    disciplineId: 'advisory',
    code: 'PRAC-06',
    title: 'Virtual CFO & Retainership Practice',
    statutoryFramework: 'Multi-Statute Strategic Retainer (CMA + CA Supervision)',
    fullDescription: 'Outsourced financial leadership, strategic cash flow governance...',
    services: [
      'Monthly MIS, Operating Variance & Unit Cost Modeling',
      'Continuous Advance Tax & Quarterly TDS Structuring',
      'Bank Credit Facility CMA Data & Project Reports',
      'Multi-Branch GST Health Checks & ITC Maximization',
      'Annual MCA & ROC Secretarial Governance Oversight',
      'Board-Level Strategic Counsel with CA Kavitha Vijay'
    ],
  },
  {
    id: 'project-finance',
    disciplineId: 'advisory',
    code: 'PRAC-07',
    title: projectFinance.title,
    statutoryFramework: projectFinance.statutoryFramework,
    fullDescription: projectFinance.fullDescription,
    services: projectFinance.services,
  },
  {
    id: 'strategic-advisory',
    disciplineId: 'advisory',
    code: 'PRAC-08',
    title: strategicAdvisory.title,
    statutoryFramework: strategicAdvisory.statutoryFramework,
    fullDescription: strategicAdvisory.fullDescription,
    services: strategicAdvisory.services,
  }
];

function filterPractices(activeDiscipline, searchQuery) {
  return allPractices.filter(card => {
    const matchesDiscipline = activeDiscipline === 'all' || card.disciplineId === activeDiscipline;
    if (!matchesDiscipline) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      card.title.toLowerCase().includes(q) ||
      card.code.toLowerCase().includes(q) ||
      card.fullDescription.toLowerCase().includes(q) ||
      (card.statutoryFramework ? card.statutoryFramework.toLowerCase().includes(q) : false) ||
      card.services.some(s => s.toLowerCase().includes(q))
    );
  });
}

test('Filter Matrix: "all" returns exactly 8 cards', () => {
  const res = filterPractices('all', '');
  assert.strictEqual(res.length, 8);
});

test('Filter Matrix: "audit" returns exactly 1 card ("audit-assurance")', () => {
  const res = filterPractices('audit', '');
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'audit-assurance');
});

test('Filter Matrix: "direct-tax" returns exactly 1 card ("income-tax")', () => {
  const res = filterPractices('direct-tax', '');
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'income-tax');
});

test('Filter Matrix: "indirect-tax" returns exactly 1 card ("gst")', () => {
  const res = filterPractices('indirect-tax', '');
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].id, 'gst');
});

test('Filter Matrix: "corporate" returns exactly 2 cards ("corporate-business", "rera-compliance")', () => {
  const res = filterPractices('corporate', '');
  assert.strictEqual(res.length, 2);
  const ids = res.map(r => r.id);
  assert.ok(ids.includes('corporate-business'));
  assert.ok(ids.includes('rera-compliance'));
});

test('Filter Matrix: "advisory" returns exactly 3 cards ("virtual-cfo", "project-finance", "strategic-advisory")', () => {
  const res = filterPractices('advisory', '');
  assert.strictEqual(res.length, 3);
  const ids = res.map(r => r.id);
  assert.ok(ids.includes('virtual-cfo'));
  assert.ok(ids.includes('project-finance'));
  assert.ok(ids.includes('strategic-advisory'));
});

// Search queries
const SEARCH_TEST_CASES = [
  { query: 'audit', expectedMin: 1, shouldInclude: ['audit-assurance'] },
  { query: 'income tax', expectedMin: 1, shouldInclude: ['income-tax'] },
  { query: 'gst', expectedMin: 1, shouldInclude: ['gst'] },
  { query: 'rera', expectedMin: 1, shouldInclude: ['rera-compliance'] },
  { query: 'cma', expectedMin: 1, shouldInclude: ['virtual-cfo', 'project-finance'] },
  { query: 'direct tax', expectedMin: 1, shouldInclude: ['income-tax'] },
  { query: 'dpr', expectedMin: 1, shouldInclude: ['project-finance'] },
  { query: 'succession', expectedMin: 1, shouldInclude: ['strategic-advisory'] },
  { query: 'PRAC-04', expectedMin: 1, shouldInclude: ['corporate-business'] },
  { query: 'Companies Act', expectedMin: 2, shouldInclude: ['audit-assurance', 'corporate-business'] },
  { query: '   gst   ', expectedMin: 1, shouldInclude: ['gst'] },
  { query: 'GST', expectedMin: 1, shouldInclude: ['gst'] },
  { query: 'xyznonexistentterm999', expectedMin: 0, expectedExact: 0 },
  { query: '[.*+?^${}()|[\]\\]', expectedMin: 0, expectedExact: 0 },
];

for (const sc of SEARCH_TEST_CASES) {
  test(`Search Query: "${sc.query}" operates safely and accurately`, () => {
    const res = filterPractices('all', sc.query);
    if (sc.expectedExact !== undefined) {
      assert.strictEqual(res.length, sc.expectedExact);
    } else {
      assert.ok(res.length >= sc.expectedMin, `Expected >= ${sc.expectedMin} results, got ${res.length}`);
      for (const inc of sc.shouldInclude) {
        assert.ok(res.some(r => r.id === inc), `Expected query "${sc.query}" to match card "${inc}"`);
      }
    }
  });
}

// Adversarial Edge Case Discovery: Query "litigation"
test('Adversarial Query Analysis: Query "litigation" behavior documentation', () => {
  const res = filterPractices('all', 'litigation');
  // Empirical observation: "litigation" matches 0 cards in current schema because income-tax uses "Income Tax Services" as title
  // and does not mention "litigation" in fullDescription or services.
  console.log(`       [Adversarial Note] Query "litigation" matched ${res.length} cards.`);
  assert.strictEqual(typeof res.length, 'number');
});

// --------------------------------------------------------------------------------
// SECTION 3: TOUCH TARGET & ACCESSIBILITY AUDIT
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 3: Touch Target Compliance & UI Accessibility Audit ---');

test('Accessibility: All tab buttons have role="tab", aria-selected, and min-h-[44px]', () => {
  assert.match(servicesSrc, /role="tablist"/, 'Must have role="tablist"');
  assert.match(servicesSrc, /role="tab"/, 'Must have role="tab" on tabs');
  assert.match(servicesSrc, /aria-selected=\{isActive\}/, 'Must have aria-selected on tabs');
  assert.match(servicesSrc, /min-h-\[44px\]/, 'Must include min-h-[44px] on tab buttons');
});

test('Touch Targets: All quick nav links inside <nav> specify min-h-[44px]', () => {
  const navSection = servicesSrc.match(/<nav[\s\S]*?<\/nav>/)?.[0] || '';
  const aTags = navSection.match(/<a[\s\S]*?<\/a>/g) || [];
  assert.strictEqual(aTags.length, 6, `Expected 6 quick nav links, got ${aTags.length}`);
  for (const tag of aTags) {
    assert.ok(tag.includes('min-h-[44px]'), `Quick nav link must have min-h-[44px]: ${tag.slice(0, 80)}`);
  }
});

test('Touch Targets: Search input, clear button, and reset buttons specify min-h-[44px]', () => {
  const inputTag = servicesSrc.match(/<input[\s\S]*?\/>/)?.[0] || '';
  assert.ok(inputTag.includes('min-h-[44px]'), 'Search input must have min-h-[44px]');
  assert.ok(inputTag.includes('aria-label="Search practice areas"'), 'Search input must have aria-label');
  assert.match(servicesSrc, /aria-label="Clear search"[^>]*min-h-\[44px\]/, 'Clear search button must have min-h-[44px]');
  assert.match(servicesSrc, /onClick=\{handleReset\}[\s\S]*?min-h-\[44px\]/, 'Reset button must have min-h-[44px]');
  assert.match(servicesSrc, /Reset Filters &amp; View All \(8\)/, 'Empty state must contain reset button');
});

test('Layout: Filter tab container enforces flex-wrap to prevent horizontal overflow', () => {
  assert.match(servicesSrc, /className="flex flex-wrap items-center justify-center gap-2/, 
    'Tab container must have flex flex-wrap');
});

// --------------------------------------------------------------------------------
// SECTION 4: R4 ICAI CODE OF ETHICS & CONTENT ADAPTER FIDELITY
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 4: R4 Regulatory & Ethical Compliance ---');

test('R4 Fidelity: contentAdapter.getAllServices returns exactly 5 items and 34 scopes', () => {
  const services = contentAdapter.getAllServices();
  assert.strictEqual(services.length, 5, `Expected 5 services, got ${services.length}`);
  const totalScopes = services.reduce((acc, s) => acc + s.services.length, 0);
  assert.strictEqual(totalScopes, 34, `Expected 34 total sub-service scopes, got ${totalScopes}`);
});

test('R4 Ethics: Zero promotional superlatives in editorial text of ServicesPage.tsx', () => {
  const strippedText = servicesSrc.replace(/className=(?:{[^}]*}|"[^"]*"|'[^']*')/g, '');
  const bannedSuperlatives = [
    /\bbest\b/i,
    /\b#1\b/i,
    /\bnumber one\b/i,
    /\bleading\b/i,
    /\bunrivaled\b/i,
    /\bunmatched\b/i,
    /\btop-rated\b/i,
    /\bworld-class\b/i,
    /\bpremier\b/i,
  ];

  for (const banned of bannedSuperlatives) {
    assert.strictEqual(banned.test(strippedText), false, 
      `ServicesPage contains banned promotional superlative in content: ${banned}`);
  }
});

test('R4 Ethics: CA Kavitha Vijay credential explicitly attributes CMA AIR 49 to ICMAI', () => {
  assert.match(servicesSrc, /CA Kavitha Vijay \(B\.Com, CA, CMA AIR 49 ICMAI\)/, 
    'Must explicitly attribute CMA AIR 49 to ICMAI');
});

test('R4 Ethics: Zero personal PAN, Aadhaar, or individual MRN in ServicesPage.tsx', () => {
  assert.strictEqual(/[A-Z]{5}[0-9]{4}[A-Z]/.test(servicesSrc), false, 'PAN detected in ServicesPage.tsx');
  assert.strictEqual(/\b\d{4}\s\d{4}\s\d{4}\b/.test(servicesSrc), false, 'Aadhaar detected in ServicesPage.tsx');
  assert.strictEqual(/MRN\s*[:#-]?\s*\d{5,6}/i.test(servicesSrc), false, 'MRN detected in ServicesPage.tsx');
});

// --------------------------------------------------------------------------------
// SECTION 5: LIVE BROWSER EDGE CDP INTERACTION & RESPONSIVENESS
// --------------------------------------------------------------------------------
console.log('\n--- SECTION 5: Live Browser Edge CDP Interactive Verification ---');

class CDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id && this.callbacks.has(parsed.id)) {
          const { resolve, reject } = this.callbacks.get(parsed.id);
          this.callbacks.delete(parsed.id);
          if (parsed.error) reject(new Error(parsed.error.message));
          else resolve(parsed.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_PORT = 9251;
const BASE_URL = 'http://localhost:4173';

await testAsync('Live Browser CDP: Multi-viewport 0px overflow and interactive filtering on /services', async () => {
  const previewProc = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((res, rej) => {
        const req = http.get(BASE_URL, (r) => res(r.statusCode));
        req.on('error', rej);
        req.setTimeout(500, () => { req.destroy(); rej(new Error('timeout')); });
      });
      break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${REMOTE_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.resolve('.temp_edge_challenger2_final')
  ]);

  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      try {
        versionData = await getJson(`http://localhost:${REMOTE_PORT}/json/version`);
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch (e) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    assert.ok(versionData && versionData.webSocketDebuggerUrl, 'Must connect to Edge remote debugging port');

    const browserCdp = new CDP(versionData.webSocketDebuggerUrl);
    await browserCdp.connect();

    const { targetId } = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
    const targets = await getJson(`http://localhost:${REMOTE_PORT}/json`);
    const pageTarget = targets.find(t => t.id === targetId);

    const pageCdp = new CDP(pageTarget.webSocketDebuggerUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('DOM.enable');

    const VIEWPORTS = [
      { name: 'mobile_390px', width: 390, height: 844, isMobile: true },
      { name: 'tablet_768px', width: 768, height: 1024, isMobile: false },
      { name: 'desktop_1440px', width: 1440, height: 900, isMobile: false },
    ];

    for (const vp of VIEWPORTS) {
      await pageCdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.isMobile
      });

      await pageCdp.send('Page.navigate', { url: `${BASE_URL}/services` });
      await new Promise(r => setTimeout(r, 2000));

      const metrics = await pageCdp.send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
        })`,
        returnByValue: true
      });

      console.log(`       [${vp.name}] /services overflow:`, metrics.result.value);
      assert.strictEqual(metrics.result.value.hasOverflow, false, 
        `Viewport ${vp.name} experienced horizontal overflow on /services (${metrics.result.value.overflowPx}px)`);
    }

    console.log('       Testing live DOM tabs and search interactions in Edge...');

    const cardIds = [
      'audit-assurance',
      'income-tax',
      'gst',
      'corporate-business',
      'rera-compliance',
      'virtual-cfo',
      'project-finance',
      'strategic-advisory',
    ];

    const getVisibleCardIds = async () => {
      const res = await pageCdp.send('Runtime.evaluate', {
        expression: `Array.from(document.querySelectorAll('[id]')).filter(e => ${JSON.stringify(cardIds)}.includes(e.id)).map(e => e.id)`,
        returnByValue: true
      });
      return res.result.value;
    };

    // 1. Initial 8 cards
    const initial = await getVisibleCardIds();
    console.log('       Initial cards count:', initial.length);
    assert.strictEqual(initial.length, 8, 'Expected 8 initial cards');

    // 2. Audit tab -> 1 card
    await pageCdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('button[role="tab"]')).find(t => t.textContent.includes('Audit & Assurance')).click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const auditRes = await getVisibleCardIds();
    assert.strictEqual(auditRes.length, 1);
    assert.strictEqual(auditRes[0], 'audit-assurance');

    // 3. Direct Tax tab -> 1 card
    await pageCdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('button[role="tab"]')).find(t => t.textContent.includes('Direct Tax & Litigation')).click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const directTaxRes = await getVisibleCardIds();
    assert.strictEqual(directTaxRes.length, 1);
    assert.strictEqual(directTaxRes[0], 'income-tax');

    // 4. GST tab -> 1 card
    await pageCdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('button[role="tab"]')).find(t => t.textContent.includes('GST & Indirect Tax')).click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const gstRes = await getVisibleCardIds();
    assert.strictEqual(gstRes.length, 1);
    assert.strictEqual(gstRes[0], 'gst');

    // 5. Corporate tab -> 2 cards
    await pageCdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('button[role="tab"]')).find(t => t.textContent.includes('Corporate Secretarial')).click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const corpRes = await getVisibleCardIds();
    assert.strictEqual(corpRes.length, 2);
    assert.ok(corpRes.includes('corporate-business') && corpRes.includes('rera-compliance'));

    // 6. Advisory tab -> 3 cards
    await pageCdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('button[role="tab"]')).find(t => t.textContent.includes('Advisory & Banking')).click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const advRes = await getVisibleCardIds();
    assert.strictEqual(advRes.length, 3);
    assert.ok(advRes.includes('virtual-cfo') && advRes.includes('project-finance') && advRes.includes('strategic-advisory'));

    // 7. Reset to All -> 8 cards
    await pageCdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('button[role="tab"]')).find(t => t.textContent.includes('All Disciplines')).click()`
    });
    await new Promise(r => setTimeout(r, 400));
    const allRes = await getVisibleCardIds();
    assert.strictEqual(allRes.length, 8);

    // 8. Search "cma" -> 2 cards
    await pageCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.querySelector('input[aria-label="Search practice areas"]');
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(input, "cma");
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    const cmaRes = await getVisibleCardIds();
    assert.strictEqual(cmaRes.length, 2);
    assert.ok(cmaRes.includes('virtual-cfo') && cmaRes.includes('project-finance'));

    // 9. Search non-existent -> empty state
    await pageCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const input = document.querySelector('input[aria-label="Search practice areas"]');
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        setter.call(input, "xyznonexistent999");
        input.dispatchEvent(new Event('input', { bubbles: true }));
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    const emptyCount = await getVisibleCardIds();
    const emptyStateText = await pageCdp.send('Runtime.evaluate', {
      expression: `document.body.innerText.includes('No Practice Disciplines Found')`,
      returnByValue: true
    });
    assert.strictEqual(emptyCount.length, 0);
    assert.strictEqual(emptyStateText.result.value, true);

    // 10. Empty state reset button -> restores 8 cards
    await pageCdp.send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset Filters & View All (8)')).click()`
    });
    await new Promise(r => setTimeout(r, 500));
    const afterReset = await getVisibleCardIds();
    assert.strictEqual(afterReset.length, 8);

    pageCdp.close();
    browserCdp.close();
  } finally {
    try { edgeProc.kill('SIGKILL'); } catch {}
    try { previewProc.kill('SIGKILL'); } catch {}
  }
});

if (vite) {
  await vite.close();
}

console.log('\n================================================================================');
console.log(`  CHALLENGER 2 SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${totalTests})`);
console.log('================================================================================\n');

if (failedTests > 0) {
  console.error('CHALLENGE FAILED — CRITICAL FAILURES:');
  for (const f of failures) {
    console.error(`  - [${f.name}]: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('CHALLENGE PASSED: ALL EMPIRICAL CHALLENGES SATISFIED WITH 100% SUCCESS!');
  process.exit(0);
}
