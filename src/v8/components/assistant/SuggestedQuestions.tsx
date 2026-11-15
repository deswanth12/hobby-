import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  disabled?: boolean;
}

interface StatutorySuggestion {
  id: string;
  category: 'tax-gst' | 'audit-mca' | 'cfo-rera' | 'credentials';
  badge: string;
  label: string;
  query: string;
}

const STATUTORY_SUGGESTIONS: StatutorySuggestion[] = [
  // Direct Tax
  {
    id: 'dt-1',
    category: 'tax-gst',
    badge: 'IT Act 1961',
    label: 'Direct Tax & Scrutiny Advisory',
    query: 'What income tax services and scrutiny assessment representation does the firm provide?'
  },
  {
    id: 'dt-2',
    category: 'tax-gst',
    badge: 'Sec 44AB',
    label: 'Tax Audit & Section 44AB',
    query: 'Do you handle Tax Audits under Section 44AB of the Income Tax Act?'
  },
  // Indirect Tax / GST
  {
    id: 'gst-1',
    category: 'tax-gst',
    badge: 'CGST Act 2017',
    label: 'GST Returns & 2B Reconciliation',
    query: 'Can you help with GST return filing and audit reconciliation?'
  },
  {
    id: 'gst-2',
    category: 'tax-gst',
    badge: 'GSTR-9 / 9C',
    label: 'GST Annual Return & Certification',
    query: 'Is there a published guide on GST Annual Returns GSTR-9 and GSTR-9C?'
  },
  // Statutory Audit & Assurance
  {
    id: 'audit-1',
    category: 'audit-mca',
    badge: 'Companies Act Sec 139',
    label: 'Statutory Company Audits',
    query: 'Does the firm handle statutory company audits?'
  },
  {
    id: 'audit-2',
    category: 'audit-mca',
    badge: 'Standards on Auditing',
    label: 'Audit Framework & Standards',
    query: 'What is the statutory framework for your audit services?'
  },
  // Corporate Law & MCA
  {
    id: 'mca-1',
    category: 'audit-mca',
    badge: 'MCA V3 / SPICe+',
    label: 'Company & LLP Incorporation',
    query: 'Does the firm offer company incorporation and ROC filings?'
  },
  // Virtual CFO
  {
    id: 'cfo-1',
    category: 'cfo-rera',
    badge: 'Virtual CFO',
    label: 'Virtual CFO & Cash Flow Steering',
    query: 'What is Virtual CFO advisory?'
  },
  // RERA Certifications
  {
    id: 'rera-1',
    category: 'cfo-rera',
    badge: 'RERA Act 2016',
    label: 'RERA Form 3 & Escrow Monitoring',
    query: 'Does the firm provide RERA registration and CA certifications?'
  },
  // Credentials & Chambers
  {
    id: 'cred-1',
    category: 'credentials',
    badge: 'AIR 49 (ICMAI)',
    label: 'Managing Partner Qualifications',
    query: 'What are CA Kavitha Vijay qualifications and credentials?'
  },
  {
    id: 'cred-2',
    category: 'credentials',
    badge: 'Tirupati Chambers',
    label: 'Chambers Desk & Coordinates',
    query: 'Where are the chambers of Kavitha & Associates located?'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Practice Areas' },
  { id: 'tax-gst', label: 'Direct Tax & GST' },
  { id: 'audit-mca', label: 'Audit & Corporate' },
  { id: 'cfo-rera', label: 'Virtual CFO & RERA' },
  { id: 'credentials', label: 'Credentials & Chambers' }
] as const;

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelectQuestion, disabled = false }) => {
  const [activeTab, setActiveTab] = useState<typeof CATEGORIES[number]['id']>('all');

  const filtered = activeTab === 'all'
    ? STATUTORY_SUGGESTIONS
    : STATUTORY_SUGGESTIONS.filter((s) => s.category === activeTab);

  return (
    <div className="py-2 space-y-2 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7E5E1E] uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-[#B49A64]" />
          <span>Statutory Practice Inquiries:</span>
        </div>
        <span className="text-[10px] text-[#AAB4A0] font-medium hidden sm:inline">
          Tap to inquire
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            disabled={disabled}
            onClick={() => setActiveTab(cat.id)}
            className={`px-2.5 py-1.5 min-h-[32px] rounded-md font-medium whitespace-nowrap transition-colors border ${
              activeTab === cat.id
                ? 'bg-[#071B14] text-[#F1EBDD] border-[#071B14]'
                : 'bg-white text-[#5C4033] border-[#D8D0BE] hover:border-[#B49A64]'
            } disabled:opacity-50`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {filtered.map((item) => (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectQuestion(item.query)}
            className="group flex flex-col items-start justify-between gap-1 p-2 sm:p-2.5 min-h-[48px] rounded-lg bg-white hover:bg-[#FAF7F0] text-left border border-[#D8D0BE]/80 hover:border-[#B49A64] transition-all shadow-2xs hover:shadow-xs disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-mono tracking-wide px-1.5 py-0.5 rounded-sm bg-[#FAF7F0] group-hover:bg-[#F1EBDD] text-[#7E5E1E] border border-[#B49A64]/30 font-semibold">
                {item.badge}
              </span>
              <span className="text-[10px] text-[#AAB4A0] group-hover:text-[#B49A64] transition-colors">
                Ask →
              </span>
            </div>
            <span className="text-xs font-semibold text-[#183529] group-hover:text-[#071B14] leading-snug">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQuestions;
