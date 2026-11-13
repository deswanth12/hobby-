import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  Building,
  Briefcase,
  RotateCcw,
} from 'lucide-react';
import { useFirmData } from '../../context/FirmDataContext';
import {
  STATUTORY_APPROVAL_CONFIG,
} from './taxRules';
import {
  TaxAuditInputs,
  checkTaxAuditApplicability,
} from './calculationEngine';

export const TaxAuditChecker: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();

  // Form State
  const [entityType, setEntityType] = useState<'business' | 'profession'>('business');
  const [turnover, setTurnover] = useState<number>(15000000); // ₹1.5 Crore default
  const [cashReceiptsPercentage, setCashReceiptsPercentage] = useState<number>(3); // 3%
  const [cashPaymentsPercentage, setCashPaymentsPercentage] = useState<number>(4); // 4%

  // Presumptive Details
  const [optedPresumptiveInPastFiveYears, setOptedPresumptiveInPastFiveYears] = useState<boolean>(false);
  const [declaringLowerProfitThanPrescribed, setDeclaringLowerProfitThanPrescribed] = useState<boolean>(false);
  const [totalIncomeExceedsBasicExemption, setTotalIncomeExceedsBasicExemption] = useState<boolean>(true);

  // Calculation computation
  const inputs: TaxAuditInputs = useMemo(
    () => ({
      entityType,
      turnoverOrGrossReceipts: turnover,
      cashReceiptsPercentage,
      cashPaymentsPercentage,
      optedPresumptiveInPastFiveYears,
      declaringLowerProfitThanPrescribed,
      totalIncomeExceedsBasicExemption,
    }),
    [
      entityType,
      turnover,
      cashReceiptsPercentage,
      cashPaymentsPercentage,
      optedPresumptiveInPastFiveYears,
      declaringLowerProfitThanPrescribed,
      totalIncomeExceedsBasicExemption,
    ]
  );

  const result = useMemo(() => checkTaxAuditApplicability(inputs), [inputs]);

  // Reset Form
  const handleReset = () => {
    setEntityType('business');
    setTurnover(15000000);
    setCashReceiptsPercentage(3);
    setCashPaymentsPercentage(4);
    setOptedPresumptiveInPastFiveYears(false);
    setDeclaringLowerProfitThanPrescribed(false);
    setTotalIncomeExceedsBasicExemption(true);
  };

  // WhatsApp Pre-filled text
  const whatsappText = encodeURIComponent(
    `Hello CA Kavitha Vijay, I ran the Tax Audit Applicability Checker on your website.\n` +
      `• Classification: ${entityType.toUpperCase()}\n` +
      `• Turnover / Receipts: ₹${turnover.toLocaleString('en-IN')}\n` +
      `• Cash Receipts: ${cashReceiptsPercentage}% | Cash Payments: ${cashPaymentsPercentage}%\n` +
      `• Audit Applicability Result: ${result.isAuditMandatory ? 'MANDATORY' : 'NOT MANDATORY'}\n` +
      `• Section Triggered: ${result.applicableSection}\n` +
      `Could I schedule a review of our accounts for tax audit preparation?`
  );
  const whatsappHref = `https://wa.me/${FIRM_DATA.contact.whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-brand-forest text-brand-white p-6 sm:p-8 border-b border-brand-gold/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-xs font-semibold mb-2">
              <FileCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Statutory Compliance Engine • Section 44AB</span>
            </div>
            <h3 className="font-editorial-h3 text-2xl sm:text-3xl font-bold text-brand-ivory">
              Tax Audit Applicability Checker
            </h3>
            <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 mt-1">
              Determine mandatory audit liability under Section 44AB of the Income-tax Act, evaluating 5% digital transaction limits, Section 44AD/44ADA presumptive thresholds, and Form 3CA/3CD requirements.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-400/40 text-emerald-100 hover:bg-emerald-800/60 text-xs font-semibold transition-colors self-start sm:self-center cursor-pointer"
            title="Reset checker inputs to default"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        {/* Statutory Governance Status Banner */}
        <div className="mt-4 pt-4 border-t border-brand-forest/60 flex items-start gap-2.5 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-emerald-100/90 leading-relaxed text-[11px] sm:text-xs">
            <span className="font-bold text-amber-200">
              Statutory Status: {STATUTORY_APPROVAL_CONFIG.approvalStatus === 'APPROVED' ? 'CA Approved' : 'Draft Configuration (Pre-release)'}
            </span>
            {' — '}
            <span>
              Thresholds match Section 44AB and Finance Act amendments. Final classification sign-off by{' '}
              <strong className="text-brand-gold">{STATUTORY_APPROVAL_CONFIG.managingPartner} ({STATUTORY_APPROVAL_CONFIG.qualifications})</strong> is in progress.
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="font-editorial-h4 text-base font-bold text-brand-forest border-b border-brand-border pb-2 flex items-center justify-between">
              <span>Enterprise Diagnostic Inputs</span>
              <span className="text-[11px] text-brand-muted font-normal">Income-tax Act, 1961</span>
            </h4>

            {/* Classification Toggle */}
            <div>
              <label className="block text-xs font-bold text-brand-charcoal mb-2">
                Entity Activity Classification
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEntityType('business')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    entityType === 'business'
                      ? 'bg-brand-forest text-white border-brand-forest shadow-xs'
                      : 'bg-brand-surface text-brand-charcoal border-brand-border hover:bg-white'
                  }`}
                >
                  <Building className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Business (Sec 44AB(a))</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEntityType('profession')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                    entityType === 'profession'
                      ? 'bg-brand-forest text-white border-brand-forest shadow-xs'
                      : 'bg-brand-surface text-brand-charcoal border-brand-border hover:bg-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Profession (Sec 44AB(b))</span>
                </button>
              </div>
            </div>

            {/* Turnover / Gross Receipts */}
            <div>
              <label htmlFor="audit-turnover-input" className="block text-xs font-bold text-brand-charcoal mb-1">
                {entityType === 'business' ? 'Total Business Turnover / Sales (₹)' : 'Gross Professional Receipts (₹)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted">₹</span>
                <input
                  id="audit-turnover-input"
                  type="number"
                  min="0"
                  step="50000"
                  value={turnover}
                  onChange={(e) => setTurnover(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-lg border border-brand-border bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
                  placeholder="e.g. 15000000"
                />
              </div>
              <p className="text-[10px] text-brand-muted mt-1">
                Equivalent to ₹{(turnover / 10000000).toFixed(2)} Crore (₹{(turnover / 100000).toFixed(2)} Lakhs).
              </p>
            </div>

            {/* Cash Transactions Percentage Sliders */}
            <div className="p-4 rounded-xl bg-brand-surface/40 border border-brand-border space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="audit-cash-rec" className="text-xs font-bold text-brand-charcoal">
                    Cash Receipts (% of Total Receipts)
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${cashReceiptsPercentage <= 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {cashReceiptsPercentage}%
                  </span>
                </div>
                <input
                  id="audit-cash-rec"
                  type="range"
                  min="0"
                  max="100"
                  value={cashReceiptsPercentage}
                  onChange={(e) => setCashReceiptsPercentage(Number(e.target.value))}
                  className="w-full accent-brand-forest cursor-pointer"
                />
                <p className="text-[10px] text-brand-muted mt-0.5">
                  Must be ≤ 5% to qualify for the elevated ₹10 Crore threshold.
                </p>
              </div>

              {entityType === 'business' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="audit-cash-pay" className="text-xs font-bold text-brand-charcoal">
                      Cash Payments (% of Total Payments)
                    </label>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${cashPaymentsPercentage <= 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {cashPaymentsPercentage}%
                    </span>
                  </div>
                  <input
                    id="audit-cash-pay"
                    type="range"
                    min="0"
                    max="100"
                    value={cashPaymentsPercentage}
                    onChange={(e) => setCashPaymentsPercentage(Number(e.target.value))}
                    className="w-full accent-brand-forest cursor-pointer"
                  />
                  <p className="text-[10px] text-brand-muted mt-0.5">
                    Must be ≤ 5% for business entities to claim elevated ₹10 Cr limit.
                  </p>
                </div>
              )}
            </div>

            {/* Presumptive Edge Conditions */}
            <div className="p-4 rounded-xl bg-brand-surface/30 border border-brand-border space-y-3">
              <span className="text-xs font-bold text-brand-forest block">
                Presumptive Taxation Edge Cases ({entityType === 'business' ? 'Section 44AD' : 'Section 44ADA'})
              </span>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declaringLowerProfitThanPrescribed}
                  onChange={(e) => setDeclaringLowerProfitThanPrescribed(e.target.checked)}
                  className="mt-1 accent-brand-forest"
                />
                <span className="text-[11px] text-brand-charcoal leading-snug">
                  Declaring net profit <strong>lower</strong> than prescribed rate ({entityType === 'business' ? '8% / 6%' : '50%'})?
                </span>
              </label>

              {entityType === 'business' && (
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optedPresumptiveInPastFiveYears}
                    onChange={(e) => setOptedPresumptiveInPastFiveYears(e.target.checked)}
                    className="mt-1 accent-brand-forest"
                  />
                  <span className="text-[11px] text-brand-charcoal leading-snug">
                    Opted for Section 44AD in any of the preceding 5 assessment years?
                  </span>
                </label>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={totalIncomeExceedsBasicExemption}
                  onChange={(e) => setTotalIncomeExceedsBasicExemption(e.target.checked)}
                  className="mt-1 accent-brand-forest"
                />
                <span className="text-[11px] text-brand-charcoal leading-snug">
                  Total taxable income exceeds basic exemption limit (&gt; ₹2.5L / ₹3L)?
                </span>
              </label>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            <h4 className="font-editorial-h4 text-base font-bold text-brand-forest border-b border-brand-border pb-2 flex items-center justify-between">
              <span>Diagnostic Finding &amp; Statutory Analysis</span>
              <span className="text-[11px] text-brand-muted">Section 44AB Verdict</span>
            </h4>

            {/* Verdict Card */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-200 ${
                result.isAuditMandatory
                  ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                  : 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {result.isAuditMandatory ? (
                  <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-editorial-meta text-xs font-bold uppercase tracking-wider text-brand-muted">
                      Audit Applicability Verdict
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-xs ${
                      result.isAuditMandatory
                        ? 'bg-amber-700 text-white'
                        : 'bg-emerald-700 text-white'
                    }`}>
                      {result.isAuditMandatory ? 'Tax Audit Mandatory' : 'Tax Audit Not Required'}
                    </span>
                  </div>

                  <h3 className="font-editorial-h3 text-xl font-bold mt-2 text-brand-forest">
                    {result.isAuditMandatory
                      ? `Mandatory Audit under ${result.applicableSection}`
                      : 'Audit Exemption Granted under Statutory Thresholds'}
                  </h3>

                  <p className="font-editorial-body text-xs sm:text-sm text-brand-charcoal/90 mt-2 leading-relaxed">
                    Applicable Benchmark Threshold: <strong>{result.thresholdLabel}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Statutory Reasoning List */}
            <div className="p-5 rounded-xl bg-brand-surface/40 border border-brand-border space-y-3">
              <span className="font-editorial-meta text-xs font-bold uppercase tracking-wider text-brand-forest block">
                Statutory Reasoning &amp; Audit Triggers
              </span>
              <ul className="space-y-2.5">
                {result.reasoning.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-brand-charcoal/90 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Statutory Compliance Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-brand-border bg-white space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                  Mandatory Audit Report Form
                </span>
                <span className="text-xs font-semibold text-brand-forest block">
                  {result.applicableForm}
                </span>
                <span className="text-[10px] text-brand-muted block leading-tight">
                  Independent audit report accompanied by detailed particulars in Form 3CD.
                </span>
              </div>

              <div className="p-4 rounded-xl border border-brand-border bg-white space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                  Statutory Filing Due Date
                </span>
                <span className="text-xs font-semibold text-brand-forest block">
                  {result.filingDueDate}
                </span>
                <span className="text-[10px] text-brand-muted block leading-tight">
                  ITR filing deadline extends to 31st October of the Assessment Year.
                </span>
              </div>
            </div>

            {/* Penalty Warning Strip */}
            <div className="p-3.5 rounded-xl bg-brand-surface/60 border border-brand-border text-xs text-brand-muted flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong>Section 271B Penalty for Failure to Get Accounts Audited: </strong>
                Failure to complete tax audit and e-file report on the Income Tax portal attracts penalty of 0.5% of total turnover, subject to a maximum of ₹1,50,000.
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-surface/40 p-4 rounded-xl border border-brand-border">
              <div className="text-xs text-brand-muted leading-tight">
                <span className="font-bold text-brand-forest block">Preparing for Section 44AB Tax Audit?</span>
                Direct audit engagement led by Big-4 trained statutory auditor CA Kavitha Vijay.
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold tracking-wide transition-colors shrink-0 shadow-xs"
              >
                <span>WhatsApp CA Kavitha</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Mandatory Statutory Notice */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="font-semibold text-amber-950">Statutory Notice &amp; Legal Disclaimer: </strong>
            This checker evaluates primary criteria under Section 44AB. Complex situations involving multiple businesses, joint ventures, speculative trading (F&amp;O), and capital asset sales require comprehensive ledger scrutiny by a practicing Chartered Accountant.
          </div>
        </div>
      </div>
    </div>
  );
};
