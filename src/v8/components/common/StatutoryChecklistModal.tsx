import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  X, 
  Printer, 
  Share2, 
  Download, 
  ShieldCheck, 
  FileText, 
  Building2, 
  AlertCircle
} from 'lucide-react';
import { FIRM_DATA } from '../../../data/firmData';

export interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'tax' | 'incorporation' | 'gst';
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  statute: string;
}

const TAX_CHECKLIST: ChecklistItem[] = [
  {
    id: 'tax_adv_1',
    label: 'Advance Tax Installments Timetable',
    description: 'Verify 15% (June 15), 45% (Sept 15), 75% (Dec 15), and 100% (March 15) tax liability deposits to prevent Section 234B/234C interest penalties.',
    statute: 'Sections 208, 211, 234B & 234C, Income Tax Act 1961'
  },
  {
    id: 'tax_ais_2',
    label: 'AIS / TIS & Form 26AS Full Reconciliation',
    description: 'Download and reconcile Annual Information Statement (AIS) and Taxpayer Information Summary (TIS) for high-value securities, dividends, and interest.',
    statute: 'Rule 114-I, Income Tax Rules 1962'
  },
  {
    id: 'tax_audit_3',
    label: 'Section 44AB Tax Audit Applicability Assessment',
    description: 'Evaluate gross turnover against ₹1 Crore threshold (or ₹10 Crore threshold for business with digital transactions ≥ 95%).',
    statute: 'Section 44AB read with Section 44AD/44ADA'
  },
  {
    id: 'tax_tds_4',
    label: 'TDS / TCS Purchase & Sale Credit Cross-Check',
    description: 'Cross-verify Section 194Q buyer TDS against seller Section 206C(1H) TCS to avert non-deduction disallowance under Section 40(a)(ia).',
    statute: 'Sections 194Q, 206AB, 206C(1H) & 40(a)(ia)'
  },
  {
    id: 'tax_cap_5',
    label: 'Capital Gains Statutory Exemption Investment Deeds',
    description: 'Review Section 54 / 54EC (REC/PFC/NHAI bonds within 6 months) and Section 54F reinvestment proofs before return filing deadline.',
    statute: 'Sections 54, 54EC & 54F, Income Tax Act 1961'
  },
  {
    id: 'tax_corp_6',
    label: 'Section 115BAA Concessional 22% Corporate Tax Election',
    description: 'Compute comparative tax liability under 22% base rate (effective 25.168%) vs 30% standard rate before filing Form 10-IC.',
    statute: 'Section 115BAA, Income Tax Act 1961'
  }
];

const INCORPORATION_CHECKLIST: ChecklistItem[] = [
  {
    id: 'corp_run_1',
    label: 'RUN Name Availability & Trademark Collision Search',
    description: 'Reserve proposed company name on MCA V3 portal ensuring zero phonetic similarity with registered trademarks under Class 35 or sector class.',
    statute: 'Rule 8, Companies (Incorporation) Rules 2014'
  },
  {
    id: 'corp_dsc_2',
    label: 'Class 3 Digital Signature Certificates (DSC)',
    description: 'Procure cryptographic Class 3 signing credentials with hardware USB crypto-tokens for all proposed directors and designated partners.',
    statute: 'Information Technology Act 2000'
  },
  {
    id: 'corp_spice_3',
    label: 'SPICe+ Part B Unified Incorporation Filing',
    description: 'Draft e-MOA (INC-33), e-AOA (INC-34), and file integrated application bundling CIN, PAN, TAN, EPFO, ESIC, and Profession Tax.',
    statute: 'Section 7(1), Companies Act 2013'
  },
  {
    id: 'corp_bank_4',
    label: 'AGILE-PRO-S Bank Current Account Opening',
    description: 'Execute instant corporate banking linkage with designated scheduled commercial bank under statutory AGILE-PRO-S mandate.',
    statute: 'MCA Notification G.S.R. 128(E)'
  },
  {
    id: 'corp_inc20a_5',
    label: 'Form INC-20A Commencement of Business Certification',
    description: 'File partner-certified Form INC-20A within 180 days with bank subscription receipt proof prior to initiating commercial operations.',
    statute: 'Section 10A, Companies Act 2013'
  },
  {
    id: 'corp_adt1_6',
    label: 'First Statutory Auditor Appointment (Form ADT-1)',
    description: 'Convene Board of Directors meeting within 30 days of incorporation to appoint first statutory auditor under Section 139(6).',
    statute: 'Section 139(6) read with Section 141, Companies Act 2013'
  }
];

