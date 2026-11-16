import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

export interface VirtualCFOInputs {
  turnoverBand: string; // '<2cr' | '2-10cr' | '10-25cr' | '25-50cr' | '>50cr'
  debtorDays: number; // 25, 45, 75, 105
  inventoryDays: number; // 15, 30, 60, 100
  payableDays: number; // default 30
  misFrequency: string; // 'weekly' | 'monthly' | 'quarterly' | 'annual'
  bankLoanStatus: string; // 'none' | 'existing-cc' | 'expanding' | 'stressed'
}

export const VirtualCFOReadinessTool: React.FC = () => {
  const navigate = useNavigate();

  // Inputs State
  const [turnoverBand, setTurnoverBand] = useState<string>('2-10cr');
  const [debtorDays, setDebtorDays] = useState<number>(60);
  const [inventoryDays, setInventoryDays] = useState<number>(45);
  const [payableDays, setPayableDays] = useState<number>(30);
  const [misFrequency, setMisFrequency] = useState<string>('quarterly');
  const [bankLoanStatus, setBankLoanStatus] = useState<string>('expanding');
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  // Computations
  const assessment = useMemo(() => {
    // Cash Conversion Cycle (CCC) = DIO + DSO - DPO
    const ccc = debtorDays + inventoryDays - payableDays;

    // Base score computation (0-100)
    let score = 50;

    // DSO impact
    if (debtorDays <= 30) score += 15;
    else if (debtorDays <= 60) score += 5;
    else if (debtorDays <= 90) score -= 10;
    else score -= 20;

    // DIO impact
    if (inventoryDays <= 20) score += 10;
    else if (inventoryDays <= 45) score += 5;
    else if (inventoryDays <= 75) score -= 5;
    else score -= 15;

    // MIS impact
    if (misFrequency === 'weekly') score += 20;
    else if (misFrequency === 'monthly') score += 15;
    else if (misFrequency === 'quarterly') score -= 5;
    else score -= 20;

    // Bank status impact
    if (bankLoanStatus === 'none') score += 5;
    else if (bankLoanStatus === 'existing-cc') score += 10;
    else if (bankLoanStatus === 'expanding') score += 5;
    else score -= 10;

    // Normalization (clamp between 10 and 95)
    score = Math.max(15, Math.min(95, score));

    // Turnover numerical approximation in Lakhs for Working Capital gap modeling
    const turnoverLakhs =
      turnoverBand === '<2cr'
        ? 150
        : turnoverBand === '2-10cr'
        ? 600
        : turnoverBand === '10-25cr'
        ? 1800
        : turnoverBand === '25-50cr'
        ? 3500
        : 6500;

    // Estimated Working Capital Locked in Days Sales: (Turnover / 365) * CCC
    const estimatedLockedCapitalLakhs = Math.max(0, Math.round((turnoverLakhs / 365) * ccc));

    // CMA Readiness determination
    let cmaTier: 'High Readiness' | 'Moderate Readiness' | 'Critical Optimization Required';
    let cmaDescription: string;
    if (score >= 75) {
      cmaTier = 'High Readiness';
      cmaDescription = 'Financial reporting discipline is robust. Eligible for institutional CMA credit appraisal, working capital expansion, or private equity due diligence.';
    } else if (score >= 50) {
      cmaTier = 'Moderate Readiness';
      cmaDescription = 'Working capital is moderately stretched. Requires formal monthly MIS packs and debtor aging controls before approaching consortium lenders.';
    } else {
      cmaTier = 'Critical Optimization Required';
      cmaDescription = 'Severe cash conversion drag detected. High risk of bank audit queries or liquidity pinch. Immediate Virtual CFO controllership intervention recommended.';
    }

    return {
      score,
      ccc,
      estimatedLockedCapitalLakhs,
      cmaTier,
      cmaDescription,
    };
  }, [turnoverBand, debtorDays, inventoryDays, payableDays, misFrequency, bankLoanStatus]);

  const handleReset = () => {
    setTurnoverBand('2-10cr');
    setDebtorDays(60);
    setInventoryDays(45);
    setPayableDays(30);
    setMisFrequency('quarterly');
    setBankLoanStatus('expanding');
  };

  const handleCopy = async () => {
    const summary = `KAVITHA & ASSOCIATES — VIRTUAL CFO & WORKING CAPITAL DIAGNOSTIC
------------------------------------------------------------------
Annual Turnover Band: ${turnoverBand}
Cash Conversion Cycle (CCC): ${assessment.ccc} Days (DSO: ${debtorDays}d + DIO: ${inventoryDays}d - DPO: ${payableDays}d)
Estimated Working Capital Drag: ~₹${assessment.estimatedLockedCapitalLakhs} Lakhs
Financial Governance & CFO Readiness Score: ${assessment.score} / 100
Bank Loan & CMA Pack Status: ${assessment.cmaTier}
Evaluation: ${assessment.cmaDescription}

Executive Advisory Pedigree:
CA Kavitha Vijay, B.Com, CA, CMA AIR 49 (ICMAI)
Former Big 4 Assurance (Deloitte Haskins & Sells) & Corporate Finance (Ford Motor Co.)
Principal Chambers: Bairagi Patteda, Tirupati · +91 96263 50900`;

    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);

    const success = await copyToClipboard(summary);
    if (success) {
      setCopied(true);
      setCopyError(false);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2500);
    } else {
      setCopied(false);
      setCopyError(true);
      copyTimeoutRef.current = setTimeout(() => setCopyError(false), 3000);
    }
  };

  const handleConsult = () => {
    navigate('/contact', {
      state: {
        service: 'Virtual CFO Advisory',
        initialMessage: `Virtual CFO Readiness Assessment: Turnover band ${turnoverBand}, Cash Conversion Cycle ${assessment.ccc} days, CMA Status: ${assessment.cmaTier} (Score ${assessment.score}/100). Requesting partner consultation on working capital optimization.`,
      },
    });
  };

  const handleWhatsAppConsult = () => {
    const text = `Hello CA Kavitha Vijay, I completed the Virtual CFO Diagnostic on your website:\n• Overall Readiness Score: ${assessment.score}/100 (${assessment.cmaTier})\n• Turnover Band: ${turnoverBand}\n• Cash Conversion Cycle: ${assessment.ccc} Days\n• Estimated Working Capital Lockup: ₹${assessment.estimatedLockedCapitalLakhs} Lakhs\n• Bank CMA Readiness: ${assessment.cmaTier}\n\nI would like to discuss strategic financial controllership engagement with your chambers.`;
    window.open(`https://wa.me/919626350900?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-[#071B14] text-[#F1EBDD] rounded-3xl border border-[#B49A64]/40 p-4 sm:p-7 lg:p-10 shadow-2xl relative overflow-hidden texture-architectural-lines">
      {/* Corner Brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B49A64]/60 rounded-tl-sm pointer-events-none" aria-hidden="true" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B49A64]/60 rounded-tr-sm pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#B49A64]/60 rounded-bl-sm pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#B49A64]/60 rounded-br-sm pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#B49A64]/30">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-[#B49A64] bg-[#0B241C] px-3 py-1 rounded-full border border-[#B49A64]/30 uppercase tracking-widest">
              Strategic Financial Controllership
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#F1EBDD] bg-[#183529] px-2.5 py-0.5 rounded-full border border-[#B49A64]/30">
              <Award className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>CMA All India Rank 49 (ICMAI) Competence</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1EBDD]">
            Virtual CFO &amp; Working Capital Readiness Tool
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] max-w-3xl leading-relaxed">
            Diagnose your cash conversion cycle, working capital drag, monthly MIS maturity, and bank CMA credit readiness under the guidance of a nationally ranked Cost &amp; Management Accountant.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#D8D0BE] hover:text-[#B49A64] hover:border-[#B49A64] transition-colors min-h-[44px] shrink-0 self-start md:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Tool</span>
        </button>
      </div>

      {/* Main Grid: Inputs (7 cols) + Diagnostics (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Input 1: Turnover Band */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">1</span>
              <span>Annual Operating Revenue</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { band: '<2cr', label: '< ₹2 Cr', sub: 'Early Stage' },
                { band: '2-10cr', label: '₹2–10 Cr', sub: 'Emerging' },
                { band: '10-25cr', label: '₹10–25 Cr', sub: 'Mid-Tier' },
                { band: '25-50cr', label: '₹25–50 Cr', sub: 'Expansion' },
                { band: '>50cr', label: '> ₹50 Cr', sub: 'Enterprise' },
              ].map((b) => (
                <button
                  key={b.band}
                  type="button"
                  onClick={() => setTurnoverBand(b.band)}
                  className={`p-2.5 rounded-xl border text-center transition-all min-h-[44px] ${
                    turnoverBand === b.band
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] ring-1 ring-[#B49A64]'
                      : 'bg-[#0B241C] border-[#B49A64]/20 text-[#D8D0BE] hover:border-[#B49A64]/60'
                  }`}
                >
                  <span className="block font-serif font-bold text-xs">{b.label}</span>
                  <span className="block text-[10px] text-[#AAB4A0]">{b.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input 2 & 3: Working Capital Days (Debtors & Inventory) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#AAB4A0] flex items-center justify-between">
                <span>Debtor Days (DSO)</span>
                <span className="font-mono text-[#B49A64] font-bold">{debtorDays} Days</span>
              </label>
              <select
                value={debtorDays}
                onChange={(e) => setDebtorDays(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
              >
                <option value={20}>&lt; 30 Days (Fast Collections)</option>
                <option value={45}>30–60 Days (Normal Industry)</option>
                <option value={75}>60–90 Days (Stretched Credit)</option>
                <option value={110}>&gt; 90 Days (Severe Cash Lockup)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#AAB4A0] flex items-center justify-between">
                <span>Inventory Days (DIO)</span>
                <span className="font-mono text-[#B49A64] font-bold">{inventoryDays} Days</span>
              </label>
              <select
                value={inventoryDays}
                onChange={(e) => setInventoryDays(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
              >
                <option value={15}>&lt; 20 Days (Lean / JIT)</option>
                <option value={35}>20–45 Days (Standard Buffer)</option>
                <option value={60}>45–75 Days (High Carrying Cost)</option>
                <option value={95}>&gt; 75 Days (Slow Moving / Excess)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#AAB4A0] flex items-center justify-between">
                <span>Creditor Days (DPO)</span>
                <span className="font-mono text-[#B49A64] font-bold">{payableDays} Days</span>
              </label>
              <select
                value={payableDays}
                onChange={(e) => setPayableDays(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
              >
                <option value={15}>15 Days (MSME 43B(h) Compliant)</option>
                <option value={30}>30 Days (Standard Terms)</option>
                <option value={45}>45 Days (Maximum Written Limit)</option>
                <option value={60}>60 Days (Extended Supplier Credit)</option>
              </select>
            </div>
          </div>

          {/* Input 4 & 5: MIS Maturity & Bank Debt Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">2</span>
                <span>Current MIS Frequency</span>
              </label>
              <select
                value={misFrequency}
                onChange={(e) => setMisFrequency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#B49A64] min-h-[44px]"
              >
                <option value="weekly">Weekly Automated Flash Reports &amp; Cash Flow</option>
                <option value="monthly">Monthly Structured P&amp;L and Balance Sheet</option>
                <option value="quarterly">Quarterly Ad-Hoc Numbers for Board/Taxes</option>
                <option value="annual">Annual Statutory Books Only (Zero MIS)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">3</span>
                <span>Banking &amp; Credit Requirements</span>
              </label>
              <select
                value={bankLoanStatus}
                onChange={(e) => setBankLoanStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#B49A64] min-h-[44px]"
              >
                <option value="none">Self-Funded / No Active Bank Credit</option>
                <option value="existing-cc">Active Cash Credit (CC / OD) Facility</option>
                <option value="expanding">Seeking Loan Expansion / Consortium CMA</option>
                <option value="stressed">Stressed Working Capital / High Bank Interest</option>
              </select>
            </div>
          </div>

          {/* Dual Credential Plaque */}
          <div className="p-4 rounded-2xl bg-[#0B241C] border border-[#B49A64]/40 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
              <ShieldCheck className="w-5 h-5 text-[#B49A64]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold text-[#B49A64] tracking-wider block">
                Dual Qualification Advantage
              </span>
              <p className="text-xs text-[#F1EBDD] font-serif font-bold">
                Chartered Accountant (ICAI) &amp; Cost Accountant (ICMAI AIR 49)
              </p>
              <p className="text-[11px] text-[#AAB4A0] leading-relaxed">
                Supervised directly by CA Kavitha Vijay, former Deputy Manager at Deloitte Haskins &amp; Sells and corporate finance auditor at Ford Motor Company. Combines Big 4 statutory rigor with precision industrial management accounting.
              </p>
            </div>
          </div>
        </div>

        {/* Right Diagnostics Assessment Column */}
        <div className="lg:col-span-5 bg-[#0B241C] p-5 sm:p-6 rounded-2xl border border-[#B49A64]/40 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#B49A64]/20">
              <span className="font-mono text-xs font-bold text-[#B49A64] uppercase tracking-wider">
                Financial Health Score
              </span>
              <span className="font-mono text-lg font-black text-[#F1EBDD] bg-[#183529] px-3 py-1 rounded-full border border-[#B49A64]/40">
                {assessment.score} / 100
              </span>
            </div>

            {/* Cash Conversion Cycle Card */}
            <div className="p-4 rounded-xl bg-[#071B14] border border-[#B49A64]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#AAB4A0]">Cash Conversion Cycle (CCC)</span>
                <span className={`font-mono font-bold text-base ${assessment.ccc <= 45 ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {assessment.ccc} Days
                </span>
              </div>
              <p className="text-[11px] text-[#AAB4A0] leading-snug">
                Formula: Debtor Days ({debtorDays}d) + Inventory Days ({inventoryDays}d) - Creditor Days ({payableDays}d). Shorter cycles free up operating liquidity.
              </p>
            </div>

            {/* Estimated Locked Capital */}
            <div className="p-4 rounded-xl bg-[#071B14] border border-[#B49A64]/25 space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#B49A64] block">
                Estimated Working Capital Drag
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-serif font-black text-[#F1EBDD]">
                  ~₹{assessment.estimatedLockedCapitalLakhs} Lakhs
                </span>
                <span className="text-[11px] text-[#AAB4A0]">tied up in working capital</span>
              </div>
              <p className="text-[10px] text-[#AAB4A0] leading-tight">
                A 15-day reduction in debtor collections can release ~₹{Math.round((assessment.estimatedLockedCapitalLakhs * 15) / (assessment.ccc || 1))} Lakhs directly into treasury cash.
              </p>
            </div>

            {/* Bank CMA Credit Readiness Card */}
            <div className="p-4 rounded-xl bg-[#183529] border border-[#B49A64]/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#B49A64]">
                  Bank CMA Credit Readiness
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  {assessment.cmaTier}
                </span>
              </div>
              <p className="text-[11px] text-[#F1EBDD]/90 leading-relaxed">
                {assessment.cmaDescription}
              </p>
            </div>

            {/* Priority Recommendations */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-[#B49A64] uppercase block">
                Key Strategic Action Items:
              </span>
              <ul className="text-[11px] text-[#AAB4A0] space-y-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0 mt-0.5" />
                  <span>Restructure debtor credit terms to align with Section 43B(h) MSME compliance.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0 mt-0.5" />
                  <span>Prepare standard MPBF (Maximum Permissible Bank Finance) CMA packs for lenders.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0 mt-0.5" />
                  <span>Institute monthly variance analysis across budgeted vs actual unit economics.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 space-y-2.5">
            <button
              type="button"
              onClick={handleWhatsAppConsult}
              className="w-full py-3 px-4 rounded-xl bg-[#183529] hover:bg-[#071B14] text-[#F1EBDD] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border border-[#B49A64]/60 min-h-[44px] shadow-sm hover:shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Discuss Diagnostic on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleConsult}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-br from-[#C5A059] via-[#B49A64] to-[#9E844E] hover:from-[#D4AF37] hover:via-[#C5A059] hover:to-[#B49A64] text-[#071B14] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-gold-glow border border-[#C5A059]/60 min-h-[44px] group btn-shimmer"
            >
              <span>Consult Chambers with Assessment</span>
              <ArrowRight className="w-4 h-4 text-[#071B14] transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`w-full py-2.5 px-3 rounded-xl bg-[#183529] hover:bg-[#071B14] border font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px] ${
                copyError
                  ? 'border-amber-500/60 text-amber-300'
                  : 'border-[#B49A64]/40 text-[#B49A64]'
              }`}
              aria-label={
                copied
                  ? 'Diagnostic copied to clipboard'
                  : copyError
                  ? 'Unable to copy diagnostic automatically'
                  : 'Copy diagnostic assessment brief'
              }
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Diagnostic Copied to Clipboard</span>
                </>
              ) : copyError ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300">Copy Blocked · Select Brief Manually</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B49A64]" />
                  <span>Copy Diagnostic Assessment Brief</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCFOReadinessTool;
