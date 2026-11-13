/**
 * src/components/knowledge-bank/calculationEngine.ts
 *
 * Mathematical and Statutory Calculation Engines for Kavitha & Associates.
 * Pure TypeScript functions with zero UI dependencies, fully testable in node/vitest.
 */

import {
  FinancialYear,
  AgeCategory,
  INCOME_TAX_CONFIG,
  GSTReturnType,
  GSTTurnoverCategory,
  GST_RETURN_RULES,
  TaxAuditConfig,
  TAX_AUDIT_STATUTORY_CONFIG,
} from './taxRules';

// ────────────────────────────────────────────────────────────
// 1. Income Tax Engine
// ────────────────────────────────────────────────────────────

export interface IncomeTaxInputs {
  financialYear: FinancialYear;
  ageCategory: AgeCategory;
  salaryIncome: number;
  otherIncome: number;
  deductions80C: number;
  deductions80D: number;
  deductions80CCD1B: number;
  homeLoanInterest24b: number;
  hraExemption: number;
  otherDeductions: number;
}

export interface SlabComputationItem {
  slabDescription: string;
  taxableAmount: number;
  rate: number;
  tax: number;
}

export interface RegimeResult {
  grossTotalIncome: number;
  standardDeduction: number;
  chapterVIAClaims: number;
  totalDeductions: number;
  netTaxableIncome: number;
  slabTaxBreakdown: SlabComputationItem[];
  taxBeforeRebate: number;
  rebate87A: number;
  marginalRelief87AAmount: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTaxPayable: number;
  effectiveTaxRate: number;
  statuteCitation: string;
}

export interface IncomeTaxComparisonResult {
  grossIncome: number;
  financialYear: FinancialYear;
  isProvisional: boolean;
  provisionalNotice?: string;
  newRegime: RegimeResult;
  oldRegime: RegimeResult;
  recommendedRegime: 'NEW' | 'OLD' | 'EQUAL';
  taxDifference: number; // Absolute savings in Rupees
  savingsSummary: string;
}

/**
 * Computes progressive tax across defined statutory slabs
 */
function computeSlabTax(
  taxableIncome: number,
  slabs: { min: number; max: number | null; rate: number }[]
): { totalTax: number; breakdown: SlabComputationItem[] } {
  let totalTax = 0;
  const breakdown: SlabComputationItem[] = [];

  for (const slab of slabs) {
    if (taxableIncome <= slab.min) {
      continue;
    }

    const slabUpper = slab.max === null ? taxableIncome : Math.min(taxableIncome, slab.max);
    const amountInSlab = slabUpper - slab.min;

    if (amountInSlab > 0) {
      const slabTax = Math.round(amountInSlab * slab.rate);
      totalTax += slabTax;
      breakdown.push({
        slabDescription:
          slab.max === null
            ? `Above ₹${(slab.min / 100000).toFixed(1)} Lakhs`
            : `₹${(slab.min / 100000).toFixed(1)}L – ₹${(slab.max / 100000).toFixed(1)}L`,
        taxableAmount: amountInSlab,
        rate: slab.rate,
        tax: slabTax,
      });
    }
  }

  return { totalTax, breakdown };
}

/**
 * Computes surcharge based on slabs
 */
function computeSurcharge(
  taxableIncome: number,
  taxBeforeSurcharge: number,
  surchargeSlabs: { min: number; max: number | null; rate: number }[]
): number {
  if (taxBeforeSurcharge <= 0) return 0;

  for (let i = surchargeSlabs.length - 1; i >= 0; i--) {
    const s = surchargeSlabs[i];
    if (taxableIncome > s.min) {
      return Math.round(taxBeforeSurcharge * s.rate);
    }
  }
  return 0;
}

/**
 * Main Income Tax Calculation Function
 */
