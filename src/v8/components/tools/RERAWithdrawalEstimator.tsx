import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  Info,
  Scale,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

export const RERAWithdrawalEstimator: React.FC = () => {
  const navigate = useNavigate();

  // Inputs State (in INR)
  const [estimatedLandCost, setEstimatedLandCost] = useState<number>(30000000); // ₹3.00 Cr
  const [incurredLandCost, setIncurredLandCost] = useState<number>(30000000); // ₹3.00 Cr
  const [estimatedConstructionCost, setEstimatedConstructionCost] = useState<number>(70000000); // ₹7.00 Cr
  const [incurredConstructionCost, setIncurredConstructionCost] = useState<number>(28000000); // ₹2.80 Cr (40%)
  const [physicalCompletionPct, setPhysicalCompletionPct] = useState<number>(40); // 40%
  const [total70EscrowReceipts, setTotal70EscrowReceipts] = useState<number>(45000000); // ₹4.50 Cr
  const [priorWithdrawals, setPriorWithdrawals] = useState<number>(18000000); // ₹1.80 Cr

  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  // Statutory Calculations under AP RERA Section 4(2)(l)(D)
  const calculation = useMemo(() => {
    const totalEstimatedCost = estimatedLandCost + estimatedConstructionCost;
    const totalIncurredCost = incurredLandCost + incurredConstructionCost;

    // Percentage of completion based on total cost incurred
    const costCompletionPct =
      totalEstimatedCost > 0
        ? Math.min(100, (totalIncurredCost / totalEstimatedCost) * 100)
        : 0;

    // Verification check: Incurred construction cost vs physical work certified by Architect (Form 1) / Engineer (Form 2)
    const maxPermissibleConstructionExpenditure = (estimatedConstructionCost * physicalCompletionPct) / 100;
    const isConstructionCostDisproportionate = incurredConstructionCost > maxPermissibleConstructionExpenditure * 1.05;

    // Maximum cumulative permissible withdrawal from 70% separate escrow account
    const maxCumulativeWithdrawal = (total70EscrowReceipts * costCompletionPct) / 100;

    // Net permissible withdrawal in current tranche
    const netEligibleCurrentWithdrawal = Math.max(0, maxCumulativeWithdrawal - priorWithdrawals);

    // Remaining 70% funds locked in escrow
    const remainingInEscrow = Math.max(0, total70EscrowReceipts - priorWithdrawals - netEligibleCurrentWithdrawal);

    return {
      totalEstimatedCost,
      totalIncurredCost,
      costCompletionPct,
      isConstructionCostDisproportionate,
      maxCumulativeWithdrawal,
      netEligibleCurrentWithdrawal,
      remainingInEscrow,
    };
  }, [
    estimatedLandCost,
    incurredLandCost,
    estimatedConstructionCost,
    incurredConstructionCost,
    physicalCompletionPct,
    total70EscrowReceipts,
    priorWithdrawals,
  ]);

  const handleReset = () => {
    setEstimatedLandCost(30000000);
    setIncurredLandCost(30000000);
    setEstimatedConstructionCost(70000000);
    setIncurredConstructionCost(28000000);
    setPhysicalCompletionPct(40);
    setTotal70EscrowReceipts(45000000);
    setPriorWithdrawals(18000000);
  };

  const handleCopy = async () => {
    const summary = `KAVITHA & ASSOCIATES — AP RERA FORM 3 ESCROW WITHDRAWAL ASSESSMENT
----------------------------------------------------------------------
Statutory Authority: Section 4(2)(l)(D), Real Estate (Regulation and Development) Act, 2016
State Jurisdiction: Andhra Pradesh Real Estate Regulatory Authority (AP RERA)

1. PROJECT COST ARCHITECTURE:
• Total Estimated Project Cost: ₹${(calculation.totalEstimatedCost / 10000000).toFixed(2)} Crores (Land: ₹${(estimatedLandCost / 10000000).toFixed(2)} Cr + Construction: ₹${(estimatedConstructionCost / 10000000).toFixed(2)} Cr)
• Total Incurred Cost Till Date: ₹${(calculation.totalIncurredCost / 10000000).toFixed(2)} Crores (Land: ₹${(incurredLandCost / 10000000).toFixed(2)} Cr + Construction: ₹${(incurredConstructionCost / 10000000).toFixed(2)} Cr)
• Certified Physical Completion (Form 1 & 2): ${physicalCompletionPct}%
• Statutory Proportion of Cost Incurred: ${calculation.costCompletionPct.toFixed(2)}%

2. ESCROW WITHDRAWAL AUTHORIZATION (70% ACCOUNT):
• Total 70% Escrow Receipts Deposited: ₹${(total70EscrowReceipts / 10000000).toFixed(2)} Crores
• Maximum Cumulative Permissible Withdrawal: ₹${(calculation.maxCumulativeWithdrawal / 10000000).toFixed(2)} Crores
• Cumulative Prior Withdrawals: ₹${(priorWithdrawals / 10000000).toFixed(2)} Crores
• NET ELIGIBLE CURRENT TRANCHE WITHDRAWAL: ₹${calculation.netEligibleCurrentWithdrawal.toLocaleString('en-IN')}

Statutory Governance: CA Form 3 Certificate requires independent verification of passbook, vouchers, and mandatory UDIN.
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
        service: 'Real Estate RERA Advisory',
        initialMessage: `AP RERA Form 3 Escrow Withdrawal Certification inquiry: Estimated cost ₹${(calculation.totalEstimatedCost / 10000000).toFixed(2)} Cr, Completion ${calculation.costCompletionPct.toFixed(1)}%, Eligible current withdrawal: ₹${calculation.netEligibleCurrentWithdrawal.toLocaleString('en-IN')}. Requesting partner audit and Form 3 CA certification issuance.`,
      },
    });
  };

  const handleWhatsAppConsult = () => {
    const text = `Hello CA Kavitha Vijay, I ran an assessment on your AP RERA Escrow Calculator:\n• Total Estimated Project Cost: ₹${(calculation.totalEstimatedCost / 10000000).toFixed(2)} Cr\n• Incurred Cost Completion: ${calculation.costCompletionPct.toFixed(1)}%\n• Total 70% Escrow Receipts: ₹${(total70EscrowReceipts / 10000000).toFixed(2)} Cr\n• Net Eligible Current Withdrawal: ₹${calculation.netEligibleCurrentWithdrawal.toLocaleString('en-IN')}\n\nOur development firm requests partner inspection and Form 3 CA certificate issuance.`;
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
              Real Estate Regulatory Authority Engine
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#AAB4A0] bg-[#183529] px-2.5 py-0.5 rounded-full border border-[#B49A64]/20">
              <Scale className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Section 4(2)(l)(D) • Mandatory CA Form 3 Certificate</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1EBDD]">
            AP RERA 70% Escrow Withdrawal Estimator
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] max-w-3xl leading-relaxed">
            Statutory computation of permissible developer fund withdrawals from the designated 70% separate project account in accordance with cost-to-completion ratios under Andhra Pradesh RERA regulations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#D8D0BE] hover:text-[#B49A64] hover:border-[#B49A64] transition-colors min-h-[44px] shrink-0 self-start md:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Project</span>
        </button>
      </div>

      {/* Main Grid: Inputs (7 cols) + Withdrawal Assessment (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Land Cost Section */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">1</span>
              <span>Project Land Cost (Acquisition &amp; Clearances)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs text-[#AAB4A0]">Estimated Total Land Cost (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="500000"
                  value={estimatedLandCost}
                  onChange={(e) => setEstimatedLandCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-[#AAB4A0]">Incurred Land Expenditure (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="500000"
                  value={incurredLandCost}
                  onChange={(e) => setIncurredLandCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Construction Cost & Physical Completion */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">2</span>
              <span>Construction Cost &amp; Engineer Certification</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <span className="text-xs text-[#AAB4A0]">Estimated Construction (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1000000"
                  value={estimatedConstructionCost}
                  onChange={(e) => setEstimatedConstructionCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-[#AAB4A0]">Incurred Construction (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1000000"
                  value={incurredConstructionCost}
                  onChange={(e) => setIncurredConstructionCost(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-[#AAB4A0]">Architect Form 1 (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={physicalCompletionPct}
                  onChange={(e) => setPhysicalCompletionPct(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                />
              </div>
            </div>

            {calculation.isConstructionCostDisproportionate && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Warning: Incurred construction expenditure appears disproportionate to Architect/Engineer certified completion percentage ({physicalCompletionPct}%). Form 3 CA audit will require physical measurement books and contractor bill reconciliations.
                </p>
              </div>
            )}
          </div>

          {/* Step 3: Escrow Account Receipts & Historical Withdrawals */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">3</span>
              <span>70% Escrow Account Banking Data</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-xs text-[#AAB4A0]">Total 70% Escrow Receipts Deposited (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1000000"
                  value={total70EscrowReceipts}
                  onChange={(e) => setTotal70EscrowReceipts(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-[#AAB4A0]">Cumulative Prior Withdrawals Till Date (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1000000"
                  value={priorWithdrawals}
                  onChange={(e) => setPriorWithdrawals(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Statutory Note on Form 3 CA Certification */}
          <div className="p-3.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/25 flex items-start gap-2.5 text-xs text-[#D8D0BE]">
            <Info className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#B49A64]">Statutory Requirement for Form 3:</strong> Under Section 4(2)(l)(D) of the RERA Act, 2016, withdrawals can only be released upon submission of three concurrent certificates: Form 1 from the project Architect, Form 2 from the project Structural Engineer, and Form 3 from an independent practicing Chartered Accountant certifying expenditure and generating a mandatory UDIN.
            </p>
          </div>
        </div>

        {/* Right Output Assessment Column */}
        <div className="lg:col-span-5 bg-[#0B241C] p-5 sm:p-6 rounded-2xl border border-[#B49A64]/40 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#B49A64]/20">
              <span className="font-mono text-xs font-bold text-[#B49A64] uppercase tracking-wider">
                Eligible Escrow Withdrawal
              </span>
              <span className="font-mono text-sm font-bold text-emerald-300 bg-[#183529] px-2.5 py-0.5 rounded-full border border-[#B49A64]/30">
                {calculation.costCompletionPct.toFixed(1)}% Cost Incurred
              </span>
            </div>

            {/* Net Eligible Current Tranche Withdrawal Callout */}
            <div className="p-4 rounded-xl bg-[#183529] border border-[#B49A64]/40 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#B49A64] block">
                Net Permissible Current Withdrawal (Form 3)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-black text-[#F1EBDD]">
                  ₹{calculation.netEligibleCurrentWithdrawal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-[#AAB4A0]">
                Maximum amount certified for transfer from 70% escrow account to general developer operating account in this quarter.
              </p>
            </div>

            {/* Breakdown Cards */}
            <div className="p-4 rounded-xl bg-[#071B14] border border-[#B49A64]/25 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#AAB4A0]">Total Project Cost (Est.):</span>
                <span className="font-mono text-[#F1EBDD] font-bold">
                  ₹{(calculation.totalEstimatedCost / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#AAB4A0]">Total Incurred Cost Till Date:</span>
                <span className="font-mono text-[#F1EBDD] font-bold">
                  ₹{(calculation.totalIncurredCost / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#B49A64]/10">
                <span className="text-[#AAB4A0]">Max Cumulative Permissible:</span>
                <span className="font-mono text-[#D8D0BE]">
                  ₹{(calculation.maxCumulativeWithdrawal / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#AAB4A0]">Prior Withdrawals Withdrawn:</span>
                <span className="font-mono text-[#D8D0BE]">
                  ₹{(priorWithdrawals / 10000000).toFixed(2)} Cr
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-[#B49A64] pt-1 border-t border-[#B49A64]/10">
                <span>Remaining 70% Escrow Funds:</span>
                <span className="font-mono font-bold">
                  ₹{(calculation.remainingInEscrow / 10000000).toFixed(2)} Cr
                </span>
              </div>
            </div>

            {/* Form 3 CA Audit Checklist */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-[#B49A64] uppercase block">
                Form 3 CA Certification Checklist:
              </span>
              <ul className="text-[11px] text-[#AAB4A0] space-y-1">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0 mt-0.5" />
                  <span>Verified 70% escrow bank statement and allottee deposit logs.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0 mt-0.5" />
                  <span>Cross-examined Architect Form 1 &amp; Engineer Form 2 certificates.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0 mt-0.5" />
                  <span>Mandatory Unique Document Identification Number (UDIN) generated.</span>
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
              <span>Discuss Form 3 on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleConsult}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-br from-[#C5A059] via-[#B49A64] to-[#9E844E] hover:from-[#D4AF37] hover:via-[#C5A059] hover:to-[#B49A64] text-[#071B14] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-gold-glow border border-[#C5A059]/60 min-h-[44px] group btn-shimmer"
            >
              <span>Consult Chambers for Form 3 Certification</span>
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
                  ? 'Assessment copied to clipboard'
                  : copyError
                  ? 'Unable to copy assessment automatically'
                  : 'Copy Form 3 escrow assessment'
              }
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Assessment Copied to Clipboard</span>
                </>
              ) : copyError ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300">Copy Blocked · Select Assessment Manually</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B49A64]" />
                  <span>Copy Form 3 Escrow Assessment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RERAWithdrawalEstimator;
