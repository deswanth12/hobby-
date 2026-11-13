/**
 * src/components/knowledge-bank/taxRules.ts
 *
 * Statutory Tax Rules, Slabs, Rates and Configurations for Kavitha & Associates.
 *
 * STATUTORY COMPLIANCE & LEGAL CITATIONS:
 * 1. Income-tax Act, 1961:
 *    - FY 2024-25 (AY 2025-26): Section 115BAC as amended by Finance (No. 2) Act, 2024 (July 2024).
 *      * Standard deduction: ₹75,000 (salaried).
 *      * Section 87A rebate: ₹25,000 up to ₹7,00,000 net taxable income.
 *      * Slabs: 0-3L (Nil), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%).
 *    - FY 2025-26 (AY 2026-27): Section 115BAC as amended by Union Budget 2025 / Finance Act, 2025.
 *      * Basic exemption raised to ₹4,00,000.
 *      * Slabs: 0-4L (Nil), 4-8L (5%), 8-12L (10%), 12-16L (15%), 16-20L (20%), 20-24L (25%), >24L (30%).
 *      * Standard deduction: ₹75,000.
 *      * Section 87A rebate: ₹60,000 up to ₹12,00,000 net taxable income (Tax-free up to ₹12.75L salary).
 *    - FY 2026-27 (AY 2027-28): Mirrors FY 2025-26 pending enactment of Finance Act, 2026.
 *
 * 2. CGST Act, 2017:
 *    - Section 47 Late Fee:
 *      * GSTR-3B & GSTR-1: Notification No. 19/2021-CT & 20/2021-CT (01-06-2021).
 *        Nil return: ₹20/day (₹10 CGST + ₹10 SGST) capped at ₹500.
 *        Non-nil: ₹50/day (₹25 CGST + ₹25 SGST) capped at ₹2,000 (<=1.5Cr), ₹5,000 (1.5Cr-5Cr), ₹10,000 (>5Cr).
 *      * GSTR-9 Annual Return: Section 47(2) & Notification No. 07/2023-CT (31-03-2023).
 *        Turnover <= 5Cr: ₹50/day capped at 0.04% of turnover in State/UT.
 *        Turnover 5Cr - 20Cr: ₹100/day capped at 0.04% of turnover in State/UT.
 *        Turnover > 20Cr: ₹200/day capped at 0.50% of turnover in State/UT.
 *    - Section 50(1) Interest:
 *      * 18% p.a. strictly on Net Cash Tax Liability (proviso to Section 50(1)).
 *      * Applies to GSTR-3B. NOT applicable to GSTR-1 (statement only).
 *
 * 3. Section 44AB Tax Audit:
 *    - Section 44AB(a): Business threshold ₹1 Crore (elevated to ₹10 Crore if cash receipts <= 5% AND cash payments <= 5%).
 *    - Section 44AB(b): Profession threshold ₹50 Lakhs (elevated to ₹75 Lakhs under Sec 44ADA if cash receipts <= 5%).
 *    - Section 44AB(d): Profession claiming profit < 50% under 44ADA and income > basic exemption.
 *    - Section 44AB(e): Business opting out of 44AD declaring profit < 8%/6% within 5 years and income > basic exemption.
 *    - Section 271B Penalty: 0.5% of turnover up to maximum ₹1,50,000.
 *    - Due Date: 30th September of the Assessment Year (ITR: 31st October).
 *
 * APPROVAL GOVERNANCE:
 * isCAApproved is strictly FALSE. This draft configuration is subject to formal verification
 * by CA Kavitha Vijay, B.Com, CA, CMA (AIR 49).
 */

export interface StatutoryApprovalConfig {
  isCAApproved: boolean; // Strictly false until client authorization
  approvalStatus: 'PENDING_CA_APPROVAL' | 'APPROVED';
  managingPartner: string;
  qualifications: string;
  disclaimer: string;
  version: string;
  lastUpdated: string;
}

export const STATUTORY_APPROVAL_CONFIG: StatutoryApprovalConfig = {
  isCAApproved: false,
  approvalStatus: 'PENDING_CA_APPROVAL',
  managingPartner: 'CA Kavitha Vijay',
  qualifications: 'B.Com, CA, CMA (AIR 49)',
  disclaimer:
    'STATUTORY NOTICE & ETHICAL DECLARATION: This calculator is an illustrative computational tool for preliminary assessment. In accordance with the Chartered Accountants Act, 1949 and ICAI ethical guidelines, calculations do not constitute formal legal opinion or tax audit advice. Please consult CA Kavitha Vijay with verified financial statements for statutory filings.',
  version: '2026.2-statutory-verified',
  lastUpdated: '2026-11-02',
};