const GST_CHECKLIST: ChecklistItem[] = [
  {
    id: 'gst_rec_1',
    label: '4-Way Statutory Reconciliation Protocol',
    description: 'Perform rigorous 4-way matching between GSTR-1 (outward liability), GSTR-3B (monthly tax discharged), GSTR-2B (auto-drafted ITC), and financial ledger.',
    statute: 'Sections 16, 37 & 39, CGST Act 2017'
  },
  {
    id: 'gst_itc_2',
    label: 'Section 16(2)(aa) GSTR-2B ITC Eligibility Audit',
    description: 'Strictly isolate and eliminate invoices missing in supplier GSTR-2B to avoid 24% interest and penalty proceedings under Section 73/74.',
    statute: 'Section 16(2)(aa) read with Rule 36(4), CGST Rules'
  },
  {
    id: 'gst_rcm_3',
    label: 'Reverse Charge Mechanism (RCM) Liability Check',
    description: 'Audit freight (GTA), legal advisory fees, director remunerations, and security services for mandatory cash tax discharge under RCM.',
    statute: 'Notification No. 13/2017-Central Tax (Rate)'
  },
  {
    id: 'gst_int_4',
    label: 'Section 50 Net Cash Interest Self-Computation',
    description: 'Compute statutory interest strictly on net cash ledger liability for delayed returns to avoid overpayment on gross invoice values.',
    statute: 'Section 50(1) Proviso, CGST Act 2017'
  },
  {
    id: 'gst_eway_5',
    label: 'E-Way Bill vs Outward Turnover Verification',
    description: 'Reconcile generated Part A/B E-Way bills with outward invoice register to explain timing differences and transit credits.',
    statute: 'Rule 138, CGST Rules 2017'
  },
  {
    id: 'gst_9_6',
    label: 'GSTR-9 Annual Return & GSTR-9C Readiness',
    description: 'Compile annual turnover breakdown, HSN chapter-level summaries, and ITC break-up for seamless annual statutory filing.',
    statute: 'Section 44, CGST Act read with Rule 80'
  }
];

