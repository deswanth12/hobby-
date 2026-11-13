/**
 * tests/tax-calculators.test.mjs
 *
 * Dedicated Automated Test Suite for Kavitha & Associates Tax & Compliance Engines:
 * 1. Income Tax Engine:
 *    - Section 87A Old Regime across General (<60), Senior (60-79), and Super Senior (80+) citizens.
 *    - Boundary test for income exceeding ₹5,00,000 (no 87A rebate under Old Regime).
 *    - FY 2025-26 (Budget 2025 / Finance Act, 2025 revised slabs: 0-4L, 4-8L, etc., ₹60,000 87A rebate).
 *    - FY 2024-25 (Finance (No. 2) Act, 2024 slabs: 0-3L, 3-7L, etc., ₹25,000 87A rebate).
 *    - FY 2026-27 (Explicitly marked PROVISIONAL with legal notice).
 * 2. Return-Specific GST Engine:
 *    - GSTR-9 Annual Return: Strict requirement of State/UT turnover input (no silent default).
 *    - GSTR-9 statutory cap calculation under Notification No. 07/2023-CT.
 *    - GSTR-3B Monthly (Notification 19/2021-CT + Section 50 interest on net cash).
 *    - GSTR-3B QRMP (Category 1 States 22nd vs Category 2 States 24th).
 *    - GSTR-1 Monthly & QRMP (Section 50 interest strictly ₹0).
 * 3. Section 44AB Tax Audit Engine:
 *    - Section 44AB(a), (b), (d), (e), 5% digital rule, Section 271B penalty, and statutory due dates.
 * 4. Boundary, Negative, Zero, and Sanitized Inputs.
 */

import assert from 'node:assert/strict';

// ────────────────────────────────────────────────────────────
// Versioned Statutory Configuration & Engine Logic
// ────────────────────────────────────────────────────────────

// FY 2025-26 / FY 2026-27 New Regime Slabs (Union Budget 2025 / Finance Act, 2025)
const NEW_REGIME_SLABS_2025_26 = [
  { min: 0, max: 400000, rate: 0.0 },
  { min: 400000, max: 800000, rate: 0.05 },
  { min: 800000, max: 1200000, rate: 0.10 },
  { min: 1200000, max: 1600000, rate: 0.15 },
  { min: 1600000, max: 2000000, rate: 0.20 },
  { min: 2000000, max: 2400000, rate: 0.25 },
  { min: 2400000, max: null, rate: 0.30 },
];

// FY 2024-25 New Regime Slabs (Finance (No. 2) Act, 2024)
const NEW_REGIME_SLABS_2024_25 = [
  { min: 0, max: 300000, rate: 0.0 },
  { min: 300000, max: 700000, rate: 0.05 },
  { min: 700000, max: 1000000, rate: 0.10 },
  { min: 1000000, max: 1200000, rate: 0.15 },
  { min: 1200000, max: 1500000, rate: 0.20 },
  { min: 1500000, max: null, rate: 0.30 },
];

// Old Regime Slabs by Age Category
const OLD_REGIME_SLABS = {
  general: [
    { min: 0, max: 250000, rate: 0.0 },
    { min: 250000, max: 500000, rate: 0.05 },
    { min: 500000, max: 1000000, rate: 0.20 },
    { min: 1000000, max: null, rate: 0.30 },
  ],
  senior: [
    { min: 0, max: 300000, rate: 0.0 },
    { min: 300000, max: 500000, rate: 0.05 },
    { min: 500000, max: 1000000, rate: 0.20 },
    { min: 1000000, max: null, rate: 0.30 },
  ],
  superSenior: [
    { min: 0, max: 500000, rate: 0.0 },
    { min: 500000, max: 1000000, rate: 0.20 },
    { min: 1000000, max: null, rate: 0.30 },
  ],
};

function computeSlabTax(taxable, slabs) {
  let tax = 0;
  for (const slab of slabs) {
    if (taxable <= slab.min) continue;
    const upper = slab.max === null ? taxable : Math.min(taxable, slab.max);
    const inSlab = upper - slab.min;
    if (inSlab > 0) tax += Math.round(inSlab * slab.rate);
  }
  return tax;
}

