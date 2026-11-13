/**
 * tests/challenger-m4-services.mjs
 *
 * EMPIRICAL ADVERSARIAL CHALLENGER SUITE — MILESTONE 4
 * Focus: Services Master Directory & 34 Sub-Service Scopes, 6 Dedicated Practice Corridors,
 *        Dynamic Route Canonical Aliasing & 404 Quarantine, Secondary Corridors (Industries & Locations),
 *        Touch Target Compliance (>= 44px), and R4 Statutory & Ethical Boundaries.
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

console.log('================================================================================');
console.log('  CHALLENGER M4: SERVICES DIRECTORY & CORRIDORS EMPIRICAL ADVERSARIAL SUITE     ');
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
    console.log(`\x1b[32m✔ PASS\x1b[0m [Test ${totalTests.toString().padStart(3, '0')}] ${name}`);
  } catch (err) {
    failedTests++;
    const errMsg = err.message || String(err);
    failures.push({ name, error: errMsg });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Test ${totalTests.toString().padStart(3, '0')}] ${name}`);
    console.log(`       Details: ${errMsg}`);
  }
}

async function testAsync(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Test ${totalTests.toString().padStart(3, '0')}] ${name}`);
  } catch (err) {
    failedTests++;
    const errMsg = err.message || String(err);
    failures.push({ name, error: errMsg });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Test ${totalTests.toString().padStart(3, '0')}] ${name}`);
    console.log(`       Details: ${errMsg}`);
  }
}

// Initialize Vite SSR Runner with unified React Router resolving
let vite = null;
let MemoryRouter = null;
let Routes = null;
let Route = null;
let contentAdapterModule = null;
let pagesModule = null;
let servicesBarrelModule = null;

try {
  const rrdPath = path.resolve('node_modules/react-router-dom/dist/index.mjs');

  vite = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    optimizeDeps: {
      noDiscovery: true,
      entries: [],
      include: [],
    },
    resolve: {
      alias: {
        'react-router-dom': rrdPath,
      },
    },
  });

  const rrdModule = await vite.ssrLoadModule(rrdPath);
  MemoryRouter = rrdModule.MemoryRouter;
  Routes = rrdModule.Routes;
  Route = rrdModule.Route;

  contentAdapterModule = await vite.ssrLoadModule('/src/v8/adapters/contentAdapter.ts');
  pagesModule = await vite.ssrLoadModule('/src/v8/pages/index.ts');
  servicesBarrelModule = await vite.ssrLoadModule('/src/v8/pages/services/index.ts');
} catch (err) {
  console.error('CRITICAL: Vite SSR failed to initialize:', err);
  process.exit(1);
}

// ================================================================================
// SUITE 1: 34 SUB-SERVICE SCOPES EMPIRICAL INTEGRITY & ORACLE VALIDATION
// ================================================================================
console.log('\n--- SUITE 1: 34 Sub-Service Scopes Empirical Integrity & Oracle ---');

const EXPECTED_CATEGORIES = [
  { id: 'income-tax', expectedCount: 8, titleKeyword: 'Income Tax' },
  { id: 'gst', expectedCount: 7, titleKeyword: 'GST' },
  { id: 'corporate-business', expectedCount: 8, titleKeyword: 'Corporate' },
  { id: 'rera-compliance', expectedCount: 5, titleKeyword: 'RERA' },
  { id: 'advisory-consulting', expectedCount: 6, titleKeyword: 'Advisory' },
];

test('Oracle: contentAdapter.getAllServices returns exactly 5 categories', () => {
  const categories = contentAdapterModule.getAllServices();
  assert.ok(Array.isArray(categories), 'Categories must be an array');
  assert.strictEqual(categories.length, 5, `Expected 5 categories, got ${categories.length}`);
});

test('Oracle: Every category contains valid schema, title, description, and statutory framework', () => {
  const categories = contentAdapterModule.getAllServices();
  for (const cat of categories) {
    assert.ok(cat.id && typeof cat.id === 'string', `Category ${cat.id} must have a valid id`);
    assert.ok(cat.title && cat.title.length > 3, `Category ${cat.id} must have a title > 3 chars`);
    assert.ok(cat.shortDescription && cat.shortDescription.length > 20, `Category ${cat.id} must have a descriptive shortDescription`);
    assert.ok(cat.fullDescription && cat.fullDescription.length > 50, `Category ${cat.id} must have a comprehensive fullDescription`);
    assert.ok(cat.statutoryFramework && cat.statutoryFramework.length > 10, `Category ${cat.id} must cite statutory frameworks`);
    assert.ok(cat.targetClients && cat.targetClients.length > 5, `Category ${cat.id} must specify target clients`);
    assert.ok(Array.isArray(cat.typicalScenarios) && cat.typicalScenarios.length >= 3, `Category ${cat.id} must specify >= 3 typical engagement scenarios`);
  }
});

test('Oracle: Sub-service counts match statutory distribution (8 + 7 + 8 + 5 + 6 = 34)', () => {
  const categories = contentAdapterModule.getAllServices();
  let totalCount = 0;
  for (const exp of EXPECTED_CATEGORIES) {
    const found = categories.find(c => c.id === exp.id);
    assert.ok(found, `Category ${exp.id} must exist in getAllServices()`);
    assert.strictEqual(found.services.length, exp.expectedCount, 
      `Category ${exp.id} expected ${exp.expectedCount} sub-services, got ${found.services.length}`);
    totalCount += found.services.length;
  }
  assert.strictEqual(totalCount, 34, `Total sub-service scopes across categories must be exactly 34, got ${totalCount}`);
});

test('Adversarial: All 34 sub-services are non-empty, non-whitespace, and > 5 characters', () => {
  const categories = contentAdapterModule.getAllServices();
  for (const cat of categories) {
    for (const service of cat.services) {
      assert.strictEqual(typeof service, 'string', 'Sub-service item must be a string');
      assert.ok(service.trim().length > 5, `Sub-service "${service}" in ${cat.id} must be > 5 characters`);
      assert.strictEqual(/lorem|todo|tbd|placeholder|temp/i.test(service), false, 
        `Sub-service "${service}" must not contain placeholder words`);
    }
  }
});

test('Adversarial: Zero duplicate sub-services across all 5 categories (Set size === 34)', () => {
  const categories = contentAdapterModule.getAllServices();
  const allSubServices = [];
  const seenSet = new Set();
  const duplicates = [];

  for (const cat of categories) {
    for (const service of cat.services) {
      const normalized = service.toLowerCase().trim();
      allSubServices.push(normalized);
      if (seenSet.has(normalized)) {
        duplicates.push(service);
      }
      seenSet.add(normalized);
    }
  }

  assert.strictEqual(duplicates.length, 0, `Found duplicate sub-services across categories: ${duplicates.join(', ')}`);
  assert.strictEqual(seenSet.size, 34, `Expected 34 unique sub-services, got set size ${seenSet.size}`);
});

test('Oracle: Audit Spotlight provides 9 distinct, non-empty statutory audit streams', () => {
  const auditStreams = contentAdapterModule.getAuditSpotlightServices();
  assert.strictEqual(auditStreams.length, 9, `Expected 9 audit streams, got ${auditStreams.length}`);

  const names = new Set();
  for (const stream of auditStreams) {
    assert.ok(stream.name && stream.name.trim().length > 3, `Audit stream name "${stream.name}" must be valid`);
    assert.ok(stream.statute && stream.statute.trim().length > 3, `Audit stream "${stream.name}" must cite statute`);
    assert.ok(stream.scope && stream.scope.trim().length > 15, `Audit stream "${stream.name}" must define scope`);
    assert.ok(stream.deliverable && stream.deliverable.trim().length > 5, `Audit stream "${stream.name}" must define deliverable`);
    assert.ok(stream.applicableEntity && stream.applicableEntity.trim().length > 5, `Audit stream "${stream.name}" must define applicableEntity`);
    names.add(stream.name.toLowerCase().trim());
  }
  assert.strictEqual(names.size, 9, 'All 9 audit stream names must be unique');
});

// ================================================================================
// SUITE 2: SERVICES MASTER DIRECTORY SSR & RENDERING BEHAVIOR
// ================================================================================
console.log('\n--- SUITE 2: Services Master Directory SSR & UI Mechanics ---');

await testAsync('SSR: ServicesPage renders cleanly with React DOM Server without exceptions', async () => {
  const { ServicesPage } = pagesModule;
  assert.ok(ServicesPage, 'ServicesPage must be exported');

  const html = renderToString(
    React.createElement(MemoryRouter, { initialEntries: ['/services'] },
      React.createElement(ServicesPage)
    )
  );

  assert.ok(html && html.length > 5000, `Rendered HTML must have substantial content (got ${html?.length} chars)`);
  assert.ok(html.includes('Statutory Rigour. Multi-Disciplinary Counsel.') || html.includes('PRACTICE DISCIPLINES'), 
    'Rendered HTML must contain master header text');
  assert.ok(html.includes('34 SUB-SERVICE SCOPES'), 'Rendered HTML must advertise 34 sub-service scopes');
});

test('UI Mechanics: ServicesPage features 5:7 asymmetric ledger grid and all 5 categories', () => {
  const servicesSrc = fs.readFileSync(path.resolve('src/v8/pages/ServicesPage.tsx'), 'utf8');
  assert.match(servicesSrc, /lg:col-span-5/, 'ServicesPage must implement 5-column left panel');
  assert.match(servicesSrc, /lg:col-span-7/, 'ServicesPage must implement 7-column right panel');
  assert.match(servicesSrc, /income-tax/, 'ServicesPage must map income-tax corridor');
  assert.match(servicesSrc, /gst/, 'ServicesPage must map gst corridor');
  assert.match(servicesSrc, /corporate-business/, 'ServicesPage must map corporate-business corridor');
  assert.match(servicesSrc, /rera-compliance/, 'ServicesPage must map rera-compliance corridor');
  assert.match(servicesSrc, /advisory-consulting/, 'ServicesPage must map advisory-consulting corridor');
});

test('UI Mechanics: Audit Spotlight Banner links directly to /services/audit-assurance', () => {
  const servicesSrc = fs.readFileSync(path.resolve('src/v8/pages/ServicesPage.tsx'), 'utf8');
  assert.match(servicesSrc, /\/services\/audit-assurance/, 'Must contain direct link to /services/audit-assurance');
  assert.match(servicesSrc, /Statutory Audit Spotlight|Featured Core Specialization/, 'Must render audit spotlight badge/header');
});

test('UI Mechanics: Virtual CFO Retainer Card links directly to /services/virtual-cfo-tirupati', () => {
  const servicesSrc = fs.readFileSync(path.resolve('src/v8/pages/ServicesPage.tsx'), 'utf8');
  assert.match(servicesSrc, /\/services\/virtual-cfo-tirupati/, 'Must contain direct link to /services/virtual-cfo-tirupati');
  assert.match(servicesSrc, /Virtual CFO/, 'Must highlight Virtual CFO practice');
  assert.match(servicesSrc, /Retainer/, 'Must detail retainer structure');
});

test('UI Mechanics: 4-Stage Engagement Workflow renders with distinct numbered phases (01 to 04)', () => {
  const servicesSrc = fs.readFileSync(path.resolve('src/v8/pages/ServicesPage.tsx'), 'utf8');
  assert.match(servicesSrc, /01/, 'Phase 1 marker must exist');
  assert.match(servicesSrc, /02/, 'Phase 2 marker must exist');
  assert.match(servicesSrc, /03/, 'Phase 3 marker must exist');
  assert.match(servicesSrc, /04/, 'Phase 4 marker must exist');
  assert.match(servicesSrc, /Engagement &amp; Execution Workflow|The 4-Stage Client Engagement Cycle/i, 
    'Workflow section title must be present');
});

// ================================================================================
// SUITE 3: 6 DEDICATED PRACTICE CORRIDORS SSR EVALUATION & STATUTORY CITATIONS
// ================================================================================
console.log('\n--- SUITE 3: 6 Dedicated Practice Corridors SSR & Statutory Citations ---');

const CORRIDORS = [
  {
    code: 'PRAC-01',
    componentName: 'AuditAssurancePage',
    route: '/services/audit-assurance',
    filePath: 'src/v8/pages/services/AuditAssurancePage.tsx',
    statutes: ['Companies Act', 'CARO 2020', 'Internal Financial Controls', 'CMA AIR 49', 'UDIN'],
    titlePattern: /Statutory Audit in Tirupati/i,
  },
  {
    code: 'PRAC-02',
    componentName: 'IncomeTaxPage',
    route: '/services/income-tax-consultant-tirupati',
    filePath: 'src/v8/pages/services/IncomeTaxPage.tsx',
    statutes: ['Section 115BAA', 'Section 44AB', 'Advance Tax', '15 Jun', '15 Sep', '15 Dec', '15 Mar'],
    titlePattern: /Income Tax Consultant in Tirupati/i,
  },
  {
    code: 'PRAC-03',
    componentName: 'GSTServicesPage',
    route: '/services/gst-consultant-tirupati',
    filePath: 'src/v8/pages/services/GSTServicesPage.tsx',
    statutes: ['GSTR-1', 'GSTR-3B', 'GSTR-2B', 'GSTR-9', 'Section 50', 'Net Cash Liability'],
    titlePattern: /GST Consultant in Tirupati/i,
  },
  {
    code: 'PRAC-04',
    componentName: 'CompanyRegistrationPage',
    route: '/services/company-registration-tirupati',
    filePath: 'src/v8/pages/services/CompanyRegistrationPage.tsx',
    statutes: ['SPICe+', 'ADT-1', 'INC-20A', 'DPIIT', 'Section 80-IAC', 'Companies Act'],
    titlePattern: /Company Registration in Tirupati/i,
  },
  {
    code: 'PRAC-05',
    componentName: 'VirtualCFOPage',
    route: '/services/virtual-cfo-tirupati',
    filePath: 'src/v8/pages/services/VirtualCFOPage.tsx',
    statutes: ['CMA', 'CMA AIR 49', 'Cash Flow', 'Working Capital', 'MIS', 'Retainer'],
    titlePattern: /Virtual CFO/i,
  },
  {
    code: 'PRAC-06',
    componentName: 'RERAConsultantPage',
    route: '/services/rera-consultant-tirupati',
    filePath: 'src/v8/pages/services/RERAConsultantPage.tsx',
    statutes: ['Section 4(2)(l)(D)', '70%', 'Escrow', 'Form 3', 'Quarterly'],
    titlePattern: /RERA Consultant in Tirupati/i,
  },
];

for (const c of CORRIDORS) {
  await testAsync(`SSR: Corridor [${c.code}] ${c.componentName} evaluates and renders via React DOM Server`, async () => {
    const Component = servicesBarrelModule[c.componentName];
    assert.ok(Component, `${c.componentName} must be exported from services barrel`);

    const html = renderToString(
      React.createElement(MemoryRouter, { initialEntries: [c.route] },
        React.createElement(Component)
      )
    );

    assert.ok(html && html.length > 5000, `${c.componentName} rendered HTML must be substantial (got ${html?.length} chars)`);
    assert.ok(html.includes(c.code), `${c.componentName} rendered HTML must include discipline code ${c.code}`);
  });

  test(`Corridor [${c.code}]: Source contains breadcrumbs and mandatory statutory citations`, () => {
    const src = fs.readFileSync(path.resolve(c.filePath), 'utf8');
    assert.match(src, /breadcrumbs\s*=\s*\[/, `${c.componentName} must define structured breadcrumbs`);
    assert.match(src, /canonicalPath/, `${c.componentName} must define canonicalPath in SEOHead`);
    assert.match(src, /jsonLd/, `${c.componentName} must define jsonLd schema in SEOHead`);

    for (const st of c.statutes) {
      assert.ok(src.includes(st), `${c.componentName} must explicitly cite "${st}"`);
    }
  });
}

// ================================================================================
// SUITE 4: DYNAMIC ROUTE /services/:slug, CANONICAL ALIASES & 404 QUARANTINE
// ================================================================================
console.log('\n--- SUITE 4: Dynamic Route /services/:slug, Aliasing & 404 Quarantine ---');

const { DynamicServiceDetailPage } = servicesBarrelModule;

const CANONICAL_MAP_DATA = {
  'audit-assurance': '/services/audit-assurance',
  'income-tax-consultant-tirupati': '/services/income-tax-consultant-tirupati',
  'income-tax': '/services/income-tax-consultant-tirupati',
  'gst-consultant-tirupati': '/services/gst-consultant-tirupati',
  'gst': '/services/gst-consultant-tirupati',
  'company-registration-tirupati': '/services/company-registration-tirupati',
  'corporate-business': '/services/company-registration-tirupati',
  'virtual-cfo-tirupati': '/services/virtual-cfo-tirupati',
  'advisory-consulting': '/services/virtual-cfo-tirupati',
  'rera-consultant-tirupati': '/services/rera-consultant-tirupati',
  'rera-compliance': '/services/rera-consultant-tirupati',
};

const dynamicServiceSrc = fs.readFileSync(path.resolve('src/v8/pages/services/DynamicServiceDetailPage.tsx'), 'utf8');

test('Dynamic Route: DynamicServiceDetailPage defines exact canonical alias map for all 6 corridors', () => {
  for (const [slug, target] of Object.entries(CANONICAL_MAP_DATA)) {
    assert.ok(dynamicServiceSrc.includes(`'${slug}': '${target}'`), 
      `DynamicServiceDetailPage must map canonical alias '${slug}' -> '${target}'`);
  }
});

const ADVERSARIAL_404_SLUGS = [
  'bogus-service-slug',
  'tax-evasion-services',
  'crypto-arbitrage-desk',
  'completely-nonexistent-practice',
  'internal-audit-best-practices', // blog post slug, not a service!
  'draft-service-xyz',
];

for (const bogusSlug of ADVERSARIAL_404_SLUGS) {
  test(`Adversarial 404 Quarantine: Slug "${bogusSlug}" renders NotFoundPage`, () => {
    const html = renderToString(
      React.createElement(MemoryRouter, { initialEntries: [`/services/${bogusSlug}`] },
        React.createElement(Routes, null,
          React.createElement(Route, { path: '/services/:slug', element: React.createElement(DynamicServiceDetailPage) })
        )
      )
    );

    assert.ok(html.includes('404') || html.includes('Page Not Found') || html.includes('Return to Chambers') || html.includes('NotFoundPage'),
      `Bogus slug "${bogusSlug}" must trigger NotFoundPage, got: ${html.slice(0, 300)}`);
  });
}

// ================================================================================
// SUITE 5: SECONDARY CORRIDORS (IndustriesPage.tsx & LocationsPage.tsx)
// ================================================================================
console.log('\n--- SUITE 5: Secondary Corridors (IndustriesPage & LocationsPage) ---');

const { IndustriesPage, LocationsPage } = pagesModule;

await testAsync('SSR: IndustriesPage renders 10 commercial domains and cross-sector compliance matrix', async () => {
  assert.ok(IndustriesPage, 'IndustriesPage must be exported');

  const html = renderToString(
    React.createElement(MemoryRouter, { initialEntries: ['/industries'] },
      React.createElement(IndustriesPage)
    )
  );

  const EXPECTED_DOMAINS = [
    'Startups & Emerging Ventures',
    'MSMEs & Family Businesses',
    'Manufacturing & Industrial',
    'Real Estate & Infrastructure',
    'Retail & Distribution',
    'Healthcare & Pharmaceuticals',
    'Education & Academic Institutions',
    'E-Commerce & Digital Commerce',
    'Professionals & Consultants',
    'NGOs, Societies & Public Trusts',
  ];

  for (const domain of EXPECTED_DOMAINS) {
    const encoded = domain.replace(/&/g, '&amp;');
    assert.ok(html.includes(encoded) || html.includes(domain), `IndustriesPage must render sector "${domain}"`);
  }

  assert.ok(html.includes('Cross-Sector Compliance') || html.includes('COMPARATIVE STATUTORY MATRIX'), 
    'IndustriesPage must render cross-sector compliance section/table');
});

await testAsync('SSR: LocationsPage renders Principal Chambers in Tirupati and Section 27 disclosure', async () => {
  assert.ok(LocationsPage, 'LocationsPage must be exported');

  const html = renderToString(
    React.createElement(MemoryRouter, { initialEntries: ['/locations'] },
      React.createElement(LocationsPage)
    )
  );

  assert.ok(html.includes('19-12-46, 1st Floor, Near Bairagipetteda Arch') || html.includes('Bairagi Patteda'),
    'LocationsPage must render verified Tirupati chambers address');
  assert.ok(html.includes('13.6192242') && html.includes('79.418046'),
    'LocationsPage must include verified GPS coordinates');
  assert.ok(html.includes('Section 27') && html.includes('Chartered Accountants Act, 1949'),
    'LocationsPage must include mandatory Section 27 institutional disclosure');

  const EXPECTED_REGIONS = ['Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore'];
  for (const reg of EXPECTED_REGIONS) {
    assert.ok(html.includes(reg), `LocationsPage must list regional client corridor "${reg}"`);
  }
});

// ================================================================================
// SUITE 6: TOUCH TARGET COMPLIANCE (>= 44px) ACROSS ALL M4 INTERACTIVE CONTROLS
// ================================================================================
console.log('\n--- SUITE 6: Touch Target Compliance (>= 44px) Verification ---');

const M4_SOURCE_FILES = [
  'src/v8/pages/ServicesPage.tsx',
  'src/v8/pages/services/AuditAssurancePage.tsx',
  'src/v8/pages/services/IncomeTaxPage.tsx',
  'src/v8/pages/services/GSTServicesPage.tsx',
  'src/v8/pages/services/CompanyRegistrationPage.tsx',
  'src/v8/pages/services/VirtualCFOPage.tsx',
  'src/v8/pages/services/RERAConsultantPage.tsx',
  'src/v8/pages/services/DynamicServiceDetailPage.tsx',
  'src/v8/pages/IndustriesPage.tsx',
  'src/v8/pages/LocationsPage.tsx',
];

test('Component Button enforces min-h-[44px] across all size variants (sm, md, lg)', () => {
  const buttonSrc = fs.readFileSync(path.resolve('src/v8/components/common/Button.tsx'), 'utf8');
  assert.match(buttonSrc, /baseClasses\s*=[\s\S]*?min-h-\[44px\]/, 'Button baseClasses must enforce min-h-[44px]');
  assert.match(buttonSrc, /sm:\s*'.*?min-h-\[44px\]/, 'Button sm size must enforce min-h-[44px]');
  assert.match(buttonSrc, /md:\s*'.*?min-h-\[44px\]/, 'Button md size must enforce min-h-[44px]');
  assert.match(buttonSrc, /lg:\s*'.*?min-h-\[50px\]/, 'Button lg size must enforce min-h-[50px]');
  assert.match(buttonSrc, /w-11\s+h-11/, 'Button icon-circle must enforce 44x44px geometry (w-11 h-11)');
});

for (const relPath of M4_SOURCE_FILES) {
  test(`Touch Target Audit: ${relPath} enforces min-h-[44px] on all non-button interactive controls`, () => {
    const src = fs.readFileSync(path.resolve(relPath), 'utf8');

    // Find all <Link or <a or <button elements that are NOT using the <Button component
    const rawLinkMatches = src.match(/<(Link|a|button)\b[^>]*className=["']([^"']+)["'][^>]*>/g) || [];
    
    for (const tag of rawLinkMatches) {
      // Skip hidden / sr-only elements
      if (tag.includes('sr-only')) continue;

      // Check if tag specifies min-h-[44px], h-11, h-12, w-11 h-11, or is an absolute inset stretch overlay
      const hasTouchClass = 
        tag.includes('min-h-[44px]') || 
        tag.includes('min-h-[48px]') || 
        tag.includes('min-h-[50px]') || 
        tag.includes('h-11') || 
        tag.includes('h-12') || 
        tag.includes('absolute inset-0') ||
        tag.includes('py-3') ||
        tag.includes('py-3.5') ||
        tag.includes('py-4');

      assert.ok(hasTouchClass, 
        `Found interactive control in ${relPath} without verified min 44px touch target:\n${tag}`);
    }
  });
}

// ================================================================================
// SUITE 7: R4 REGULATORY & ETHICAL SAFEGUARDS VERIFICATION
// ================================================================================
console.log('\n--- SUITE 7: R4 Regulatory & Ethical Safeguards Verification ---');

test('R4: CMA AIR 49 is explicitly attributed to ICMAI in all relevant practice corridors', () => {
  const auditSrc = fs.readFileSync(path.resolve('src/v8/pages/services/AuditAssurancePage.tsx'), 'utf8');
  const cfoSrc = fs.readFileSync(path.resolve('src/v8/pages/services/VirtualCFOPage.tsx'), 'utf8');
  const servicesSrc = fs.readFileSync(path.resolve('src/v8/pages/ServicesPage.tsx'), 'utf8');
  const locationsSrc = fs.readFileSync(path.resolve('src/v8/pages/LocationsPage.tsx'), 'utf8');

  assert.match(auditSrc, /CMA AIR 49.*ICMAI|CMA AIR 49 \(ICMAI\)/i, 'AuditAssurancePage must attribute CMA AIR 49 to ICMAI');
  assert.match(cfoSrc, /CMA AIR 49.*ICMAI|CMA AIR 49 \(ICMAI\)/i, 'VirtualCFOPage must attribute CMA AIR 49 to ICMAI');
  assert.match(servicesSrc, /CMA AIR 49.*ICMAI|CMA AIR 49 \(ICMAI\)/i, 'ServicesPage must attribute CMA AIR 49 to ICMAI');
  assert.match(locationsSrc, /CMA AIR 49.*ICMAI|CMA AIR 49 \(ICMAI\)/i, 'LocationsPage must attribute CMA AIR 49 to ICMAI');
});

test('R4: Zero personal tax identifiers (PAN), Aadhaar numbers, or individual MRNs in any M4 source', () => {
  for (const relPath of M4_SOURCE_FILES) {
    const src = fs.readFileSync(path.resolve(relPath), 'utf8');
    
    // PAN format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
    assert.strictEqual(/[A-Z]{5}[0-9]{4}[A-Z]/.test(src), false, 
      `PAN leak detected in ${relPath}`);
    
    // Aadhaar format: 12 digits formatted in 4-4-4 blocks
    assert.strictEqual(/\b\d{4}\s\d{4}\s\d{4}\b/.test(src), false, 
      `Aadhaar leak detected in ${relPath}`);
    
    // Individual ICAI Membership Registration Number
    assert.strictEqual(/MRN\s*[:#-]?\s*\d{5,6}/i.test(src), false, 
      `MRN leak detected in ${relPath}`);
  }
});

test('R4: Partner portrait strictly quarantined; neutral KV / KA monograms used', () => {
  for (const relPath of M4_SOURCE_FILES) {
    const src = fs.readFileSync(path.resolve(relPath), 'utf8');
    assert.strictEqual(/<img[^>]*kavitha-photo/i.test(src), false, 
      `Partner portrait detected in ${relPath}`);
  }

  const locationsSrc = fs.readFileSync(path.resolve('src/v8/pages/LocationsPage.tsx'), 'utf8');
  assert.match(locationsSrc, />\s*KA\s*<\/div>/, 'LocationsPage must render neutral KA monogram');
});

// Close Vite SSR instance
if (vite) {
  await vite.close();
}

// ================================================================================
// SUMMARY & VERDICT
// ================================================================================
console.log('\n================================================================================');
console.log(`  CHALLENGER M4 SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED (TOTAL: ${totalTests})`);
console.log('================================================================================\n');

if (failedTests > 0) {
  console.error('CRITICAL CHALLENGE FAILURES:');
  for (const f of failures) {
    console.error(`  - [${f.name}]: ${f.error}`);
  }
  process.exit(1);
} else {
  console.log('ALL EMPIRICAL CHALLENGES PASSED WITH ZERO REGRESSIONS!');
  process.exit(0);
}