export function calculateIncomeTax(inputs: IncomeTaxInputs): IncomeTaxComparisonResult {
  const fy = inputs.financialYear || 'FY 2025-26';
  const age = inputs.ageCategory || 'general';
  const config = INCOME_TAX_CONFIG[fy];

  // Sanitized Inputs (Non-negative numbers)
  const salary = Math.max(0, Number(inputs.salaryIncome) || 0);
  const otherInc = Math.max(0, Number(inputs.otherIncome) || 0);
  const grossIncome = salary + otherInc;

  // Deductions for Old Regime
  const claim80C = Math.min(150000, Math.max(0, Number(inputs.deductions80C) || 0));
  const claim80D = Math.max(0, Number(inputs.deductions80D) || 0);
  const claim80CCD1B = Math.min(50000, Math.max(0, Number(inputs.deductions80CCD1B) || 0));
  const claim24b = Math.min(200000, Math.max(0, Number(inputs.homeLoanInterest24b) || 0));
  const claimHRA = Math.max(0, Number(inputs.hraExemption) || 0);
  const claimOther = Math.max(0, Number(inputs.otherDeductions) || 0);

  // ── 1. Calculate New Regime ──
  const newConfig = config.newRegime;
  const newStdDeduction = salary > 0 ? Math.min(salary, newConfig.standardDeductionSalary) : 0;
  const newNetTaxable = Math.max(0, grossIncome - newStdDeduction);

  const newSlabRes = computeSlabTax(newNetTaxable, newConfig.slabs);
  const newTaxBeforeRebate = newSlabRes.totalTax;
  let newRebate87A = 0;
  let marginalReliefAmount = 0;

  if (newNetTaxable <= newConfig.rebate87AMaxTaxableIncome) {
    // 100% tax rebate under Section 87A up to statutory cap
    newRebate87A = Math.min(newTaxBeforeRebate, newConfig.rebate87AMaxAmount);
  } else if (newConfig.marginalRelief87A && newNetTaxable > newConfig.rebate87AMaxTaxableIncome) {
    // Statutory Marginal Relief under Section 87A proviso:
    // Tax payable on income exceeding threshold cannot exceed (income - threshold)
    const excessIncome = newNetTaxable - newConfig.rebate87AMaxTaxableIncome;
    if (newTaxBeforeRebate > excessIncome) {
      marginalReliefAmount = newTaxBeforeRebate - excessIncome;
      newRebate87A = marginalReliefAmount;
    }
  }

  const newTaxAfterRebate = Math.max(0, newTaxBeforeRebate - newRebate87A);
  const newSurcharge = computeSurcharge(newNetTaxable, newTaxAfterRebate, newConfig.surchargeSlabs);
  const newCess = Math.round((newTaxAfterRebate + newSurcharge) * newConfig.cessRate);
  const newTotalTax = newTaxAfterRebate + newSurcharge + newCess;

  const newRegimeResult: RegimeResult = {
    grossTotalIncome: grossIncome,
    standardDeduction: newStdDeduction,
    chapterVIAClaims: 0, // Inadmissible under Section 115BAC
    totalDeductions: newStdDeduction,
    netTaxableIncome: newNetTaxable,
    slabTaxBreakdown: newSlabRes.breakdown,
    taxBeforeRebate: newTaxBeforeRebate,
    rebate87A: newRebate87A,
    marginalRelief87AAmount: marginalReliefAmount,
    taxAfterRebate: newTaxAfterRebate,
    surcharge: newSurcharge,
    cess: newCess,
    totalTaxPayable: newTotalTax,
    effectiveTaxRate: grossIncome > 0 ? Number(((newTotalTax / grossIncome) * 100).toFixed(2)) : 0,
    statuteCitation: newConfig.statuteCitation,
  };

  // ── 2. Calculate Old Regime ──
  const oldConfig = config.oldRegime[age];
  const oldStdDeduction = salary > 0 ? Math.min(salary, oldConfig.standardDeductionSalary) : 0;
  const oldChapterVIA = claim80C + claim80D + claim80CCD1B + claim24b + claimHRA + claimOther;
  const oldTotalDeductions = Math.min(grossIncome, oldStdDeduction + oldChapterVIA);
  const oldNetTaxable = Math.max(0, grossIncome - oldTotalDeductions);

  const oldSlabRes = computeSlabTax(oldNetTaxable, oldConfig.slabs);
  const oldTaxBeforeRebate = oldSlabRes.totalTax;
  let oldRebate87A = 0;

  if (oldNetTaxable <= oldConfig.rebate87AMaxTaxableIncome) {
    oldRebate87A = Math.min(oldTaxBeforeRebate, oldConfig.rebate87AMaxAmount);
  }

  const oldTaxAfterRebate = Math.max(0, oldTaxBeforeRebate - oldRebate87A);
  const oldSurcharge = computeSurcharge(oldNetTaxable, oldTaxAfterRebate, oldConfig.surchargeSlabs);
  const oldCess = Math.round((oldTaxAfterRebate + oldSurcharge) * oldConfig.cessRate);
  const oldTotalTax = oldTaxAfterRebate + oldSurcharge + oldCess;

  const oldRegimeResult: RegimeResult = {
    grossTotalIncome: grossIncome,
    standardDeduction: oldStdDeduction,
    chapterVIAClaims: oldChapterVIA,
    totalDeductions: oldTotalDeductions,
    netTaxableIncome: oldNetTaxable,
    slabTaxBreakdown: oldSlabRes.breakdown,
    taxBeforeRebate: oldTaxBeforeRebate,
    rebate87A: oldRebate87A,
    marginalRelief87AAmount: 0,
    taxAfterRebate: oldTaxAfterRebate,
    surcharge: oldSurcharge,
    cess: oldCess,
    totalTaxPayable: oldTotalTax,
    effectiveTaxRate: grossIncome > 0 ? Number(((oldTotalTax / grossIncome) * 100).toFixed(2)) : 0,
    statuteCitation: oldConfig.statuteCitation,
  };

  // ── 3. Regime Comparison & Recommendation ──
  let recommendedRegime: 'NEW' | 'OLD' | 'EQUAL' = 'EQUAL';
  let diff = 0;
  let summary = '';

  if (newTotalTax < oldTotalTax) {
    recommendedRegime = 'NEW';
    diff = oldTotalTax - newTotalTax;
    summary = `New Tax Regime saves ₹${diff.toLocaleString('en-IN')} compared to Old Regime.`;
  } else if (oldTotalTax < newTotalTax) {
    recommendedRegime = 'OLD';
    diff = newTotalTax - oldTotalTax;
    summary = `Old Tax Regime saves ₹${diff.toLocaleString('en-IN')} due to your Chapter VI-A deductions.`;
  } else {
    recommendedRegime = 'EQUAL';
    diff = 0;
    summary = 'Both tax regimes yield the exact same tax liability for your profile.';
  }

  const isProvisional = Boolean(config.newRegime.isProvisional);
  const provisionalNotice = isProvisional
    ? 'PROVISIONAL ESTIMATE NOTICE (FY 2026-27): These calculations are provisional and subject to enactment of the Finance Act, 2026. Figures reflect projected continuation of the Finance Act, 2025 framework and must not be relied upon for final statutory assessments.'
    : undefined;

  return {
    grossIncome,
    financialYear: fy,
    isProvisional,
    provisionalNotice,
    newRegime: newRegimeResult,
    oldRegime: oldRegimeResult,
    recommendedRegime,
    taxDifference: diff,
    savingsSummary: summary,
  };
}