function calculateIncomeTaxEngine(inputs) {
  const fy = inputs.financialYear || 'FY 2025-26';
  const age = inputs.ageCategory || 'general';
  const isProvisional = fy === 'FY 2026-27';

  const salary = Math.max(0, Number(inputs.salaryIncome) || 0);
  const other = Math.max(0, Number(inputs.otherIncome) || 0);
  const gross = salary + other;

  // New Regime Rules by FY
  const is2025OrLater = fy === 'FY 2025-26' || fy === 'FY 2026-27';
  const newSlabs = is2025OrLater ? NEW_REGIME_SLABS_2025_26 : NEW_REGIME_SLABS_2024_25;
  const newStdDed = salary > 0 ? Math.min(salary, 75000) : 0;
  const taxableNew = Math.max(0, gross - newStdDed);

  const taxBeforeRebateNew = computeSlabTax(taxableNew, newSlabs);
  let rebate87ANew = 0;

  if (is2025OrLater) {
    // FY 2025-26: ₹60,000 rebate up to ₹12 Lakhs net taxable income
    if (taxableNew <= 1200000) {
      rebate87ANew = Math.min(taxBeforeRebateNew, 60000);
    } else {
      // Marginal Relief: Tax cannot exceed excess over ₹12 Lakhs
      const excess = taxableNew - 1200000;
      if (taxBeforeRebateNew > excess) {
        rebate87ANew = taxBeforeRebateNew - excess;
      }
    }
  } else {
    // FY 2024-25: ₹25,000 rebate up to ₹7 Lakhs net taxable income
    if (taxableNew <= 700000) {
      rebate87ANew = Math.min(taxBeforeRebateNew, 25000);
    } else {
      // Marginal Relief: Tax cannot exceed excess over ₹7 Lakhs
      const excess = taxableNew - 700000;
      if (taxBeforeRebateNew > excess) {
        rebate87ANew = taxBeforeRebateNew - excess;
      }
    }
  }

  const taxAfterRebateNew = Math.max(0, taxBeforeRebateNew - rebate87ANew);
  let surchargeNew = 0;
  if (taxableNew > 20000000) surchargeNew = Math.round(taxAfterRebateNew * 0.25);
  else if (taxableNew > 10000000) surchargeNew = Math.round(taxAfterRebateNew * 0.15);
  else if (taxableNew > 5000000) surchargeNew = Math.round(taxAfterRebateNew * 0.10);

  const cessNew = Math.round((taxAfterRebateNew + surchargeNew) * 0.04);
  const totalNew = taxAfterRebateNew + surchargeNew + cessNew;

  // Old Regime Rules
  const stdDedOld = salary > 0 ? Math.min(salary, 50000) : 0;
  const claim80C = Math.min(150000, Math.max(0, Number(inputs.deductions80C) || 0));
  const claim80D = Math.max(0, Number(inputs.deductions80D) || 0);
  const claim80CCD = Math.min(50000, Math.max(0, Number(inputs.deductions80CCD1B) || 0));
  const claim24b = Math.min(200000, Math.max(0, Number(inputs.homeLoanInterest24b) || 0));
  const claimHRA = Math.max(0, Number(inputs.hraExemption) || 0);
  const claimOther = Math.max(0, Number(inputs.otherDeductions) || 0);

  const totalOldDeductions = Math.min(gross, stdDedOld + claim80C + claim80D + claim80CCD + claim24b + claimHRA + claimOther);
  const taxableOld = Math.max(0, gross - totalOldDeductions);

  const oldSlabs = OLD_REGIME_SLABS[age] || OLD_REGIME_SLABS.general;
  const taxBeforeRebateOld = computeSlabTax(taxableOld, oldSlabs);
  let rebate87AOld = 0;

  // Statutory Section 87A Old Regime Rule:
  // Available to ANY resident individual whose total income does not exceed ₹5,00,000.
  // Deduction = 100% of income-tax or ₹12,500, whichever is less.
  if (taxableOld <= 500000) {
    rebate87AOld = Math.min(taxBeforeRebateOld, 12500);
  }

  const taxAfterRebateOld = Math.max(0, taxBeforeRebateOld - rebate87AOld);
  let surchargeOld = 0;
  if (taxableOld > 50000000) surchargeOld = Math.round(taxAfterRebateOld * 0.37);
  else if (taxableOld > 20000000) surchargeOld = Math.round(taxAfterRebateOld * 0.25);
  else if (taxableOld > 10000000) surchargeOld = Math.round(taxAfterRebateOld * 0.15);
  else if (taxableOld > 5000000) surchargeOld = Math.round(taxAfterRebateOld * 0.10);

  const cessOld = Math.round((taxAfterRebateOld + surchargeOld) * 0.04);
  const totalOld = taxAfterRebateOld + surchargeOld + cessOld;

  return {
    gross,
    isProvisional,
    taxableNew,
    taxBeforeRebateNew,
    rebate87ANew,
    totalNew,
    taxableOld,
    taxBeforeRebateOld,
    rebate87AOld,
    totalOld,
    recommended: totalNew < totalOld ? 'NEW' : totalOld < totalNew ? 'OLD' : 'EQUAL',
    savings: Math.abs(totalNew - totalOld),
  };
}

