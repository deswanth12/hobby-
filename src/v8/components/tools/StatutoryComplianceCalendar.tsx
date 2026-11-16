import React, { useState } from 'react';
import { AlertTriangle, Download, ShieldCheck, MessageSquare } from 'lucide-react';

export interface StatutoryDeadline {
  id: string;
  day: number;
  month: string; // e.g. "Monthly", "Quarterly", "Annual"
  category: 'GST' | 'Direct Tax' | 'Corporate' | 'Labor';
  title: string;
  statute: string;
  applicableTo: string;
  consequence: string;
  urgency: 'critical' | 'standard';
}

export const STATUTORY_DEADLINES: StatutoryDeadline[] = [
  {
    id: 'tds-monthly-deposit',
    day: 7,
    month: 'Monthly',
    category: 'Direct Tax',
    title: 'Monthly TDS / TCS Tax Deposit',
    statute: 'Section 200(1) & Rule 30, Income Tax Act, 1961',
    applicableTo: 'All corporate and non-corporate deductors (Form 281)',
    consequence: 'Interest @ 1.5% per month on delayed tax payment under Section 201(1A)',
    urgency: 'critical',
  },
  {
    id: 'gstr-1-monthly',
    day: 11,
    month: 'Monthly',
    category: 'GST',
    title: 'GSTR-1 Monthly Return (Outward Supplies)',
    statute: 'Section 37 read with Rule 59, CGST Act, 2017',
    applicableTo: 'Registered regular taxpayers with turnover > ₹5 Cr or monthly filers',
    consequence: 'Late fee ₹50/day (₹20/day for nil returns) + blocks buyer ITC in GSTR-2B',
    urgency: 'critical',
  },
  {
    id: 'pf-esi-monthly',
    day: 15,
    month: 'Monthly',
    category: 'Labor',
    title: 'PF & ESI Statutory Remittance',
    statute: 'EPF Act, 1952 & ESI Act, 1948 read with Income Tax Sec 36(1)(va)',
    applicableTo: 'All establishments covered under EPF and ESI regulations',
    consequence: 'Permanent disallowance of employee contribution under Section 36(1)(va) if delayed',
    urgency: 'critical',
  },
  {
    id: 'advance-tax-q3',
    day: 15,
    month: 'Quarterly (Jun/Sep/Dec/Mar)',
    category: 'Direct Tax',
    title: 'Advance Tax Installment (Sec 208/211)',
    statute: 'Section 208 read with Section 211, Income Tax Act, 1961',
    applicableTo: 'All assessees whose estimated annual tax liability exceeds ₹10,000',
    consequence: 'Mandatory penal interest @ 1% per month under Section 234B and 234C',
    urgency: 'critical',
  },
  {
    id: 'gstr-3b-monthly',
    day: 20,
    month: 'Monthly',
    category: 'GST',
    title: 'GSTR-3B Monthly Return & Tax Payment',
    statute: 'Section 39 read with Rule 61, CGST Act, 2017',
    applicableTo: 'All registered GST regular taxpayers filing monthly',
    consequence: 'Interest @ 18% p.a. on net cash tax liability under Section 50(1) + late fee',
    urgency: 'critical',
  },
  {
    id: 'dir-3-kyc-annual',
    day: 30,
    month: 'Annual (30 Sept)',
    category: 'Corporate',
    title: 'Director KYC (Form DIR-3 KYC / Web)',
    statute: 'Rule 12A, Companies (Appointment of Directors) Rules, 2014',
    applicableTo: 'Every individual holding a Director Identification Number (DIN)',
    consequence: 'Immediate deactivation of DIN + mandatory statutory fee of ₹5,000 for reactivation',
    urgency: 'standard',
  },
  {
    id: 'corporate-itr-tax-audit',
    day: 31,
    month: 'Annual (31 Oct)',
    category: 'Direct Tax',
    title: 'Corporate ITR & Tax Audit Report Filing',
    statute: 'Section 44AB read with Section 139(1), Income Tax Act, 1961',
    applicableTo: 'Companies, audited LLPs, and businesses with turnover > ₹10 Cr (cash <= 5%)',
    consequence: 'Penalty under Section 271B (0.5% of turnover up to ₹1.5 Lakhs) for failure to audit',
    urgency: 'critical',
  },
  {
    id: 'gstr-9-annual',
    day: 31,
    month: 'Annual (31 Dec)',
    category: 'GST',
    title: 'GST Annual Return & Reconciliation (GSTR-9/9C)',
    statute: 'Section 44 read with Rule 80, CGST Act, 2017',
    applicableTo: 'Registered taxpayers with aggregate turnover exceeding statutory threshold',
    consequence: 'Statutory late fee of ₹200/day subject to 0.5% of turnover in state',
    urgency: 'standard',
  },
];

