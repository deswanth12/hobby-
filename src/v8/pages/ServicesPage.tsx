import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  Phone,
  MessageSquare,
  CheckSquare,
  Search,
  X
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { 
  getAllServices, 
  getAuditSpotlightServices,
  getProjectFinanceService,
  getStrategicAdvisoryService 
} from '../adapters/contentAdapter';
import { useFirmProfile, getRouteWhatsAppUrl } from '../adapters/backendAdapter';
import { Button } from '../components/common/Button';
import { SectionAccent, DotGrid, ArchitecturalLines, DecorativeLayer } from '../components/decorative';
import { Badge } from '../components/common/Badge';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animation';
import { StatutoryChecklistModal } from '../components/common/StatutoryChecklistModal';
import { FIRM_DATA } from '../../data/firmData';

export type DisciplineFilterId = 'all' | 'audit' | 'direct-tax' | 'indirect-tax' | 'corporate' | 'advisory';

export interface DisciplineTab {
  id: DisciplineFilterId;
  label: string;
  count: number;
}

export const DISCIPLINE_TABS: DisciplineTab[] = [
  { id: 'all', label: 'All Disciplines (8)', count: 8 },
  { id: 'audit', label: 'Audit & Assurance', count: 1 },
  { id: 'direct-tax', label: 'Direct Tax & Litigation', count: 1 },
  { id: 'indirect-tax', label: 'GST & Indirect Tax', count: 1 },
  { id: 'corporate', label: 'Corporate Secretarial & Startups', count: 2 },
  { id: 'advisory', label: 'Advisory & Banking Syndication', count: 3 },
];

export interface PracticeCardData {
  id: string;
  disciplineId: DisciplineFilterId;
  disciplineNumber: string;
  code: string;
  title: string;
  statutoryFramework?: string;
  fullDescription: string;
  targetClients?: string;
  typicalScenarios?: string[];
  services: string[];
  route?: string;
  routeLabel?: string;
  isDark?: boolean;
  aliases?: string[];
}

const DEDICATED_PRACTICE_PAGES: Record<string, { path: string; label: string }> = {
  'income-tax': { path: '/services/income-tax-consultant-tirupati', label: 'Explore Dedicated Income Tax Practice' },
  'gst': { path: '/services/gst-consultant-tirupati', label: 'Explore Dedicated GST Practice' },
  'corporate-business': { path: '/services/company-registration-tirupati', label: 'Explore Company Registration Practice' },
  'rera-compliance': { path: '/services/rera-consultant-tirupati', label: 'Explore Dedicated RERA Advisory' },
  'advisory-consulting': { path: '/services/virtual-cfo-tirupati', label: 'Explore Virtual CFO Practice' },
  'project-finance': { path: '/services/project-finance', label: 'Explore Project Finance & Banking Practice' },
  'strategic-advisory': { path: '/services/strategic-advisory', label: 'Explore Strategic Corporate Advisory' },
};