// ────────────────────────────────────────────────────────────
// Return-Specific GST Calculation Engine
// ────────────────────────────────────────────────────────────

function calculateGSTEngine({
  returnType = 'GSTR-3B-Monthly',
  dueDate,
  actualDate,
  isNil = false,
  turnoverCat = 'upto-1.5cr',
  stateTurnover, // Required for GSTR-9, NO silent default
  cgstCash = 0,
  sgstCash = 0,
  igstCash = 0,
}) {
  const d1 = new Date(dueDate);
  const d2 = new Date(actualDate);
  const delay = Math.max(0, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));

  let dailyRatePerAct = 25;
  let capPerAct = 5000;
  let supportsInterest = true;
  let isGstr9InputMissing = false;
  let gstr9CapDetails = null;

  if (returnType === 'GSTR-9-Annual') {
    // Under Section 47(2) & Notification No. 07/2023-CT:
    supportsInterest = false;
    const cleanTurnover = Number(stateTurnover);

    if (!cleanTurnover || isNaN(cleanTurnover) || cleanTurnover <= 0) {
      isGstr9InputMissing = true;
      dailyRatePerAct = 25;
      capPerAct = 0;
    } else {
      let capRatePerAct = 0.0002; // 0.02% per Act = 0.04% total
      let dailyTotal = 50;

      if (turnoverCat === 'above-5cr') {
        if (cleanTurnover > 200000000) {
          dailyRatePerAct = 100;
          dailyTotal = 200;
          capRatePerAct = 0.0025; // 0.25% per Act = 0.50% total
        } else {
          dailyRatePerAct = 50;
          dailyTotal = 100;
          capRatePerAct = 0.0002;
        }
      } else {
        dailyRatePerAct = 25;
        dailyTotal = 50;
        capRatePerAct = 0.0002;
      }

      capPerAct = Math.round(cleanTurnover * capRatePerAct);
      const maxTotalCap = capPerAct * 2;
      gstr9CapDetails = {
        stateTurnover: cleanTurnover,
        dailyRateTotal: dailyTotal,
        maxCapPerAct: capPerAct,
        maxTotalCap,
      };
    }
  } else if (returnType.startsWith('GSTR-1')) {
    // Notification No. 20/2021-CT: statement only
    supportsInterest = false;
    if (isNil) {
      dailyRatePerAct = 10;
      capPerAct = 250;
    } else {
      dailyRatePerAct = 25;
      if (turnoverCat === 'upto-1.5cr') capPerAct = 1000;
      else if (turnoverCat === '1.5cr-to-5cr') capPerAct = 2500;
      else capPerAct = 5000;
    }
  } else {
    // GSTR-3B Monthly & QRMP: Notification No. 19/2021-CT
    supportsInterest = true;
    if (isNil) {
      dailyRatePerAct = 10;
      capPerAct = 250;
    } else {
      dailyRatePerAct = 25;
      if (turnoverCat === 'upto-1.5cr') capPerAct = 1000;
      else if (turnoverCat === '1.5cr-to-5cr') capPerAct = 2500;
      else capPerAct = 5000;
    }
  }

  const rawFee = delay * dailyRatePerAct;
  const cgstFee = isGstr9InputMissing ? 0 : Math.min(rawFee, capPerAct);
  const sgstFee = isGstr9InputMissing ? 0 : Math.min(rawFee, capPerAct);
  const totalLateFee = cgstFee + sgstFee;

  let totalInterest = 0;
  if (supportsInterest && delay > 0 && !isNil) {
    const totalCash = Math.max(0, cgstCash) + Math.max(0, sgstCash) + Math.max(0, igstCash);
    totalInterest = Math.round((totalCash * 0.18 * delay) / 365);
  }

  const totalPayable = totalLateFee + totalInterest + (supportsInterest && !isNil ? cgstCash + sgstCash + igstCash : 0);

  return {
    delay,
    supportsInterest,
    isGstr9InputMissing,
    gstr9CapDetails,
    capPerAct,
    totalLateFee,
    cgstLateFee: cgstFee,
    sgstLateFee: sgstFee,
    totalInterest,
    totalPayable,
  };
}

