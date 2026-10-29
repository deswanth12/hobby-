import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  FileCheck, 
  Search, 
  Scale, 
  Phone
} from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const AuditAssurancePage: React.FC = () => {
  return (
    <div className="bg-brand-warm page-reveal">
      <SEOHead
        title="Audit & Assurance Practice | Statutory, Tax & Internal Audits | Kavitha & Associates"
        description="Dedicated Audit & Assurance practice: Statutory Audits under Companies Act, Tax Audits under Sec 44AB, Internal Audits, Concurrent Audits, and Due Diligence in Tirupati, AP."
        canonicalPath="/services/audit-assurance"
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-[#0A2F24] text-white py-16 sm:py-20 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0F3E2E] text-gold text-xs font-bold uppercase tracking-wider mb-4 border border-gold/30">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Dedicated Audit Practice</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Audit & Assurance Services
            </h1>
            <p className="mt-4 text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              Independent, rigorous, and compliant audits that foster trust with lenders, investors, regulatory bodies, and boards of directors — delivered under direct partner-level oversight.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CORE METHODOLOGY & STANDARDS STRIP
          ========================================================================= */}
      <section className="py-6 bg-brand-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-charcoal">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100">
                <FileCheck className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <strong className="text-brand-primary block text-sm">ICAI Standards on Auditing (SAs)</strong>
                <p className="text-charcoal-muted mt-0.5">Strict adherence to mandatory Indian and international auditing benchmarks.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100">
                <Search className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <strong className="text-brand-primary block text-sm">Evidence-Based Substantive Testing</strong>
                <p className="text-charcoal-muted mt-0.5">Rigorous verification, sampling methodology, and analytical review procedures.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100">
                <Scale className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <strong className="text-brand-primary block text-sm">Direct Partner Supervision</strong>
                <p className="text-charcoal-muted mt-0.5">Supervised and signed by CA KavithaVijay SRJ (B.Com, FCA, CMA).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. 9 AUDIT PRACTICE STREAMS (Complete Technical Deliverables)
          ========================================================================= */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Statutory Scope & Assurance Streams
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary">
              The 9 Disciplines of Our Audit Practice
            </h2>
            <p className="text-sm sm:text-base text-charcoal-muted mt-2">
              Detailed breakdown of statutes, regulatory mandates, formal deliverables, and applicable entities for each assurance engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIRM_DATA.auditSpotlight.services.map((audit, idx) => (
              <div
                key={audit.name}
                className="bg-white rounded-xl p-6 border border-border shadow-card card-tactile flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gold-dark uppercase tracking-wider bg-brand-pale px-2.5 py-1 rounded border border-emerald-100">
                      {audit.statute}
                    </span>
                    <span className="text-xs font-serif font-bold text-charcoal-light">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">
                    {audit.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-4">
                    {audit.scope}
                  </p>

                  {/* Formal Deliverable & Applicable Entity */}
                  <div className="space-y-2 pt-3 border-t border-border/60 text-xs bg-brand-surface/60 p-3 rounded-lg">
                    {audit.deliverable && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark block">
                          Formal Deliverable:
                        </span>
                        <p className="text-brand-primary font-medium text-xs mt-0.5">
                          {audit.deliverable}
                        </p>
                      </div>
                    )}
                    {audit.applicableEntity && (
                      <div className="pt-1.5 border-t border-border/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                          Applies To:
                        </span>
                        <p className="text-charcoal-muted text-[11px] mt-0.5 leading-relaxed">
                          {audit.applicableEntity}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-semibold text-[11px]">
                    Supervised by Senior Partner
                  </span>
                  <a
                    href={FIRM_DATA.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary font-semibold hover:text-brand-deep underline underline-offset-2 text-[11px]"
                  >
                    Inquire Audit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. AUDIT PREPARATION & COMPLIANCE TIMELINE CTA
          ========================================================================= */}
      <section className="py-16 bg-brand-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block">
            Statutory Timelines & Readiness
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
            Plan Your Upcoming Financial Year Audit Cycle
          </h2>
          <p className="text-sm text-charcoal-muted max-w-xl mx-auto leading-relaxed">
            Avoid last-minute statutory filing bottlenecks. Contact our chambers early to align documentation schedules, evaluate internal controls, and execute audit procedures smoothly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-sm transition-colors btn-tactile"
            >
              <span>Schedule Audit Consultation</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-white text-brand-primary text-sm font-semibold hover:bg-brand-pale shadow-subtle transition-colors btn-tactile"
            >
              <Phone className="w-4 h-4 text-gold-dark" />
              <span>Call {FIRM_DATA.contact.primaryPhone}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
