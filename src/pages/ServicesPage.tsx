import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight,
  Compass,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const ServicesPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="Comprehensive Accounting, Audit & Tax Services | Kavitha & Associates"
        description="Explore the full spectrum of Chartered Accountancy services: Statutory Audit, Income Tax Return filing, GST compliance, ROC corporate secretarial, and RERA certifications in Tirupati."
        canonicalPath="/services"
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-brand-surface py-20 sm:py-24 lg:py-28 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-editorial-meta text-brand-gold block mb-3">
              Practice Areas & Disciplines
            </span>
            <h1 className="font-editorial-h1 text-brand-forest">
              Statutory Rigor. Multi-Disciplinary Counsel.
            </h1>
            <p className="mt-4 font-editorial-body text-brand-muted leading-relaxed">
              End-to-end professional support executed under the direct supervision of CA Kavitha Vijay (B.Com, CA, CMA AIR 49). 5 Practice Areas • 34 Specialized Services • 100% Partner-Led for emerging ventures, established enterprises, and institutions.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STICKY ARCHITECTURAL QUICK-JUMP NAVIGATION STRIP
          ========================================================================= */}
      <nav 
        aria-label="Services Quick Navigation" 
        className="bg-brand-surface/95 py-3 border-b border-brand-border sticky top-[57px] sm:top-[65px] z-30 shadow-xs backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            <span className="font-editorial-meta text-brand-gold shrink-0 flex items-center gap-1.5 text-[11px]">
              <Compass className="w-3.5 h-3.5 text-brand-gold" />
              <span>Jump to Area:</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <a 
                href="#audit-spotlight-banner" 
                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-white border border-brand-border text-xs font-semibold text-brand-forest hover:border-brand-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile"
              >
                Audit & Assurance
              </a>
              <a 
                href="#income-tax" 
                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-white border border-brand-border text-xs font-semibold text-brand-forest hover:border-brand-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile"
              >
                Income Tax
              </a>
              <a 
                href="#gst" 
                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-white border border-brand-border text-xs font-semibold text-brand-forest hover:border-brand-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile"
              >
                GST Compliance
              </a>
              <a 
                href="#corporate-business" 
                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-white border border-brand-border text-xs font-semibold text-brand-forest hover:border-brand-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile"
              >
                ROC & Corporate
              </a>
              <a 
                href="#rera-compliance" 
                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-white border border-brand-border text-xs font-semibold text-brand-forest hover:border-brand-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile"
              >
                RERA Practice
              </a>
              <a 
                href="#advisory-consulting" 
                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-white border border-brand-border text-xs font-semibold text-brand-forest hover:border-brand-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile"
              >
                Strategic Advisory
              </a>
              <a 
                href="#virtual-cfo" 
                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-forest/10 border border-brand-forest/30 text-xs font-semibold text-brand-forest hover:bg-brand-forest hover:text-white transition-colors btn-tactile"
              >
                Virtual CFO
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          3. FEATURED AUDIT ASSURANCE SPOTLIGHT BANNER
          ========================================================================= */}
      <section className="py-12 bg-brand-surface/70 border-b border-brand-border scroll-mt-32" id="audit-spotlight-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-white p-7 sm:p-9 rounded-2xl border border-brand-border shadow-card card-tactile">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-brand-forest text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="font-editorial-meta text-brand-gold block mb-1">
                  Featured Core Specialization
                </span>
                <h2 className="font-editorial-h2 text-xl sm:text-2xl font-bold text-brand-forest">
                  Audit & Assurance Practice (9 Statutory Streams)
                </h2>
                <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-2 max-w-2xl leading-relaxed">
                  Independent, thorough, and compliant audits encompassing Companies Act statutory audits, Tax audits under Section 44AB, GST reconciliations, Internal Financial Controls (IFC), and Stock audits.
                </p>
              </div>
            </div>

            <Link
              to="/services/audit-assurance"
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-forest text-white font-editorial-meta text-xs hover:bg-brand-deep transition-colors shrink-0 shadow-card hover:shadow-card-hover btn-tactile border border-brand-gold/30"
            >
              <span>Explore All 9 Audit Streams</span>
              <ArrowRight className="w-4 h-4 text-brand-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE 5 PRACTICE DISCIPLINES (Asymmetric 5:7 Grid Ledgers)
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {firm.serviceCategories.map((category, idx) => (
            <div
              key={category.id}
              id={category.id}
              className="scroll-mt-32 p-7 sm:p-10 lg:p-12 rounded-2xl border border-brand-border bg-brand-white shadow-card card-tactile"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Left 5 Columns: Discipline Overview */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-brand-forest/10 text-brand-forest font-editorial-meta text-xs border border-brand-forest/20">
                      Discipline 0{idx + 1}
                    </span>
                    {category.statutoryFramework && (
                      <span className="font-editorial-meta text-brand-muted bg-brand-surface px-3 py-1 rounded-full border border-brand-border text-[11px]">
                        {category.statutoryFramework}
                      </span>
                    )}
                  </div>

                  <h2 className="font-editorial-h2 text-brand-forest">
                    {category.title}
                  </h2>

                  <p className="font-editorial-body text-sm text-brand-muted leading-relaxed">
                    {category.fullDescription}
                  </p>

                  {/* Target Entities Dossier Box */}
                  {category.targetClients && (
                    <div className="p-4 rounded-xl bg-brand-surface border border-brand-border text-xs">
                      <strong className="block font-editorial-meta text-brand-gold mb-1.5 text-[11px]">
                        Applicable Entities:
                      </strong>
                      <span className="font-editorial-body text-brand-muted leading-relaxed">
                        {category.targetClients}
                      </span>
                    </div>
                  )}

                  {/* Common Practice Triggers */}
                  {category.typicalScenarios && (
                    <div className="pt-2">
                      <strong className="block font-editorial-meta text-brand-forest mb-2.5 text-xs">
                        Common Practice Triggers:
                      </strong>
                      <ul className="space-y-2 text-xs font-editorial-body text-brand-muted">
                        {category.typicalScenarios.map((scen) => (
                          <li key={scen} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2" />
                            <span>{scen}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 flex flex-wrap items-center gap-3.5 border-t border-brand-border">
                    <Link
                      to="/contact"
                      className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-forest text-white font-editorial-meta text-xs hover:bg-brand-deep transition-colors btn-tactile border border-brand-gold/30"
                    >
                      <span>Inquire Regarding {category.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                    </Link>
                    <a
                      href={`tel:${firm.contact.primaryPhoneClean}`}
                      className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-forest px-3 py-2"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-gold" />
                      <span>{firm.contact.primaryPhone}</span>
                    </a>
                  </div>
                </div>

                {/* Right 7 Columns: Ruled Service Scope Ledger */}
                <div className="lg:col-span-7 bg-brand-surface rounded-2xl p-7 sm:p-8 border border-brand-border">
                  <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-5">
                    <h3 className="font-editorial-meta text-brand-forest text-xs">
                      Statutory Scope & Engagements Included
                    </h3>
                    <span className="font-editorial-meta text-brand-forest bg-brand-forest/10 px-2.5 py-1 rounded-full border border-brand-forest/20 text-[10px]">
                      Partner Oversight
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.services.map((item) => (
                      <div key={item} className="flex items-start gap-3 p-3 rounded-xl bg-brand-white border border-brand-border/70 shadow-subtle">
                        <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                        <span className="font-editorial-body text-xs text-brand-charcoal font-medium leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-editorial-body text-brand-muted">
                    <span>Compliant with prevailing Indian statutory frameworks</span>
                    <a
                      href={firm.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-forest hover:text-brand-deep font-semibold hover:underline inline-flex items-center gap-1 min-h-[44px]"
                    >
                      <span>Quick WhatsApp Query</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Discipline 06: Deep Green Virtual CFO & Multi-Statute Retainer Showcase */}
          <div
            id="virtual-cfo"
            className="scroll-mt-32 p-7 sm:p-10 lg:p-12 rounded-2xl border border-brand-gold/30 bg-brand-deep text-white shadow-editorial-lg scroll-reveal"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-brand-forest text-brand-gold font-editorial-meta text-xs border border-brand-gold/40">
                    Discipline 06
                  </span>
                  <span className="font-editorial-meta text-emerald-200 bg-black/40 px-3 py-1 rounded-full border border-white/10 text-[11px]">
                    Multi-Statute Strategic Retainer
                  </span>
                </div>

                <h2 className="font-editorial-h2 text-white">
                  Virtual CFO & Retainership Practice
                </h2>

                <p className="font-editorial-body text-sm text-emerald-100/90 leading-relaxed">
                  Outsourced financial leadership, strategic cash flow governance, and consolidated compliance retainers designed for startups, MSMEs, and expanding enterprises that need high-level CFO expertise without the overhead of an in-house executive.
                </p>

                <div className="p-4 rounded-xl bg-brand-forest/60 border border-brand-forest text-xs">
                  <strong className="block font-editorial-meta text-brand-gold mb-1.5 text-[11px]">
                    Applicable Entities:
                  </strong>
                  <span className="font-editorial-body text-emerald-100/90 leading-relaxed">
                    Funded Startups, Manufacturing MSMEs, Commercial Real Estate Developers & Mid-Market Firms
                  </span>
                </div>

                <div className="pt-2">
                  <strong className="block font-editorial-meta text-brand-gold mb-2.5 text-xs">
                    Common Practice Triggers:
                  </strong>
                  <ul className="space-y-2 text-xs font-editorial-body text-emerald-100/90">
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2" />
                      <span>Transitioning from basic book-keeping to predictive financial leadership</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2" />
                      <span>Preparing Bank Loan CMA data and project reports for working capital lines</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2" />
                      <span>Mitigating compliance risk through annual multi-statute calendar oversight</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3.5 border-t border-white/10">
                  <Link
                    to="/contact"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-brand-deep font-editorial-meta text-xs font-bold transition-colors btn-tactile shadow-md"
                  >
                    <span>Discuss Retainer Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={`tel:${firm.contact.primaryPhoneClean}`}
                    className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200 hover:text-white px-3 py-2"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{firm.contact.primaryPhone}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Retainer Engagements Included */}
              <div className="lg:col-span-7 bg-brand-forest/60 rounded-2xl p-7 sm:p-8 border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <h3 className="font-editorial-meta text-white text-xs">
                    Virtual CFO Mandate & Deliverables
                  </h3>
                  <span className="font-editorial-meta text-brand-gold bg-black/40 px-2.5 py-1 rounded-full border border-brand-gold/30 text-[10px]">
                    CMA + CA Supervision
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-deep/80 border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="font-editorial-body text-xs text-emerald-100 font-medium leading-relaxed">
                      Monthly MIS, Operating Variance & Unit Cost Modeling
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-deep/80 border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="font-editorial-body text-xs text-emerald-100 font-medium leading-relaxed">
                      Continuous Advance Tax & Quarterly TDS Structuring
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-deep/80 border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="font-editorial-body text-xs text-emerald-100 font-medium leading-relaxed">
                      Bank Credit Facility CMA Data & Project Reports
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-deep/80 border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="font-editorial-body text-xs text-emerald-100 font-medium leading-relaxed">
                      Multi-Branch GST Health Checks & ITC Maximization
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-deep/80 border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="font-editorial-body text-xs text-emerald-100 font-medium leading-relaxed">
                      Annual MCA & ROC Secretarial Governance Oversight
                    </span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-deep/80 border border-white/10">
                    <CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="font-editorial-body text-xs text-emerald-100 font-medium leading-relaxed">
                      Board-Level Strategic Counsel with CA Kavitha Vijay
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-editorial-body text-emerald-200">
                  <span>Structured annual or quarterly engagement retainers</span>
                  <a
                    href={firm.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gold hover:text-white font-semibold hover:underline inline-flex items-center gap-1 min-h-[44px]"
                  >
                    <span>Direct WhatsApp Query</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. THE 4-STAGE CLIENT ENGAGEMENT CYCLE
          ========================================================================= */}
      <section className="py-20 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Systematic Execution
            </span>
            <h2 className="font-editorial-h2 text-brand-forest">
              The 4-Stage Client Engagement Cycle
            </h2>
            <p className="font-editorial-body text-sm sm:text-base text-brand-muted mt-3">
              Every mandate follows a transparent workflow from initial scoping to formal statutory dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-brand-white p-6 sm:p-7 rounded-2xl border border-brand-border shadow-subtle card-tactile flex flex-col justify-between">
              <div>
                <span className="font-editorial-meta text-brand-gold text-lg block mb-2">01</span>
                <h3 className="font-editorial-h3 text-base text-brand-forest mb-2">Discovery & Scoping</h3>
                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  Deep assessment of operational statutes, financial statements, and compliance backlog.
                </p>
              </div>
            </div>
            <div className="bg-brand-white p-6 sm:p-7 rounded-2xl border border-brand-border shadow-subtle card-tactile flex flex-col justify-between">
              <div>
                <span className="font-editorial-meta text-brand-gold text-lg block mb-2">02</span>
                <h3 className="font-editorial-h3 text-base text-brand-forest mb-2">Document Audit</h3>
                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  Rigorous reconciliation of ledgers, tax invoices, bank statements, and statutory returns.
                </p>
              </div>
            </div>
            <div className="bg-brand-white p-6 sm:p-7 rounded-2xl border border-brand-border shadow-subtle card-tactile flex flex-col justify-between">
              <div>
                <span className="font-editorial-meta text-brand-gold text-lg block mb-2">03</span>
                <h3 className="font-editorial-h3 text-base text-brand-forest mb-2">Partner Execution</h3>
                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  Technical audit memo synthesis, tax planning, and filing preparation by CA Kavitha Vijay.
                </p>
              </div>
            </div>
            <div className="bg-brand-white p-6 sm:p-7 rounded-2xl border border-brand-border shadow-subtle card-tactile flex flex-col justify-between">
              <div>
                <span className="font-editorial-meta text-brand-gold text-lg block mb-2">04</span>
                <h3 className="font-editorial-h3 text-base text-brand-forest mb-2">Filing & Archival</h3>
                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  Mandatory UDIN generation, official portal submission, and secure archival delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. CONSULTATION CTA SECTION
          ========================================================================= */}
      <section className="py-20 sm:py-24 bg-brand-surface text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="font-editorial-meta text-brand-gold block mb-2.5">
            Advisory & Retainerships
          </span>
          <h2 className="font-editorial-h2 text-brand-forest">
            Need Custom Corporate Structuring or Audit Consultation?
          </h2>
          <p className="mt-4 font-editorial-body text-sm sm:text-base text-brand-muted leading-relaxed">
            We structure annual compliance calendars, virtual CFO retainerships, and multi-state GST reconciliations tailored to your operating scale.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="min-h-[44px] btn-pill-action bg-brand-forest text-white hover:bg-brand-deep group font-editorial-meta text-xs shadow-card hover:shadow-card-hover border border-brand-gold/40"
            >
              <span>Schedule a Discussion</span>
              <span className="icon-badge bg-white/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-deep">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
            <a
              href={`tel:${firm.contact.primaryPhoneClean}`}
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-border bg-brand-white text-brand-forest font-editorial-meta text-xs hover:bg-brand-surface shadow-subtle transition-all active:scale-[0.98] btn-tactile"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>Call Senior Partner</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