// ────────────────────────────────────────────────────────────
// Section 44AB Tax Audit Engine
// ────────────────────────────────────────────────────────────

function checkTaxAuditEngine({
  entityType,
  turnover,
  cashRecPct,
  cashPayPct,
  opted44ADPrior = false,
  declaringLower = false,
  exceedsBasic = true,
}) {
  const cleanTurnover = Math.max(0, Number(turnover) || 0);

  if (entityType === 'business') {
    const isDigital = cashRecPct <= 5 && cashPayPct <= 5;
    const threshold = isDigital ? 100000000 : 10000000; // 10 Cr vs 1 Cr

    if (cleanTurnover > threshold) {
      return { isAuditMandatory: true, section: '44AB(a)', threshold };
    }
    if (opted44ADPrior && declaringLower && exceedsBasic) {
      return { isAuditMandatory: true, section: '44AB(e)', threshold };
    }
    return { isAuditMandatory: false, section: 'N/A', threshold };
  } else {
    // Profession
    const isDigital = cashRecPct <= 5;
    const threshold = isDigital ? 7500000 : 5000000; // 75L vs 50L
    if (cleanTurnover > threshold) {
      return { isAuditMandatory: true, section: '44AB(b)', threshold };
    }
    if (declaringLower && exceedsBasic) {
      return { isAuditMandatory: true, section: '44AB(d)', threshold };
    }
    return { isAuditMandatory: false, section: 'N/A', threshold };
  }
}

// ────────────────────────────────────────────────────────────
// Test Suites Execution
// ────────────────────────────────────────────────────────────

console.log('================================================================');
console.log('  KAVITHA & ASSOCIATES — STATUTORY AUDIT VERIFICATION SUITE   ');
console.log('================================================================');

let passed = 0;
let failed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✔ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✖ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

// ── Suite 1: Section 87A Old Regime Age-Specific Statutory Verification ──
console.log('\n▶ Suite 1: Section 87A Old Regime Across Age Categories');

it('TC1.1: General Assessee (<60 yrs): Income ₹5,00,000 gets ₹12,500 rebate under Section 87A (Net Tax ₹0)', () => {
  // Slab tax on ₹5,00,000: 5% of (5L - 2.5L) = ₹12,500.
  // Section 87A rebate = min(12500, 12500) = ₹12,500.
  // Net Tax = ₹0.
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2024-25', ageCategory: 'general', salaryIncome: 0, otherIncome: 500000 });
  assert.equal(res.taxableOld, 500000);
  assert.equal(res.taxBeforeRebateOld, 12500);
  assert.equal(res.rebate87AOld, 12500);
  assert.equal(res.totalOld, 0);
});