export const ServicesPage: React.FC = () => {
  const firmProfile = useFirmProfile();
  const baseServices = getAllServices();
  const auditServices = getAuditSpotlightServices();
  const projectFinance = getProjectFinanceService();
  const strategicAdvisory = getStrategicAdvisoryService();

  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineFilterId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [checklistOpen, setChecklistOpen] = useState(false);

  const incomeTax = baseServices.find(s => s.id === 'income-tax') || FIRM_DATA.serviceCategories.find(s => s.id === 'income-tax')!;
  const gst = baseServices.find(s => s.id === 'gst') || FIRM_DATA.serviceCategories.find(s => s.id === 'gst')!;
  const corporate = baseServices.find(s => s.id === 'corporate-business') || FIRM_DATA.serviceCategories.find(s => s.id === 'corporate-business')!;
  const rera = baseServices.find(s => s.id === 'rera-compliance') || FIRM_DATA.serviceCategories.find(s => s.id === 'rera-compliance')!;

  const allPractices: PracticeCardData[] = [
    // 1. Audit & Assurance (PRAC-01)
    {
      id: 'audit-assurance',
      disciplineId: 'audit',
      disciplineNumber: 'Discipline 01',
      code: 'PRAC-01',
      title: 'Statutory Audit & Assurance Practice',
      statutoryFramework: 'Companies Act, 2013 | Income Tax Act, 1961 | ICAI Standards on Auditing (SAs)',
      fullDescription: 'Comprehensive independent audit and assurance portfolio covering statutory company audits under the Companies Act 2013, tax audits under Section 44AB of the Income Tax Act, internal financial controls (IFC), CARO 2020 reporting, and concurrent audits.',
      targetClients: 'Private & Public Limited Companies, LLPs, Financial Institutions, Funded Startups & Manufacturing MSMEs',
      typicalScenarios: [
        'Mandatory annual statutory audit for incorporated entities under Companies Act 2013',
        'Tax audit under Section 44AB for business turnover exceeding statutory thresholds',
        'Internal financial control (IFC) and CARO 2020 compliance reporting',
        'Stock and inventory audits for bank working capital drawing power certifications'
      ],
      services: auditServices.map(s => `${s.name}: ${s.scope}`),
      route: '/services/audit-assurance',
      routeLabel: 'Explore All 9 Audit Streams',
      isDark: false
    },
    // 2. Direct Tax & Litigation (PRAC-02)
    {
      id: 'income-tax',
      disciplineId: 'direct-tax',
      disciplineNumber: 'Discipline 02',
      code: 'PRAC-02',
      title: incomeTax.title,
      statutoryFramework: incomeTax.statutoryFramework,
      fullDescription: incomeTax.fullDescription,
      targetClients: incomeTax.targetClients,
      typicalScenarios: incomeTax.typicalScenarios,
      services: incomeTax.services,
      route: DEDICATED_PRACTICE_PAGES['income-tax']?.path,
      routeLabel: DEDICATED_PRACTICE_PAGES['income-tax']?.label,
      isDark: false
    },
    // 3. GST & Indirect Tax (PRAC-03)
    {
      id: 'gst',
      disciplineId: 'indirect-tax',
      disciplineNumber: 'Discipline 03',
      code: 'PRAC-03',
      title: gst.title,
      statutoryFramework: gst.statutoryFramework,
      fullDescription: gst.fullDescription,
      targetClients: gst.targetClients,
      typicalScenarios: gst.typicalScenarios,
      services: gst.services,
      route: DEDICATED_PRACTICE_PAGES['gst']?.path,
      routeLabel: DEDICATED_PRACTICE_PAGES['gst']?.label,
      isDark: false
    },
    // 4. Corporate Secretarial & Startups (PRAC-04)
    {
      id: 'corporate-business',
      disciplineId: 'corporate',
      disciplineNumber: 'Discipline 04',
      code: 'PRAC-04',
      title: corporate.title,
      statutoryFramework: corporate.statutoryFramework,
      fullDescription: corporate.fullDescription,
      targetClients: corporate.targetClients,
      typicalScenarios: corporate.typicalScenarios,
      services: corporate.services,
      route: DEDICATED_PRACTICE_PAGES['corporate-business']?.path,
      routeLabel: DEDICATED_PRACTICE_PAGES['corporate-business']?.label,
      isDark: false
    },
    // 5. Corporate Secretarial & Startups: RERA (PRAC-05)
    {
      id: 'rera-compliance',
      disciplineId: 'corporate',
      disciplineNumber: 'Discipline 05',
      code: 'PRAC-05',
      title: rera.title,
      statutoryFramework: rera.statutoryFramework,
      fullDescription: rera.fullDescription,
      targetClients: rera.targetClients,
      typicalScenarios: rera.typicalScenarios,
      services: rera.services,
      route: DEDICATED_PRACTICE_PAGES['rera-compliance']?.path,
      routeLabel: DEDICATED_PRACTICE_PAGES['rera-compliance']?.label,
      isDark: false
    },
    // 6. Advisory & Banking Syndication: Virtual CFO (PRAC-06)
    {
      id: 'virtual-cfo',
      aliases: ['advisory-consulting'],
      disciplineId: 'advisory',
      disciplineNumber: 'Discipline 06',
      code: 'PRAC-06',
      title: 'Virtual CFO & Retainership Practice',
      statutoryFramework: 'Multi-Statute Strategic Retainer (CMA + CA Supervision)',
      fullDescription: 'Outsourced financial leadership, strategic cash flow governance, and consolidated compliance retainers designed for startups, MSMEs, and expanding enterprises that need high-level CFO expertise without the overhead of an in-house executive.',
      targetClients: 'Funded Startups, Manufacturing MSMEs, Commercial Real Estate Developers & Mid-Market Enterprises',
      typicalScenarios: [
        'Auditing internal financial controls (IFC) and operating SOPs to prevent leakage',
        'Budgeting, variance reporting, and margin analysis by a qualified CMA',
        'Pre-investment transaction financial due diligence for investors and founders',
        'Forensic accounting reviews and fraud prevention safeguards'
      ],
      services: [
        'Monthly MIS, Operating Variance & Unit Cost Modeling',
        'Continuous Advance Tax & Quarterly TDS Structuring',
        'Bank Credit Facility CMA Data & Project Reports',
        'Multi-Branch GST Health Checks & ITC Maximization',
        'Annual MCA & ROC Secretarial Governance Oversight',
        'Board-Level Strategic Counsel with CA Kavitha Vijay'
      ],
      route: '/services/virtual-cfo-tirupati',
      routeLabel: 'Explore Virtual CFO Corridors',
      isDark: true
    },
    // 7. Advisory & Banking Syndication: Project Finance (PRAC-07)
    {
      id: 'project-finance',
      disciplineId: 'advisory',
      disciplineNumber: 'Discipline 07',
      code: 'PRAC-07',
      title: projectFinance.title,
      statutoryFramework: projectFinance.statutoryFramework,
      fullDescription: projectFinance.fullDescription,
      targetClients: projectFinance.targetClients,
      typicalScenarios: projectFinance.typicalScenarios,
      services: projectFinance.services,
      route: '/services/project-finance',
      routeLabel: 'Explore Project Finance & Banking Practice',
      isDark: false
    },
    // 8. Advisory & Banking Syndication: Strategic Advisory (PRAC-08)
    {
      id: 'strategic-advisory',
      disciplineId: 'advisory',
      disciplineNumber: 'Discipline 08',
      code: 'PRAC-08',
      title: strategicAdvisory.title,
      statutoryFramework: strategicAdvisory.statutoryFramework,
      fullDescription: strategicAdvisory.fullDescription,
      targetClients: strategicAdvisory.targetClients,
      typicalScenarios: strategicAdvisory.typicalScenarios,
      services: strategicAdvisory.services,
      route: '/services/strategic-advisory',
      routeLabel: 'Explore Strategic Corporate Advisory',
      isDark: false
    }
  ];

  const filteredPractices = allPractices.filter(card => {
    const matchesDiscipline = activeDiscipline === 'all' || card.disciplineId === activeDiscipline;
    if (!matchesDiscipline) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      card.title.toLowerCase().includes(q) ||
      card.code.toLowerCase().includes(q) ||
      card.fullDescription.toLowerCase().includes(q) ||
      (card.statutoryFramework ? card.statutoryFramework.toLowerCase().includes(q) : false) ||
      (card.targetClients ? card.targetClients.toLowerCase().includes(q) : false) ||
      card.services.some(s => s.toLowerCase().includes(q)) ||
      (card.typicalScenarios ? card.typicalScenarios.some(t => t.toLowerCase().includes(q)) : false)
    );
  });

  const handleReset = () => {
    setActiveDiscipline('all');
    setSearchQuery('');
  };

  return (
    <div className="bg-[#F1EBDD] text-[#071B14] min-h-screen page-reveal">
      <SEOHead
        title="Accounting & Tax Services in Tirupati | Kavitha & Associates"
        description="Comprehensive CA services in Tirupati: Statutory Audit, Income Tax Return (ITR) filing, GST compliance, Company Incorporation, ROC filings & Virtual CFO advisory."
        canonicalPath="/services"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' }
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Chartered Accountancy & Advisory Services',
            provider: {
              '@type': 'AccountingService',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/',
              telephone: firmProfile.contact.primaryPhone,
            },
            areaServed: 'Tirupati, Andhra Pradesh, India',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'CA Services Spectrum',
              itemListElement: [
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Statutory & Tax Audit' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Direct Tax & Scrutiny Representation' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GST Advisory & ITC Optimization' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Company Incorporation & MCA Compliance' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Virtual CFO Financial Controllership' } },
                { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'RERA Advisory & CA Certificates' } },
              ]
            }
          }
        ]}
      />

      {/* 1. Header Banner */}
      <section className="bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/25 texture-architectural-lines relative overflow-hidden">
        {/* Ambient Decorative Layer */}
        <DecorativeLayer>
          <DotGrid
            variant="bronze"
            width={260}
            height={260}
            className="absolute -top-10 -right-10 opacity-15 hidden md:block"
          />
        </DecorativeLayer>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal delay={60} duration={650}>
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Badge variant="kicker">02 / PRACTICE DISCIPLINES</Badge>
                <SectionAccent variant="bronze" className="hidden sm:flex" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64]" />
                  <span className="text-[10px] sm:text-xs font-semibold text-[#B49A64] tracking-wider uppercase">
                    FULL PRACTICE SPECTRUM • 34 SUB-SERVICE SCOPES
                  </span>
                </div>
              </div>
              <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-[1.15]">
                Statutory Rigour. Multi-Disciplinary Counsel.
              </h1>
              <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed max-w-2xl">
                End-to-end statutory auditing, tax litigation defense, and corporate governance executed under the direct supervision of CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).
              </p>

              {/* Services Header Double-Rule */}
              <ArchitecturalLines type="double-rule" variant="bronze" length="100px" className="my-3 opacity-60" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Sticky Quick-Jump Navigation Strip */}
      <nav 
        aria-label="Services Quick Navigation" 
        className="bg-[#FAF7F0]/95 py-3 border-b border-[#D8D0BE] sticky top-[57px] sm:top-[65px] z-30 shadow-xs backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            <span className="font-mono text-xs text-[#7E5E1E] font-semibold shrink-0 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Jump to Area:</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <a 
                href="#audit-spotlight-banner" 
                onClick={() => { setActiveDiscipline('all'); setSearchQuery(''); }}
                className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile"
              >
                Audit &amp; Assurance ({auditServices.length} Streams)
              </a>
              <a 
                href="#income-tax" 
                onClick={() => { setActiveDiscipline('all'); setSearchQuery(''); }}
                className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile"
              >
                Income Tax
              </a>
              <a 
                href="#gst" 
                onClick={() => { setActiveDiscipline('all'); setSearchQuery(''); }}
                className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile"
              >
                GST Compliance
              </a>
              <a 
                href="#corporate-business" 
                onClick={() => { setActiveDiscipline('all'); setSearchQuery(''); }}
                className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile"
              >
                ROC &amp; Corporate
              </a>
              <a 
                href="#rera-compliance" 
                onClick={() => { setActiveDiscipline('all'); setSearchQuery(''); }}
                className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile"
              >
                RERA Practice
              </a>
              <a 
                href="#virtual-cfo" 
                onClick={() => { setActiveDiscipline('all'); setSearchQuery(''); }}
                className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#183529] text-[#F1EBDD] border border-[#B49A64]/40 text-xs font-semibold hover:bg-[#071B14] transition-colors btn-tactile"
              >
                Virtual CFO
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. Featured Audit Assurance Spotlight Banner */}
      <section className="py-10 bg-[#FAF7F0] border-b border-[#D8D0BE] scroll-mt-32" id="audit-spotlight-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={80} duration={650}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#B49A64]/30 shadow-card relative transition-all duration-300 hover:border-[#B49A64]/60 hover:shadow-editorial">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/40 shadow-inner">
                  <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block">
                    Featured Core Specialization
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#183529]">
                    Audit &amp; Assurance Practice ({auditServices.length} Statutory Streams)
                  </h2>
                  <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-2xl leading-relaxed">
                    Independent statutory audits under the Companies Act 2013, Tax Audits under Section 44AB, Internal Financial Controls (IFC), CARO 2020 reporting, and Bank Concurrent audits.
                  </p>
                </div>
              </div>
              <Button
                to="/services/audit-assurance"
                variant="primary"
                size="md"
                className="shrink-0"
                dualArrow
              >
                Explore All 9 Audit Streams
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. The Practice Disciplines (5:7 Grid Ledgers with 8 Practice Cards) */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Kicker & Title */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="gold">STATUTORY PRACTICE SPECTRUM</Badge>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#183529]">
              Explore Our Specialized CA Disciplines
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
              Filter our 8 core statutory practice areas or search across disciplines, regulatory frameworks, and sub-service engagement scopes.
            </p>
          </div>

          {/* Interactive Discipline Filter Bar & Search */}
          <div className="space-y-6">
            {/* Filter Tabs Pill Bar */}
            <div 
              role="tablist" 
              aria-label="Practice disciplines"
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
            >
              {DISCIPLINE_TABS.map((tab) => {
                const isActive = activeDiscipline === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActiveDiscipline(tab.id)}
                    className={`min-h-[44px] inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 btn-tactile ${
                      isActive
                        ? 'bg-[#0B241C] border border-[#B49A64] text-[#F1EBDD] shadow-sm'
                        : 'bg-[#FAF7F0] border border-[#D8D0BE] text-[#183529] hover:border-[#B49A64] hover:text-[#071B14]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search & Results Indicator */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto px-2">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-[#7E5E1E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search practices, statutes, or sub-service scopes..."
                  aria-label="Search practice areas"
                  className="w-full pl-10 pr-12 py-2.5 rounded-full bg-[#FFFFFF] border border-[#D8D0BE] text-xs text-[#071B14] placeholder-[#8C827A] focus:outline-none focus:border-[#B49A64] focus:ring-1 focus:ring-[#B49A64] transition-all min-h-[44px]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-[#7E5E1E] hover:text-[#071B14] hover:bg-[#F1EBDD]/60 transition-colors min-h-[44px]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#7E5E1E] font-mono shrink-0">
                <span>Showing {filteredPractices.length} of 8 Practices</span>
                {(activeDiscipline !== 'all' || searchQuery.trim() !== '') && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="min-h-[44px] underline hover:text-[#071B14] font-semibold text-xs ml-2 inline-flex items-center"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredPractices.length === 0 && (
            <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] text-center shadow-card space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#183529]/10 text-[#183529] flex items-center justify-center mx-auto border border-[#183529]/20">
                <Search className="w-5 h-5 text-[#7E5E1E]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#183529]">
                  No Practice Disciplines Found
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-md mx-auto leading-relaxed">
                  {searchQuery 
                    ? `No practice areas or statutory scopes matched "${searchQuery}". Try searching by statute name, client type, or practice code.`
                    : 'No practice areas found for the selected discipline filter.'}
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#0B241C] text-[#F1EBDD] border border-[#B49A64] text-xs font-semibold shadow-sm hover:bg-[#153F32] transition-all duration-300 btn-tactile"
                >
                  Reset Filters &amp; View All (8)
                </button>
              </div>
            </div>
          )}

          {/* Practice Cards List */}
          {filteredPractices.map((card, idx) => (
            <Reveal key={card.id} delay={60 + (idx % 4) * 30} duration={650}>
              <div
                id={card.id}
                className={`scroll-mt-32 p-6 sm:p-10 lg:p-12 rounded-2xl border transition-all duration-300 ${
                  card.isDark
                    ? 'border-[#B49A64]/40 bg-[#071B14] text-[#F1EBDD] shadow-2xl hover:border-[#B49A64]/80'
                    : 'border-[#D8D0BE] bg-[#FAF7F0] shadow-card hover:border-[#B49A64]/60'
                }`}
              >
                {/* Anchor alias if applicable */}
                {card.aliases?.map(alias => (
                  <span key={alias} id={alias} className="scroll-mt-32" />
                ))}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  {/* Left 5 Cols: Discipline Overview */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-semibold ${
                        card.isDark
                          ? 'bg-[#183529] text-[#B49A64] border border-[#B49A64]/40'
                          : 'bg-[#183529]/10 text-[#183529] border border-[#183529]/20'
                      }`}>
                        {card.disciplineNumber}
                      </span>
                      {card.statutoryFramework && (
                        <span className={`font-mono text-[11px] px-2.5 py-0.5 rounded-full border ${
                          card.isDark
                            ? 'text-[#AAB4A0] bg-[#0B241C] border-white/10'
                            : 'text-[#7E5E1E] bg-[#F1EBDD] border-[#D8D0BE]'
                        }`}>
                          {card.statutoryFramework}
                        </span>
                      )}
                    </div>

                    <h2 className={`font-serif font-bold ${
                      card.isDark
                        ? 'font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#F1EBDD]'
                        : 'text-2xl sm:text-3xl text-[#183529]'
                    }`}>
                      {card.title}
                    </h2>

                    <p className={`font-editorial-body text-xs sm:text-sm leading-relaxed ${
                      card.isDark ? 'text-[#F1EBDD]/80' : 'text-[#525954]'
                    }`}>
                      {card.fullDescription}
                    </p>

                    {card.targetClients && (
                      <div className={`p-4 rounded-xl border text-xs ${
                        card.isDark
                          ? 'bg-[#183529]/60 border-[#B49A64]/25 text-[#F1EBDD]/90'
                          : 'bg-[#F1EBDD] border-[#D8D0BE] text-[#35271F]'
                      }`}>
                        <strong className={`block font-mono text-[11px] uppercase tracking-wider mb-1 ${
                          card.isDark ? 'text-[#B49A64]' : 'text-[#7E5E1E] font-bold'
                        }`}>
                          Applicable Entities:
                        </strong>
                        <span className="font-editorial-body leading-relaxed">
                          {card.targetClients}
                        </span>
                      </div>
                    )}

                    {card.typicalScenarios && card.typicalScenarios.length > 0 && (
                      <div className="pt-2">
                        <strong className={`block font-serif text-xs font-bold mb-2 uppercase tracking-wider ${
                          card.isDark ? 'text-[#B49A64]' : 'text-[#183529]'
                        }`}>
                          Common Practice Triggers:
                        </strong>
                        <ul className={`space-y-1.5 text-xs ${card.isDark ? 'text-[#F1EBDD]/80' : 'text-[#525954]'}`}>
                          {card.typicalScenarios.map((scen, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0 mt-1.5" />
                              <span>{scen}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className={`pt-4 flex flex-wrap items-center gap-3 border-t ${
                      card.isDark ? 'border-white/10' : 'border-[#D8D0BE]'
                    }`}>
                      {card.isDark ? (
                        <>
                          <Button
                            to="/services/virtual-cfo-tirupati"
                            variant="primary"
                            size="md"
                            dualArrow
                          >
                            Explore Virtual CFO Corridors
                          </Button>
                          <Button
                            to="/contact"
                            variant="secondary-outline"
                            size="md"
                          >
                            Discuss Retainer Scope
                          </Button>
                        </>
                      ) : (
                        <>
                          {card.route && (
                            <Button
                              to={card.route}
                              variant="secondary"
                              size="sm"
                              dualArrow
                            >
                              {card.routeLabel || `Explore ${card.title}`}
                            </Button>
                          )}
                          <Button
                            to="/contact"
                            variant="primary"
                            size="sm"
                          >
                            Inquire Regarding {card.title}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right 7 Cols: Ruled Service Scope Ledger */}
                  <div className={`lg:col-span-7 rounded-2xl p-6 sm:p-8 border ${
                    card.isDark
                      ? 'bg-[#183529]/70 border-[#B49A64]/25'
                      : 'bg-[#FFFFFF] border-[#D8D0BE] shadow-xs'
                  }`}>
                    <div className={`flex items-center justify-between border-b pb-3 mb-5 ${
                      card.isDark ? 'border-white/10' : 'border-[#D8D0BE]'
                    }`}>
                      <h3 className={`font-serif text-sm font-bold uppercase tracking-wider ${
                        card.isDark ? 'text-[#F1EBDD]' : 'text-[#183529]'
                      }`}>
                        Statutory Scope &amp; Engagements Included ({card.services.length} Scopes)
                      </h3>
                      <Badge variant={card.isDark ? 'kicker' : 'statutory'}>
                        {card.isDark ? 'CMA + CA Supervision' : 'Partner Supervision'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {card.services.map((scopeItem, i) => (
                        <div 
                          key={i} 
                          className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
                            card.isDark
                              ? 'bg-[#071B14]/80 border-[#B49A64]/20 hover:border-[#B49A64]/50'
                              : 'bg-[#FAF7F0] border-[#D8D0BE]/70 hover:border-[#B49A64]/40'
                          }`}
                        >
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${card.isDark ? 'text-[#B49A64]' : 'text-[#183529]'}`} />
                          <span className={`font-editorial-body text-xs font-medium leading-relaxed ${
                            card.isDark ? 'text-[#F1EBDD]/90' : 'text-[#35271F]'
                          }`}>
                            {scopeItem}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-6 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                      card.isDark ? 'border-white/10 text-[#AAB4A0]' : 'border-[#D8D0BE]/70 text-[#525954]'
                    }`}>
                      <span>
                        {card.isDark 
                          ? 'Structured annual or quarterly engagement retainers' 
                          : 'Compliant with prevailing Indian statutory frameworks'}
                      </span>
                      <a
                        href={firmProfile.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-semibold inline-flex items-center gap-1 min-h-[44px] ${
                          card.isDark ? 'text-[#B49A64] hover:text-[#F1EBDD]' : 'text-[#183529] hover:text-[#071B14]'
                        }`}
                      >
                        <span>{card.isDark ? 'Direct WhatsApp Query \u2192' : 'Quick WhatsApp Query'}</span>
                        {!card.isDark && <span>&rarr;</span>}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. The 4-Stage Client Engagement Cycle */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF7F0] border-y border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={60} duration={650}>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge variant="gold">SYSTEMATIC EXECUTION</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#183529] mt-3">
                The 4-Stage Client Engagement Cycle
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-2">
                Every mandate follows a transparent workflow from initial scoping to formal statutory dispatch.
              </p>
            </div>
          </Reveal>

          <StaggerContainer staggerMs={80} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery & Scoping', desc: 'Deep assessment of operational statutes, financial statements, and compliance backlog.' },
              { step: '02', title: 'Document Audit', desc: 'Rigorous reconciliation of ledgers, tax invoices, bank statements, and statutory returns.' },
              { step: '03', title: 'Partner Execution', desc: 'Technical audit memo synthesis, tax planning, and filing preparation by CA Kavitha Vijay.' },
              { step: '04', title: 'Filing & Archival', desc: 'Mandatory UDIN generation, official portal submission, and secure archival delivery.' },
            ].map((st, i) => (
              <StaggerItem key={i} index={i} distance={18} durationMs={550}>
                <div className="h-full bg-[#FFFFFF] p-6 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover">
                  <div>
                    <span className="font-mono text-lg font-bold text-[#7E5E1E] block mb-2">{st.step}</span>
                    <h3 className="font-serif text-base font-bold text-[#183529] mb-2">{st.title}</h3>
                    <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. Consultation CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F1EBDD] text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <Reveal delay={60} duration={650}>
            <div className="space-y-4">
              <Badge variant="gold">ADVISORY &amp; RETAINERSHIPS</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#183529]">
                Need Custom Corporate Structuring or Audit Consultation?
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
                We structure annual compliance calendars, virtual CFO retainerships, and multi-state GST reconciliations tailored to your operating scale.
              </p>
              <div className="pt-4 flex justify-center gap-3 flex-wrap">
                <Button to="/contact" variant="primary" size="md" dualArrow>
                  Schedule a Discussion
                </Button>
                <a
                  href={getRouteWhatsAppUrl('/services')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
                >
                  <MessageSquare className="w-4 h-4 text-white" />
                  <span>Quick WhatsApp Query</span>
                </a>
                <button
                  type="button"
                  onClick={() => setChecklistOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#B49A64] border border-[#B49A64]/50 text-xs font-semibold transition-all hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
                >
                  <CheckSquare className="w-4 h-4 text-[#B49A64]" />
                  <span>Statutory Checklists</span>
                </button>
                <Button href={`tel:${firmProfile.contact.primaryPhoneClean}`} variant="outline" size="md" leftIcon={<Phone className="w-4 h-4 text-[#B49A64]" />}>
                  Call Senior Partner
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <StatutoryChecklistModal
        isOpen={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        defaultTab="tax"
      />
    </div>
  );
};

export default ServicesPage;
