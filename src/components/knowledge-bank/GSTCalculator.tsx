import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ArrowRight,
  ShieldAlert,
  Info,
  RotateCcw,
} from 'lucide-react';
import { useFirmData } from '../../context/FirmDataContext';
import {
  GSTReturnType,
  GSTTurnoverCategory,
  STATUTORY_APPROVAL_CONFIG,
} from './taxRules';
import {
  GSTCalculatorInputs,
  calculateGSTLateFeeAndInterest,
} from './calculationEngine';

export const GSTCalculator: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();

  // Helper to format date YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Form State
  const [returnType, setReturnType] = useState<GSTReturnType>('GSTR-3B-Monthly');
  const [dueDate, setDueDate] = useState<string>('2026-10-20');
  const [actualFilingDate, setActualFilingDate] = useState<string>(todayStr);
  const [isNilReturn, setIsNilReturn] = useState<boolean>(false);
  const [turnoverCategory, setTurnoverCategory] = useState<GSTTurnoverCategory>('upto-1.5cr');

  // Net Cash Tax Liabilities (paid via cash ledger, not ITC)
  const [cgstCash, setCgstCash] = useState<number>(25000);
  const [sgstCash, setSgstCash] = useState<number>(25000);
  const [igstCash, setIgstCash] = useState<number>(0);
  const [stateTurnoverForGstr9, setStateTurnoverForGstr9] = useState<number | ''>(''); // Strictly required, no silent fallback

  // Calculation computation
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

  // WhatsApp pre-fill message
  const whatsappText = encodeURIComponent(
    `Hello CA Kavitha Vijay, I used your GST Late Fee & Interest Calculator for ${returnType}.\n` +
      `• Due Date: ${dueDate} | Filing Date: ${actualFilingDate}\n` +
      `• Delay: ${result.delayInDays} days\n` +
      `• Late Fee: ₹${result.lateFee.totalLateFee.toLocaleString('en-IN')}\n` +
      `• Section 50 Interest (18%): ₹${result.interest.totalInterest.toLocaleString('en-IN')}\n` +
      `• Total Statutory Dues: ₹${result.totalPayableLiability.toLocaleString('en-IN')}\n` +
      `Could I schedule a review of our pending GST returns?`
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
              <span>Indirect Tax Engine • Section 47 &amp; 50 CGST</span>
            </div>
            <h3 className="font-editorial-h3 text-2xl sm:text-3xl font-bold text-brand-ivory">
              GST Late Fee &amp; Interest Calculator
            </h3>
            <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 mt-1">
              Statutory calculation of late filing fees (Section 47) differentiated by return type (Notifications 19/2021-CT, 20/2021-CT, 07/2023-CT) and 18% p.a. interest (Section 50) on net cash tax liability.
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
              Rates reflect Section 47 &amp; 50 of CGST Act and Notifications 19/2021-CT, 20/2021-CT, and 07/2023-CT. Formal partner confirmation by{' '}
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
              <span>Return Parameters</span>
              <span className="text-[11px] text-brand-muted font-normal">Filing Timeline</span>
            </h4>

            {/* Return Type & Turnover Category */}
            <div>
              <label htmlFor="gst-return-select" className="block text-xs font-bold text-brand-charcoal mb-1.5">
                GST Return Form
              </label>
              <select
                id="gst-return-select"
                value={returnType}
                onChange={(e) => setReturnType(e.target.value as GSTReturnType)}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-brand-border bg-brand-surface/50 text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
              >
                <option value="GSTR-3B-Monthly">GSTR-3B (Monthly Return)</option>
                <option value="GSTR-3B-QRMP">GSTR-3B (QRMP Scheme - Quarterly)</option>
                <option value="GSTR-1-Monthly">GSTR-1 (Outward Supplies - Monthly)</option>
                <option value="GSTR-1-QRMP">GSTR-1 (Outward Supplies - Quarterly QRMP/IFF)</option>
                <option value="GSTR-9-Annual">GSTR-9 (Annual Return)</option>
              </select>
            </div>

            {/* Dates: Due Date & Actual Filing Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gst-due-date" className="block text-xs font-bold text-brand-charcoal mb-1">
                  Statutory Due Date
                </label>
                <input
                  id="gst-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-brand-border bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
                />
              </div>

              <div>
                <label htmlFor="gst-filing-date" className="block text-xs font-bold text-brand-charcoal mb-1">
                  Actual Filing Date
                </label>
                <input
                  id="gst-filing-date"
                  type="date"
                  value={actualFilingDate}
                  onChange={(e) => setActualFilingDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-brand-border bg-white text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
                />
              </div>
            </div>

            {/* Statutory Due Date Rule Breakdown */}
            <div className="p-3.5 rounded-xl bg-brand-surface/60 border border-brand-border text-xs space-y-1.5">
              <div className="font-bold text-brand-forest flex items-center justify-between text-[11px]">
                <span>Statutory Due Date Classification</span>
                <span className="text-[10px] text-brand-gold uppercase font-semibold">Legal Baseline</span>
              </div>
              <p className="text-[11px] text-brand-charcoal">
                <strong>Baseline Due Date:</strong> {result.statutoryCitations[0]}
              </p>
              <p className="text-[10px] text-brand-muted leading-tight">
                <strong>Taxpayer / State Rule:</strong> {inputs.returnType === 'GSTR-3B-QRMP' ? 'Category 1 States (AP, TS, TN, KA, MH, etc.): 22nd of succeeding month; Category 2 States: 24th.' : 'Standard monthly or quarterly filing calendar.'}
              </p>
              <p className="text-[10px] text-brand-muted/90 italic leading-tight">
                <strong>Government Notifications:</strong> Baseline statutory dates are subject to periodic CBIC notifications granting extensions for specific tax periods or states.
              </p>
            </div>

            {/* Turnover Category for Late Fee Caps */}
            <div>
              <label htmlFor="gst-turnover-select" className="block text-xs font-bold text-brand-charcoal mb-1.5">
                Annual Aggregate Turnover (AATO) in Preceding FY
              </label>
              <select
                id="gst-turnover-select"
                value={turnoverCategory}
                onChange={(e) => setTurnoverCategory(e.target.value as GSTTurnoverCategory)}
                className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-brand-border bg-brand-surface/50 text-brand-forest focus:outline-none focus:ring-2 focus:ring-brand-forest"
              >
                <option value="upto-1.5cr">Up to ₹1.5 Crore (Max late fee ₹2,000)</option>
                <option value="1.5cr-to-5cr">₹1.5 Crore to ₹5 Crore (Max late fee ₹5,000)</option>
                <option value="above-5cr">Above ₹5 Crore (Max late fee ₹10,000)</option>
              </select>
              <p className="text-[10px] text-brand-muted mt-1">
                {returnType === 'GSTR-9-Annual'
                  ? 'GSTR-9 late fee is capped by percentage of turnover in State/UT under Notification No. 07/2023-CT.'
                  : 'Amnesty & rationalized caps under Notification No. 19/2021-CT & 20/2021-CT.'}
              </p>
            </div>

            {/* Nil Return Checkbox */}
            <div className="p-3.5 rounded-xl bg-brand-surface/50 border border-brand-border flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-brand-forest">Nil Return?</span>
                <span className="block text-[11px] text-brand-muted">No outward sales, purchases, or tax liability</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNilReturn}
                  onChange={(e) => setIsNilReturn(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-forest" />
              </label>
            </div>

            {/* Return-specific Notice or Cash Tax Liability Section */}
            {returnType.startsWith('GSTR-1') ? (
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Info className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                  <span>Statement of Outward Supplies (Section 37)</span>
                </div>
                <p className="text-[11px] text-blue-900/90 leading-relaxed">
                  Form GSTR-1 is solely an information return detailing sales invoices. No tax is payable in GSTR-1, and <strong>Section 50 interest is ₹0</strong>. All net cash tax liabilities and applicable interest are settled through Form GSTR-3B.
                </p>
              </div>
            ) : returnType === 'GSTR-9-Annual' ? (
              <div className="p-4 rounded-xl bg-brand-surface/50 border border-brand-border space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-forest">GSTR-9 State Turnover</span>
                  <span className="text-[10px] text-brand-gold font-semibold uppercase">Notification 07/2023-CT</span>
                </div>
                <div>
                  <label htmlFor="gst-state-turnover" className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                    Turnover in State/UT (₹) <span className="text-amber-700 font-bold">*Required</span>
                  </label>
                  <input
                    id="gst-state-turnover"
                    type="number"
                    min="0"
                    step="500000"
                    placeholder="Enter Annual Turnover in State (e.g. 10000000)"
                    value={stateTurnoverForGstr9}
                    onChange={(e) => setStateTurnoverForGstr9(e.target.value === '' ? '' : Math.max(0, Number(e.target.value) || 0))}
                    className={`w-full px-3 py-1.5 text-xs font-medium rounded-lg border bg-white text-brand-forest ${
                      result.isGstr9InputMissing ? 'border-amber-400 ring-1 ring-amber-400' : 'border-brand-border'
                    }`}
                  />
                  {result.isGstr9InputMissing && (
                    <p className="text-[11px] text-amber-800 font-medium mt-1.5 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{result.validationMessage}</span>
                    </p>
                  )}
                </div>

                {result.gstr9CapDetails && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-[11px] text-emerald-950 space-y-1">
                    <span className="font-bold text-emerald-900 block">Statutory Cap Derivation:</span>
                    <p className="text-emerald-900/90 leading-tight">
                      <strong>Cap Formula:</strong> {result.gstr9CapDetails.derivationFormula}
                    </p>
                    <p className="text-emerald-900/80 text-[10px]">
                      Governed by Notification No. 07/2023-CT ({result.gstr9CapDetails.capPercentageTotal}% statutory cap).
                    </p>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900">
                  <strong>Notice:</strong> Tax shortfalls uncovered during annual reconciliation must be discharged via <strong>Form DRC-03</strong> with voluntary interest payment.
                </div>
              </div>
            ) : !isNilReturn ? (
              <div className="p-4 rounded-xl bg-brand-surface/40 border border-brand-border space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-forest">Net Tax Payable in Cash</span>
                  <span className="text-[10px] text-brand-gold font-semibold uppercase">Excludes ITC</span>
                </div>
                <p className="text-[11px] text-brand-muted leading-tight">
                  Section 50(1) interest applies only to liability settled through Electronic Cash Ledger, not ITC.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="gst-cgst-cash" className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                      CGST Cash (₹)
                    </label>
                    <input
                      id="gst-cgst-cash"
                      type="number"
                      min="0"
                      step="500"
                      value={cgstCash}
                      onChange={(e) => setCgstCash(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-brand-border bg-white text-brand-forest"
                    />
                  </div>

                  <div>
                    <label htmlFor="gst-sgst-cash" className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                      SGST Cash (₹)
                    </label>
                    <input
                      id="gst-sgst-cash"
                      type="number"
                      min="0"
                      step="500"
                      value={sgstCash}
                      onChange={(e) => setSgstCash(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-brand-border bg-white text-brand-forest"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="gst-igst-cash" className="block text-[11px] font-semibold text-brand-charcoal mb-1">
                    IGST Cash (Interstate Supplies) (₹)
                  </label>
                  <input
                    id="gst-igst-cash"
                    type="number"
                    min="0"
                    step="500"
                    value={igstCash}
                    onChange={(e) => setIgstCash(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-brand-border bg-white text-brand-forest"
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            <h4 className="font-editorial-h4 text-base font-bold text-brand-forest border-b border-brand-border pb-2 flex items-center justify-between">
              <span>Statutory Dues Breakdown</span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${result.isOverdue ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'}`}>
                {result.isOverdue ? `${result.delayInDays} Days Overdue` : 'Filed On / Before Due Date'}
              </span>
            </h4>

            {/* Primary KPI Summary Card */}
            <div className="p-5 rounded-2xl bg-brand-surface/60 border border-brand-border">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                    Days of Delay
                  </span>
                  <span className="font-editorial-h3 text-2xl font-bold text-brand-forest mt-0.5 block">
                    {result.delayInDays} <span className="text-xs font-normal text-brand-muted">days</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                    Section 47 Late Fee
                  </span>
                  <span className="font-editorial-h3 text-2xl font-bold text-brand-forest mt-0.5 block">
                    {result.isGstr9InputMissing ? (
                      <span className="text-sm font-bold text-amber-800">Pending Input</span>
                    ) : (
                      `₹${result.lateFee.totalLateFee.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">
                    Section 50 Interest (18%)
                  </span>
                  <span className="font-editorial-h3 text-2xl font-bold text-brand-forest mt-0.5 block">
                    {result.supportsInterest ? `₹${result.interest.totalInterest.toLocaleString('en-IN')}` : '₹0 (N/A)'}
                  </span>
                </div>
              </div>

              {/* Total Settlement Amount */}
              <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-forest block">
                    {result.supportsInterest ? 'Total Statutory Dues (Cash + Late Fee + Interest)' : 'Total Late Fee Payable'}
                  </span>
                  <span className="text-[10px] text-brand-muted">
                    {result.supportsInterest ? 'Payable via Electronic Cash Ledger' : 'Discharged on filing the respective return form'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
                    {result.isGstr9InputMissing ? (
                      <span className="text-lg font-bold text-amber-800">Input Required</span>
                    ) : (
                      `₹${result.totalPayableLiability.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Calculation Table */}
            <div className="overflow-x-auto rounded-xl border border-brand-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-surface border-b border-brand-border">
                    <th className="p-3 font-bold text-brand-forest">Head of Payment</th>
                    <th className="p-3 font-bold text-brand-forest">CGST (₹)</th>
                    <th className="p-3 font-bold text-brand-forest">SGST (₹)</th>
                    <th className="p-3 font-bold text-brand-forest">IGST (₹)</th>
                    <th className="p-3 font-bold text-brand-forest">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60 bg-white">
                  {result.supportsInterest && !isNilReturn && (
                    <tr>
                      <td className="p-3 font-medium text-brand-charcoal">Tax Liability in Cash</td>
                      <td className="p-3">₹{cgstCash.toLocaleString('en-IN')}</td>
                      <td className="p-3">₹{sgstCash.toLocaleString('en-IN')}</td>
                      <td className="p-3">₹{igstCash.toLocaleString('en-IN')}</td>
                      <td className="p-3 font-semibold">₹{(cgstCash + sgstCash + igstCash).toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="p-3 font-medium text-brand-charcoal">
                      Late Fee (Sec 47)
                      <span className="block text-[10px] text-brand-muted">
                        ₹{result.lateFee.dailyRatePerAct}/day capped at ₹{result.lateFee.statutoryCapPerAct}
                      </span>
                    </td>
                    <td className="p-3">₹{result.lateFee.cgstLateFee.toLocaleString('en-IN')}</td>
                    <td className="p-3">₹{result.lateFee.sgstLateFee.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-brand-muted">₹0 (N/A)</td>
                    <td className="p-3 font-semibold text-brand-forest">₹{result.lateFee.totalLateFee.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-brand-charcoal">
                      Interest (Sec 50 @ 18% p.a.)
                      <span className="block text-[10px] text-brand-muted">
                        {result.supportsInterest
                          ? `Pro-rata for ${result.delayInDays} days on net cash tax`
                          : 'Not applicable to this return type'}
                      </span>
                    </td>
                    <td className="p-3">
                      {result.supportsInterest ? `₹${result.interest.cgstInterest.toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td className="p-3">
                      {result.supportsInterest ? `₹${result.interest.sgstInterest.toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td className="p-3">
                      {result.supportsInterest ? `₹${result.interest.igstInterest.toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td className="p-3 font-semibold text-brand-forest">
                      {result.supportsInterest ? `₹${result.interest.totalInterest.toLocaleString('en-IN')}` : '₹0 (N/A)'}
                    </td>
                  </tr>
                  <tr className="bg-brand-surface font-bold border-t-2 border-brand-border">
                    <td className="p-3 text-brand-forest">Total Payable</td>
                    <td className="p-3">
                      ₹{(result.lateFee.cgstLateFee + (result.supportsInterest ? result.interest.cgstInterest + (isNilReturn ? 0 : cgstCash) : 0)).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      ₹{(result.lateFee.sgstLateFee + (result.supportsInterest ? result.interest.sgstInterest + (isNilReturn ? 0 : sgstCash) : 0)).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3">
                      ₹{(result.supportsInterest ? result.interest.igstInterest + (isNilReturn ? 0 : igstCash) : 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-sm text-brand-forest">₹{result.totalPayableLiability.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-brand-surface/40 p-4 rounded-xl border border-brand-border">
              <div className="text-xs text-brand-muted leading-tight">
                <span className="font-bold text-brand-forest block">Received GST Notice (ASMT-10 or DRC-01A)?</span>
                Consult CA Kavitha Vijay for reconciling ITC and replying to departmental notices.
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

        {/* Statutory Disclaimer */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="font-semibold text-amber-950">Statutory Notice: </strong>
            GST portal auto-populates late fees in the subsequent return period. Interest under Section 50 is statutory and must be self-assessed and paid in GSTR-3B Table 5.1. Always confirm net tax liabilities with official GSTN ledger balances before filing.
          </div>
        </div>
      </div>
    </div>
  );
};
