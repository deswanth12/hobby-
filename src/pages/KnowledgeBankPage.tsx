import React, { useState, useCallback } from 'react';
import {
  Calculator,
  ClipboardList,
  BookOpen,
  ExternalLink,
  ChevronRight,
  FileText,
  ShieldCheck,
  Search,
  X,
  CalendarCheck,
  Building2,
  ArrowRight,
  Phone,
  FileCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { StatutoryCalendar } from '../components/StatutoryCalendar';
import { StatutoryEntityAdvisor } from '../components/StatutoryEntityAdvisor';
import { IncomeTaxCalculator } from '../components/knowledge-bank/IncomeTaxCalculator';
import { GSTCalculator } from '../components/knowledge-bank/GSTCalculator';
import { TaxAuditChecker } from '../components/knowledge-bank/TaxAuditChecker';
import { useFirmData } from '../context/FirmDataContext';
import { LetterReveal, WordReveal, BlurReveal, StatCounter } from '../components/animations';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type TabId = 'calculators' | 'tools' | 'portals' | 'checklists' | 'articles';
type CalculatorToolId = 'income-tax' | 'gst' | 'tax-audit';

// ─────────────────────────────────────────────
// Official Government Portals
// ─────────────────────────────────────────────
const EXTRA_PORTALS = [
  {
    name: 'TRACES — TDS Reconciliation',
    authority: 'Central Board of Direct Taxes (CBDT)',
    url: 'https://www.tdscpc.gov.in/',
    purpose: 'TDS/TCS Certificate Download, Compliance Verification & Form 26AS',
  },
  {
    name: 'EPFO — Employees\' Provident Fund',
    authority: 'Ministry of Labour & Employment',
    url: 'https://www.epfindia.gov.in/',
    purpose: 'PF Registration, ECR Filing, UAN Activation & Member Passbook',
  },
  {
    name: 'ESIC — Employee State Insurance',
    authority: 'Ministry of Labour & Employment',
    url: 'https://www.esic.gov.in/',
    purpose: 'ESI Registration, Monthly Contribution Filing & IP Insurance Services',
  },
  {
    name: 'DGFT — Directorate General of Foreign Trade',
    authority: 'Ministry of Commerce & Industry',
    url: 'https://www.dgft.gov.in/',
    purpose: 'Import Export Code (IEC), SEIS/RoDTEP Schemes & Export Licences',
  },
];

// ─────────────────────────────────────────────
// Compliance Checklists
// ─────────────────────────────────────────────
interface ChecklistItem {
  title: string;
  category: string;
  color: string;
  items: string[];
  disclaimer?: string;
  ctaLabel: string;
}

const CHECKLISTS: ChecklistItem[] = [
  {
    title: 'GST Registration — Document Checklist',
    category: 'GST',
    color: 'bg-brand-surface border-brand-border text-brand-forest',
    items: [
      'PAN card of business or proprietor / partners / directors',
      'Aadhaar card of the applicant / authorized signatory',
      'Proof of principal place of business (electricity bill, rent agreement, or NOC)',
      'Bank account details — cancelled cheque or bank statement',
      'Constitution proof: MOA & AOA (Pvt Ltd), partnership deed, or incorporation certificate',
      'Photograph of authorized signatory (JPEG, max 100 KB)',
      'Authorization letter or board resolution for authorized signatory',
      'Digital Signature Certificate (DSC) — mandatory for Companies & LLPs',
    ],
    disclaimer: 'Requirements may vary based on business type and jurisdiction. Verify with current GST portal guidelines before submission.',
    ctaLabel: 'Book GST Registration Consultation',
  },
  {
    title: 'Private Limited Company — Annual Compliance Checklist',
    category: 'Corporate / MCA',
    color: 'bg-brand-deep/10 border-brand-forest/20 text-brand-deep',
    items: [
      'Hold Annual General Meeting (AGM) within 6 months of financial year-end',
      'Prepare and adopt audited financial statements (Balance Sheet & P&L)',
      'File MCA Form AOC-4 (financial statements) within 30 days of AGM',
      'File MCA Form MGT-7 / MGT-7A (annual return) within 60 days of AGM',
      'Conduct Board Meetings (minimum 4 per year, max 120-day gap)',
      'Complete DIR-3 KYC for all directors by 30 September annually',
      'File quarterly Advance Tax installments (June 15, Sept 15, Dec 15, March 15)',
      'File Income Tax Return by 31 October (audit cases) or 31 July (non-audit)',
      'File GSTR-9 (Annual GST Return) and GSTR-9C (Reconciliation Statement)',
      'Statutory Audit under Section 139 of Companies Act, 2013',
    ],
    disclaimer: 'Deadlines are indicative for FY 2026-27. Confirm exact dates with official MCA and Income Tax notifications.',
    ctaLabel: 'Book Annual Compliance Review',
  },
  {
    title: 'Tax Audit Preparation — Checklist',
    category: 'Income Tax / Audit',
    color: 'bg-brand-gold/15 border-brand-gold/40 text-gold-dark',
    items: [
      'Audited financial statements: Trial Balance, P&L, Balance Sheet',
      'Bank statements reconciled with books for all accounts',
      'Cash book and petty cash reconciliation',
      'GST reconciliation: GSTR-2A / 2B vs. books and GSTR-3B data',
      'TDS certificates: Form 16 (salary), Form 16A (non-salary) reconciled with 26AS / AIS',
      'Fixed asset register with depreciation schedules (Schedule II)',
      'Loan account statements and confirmation from lenders',
      'Stock register or inventory valuation as at 31 March',
      'Related party transaction details and arm\'s length justification',
      'Details of expenditures exceeding ₹20,000 (Section 40A(3) compliance)',
    ],
    disclaimer: 'This checklist is a general preparation guide. Your CA will confirm the specific requirements based on your entity type and turnover.',
    ctaLabel: 'Schedule Tax Audit Consultation',
  },
  {
    title: 'AP RERA CA Certificate — Preparation Checklist',
    category: 'RERA / Real Estate',
    color: 'bg-forest-50 border-forest-200 text-brand-forest',
    items: [
      'RERA registration certificate and project ID',
      'Project cost statement: land cost + construction cost + other development costs',
      'Bank statements of the designated RERA escrow account (70% fund)',
      'Invoices and payment vouchers for all project expenditures to date',
      'Architect\'s certificate of percentage of completion (physical progress)',
      'Booking agreements and collection receipts from allottees',
      'Receivables statement with outstanding collection summary',
      'Previous Form 3 certificates issued (if any)',
      'Audited accounts of the promoter entity for previous FY',
    ],
    disclaimer: 'RERA regulations vary by project type. CA Kavitha Vijay will confirm the exact documentation based on AP RERA guidelines for your project.',
    ctaLabel: 'Book RERA Certificate Consultation',
  },
];

// ─────────────────────────────────────────────
// Tab definitions
// ─────────────────────────────────────────────
const TABS: { id: TabId; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'calculators', label: 'Tax Calculators & Tools', shortLabel: 'Calculators', icon: Calculator },
  { id: 'tools', label: 'Compliance Schedules', shortLabel: 'Tools', icon: CalendarCheck },
  { id: 'portals', label: 'Official Portals', shortLabel: 'Portals', icon: ExternalLink },
  { id: 'checklists', label: 'Checklists', shortLabel: 'Checklists', icon: ClipboardList },
  { id: 'articles', label: 'Articles & Updates', shortLabel: 'Articles', icon: BookOpen },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

/** Pill tab bar */
const TabBar: React.FC<{ active: TabId; onSelect: (id: TabId) => void }> = ({ active, onSelect }) => (
  <div
    role="tablist"
    aria-label="Knowledge Bank sections"
    className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth"
  >
    {TABS.map((tab) => {
      const Icon = tab.icon;
      const isActive = tab.id === active;
      return (
        <button
          key={tab.id}
          role="tab"
          type="button"
          id={`kb-tab-${tab.id}`}
          aria-controls={`kb-panel-${tab.id}`}
          aria-selected={isActive}
          onClick={() => onSelect(tab.id)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
            isActive
              ? 'bg-brand-forest text-white border-brand-forest shadow-sm'
              : 'bg-white text-brand-charcoal border-brand-border hover:bg-brand-surface hover:border-brand-gold/40'
          }`}
        >
          <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-gold' : 'text-brand-muted'}`} aria-hidden="true" />
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.shortLabel}</span>
        </button>
      );
    })}
  </div>
);

