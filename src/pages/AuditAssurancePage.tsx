import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  FileCheck, 
  Search, 
  Scale, 
  Phone,
  BookOpen,
  Award,
  Layers,
  FileSignature
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';
import { AnimatedDotPattern, LetterReveal, WordReveal, TextHighlight } from '../components/animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';
import { Breadcrumb } from '../components/Breadcrumb';

export const AuditAssurancePage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Audit & Assurance', path: '/services/audit-assurance' }
  ];

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="Statutory Audit in Tirupati | Tax & Internal Audits | Kavitha & Associates"
        description="Independent Statutory Audit under Companies Act 2013, Tax Audit under Sec 44AB, Internal Audit, Concurrent Audit & Stock Verification in Tirupati, AP."
        canonicalPath="/services/audit-assurance"
        breadcrumbs={breadcrumbs}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Statutory, Tax & Internal Audit Services',
          serviceType: 'Audit and Assurance',
          provider: {
            '@type': 'AccountingService',
            '@id': 'https://kavithaassociates.com/#organization',
            name: 'Kavitha & Associates',
            url: 'https://kavithaassociates.com/'
          },
          areaServed: 'Tirupati, Andhra Pradesh, India',
          description: 'Comprehensive audit practice supervised by CA Kavitha Vijay, ensuring independent statutory opinions, IFC evaluations, and Sec 44AB tax audit certifications.'
        }}
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-[#F8EFDF] py-10 sm:py-16 md:py-20 lg:py-28 border-b border-[#E8D5B5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbs} className="mb-6 sm:mb-8" />
          <div className="max-w-3xl scroll-reveal">
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="01" label="AUDIT & ASSURANCE" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/30 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#153F32] shrink-0" />
                <LetterReveal text="Dedicated Audit Practice • Tirupati Chambers" as="span" />
              </div>
            </div>
            <h1 className="font-editorial-h1 text-[#153F32] font-serif font-bold">
              <WordReveal text="Evidence-Based Rigor. Institutional Trust." as="span" />
            </h1>
            <p className="mt-4 font-editorial-body text-[#525954] leading-relaxed text-base sm:text-lg">
              Independent, rigorous, and compliant audits that foster trust with lenders, investors, regulatory bodies, and boards of directors. Directly led by <TextHighlight>CA Kavitha Vijay</TextHighlight> (ex-Deloitte Big 4 field senior on ₹1,000 Cr IPO, Ford MNC internal auditor, and CMA AIR 49).
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STANDARDS ON AUDITING (SAs) GOVERNANCE STRIP
          ========================================================================= */}
      <section className="py-12 bg-[#FFFDF7] border-b border-[#E8D5B5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-stagger">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-[#DDE8D9] text-[#153F32] flex items-center justify-center shrink-0 border border-[#153F32]/20">
                <FileCheck className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-[10px] font-semibold mb-2">Methodology Benchmark</span>
                <p className="font-serif text-lg font-bold text-[#153F32]">
                  ICAI Standards on Auditing (SAs)
                </p>
                <p className="font-editorial-body text-xs text-[#525954] mt-1 leading-relaxed">
                  Strict adherence to mandatory Indian and international auditing benchmarks (SAs 200–599) and CARO 2020.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-[#DDE8D9] text-[#153F32] flex items-center justify-center shrink-0 border border-[#153F32]/20">
                <Search className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-[10px] font-semibold mb-2">Assurance Integrity</span>
                <p className="font-serif text-lg font-bold text-[#153F32]">
                  Substantive Testing & Evidence
                </p>
                <p className="font-editorial-body text-xs text-[#525954] mt-1 leading-relaxed">
                  Rigorous verification, sampling methodology, external confirmations (SA 505), and analytical review procedures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-brand-white border border-brand-border shadow-subtle card-tactile scroll-reveal">
              <div className="w-12 h-12 rounded-xl bg-[#DDE8D9] text-[#153F32] flex items-center justify-center shrink-0 border border-[#153F32]/20">
                <Scale className="w-6 h-6 text-brand-forest" />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-[10px] font-semibold mb-2">Direct Partner Sign-Off</span>
                <p className="font-serif text-lg font-bold text-[#153F32]">
                  Direct Partner Supervision
                </p>
                <p className="font-editorial-body text-xs text-[#525954] mt-1 leading-relaxed">
                  Supervised and signed by CA Kavitha Vijay (B.Com, CA, CMA AIR 49, Chartered Accountant (ICAI Member)) with mandatory UDIN generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. THE 4-PHASE AUDIT LIFECYCLE
          ========================================================================= */}
      <section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden">
        {/* Decorative Animated Dot Pattern */}
        <div className="absolute top-8 right-8 pointer-events-none -z-0 opacity-45 hidden md:block">
          <AnimatedDotPattern rows={4} cols={6} variant="forest" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 scroll-reveal">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold mb-3">
              Systematic Assurance Workflow
            </span>
            <h2 className="font-editorial-h2 text-[#153F32] font-serif font-bold">
              The 4-Phase Audit Lifecycle
            </h2>
            <p className="font-editorial-body text-sm sm:text-base text-[#525954] mt-3 leading-relaxed">
              Every audit engagement is managed through a structured, 4-phase audit lifecycle adhering to the ICAI quality control guidelines (SQC 1).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scroll-stagger">
            <div className="bg-brand-white p-7 rounded-2xl border border-brand-border shadow-card card-tactile flex flex-col justify-between scroll-reveal relative card-v4-inner-border">
              <CornerBrackets size={12} variant="gold" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold">Phase 01</span>
                  <BookOpen className="w-4 h-4 text-brand-forest" />
                </div>
                <h3 className="font-editorial-h3 text-lg text-brand-forest mb-2">
                  Planning & Risk Assessment
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  Engagement scoping, preliminary analytical reviews, assessing entity risk under SA 300 & SA 315, and establishing materiality thresholds (SA 320).
                </p>
              </div>
            </div>

            <div className="bg-brand-white p-7 rounded-2xl border border-brand-border shadow-card card-tactile flex flex-col justify-between scroll-reveal relative card-v4-inner-border">
              <CornerBrackets size={12} variant="gold" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold">Phase 02</span>
                  <Layers className="w-4 h-4 text-brand-forest" />
                </div>
                <h3 className="font-editorial-h3 text-lg text-brand-forest mb-2">
                  Substantive Testing & Controls
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  Test of Internal Financial Controls (ICFR), sampling of ledger entries, independent external confirmations under SA 505, and physical stock counts.
                </p>
              </div>
            </div>

            <div className="bg-brand-white p-7 rounded-2xl border border-brand-border shadow-card card-tactile flex flex-col justify-between scroll-reveal relative card-v4-inner-border">
              <CornerBrackets size={12} variant="gold" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold">Phase 03</span>
                  <FileSignature className="w-4 h-4 text-brand-forest" />
                </div>
                <h3 className="font-editorial-h3 text-lg text-brand-forest mb-2">
                  Partner Concurrence
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  Independent technical review by CA Kavitha Vijay, management representation letters (SA 580), and resolution of critical audit findings.
                </p>
              </div>
            </div>

            <div className="bg-brand-white p-7 rounded-2xl border border-brand-border shadow-card card-tactile flex flex-col justify-between scroll-reveal relative card-v4-inner-border">
              <CornerBrackets size={12} variant="gold" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold">Phase 04</span>
                  <Award className="w-4 h-4 text-brand-forest" />
                </div>
                <h3 className="font-editorial-h3 text-lg text-brand-forest mb-2">
                  UDIN & Archival
                </h3>
                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  Issuance of True and Fair Auditor's Report (SA 700 series), generation of mandatory ICAI Unique Document Identification Number (UDIN), and secure file archival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE 9 STATUTORY AUDIT STREAMS (Asymmetric Catalog)
          ========================================================================= */}
      <section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFFDF7] border-b border-[#E8D5B5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 scroll-reveal">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold mb-3">
              <GeometricSymbol type="diamond" />
              <span>Statutory Scope &amp; Assurance Streams</span>
            </span>
            <h2 className="font-editorial-h2 text-[#153F32] font-serif font-bold">
              The 9 Disciplines of Our Audit Practice
            </h2>
            <p className="font-editorial-body text-sm sm:text-base text-brand-muted mt-3">
              Comprehensive breakdown of statutes, regulatory mandates, formal deliverables, and applicable entities for each assurance stream.
            </p>
          </div>

          {/* Asymmetric Catalog: Featured Stream 01 Plaque + 2-Col Grid for Streams 02-09 */}
          <div className="space-y-8">
            {firm.auditSpotlight.services.map((audit, idx) => {
              if (idx === 0) {
                // Featured Flagship Plaque for Companies Act Statutory Audit
                return (
                  <div 
                    key={audit.name}
                    className="double-bezel-dark scroll-reveal-scale"
                  >
                    <div 
                      className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 text-[#252B27] border-2 border-[#E8D5B5] shadow-editorial-lg relative card-v4-inner-border"
                    >
                      <CornerBrackets size={16} variant="gold" />
                      <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-[#E8D5B5] mb-6 gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className="font-editorial-meta text-[#153F32] bg-[#DDE8D9] px-3 py-1 rounded-full border border-[#153F32]/30 text-xs font-semibold">
                              {audit.statute}
                            </span>
                            <span className="font-editorial-meta text-[#7E5E1E] bg-[#E8D5B5] px-3 py-1 rounded-full border border-[#E8D5B5] text-xs font-semibold">
                              Featured Flagship Audit Stream 01
                            </span>
                          </div>
                          <h3 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#153F32]">
                            {audit.name}
                          </h3>
                        </div>
                        <span className="font-editorial-meta text-[#153F32] bg-[#DDE8D9] px-3 py-1.5 rounded-full border border-[#153F32]/20 text-xs font-semibold self-start lg:self-center">
                          Mandatory Annual Filing
                        </span>
                      </div>

                      <p className="font-editorial-body text-sm sm:text-base text-[#525954] leading-relaxed max-w-4xl mb-8">
                        {audit.scope}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-[#F8EFDF] border border-[#E8D5B5]">
                        <div>
                          <span className="font-editorial-meta text-[#7E5E1E] block mb-1 text-[11px] font-semibold">
                            Formal Deliverable:
                          </span>
                          <p className="font-editorial-body text-sm text-[#153F32] font-semibold">
                            {audit.deliverable}
                          </p>
                        </div>
                        <div>
                          <span className="font-editorial-meta text-[#7E5E1E] block mb-1 text-[11px] font-semibold">
                            Applicable Entities:
                          </span>
                          <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                            {audit.applicableEntity}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-[#E8D5B5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <span className="font-editorial-meta text-[#153F32] text-xs font-semibold">
                          Supervised & Signed by CA Kavitha Vijay (B.Com, CA, CMA AIR 49, Chartered Accountant (ICAI Member))
                        </span>
                        <a
                          href={firm.contact.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#153F32] hover:bg-[#102D25] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm hover:shadow-md border border-[#C3A66B]/50 btn-tactile"
                        >
                          <span>Inquire Statutory Audit</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }

              // Streams 02-09: Rendered in alternating asymmetric cards
              return null;
            })}

            {/* Grid for Streams 02 through 09 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-stagger">
              {firm.auditSpotlight.services.map((audit, idx) => {
                if (idx === 0) return null; // already rendered above

                return (
                  <div
                    key={audit.name}
                    className="bg-brand-white rounded-2xl p-7 sm:p-8 border border-brand-border shadow-card card-tactile flex flex-col justify-between scroll-reveal"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-editorial-meta text-brand-forest bg-brand-forest/10 px-3 py-1 rounded-full border border-brand-forest/20 text-xs">
                          {audit.statute}
                        </span>
                        <span className="font-editorial-meta text-brand-muted text-xs font-bold">
                          0{idx + 1}
                        </span>
                      </div>

                      <h3 className="font-editorial-h3 text-xl font-bold text-brand-forest mb-3">
                        {audit.name}
                      </h3>

                      <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
                        {audit.scope}
                      </p>

                      <div className="space-y-3 p-4 rounded-xl bg-brand-surface border border-brand-border text-xs font-editorial-body">
                        {audit.deliverable && (
                          <div>
                            <span className="font-editorial-meta text-brand-gold block text-[10px] mb-1">
                              Formal Deliverable:
                            </span>
                            <p className="text-brand-forest font-semibold text-xs">
                              {audit.deliverable}
                            </p>
                          </div>
                        )}
                        {audit.applicableEntity && (
                          <div className="pt-2 border-t border-brand-border/60">
                            <span className="font-editorial-meta text-brand-muted block text-[10px] mb-1">
                              Applies To:
                            </span>
                            <p className="text-brand-charcoal text-xs">
                              {audit.applicableEntity}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-brand-border flex items-center justify-between text-xs">
                      <span className="font-editorial-meta text-brand-forest text-[11px]">
                        Partner Supervision
                      </span>
                      <a
                        href={firm.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center text-brand-forest font-semibold hover:text-brand-deep underline underline-offset-2 text-xs"
                      >
                        Inquire Audit →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. DUAL CA + CMA AUDIT ADVANTAGE
          ========================================================================= */}
      <section className="py-10 sm:py-16 md:py-20 bg-[#DDE8D9] border-y border-[#E8D5B5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Defensible Assurance
            </span>
            <h2 className="font-editorial-h2 text-[#153F32] font-serif font-bold">
              The Dual CA + CMA Audit Advantage
            </h2>
            <p className="font-editorial-body text-sm sm:text-base text-[#525954] mt-3 leading-relaxed">
              Why commercial lenders, boards of directors, and institutional investors place higher trust in audits led by a dual Chartered Accountant & Cost Accountant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-white p-8 rounded-2xl border border-brand-border shadow-card card-tactile scroll-reveal-left">
              <span className="font-editorial-meta text-brand-gold block mb-2">ICAI Chartered Accountant</span>
              <h3 className="font-editorial-h3 text-xl text-brand-forest mb-3">External Statutory Rigor</h3>
              <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                Full compliance with Companies Act statutory frameworks, Tax Audits under Sec 44AB, true & fair financial reporting, and defensible audit opinions backed by rigorous working papers.
              </p>
            </div>

            <div className="bg-brand-white p-8 rounded-2xl border border-brand-border shadow-card card-tactile scroll-reveal-right">
              <span className="font-editorial-meta text-brand-gold block mb-2">ICMAI Cost Accountant (AIR 49)</span>
              <h3 className="font-editorial-h3 text-xl text-brand-forest mb-3">Internal Operational Depth</h3>
              <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                Unit-cost variance modeling, stock verification, internal controls (ICFR) testing, and margin leakage detection that standard statutory audits overlook.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. STATUTORY TIMELINES & AUDIT READINESS CTA
          ========================================================================= */}
      <section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#E8D5B5] text-center border-b border-[#E8D5B5]">
        <div className="max-w-3xl mx-auto px-4 scroll-reveal">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold mb-3">
            Statutory Timelines & Readiness
          </span>
          <h2 className="font-editorial-h2 text-[#153F32] font-serif font-bold">
            Plan Your Upcoming Financial Year Audit Cycle
          </h2>
          <p className="mt-4 font-editorial-body text-sm sm:text-base text-brand-muted leading-relaxed">
            Avoid last-minute statutory filing bottlenecks. Contact our chambers early to align documentation schedules, evaluate internal controls, and execute audit procedures smoothly.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="min-h-[44px] btn-pill-action bg-brand-forest text-white hover:bg-brand-deep group font-editorial-meta text-xs shadow-card hover:shadow-card-hover border border-brand-gold/40"
            >
              <span>Schedule Audit Consultation</span>
              <span className="icon-badge bg-white/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-deep">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
            <a
              href={`tel:${firm.contact.primaryPhoneClean}`}
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-border bg-brand-white text-brand-forest font-editorial-meta text-xs hover:bg-brand-surface shadow-subtle transition-colors duration-200 active:scale-[0.98] btn-tactile"
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
