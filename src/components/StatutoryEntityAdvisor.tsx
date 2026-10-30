import React, { useState } from 'react';
import { 
  Building2, 
  Rocket, 
  Factory, 
  Home, 
  HeartHandshake, 
  FileCheck2, 
  Scale, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';
import { DualArrowButton } from './animations/DualArrowButton';

interface EntityProfile {
  id: string;
  name: string;
  tagline: string;
  icon: React.ElementType;
  statuteBadges: string[];
  mandatoryAudits: string[];
  statutoryFilings: string[];
  partnerDeliverables: string[];
  consultationSummary: string;
}

const ENTITY_PROFILES: EntityProfile[] = [
  {
    id: 'pvt-ltd',
    name: 'Private Limited & Public Companies',
    tagline: 'Companies Act, 2013 & Corporate Governance',
    icon: Building2,
    statuteBadges: ['Sec 139 CA 2013', 'CARO 2020', 'Sec 143(3)(i) IFC', 'Form AOC-4 / MGT-7'],
    mandatoryAudits: [
      'Mandatory Annual Statutory Audit under Section 139 of Companies Act, 2013',
      'CARO 2020 reporting on inventory, title deeds, internal audit & statutory dues',
      'Internal Financial Controls over Financial Reporting (IFCoFR) testing',
      'Tax Audit under Section 44AB if business turnover exceeds statutory threshold'
    ],
    statutoryFilings: [
      'MCA Form AOC-4 (Financial Statements) within 30 days of AGM',
      'MCA Form MGT-7/7A (Annual Return) within 60 days of AGM',
      'DIR-3 KYC verification for all directors annually by 30th September',
      'Quarterly Advance Tax and monthly GST GSTR-1 / 3B reconciliations'
    ],
    partnerDeliverables: [
      'Direct Partner-led audit engagement by Big-4 trained statutory auditor',
      'Formal Audit Committee and Board Presentation on key internal controls',
      'Independent Auditor’s Report with True and Fair view certification'
    ],
    consultationSummary: 'Corporate Statutory Audit & Secretarial Compliance Review'
  },
  {
    id: 'llp',
    name: 'LLPs & Partnership Firms',
    tagline: 'LLP Act, 2008 & Partnership Tax Optimization',
    icon: Scale,
    statuteBadges: ['Sec 44AB Tax Audit', 'LLP Form 8 & 11', 'Sec 40(b) Remuneration'],
    mandatoryAudits: [
      'LLP Audit under Rule 24 if turnover > ₹40 Lakhs or contribution > ₹25 Lakhs',
      'Income Tax Audit under Section 44AB (₹10 Cr for digital / ₹1 Cr standard)',
      'Partner remuneration & interest allowable limits audit under Section 40(b)',
      'Reconciliation of capital accounts and drawings'
    ],
    statutoryFilings: [
      'MCA LLP Form 11 (Annual Return) by 30th May annually',
      'MCA LLP Form 8 (Statement of Accounts & Solvency) by 30th October',
      'Income Tax Return Form ITR-5 by 31st July (non-audit) or 31st October (audit)',
      'Monthly GST compliance & periodic TDS returns'
    ],
    partnerDeliverables: [
      'Partner remuneration restructuring to minimize effective tax liability',
      'Solvency certification and statement of accounts for MCA submission',
      'Tax Audit Report in Form 3CB/3CD with verified workpapers'
    ],
    consultationSummary: 'LLP Statutory Audit & Partnership Tax Structuring'
  },
  {
    id: 'startup',
    name: 'Startups & Emerging Tech Ventures',
    tagline: 'DPIIT Recognition, Sec 80-IAC & Cap Table Structuring',
    icon: Rocket,
    statuteBadges: ['DPIIT Recognition', 'Sec 80-IAC Tax Holiday', 'Sec 56(2)(viib)', 'ESOP Structuring'],
    mandatoryAudits: [
      'Section 80-IAC 3-consecutive-year 100% tax holiday eligibility certification',
      'Valuation Report for Angel Tax exemption under Section 56(2)(viib)',
      'Transfer Pricing audit in Form 3CEB if engaging in international SaaS/R&D transactions',
      'Cap table accuracy and share allotment documentation review'
    ],
    statutoryFilings: [
      'Form 1 DPIIT Angel Tax Exemption application and documentation',
      'Form PAS-3 return of share allotment within 15 days of funding rounds',
      'Form FC-GPR filing with Reserve Bank of India (RBI) via FIRMS portal for FDI',
      'Annual corporate tax return and director compliances'
    ],
    partnerDeliverables: [
      'Section 80-IAC application dossier preparation and Inter-Ministerial Board defense',
      'Investor due diligence readiness and Virtual CFO financial architecture',
      'ESOP scheme design and grant valuation by qualified CMA AIR 49'
    ],
    consultationSummary: 'Startup DPIIT Recognition & 80-IAC Tax Holiday Advisory'
  },
  {
    id: 'msme',
    name: 'MSMEs & Manufacturing Units',
    tagline: 'Section 43B(h), Inventory Valuation & Bank Finance',
    icon: Factory,
    statuteBadges: ['Sec 43B(h) MSME', 'Ind AS 2 Inventory', 'CMA Data', 'Drawing Power'],
    mandatoryAudits: [
      'Section 43B(h) compliance audit verifying payments to Micro & Small vendors within 45 days',
      'Cost sheet & inventory valuation audit in accordance with Ind AS 2 / AS 2',
      'Bank Stock & Receivables Audit for working capital credit lines',
      'Quarterly Drawing Power (DP) certification for consortium bankers'
    ],
    statutoryFilings: [
      'Form MSME-1 half-yearly return to MCA for outstanding vendor payments > 45 days',
      'Annual Income Tax Audit under Section 44AB',
      'GSTR-9 and GSTR-9C annual GST reconciliations',
      'Udyam registration and periodic classification updates'
    ],
    partnerDeliverables: [
      'CMA Project Reports and financial modeling for bank credit enhancement',
      'Unit-cost analysis by qualified Cost Accountant (AIR 49) identifying margin leakages',
      'Section 43B(h) disallowance risk mitigation ledger for fiscal year end'
    ],
    consultationSummary: 'MSME Section 43B(h) Audit & CMA Project Finance'
  },
  {
    id: 'real-estate',
    name: 'Real Estate Builders & Developers',
    tagline: 'RERA Compliance, Form 3 Escrow & Ind AS 115 Revenue',
    icon: Home,
    statuteBadges: ['RERA Form 3', 'Sec 4(2)(l)(D)', 'Sec 45(5A) JDA', 'Ind AS 115'],
    mandatoryAudits: [
      'Mandatory RERA Form 3 CA Certificate for 70% escrow account fund withdrawals',
      'Annual RERA project audit in Form 5 within 6 months of financial year end',
      'Section 45(5A) capital gains structuring on Joint Development Agreements (JDAs)',
      'Percentage-of-Completion (POCM) revenue recognition under Ind AS 115'
    ],
    statutoryFilings: [
      'Quarterly RERA financial and physical project progress updates',
      'GST returns under real estate special scheme (1% affordable / 5% non-affordable)',
      'TDS on property purchases under Section 194-IA (Form 26QB)',
      'Annual income tax return and corporate filings'
    ],
    partnerDeliverables: [
      'Certified Form 3 escrow withdrawal schedules based on incurred construction costs',
      'JDA tax liability optimization protecting landowner and developer interests',
      'RERA authority representation and financial documentation defense'
    ],
    consultationSummary: 'RERA Form 3 Escrow Audit & Real Estate Tax Advisory'
  },
  {
    id: 'trusts',
    name: 'Charitable Trusts & Section 8 Entities',
    tagline: 'Section 12AB, 80G Approval & Form 10B/10BB Audits',
    icon: HeartHandshake,
    statuteBadges: ['Sec 12AB Registration', 'Sec 80G Approval', 'Form 10B / 10BB', 'FCRA Audit'],
    mandatoryAudits: [
      'Mandatory Audit Report in Form 10B (receipts > ₹5 Cr) or Form 10BB under Section 12A(1)(b)',
      '85% application of income audit for charitable or religious objectives',
      'Specific audit of accumulated income under Section 11(2) in Form 10',
      'FCRA annual audit and Form FC-4 certification for foreign contributions'
    ],
    statutoryFilings: [
      'Annual Income Tax Return Form ITR-7 by 31st October',
      'Statement of donations in Form 10BD and certificate generation in Form 10BE',
      'Re-registration under Section 12AB and Section 80G with the Principal Commissioner',
      'Quarterly intimation of foreign contributions on the MHA FCRA portal'
    ],
    partnerDeliverables: [
      'Rigorous Form 10B/10BB statutory audit safeguarding tax-exempt status',
      'Section 12AB / 80G five-year renewal dossier preparation and representation',
      'Corpus donation structuring and compliance with Section 13 restrictions'
    ],
    consultationSummary: 'Trust Section 12AB Compliance & Form 10B/10BB Audit'
  }
];

export const StatutoryEntityAdvisor: React.FC = () => {
  const [activeEntityId, setActiveEntityId] = useState<string>('pvt-ltd');
  const activeEntity = ENTITY_PROFILES.find((e) => e.id === activeEntityId) || ENTITY_PROFILES[0];
  const IconComponent = activeEntity.icon;

  return (
    <section className="py-16 sm:py-24 bg-brand-surface/60 border-b border-brand-border" id="statutory-advisor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest/10 border border-brand-forest/20 text-brand-forest text-xs font-editorial-meta uppercase tracking-wider mb-3">
            <FileCheck2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>Interactive Governance Framework</span>
          </div>
          <h2 className="font-editorial-h2 text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-forest">
            Statutory Scope &amp; Entity Advisor
          </h2>
          <p className="mt-4 font-editorial-body text-brand-muted text-sm sm:text-base leading-relaxed">
            Select your enterprise structure to review mandatory audits, statutory filing deadlines, and direct partner deliverables executed under CA Kavitha Vijay (B.Com, CA, CMA AIR 49).
          </p>
        </div>

        {/* Entity Selector Tabs (Horizontal Scrollable Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-10">
          {ENTITY_PROFILES.map((entity) => {
            const EntityIcon = entity.icon;
            const isSelected = entity.id === activeEntityId;
            return (
              <button
                key={entity.id}
                type="button"
                onClick={() => setActiveEntityId(entity.id)}
                className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer btn-tactile ${
                  isSelected
                    ? 'bg-brand-forest text-white border-brand-gold shadow-md scale-[1.02]'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:bg-brand-surface hover:border-brand-gold/50 shadow-xs'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                  isSelected ? 'bg-brand-deep text-brand-gold' : 'bg-brand-surface text-brand-forest'
                }`}>
                  <EntityIcon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-semibold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-brand-forest'}`}>
                  {entity.name.split('&')[0]}
                </span>
                <span className={`text-[10px] font-editorial-meta mt-1 ${isSelected ? 'text-brand-gold' : 'text-brand-muted'}`}>
                  {entity.id === 'pvt-ltd' ? 'Corporate' : entity.id === 'startup' ? 'Venture' : 'Statutory'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Entity Diagnostic Card (3-Column Ledger Grid) */}
        <div className="bg-brand-white rounded-3xl border border-brand-border shadow-card p-6 sm:p-10 lg:p-12 scroll-reveal">
          
          {/* Diagnostic Card Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-brand-border mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-forest text-brand-gold flex items-center justify-center border border-brand-gold/40 shadow-sm shrink-0">
                <IconComponent className="w-7 h-7" />
              </div>
              <div>
                <span className="font-editorial-meta text-xs uppercase tracking-wider text-gold-dark block mb-1">
                  Entity Architecture &amp; Statutory Scoping
                </span>
                <h3 className="font-editorial-h3 text-2xl sm:text-3xl font-bold text-brand-forest">
                  {activeEntity.name}
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-1">
                  {activeEntity.tagline}
                </p>
              </div>
            </div>

            {/* Statutory Badges Strip */}
            <div className="flex flex-wrap items-center gap-2">
              {activeEntity.statuteBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-full bg-brand-surface text-brand-forest border border-brand-border font-editorial-meta text-[11px] font-semibold"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Diagnostic Columns: Audits | Filings | Partner Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 mb-10">
            
            {/* Column 1: Mandatory Audits */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border/60 pb-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                <h4 className="font-editorial-meta text-xs font-bold uppercase tracking-wider text-brand-forest">
                  Mandatory Audits
                </h4>
              </div>
              <ul className="space-y-3">
                {activeEntity.mandatoryAudits.map((item, idx) => (
                  <li key={idx} className="font-editorial-body text-xs text-brand-charcoal/85 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-forest shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Statutory Filings & Deadlines */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border/60 pb-2.5">
                <Calendar className="w-4 h-4 text-brand-gold shrink-0" />
                <h4 className="font-editorial-meta text-xs font-bold uppercase tracking-wider text-brand-forest">
                  Key Regulatory Filings
                </h4>
              </div>
              <ul className="space-y-3">
                {activeEntity.statutoryFilings.map((item, idx) => (
                  <li key={idx} className="font-editorial-body text-xs text-brand-charcoal/85 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Partner Deliverables */}
            <div className="space-y-4 bg-brand-surface/40 p-5 rounded-2xl border border-brand-border/80">
              <div className="flex items-center gap-2 border-b border-brand-border/60 pb-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <h4 className="font-editorial-meta text-xs font-bold uppercase tracking-wider text-brand-forest">
                  Direct Partner Value
                </h4>
              </div>
              <ul className="space-y-3">
                {activeEntity.partnerDeliverables.map((item, idx) => (
                  <li key={idx} className="font-editorial-body text-xs text-brand-charcoal/90 leading-relaxed flex items-start gap-2.5">
                    <span className="text-brand-gold shrink-0 text-xs">✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Strip */}
          <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface/50 -mx-6 sm:-mx-10 lg:-mx-12 -mb-6 sm:-mb-10 lg:-mb-12 p-6 sm:p-8 rounded-b-3xl">
            <div>
              <span className="font-editorial-meta text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
                Partner Consultation Scope:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-brand-forest">
                {activeEntity.consultationSummary}
              </p>
            </div>
            
            <DualArrowButton
              to={`/contact?entity=${encodeURIComponent(activeEntity.name)}`}
              variant="primary"
              className="text-xs font-semibold shrink-0"
            >
              Consult On This Entity
            </DualArrowButton>
          </div>

        </div>

      </div>
    </section>
  );
};