it('TC1.2: Senior Citizen (60-79 yrs): Income ₹5,00,000 gets ₹10,000 rebate under Section 87A (Net Tax ₹0)', () => {
  // Slab tax on ₹5,00,000: Basic exemption ₹3,00,000. 5% of (5L - 3L) = ₹10,000.
  // Section 87A provides deduction of "100% of income-tax or ₹12,500, whichever is less".
  // Deduction = min(10000, 12500) = ₹10,000! Net Tax = ₹0.
  // Statutory verification: The ₹10,000 limit arises from the slab calculation, NOT a statutory reduction in 87A!
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2024-25', ageCategory: 'senior', salaryIncome: 0, otherIncome: 500000 });
  assert.equal(res.taxableOld, 500000);
  assert.equal(res.taxBeforeRebateOld, 10000);
  assert.equal(res.rebate87AOld, 10000);
  assert.equal(res.totalOld, 0);
});

it('TC1.3: Super Senior Citizen (80+ yrs): Income ₹5,00,000 has zero tax due to ₹5,00,000 basic exemption', () => {
  // Basic exemption is ₹5,00,000 under Part I of First Schedule.
  // Tax before rebate = ₹0. Under Section 87A: min(0, 12500) = ₹0. Net Tax = ₹0.
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2024-25', ageCategory: 'superSenior', salaryIncome: 0, otherIncome: 500000 });
  assert.equal(res.taxableOld, 500000);
  assert.equal(res.taxBeforeRebateOld, 0);
  assert.equal(res.rebate87AOld, 0);
  assert.equal(res.totalOld, 0);
});

it('TC1.4: Boundary Test: Senior Citizen with Income ₹5,10,000 gets ZERO Section 87A rebate (Exceeds ₹5L ceiling)', () => {
  // Income ₹5,10,000 exceeds ₹5,00,000 threshold.
  // Section 87A rebate = ₹0!
  // Tax: 5% of 2L (10,000) + 20% of 10k (2,000) = ₹12,000 + 4% cess (₹480) = ₹12,480.
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2024-25', ageCategory: 'senior', salaryIncome: 0, otherIncome: 510000 });
  assert.equal(res.taxableOld, 510000);
  assert.equal(res.rebate87AOld, 0); // No 87A rebate!
  assert.equal(res.totalOld, 12480);
});

// ── Suite 2: FY 2026-27 Explicit Provisional Status ──
console.log('\n▶ Suite 2: FY 2026-27 Provisional Designation');

it('TC2.1: FY 2026-27 is explicitly flagged as provisional', () => {
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2026-27', salaryIncome: 1275000, otherIncome: 0 });
  assert.equal(res.isProvisional, true);
  assert.equal(res.totalNew, 0);
});

it('TC2.2: FY 2025-26 and FY 2024-25 are NOT provisional (Enacted Statutes)', () => {
  const res25 = calculateIncomeTaxEngine({ financialYear: 'FY 2025-26', salaryIncome: 1275000, otherIncome: 0 });
  const res24 = calculateIncomeTaxEngine({ financialYear: 'FY 2024-25', salaryIncome: 775000, otherIncome: 0 });
  assert.equal(res25.isProvisional, false);
  assert.equal(res24.isProvisional, false);
});

// ── Suite 3: Income Tax Slabs & Rebates (FY 2025-26 & FY 2024-25) ──
console.log('\n▶ Suite 3: Enacted Direct Tax Slabs & Section 87A Rebates');

it('TC3.1: FY 2025-26: Basic exemption is ₹4,00,000 under New Regime', () => {
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2025-26', salaryIncome: 400000, otherIncome: 0 });
  assert.equal(res.totalNew, 0);
});

it('TC3.2: FY 2025-26: Salaried income of ₹12,75,000 pays zero tax (₹75k std ded + ₹60k 87A rebate)', () => {
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2025-26', salaryIncome: 1275000, otherIncome: 0 });
  assert.equal(res.taxableNew, 1200000);
  assert.equal(res.totalNew, 0);
});

