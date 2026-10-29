import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight,
  Compass,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const ServicesPage: React.FC = () => {
  return (
    <div className="bg-brand-warm page-reveal">
      <SEOHead
        title="Comprehensive Accounting, Audit & Tax Services | Kavitha & Associates"
        description="Explore the full spectrum of Chartered Accountancy services: Statutory Audit, Income Tax Return filing, GST compliance, ROC corporate secretarial, and RERA certifications in Tirupati."
        canonicalPath="/services"
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-brand-surface py-14 sm:py-18 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Practice Areas & Disciplines
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              Comprehensive Financial, Tax & Regulatory Services
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              End-to-end professional support executed under the personal supervision of CA KavithaVijay SRJ (FCA, CMA). Tailored for emerging ventures, established enterprises, and institutions.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUICK-JUMP NAVIGATION STRIP (Carvi Anchor Navigation)
          ========================================================================= */}
      <nav aria-label="Services Quick Navigation" className="bg-brand-surface py-3.5 border-b border-border sticky top-[57px] sm:top-[65px] z-30 shadow-xs backdrop-blur-sm bg-brand-surface/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-gold-dark" />
              <span>Jump to Area:</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <a href="#audit-spotlight-banner" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                Audit & Assurance
              </a>
              <a href="#income-tax" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                Income Tax
              </a>
              <a href="#gst" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                GST Compliance
              </a>
              <a href="#corporate-business" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                ROC & Corporate
              </a>
              <a href="#rera-compliance" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                RERA Practice
              </a>
              <a href="#advisory-consulting" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                Strategic Advisory
              </a>
              <a href="#virtual-cfo" className="px-3 py-1.5 rounded-lg bg-brand-pale border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors btn-tactile">
                Virtual CFO
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          FEATURED AUDIT SPOTLIGHT BANNER
          ========================================================================= */}
      <section className="py-8 bg-brand-pale/70 border-b border-border scroll-mt-28" id="audit-spotlight-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 sm:p-7 rounded-xl border border-border shadow-subtle">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary text-gold flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
                  Featured Core Specialization
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary mt-0.5">
                  Audit & Assurance Practice (9 Statutory Streams)
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-2xl leading-relaxed">
                  Independent, thorough, and compliant audits encompassing Companies Act statutory audits, Tax audits under Section 44AB, GST reconciliations, Internal Financial Controls (IFC), and Stock audits.
                </p>
              </div>
            </div>

            <Link
              to="/services/audit-assurance"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors shrink-0 shadow-sm btn-tactile"
            >
              <span>Explore All 9 Audit Streams</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          DETAILED SERVICE CATEGORIES (NSKA Depth + Carvi Cleanliness)
          ========================================================================= */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {FIRM_DATA.serviceCategories.map((category, idx) => (
            <div
              key={category.id}
              id={category.id}
              className="scroll-mt-28 p-6 sm:p-8 lg:p-10 rounded-xl border border-border bg-white shadow-card card-tactile"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Overview Column */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-brand-pale text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                      Discipline 0{idx + 1}
                    </span>
                    {category.statutoryFramework && (
                      <span className="text-[11px] font-semibold text-charcoal-muted bg-brand-surface px-2.5 py-1 rounded border border-border">
                        {category.statutoryFramework}
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                    {category.title}
                  </h2>

                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    {category.fullDescription}
                  </p>

                  {/* Target Entities Box */}
                  {category.targetClients && (
                    <div className="p-3.5 rounded-lg bg-brand-warm border border-border/80 text-xs">
                      <strong className="block text-[11px] uppercase tracking-wider text-gold-dark font-bold mb-1">
                        Applicable Entities:
                      </strong>
                      <span className="text-charcoal-muted leading-relaxed">
                        {category.targetClients}
                      </span>
                    </div>
                  )}

                  {/* Typical Scenarios */}
                  {category.typicalScenarios && (
                    <div className="pt-2">
                      <strong className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                        Common Practice Triggers:
                      </strong>
                      <ul className="space-y-1.5 text-xs text-charcoal-muted">
                        {category.typicalScenarios.map((scen) => (
                          <li key={scen} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-dark shrink-0 mt-1.5" />
                            <span>{scen}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-border">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors btn-tactile"
                    >
                      <span>Inquire Regarding {category.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold" />
                    </Link>
                    <a
                      href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-brand-primary"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-dark" />
                      <span>{FIRM_DATA.contact.primaryPhone}</span>
                    </a>
                  </div>
                </div>

                {/* Right Service Scope Grid */}
                <div className="lg:col-span-7 bg-brand-surface rounded-xl p-6 sm:p-7 border border-border">
                  <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                    <h3 className="font-serif text-xs font-bold text-brand-primary uppercase tracking-wider">
                      Statutory Scope & Engagements Included
                    </h3>
                    <span className="text-[11px] text-emerald-800 font-semibold bg-brand-pale px-2 py-0.5 rounded border border-emerald-200">
                      Partner Oversight
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {category.services.map((item) => (
                      <div key={item} className="flex items-start gap-2.5 p-2 rounded-lg bg-white border border-border/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="text-xs text-charcoal font-medium leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs text-charcoal-muted">
                    <span>Compliant with prevailing Indian statutory frameworks</span>
                    <a
                      href={FIRM_DATA.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-800 hover:text-emerald-950 font-semibold hover:underline"
                    >
                      Quick WhatsApp Query →
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Discipline 06: Virtual CFO & Strategic Financial Retainer */}
          <div
            id="virtual-cfo"
            className="scroll-mt-28 p-6 sm:p-8 lg:p-10 rounded-xl border border-emerald-900 bg-[#0A2F24] text-white shadow-card card-tactile"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#0F3E2E] text-gold text-xs font-bold uppercase tracking-wider border border-gold/40">
                    Discipline 06
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-200 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                    Multi-Statute Strategic Retainer
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Virtual CFO & Retainership Practice
                </h2>

                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  Outsourced financial leadership, strategic cash flow governance, and consolidated compliance retainers designed for startups, MSMEs, and expanding enterprises that need high-level CFO expertise without the overhead of an in-house executive.
                </p>

                <div className="p-3.5 rounded-lg bg-[#0F3E2E] border border-emerald-800 text-xs">
                  <strong className="block text-[11px] uppercase tracking-wider text-gold font-bold mb-1">
                    Applicable Entities:
                  </strong>
                  <span className="text-emerald-200 leading-relaxed">
                    Funded Startups, Manufacturing MSMEs, Commercial Real Estate Developers & Mid-Market Firms
                  </span>
                </div>

                <div className="pt-2">
                  <strong className="block text-xs font-bold text-gold uppercase tracking-wider mb-2">
                    Common Practice Triggers:
                  </strong>
                  <ul className="space-y-1.5 text-xs text-emerald-100/90">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                      <span>Transitioning from basic book-keeping to predictive financial leadership</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                      <span>Preparing Bank Loan CMA data and project reports for working capital lines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                      <span>Mitigating compliance risk through annual multi-statute calendar oversight</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-emerald-800/80">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-dark hover:bg-gold text-white text-xs font-semibold transition-colors btn-tactile"
                  >
                    <span>Discuss Retainer Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <a
                    href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-200 hover:text-white"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold" />
                    <span>{FIRM_DATA.contact.primaryPhone}</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Retainer Engagements Included */}
              <div className="lg:col-span-7 bg-[#0F3E2E] rounded-xl p-6 sm:p-7 border border-emerald-800/90">
                <div className="flex items-center justify-between border-b border-emerald-800 pb-3 mb-4">
                  <h3 className="font-serif text-xs font-bold text-white uppercase tracking-wider">
                    Virtual CFO Mandate & Deliverables
                  </h3>
                  <span className="text-[11px] text-gold font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-gold/40">
                    CMA + FCA Supervision
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0A2F24] border border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-100 font-medium leading-relaxed">
                      Monthly MIS, Operating Variance & Unit Cost Modeling
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0A2F24] border border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-100 font-medium leading-relaxed">
                      Continuous Advance Tax & Quarterly TDS Structuring
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0A2F24] border border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-100 font-medium leading-relaxed">
                      Bank Credit Facility CMA Data & Project Reports
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0A2F24] border border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-100 font-medium leading-relaxed">
                      Multi-Branch GST Health Checks & ITC Maximization
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0A2F24] border border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-100 font-medium leading-relaxed">
                      Annual MCA & ROC Secretarial Governance Oversight
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 p-2 rounded-lg bg-[#0A2F24] border border-emerald-800/60">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-100 font-medium leading-relaxed">
                      Board-Level Strategic Counsel with CA KavithaVijay SRJ
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-emerald-800 flex items-center justify-between text-xs text-emerald-200">
                  <span>Structured annual or quarterly engagement retainers</span>
                  <a
                    href={FIRM_DATA.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-white font-semibold hover:underline"
                  >
                    Direct WhatsApp Query →
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONSULTATION CTA SECTION
          ========================================================================= */}
      <section className="py-16 bg-brand-surface border-t border-border text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
            Advisory & Retainerships
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
            Need Custom Corporate Structuring or Audit Consultation?
          </h2>
          <p className="mt-3 text-sm text-charcoal-muted leading-relaxed">
            We structure annual compliance calendars, virtual CFO retainerships, and multi-state GST reconciliations tailored to your operating scale.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-sm transition-colors btn-tactile"
            >
              <span>Schedule a Discussion</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-white text-brand-primary text-sm font-semibold hover:bg-brand-pale shadow-subtle transition-colors btn-tactile"
            >
              <Phone className="w-4 h-4 text-gold-dark" />
              <span>Call Senior Partner</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