/** Official portal card */
const PortalCard: React.FC<{
  name: string;
  authority: string;
  url: string;
  purpose: string;
}> = ({ name, authority, url, purpose }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="card-editorial p-5 sm:p-6 flex flex-col justify-between gap-3 group focus-visible:ring-2 focus-visible:ring-brand-forest focus-visible:outline-none"
    aria-label={`Visit ${name} — opens official portal in a new tab`}
  >
    <div>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center shrink-0 group-hover:border-brand-gold/50 group-hover:bg-brand-gold/10 transition-colors">
          <ExternalLink className="w-4 h-4 text-brand-forest group-hover:text-gold-dark transition-colors" aria-hidden="true" />
        </div>
        <span className="badge-editorial-gold text-[10px]">
          Official Portal
        </span>
      </div>
      <h3 className="font-editorial-h3 text-sm sm:text-base font-bold text-brand-forest group-hover:text-brand-deep transition-colors leading-snug">
        {name}
      </h3>
      <p className="font-editorial-meta text-[10px] font-semibold text-gold-dark mt-1 uppercase tracking-wider">
        {authority}
      </p>
      <p className="font-editorial-body text-xs text-brand-muted leading-relaxed mt-2.5">
        {purpose}
      </p>
    </div>
    <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-[11px] font-semibold text-brand-forest group-hover:text-gold-dark transition-colors">
      <span>Launch Official Portal</span>
      <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </div>
  </a>
);