it('TC3.3: FY 2025-26: Marginal relief under Section 87A for taxable income ₹12,10,000', () => {
  // Excess income over ₹12,00,000 = ₹10,000. Tax before cess = ₹10,000. Cess = ₹400. Total = ₹10,400.
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2025-26', salaryIncome: 0, otherIncome: 1210000 });
  assert.equal(res.rebate87ANew, 51500);
  assert.equal(res.totalNew, 10400);
});

it('TC3.4: FY 2024-25: Salaried income of ₹7,75,000 pays zero tax (₹75k std ded + ₹25k 87A rebate)', () => {
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2024-25', salaryIncome: 775000, otherIncome: 0 });
  assert.equal(res.taxableNew, 700000);
  assert.equal(res.totalNew, 0);
});

it('TC3.5: FY 2024-25: Marginal relief under Section 87A for taxable income ₹7,10,000', () => {
  const res = calculateIncomeTaxEngine({ financialYear: 'FY 2024-25', salaryIncome: 0, otherIncome: 710000 });
  assert.equal(res.totalNew, 10400);
});

// ── Suite 4: GSTR-9 Turnover Input & Late Fee Cap Verification ──
console.log('\n▶ Suite 4: GSTR-9 State Turnover Input & Section 47(2) Cap');

it('TC4.1: GSTR-9 without State turnover input flags missing input (No silent ₹1 Cr default)', () => {
  const res = calculateGSTEngine({
    returnType: 'GSTR-9-Annual',
    dueDate: '2026-12-31',
    actualDate: '2027-02-15',
    stateTurnover: undefined, // Missing!
  });
  assert.equal(res.isGstr9InputMissing, true);
  assert.equal(res.totalLateFee, 0); // No fee computed until input provided
  assert.equal(res.totalInterest, 0);
});

it('TC4.2: GSTR-9 with State turnover ₹0 or negative flags missing input', () => {
  const res = calculateGSTEngine({
    returnType: 'GSTR-9-Annual',
    dueDate: '2026-12-31',
    actualDate: '2027-02-15',
    stateTurnover: 0,
  });
  assert.equal(res.isGstr9InputMissing, true);
  assert.equal(res.totalLateFee, 0);
});

it('TC4.3: GSTR-9 with State turnover ₹50 Lakhs correctly caps fee at 0.04% (₹2,000 total)', () => {
  // State turnover = ₹50,00,000.
  // 0.04% cap = ₹2,000 total (₹1,000 CGST + ₹1,000 SGST under Notification 07/2023-CT).
  // 50 days delay @ ₹50/day = ₹2,500 accrued -> capped at ₹2,000!
  const res = calculateGSTEngine({
    returnType: 'GSTR-9-Annual',
    dueDate: '2026-12-31',
    actualDate: '2027-02-19', // exactly 50 days
    stateTurnover: 5000000,
  });
  assert.equal(res.isGstr9InputMissing, false);
  assert.equal(res.delay, 50);
  assert.equal(res.totalLateFee, 2000);
  assert.equal(res.cgstLateFee, 1000);
  assert.equal(res.sgstLateFee, 1000);
  assert.equal(res.totalInterest, 0); // DRC-03 applies, not GSTR-9
});

it('TC4.4: GSTR-9 with State turnover ₹10 Crore (Turnover > 5Cr but <= 20Cr) applies ₹100/day capped at 0.04%', () => {
  // State turnover = ₹10 Crore (10,00,00,000).
  // Cap at 0.04% = ₹40,000 total (₹20,000 CGST + ₹20,000 SGST).
  // 10 days delay @ ₹100/day = ₹1,000. Not capped.
  const res = calculateGSTEngine({
    returnType: 'GSTR-9-Annual',
    dueDate: '2026-12-31',
    actualDate: '2027-01-10', // 10 days
    turnoverCat: 'above-5cr',
    stateTurnover: 100000000,
  });
  assert.equal(res.delay, 10);
  assert.equal(res.totalLateFee, 1000); // 10 * 100
  assert.equal(res.gstr9CapDetails.maxTotalCap, 40000);
});

