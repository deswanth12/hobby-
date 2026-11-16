import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Scale, 
  RotateCcw
} from 'lucide-react';

export type EntityType = 'pvt_ltd' | 'llp' | 'partnership' | 'proprietor';
export type TurnoverBand = 'under_1cr' | '1cr_to_10cr' | 'above_10cr';
export type DigitalRatio = 'high_digital' | 'cash_heavy';

interface StatutoryResult {
  statutoryAuditRequired: boolean;
  statutoryAuditTitle: string;
  statutoryAuditLaw: string;
  statutoryAuditDesc: string;
  taxAuditRequired: boolean;
  taxAuditTitle: string;
  taxAuditLaw: string;
  taxAuditDesc: string;
  requiredForms: string[];
  keyDeadlines: { date: string; label: string }[];
  penaltyProvision: string;
}

export const StatutoryAuditScreener: React.FC = () => {
  const navigate = useNavigate();
  const [entityType, setEntityType] = useState<EntityType>('pvt_ltd');
  const [turnoverBand, setTurnoverBand] = useState<TurnoverBand>('1cr_to_10cr');
  const [digitalRatio, setDigitalRatio] = useState<DigitalRatio>('high_digital');
  const [copied, setCopied] = useState(false);

  // Statutory evaluation engine adhering to Companies Act 2013 and Income Tax Act 1961
  const calculateResult = (): StatutoryResult => {
    // 1. Companies Act 2013 Statutory Audit (Sec 139)
    let statutoryAuditRequired = false;
    let statutoryAuditTitle = 'Statutorily Exempt from Companies Act';
    let statutoryAuditLaw = 'Companies Act, 2013 not applicable to non-corporate entities';
    let statutoryAuditDesc = 'Unincorporated firms are not governed by the Companies Act 2013 and do not require statutory company auditor appointment.';

    if (entityType === 'pvt_ltd') {
      statutoryAuditRequired = true;
      statutoryAuditTitle = 'Mandatory Annual Statutory Audit';
      statutoryAuditLaw = 'Section 139, Companies Act 2013 & CARO 2020';
      statutoryAuditDesc = 'Every incorporated Private Limited Company must appoint an independent practicing Chartered Accountant for annual statutory financial audit, irrespective of turnover, capital, or transaction mode.';
    } else if (entityType === 'llp') {
      if (turnoverBand === 'above_10cr' || turnoverBand === '1cr_to_10cr') {
        statutoryAuditRequired = true;
        statutoryAuditTitle = 'Mandatory LLP Statutory Audit';
        statutoryAuditLaw = 'Rule 24, Limited Liability Partnership Rules, 2009';
        statutoryAuditDesc = 'Audit is mandatory under Rule 24 for LLPs with annual turnover exceeding ₹40 Lakhs or partner capital contributions exceeding ₹25 Lakhs.';
      } else {
        statutoryAuditRequired = false;
        statutoryAuditTitle = 'Conditional LLP Audit Exemption';
        statutoryAuditLaw = 'Rule 24(8), LLP Rules, 2009 (Turnover under ₹40L)';
        statutoryAuditDesc = 'LLPs with turnover under ₹40 Lakhs and partner contribution under ₹25 Lakhs are exempt from mandatory statutory audit unless specified in the LLP Agreement.';
      }
    }

    // 2. Income Tax Act 1961 Section 44AB Tax Audit
    let taxAuditRequired = false;
    let taxAuditTitle = 'Statutorily Exempt from Tax Audit';
    let taxAuditLaw = 'Section 44AB, Income Tax Act, 1961';
    let taxAuditDesc = 'Turnover is within statutory safe limits and does not trigger Section 44AB audit thresholds.';

    if (turnoverBand === 'above_10cr') {
      taxAuditRequired = true;
      taxAuditTitle = 'Mandatory Tax Audit (Gross Turnover > ₹10 Cr)';
      taxAuditLaw = 'Section 44AB(a), Income Tax Act, 1961';
      taxAuditDesc = 'Gross turnover exceeds the absolute ₹10 Crore statutory ceiling. Comprehensive audit and Form 3CD reporting are mandatory regardless of cash or digital percentage.';
    } else if (turnoverBand === '1cr_to_10cr') {
      if (digitalRatio === 'high_digital') {
        taxAuditRequired = false;
        taxAuditTitle = 'Exempt under ₹10 Cr Digital Safe Harbor';
        taxAuditLaw = 'Proviso to Section 44AB(a), Income Tax Act, 1961';
        taxAuditDesc = 'Because aggregate cash receipts and payments do not exceed 5% (≥ 95% digital transactions), your entity qualifies for the elevated ₹10 Crore non-cash threshold and is statutorily exempt from tax audit.';
      } else {
        taxAuditRequired = true;
        taxAuditTitle = 'Mandatory Tax Audit (Cash > 5% Threshold Exceeded)';
        taxAuditLaw = 'Section 44AB(a), Income Tax Act, 1961';
        taxAuditDesc = 'Because cash transactions exceed 5% of aggregate receipts or payments, the elevated ₹10 Crore digital safe harbor is forfeited and the baseline ₹1 Crore turnover limit strictly applies.';
      }
    } else {
      // under 1cr
      taxAuditRequired = false;
      taxAuditTitle = 'Statutorily Exempt from Tax Audit (Turnover < ₹1 Cr)';
      taxAuditLaw = 'Section 44AB(a) read with Section 44AD';
      taxAuditDesc = 'Turnover is below the baseline ₹1 Crore threshold. Eligible for presumptive taxation under Section 44AD (or 44ADA for professionals).';
    }

    // 3. Required Statutory Forms
    const requiredForms: string[] = [];
    if (entityType === 'pvt_ltd') {
      requiredForms.push('Form AOC-4 (Financial Statements e-filing with MCA)');
      requiredForms.push('Form MGT-7 / MGT-7A (Annual Return with MCA)');
      requiredForms.push('ITR-6 (Corporate Income Tax Return)');
      if (taxAuditRequired) {
        requiredForms.push('Form 3CA & Form 3CD (Statutory Tax Audit Report)');
      }
    } else if (entityType === 'llp') {
      requiredForms.push('Form 11 (LLP Annual Return with MCA)');
      requiredForms.push('Form 8 (Statement of Account & Solvency with MCA)');
      requiredForms.push('ITR-5 (LLP Income Tax Return)');
      if (taxAuditRequired) {
        requiredForms.push('Form 3CB & Form 3CD (Tax Audit Report for Non-Company)');
      }
    } else {
      requiredForms.push(entityType === 'partnership' ? 'ITR-5 (Partnership Firm Return)' : 'ITR-3 (Business & Professional Return)');
      if (taxAuditRequired) {
        requiredForms.push('Form 3CB & Form 3CD (Tax Audit Report under Sec 44AB)');
      }
    }

    // 4. Critical Annual Deadlines
    const keyDeadlines: { date: string; label: string }[] = [];
    if (taxAuditRequired) {
      keyDeadlines.push({ date: '30 September', label: 'Section 44AB Tax Audit Report e-Filing (Form 3CD)' });
      keyDeadlines.push({ date: '31 October', label: 'Audited Income Tax Return (ITR-6 / ITR-5 / ITR-3)' });
    } else {
      if (entityType === 'pvt_ltd') {
        keyDeadlines.push({ date: '31 October', label: 'Corporate ITR-6 Return (Mandatory corporate deadline)' });
      } else {
        keyDeadlines.push({ date: '31 July', label: 'Non-Audit Income Tax Return Filing Deadline' });
      }
    }
    if (entityType === 'pvt_ltd') {
      keyDeadlines.push({ date: '29 October', label: 'MCA Form AOC-4 Filing (30 days from AGM)' });
      keyDeadlines.push({ date: '28 November', label: 'MCA Form MGT-7 Annual Return (60 days from AGM)' });
    } else if (entityType === 'llp') {
      keyDeadlines.push({ date: '30 May', label: 'MCA Form 11 (LLP Annual Return)' });
      keyDeadlines.push({ date: '30 October', label: 'MCA Form 8 (LLP Statement of Solvency)' });
    }

    const penaltyProvision = taxAuditRequired
      ? 'Section 271B Penalty Warning: Failure to complete Section 44AB audit and upload Form 3CD by 30th September attracts a statutory penalty equal to 0.5% of total turnover, up to ₹1,50,000.'
      : 'Compliance Advisory: While exempt from tax audit, proper books of accounts must be maintained under Section 44AA to prevent disallowances or notices under Section 133(6).';

    return {
      statutoryAuditRequired,
      statutoryAuditTitle,
      statutoryAuditLaw,
      statutoryAuditDesc,
      taxAuditRequired,
      taxAuditTitle,
      taxAuditLaw,
      taxAuditDesc,
      requiredForms,
      keyDeadlines,
      penaltyProvision
    };
  };

  const result = calculateResult();

  const handleCopySummary = () => {
    const entityLabel = 
      entityType === 'pvt_ltd' ? 'Private Limited Company' :
      entityType === 'llp' ? 'Limited Liability Partnership (LLP)' :
      entityType === 'partnership' ? 'Partnership Firm' : 'Individual / Sole Proprietorship';

    const turnoverLabel = 
      turnoverBand === 'under_1cr' ? 'Under ₹1 Crore' :
      turnoverBand === '1cr_to_10cr' ? '₹1 Crore – ₹10 Crore' : 'Above ₹10 Crore';

    const digitalLabel = 
      digitalRatio === 'high_digital' ? '≥ 95% Digital / Banking' : '> 5% Physical Cash';

    const text = [
      '=======================================================',
      '  KAVITHA & ASSOCIATES — STATUTORY AUDIT EVALUATION   ',
      '=======================================================',
      `Entity Structure: ${entityLabel}`,
      `Turnover Band:    ${turnoverLabel}`,
      `Transaction Mode: ${digitalLabel}`,
      '-------------------------------------------------------',
      `Companies Act Statutory Audit (Sec 139): ${result.statutoryAuditRequired ? 'MANDATORY' : 'EXEMPT'}`,
      `Governing Law: ${result.statutoryAuditLaw}`,
      '',
      `Income Tax Audit (Sec 44AB): ${result.taxAuditRequired ? 'MANDATORY' : 'EXEMPT'}`,
      `Governing Law: ${result.taxAuditLaw}`,
      '',
      'Mandatory Statutory Deliverables:',
      ...result.requiredForms.map(f => `  • ${f}`),
      '',
      'Critical Compliance Deadlines:',
      ...result.keyDeadlines.map(d => `  • ${d.date}: ${d.label}`),
      '-------------------------------------------------------',
      `Lead Partner: CA Kavitha Vijay (B.Com, CA, CMA AIR 49 (ICMAI))`,
      `Chambers: Bairagi Patteda, Tirupati · +91 96263 50900`,
      '======================================================='
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInitiateScoping = () => {
    const intakeSection = document.getElementById('chambers-contact') || document.getElementById('contact-section');
    if (intakeSection) {
      intakeSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact#intake');
    }
  };

  return (
    <div className="w-full bg-[#071B14] text-[#F1EBDD] rounded-3xl border border-[#B49A64]/40 p-4 sm:p-7 lg:p-10 shadow-2xl relative overflow-hidden texture-architectural-lines">
      {/* Corner Brass Accents */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B49A64]/60 rounded-tl-sm pointer-events-none" aria-hidden="true" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B49A64]/60 rounded-tr-sm pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#B49A64]/60 rounded-bl-sm pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#B49A64]/60 rounded-br-sm pointer-events-none" aria-hidden="true" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#B49A64]/30">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap mb-2">
            <span className="font-mono text-xs font-bold text-[#B49A64] bg-[#0B241C] px-3 py-1 rounded-full border border-[#B49A64]/30 uppercase tracking-widest">
              INTERACTIVE STATUTORY TOOL
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#D8D0BE]">
              <Scale className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Companies Act 2013 &amp; Section 44AB Oracle</span>
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F1EBDD] tracking-tight">
            Enterprise Statutory Audit &amp; Tax Screener
          </h3>
          <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] mt-1 max-w-2xl">
            Determine your organization&apos;s legal audit obligations, required MCA/ITR forms, and statutory filing deadlines in 3 clicks.
          </p>
        </div>

        {/* Live Status Pill & Reset */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setEntityType('pvt_ltd');
              setTurnoverBand('1cr_to_10cr');
              setDigitalRatio('high_digital');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#D8D0BE] hover:text-[#B49A64] hover:border-[#B49A64] transition-colors min-h-[44px]"
            title="Reset Screener"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 3-Click Selectors (Left) + Statutory Result Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 sm:pt-8 items-start">
        
        {/* Left Column: 3 Interactive Decision Steps (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Entity Structure */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">1</span>
                <span>Select Entity Structure</span>
              </label>
              <span className="text-[11px] text-[#AAB4A0] font-mono">Governing Charter</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'pvt_ltd', title: 'Private Limited Company', sub: 'Companies Act, 2013' },
                { id: 'llp', title: 'Limited Liability Partnership', sub: 'LLP Act, 2008' },
                { id: 'partnership', title: 'Partnership Firm', sub: 'Partnership Act, 1932' },
                { id: 'proprietor', title: 'Proprietorship / Individual', sub: 'Commercial Enterprise' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEntityType(item.id as EntityType)}
                  className={`p-3 rounded-xl border text-left transition-all min-h-[52px] flex items-center justify-between ${
                    entityType === item.id
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] shadow-md ring-1 ring-[#B49A64]'
                      : 'bg-[#0B241C] border-[#B49A64]/20 text-[#D8D0BE] hover:border-[#B49A64]/60 hover:bg-[#0B241C]/80'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block leading-tight">{item.title}</span>
                    <span className="text-[10px] text-[#AAB4A0] block mt-0.5">{item.sub}</span>
                  </div>
                  {entityType === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#B49A64] shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Annual Gross Turnover */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">2</span>
                <span>Annual Gross Turnover / Receipts</span>
              </label>
              <span className="text-[11px] text-[#AAB4A0] font-mono">Financial Year Volume</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'under_1cr', title: 'Under ₹1 Crore', sub: 'Micro / Startup' },
                { id: '1cr_to_10cr', title: '₹1 Cr – ₹10 Crore', sub: 'Middle Market MSME' },
                { id: 'above_10cr', title: 'Above ₹10 Crore', sub: 'Corporate Enterprise' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTurnoverBand(item.id as TurnoverBand)}
                  className={`p-3 rounded-xl border text-left transition-all min-h-[52px] flex items-center justify-between ${
                    turnoverBand === item.id
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] shadow-md ring-1 ring-[#B49A64]'
                      : 'bg-[#0B241C] border-[#B49A64]/20 text-[#D8D0BE] hover:border-[#B49A64]/60 hover:bg-[#0B241C]/80'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block leading-tight">{item.title}</span>
                    <span className="text-[10px] text-[#AAB4A0] block mt-0.5">{item.sub}</span>
                  </div>
                  {turnoverBand === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#B49A64] shrink-0 ml-1.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Banking / Digital Transaction Mode */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#183529] text-[#B49A64] flex items-center justify-center text-[10px] border border-[#B49A64]/40">3</span>
                <span>Banking vs. Cash Transaction Ratio</span>
              </label>
              <span className="text-[11px] text-[#AAB4A0] font-mono">Sec 44AB Proviso Test</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { 
                  id: 'high_digital', 
                  title: '≥ 95% Digital / Banking', 
                  sub: 'NEFT, RTGS, UPI, Account Payee Cheques (Cash ≤ 5%)' 
                },
                { 
                  id: 'cash_heavy', 
                  title: '> 5% Physical Cash', 
                  sub: 'Cash receipts or cash payments exceed 5% aggregate' 
                }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDigitalRatio(item.id as DigitalRatio)}
                  className={`p-3 rounded-xl border text-left transition-all min-h-[52px] flex items-center justify-between ${
                    digitalRatio === item.id
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] shadow-md ring-1 ring-[#B49A64]'
                      : 'bg-[#0B241C] border-[#B49A64]/20 text-[#D8D0BE] hover:border-[#B49A64]/60 hover:bg-[#0B241C]/80'
                  }`}
                >
                  <div>
                    <span className="text-xs font-semibold block leading-tight">{item.title}</span>
                    <span className="text-[10px] text-[#AAB4A0] block mt-0.5 leading-snug">{item.sub}</span>
                  </div>
                  {digitalRatio === item.id && (
                    <CheckCircle2 className="w-4 h-4 text-[#B49A64] shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Live Statutory Radar Strip */}
          <div className="p-3.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/25 flex items-center justify-between text-xs text-[#D8D0BE] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold text-[#B49A64] uppercase tracking-wider">
                Active Assessment Cycle: AY 2026-27 (FY 2025-26)
              </span>
            </div>
            <span className="text-[11px] text-[#AAB4A0]">
              Statutory Benchmark: Standards on Auditing (SAs) &amp; Section 44AB
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Statutory Verdict Dossier (5 cols) */}
        <div className="lg:col-span-5 bg-[#0B241C] p-5 sm:p-6 rounded-2xl border border-[#B49A64]/40 shadow-xl space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#B49A64]/20">
            <span className="font-mono text-xs font-bold text-[#B49A64] uppercase tracking-wider">
              OFFICIAL STATUTORY VERDICT
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#183529] text-[#B49A64] border border-[#B49A64]/30">
              LEGAL STATUS
            </span>
          </div>

          {/* 1. Companies Act Status Plaque */}
          <div className="p-4 rounded-xl bg-[#071B14] border border-[#B49A64]/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#AAB4A0] uppercase">
                Companies Act 2013 (Sec 139)
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                result.statutoryAuditRequired 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                  : 'bg-[#183529] text-[#D8D0BE] border border-[#B49A64]/30'
              }`}>
                {result.statutoryAuditRequired ? 'MANDATORY' : 'EXEMPT'}
              </span>
            </div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#F1EBDD]">
              {result.statutoryAuditTitle}
            </h4>
            <p className="font-editorial-body text-xs text-[#D8D0BE] leading-relaxed">
              {result.statutoryAuditDesc}
            </p>
          </div>

          {/* 2. Income Tax Act Status Plaque */}
          <div className="p-4 rounded-xl bg-[#071B14] border border-[#B49A64]/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#AAB4A0] uppercase">
                Income Tax Act (Sec 44AB)
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                result.taxAuditRequired 
                  ? 'bg-amber-950 text-amber-300 border border-amber-500/40' 
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              }`}>
                {result.taxAuditRequired ? 'MANDATORY' : 'EXEMPT'}
              </span>
            </div>
            <h4 className="font-serif text-sm sm:text-base font-bold text-[#F1EBDD]">
              {result.taxAuditTitle}
            </h4>
            <p className="font-editorial-body text-xs text-[#D8D0BE] leading-relaxed">
              {result.taxAuditDesc}
            </p>
          </div>

          {/* 3. Mandatory Statutory Deliverables */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#B49A64] uppercase block">
              Required Statutory Forms &amp; Disclosures
            </span>
            <ul className="space-y-1.5 text-xs text-[#D8D0BE]">
              {result.requiredForms.map((form, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0 mt-0.5" />
                  <span>{form}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Critical Annual Compliance Deadlines */}
          <div className="space-y-2 pt-2 border-t border-[#B49A64]/20">
            <span className="text-[11px] font-mono font-bold text-[#B49A64] uppercase block">
              Critical Statutory Milestones
            </span>
            <div className="space-y-1.5">
              {result.keyDeadlines.map((dl, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#071B14] border border-[#B49A64]/20 text-xs">
                  <span className="text-[#D8D0BE] text-[11px] truncate mr-2">{dl.label}</span>
                  <span className="font-mono text-[#B49A64] font-bold shrink-0 tabular-nums">{dl.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning / Advisory Note */}
          <div className="p-3 rounded-lg bg-[#183529]/60 border border-[#B49A64]/30 text-[11px] text-[#D8D0BE] leading-relaxed">
            <p>{result.penaltyProvision}</p>
          </div>

          {/* Action Buttons: Scoping + Copy */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleInitiateScoping}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-br from-[#C5A059] via-[#B49A64] to-[#9E844E] hover:from-[#D4AF37] hover:via-[#C5A059] hover:to-[#B49A64] text-[#071B14] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-gold-glow border border-[#C5A059]/60 min-h-[44px] group btn-shimmer"
            >
              <span>Schedule Partner Scoping</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="py-3 px-3.5 rounded-xl bg-[#183529] hover:bg-[#071B14] text-[#B49A64] border border-[#B49A64]/40 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              title="Copy Assessment Summary"
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

export default StatutoryAuditScreener;
