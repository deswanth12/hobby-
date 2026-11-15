import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  Copy, 
  RotateCcw, 
  TrendingDown, 
  Sparkles, 
  Info, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
  calculateIncomeTax, 
  IncomeTaxInputs 
} from '../../../components/knowledge-bank/calculationEngine';
import { FinancialYear, AgeCategory } from '../../../components/knowledge-bank/taxRules';

export const TaxRegimeComparator: React.FC = () => {
  const navigate = useNavigate();

  // Inputs state
  const [financialYear, setFinancialYear] = useState<FinancialYear>('FY 2025-26');
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('general');
  const [salaryIncome, setSalaryIncome] = useState<number>(1275000);
  const [otherIncome, setOtherIncome] = useState<number>(0);

  // Chapter VI-A Deductions state
  const [showDeductionsDrawer, setShowDeductionsDrawer] = useState<boolean>(false);
  const [deductions80C, setDeductions80C] = useState<number>(150000);
  const [deductions80D, setDeductions80D] = useState<number>(25000);
  const [homeLoanInterest24b, setHomeLoanInterest24b] = useState<number>(0);
  const [deductions80CCD1B, setDeductions80CCD1B] = useState<number>(0);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  const [copied, setCopied] = useState<boolean>(false);

  // Quick preset incomes (INR)
  const PRESET_INCOMES = [
    { label: '₹7.5 Lakhs', value: 750000, tag: 'Entry Corporate' },
    { label: '₹10 Lakhs', value: 1000000, tag: 'Executive' },
    { label: '₹12.75 Lakhs', value: 1275000, tag: 'Tax-Free Under New' },
    { label: '₹15 Lakhs', value: 1500000, tag: 'Senior Mid-Tier' },
    { label: '₹25 Lakhs', value: 2500000, tag: 'Leadership' },
    { label: '₹50 Lakhs', value: 5000000, tag: 'Promoter' },
  ];

  // Live computation
  const comparisonResult = useMemo(() => {
    const inputs: IncomeTaxInputs = {
      financialYear,
      ageCategory,
      salaryIncome: Math.max(0, Number(salaryIncome) || 0),
      otherIncome: Math.max(0, Number(otherIncome) || 0),
      deductions80C: Math.min(150000, Math.max(0, Number(deductions80C) || 0)),
      deductions80D: Math.min(100000, Math.max(0, Number(deductions80D) || 0)),
      deductions80CCD1B: Math.min(50000, Math.max(0, Number(deductions80CCD1B) || 0)),
      homeLoanInterest24b: Math.min(200000, Math.max(0, Number(homeLoanInterest24b) || 0)),
      hraExemption: Math.max(0, Number(hraExemption) || 0),
      otherDeductions: Math.max(0, Number(otherDeductions) || 0),
    };
    return calculateIncomeTax(inputs);
  }, [
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
  ]);

  const handleReset = () => {
    setFinancialYear('FY 2025-26');
    setAgeCategory('general');
    setSalaryIncome(1275000);
    setOtherIncome(0);
    setDeductions80C(150000);
    setDeductions80D(25000);
    setHomeLoanInterest24b(0);
    setDeductions80CCD1B(0);
    setHraExemption(0);
    setOtherDeductions(0);
  };

  const handleCopySummary = async () => {
    const summaryText = `KAVITHA & ASSOCIATES — STATUTORY TAX REGIME COMPUTATION
---------------------------------------------------------------
Financial Year: ${comparisonResult.financialYear}
Gross Total Income: ₹${comparisonResult.grossIncome.toLocaleString('en-IN')}
Age Bracket: ${ageCategory === 'general' ? 'General (<60 Yrs)' : ageCategory === 'senior' ? 'Senior (60-79 Yrs)' : 'Super Senior (80+ Yrs)'}

1. NEW TAX REGIME (Section 115BAC):
   - Standard Deduction: ₹${comparisonResult.newRegime.standardDeduction.toLocaleString('en-IN')}
   - Net Taxable Income: ₹${comparisonResult.newRegime.netTaxableIncome.toLocaleString('en-IN')}
   - Section 87A Rebate: ₹${comparisonResult.newRegime.rebate87A.toLocaleString('en-IN')}
   - Surcharge & Cess (4%): ₹${(comparisonResult.newRegime.surcharge + comparisonResult.newRegime.cess).toLocaleString('en-IN')}
   - Total Net Tax: ₹${comparisonResult.newRegime.totalTaxPayable.toLocaleString('en-IN')}
   - Effective Tax Rate: ${comparisonResult.newRegime.effectiveTaxRate.toFixed(2)}%

2. OLD TAX REGIME:
   - Standard Deduction: ₹${comparisonResult.oldRegime.standardDeduction.toLocaleString('en-IN')}
   - Chapter VI-A Deductions Claimed: ₹${comparisonResult.oldRegime.chapterVIAClaims.toLocaleString('en-IN')}
   - Net Taxable Income: ₹${comparisonResult.oldRegime.netTaxableIncome.toLocaleString('en-IN')}
   - Section 87A Rebate: ₹${comparisonResult.oldRegime.rebate87A.toLocaleString('en-IN')}
   - Surcharge & Cess (4%): ₹${(comparisonResult.oldRegime.surcharge + comparisonResult.oldRegime.cess).toLocaleString('en-IN')}
   - Total Net Tax: ₹${comparisonResult.oldRegime.totalTaxPayable.toLocaleString('en-IN')}
   - Effective Tax Rate: ${comparisonResult.oldRegime.effectiveTaxRate.toFixed(2)}%

STATUTORY VERDICT:
${comparisonResult.recommendedRegime === 'NEW' 
  ? `Recommended: NEW TAX REGIME (Annual Savings: ₹${comparisonResult.taxDifference.toLocaleString('en-IN')})` 
  : comparisonResult.recommendedRegime === 'OLD' 
  ? `Recommended: OLD TAX REGIME (Annual Savings: ₹${comparisonResult.taxDifference.toLocaleString('en-IN')})` 
  : 'Both regimes result in identical tax liability.'}

Verified under Finance Act Statutory Provisions.
Chambers: Bairagi Patteda, Tirupati | CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI)
URL: https://kavithaassociates.com/services/income-tax-consultant-tirupati`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleInitiateConsultation = () => {
    navigate('/contact?service=direct-tax&ref=tax-comparator');
  };

  const isNewBetter = comparisonResult.recommendedRegime === 'NEW';
  const isOldBetter = comparisonResult.recommendedRegime === 'OLD';

  return (
    <div 
      id="tax-comparator"
      className="w-full bg-[#071B14] rounded-2xl sm:rounded-3xl border border-[#B49A64]/40 p-5 sm:p-7 md:p-9 shadow-2xl relative overflow-hidden"
    >
      {/* Background Architectural Watermark */}
      <div 
        className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#183529]/30 pointer-events-none blur-3xl z-0" 
        aria-hidden="true" 
      />

      {/* Header Plaque */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#B49A64]/25 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-mono text-[10px] sm:text-xs font-bold text-[#071B14] bg-[#B49A64] px-2.5 py-0.5 rounded uppercase tracking-wider">
              FINANCE ACT 2025 COMPLIANT
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#183529] border border-[#B49A64]/30 text-[10px] sm:text-xs text-[#B49A64]">
              <Sparkles className="w-3 h-3 text-[#B49A64]" />
              <span>30-Second Instant Comparison</span>
            </div>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#F1EBDD] tracking-tight">
            Old vs. New Tax Regime Comparator
          </h3>

          <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] mt-1.5 max-w-2xl leading-relaxed">
            Side-by-side mathematical evaluation comparing Section 115BAC against the Old Tax Regime with enacted ₹75,000 standard deduction and the ₹12.75 Lakhs salaried zero-tax rebate under Section 87A.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#183529] hover:bg-[#0B241C] text-[#B49A64] border border-[#B49A64]/30 text-xs font-semibold transition-all min-h-[44px]"
          title="Reset to statutory baseline defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6">
        
        {/* Left Column: Interactive Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Assessment Cycle / Financial Year Selector */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider mb-2">
              Select Assessment Cycle
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { fy: 'FY 2025-26' as FinancialYear, label: 'FY 2025-26', sub: 'AY 2026-27 (Current)' },
                { fy: 'FY 2024-25' as FinancialYear, label: 'FY 2024-25', sub: 'AY 2025-26 (Enacted)' },
                { fy: 'FY 2026-27' as FinancialYear, label: 'FY 2026-27', sub: 'AY 2027-28 (Provisional)' },
              ].map((item) => (
                <button
                  key={item.fy}
                  type="button"
                  onClick={() => setFinancialYear(item.fy)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 min-h-[44px] ${
                    financialYear === item.fy
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] shadow-md ring-1 ring-[#B49A64]/40'
                      : 'bg-[#0B241C] border-[#B49A64]/25 text-[#D8D0BE] hover:border-[#B49A64]/60'
                  }`}
                >
                  <span className="font-serif font-bold text-xs sm:text-sm block">{item.label}</span>
                  <span className="text-[10px] text-[#B49A64] font-mono mt-0.5 block">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Age Bracket Selector */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider mb-2">
              Assessee Age Category
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'general' as AgeCategory, label: 'Individual (<60 Yrs)' },
                { id: 'senior' as AgeCategory, label: 'Senior (60–79 Yrs)' },
                { id: 'superSenior' as AgeCategory, label: 'Super Senior (80+ Yrs)' },
              ].map((age) => (
                <button
                  key={age.id}
                  type="button"
                  onClick={() => setAgeCategory(age.id)}
                  className={`py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition-all duration-200 min-h-[44px] ${
                    ageCategory === age.id
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] ring-1 ring-[#B49A64]/40'
                      : 'bg-[#0B241C] border-[#B49A64]/25 text-[#D8D0BE] hover:border-[#B49A64]/60'
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>

          {/* Annual Gross Salary & Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="salary-input" className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider">
                Gross Annual Income (Salary &amp; Profits)
              </label>
              <span className="font-mono text-sm sm:text-base font-bold text-[#F1EBDD] bg-[#183529] px-2.5 py-0.5 rounded border border-[#B49A64]/30">
                ₹{Number(salaryIncome || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {PRESET_INCOMES.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setSalaryIncome(preset.value)}
                  className={`p-2 rounded-lg border text-left transition-all min-h-[44px] ${
                    salaryIncome === preset.value
                      ? 'bg-[#B49A64] text-[#071B14] font-bold border-[#B49A64]'
                      : 'bg-[#0B241C] border-[#B49A64]/20 text-[#D8D0BE] hover:border-[#B49A64]/60'
                  }`}
                >
                  <div className="font-mono text-xs">{preset.label}</div>
                  <div className={`text-[9px] truncate ${salaryIncome === preset.value ? 'text-[#071B14]/80 font-semibold' : 'text-[#AAB4A0]'}`}>
                    {preset.tag}
                  </div>
                </button>
              ))}
            </div>

            {/* Numeric Input & Slider */}
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#B49A64]">₹</span>
                <input
                  id="salary-input"
                  type="number"
                  min="0"
                  step="25000"
                  value={salaryIncome || ''}
                  onChange={(e) => setSalaryIncome(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#0B241C] border border-[#B49A64]/30 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-[#F1EBDD] focus:outline-none focus:border-[#B49A64] focus:ring-1 focus:ring-[#B49A64] min-h-[44px]"
                  placeholder="Enter exact annual salary or income in INR"
                />
              </div>

              <input
                type="range"
                min="300000"
                max="5000000"
                step="25000"
                value={Math.min(5000000, Math.max(300000, salaryIncome))}
                onChange={(e) => setSalaryIncome(parseInt(e.target.value))}
                className="w-full accent-[#B49A64] cursor-pointer"
                aria-label="Annual Salary Range Slider"
              />
            </div>
          </div>

          {/* Chapter VI-A Deductions Collapsible Drawer */}
          <div className="border border-[#B49A64]/30 rounded-xl bg-[#0B241C] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowDeductionsDrawer(!showDeductionsDrawer)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#183529]/40 transition-colors min-h-[44px]"
              aria-expanded={showDeductionsDrawer}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
                <span className="text-xs sm:text-sm font-serif font-bold text-[#F1EBDD]">
                  Chapter VI-A Deductions &amp; Exemptions (Old Regime Optimization)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#B49A64] hidden sm:inline">
                  {showDeductionsDrawer ? 'Hide Deductions' : 'Expand & Configure'}
                </span>
                {showDeductionsDrawer ? (
                  <ChevronUp className="w-4 h-4 text-[#B49A64]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#B49A64]" />
                )}
              </div>
            </button>

            {showDeductionsDrawer && (
              <div className="p-4 sm:p-5 border-t border-[#B49A64]/20 space-y-4 text-xs animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 80C */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label htmlFor="input-80c" className="font-mono text-[#D8D0BE]">
                        Section 80C (EPF, PPF, ELSS, LIC)
                      </label>
                      <span className="text-[#AAB4A0] text-[10px]">Max ₹1.5L</span>
                    </div>
                    <input
                      id="input-80c"
                      type="number"
                      max="150000"
                      step="5000"
                      value={deductions80C || ''}
                      onChange={(e) => setDeductions80C(Math.min(150000, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-[#071B14] border border-[#B49A64]/30 rounded-lg px-3 py-2 font-mono text-[#F1EBDD] min-h-[44px]"
                      placeholder="e.g. 150000"
                    />
                  </div>

                  {/* 80D */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label htmlFor="input-80d" className="font-mono text-[#D8D0BE]">
                        Section 80D (Health Insurance)
                      </label>
                      <span className="text-[#AAB4A0] text-[10px]">Max ₹1L</span>
                    </div>
                    <input
                      id="input-80d"
                      type="number"
                      max="100000"
                      step="5000"
                      value={deductions80D || ''}
                      onChange={(e) => setDeductions80D(Math.min(100000, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-[#071B14] border border-[#B49A64]/30 rounded-lg px-3 py-2 font-mono text-[#F1EBDD] min-h-[44px]"
                      placeholder="e.g. 25000"
                    />
                  </div>

                  {/* Section 24(b) Home Loan */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label htmlFor="input-24b" className="font-mono text-[#D8D0BE]">
                        Section 24(b) Home Loan Interest
                      </label>
                      <span className="text-[#AAB4A0] text-[10px]">Max ₹2L</span>
                    </div>
                    <input
                      id="input-24b"
                      type="number"
                      max="200000"
                      step="10000"
                      value={homeLoanInterest24b || ''}
                      onChange={(e) => setHomeLoanInterest24b(Math.min(200000, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-[#071B14] border border-[#B49A64]/30 rounded-lg px-3 py-2 font-mono text-[#F1EBDD] min-h-[44px]"
                      placeholder="e.g. 200000"
                    />
                  </div>

                  {/* 80CCD(1B) NPS */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label htmlFor="input-nps" className="font-mono text-[#D8D0BE]">
                        Section 80CCD(1B) (NPS Tier 1)
                      </label>
                      <span className="text-[#AAB4A0] text-[10px]">Max ₹50,000</span>
                    </div>
                    <input
                      id="input-nps"
                      type="number"
                      max="50000"
                      step="5000"
                      value={deductions80CCD1B || ''}
                      onChange={(e) => setDeductions80CCD1B(Math.min(50000, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-[#071B14] border border-[#B49A64]/30 rounded-lg px-3 py-2 font-mono text-[#F1EBDD] min-h-[44px]"
                      placeholder="e.g. 50000"
                    />
                  </div>

                  {/* HRA */}
                  <div>
                    <label htmlFor="input-hra" className="font-mono text-[#D8D0BE] block mb-1">
                      HRA Exemption (Sec 10(13A))
                    </label>
                    <input
                      id="input-hra"
                      type="number"
                      step="10000"
                      value={hraExemption || ''}
                      onChange={(e) => setHraExemption(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#071B14] border border-[#B49A64]/30 rounded-lg px-3 py-2 font-mono text-[#F1EBDD] min-h-[44px]"
                      placeholder="e.g. 120000"
                    />
                  </div>

                  {/* Other Income */}
                  <div>
                    <label htmlFor="input-other" className="font-mono text-[#D8D0BE] block mb-1">
                      Other Taxable Income (FD / Dividends)
                    </label>
                    <input
                      id="input-other"
                      type="number"
                      step="5000"
                      value={otherIncome || ''}
                      onChange={(e) => setOtherIncome(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#071B14] border border-[#B49A64]/30 rounded-lg px-3 py-2 font-mono text-[#F1EBDD] min-h-[44px]"
                      placeholder="e.g. 20000"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#AAB4A0] leading-relaxed pt-2 border-t border-[#B49A64]/15">
                  <Info className="w-3.5 h-3.5 text-[#B49A64] inline mr-1 shrink-0" />
                  Note: Under Section 115BAC (New Tax Regime), Chapter VI-A deductions (80C, 80D, 24b) are statutorily foregone in exchange for lower tax slabs and elevated ₹75,000 standard deduction.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Comparative Ledger Dossier (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#0B241C] p-5 sm:p-6 rounded-2xl border border-[#B49A64]/40 shadow-xl">
          
          {/* Top Recommendation Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            isNewBetter 
              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200' 
              : isOldBetter 
              ? 'bg-amber-950/70 border-amber-500/40 text-amber-200'
              : 'bg-[#183529] border-[#B49A64]/40 text-[#F1EBDD]'
          }`}>
            <TrendingDown className={`w-5 h-5 shrink-0 mt-0.5 ${
              isNewBetter ? 'text-emerald-400' : isOldBetter ? 'text-amber-400' : 'text-[#B49A64]'
            }`} />
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase block opacity-80">
                OFFICIAL STATUTORY RECOMMENDATION
              </span>
              <h4 className="font-serif text-base sm:text-lg font-bold text-white mt-0.5">
                {isNewBetter 
                  ? 'New Tax Regime (Section 115BAC)' 
                  : isOldBetter 
                  ? 'Old Tax Regime Recommended' 
                  : 'Both Regimes Equal'}
              </h4>
              <p className="text-xs mt-1 leading-snug opacity-90">
                {comparisonResult.savingsSummary}
              </p>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 pb-2 border-b border-[#B49A64]/20 text-[11px] font-mono font-bold text-[#AAB4A0] uppercase">
              <span>Metric</span>
              <span className="text-right text-[#B49A64]">New Regime</span>
              <span className="text-right text-[#D8D0BE]">Old Regime</span>
            </div>

            {/* Standard Deduction */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <span className="text-[#D8D0BE]">Std. Deduction</span>
              <span className="text-right font-mono font-semibold text-[#F1EBDD]">
                ₹{comparisonResult.newRegime.standardDeduction.toLocaleString('en-IN')}
              </span>
              <span className="text-right font-mono text-[#AAB4A0]">
                ₹{comparisonResult.oldRegime.standardDeduction.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Deductions Claimed */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <span className="text-[#D8D0BE]">Deductions (80C/D)</span>
              <span className="text-right font-mono text-[#AAB4A0]">
                ₹0 (Foregone)
              </span>
              <span className="text-right font-mono font-semibold text-[#F1EBDD]">
                ₹{comparisonResult.oldRegime.chapterVIAClaims.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Net Taxable Income */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-[#B49A64]/15">
              <span className="text-[#D8D0BE] font-medium">Net Taxable Income</span>
              <span className="text-right font-mono font-bold text-[#F1EBDD]">
                ₹{comparisonResult.newRegime.netTaxableIncome.toLocaleString('en-IN')}
              </span>
              <span className="text-right font-mono font-bold text-[#D8D0BE]">
                ₹{comparisonResult.oldRegime.netTaxableIncome.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Section 87A Rebate */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <span className="text-[#B49A64] text-[11px]">Section 87A Rebate</span>
              <span className="text-right font-mono text-emerald-400 font-bold">
                -₹{comparisonResult.newRegime.rebate87A.toLocaleString('en-IN')}
              </span>
              <span className="text-right font-mono text-emerald-400 font-bold">
                -₹{comparisonResult.oldRegime.rebate87A.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Surcharge & Cess */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <span className="text-[#AAB4A0] text-[11px]">Cess &amp; Surcharge</span>
              <span className="text-right font-mono text-[#AAB4A0]">
                ₹{(comparisonResult.newRegime.surcharge + comparisonResult.newRegime.cess).toLocaleString('en-IN')}
              </span>
              <span className="text-right font-mono text-[#AAB4A0]">
                ₹{(comparisonResult.oldRegime.surcharge + comparisonResult.oldRegime.cess).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Final Net Tax Payable Plaque */}
            <div className="grid grid-cols-3 gap-2 pt-3 pb-1 border-t-2 border-[#B49A64]/30 items-center">
              <span className="font-serif font-bold text-xs sm:text-sm text-[#F1EBDD]">
                Net Tax Payable
              </span>
              <div className="text-right">
                <span className={`font-mono text-base sm:text-lg font-bold block ${
                  isNewBetter ? 'text-emerald-400' : 'text-[#F1EBDD]'
                }`}>
                  ₹{comparisonResult.newRegime.totalTaxPayable.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-mono text-[#B49A64]">
                  {comparisonResult.newRegime.effectiveTaxRate.toFixed(1)}% rate
                </span>
              </div>
              <div className="text-right">
                <span className={`font-mono text-base sm:text-lg font-bold block ${
                  isOldBetter ? 'text-amber-400' : 'text-[#D8D0BE]'
                }`}>
                  ₹{comparisonResult.oldRegime.totalTaxPayable.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-mono text-[#AAB4A0]">
                  {comparisonResult.oldRegime.effectiveTaxRate.toFixed(1)}% rate
                </span>
              </div>
            </div>
          </div>

          {/* Statutory Highlight Callout */}
          <div className="p-3 rounded-lg bg-[#183529]/70 border border-[#B49A64]/30 text-[11px] text-[#D8D0BE] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#B49A64]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>₹12.75 Lakhs Salaried Zero-Tax Rule</span>
            </div>
            <p className="leading-relaxed">
              Under Finance Act 2025, salaried individuals with income up to ₹12.75 Lakhs pay ₹0 net tax under Section 115BAC (₹75k standard deduction + ₹60k Section 87A rebate).
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleInitiateConsultation}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-br from-[#C5A059] via-[#B49A64] to-[#9E844E] hover:from-[#D4AF37] hover:via-[#C5A059] hover:to-[#B49A64] text-[#071B14] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-gold-glow border border-[#C5A059]/60 min-h-[44px] group btn-shimmer"
            >
              <span>Schedule Partner Tax Planning</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="py-3 px-3.5 rounded-xl bg-[#183529] hover:bg-[#071B14] text-[#B49A64] border border-[#B49A64]/40 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              title="Copy Tax Computation Summary"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TaxRegimeComparator;
