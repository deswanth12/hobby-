import React, { useState } from 'react';
import { Clock, ShieldCheck } from 'lucide-react';

interface ComplianceEvent {
  period: string;
  deadline: string;
  title: string;
  act: string;
  category: 'tax' | 'gst' | 'corporate' | 'audit';
  description: string;
}

const COMPLIANCE_SCHEDULE: ComplianceEvent[] = [
  {
    period: 'Q1 • June 15, 2026',
    deadline: '15 June 2026',
    title: 'First Installment of Advance Tax (15%)',
    act: 'Income Tax Act, 1961 • Section 211',
    category: 'tax',
    description: 'Applicable to corporate and non-corporate assessees whose estimated net tax liability for FY 2026-27 exceeds ₹10,000.'
  },
  {
    period: 'Monthly • 11th & 20th',
    deadline: '11th & 20th Monthly',
    title: 'GSTR-1 & GSTR-3B Monthly Return Filings',
    act: 'CGST Act, 2017 • Rules 59 & 61',
    category: 'gst',
    description: 'Monthly outward supplies return (GSTR-1 by 11th) and monthly summary return with tax payment (GSTR-3B by 20th).'
  },
  {
    period: 'Q1 • July 31, 2026',
    deadline: '31 July 2026',
    title: 'Q1 TDS Returns (Form 24Q & 26Q) & Non-Audit ITRs',
    act: 'Income Tax Act, 1961 • Rule 31A',
    category: 'tax',
    description: 'Quarterly statement of tax deducted at source for salaries (24Q) and non-salaries (26Q), and ITRs for non-audit individuals/entities.'
  },
  {
    period: 'Q2 • Sept 15, 2026',
    deadline: '15 September 2026',
    title: 'Second Installment of Advance Tax (45% Cumulative)',
    act: 'Income Tax Act, 1961 • Section 211',
    category: 'tax',
    description: 'Cumulative payment of 45% of estimated net tax liability for the financial year.'
  },
  {
    period: 'Annual • Sept 30, 2026',
    deadline: '30 September 2026',
    title: 'Statutory Tax Audit (Form 3CA/3CD or 3CB/3CD) & DIR-3 KYC',
    act: 'Income Tax Act • Sec 44AB & Companies Act • Sec 153',
    category: 'audit',
    description: 'Mandatory e-filing of Tax Audit reports for businesses exceeding turnover thresholds (₹10 Cr digital / ₹1 Cr standard) and annual Director KYC.'
  },
  {
    period: 'Annual • Oct 30, 2026',
    deadline: '30 October 2026',
    title: 'MCA Form AOC-4 (Financial Statements Filing)',
    act: 'Companies Act, 2013 • Section 137',
    category: 'corporate',
    description: 'E-filing of audited balance sheet, profit & loss statement, board report, and auditor’s report with MCA within 30 days of AGM.'
  },
  {
    period: 'Annual • Nov 29, 2026',
    deadline: '29 November 2026',
    title: 'MCA Form MGT-7 / MGT-7A (Annual Return Filing)',
    act: 'Companies Act, 2013 • Section 92',
    category: 'corporate',
    description: 'Annual return filing containing details of shareholding structure, directorship, governance, and indebtedness within 60 days of AGM.'
  },
  {
    period: 'Q3 • Dec 15, 2026',
    deadline: '15 December 2026',
    title: 'Third Installment of Advance Tax (75% Cumulative)',
    act: 'Income Tax Act, 1961 • Section 211',
    category: 'tax',
    description: 'Cumulative payment of 75% of total estimated annual income tax liability.'
  },
  {
    period: 'Q4 • March 15, 2027',
    deadline: '15 March 2027',
    title: 'Final Installment of Advance Tax (100%)',
    act: 'Income Tax Act, 1961 • Section 211',
    category: 'tax',
    description: 'Final 100% settlement of estimated income tax before the fiscal year closing to avoid interest under Sections 234B & 234C.'
  }
];

export const StatutoryCalendar: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'tax' | 'gst' | 'corporate' | 'audit'>('all');

  const filteredEvents = activeFilter === 'all'
    ? COMPLIANCE_SCHEDULE
    : COMPLIANCE_SCHEDULE.filter((ev) => ev.category === activeFilter);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'tax':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'gst':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'corporate':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'audit':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      default:
        return 'bg-brand-pale text-brand-forest border-brand-border';
    }
  };

  return (
    <div className="bg-brand-white rounded-2xl border border-brand-border shadow-card p-6 sm:p-8 lg:p-10 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-border mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-border text-[11px] text-xs font-semibold text-brand-gold font-bold mb-2">
            <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>Statutory Timeline • FY 2026-27</span>
          </div>
          <h3 className="font-editorial-h3 text-2xl font-bold text-brand-forest">
            Statutory Compliance &amp; Regulatory Calendar
          </h3>
          <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-1">
            Official deadlines for Income Tax, GST, Company Law (MCA), and Statutory Audits.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {[
            { id: 'all', label: 'All Dates' },
            { id: 'tax', label: 'Income Tax' },
            { id: 'gst', label: 'GST' },
            { id: 'audit', label: 'Audits' },
            { id: 'corporate', label: 'MCA / ROC' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-brand-forest text-white shadow-xs'
                  : 'bg-brand-surface text-brand-charcoal hover:bg-brand-border/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map((ev, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-brand-border bg-brand-surface/40 hover:bg-brand-surface hover:border-brand-gold/60 transition-colors duration-200 flex flex-col justify-between group card-tactile"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryBadge(ev.category)}`}>
                  {ev.category.toUpperCase()}
                </span>
                <span className="font-editorial-meta text-[11px] font-bold text-gold-dark">
                  {ev.deadline}
                </span>
              </div>

              <h4 className="font-editorial-h3 text-base font-bold text-brand-forest group-hover:text-brand-deep transition-colors mb-1.5">
                {ev.title}
              </h4>

              <p className="font-editorial-body text-xs text-brand-muted leading-relaxed mb-3">
                {ev.description}
              </p>
            </div>

            <div className="pt-2.5 border-t border-brand-border/60 text-[10px] font-mono text-emerald-800 flex items-center justify-between">
              <span>{ev.act}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