// ────────────────────────────────────────────────────────────
// 2. GST Return-Specific Late Fee & Interest Engine
// ────────────────────────────────────────────────────────────

export interface GSTCalculatorInputs {
  returnType: GSTReturnType;
  dueDate: string; // YYYY-MM-DD
  actualFilingDate: string; // YYYY-MM-DD
  isNilReturn: boolean;
  turnoverCategory: GSTTurnoverCategory;
  stateTurnoverForGstr9?: number; // Needed for GSTR-9 turnover % cap
  cgstCashLiability: number;
  sgstCashLiability: number;
  igstCashLiability: number;
}

export interface GSTCalculationResult {
  returnType: GSTReturnType;
  returnName: string;
  delayInDays: number;
  isOverdue: boolean;
  supportsInterest: boolean;
  interestNotice?: string;
  isGstr9InputMissing?: boolean;
  validationMessage?: string;
  gstr9CapDetails?: {
    stateTurnover: number;
    dailyRateTotal: number;
    capPercentageTotal: number;
    maxCapPerAct: number;
    maxTotalCap: number;
    derivationFormula: string;
  };
  lateFee: {
    dailyRatePerAct: number;
    statutoryCapPerAct: number;
    cgstLateFee: number;
    sgstLateFee: number;
    totalLateFee: number;
    formulaApplied: string;
  };
  interest: {
    annualRatePercentage: number;
    cgstInterest: number;
    sgstInterest: number;
    igstInterest: number;
    totalInterest: number;
    basis: string;
  };
  totalPayableLiability: number;
  statutoryCitations: string[];
}