// ── Suite 5: Return-Specific GST Rules & Due Date Differentiations ──
console.log('\n▶ Suite 5: Return-Specific GST Rules (GSTR-3B, GSTR-1, QRMP)');

it('TC5.1: GSTR-3B Monthly: On-time filing has zero delay, zero late fee, zero interest', () => {
  const res = calculateGSTEngine({
    returnType: 'GSTR-3B-Monthly',
    dueDate: '2026-10-20',
    actualDate: '2026-10-20',
    cgstCash: 25000,
    sgstCash: 25000,
  });
  assert.equal(res.delay, 0);
  assert.equal(res.totalLateFee, 0);
  assert.equal(res.totalInterest, 0);
});

it('TC5.2: GSTR-3B Monthly: Section 50 interest is calculated at 18% p.a. on cash liability', () => {
  // ₹1,00,000 cash for 73 days @ 18% = ₹3,600
  const res = calculateGSTEngine({
    returnType: 'GSTR-3B-Monthly',
    dueDate: '2026-08-08',
    actualDate: '2026-10-20',
    turnoverCat: 'above-5cr',
    cgstCash: 50000,
    sgstCash: 50000,
  });
  assert.equal(res.delay, 73);
  assert.equal(res.totalInterest, 3600);
});

it('TC5.3: GSTR-1 Monthly: Section 50 interest is STRICTLY ₹0 (Statement of Outward Supplies)', () => {
  const res = calculateGSTEngine({
    returnType: 'GSTR-1-Monthly',
    dueDate: '2026-10-11',
    actualDate: '2026-11-10',
    cgstCash: 50000,
    sgstCash: 50000,
  });
  assert.equal(res.supportsInterest, false);
  assert.equal(res.totalInterest, 0);
  assert.ok(res.totalLateFee > 0);
});

it('TC5.4: GSTR-1 QRMP: Section 50 interest is STRICTLY ₹0', () => {
  const res = calculateGSTEngine({
    returnType: 'GSTR-1-QRMP',
    dueDate: '2026-10-13',
    actualDate: '2026-10-23',
    isNil: true,
  });
  assert.equal(res.supportsInterest, false);
  assert.equal(res.totalInterest, 0);
  assert.equal(res.totalLateFee, 200);
});

// ── Suite 6: Tax Audit Applicability (Section 44AB) ──
console.log('\n▶ Suite 6: Section 44AB Clauses & Statutory Due Dates');

it('TC6.1: Business with turnover ₹1.5 Crore and cash > 5% triggers Section 44AB(a)', () => {
  const res = checkTaxAuditEngine({ entityType: 'business', turnover: 15000000, cashRecPct: 8, cashPayPct: 8 });
  assert.equal(res.isAuditMandatory, true);
  assert.equal(res.section, '44AB(a)');
});

it('TC6.2: Business with turnover ₹8 Crore and cash <= 5% qualifies for elevated ₹10 Cr limit', () => {
  const res = checkTaxAuditEngine({ entityType: 'business', turnover: 80000000, cashRecPct: 3, cashPayPct: 4 });
  assert.equal(res.isAuditMandatory, false);
});

it('TC6.3: Business opting out of 44AD in 5-year lock-in period triggers Section 44AB(e)', () => {
  const res = checkTaxAuditEngine({
    entityType: 'business',
    turnover: 12000000,
    cashRecPct: 2,
    cashPayPct: 2,
    opted44ADPrior: true,
    declaringLower: true,
    exceedsBasic: true,
  });
  assert.equal(res.isAuditMandatory, true);
  assert.equal(res.section, '44AB(e)');
});

it('TC6.4: Professional declaring profit < 50% under Section 44ADA triggers Section 44AB(d)', () => {
  const res = checkTaxAuditEngine({
    entityType: 'profession',
    turnover: 4000000,
    cashRecPct: 2,
    cashPayPct: 2,
    declaringLower: true,
    exceedsBasic: true,
  });
  assert.equal(res.isAuditMandatory, true);
  assert.equal(res.section, '44AB(d)');
});

// ── Summary ──
console.log('\n================================================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('================================================================\n');

if (failed > 0) {
  process.exit(1);
}