export const StatutoryChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'tax'
}) => {
  const [activeTab, setActiveTab] = useState<'tax' | 'incorporation' | 'gst'>(defaultTab);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentList = activeTab === 'tax' 
    ? TAX_CHECKLIST 
    : activeTab === 'incorporation' 
      ? INCORPORATION_CHECKLIST 
      : GST_CHECKLIST;

  const currentTabTitle = activeTab === 'tax'
    ? 'FY 2026-27 Income Tax & Advance Tax Due-Date Readiness'
    : activeTab === 'incorporation'
      ? 'Startup & Private Limited (SPICe+) Incorporation Kit'
      : 'GST 4-Way Reconciliation & Annual Audit Readiness';

  const completedCount = currentList.filter(item => checkedItems[item.id]).length;
  const percentage = Math.round((completedCount / currentList.length) * 100);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp review link prefilled with client's checked status
  const pendingItems = currentList.filter(item => !checkedItems[item.id]);
  const waReviewMessage = `Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI have reviewed the *${currentTabTitle}* on your website.\n\nReadiness Score: ${completedCount}/${currentList.length} items (${percentage}% complete).\n\nPending Items requiring Chambers assistance:\n${pendingItems.map((p, idx) => `${idx + 1}. ${p.label}`).join('\n')}\n\nPlease advise on next steps.`;
  const cleanPhone = (FIRM_DATA.contact.primaryPhoneClean || '919626350900').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waReviewMessage)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#071B14]/80 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checklist-title"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#F1EBDD] text-[#183529] rounded-3xl border-2 border-[#B49A64]/60 shadow-2xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#B49A64]/30 bg-[#0B241C] text-[#F1EBDD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#183529] border border-[#B49A64]/40 flex items-center justify-center text-[#B49A64]">
              <CheckSquare className="w-5 h-5 text-[#B49A64]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B49A64]">
                  Statutory Toolkit
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#183529] text-[#B49A64] border border-[#B49A64]/30 font-mono">
                  FY 2026-27
                </span>
              </div>
              <h2 id="checklist-title" className="font-serif text-lg sm:text-xl font-bold text-[#F1EBDD]">
                Statutory Compliance & Due-Date Checklists
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-[#F1EBDD]/80 hover:text-[#B49A64] hover:bg-[#183529] transition-colors"
              title="Print or Save as PDF"
              aria-label="Print or Save Checklist as PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#F1EBDD]/80 hover:text-rose-400 hover:bg-[#183529] transition-colors"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-[#B49A64]/30 bg-[#071B14] px-4 sm:px-6 pt-3 gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('tax')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-t-2 ${
              activeTab === 'tax'
                ? 'bg-[#F1EBDD] text-[#071B14] border-[#B49A64]'
                : 'text-[#D8D0BE] border-transparent hover:text-white hover:bg-[#183529]/40'
            }`}
          >
            <FileText className="w-4 h-4 text-[#B49A64]" />
            <span>Income Tax & Advance Tax</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('incorporation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-t-2 ${
              activeTab === 'incorporation'
                ? 'bg-[#F1EBDD] text-[#071B14] border-[#B49A64]'
                : 'text-[#D8D0BE] border-transparent hover:text-white hover:bg-[#183529]/40'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#B49A64]" />
            <span>Company Incorporation (SPICe+)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gst')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-t-2 ${
              activeTab === 'gst'
                ? 'bg-[#F1EBDD] text-[#071B14] border-[#B49A64]'
                : 'text-[#D8D0BE] border-transparent hover:text-white hover:bg-[#183529]/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
            <span>GST 4-Way Reconciliation</span>
          </button>
        </div>

        {/* Progress Strip */}
        <div className="bg-[#E4DAC7] px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-[#B49A64]/30 text-xs text-[#071B14]">
          <div className="flex items-center gap-2">
            <span className="font-bold">{currentTabTitle}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-[#183529]">
              {completedCount} of {currentList.length} verified ({percentage}%)
            </span>
            <div className="w-20 sm:w-28 h-2 rounded-full bg-[#D8D0BE] overflow-hidden">
              <div 
                className="h-full bg-emerald-700 transition-all duration-300 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist Content Body */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-3 print:overflow-visible">
          {currentList.map((item, idx) => {
            const isChecked = Boolean(checkedItems[item.id]);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-500/40 text-[#071B14]'
                    : 'bg-white/80 border-[#B49A64]/20 hover:border-[#B49A64]/60 text-[#183529]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(item.id)}
                  className="w-5 h-5 mt-0.5 rounded text-emerald-700 focus:ring-[#B49A64] border-gray-300 shrink-0 cursor-pointer"
                  aria-label={item.label}
                />
                <div className="flex-grow min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className={`text-sm sm:text-base font-bold ${isChecked ? 'line-through text-emerald-900/70' : 'text-[#071B14]'}`}>
                      {idx + 1}. {item.label}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A3E37] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-[#8C7648]">
                    <span className="font-semibold text-[#183529]">Statutory Reference:</span> {item.statute}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#B49A64]/30 bg-[#0B241C] flex flex-col sm:flex-row items-center justify-between gap-3 text-[#F1EBDD]">
          <div className="text-xs text-[#D8D0BE] flex items-center gap-2 text-center sm:text-left">
            <AlertCircle className="w-4 h-4 text-[#B49A64] shrink-0" />
            <span>Need independent partner review? CA Kavitha Vijay provides direct statutory certification.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-[#B49A64]/50 bg-[#183529] hover:bg-[#294B39] text-xs font-semibold transition-colors min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Print / Save PDF</span>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B49A64] hover:bg-[#F1EBDD] text-[#071B14] text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] shadow-lg"
            >
              <Share2 className="w-3.5 h-3.5 text-[#071B14]" />
              <span>Submit for CA Review</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatutoryChecklistModal;
