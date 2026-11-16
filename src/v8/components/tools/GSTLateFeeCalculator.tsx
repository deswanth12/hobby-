import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  ShieldCheck,
  Info,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';
import {
  calculateGSTLateFeeAndInterest,
  GSTCalculatorInputs,
} from '../../../components/knowledge-bank/calculationEngine';
import {
  GSTReturnType,
  GSTTurnoverCategory,
} from '../../../components/knowledge-bank/taxRules';
import { copyToClipboard } from '../../utils/clipboard';

export const GSTLateFeeCalculator: React.FC = () => {
  const navigate = useNavigate();

  // Helper to format today's date YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Form State
  const [returnType, setReturnType] = useState<GSTReturnType>('GSTR-3B-Monthly');
  const [dueDate, setDueDate] = useState<string>('2026-10-20');
  const [actualFilingDate, setActualFilingDate] = useState<string>(todayStr);
  const [isNilReturn, setIsNilReturn] = useState<boolean>(false);
  const [turnoverCategory, setTurnoverCategory] = useState<GSTTurnoverCategory>('upto-1.5cr');

  // Net Cash Tax Liabilities (discharged through Electronic Cash Ledger)
  const [cgstCash, setCgstCash] = useState<number>(25000);
  const [sgstCash, setSgstCash] = useState<number>(25000);
  const [igstCash, setIgstCash] = useState<number>(0);
  const [stateTurnoverForGstr9, setStateTurnoverForGstr9] = useState<number | ''>('');

  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  // Live calculation computation
  const inputs: GSTCalculatorInputs = useMemo(
    () => ({
      returnType,
      dueDate,
      actualFilingDate,
      isNilReturn,
      turnoverCategory,
      stateTurnoverForGstr9: stateTurnoverForGstr9 === '' ? undefined : Number(stateTurnoverForGstr9),
      cgstCashLiability: isNilReturn ? 0 : cgstCash,
      sgstCashLiability: isNilReturn ? 0 : sgstCash,
      igstCashLiability: isNilReturn ? 0 : igstCash,
    }),
    [returnType, dueDate, actualFilingDate, isNilReturn, turnoverCategory, stateTurnoverForGstr9, cgstCash, sgstCash, igstCash]
  );

  const result = useMemo(() => calculateGSTLateFeeAndInterest(inputs), [inputs]);

  // Reset Form
  const handleReset = () => {
    setReturnType('GSTR-3B-Monthly');
    setDueDate('2026-10-20');
    setActualFilingDate(todayStr);
    setIsNilReturn(false);
    setTurnoverCategory('upto-1.5cr');
    setStateTurnoverForGstr9('');
    setCgstCash(25000);
    setSgstCash(25000);
    setIgstCash(0);
  };

  const handleCopySummary = async () => {
    const summary = `KAVITHA & ASSOCIATES — STATUTORY GST LATE FEE & INTEREST COMPUTATION
----------------------------------------------------------------------
Return Type: ${result.returnName} (${result.returnType})
Statutory Due Date: ${dueDate}
Actual / Projected Filing Date: ${actualFilingDate}
Delay in Filing: ${result.delayInDays} Days (${result.isOverdue ? 'Overdue' : 'On-Time'})

1. SECTION 47 LATE FEE:
• Daily Rate: ₹${result.lateFee.dailyRatePerAct * 2}/day (₹${result.lateFee.dailyRatePerAct} CGST + ₹${result.lateFee.dailyRatePerAct} SGST)
• Statutory Cap: ₹${result.lateFee.statutoryCapPerAct * 2} (₹${result.lateFee.statutoryCapPerAct} per Act)
• Total Late Fee Payable: ₹${result.lateFee.totalLateFee.toLocaleString('en-IN')}

2. SECTION 50 INTEREST (18% P.A. ON NET CASH TAX):
• Net Cash Tax Liability: ₹${(cgstCash + sgstCash + igstCash).toLocaleString('en-IN')}
• Total Interest Payable: ₹${result.interest.totalInterest.toLocaleString('en-IN')}
• Legal Basis: ${result.interest.basis}

TOTAL STATUTORY LIABILITY DUE: ₹${result.totalPayableLiability.toLocaleString('en-IN')}

Statutory Governance: CA Kavitha Vijay, B.Com, CA, CMA AIR 49 (ICMAI)
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

  const handleConsultChambers = () => {
    navigate('/contact', {
      state: {
        service: 'GST Compliance & Scrutiny Advisory',
        initialMessage: `Statutory GST Assessment inquiry: ${result.returnName} delayed by ${result.delayInDays} days. Total calculated dues: ₹${result.totalPayableLiability.toLocaleString('en-IN')} (Late Fee: ₹${result.lateFee.totalLateFee.toLocaleString('en-IN')}, Section 50 Interest: ₹${result.interest.totalInterest.toLocaleString('en-IN')}).`,
      },
    });
  };

  const handleWhatsAppConsult = () => {
    const text = `Hello CA Kavitha Vijay, I ran an assessment on your website GST Calculator:\n• Return: ${result.returnName}\n• Delay: ${result.delayInDays} days\n• Late Fee: ₹${result.lateFee.totalLateFee.toLocaleString('en-IN')}\n• Section 50 Interest: ₹${result.interest.totalInterest.toLocaleString('en-IN')}\n• Total Calculated Dues: ₹${result.totalPayableLiability.toLocaleString('en-IN')}\n\nI would like to seek your chambers' assistance to file and resolve this compliance.`;
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
              Indirect Tax Computational Engine
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#AAB4A0] bg-[#183529] px-2.5 py-0.5 rounded-full border border-[#B49A64]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Section 47 &amp; Section 50(1) CGST Act</span>
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F1EBDD]">
            GST Late Fee &amp; Net Cash Interest Calculator
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] max-w-3xl leading-relaxed">
            Statutory computation of return-specific late filing fees under Section 47 (Notifications 19/2021-CT, 20/2021-CT &amp; 07/2023-CT) and 18% p.a. interest under Section 50 calculated strictly on net cash liability.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#D8D0BE] hover:text-[#B49A64] hover:border-[#B49A64] transition-colors min-h-[44px] shrink-0 self-start md:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Form</span>
        </button>
      </div>

      {/* Main Grid: Inputs (7 cols) + Assessment Results (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Return Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">1</span>
              <span>Select Statutory Return Type</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'GSTR-3B-Monthly', label: 'GSTR-3B Monthly', sub: 'Regular Taxpayers' },
                { type: 'GSTR-3B-QRMP', label: 'GSTR-3B QRMP', sub: 'Quarterly Scheme' },
                { type: 'GSTR-1-Monthly', label: 'GSTR-1 Monthly', sub: 'Outward Supplies' },
                { type: 'GSTR-9-Annual', label: 'GSTR-9 Annual', sub: 'Turnover Capped' },
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setReturnType(opt.type as GSTReturnType)}
                  className={`p-3 rounded-xl border text-left transition-all min-h-[44px] ${
                    returnType === opt.type
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] shadow-md ring-1 ring-[#B49A64]'
                      : 'bg-[#0B241C] border-[#B49A64]/20 text-[#D8D0BE] hover:border-[#B49A64]/60'
                  }`}
                >
                  <span className="block font-serif font-bold text-xs">{opt.label}</span>
                  <span className="block text-[10px] text-[#AAB4A0] mt-0.5">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Return Category & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">2</span>
                <span>Filing Category &amp; Threshold</span>
              </label>
              <select
                value={isNilReturn ? 'nil' : turnoverCategory}
                onChange={(e) => {
                  if (e.target.value === 'nil') {
                    setIsNilReturn(true);
                  } else {
                    setIsNilReturn(false);
                    setTurnoverCategory(e.target.value as GSTTurnoverCategory);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#B49A64] min-h-[44px]"
              >
                <option value="upto-1.5cr">Aggregate Turnover ≤ ₹1.5 Cr (Cap: ₹2,000)</option>
                <option value="1.5cr-to-5cr">Turnover ₹1.5 Cr to ₹5 Cr (Cap: ₹5,000)</option>
                <option value="above-5cr">Turnover &gt; ₹5 Cr (Standard Cap: ₹10,000)</option>
                <option value="nil">Nil Return (Zero Tax / Supply — Cap: ₹500)</option>
              </select>
            </div>

            {/* GSTR-9 Turnover Input if applicable */}
            {returnType === 'GSTR-9-Annual' && (
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">•</span>
                  <span>State Turnover (for Sec 47(2) Cap)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="50000"
                  placeholder="e.g. 5000000 (₹50 Lakhs)"
                  value={stateTurnoverForGstr9}
                  onChange={(e) => setStateTurnoverForGstr9(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                />
              </div>
            )}
          </div>

          {/* Dates: Due Date & Actual Filing Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-[#AAB4A0] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B49A64]" />
                <span>Statutory Due Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#AAB4A0] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B49A64]" />
                <span>Actual / Projected Filing Date</span>
              </label>
              <input
                type="date"
                value={actualFilingDate}
                onChange={(e) => setActualFilingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
              />
            </div>
          </div>

          {/* Step 3: Net Cash Tax Liabilities (Applicable to GSTR-3B) */}
          {!isNilReturn && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">3</span>
                  <span>Net Cash Tax Liability (Discharged via Cash Ledger)</span>
                </label>
                <span className="text-[11px] text-[#AAB4A0]">Exclude ITC portions</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-[#AAB4A0]">CGST Cash (₹)</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={cgstCash}
                    onChange={(e) => setCgstCash(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-[#AAB4A0]">SGST Cash (₹)</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={sgstCash}
                    onChange={(e) => setSgstCash(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] text-[#AAB4A0]">IGST Cash (₹)</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={igstCash}
                    onChange={(e) => setIgstCash(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#B49A64] min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Legal Note on Section 50 Proviso */}
          <div className="p-3.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/25 flex items-start gap-2.5 text-xs text-[#D8D0BE]">
            <Info className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#B49A64]">Retrospective Section 50 Proviso:</strong> Under Finance Act, 2021 amendments, interest at 18% p.a. is payable solely on tax discharged by debiting the Electronic Cash Ledger. Zero interest is levied on portions offset by eligible Input Tax Credit (ITC). Delay in GSTR-1 does not attract Section 50 interest.
            </p>
          </div>
        </div>

        {/* Right Output Assessment Column */}
        <div className="lg:col-span-5 bg-[#0B241C] p-5 sm:p-6 rounded-2xl border border-[#B49A64]/40 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#B49A64]/20">
              <span className="font-mono text-xs font-bold text-[#B49A64] uppercase tracking-wider">
                Statutory Assessment Summary
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                result.isOverdue ? 'bg-amber-900/60 text-amber-300 border border-amber-500/40' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
              }`}>
                {result.isOverdue ? `${result.delayInDays} Days Delayed` : 'On-Time Filing'}
              </span>
            </div>

            {/* Validation Notice for GSTR-9 missing turnover */}
            {result.isGstr9InputMissing && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{result.validationMessage}</p>
              </div>
            )}

            {/* Late Fee Card */}
            <div className="p-4 rounded-xl bg-[#071B14] border border-[#B49A64]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#AAB4A0]">Section 47 Late Fee</span>
                <span className="font-mono text-[#F1EBDD] font-bold text-base">
                  ₹{result.lateFee.totalLateFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[11px] text-[#AAB4A0] space-y-1 pt-1 border-t border-[#B49A64]/10">
                <div className="flex justify-between">
                  <span>CGST Late Fee:</span>
                  <span className="font-mono text-[#D8D0BE]">₹{result.lateFee.cgstLateFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST Late Fee:</span>
                  <span className="font-mono text-[#D8D0BE]">₹{result.lateFee.sgstLateFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#B49A64]">
                  <span>Statutory Cap:</span>
                  <span className="font-mono">₹{result.lateFee.statutoryCapPerAct * 2}</span>
                </div>
              </div>
            </div>

            {/* Section 50 Interest Card */}
            <div className="p-4 rounded-xl bg-[#071B14] border border-[#B49A64]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#AAB4A0]">Section 50 Interest (18% p.a.)</span>
                <span className="font-mono text-emerald-300 font-bold text-base">
                  ₹{result.interest.totalInterest.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-[11px] text-[#AAB4A0] space-y-1 pt-1 border-t border-[#B49A64]/10">
                <div className="flex justify-between">
                  <span>CGST Interest:</span>
                  <span className="font-mono text-[#D8D0BE]">₹{result.interest.cgstInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST Interest:</span>
                  <span className="font-mono text-[#D8D0BE]">₹{result.interest.sgstInterest.toLocaleString('en-IN')}</span>
                </div>
                {result.interest.igstInterest > 0 && (
                  <div className="flex justify-between">
                    <span>IGST Interest:</span>
                    <span className="font-mono text-[#D8D0BE]">₹{result.interest.igstInterest.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="text-[10px] text-[#AAB4A0] pt-1">
                  Basis: {result.interest.basis}
                </div>
              </div>
            </div>

            {/* Total Dues Callout */}
            <div className="p-4 rounded-xl bg-[#183529] border border-[#B49A64]/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#B49A64] block">
                  Total Dues Payable
                </span>
                <span className="text-xl sm:text-2xl font-serif font-black text-[#F1EBDD]">
                  ₹{result.totalPayableLiability.toLocaleString('en-IN')}
                </span>
              </div>
              <ShieldCheck className="w-7 h-7 text-[#B49A64]" />
            </div>

            {/* Statutory Citations */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-mono text-[#B49A64] uppercase block">
                Statutory Citations:
              </span>
              <ul className="text-[10px] text-[#AAB4A0] space-y-0.5 list-disc pl-3">
                {result.statutoryCitations.map((cite, idx) => (
                  <li key={idx}>{cite}</li>
                ))}
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
              <span>Discuss Assessment on WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleConsultChambers}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-br from-[#C5A059] via-[#B49A64] to-[#9E844E] hover:from-[#D4AF37] hover:via-[#C5A059] hover:to-[#B49A64] text-[#071B14] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-gold-glow border border-[#C5A059]/60 min-h-[44px] group btn-shimmer"
            >
              <span>Consult Chambers with Assessment</span>
              <ArrowRight className="w-4 h-4 text-[#071B14] transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
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
                  : 'Copy statutory assessment summary'
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
                  <span className="text-amber-300">Copy Blocked · Select Text Manually</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#B49A64]" />
                  <span>Copy Statutory Assessment Summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTLateFeeCalculator;