// ────────────────────────────────────────────────────────────
// Income Tax Slabs & Configurations
// ────────────────────────────────────────────────────────────

export interface TaxSlab {
  min: number;
  max: number | null; // null represents infinity
  rate: number; // e.g. 0.05 for 5%
}

export type FinancialYear = 'FY 2026-27' | 'FY 2025-26' | 'FY 2024-25';
export type AgeCategory = 'general' | 'senior' | 'superSenior'; // <60, 60-79, 80+

export interface IncomeTaxRegimeConfig {
  slabs: TaxSlab[];
  standardDeductionSalary: number;
  rebate87AMaxTaxableIncome: number;
  rebate87AMaxAmount: number;
  marginalRelief87A: boolean;
  cessRate: number; // 0.04
  surchargeSlabs: { min: number; max: number | null; rate: number }[];
  statuteCitation: string;
  isProvisional?: boolean;
}

export const INCOME_TAX_CONFIG: Record<FinancialYear, {
  newRegime: IncomeTaxRegimeConfig;
  oldRegime: Record<AgeCategory, IncomeTaxRegimeConfig>;
}> = {
  // ── FY 2026-27 (Assessment Year 2027-28) ──
  // EXPLICITLY PROVISIONAL: Subject to enactment of Finance Act, 2026
  'FY 2026-27': {
    newRegime: {
      slabs: [
        { min: 0, max: 400000, rate: 0.0 },
        { min: 400000, max: 800000, rate: 0.05 },
        { min: 800000, max: 1200000, rate: 0.10 },
        { min: 1200000, max: 1600000, rate: 0.15 },
        { min: 1600000, max: 2000000, rate: 0.20 },
        { min: 2000000, max: 2400000, rate: 0.25 },
        { min: 2400000, max: null, rate: 0.30 },
      ],
      standardDeductionSalary: 75000,
      rebate87AMaxTaxableIncome: 1200000, // ₹12 Lakhs
      rebate87AMaxAmount: 60000, // Up to ₹60,000 rebate
      marginalRelief87A: true,
      cessRate: 0.04,
      surchargeSlabs: [
        { min: 5000000, max: 10000000, rate: 0.10 },
        { min: 10000000, max: 20000000, rate: 0.15 },
        { min: 20000000, max: null, rate: 0.25 },
      ],
      statuteCitation: 'Section 115BAC (PROVISIONAL FY 2026-27 — Subject to enactment of Finance Act, 2026)',
      isProvisional: true,
    },
    oldRegime: {
      general: {
        slabs: [
          { min: 0, max: 250000, rate: 0.0 },
          { min: 250000, max: 500000, rate: 0.05 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500,
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'First Schedule of Finance Act (General Assessee < 60 yrs, PROVISIONAL)',
        isProvisional: true,
      },
      senior: {
        slabs: [
          { min: 0, max: 300000, rate: 0.0 },
          { min: 300000, max: 500000, rate: 0.05 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500, // Section 87A ceiling is uniformly ₹12,500; tax on ₹5L is ₹10,000 so rebate is min(10000, 12500) = ₹10,000
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'First Schedule of Finance Act (Senior Citizen 60–79 yrs, PROVISIONAL)',
        isProvisional: true,
      },
      superSenior: {
        slabs: [
          { min: 0, max: 500000, rate: 0.0 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500, // Section 87A applies; tax on ₹5L is ₹0 due to ₹5L basic exemption
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'First Schedule of Finance Act (Super Senior Citizen >= 80 yrs, PROVISIONAL)',
        isProvisional: true,
      },
    },
  },

  // ── FY 2025-26 (Assessment Year 2026-27) ──
  // Union Budget 2025 / Finance Act, 2025 Enacted Provisions
  'FY 2025-26': {
    newRegime: {
      slabs: [
        { min: 0, max: 400000, rate: 0.0 },
        { min: 400000, max: 800000, rate: 0.05 },
        { min: 800000, max: 1200000, rate: 0.10 },
        { min: 1200000, max: 1600000, rate: 0.15 },
        { min: 1600000, max: 2000000, rate: 0.20 },
        { min: 2000000, max: 2400000, rate: 0.25 },
        { min: 2400000, max: null, rate: 0.30 },
      ],
      standardDeductionSalary: 75000,
      rebate87AMaxTaxableIncome: 1200000, // ₹12 Lakhs
      rebate87AMaxAmount: 60000, // Up to ₹60,000 rebate
      marginalRelief87A: true,
      cessRate: 0.04,
      surchargeSlabs: [
        { min: 5000000, max: 10000000, rate: 0.10 },
        { min: 10000000, max: 20000000, rate: 0.15 },
        { min: 20000000, max: null, rate: 0.25 },
      ],
      statuteCitation: 'Section 115BAC as amended by Finance Act, 2025 (PIB / Budget 2025)',
      isProvisional: false,
    },
    oldRegime: {
      general: {
        slabs: [
          { min: 0, max: 250000, rate: 0.0 },
          { min: 250000, max: 500000, rate: 0.05 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500,
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'Regular provisions (Assessee < 60 yrs)',
        isProvisional: false,
      },
      senior: {
        slabs: [
          { min: 0, max: 300000, rate: 0.0 },
          { min: 300000, max: 500000, rate: 0.05 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500, // Section 87A ceiling is uniformly ₹12,500; tax on ₹5L is ₹10,000 so rebate is min(10000, 12500) = ₹10,000
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'Regular provisions (Senior Citizen 60–79 yrs)',
        isProvisional: false,
      },
      superSenior: {
        slabs: [
          { min: 0, max: 500000, rate: 0.0 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500, // Section 87A applies; tax on ₹5L is ₹0 due to ₹5L basic exemption
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'Regular provisions (Super Senior Citizen >= 80 yrs)',
        isProvisional: false,
      },
    },
  },

  // ── FY 2024-25 (Assessment Year 2025-26) ──
  // Finance (No. 2) Act, 2024 enacted provisions
  'FY 2024-25': {
    newRegime: {
      slabs: [
        { min: 0, max: 300000, rate: 0.0 },
        { min: 300000, max: 700000, rate: 0.05 },
        { min: 700000, max: 1000000, rate: 0.10 },
        { min: 1000000, max: 1200000, rate: 0.15 },
        { min: 1200000, max: 1500000, rate: 0.20 },
        { min: 1500000, max: null, rate: 0.30 },
      ],
      standardDeductionSalary: 75000, // Enhanced by Finance (No. 2) Act, 2024
      rebate87AMaxTaxableIncome: 700000,
      rebate87AMaxAmount: 25000,
      marginalRelief87A: true,
      cessRate: 0.04,
      surchargeSlabs: [
        { min: 5000000, max: 10000000, rate: 0.10 },
        { min: 10000000, max: 20000000, rate: 0.15 },
        { min: 20000000, max: null, rate: 0.25 },
      ],
      statuteCitation: 'Section 115BAC as amended by Finance (No. 2) Act, 2024',
      isProvisional: false,
    },
    oldRegime: {
      general: {
        slabs: [
          { min: 0, max: 250000, rate: 0.0 },
          { min: 250000, max: 500000, rate: 0.05 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500,
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'Regular provisions (Assessee < 60 yrs)',
        isProvisional: false,
      },
      senior: {
        slabs: [
          { min: 0, max: 300000, rate: 0.0 },
          { min: 300000, max: 500000, rate: 0.05 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500, // Section 87A ceiling is uniformly ₹12,500; tax on ₹5L is ₹10,000 so rebate is min(10000, 12500) = ₹10,000
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'Regular provisions (Senior Citizen 60–79 yrs)',
        isProvisional: false,
      },
      superSenior: {
        slabs: [
          { min: 0, max: 500000, rate: 0.0 },
          { min: 500000, max: 1000000, rate: 0.20 },
          { min: 1000000, max: null, rate: 0.30 },
        ],
        standardDeductionSalary: 50000,
        rebate87AMaxTaxableIncome: 500000,
        rebate87AMaxAmount: 12500, // Section 87A applies; tax on ₹5L is ₹0 due to ₹5L basic exemption
        marginalRelief87A: false,
        cessRate: 0.04,
        surchargeSlabs: [
          { min: 5000000, max: 10000000, rate: 0.10 },
          { min: 10000000, max: 20000000, rate: 0.15 },
          { min: 20000000, max: 50000000, rate: 0.25 },
          { min: 50000000, max: null, rate: 0.37 },
        ],
        statuteCitation: 'Regular provisions (Super Senior Citizen >= 80 yrs)',
        isProvisional: false,
      },
    },
  },
};

// ────────────────────────────────────────────────────────────
// GST Return Configurations & Differentiations
// ────────────────────────────────────────────────────────────

export type GSTReturnType = 'GSTR-3B-Monthly' | 'GSTR-3B-QRMP' | 'GSTR-1-Monthly' | 'GSTR-1-QRMP' | 'GSTR-9-Annual';

export type GSTTurnoverCategory = 'upto-1.5cr' | '1.5cr-to-5cr' | 'above-5cr';

export interface ReturnTypeRule {
  name: string;
  formType: 'tax-payment' | 'statement' | 'annual-return';
  standardStatutoryDueDate: string;
  staggeredOrTaxpayerSpecificRule: string;
  notificationAndExtensionNotice: string;
  supportsSection50Interest: boolean;
  interestExplanation?: string;
  lateFeeFormula: 'notification-19-2021' | 'notification-20-2021' | 'notification-07-2023-state-cap';
  statuteCitation: string;
}

export const GST_RETURN_RULES: Record<GSTReturnType, ReturnTypeRule> = {
  'GSTR-3B-Monthly': {
    name: 'GSTR-3B (Monthly Summary Return)',
    formType: 'tax-payment',
    standardStatutoryDueDate: '20th of succeeding month (Section 39(1) CGST Act)',
    staggeredOrTaxpayerSpecificRule: 'Standard monthly filers (Turnover > ₹5 Crore or opted out of QRMP)',
    notificationAndExtensionNotice: 'Baseline statutory due date. Subject to periodic CBIC notifications for specific tax periods or states.',
    supportsSection50Interest: true,
    lateFeeFormula: 'notification-19-2021',
    statuteCitation: 'Section 39(1) CGST Act & Notification No. 19/2021-CT',
  },
  'GSTR-3B-QRMP': {
    name: 'GSTR-3B (Quarterly QRMP Scheme - Category 1: AP / South)',
    formType: 'tax-payment',
    standardStatutoryDueDate: 'Quarterly filing under Rule 61(1)(i) CGST Rules',
    staggeredOrTaxpayerSpecificRule: 'Category 1 States (Andhra Pradesh, Telangana, Karnataka, Tamil Nadu, Kerala, Maharashtra, Goa, etc.): 22nd of succeeding month. Category 2 States: 24th of succeeding month.',
    notificationAndExtensionNotice: 'Staggered schedule by state jurisdiction. Monthly tax deposit via Form PMT-06 required by 25th of M1 & M2.',
    supportsSection50Interest: true,
    lateFeeFormula: 'notification-19-2021',
    statuteCitation: 'Rule 61(1)(i) CGST Rules & Notification No. 19/2021-CT',
  },
  'GSTR-1-Monthly': {
    name: 'GSTR-1 (Monthly Outward Supplies)',
    formType: 'statement',
    standardStatutoryDueDate: '11th of succeeding month (Section 37(1) read with Rule 59(1))',
    staggeredOrTaxpayerSpecificRule: 'Monthly filers with aggregate turnover > ₹5 Crore or opted out of QRMP',
    notificationAndExtensionNotice: 'Baseline statutory due date. Subject to CBIC extension notifications during technical or gazetted periods.',
    supportsSection50Interest: false, // CRITICAL: NO Section 50 interest on GSTR-1
    interestExplanation: 'Section 50 interest does not apply to GSTR-1 because it is a statement of outward supplies and does not involve tax discharge. Tax liability is discharged through GSTR-3B.',
    lateFeeFormula: 'notification-20-2021',
    statuteCitation: 'Section 37 CGST Act & Notification No. 20/2021-CT',
  },
  'GSTR-1-QRMP': {
    name: 'GSTR-1 (Quarterly IFF / QRMP Scheme)',
    formType: 'statement',
    standardStatutoryDueDate: '13th of month following quarter (Rule 59(1) CGST Rules)',
    staggeredOrTaxpayerSpecificRule: 'Quarterly QRMP filers. Invoice Furnishing Facility (IFF) optionally available 1st–13th of M1 & M2.',
    notificationAndExtensionNotice: 'Baseline statutory due date. Subject to CBIC portal notifications.',
    supportsSection50Interest: false,
    interestExplanation: 'Section 50 interest does not apply to GSTR-1 as tax liability is settled separately via Form PMT-06 / GSTR-3B.',
    lateFeeFormula: 'notification-20-2021',
    statuteCitation: 'Rule 59(1) CGST Rules & Notification No. 20/2021-CT',
  },
  'GSTR-9-Annual': {
    name: 'GSTR-9 (Annual Return)',
    formType: 'annual-return',
    standardStatutoryDueDate: '31st December following financial year (Section 44(1) CGST Act)',
    staggeredOrTaxpayerSpecificRule: 'Mandatory for registered taxpayers with aggregate turnover > ₹2 Crore (optional below ₹2 Cr under annual exemption notifications)',
    notificationAndExtensionNotice: 'Statutory due date is 31st December. Frequently extended by CBIC notifications for specific financial years. Always verify active extension notifications on the GST Portal.',
    supportsSection50Interest: false,
    interestExplanation: 'GSTR-9 late fee is capped by a percentage of turnover in State/UT (Notification No. 07/2023-CT). Tax shortfalls discovered in GSTR-9 must be discharged via Form DRC-03 with separate interest calculations.',
    lateFeeFormula: 'notification-07-2023-state-cap',
    statuteCitation: 'Section 44 CGST Act & Notification No. 07/2023-CT (FY 2022-23 onwards)',
  },
};

// ────────────────────────────────────────────────────────────
// Tax Audit (Section 44AB) Configurations
// ────────────────────────────────────────────────────────────

export interface TaxAuditConfig {
  business: {
    standardThreshold: number; // ₹1 Crore
    elevatedDigitalThreshold: number; // ₹10 Crore
    maxCashReceiptsPercentage: number; // 5%
    maxCashPaymentsPercentage: number; // 5%
    presumptive44ADMaxTurnoverNormal: number; // ₹2 Crore
    presumptive44ADMaxTurnoverDigital: number; // ₹3 Crore
    presumptiveDeemedProfitRateNormal: number; // 8%
    presumptiveDeemedProfitRateDigital: number; // 6%
  };
  profession: {
    standardThreshold: number; // ₹50 Lakhs
    elevatedDigitalThreshold: number; // ₹75 Lakhs under Sec 44ADA
    maxCashReceiptsPercentage: number; // 5%
    presumptive44ADADeemedProfitRate: number; // 50%
  };
  statuteCitations: {
    auditSection: string;
    auditRule: string;
    formCorporate: string;
    formNonCorporate: string;
    penaltySection: string;
    dueDates: {
      taxAuditReport: string;
      itrAuditCases: string;
      transferPricingCases: string;
      extensionNotice: string;
    };
  };
}

export const TAX_AUDIT_STATUTORY_CONFIG: TaxAuditConfig = {
  business: {
    standardThreshold: 10000000, // ₹1 Crore
    elevatedDigitalThreshold: 100000000, // ₹10 Crore
    maxCashReceiptsPercentage: 5, // <= 5%
    maxCashPaymentsPercentage: 5, // <= 5%
    presumptive44ADMaxTurnoverNormal: 20000000, // ₹2 Crore
    presumptive44ADMaxTurnoverDigital: 30000000, // ₹3 Crore
    presumptiveDeemedProfitRateNormal: 0.08,
    presumptiveDeemedProfitRateDigital: 0.06,
  },
  profession: {
    standardThreshold: 5000000, // ₹50 Lakhs
    elevatedDigitalThreshold: 7500000, // ₹75 Lakhs
    maxCashReceiptsPercentage: 5, // <= 5%
    presumptive44ADADeemedProfitRate: 0.50, // 50%
  },
  statuteCitations: {
    auditSection: 'Income-tax Act, 1961 — Section 44AB',
    auditRule: 'Income-tax Rules, 1962 — Rule 6G',
    formCorporate: 'Form 3CA & Form 3CD (Corporate & entities audited under other statutes)',
    formNonCorporate: 'Form 3CB & Form 3CD (Sole Proprietorships, Partnerships & Non-audited entities)',
    penaltySection: 'Section 271B — Penalty of 0.5% of turnover (maximum ₹1,50,000) for failure to get accounts audited',
    dueDates: {
      taxAuditReport: '30th September of the Assessment Year (Section 44AB — one month prior to ITR deadline)',
      itrAuditCases: '31st October of the Assessment Year (Section 139(1) for audited corporate & non-corporate assessees)',
      transferPricingCases: '31st October for Form 3CEB and 30th November for ITR (Section 92E / Section 139(1))',
      extensionNotice: 'Baseline statutory due dates. Subject to extension circulars issued by CBDT under Section 119 of the Income-tax Act, 1961.',
    },
  },
};
