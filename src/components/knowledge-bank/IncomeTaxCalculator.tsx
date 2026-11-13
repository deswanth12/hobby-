import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { useFirmData } from '../../context/FirmDataContext';
import {
  FinancialYear,
  AgeCategory,
  STATUTORY_APPROVAL_CONFIG,
} from './taxRules';
import {
  IncomeTaxInputs,
  calculateIncomeTax,
} from './calculationEngine';

export const IncomeTaxCalculator: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();

  // State
  const [financialYear, setFinancialYear] = useState<FinancialYear>('FY 2025-26');
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('general');
  const [salaryIncome, setSalaryIncome] = useState<number>(1200000);
  const [otherIncome, setOtherIncome] = useState<number>(50000);

  // Old Regime Deductions
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [deductions80CCD1B, setDeductions80CCD1B] = useState<number>(50000);
  const [homeLoanInterest24b, setHomeLoanInterest24b] = useState<number>(0);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // Advanced accordion state
  const [showAdvancedDeductions, setShowAdvancedDeductions] = useState(false);
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(true);

  // Calculation computation
  const inputs: IncomeTaxInputs = useMemo(
    () => ({
      financialYear,
      ageCategory,
      salaryIncome,
      otherIncome,
      deductions80C,
      deductions80D,
      deductions80CCD1B,
      homeLoanInterest24b,
      hraExemption,
      otherDeductions,
    }),
    [
      financialYear,
      ageCategory,
      salaryIncome,
      otherIncome,
      deductions80C,
      deductions80D,
      deductions80CCD1B,
      homeLoanInterest24b,
      hraExemption,
      otherDeductions,
    ]
  );

  const result = useMemo(() => calculateIncomeTax(inputs), [inputs]);

  // Reset form
  const handleReset = () => {
    setFinancialYear('FY 2025-26');
    setAgeCategory('general');
    setSalaryIncome(1200000);
    setOtherIncome(0);
    setDeductions80C(150000);
    setDeductions80D(25000);
    setDeductions80CCD1B(0);
    setHomeLoanInterest24b(0);
    setHraExemption(0);
    setOtherDeductions(0);
  };

  // WhatsApp Pre-filled message
  const whatsappText = encodeURIComponent(
    `Hello CA Kavitha Vijay, I used the Income Tax Calculator on your website for ${financialYear}.\n` +
      `• Gross Income: ₹${result.grossIncome.toLocaleString('en-IN')}\n` +
      `• New Regime Est. Tax: ₹${result.newRegime.totalTaxPayable.toLocaleString('en-IN')}\n` +
      `• Old Regime Est. Tax: ₹${result.oldRegime.totalTaxPayable.toLocaleString('en-IN')}\n` +
      `• Recommended: ${result.recommendedRegime} Regime\n` +
      `Could I schedule a consultation for my tax filing?`
  );
  const whatsappHref = `https://wa.me/${FIRM_DATA.contact.whatsappNumber}?text=${whatsappText}`;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-brand-forest text-brand-white p-6 sm:p-8 border-b border-brand-gold/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Direct Tax Engine • Section 115BAC</span>
            </div>
            <h3 className="font-editorial-h3 text-2xl sm:text-3xl font-bold text-brand-ivory">
              Income Tax Calculator (Old vs. New Regime)
            </h3>
            <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 mt-1">
              Side-by-side tax liability estimation incorporating Union Budget 2025 / Finance Act, 2025 revised slabs (tax-free up to ₹12L net taxable income), enhanced standard deduction, and Section 87A rebate.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-400/40 text-emerald-100 hover:bg-emerald-800/60 text-xs font-semibold transition-colors self-start sm:self-center cursor-pointer"
            title="Reset calculator inputs to default"
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
              Calculations incorporate Finance Act, 2025 &amp; Finance (No. 2) Act, 2024 provisions. Formal partner verification by{' '}
              <strong className="text-brand-gold">{STATUTORY_APPROVAL_CONFIG.managingPartner} ({STATUTORY_APPROVAL_CONFIG.qualifications})</strong> is in progress.
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        {/* Input Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="font-editorial-h4 text-base font-bold text-brand-forest border-b border-brand-border pb-2 flex items-center justify-between">
              <span>Income & Deductions</span>
              <span className="text-[11px] text-brand-muted font-normal">All values in INR (₹)</span>
            </h4>

            {/* Financial Year & Age Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="it-fy-select" className="block text-xs font-bold text-brand-charcoal mb-1.5">
                  Financial Year
                </label>
                <select
                  id="it-fy-select"
                  value={financialYear}
                  onChange={(e) => setFinancialYear(e.target.value as FinancialYear)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-brand-border bg-brand-surface/50 text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
                >
                  <option value="FY 2026-27">FY 2026-27 (Provisional — Subject to Finance Act 2026)</option>
                  <option value="FY 2025-26">FY 2025-26 (AY 2026-27 - Budget 2025 Slabs)</option>
                  <option value="FY 2024-25">FY 2024-25 (AY 2025-26 - Finance (No. 2) Act)</option>
                </select>
              </div>

              <div>
                <label htmlFor="it-age-select" className="block text-xs font-bold text-brand-charcoal mb-1.5">
                  Age Group (Old Regime)
                </label>
                <select
                  id="it-age-select"
                  value={ageCategory}
                  onChange={(e) => setAgeCategory(e.target.value as AgeCategory)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-brand-border bg-brand-surface/50 text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
                >
                  <option value="general">Below 60 Years (General Assessee)</option>
                  <option value="senior">60 to 79 Years (Senior Citizen)</option>
                  <option value="superSenior">80+ Years (Super Senior Citizen)</option>
                </select>
              </div>
            </div>

            {/* Provisional Warning Notice for FY 2026-27 */}
            {financialYear === 'FY 2026-27' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="leading-snug text-[11px]">
                  <strong className="font-bold text-amber-900">Provisional Status: </strong>
                  Calculations for FY 2026-27 are provisional and subject to enactment of the Finance Act, 2026. Figures project the continuation of the Budget 2025 framework and are not final statutory determinations.
                </div>
              </div>
            )}

            {/* Income Inputs */}
            <div>
              <label htmlFor="it-salary-input" className="block text-xs font-bold text-brand-charcoal mb-1">
                Annual Salary / Pension Income (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted">₹</span>
                <input
                  id="it-salary-input"
                  type="number"
                  min="0"
                  step="10000"
                  value={salaryIncome}
                  onChange={(e) => setSalaryIncome(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-lg border border-brand-border bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
                  placeholder="e.g. 1200000"
                />
              </div>
              <p className="text-[10px] text-brand-muted mt-1">
                Standard Deduction: ₹75,000 | {financialYear === 'FY 2024-25' ? 'Nil tax up to ₹7,00,000 (Sec 87A)' : 'Nil tax up to ₹12,00,000 net income (Sec 87A)'}.
              </p>
            </div>

            <div>
              <label htmlFor="it-other-input" className="block text-xs font-bold text-brand-charcoal mb-1">
                Other Income (Interest, Rental, Business) (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted">₹</span>
                <input
                  id="it-other-input"
                  type="number"
                  min="0"
                  step="5000"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-lg border border-brand-border bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            {/* Primary Old Regime Deductions */}
            <div className="p-4 rounded-xl bg-brand-surface/40 border border-brand-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-forest">Chapter VI-A Deductions (Old Regime Only)</span>
                <span className="text-[10px] text-brand-gold font-semibold uppercase">Sec 80C &amp; 80D</span>
              </div>

              <div>
                <label htmlFor="it-80c-input" className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                  Section 80C (PPF, EPF, ELSS, Life Insurance, Tuition) (Max ₹1.5L)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted">₹</span>
                  <input
                    id="it-80c-input"
                    type="number"
                    min="0"
                    max="150000"
                    step="5000"
                    value={deductions80C}
                    onChange={(e) => setDeductions80C(Math.min(150000, Math.max(0, Number(e.target.value) || 0)))}
                    className="w-full pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg border border-brand-border bg-white text-brand-forest focus:outline-none focus:ring-1 focus:ring-brand-forest"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="it-80d-input" className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                  Section 80D (Health Insurance Premium)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-muted">₹</span>
                  <input
                    id="it-80d-input"
                    type="number"
                    min="0"
                    step="5000"
                    value={deductions80D}
                    onChange={(e) => setDeductions80D(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg border border-brand-border bg-white text-brand-forest focus:outline-none focus:ring-1 focus:ring-brand-forest"
                  />
                </div>
              </div>

              {/* Advanced Deductions Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvancedDeductions(!showAdvancedDeductions)}
                  className="text-xs font-semibold text-brand-forest hover:text-brand-deep flex items-center gap-1 cursor-pointer"
                >
                  <span>{showAdvancedDeductions ? '− Hide' : '+ Show'} More Deductions (NPS, Home Loan, HRA)</span>
                </button>

                {showAdvancedDeductions && (
                  <div className="mt-3 space-y-3 pt-3 border-t border-brand-border/60 animate-fadeIn">
                    <div>
                      <label htmlFor="it-nps-input" className="block text-[11px] font-medium text-brand-charcoal mb-1">
                        Section 80CCD(1B) (NPS Extra Claim - Max ₹50,000)
                      </label>
                      <input
                        id="it-nps-input"
                        type="number"
                        min="0"
                        max="50000"
                        value={deductions80CCD1B}
                        onChange={(e) => setDeductions80CCD1B(Math.min(50000, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-border bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="it-home-loan-input" className="block text-[11px] font-medium text-brand-charcoal mb-1">
                        Section 24(b) (Home Loan Interest - Max ₹2,00,000)
                      </label>
                      <input
                        id="it-home-loan-input"
                        type="number"
                        min="0"
                        max="200000"
                        value={homeLoanInterest24b}
                        onChange={(e) => setHomeLoanInterest24b(Math.min(200000, Math.max(0, Number(e.target.value) || 0)))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-border bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="it-hra-input" className="block text-[11px] font-medium text-brand-charcoal mb-1">
                        HRA Exemption under Section 10(13A)
                      </label>
                      <input
                        id="it-hra-input"
                        type="number"
                        min="0"
                        value={hraExemption}
                        onChange={(e) => setHraExemption(Math.max(0, Number(e.target.value) || 0))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-border bg-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="it-other-ded-input" className="block text-[11px] font-medium text-brand-charcoal mb-1">
                        Other Deductions (80E Education Loan, 80G, 80TTA)
                      </label>
                      <input
                        id="it-other-ded-input"
                        type="number"
                        min="0"
                        value={otherDeductions}
                        onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value) || 0))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-border bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Output Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-border pb-2">
              <h4 className="font-editorial-h4 text-base font-bold text-brand-forest">
                Comparative Tax Liability Breakdown
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-brand-muted">Mode:</span>
                <button
                  type="button"
                  onClick={() => setIsPreviewEnabled(!isPreviewEnabled)}
                  className="text-[11px] font-semibold text-brand-gold hover:underline cursor-pointer"
                >
                  {isPreviewEnabled ? 'Full Breakdown' : 'Summary Only'}
                </button>
              </div>
            </div>

            {/* Verdict Card */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                result.recommendedRegime === 'NEW'
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                  : result.recommendedRegime === 'OLD'
                  ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                  : 'bg-brand-surface border-brand-border text-brand-forest'
              }`}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-editorial-meta text-xs font-bold uppercase tracking-wider">
                      Tax Advisory Recommendation
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-white border border-brand-border/60 shadow-xs">
                      {result.recommendedRegime === 'NEW'
                        ? 'New Regime Optimal'
                        : result.recommendedRegime === 'OLD'
                        ? 'Old Regime Optimal'
                        : 'Equal Tax Liability'}
                    </span>
                  </div>
                  <p className="font-editorial-body text-sm font-semibold mt-1">
                    {result.savingsSummary}
                  </p>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    Under {financialYear}, the New Regime provides lower baseline slab rates and enhanced standard deduction, whereas the Old Regime benefits individuals with substantial Section 80C, 80D, and housing deductions.
                  </p>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-brand-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-surface border-b border-brand-border">
                    <th className="p-3 font-bold text-brand-forest">Tax Component</th>
                    <th className={`p-3 font-bold ${result.recommendedRegime === 'NEW' ? 'text-emerald-800 bg-emerald-100/50' : 'text-brand-forest'}`}>
                      New Tax Regime {result.recommendedRegime === 'NEW' && '★'}
                    </th>
                    <th className={`p-3 font-bold ${result.recommendedRegime === 'OLD' ? 'text-amber-800 bg-amber-100/50' : 'text-brand-forest'}`}>
                      Old Tax Regime {result.recommendedRegime === 'OLD' && '★'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60 bg-white">
                  <tr>
                    <td className="p-3 font-medium text-brand-charcoal">Gross Total Income</td>
                    <td className="p-3 font-semibold text-brand-forest">₹{result.newRegime.grossTotalIncome.toLocaleString('en-IN')}</td>
                    <td className="p-3 font-semibold text-brand-forest">₹{result.oldRegime.grossTotalIncome.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-brand-charcoal">Standard Deduction</td>
                    <td className="p-3 text-brand-muted">−₹{result.newRegime.standardDeduction.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-brand-muted">−₹{result.oldRegime.standardDeduction.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-brand-charcoal">Chapter VI-A Deductions</td>
                    <td className="p-3 text-brand-muted">₹0 (Disallowed)</td>
                    <td className="p-3 text-brand-muted">−₹{result.oldRegime.chapterVIAClaims.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-brand-surface/30 font-semibold">
                    <td className="p-3 text-brand-forest">Net Taxable Income</td>
                    <td className="p-3 text-brand-forest">₹{result.newRegime.netTaxableIncome.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-brand-forest">₹{result.oldRegime.netTaxableIncome.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-brand-charcoal">Tax on Slab Rates</td>
                    <td className="p-3">₹{result.newRegime.taxBeforeRebate.toLocaleString('en-IN')}</td>
                    <td className="p-3">₹{result.oldRegime.taxBeforeRebate.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-brand-charcoal">Section 87A Rebate</td>
                    <td className="p-3 text-emerald-700">−₹{result.newRegime.rebate87A.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-emerald-700">−₹{result.oldRegime.rebate87A.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-brand-charcoal">Health &amp; Education Cess (4%)</td>
                    <td className="p-3 text-brand-muted">+₹{result.newRegime.cess.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-brand-muted">+₹{result.oldRegime.cess.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-brand-surface font-bold text-sm border-t-2 border-brand-border">
                    <td className="p-3 text-brand-forest">Estimated Tax Payable</td>
                    <td className={`p-3 text-base ${result.recommendedRegime === 'NEW' ? 'text-emerald-800 bg-emerald-100/60' : 'text-brand-forest'}`}>
                      ₹{result.newRegime.totalTaxPayable.toLocaleString('en-IN')}
                    </td>
                    <td className={`p-3 text-base ${result.recommendedRegime === 'OLD' ? 'text-amber-800 bg-amber-100/60' : 'text-brand-forest'}`}>
                      ₹{result.oldRegime.totalTaxPayable.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-brand-muted text-[11px]">Effective Tax Rate</td>
                    <td className="p-3 text-[11px] font-semibold text-brand-muted">{result.newRegime.effectiveTaxRate}%</td>
                    <td className="p-3 text-[11px] font-semibold text-brand-muted">{result.oldRegime.effectiveTaxRate}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-surface/40 p-4 rounded-xl border border-brand-border">
              <div className="text-xs text-brand-muted leading-tight">
                <span className="font-bold text-brand-forest block">Have complicated capital gains or business revenue?</span>
                Consult CA Kavitha Vijay directly to plan optimal deductions.
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

        {/* Mandatory Statutory Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="font-semibold text-amber-950">Statutory Notice &amp; Ethical Declaration: </strong>
            {STATUTORY_APPROVAL_CONFIG.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};