/** Checklist accordion card */
const ChecklistCard: React.FC<{ checklist: ChecklistItem; firmData: any }> = ({ checklist, firmData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappMsg = encodeURIComponent(
    `Hello, I need help with ${checklist.title}. Could you guide me?`
  );
  const whatsappHref = `https://wa.me/${firmData.contact.whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden hover:border-brand-gold/40 transition-[border-color] duration-200">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-3 cursor-pointer group focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-forest focus-visible:outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${checklist.color}`}>
            {checklist.category}
          </div>
          <h3 className="font-editorial-h3 text-base font-bold text-brand-forest group-hover:text-brand-deep transition-colors leading-snug">
            {checklist.title}
          </h3>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-brand-muted shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-90 text-brand-forest' : ''}`}
          aria-hidden="true"
        />
      </button>

      {/* Expanded body */}
      {isOpen && (
        <div className="px-5 sm:px-6 pb-6 border-t border-brand-border/60">
          <ul className="mt-4 space-y-2.5" role="list">
            {checklist.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
                <span className="font-editorial-body text-xs text-brand-charcoal/90 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          {checklist.disclaimer && (
            <p className="mt-4 text-[11px] text-brand-muted bg-brand-surface border border-brand-border rounded-lg px-3.5 py-2.5 leading-relaxed">
              <strong className="font-semibold text-brand-forest">Note:</strong> {checklist.disclaimer}
            </p>
          )}

          <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-brand-forest text-white text-xs font-semibold hover:bg-brand-deep transition-colors min-h-[40px]"
            >
              {checklist.ctaLabel}
              <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-emerald-600/40 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold transition-colors min-h-[40px]"
            >
              <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export const KnowledgeBankPage: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const [activeTab, setActiveTab] = useState<TabId>('calculators');
  const [activeCalculator, setActiveCalculator] = useState<CalculatorToolId>('income-tax');
  const [searchQuery, setSearchQuery] = useState('');

  const handleTabSelect = useCallback((id: TabId) => {
    setActiveTab(id);
    setSearchQuery('');
  }, []);

  const clearSearch = useCallback(() => setSearchQuery(''), []);

  // All portals combined
  const allPortals = [...(FIRM_DATA.officialPortals || []), ...EXTRA_PORTALS];

  // Filter portals by search
  const filteredPortals =
    activeTab === 'portals' && searchQuery.trim().length > 1
      ? allPortals.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.purpose.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allPortals;

  // JSON-LD: BreadcrumbList + WebPage + WebApplication
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kavithaassociates.com/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Knowledge Bank',
          item: 'https://kavithaassociates.com/knowledge-bank',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Tax Calculators & Compliance Resources | Kavitha & Associates, Tirupati',
      description:
        'Functional Income Tax Calculator (Old vs New Regime), GST Late Fee & Interest Calculator, Tax Audit Applicability Checker, official portals, and compliance checklists for Tirupati and Andhra Pradesh.',
      url: 'https://kavithaassociates.com/knowledge-bank',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Kavitha & Associates Tax & Compliance Calculation Suite',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Works on all modern web browsers.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
      },
      featureList: [
        'Income Tax Comparison (Old vs New Regime FY 2025-26 / FY 2024-25)',
        'Section 87A Rebate and Marginal Relief Calculation',
        'GST Late Fee under Section 47 with Notification 19/2021-CT Caps',
        'GST Interest under Section 50 at 18% per annum on Net Cash Liability',
        'Section 44AB Tax Audit Applicability 5% Digital Transaction Assessment',
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title="Tax Calculators & Compliance Resources | CA Kavitha & Associates Tirupati"
        description="Functional Income Tax Calculator (Old vs New Regime), GST Late Fee & Interest Calculator, Section 44AB Tax Audit Checker, statutory calendar, and checklists for businesses in Tirupati, Andhra Pradesh."
        canonicalPath="/knowledge-bank"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Knowledge Bank', path: '/knowledge-bank' },
        ]}
        jsonLd={jsonLd}
      />

      {/* ── Page Hero ── */}
      <section className="bg-brand-forest text-brand-white pt-16 pb-14 sm:pt-20 sm:pb-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300/80">
              <li>
                <Link to="/" className="hover:text-brand-gold transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3 h-3 text-emerald-500/60" />
              </li>
              <li aria-current="page" className="text-brand-gold">
                Knowledge Bank
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-xs font-semibold mb-5">
              <BookOpen className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span><LetterReveal text="Tax & Compliance Resource Hub" /></span>
            </div>

            <h1 className="font-editorial-h1 text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-ivory leading-tight mb-5">
              <WordReveal text="Knowledge Bank" />
            </h1>

            <BlurReveal>
              <p className="font-editorial-body text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                Functional calculators, diagnostic tools, statutory timelines, official government portals, and
                checklists — built for businesses, professionals, and taxpayers in Tirupati and across Andhra Pradesh.
              </p>
            </BlurReveal>

            {/* Stats strip */}
            <div className="mt-8 flex flex-wrap gap-6">
              {[
                { value: 3, label: 'Functional Tax Engines' },
                { value: 2, label: 'Statutory Diagnostic Tools' },
                { value: 9, label: 'Official Portals' },
                { value: 4, label: 'Compliance Checklists' },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="font-serif text-2xl font-bold text-brand-gold">
                    <StatCounter value={stat.value} />
                  </div>
                  <div className="text-[11px] text-emerald-200/80 font-medium leading-tight mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky Tab Bar ── */}
      <div className="sticky top-[57px] z-30 bg-brand-ivory/95 backdrop-blur-md border-b border-brand-border shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <TabBar active={activeTab} onSelect={handleTabSelect} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="bg-brand-ivory min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          {/* ── CALCULATORS & ENGINES PANEL ── */}
          <div
            id="kb-panel-calculators"
            role="tabpanel"
            aria-labelledby="kb-tab-calculators"
            hidden={activeTab !== 'calculators'}
          >
            {activeTab === 'calculators' && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-editorial-h2 text-3xl sm:text-4xl font-bold text-brand-forest mb-2">
                    Functional Tax &amp; Compliance Engines
                  </h2>
                  <p className="font-editorial-body text-sm text-brand-muted max-w-2xl">
                    Select a tool below to run live statutory calculations for Income Tax, GST late filing, or Tax Audit applicability under current legislation.
                  </p>
                </div>

                {/* Sub-tool Selector Bar */}
                <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-brand-border">
                  {[
                    { id: 'income-tax' as const, label: 'Income Tax Calculator (Old vs New)', icon: Calculator },
                    { id: 'gst' as const, label: 'GST Late Fee & Interest (Sec 47 & 50)', icon: Calculator },
                    { id: 'tax-audit' as const, label: 'Tax Audit Applicability (Sec 44AB)', icon: FileCheck },
                  ].map((tool) => {
                    const ToolIcon = tool.icon;
                    const isSelected = activeCalculator === tool.id;
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => setActiveCalculator(tool.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-brand-forest text-white border-brand-forest shadow-xs'
                            : 'bg-white text-brand-charcoal border-brand-border hover:bg-brand-surface'
                        }`}
                      >
                        <ToolIcon className={`w-4 h-4 ${isSelected ? 'text-brand-gold' : 'text-brand-muted'}`} />
                        <span>{tool.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Tool Render */}
                <div className="animate-fadeIn">
                  {activeCalculator === 'income-tax' && <IncomeTaxCalculator />}
                  {activeCalculator === 'gst' && <GSTCalculator />}
                  {activeCalculator === 'tax-audit' && <TaxAuditChecker />}
                </div>
              </div>
            )}
          </div>

          {/* ── COMPLIANCE TOOLS PANEL (CALENDAR & ENTITY ADVISOR) ── */}
          <div
            id="kb-panel-tools"
            role="tabpanel"
            aria-labelledby="kb-tab-tools"
            hidden={activeTab !== 'tools'}
          >
            {activeTab === 'tools' && (
              <div className="space-y-12">
                {/* Statutory Calendar */}
                <div>
                  <div className="mb-6">
                    <h2 className="font-editorial-h2 text-3xl sm:text-4xl font-bold text-brand-forest mb-2">
                      Statutory Compliance Calendar
                    </h2>
                    <p className="font-editorial-body text-sm text-brand-muted max-w-2xl">
                      Key income tax, GST, corporate law (MCA), and audit deadlines for FY 2026-27.
                    </p>
                  </div>
                  <StatutoryCalendar />
                </div>

                {/* Entity Advisor */}
                <div>
                  <div className="mb-6">
                    <h2 className="font-editorial-h2 text-3xl sm:text-4xl font-bold text-brand-forest mb-2">
                      Entity Compliance Advisor
                    </h2>
                    <p className="font-editorial-body text-sm text-brand-muted max-w-2xl">
                      Select your business structure to review mandatory audits, regulatory filings, and partner
                      deliverables executed under CA Kavitha Vijay (B.Com, CA, CMA AIR 49).
                    </p>
                  </div>
                  <StatutoryEntityAdvisor />
                </div>
              </div>
            )}
          </div>

          {/* ── PORTALS PANEL ── */}
          <div
            id="kb-panel-portals"
            role="tabpanel"
            aria-labelledby="kb-tab-portals"
            hidden={activeTab !== 'portals'}
          >
            {activeTab === 'portals' && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <h2 className="font-editorial-h2 text-3xl sm:text-4xl font-bold text-brand-forest mb-2">
                      Official Government Portals
                    </h2>
                    <p className="font-editorial-body text-sm text-brand-muted max-w-xl">
                      Direct links to 9 official government and regulatory portals. All links open directly on official
                      government domains.
                    </p>
                  </div>

                  {/* Search input */}
                  <div className="relative w-full sm:w-72 shrink-0">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="search"
                      placeholder="Search portals…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 rounded-full border border-brand-border bg-white text-xs font-medium text-brand-charcoal placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-forest focus:border-brand-forest transition-colors"
                      aria-label="Search official portals"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-charcoal"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {filteredPortals.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPortals.map((portal) => (
                      <PortalCard
                        key={portal.url}
                        name={portal.name}
                        authority={portal.authority}
                        url={portal.url}
                        purpose={portal.purpose}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-brand-muted">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-40" aria-hidden="true" />
                    <p className="text-sm font-medium">No portals match "{searchQuery}"</p>
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="mt-2 text-xs text-brand-forest hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}

                <p className="mt-6 text-[11px] text-brand-muted text-center">
                  All portals link directly to official government domains. Kavitha &amp; Associates does not control
                  third-party website content.
                </p>
              </>
            )}
          </div>

          {/* ── CHECKLISTS PANEL ── */}
          <div
            id="kb-panel-checklists"
            role="tabpanel"
            aria-labelledby="kb-tab-checklists"
            hidden={activeTab !== 'checklists'}
          >
            {activeTab === 'checklists' && (
              <>
                <div className="mb-8">
                  <h2 className="font-editorial-h2 text-3xl sm:text-4xl font-bold text-brand-forest mb-2">
                    Compliance Checklists
                  </h2>
                  <p className="font-editorial-body text-sm text-brand-muted max-w-2xl">
                    Document checklists and preparation guides for common engagements. Expand each checklist to review
                    the required documents before filing.
                  </p>
                </div>
                <div className="space-y-4">
                  {CHECKLISTS.map((cl) => (
                    <ChecklistCard key={cl.title} checklist={cl} firmData={FIRM_DATA} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── ARTICLES PANEL ── */}
          <div
            id="kb-panel-articles"
            role="tabpanel"
            aria-labelledby="kb-tab-articles"
            hidden={activeTab !== 'articles'}
          >
            {activeTab === 'articles' && (
              <>
                <div className="mb-8">
                  <h2 className="font-editorial-h2 text-3xl sm:text-4xl font-bold text-brand-forest mb-2">
                    Articles & Tax Updates
                  </h2>
                  <p className="font-editorial-body text-sm text-brand-muted max-w-2xl">
                    Read our practice notes and regulatory updates on income tax, GST, company law, and RERA.
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-brand-border shadow-card p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-surface border border-brand-border flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-brand-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-editorial-h3 text-xl font-bold text-brand-forest">
                        Publications & Insights
                      </h3>
                      <p className="font-editorial-body text-sm text-brand-muted mt-1">
                        Browse all practice articles, tax updates, and regulatory commentary from our chambers.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/blog"
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand-forest text-white text-sm font-semibold hover:bg-brand-deep transition-colors min-h-[44px]"
                  >
                    View All Articles
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </>
            )}
          </div>

        </div>
      </main>

      {/* ── Conversion Banner ── */}
      <section className="bg-brand-forest text-brand-white py-14 sm:py-18">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-xs font-semibold mb-5">
            <Building2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Practice Consultation</span>
          </div>

          <h2 className="font-editorial-h2 text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-ivory mb-4">
            Need Expert Tax &amp; Audit Guidance?
          </h2>

          <p className="font-editorial-body text-base text-emerald-100/90 max-w-2xl mx-auto mb-8">
            These calculators provide preliminary estimation. For advice tailored to your business, tax audit, or compliance
            matters — speak directly with CA Kavitha Vijay, B.Com, CA, CMA (AIR 49).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-gold text-brand-deep font-bold text-sm hover:bg-amber-300 transition-colors min-h-[48px] shadow-sm"
            >
              Schedule a Consultation
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </Link>

            <a
              href={FIRM_DATA.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-emerald-400/50 text-emerald-100 hover:bg-emerald-800/40 font-semibold text-sm transition-colors min-h-[48px]"
            >
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              WhatsApp the Chambers
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default KnowledgeBankPage;
