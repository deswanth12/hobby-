import assert from 'node:assert/strict';
import path from 'node:path';
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
    const shortErr = err.message ? err.message.slice(0, 150) : String(err);
    failures.push({ name, error: shortErr });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${shortErr}`);
  }
}

console.log('================================================================');
console.log('  TEST: V8 FINANCIAL UTILITIES & INTERACTIVE CALCULATORS         ');
console.log('================================================================');

let vite = null;
let calcEngine = null;
let rocRules = null;
let toolsBarrel = null;
let routerMod = null;

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

  calcEngine = await vite.ssrLoadModule('/src/components/knowledge-bank/calculationEngine.ts');
  rocRules = await vite.ssrLoadModule('/src/v8/components/tools/rocStampDutyRules.ts');
  toolsBarrel = await vite.ssrLoadModule('/src/v8/components/tools/index.ts');
  routerMod = await vite.ssrLoadModule('react-router-dom');
} catch (err) {
  console.error('Failed to initialize Vite SSR runner:', err);
  process.exit(1);
}

const { calculateIncomeTax } = calcEngine;
const { calculateApIncorporationCosts } = rocRules;
const { TaxRegimeComparator, StartupStampDutyEstimator } = toolsBarrel;
const { MemoryRouter } = routerMod;

// ────────────────────────────────────────────────────────────
// Suite 1: Income Tax Comparator Statutory Engine Tests
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 1: Income Tax Comparator Statutory Engine Tests');

check('TaxRegimeComparator Engine: FY 2025-26 Salaried ₹12.75 Lakhs pays ₹0 tax under New Regime', () => {
  const result = calculateIncomeTax({
    financialYear: 'FY 2025-26',
    ageCategory: 'general',
    salaryIncome: 1275000,
    otherIncome: 0,
    deductions80C: 0,
    deductions80D: 0,
    deductions80CCD1B: 0,
    homeLoanInterest24b: 0,
    hraExemption: 0,
    otherDeductions: 0,
  });

  assert.strictEqual(result.newRegime.standardDeduction, 75000, 'New regime std deduction must be ₹75,000');
  assert.strictEqual(result.newRegime.netTaxableIncome, 1200000, 'Net taxable income should be ₹12,00,000');
  assert.strictEqual(result.newRegime.rebate87A, 60000, 'Rebate under Section 87A must be ₹60,000');
  assert.strictEqual(result.newRegime.totalTaxPayable, 0, 'Total tax payable must be strictly ₹0');
  assert.strictEqual(result.recommendedRegime, 'NEW', 'Recommended regime must be NEW');
});

check('TaxRegimeComparator Engine: High Chapter VI-A deductions can favor Old Regime', () => {
  const result = calculateIncomeTax({
    financialYear: 'FY 2025-26',
    ageCategory: 'general',
    salaryIncome: 1600000,
    otherIncome: 0,
    deductions80C: 150000,
    deductions80D: 50000,
    deductions80CCD1B: 50000,
    homeLoanInterest24b: 200000,
    hraExemption: 150000,
    otherDeductions: 0,
  });

  assert.strictEqual(result.oldRegime.chapterVIAClaims, 600000, 'Total Old Regime claims should be ₹6,00,000');
  assert.ok(result.recommendedRegime === 'OLD', 'Old regime should be recommended when deductions exceed breakeven');
  assert.ok(result.taxDifference > 0, 'Tax difference should indicate positive savings');
});

check('TaxRegimeComparator Engine: FY 2026-27 is flagged as provisional', () => {
  const result = calculateIncomeTax({
    financialYear: 'FY 2026-27',
    ageCategory: 'general',
    salaryIncome: 1000000,
    otherIncome: 0,
    deductions80C: 0,
    deductions80D: 0,
    deductions80CCD1B: 0,
    homeLoanInterest24b: 0,
    hraExemption: 0,
    otherDeductions: 0,
  });

  assert.strictEqual(result.isProvisional, true, 'FY 2026-27 must be marked provisional');
  assert.ok(result.provisionalNotice?.includes('PROVISIONAL'), 'Provisional notice must be displayed');
});

// ────────────────────────────────────────────────────────────
// Suite 2: Startup Capital & AP ROC Stamp Duty Engine Tests
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 2: Startup Capital & AP ROC Stamp Duty Engine Tests');

check('ROC & Stamp Duty Engine: Authorized Capital <= ₹15 Lakhs has ₹0 ROC Filing Fee', () => {
  const result = calculateApIncorporationCosts({
    entityType: 'pvt_ltd',
    authorizedCapital: 1000000, // ₹10 Lakhs
    numberOfDirectors: 2,
    needNameReservationPreApproval: false,
  });

  assert.strictEqual(result.rocFilingFee, 0, 'ROC filing fee must be ₹0 for capital <= ₹15L');
  assert.strictEqual(result.isRocFeeExempt, true, 'isRocFeeExempt must be true');
  assert.strictEqual(result.moaStampDuty, 1000, 'AP MoA stamp duty for ₹10L should be ₹1,000');
  assert.strictEqual(result.aoaStampDuty, 1500, 'AP AoA stamp duty should be 0.15% of ₹10L = ₹1,500');
  assert.strictEqual(result.inc9AffidavitDuty, 200, 'INC-9 affidavit for 2 directors = ₹200');
  assert.strictEqual(result.panTanFee, 131, 'PAN & TAN combined fee must be ₹131');
  assert.strictEqual(result.totalGovernmentStatutoryDues, 0 + 1000 + 1500 + 200 + 131, 'Total Govt dues should match');
  assert.strictEqual(result.dscEstimatedCost, 2800, 'DSC for 2 directors should be 2 * ₹1,400 = ₹2,800');
});

check('ROC & Stamp Duty Engine: Authorized Capital ₹50 Lakhs calculates tiered ROC fee & AP stamp', () => {
  const result = calculateApIncorporationCosts({
    entityType: 'pvt_ltd',
    authorizedCapital: 5000000, // ₹50 Lakhs
    numberOfDirectors: 3,
    needNameReservationPreApproval: true,
  });

  assert.ok(result.rocFilingFee > 0, 'ROC fee should be non-zero above ₹15 Lakhs');
  assert.strictEqual(result.isRocFeeExempt, false, 'isRocFeeExempt must be false');
  assert.strictEqual(result.moaStampDuty, 2000, 'AP MoA stamp duty for ₹50L should be ₹2,000');
  assert.strictEqual(result.aoaStampDuty, 7500, 'AP AoA stamp duty should be 0.15% of ₹50L = ₹7,500');
  assert.strictEqual(result.nameReservationFee, 1000, 'RUN name pre-approval fee should be ₹1,000');
  assert.strictEqual(result.dscEstimatedCost, 4200, 'DSC for 3 directors should be 3 * ₹1,400 = ₹4,200');
});

// ────────────────────────────────────────────────────────────
// Suite 3: React SSR Rendering & Interactive Component Checks
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 3: React SSR Rendering & Interactive Component Checks');

check('TaxRegimeComparator component renders cleanly via SSR without crashing', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(TaxRegimeComparator)
    )
  );

  assert.ok(html.includes('Old vs. New Tax Regime Comparator'), 'Component must render title');
  assert.ok(html.includes('FINANCE ACT 2025 COMPLIANT'), 'Component must render statutory badge');
  assert.ok(html.includes('Schedule Partner Tax Planning'), 'Component must render consultation CTA');
  assert.ok(html.includes('btn-shimmer'), 'Button must include metallic shimmer');
});

check('StartupStampDutyEstimator component renders cleanly via SSR without crashing', () => {
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(StartupStampDutyEstimator)
    )
  );

  assert.ok(html.includes('Startup Capital &amp; AP ROC Stamp Duty Estimator'), 'Component must render title');
  assert.ok(html.includes('ANDHRA PRADESH STAMP ACT'), 'Component must render AP stamp badge');
  assert.ok(html.includes('Schedule Partner Scoping'), 'Component must render scoping CTA');
  assert.ok(html.includes('btn-shimmer'), 'Button must include metallic shimmer');
});

console.log('\n================================================================');
console.log(`TOTAL UTILITIES TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('================================================================');

if (vite) await vite.close();

if (failCount > 0) {
  process.exit(1);
}