export const StatutoryComplianceCalendar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'GST', 'Direct Tax', 'Corporate', 'Labor'];

  const filteredDeadlines = selectedCategory === 'All'
    ? STATUTORY_DEADLINES
    : STATUTORY_DEADLINES.filter(d => d.category === selectedCategory);

  const generateICS = (deadline: StatutoryDeadline) => {
    const title = `Statutory Compliance: ${deadline.title}`;
    const description = `${deadline.statute}\\nApplicable To: ${deadline.applicableTo}\\nConsequence: ${deadline.consequence}`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Kavitha and Associates//Statutory Compliance Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${deadline.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getWhatsAppLink = (deadline: StatutoryDeadline) => {
    const text = `Hello CA Kavitha Vijay, I am reviewing upcoming statutory deadlines on your website. I need professional assistance from your chambers regarding "${deadline.title}" (${deadline.statute}). Please let me know the documentation required.`;
    return `https://wa.me/919626350900?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] p-6 sm:p-8 shadow-card card-parchment-bevel relative overflow-hidden">
      {/* Top Metallic Hairline */}
      <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/60 to-transparent" aria-hidden="true" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-6 border-b border-[#D8D0BE]/80 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-[#7E5E1E] bg-[#FFF6E8] px-2.5 py-0.5 rounded-md border border-[#D8D0BE]">
              STATUTORY DEADLINES
            </span>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#183529] text-white text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
              <span>FY 2026-27 Compliance Cycle</span>
            </div>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#35271F] tracking-tight">
            Statutory Compliance Calendar &amp; Regulatory Deadlines
          </h3>
          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-1">
            Authoritative filing dates, statutory interest calculations, and penalty prevention under Indian corporate, GST, and direct tax statutes.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap p-1 bg-[#F1EBDD] rounded-xl border border-[#D8D0BE] select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all min-h-[36px] ${
                selectedCategory === cat
                  ? 'bg-[#183529] text-[#F1EBDD] shadow-xs'
                  : 'text-[#525954] hover:text-[#183529] hover:bg-[#FAF7F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Deadlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredDeadlines.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-5 rounded-xl bg-white border border-[#D8D0BE] hover:border-[#B49A64] hover:shadow-[0_8px_24px_rgba(180,154,100,0.15)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Urgency indicator strip */}
            <div
              className={`absolute top-0 left-0 bottom-0 w-1 ${
                item.urgency === 'critical' ? 'bg-[#7E5E1E]' : 'bg-[#183529]'
              }`}
              aria-hidden="true"
            />

            <div>
              {/* Top Line: Date Badge & Category */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold text-[#183529] bg-[#F1EBDD] px-2.5 py-0.5 rounded-md border border-[#D8D0BE] leading-tight">
                    {item.day}th
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-[#7E5E1E] uppercase">
                    {item.month}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF7F0] text-[#35271F] border border-[#D8D0BE]">
                  {item.category}
                </span>
              </div>

              {/* Title & Statute */}
              <h4 className="font-serif text-base font-bold text-[#35271F] group-hover:text-[#183529] transition-colors leading-snug">
                {item.title}
              </h4>
              <p className="font-mono text-[10px] text-[#7E5E1E] mt-0.5 leading-tight font-semibold">
                {item.statute}
              </p>

              {/* Applicable Entity */}
              <p className="font-editorial-body text-xs text-[#525954] mt-2 leading-relaxed">
                <strong className="text-[#35271F]">Applies to:</strong> {item.applicableTo}
              </p>

              {/* Risk / Penalty consequence note */}
              <div className="mt-2.5 p-2 rounded-lg bg-[#FFF9EF] border border-[#E8D5B5] flex items-start gap-1.5 text-[11px] text-[#7E5E1E] leading-snug">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#7E5E1E]" />
                <span><strong>Statutory Exposure:</strong> {item.consequence}</span>
              </div>
            </div>

            {/* Action Row */}
            <div className="mt-4 pt-3 border-t border-[#D8D0BE]/60 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                onClick={() => generateICS(item)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#525954] hover:text-[#183529] transition-colors min-h-[36px] py-1 px-2.5 rounded-md hover:bg-[#F1EBDD]"
                title="Download .ics event to sync with calendar"
              >
                <Download className="w-3.5 h-3.5 text-[#B49A64]" />
                <span>Sync to Calendar</span>
              </button>

              <a
                href={getWhatsAppLink(item)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#183529] hover:text-[#7E5E1E] bg-[#F1EBDD]/80 hover:bg-[#F1EBDD] border border-[#D8D0BE] px-3 py-1.5 rounded-lg transition-all min-h-[36px]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#183529]" />
                <span>Consult Chambers Desk</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Notice */}
      <div className="mt-6 pt-4 border-t border-[#D8D0BE] flex flex-col sm:flex-row items-center justify-between text-xs text-[#525954] gap-2">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
          <span>Dates verified under CBDT, CBIC, and MCA official statutory notifications.</span>
        </span>
        <span className="font-mono text-[11px] text-[#7E5E1E]">
          Sole registered chambers in Tirupati · Pan-India E-filings
        </span>
      </div>
    </div>
  );
};

export default StatutoryComplianceCalendar;