/**
 * Return-Specific GST Late Fee & Interest Engine
 */
export function calculateGSTLateFeeAndInterest(inputs: GSTCalculatorInputs): GSTCalculationResult {
  const returnRule = GST_RETURN_RULES[inputs.returnType];

  // Calculate day difference
  const due = new Date(inputs.dueDate);
  const actual = new Date(inputs.actualFilingDate);

  let delayInDays = 0;
  if (!isNaN(due.getTime()) && !isNaN(actual.getTime())) {
    const diffTime = actual.getTime() - due.getTime();
    delayInDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const isOverdue = delayInDays > 0;

  let dailyRatePerAct = 25;
  let statutoryCapPerAct = 5000;
  let formulaApplied = '';
  let isGstr9InputMissing = false;
  let validationMessage: string | undefined = undefined;
  let gstr9CapDetails: GSTCalculationResult['gstr9CapDetails'] = undefined;

  // ── Return-Specific Late Fee Logic ──
  if (inputs.returnType === 'GSTR-9-Annual') {
    // Under Section 47(2) & Notification No. 07/2023-CT (FY 2022-23 onwards):
    // Turnover in State/UT determines cap as percentage of turnover
    const rawTurnover = Number(inputs.stateTurnoverForGstr9);
    const hasValidTurnover = !isNaN(rawTurnover) && rawTurnover > 0;

    if (!hasValidTurnover) {
      isGstr9InputMissing = true;
      validationMessage =
        '⚠️ Input Required: Annual Aggregate Turnover in State/UT must be specified to compute the statutory late fee cap under Notification No. 07/2023-CT.';
      dailyRatePerAct = 25;
      statutoryCapPerAct = 0;
      formulaApplied = 'Turnover in State/UT required under Notification No. 07/2023-CT';
    } else {
      const stateTurnover = rawTurnover;
      // Notification No. 07/2023-CT:
      // AATO <= ₹5 Cr: ₹50/day (₹25 CGST + ₹25 SGST), cap 0.04% of state turnover (0.02% per Act)
      // AATO ₹5 Cr to ₹20 Cr: ₹100/day (₹50 CGST + ₹50 SGST), cap 0.04% of state turnover (0.02% per Act)
      // AATO > ₹20 Cr: ₹200/day (₹100 CGST + ₹100 SGST), cap 0.50% of state turnover (0.25% per Act)
      let capRatePerAct = 0.0002; // 0.02%
      let capRateTotal = 0.0004; // 0.04%
      let dailyTotal = 50;

      if (inputs.turnoverCategory === 'above-5cr') {
        if (stateTurnover > 200000000) {
          dailyRatePerAct = 100;
          dailyTotal = 200;
          capRatePerAct = 0.0025; // 0.25%
          capRateTotal = 0.0050; // 0.50%
        } else {
          dailyRatePerAct = 50;
          dailyTotal = 100;
          capRatePerAct = 0.0002;
          capRateTotal = 0.0004;
        }
      } else {
        dailyRatePerAct = 25;
        dailyTotal = 50;
        capRatePerAct = 0.0002;
        capRateTotal = 0.0004;
      }

      statutoryCapPerAct = Math.round(stateTurnover * capRatePerAct);
      const maxTotalCap = statutoryCapPerAct * 2;
      formulaApplied = `Notification No. 07/2023-CT: ₹${dailyTotal}/day capped at ${(capRateTotal * 100).toFixed(2)}% of State turnover (₹${maxTotalCap.toLocaleString('en-IN')})`;

      gstr9CapDetails = {
        stateTurnover,
        dailyRateTotal: dailyTotal,
        capPercentageTotal: Number((capRateTotal * 100).toFixed(2)),
        maxCapPerAct: statutoryCapPerAct,
        maxTotalCap,
        derivationFormula: `₹${stateTurnover.toLocaleString('en-IN')} × ${(capRateTotal * 100).toFixed(2)}% = ₹${maxTotalCap.toLocaleString('en-IN')} (₹${statutoryCapPerAct.toLocaleString('en-IN')} CGST + ₹${statutoryCapPerAct.toLocaleString('en-IN')} SGST)`,
      };
    }
  } else {
    // GSTR-3B & GSTR-1 under Notification 19/2021-CT & 20/2021-CT
    if (inputs.isNilReturn) {
      dailyRatePerAct = 10; // ₹10 CGST + ₹10 SGST = ₹20/day
      statutoryCapPerAct = 250; // ₹250 CGST + ₹250 SGST = ₹500 max cap
      formulaApplied = 'Notification No. 19/2021-CT / 20/2021-CT (Nil Return): ₹20/day capped at ₹500';
    } else {
      dailyRatePerAct = 25; // ₹25 CGST + ₹25 SGST = ₹50/day
      if (inputs.turnoverCategory === 'upto-1.5cr') {
        statutoryCapPerAct = 1000; // ₹1,000 CGST + ₹1,000 SGST = ₹2,000 max
        formulaApplied = 'Notification No. 19/2021-CT (Turnover <= ₹1.5 Cr): ₹50/day capped at ₹2,000';
      } else if (inputs.turnoverCategory === '1.5cr-to-5cr') {
        statutoryCapPerAct = 2500; // ₹2,500 CGST + ₹2,500 SGST = ₹5,000 max
        formulaApplied = 'Notification No. 19/2021-CT (Turnover ₹1.5 Cr - ₹5 Cr): ₹50/day capped at ₹5,000';
      } else {
        statutoryCapPerAct = 5000; // ₹5,000 CGST + ₹5,000 SGST = ₹10,000 standard cap
        formulaApplied = 'Notification No. 19/2021-CT (Turnover > ₹5 Cr): ₹50/day capped at ₹10,000';
      }
    }
  }

  const rawLateFeePerAct = isOverdue ? delayInDays * dailyRatePerAct : 0;
  const cgstLateFee = Math.min(rawLateFeePerAct, statutoryCapPerAct);
  const sgstLateFee = Math.min(rawLateFeePerAct, statutoryCapPerAct);
  const totalLateFee = cgstLateFee + sgstLateFee;

  // ── Section 50 Interest Logic ──
  const cgstCash = Math.max(0, Number(inputs.cgstCashLiability) || 0);
  const sgstCash = Math.max(0, Number(inputs.sgstCashLiability) || 0);
  const igstCash = Math.max(0, Number(inputs.igstCashLiability) || 0);

  let cgstInterest = 0;
  let sgstInterest = 0;
  let igstInterest = 0;

  // CRITICAL STATUTORY RULE:
  // Section 50 interest applies ONLY if the return discharges tax (GSTR-3B).
  // It is NOT applicable to GSTR-1 or GSTR-9.
  if (returnRule.supportsSection50Interest && isOverdue && !inputs.isNilReturn) {
    const dailyInterestRate = 0.18 / 365;
    cgstInterest = Math.round(cgstCash * dailyInterestRate * delayInDays);
    sgstInterest = Math.round(sgstCash * dailyInterestRate * delayInDays);
    igstInterest = Math.round(igstCash * dailyInterestRate * delayInDays);
  }

  const totalInterest = cgstInterest + sgstInterest + igstInterest;
  const totalPayableLiability = totalLateFee + totalInterest + (inputs.isNilReturn ? 0 : cgstCash + sgstCash + igstCash);

  const citations = [
    returnRule.statuteCitation,
    returnRule.supportsSection50Interest
      ? 'Section 50(1) CGST Act: 18% p.a. interest calculated strictly on net tax paid via Electronic Cash Ledger.'
      : (returnRule.interestExplanation || 'Section 50 interest is not applicable to this return type.'),
  ];

  return {
    returnType: inputs.returnType,
    returnName: returnRule.name,
    delayInDays,
    isOverdue,
    supportsInterest: returnRule.supportsSection50Interest,
    interestNotice: returnRule.interestExplanation,
    isGstr9InputMissing,
    validationMessage,
    gstr9CapDetails,
    lateFee: {
      dailyRatePerAct,
      statutoryCapPerAct,
      cgstLateFee,
      sgstLateFee,
      totalLateFee,
      formulaApplied,
    },
    interest: {
      annualRatePercentage: 18,
      cgstInterest,
      sgstInterest,
      igstInterest,
      totalInterest,
      basis: 'Net Cash Liability (Section 50(1) Proviso)',
    },
    totalPayableLiability,
    statutoryCitations: citations,
  };
}

// ────────────────────────────────────────────────────────────
// 3. Tax Audit Applicability Engine (Section 44AB)
// ────────────────────────────────────────────────────────────

export interface TaxAuditInputs {
  entityType: 'business' | 'profession';
  turnoverOrGrossReceipts: number;
  cashReceiptsPercentage: number;
  cashPaymentsPercentage: number;
  optedPresumptiveInPastFiveYears?: boolean;
  declaringLowerProfitThanPrescribed?: boolean;
  totalIncomeExceedsBasicExemption?: boolean;
}

export interface TaxAuditCheckResult {
  isAuditMandatory: boolean;
  applicableSection: string;
  applicableForm: string;
  thresholdApplied: number;
  thresholdLabel: string;
  isEligibleForElevatedThreshold: boolean;
  reasoning: string[];
  presumptiveNotes: string;
  filingDueDate: string;
  penaltySection: string;
  statuteCitation: string;
}

/**
 * Checks Tax Audit Applicability under Section 44AB
 */
export function checkTaxAuditApplicability(
  inputs: TaxAuditInputs,
  config: TaxAuditConfig = TAX_AUDIT_STATUTORY_CONFIG
): TaxAuditCheckResult {
  const turnover = Math.max(0, Number(inputs.turnoverOrGrossReceipts) || 0);
  const cashRecPct = Math.max(0, Number(inputs.cashReceiptsPercentage) || 0);
  const cashPayPct = Math.max(0, Number(inputs.cashPaymentsPercentage) || 0);

  const reasoning: string[] = [];
  let isAuditMandatory = false;
  let thresholdApplied = 0;
  let thresholdLabel = '';
  let applicableSection = 'Section 44AB';
  let isEligibleForElevatedThreshold = false;

  if (inputs.entityType === 'business') {
    // Check 5% digital transaction rule
    isEligibleForElevatedThreshold =
      cashRecPct <= config.business.maxCashReceiptsPercentage &&
      cashPayPct <= config.business.maxCashPaymentsPercentage;

    if (isEligibleForElevatedThreshold) {
      thresholdApplied = config.business.elevatedDigitalThreshold; // ₹10 Crore
      thresholdLabel = '₹10 Crore (Elevated digital threshold under proviso to Section 44AB(a))';
      reasoning.push(
        `Both cash receipts (${cashRecPct}%) and cash payments (${cashPayPct}%) are <= 5% of aggregate transactions. The elevated ₹10 Crore threshold applies under proviso to Section 44AB(a).`
      );
    } else {
      thresholdApplied = config.business.standardThreshold; // ₹1 Crore
      thresholdLabel = '₹1 Crore (Standard business threshold under Section 44AB(a))';
      reasoning.push(
        `Cash receipts (${cashRecPct}%) or cash payments (${cashPayPct}%) exceed the 5% digital limit. Standard ₹1 Crore threshold applies under Section 44AB(a).`
      );
    }

    if (turnover > thresholdApplied) {
      isAuditMandatory = true;
      applicableSection = 'Section 44AB(a)';
      reasoning.push(
        `Business turnover of ₹${(turnover / 10000000).toFixed(2)} Crore exceeds the applicable threshold of ${thresholdLabel}. Statutory Tax Audit is mandatory.`
      );
    } else {
      // Check Section 44AB(e) condition: Opted 44AD in earlier year + declared lower profit in current year
      if (
        inputs.optedPresumptiveInPastFiveYears &&
        inputs.declaringLowerProfitThanPrescribed &&
        inputs.totalIncomeExceedsBasicExemption
      ) {
        isAuditMandatory = true;
        applicableSection = 'Section 44AB(e) read with Section 44AD(4)';
        reasoning.push(
          'Opted for presumptive taxation under Section 44AD in any of the preceding 5 assessment years, but declaring profits below prescribed rate (8%/6%) in the current year with total income exceeding the basic exemption limit. Tax audit is mandatory under Section 44AB(e).'
        );
      } else {
        isAuditMandatory = false;
        reasoning.push(
          `Business turnover of ₹${(turnover / 100000).toFixed(2)} Lakhs is within the applicable limit of ${thresholdLabel}. Regular tax audit under Section 44AB(a) is not triggered.`
        );
      }
    }
  } else {
    // ── Professional ──
    isEligibleForElevatedThreshold = cashRecPct <= config.profession.maxCashReceiptsPercentage;

    if (isEligibleForElevatedThreshold) {
      thresholdApplied = config.profession.elevatedDigitalThreshold; // ₹75 Lakhs under Sec 44ADA
      thresholdLabel = '₹75 Lakhs (Elevated presumptive limit under Section 44ADA where cash receipts <= 5%)';
      reasoning.push(
        `Cash receipts (${cashRecPct}%) are within the 5% limit. The elevated ₹75 Lakhs presumptive ceiling applies under Section 44ADA(1).`
      );
    } else {
      thresholdApplied = config.profession.standardThreshold; // ₹50 Lakhs
      thresholdLabel = '₹50 Lakhs (Standard professional threshold under Section 44AB(b))';
      reasoning.push(
        `Cash receipts (${cashRecPct}%) exceed 5%. Standard ₹50 Lakhs threshold applies under Section 44AB(b).`
      );
    }

    if (turnover > thresholdApplied) {
      isAuditMandatory = true;
      applicableSection = 'Section 44AB(b)';
      reasoning.push(
        `Professional gross receipts of ₹${(turnover / 100000).toFixed(2)} Lakhs exceed the statutory limit of ${thresholdLabel}. Statutory Tax Audit is mandatory.`
      );
    } else {
      // Check 44AB(d) condition: Declaring lower profit under 44ADA (< 50%)
      if (
        inputs.declaringLowerProfitThanPrescribed &&
        inputs.totalIncomeExceedsBasicExemption
      ) {
        isAuditMandatory = true;
        applicableSection = 'Section 44AB(d) read with Section 44ADA(4)';
        reasoning.push(
          'Gross receipts are within threshold, but declaring net professional profit below 50% under Section 44ADA with taxable income exceeding the basic exemption limit. Tax audit is mandatory under Section 44AB(d).'
        );
      } else {
        isAuditMandatory = false;
        reasoning.push(
          `Professional gross receipts of ₹${(turnover / 100000).toFixed(2)} Lakhs are within the threshold of ${thresholdLabel}. Regular tax audit is not triggered.`
        );
      }
    }
  }

  const presumptiveNotes =
    inputs.entityType === 'business'
      ? 'Eligible businesses with turnover up to ₹2 Crore (₹3 Crore if cash receipts <= 5%) may opt for Section 44AD presumptive taxation (8% / 6% deemed profit) to avoid maintaining books of accounts and audit.'
      : 'Specified professionals with gross receipts up to ₹50 Lakhs (₹75 Lakhs if cash receipts <= 5%) may declare 50% deemed profit under Section 44ADA to avoid books and audit.';

  return {
    isAuditMandatory,
    applicableSection,
    applicableForm: config.statuteCitations.formNonCorporate,
    thresholdApplied,
    thresholdLabel,
    isEligibleForElevatedThreshold,
    reasoning,
    presumptiveNotes,
    filingDueDate: config.statuteCitations.dueDates.taxAuditReport,
    penaltySection: config.statuteCitations.penaltySection,
    statuteCitation: config.statuteCitations.auditSection,
  };
}
