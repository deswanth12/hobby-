import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileCheck, 
  Search, 
  Scale, 
  Phone,
  BookOpen,
  Award,
  Layers,
  FileSignature,
  CheckCircle2,
  ChevronRight,
  Home,
  MessageSquare,
  CheckSquare
} from 'lucide-react';
import { FIRM_DATA } from '../../../data/firmData';
import { SEOHead } from '../../../components/SEOHead';
import { getPublishedFaqs } from '../../adapters/contentAdapter';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StatutoryChecklistModal } from '../../components/common/StatutoryChecklistModal';
import { getRouteWhatsAppUrl } from '../../adapters/backendAdapter';

export const AuditAssurancePage: React.FC = () => {
  const firm = FIRM_DATA;
  const [checklistOpen, setChecklistOpen] = useState(false);
  const auditFaqs = getPublishedFaqs('audit-assurance');

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Audit & Assurance', path: '/services/audit-assurance' }
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title="Statutory Audit in Tirupati | Tax & Internal Audits | Kavitha & Associates"
        description="Independent Statutory Audit under Companies Act 2013, Tax Audit under Sec 44AB, Internal Audit, Concurrent Audit & Stock Verification in Tirupati, AP."
        canonicalPath="/services/audit-assurance"
        breadcrumbs={breadcrumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Statutory, Tax & Internal Audit Services in Tirupati',
            serviceType: 'Audit and Assurance',
            provider: {
              '@type': 'AccountingService',
              '@id': 'https://kavithaassociates.com/#organization',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/',
              telephone: firm.contact.primaryPhone,
            },
            areaServed: ['Tirupati', 'Sri City', 'Renigunta', 'Chittoor', 'Andhra Pradesh', 'India'],
            description: 'Comprehensive audit practice supervised by CA Kavitha Vijay, ensuring independent statutory opinions, IFC evaluations, and Sec 44AB tax audit certifications.'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: auditFaqs.map(f => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          },
        ]}
      />

      {/* 1. Header Banner */}
      <section className="bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#AAB4A0]">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#F1EBDD] transition-colors min-h-[44px]">
              <Home className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/50" />
            <Link to="/services" className="hover:text-[#F1EBDD] transition-colors min-h-[44px] inline-flex items-center">
              <span>Services</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/50" />
            <span className="text-[#B49A64] font-semibold">Audit &amp; Assurance</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="kicker">PRAC-01 / AUDIT &amp; ASSURANCE</Badge>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#B49A64]">
                <ShieldCheck className="w-4 h-4 text-[#B49A64] shrink-0" />
                <span>Dedicated Audit Practice • Tirupati Chambers</span>
              </div>
            </div>

            <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-tight">
              Evidence-Based Rigor. Institutional Trust.
            </h1>

            <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed">
              Independent, rigorous, and compliant audits that foster trust with lenders, investors, regulatory bodies, and boards of directors. Directly led by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI, former Deloitte Big 4 field senior on ₹1,000 Cr IPO, and Ford MNC internal auditor).
            </p>
          </div>
        </div>
      </section>

      {/* 2. Standards on Auditing (SAs) Governance Strip */}
      <section className="py-10 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Methodology Benchmark
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  ICAI Standards on Auditing (SAs)
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Strict adherence to mandatory Indian and international auditing benchmarks (SAs 200–599) and CARO 2020.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Assurance Integrity
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  Substantive Testing &amp; Evidence
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Rigorous verification, sampling methodology, external confirmations (SA 505), and analytical review procedures.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border border-[#D8D0BE] shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                <Scale className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F1EBDD] text-[#7E5E1E] font-mono text-[10px] font-semibold border border-[#D8D0BE]">
                  Direct Partner Sign-Off
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529]">
                  Partner Supervision with UDIN
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Supervised and signed by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI) with mandatory UDIN generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4-Phase Audit Lifecycle */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12 space-y-2">
            <Badge variant="gold">SYSTEMATIC ASSURANCE WORKFLOW</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
              The 4-Phase Audit Lifecycle
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              Every audit engagement is managed through a structured, 4-phase audit lifecycle adhering to ICAI quality control guidelines (SQC 1).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#183529]/10 text-[#183529] font-mono text-xs font-semibold">
                    Phase 01
                  </span>
                  <BookOpen className="w-4 h-4 text-[#B49A64]" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529] mb-2">
                  Planning &amp; Risk Assessment
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Engagement scoping, preliminary analytical reviews, assessing entity risk under SA 300 &amp; SA 315, and establishing materiality thresholds (SA 320).
                </p>
              </div>
            </div>

            <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#183529]/10 text-[#183529] font-mono text-xs font-semibold">
                    Phase 02
                  </span>
                  <Layers className="w-4 h-4 text-[#B49A64]" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529] mb-2">
                  Substantive Testing &amp; Controls
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Test of Internal Financial Controls (ICFR), sampling of ledger entries, independent external confirmations under SA 505, and physical stock counts.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#183529]/10 text-[#183529] font-mono text-xs font-semibold">
                    Phase 03
                  </span>
                  <FileSignature className="w-4 h-4 text-[#B49A64]" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529] mb-2">
                  Partner Concurrence
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Independent technical review by CA Kavitha Vijay, management representation letters (SA 580), and resolution of critical audit findings.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#183529]/10 text-[#183529] font-mono text-xs font-semibold">
                    Phase 04
                  </span>
                  <Award className="w-4 h-4 text-[#B49A64]" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#183529] mb-2">
                  UDIN &amp; Archival
                </h3>
                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                  Issuance of True and Fair Auditor's Report (SA 700 series), generation of mandatory ICAI Unique Document Identification Number (UDIN), and secure file archival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 9 Disciplines of Our Audit Practice */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-2">
            <Badge variant="statutory">STATUTORY SCOPE &amp; ASSURANCE STREAMS</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
              The 9 Disciplines of Our Audit Practice
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              Comprehensive breakdown of statutes, regulatory mandates, formal deliverables, and applicable entities for each assurance stream.
            </p>
          </div>

          {/* Stream 01 Flagship Plaque: Companies Act Statutory Audit */}
          {firm.auditSpotlight.services[0] && (
            <div className="p-7 sm:p-10 lg:p-12 rounded-3xl bg-[#071B14] text-[#F1EBDD] border border-[#B49A64]/40 shadow-xl relative overflow-hidden">
              <div className="space-y-6">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#183529] text-[#B49A64] font-mono text-xs font-semibold border border-[#B49A64]/40">
                    Flagship Assurance Discipline • Stream 01
                  </span>
                  <span className="font-mono text-xs text-[#AAB4A0] bg-[#0B241C] px-3 py-1 rounded-full border border-white/10">
                    {firm.auditSpotlight.services[0].statute}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-4">
                    <h3 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD]">
                      {firm.auditSpotlight.services[0].name}
                    </h3>
                    <p className="font-editorial-body text-xs sm:text-sm text-[#F1EBDD]/80 leading-relaxed">
                      {firm.auditSpotlight.services[0].scope}
                    </p>
                    <div className="p-4 rounded-xl bg-[#183529]/70 border border-[#B49A64]/25 space-y-2 text-xs">
                      <div>
                        <strong className="text-[#B49A64] font-mono uppercase tracking-wider block mb-0.5">
                          Formal Statutory Deliverable:
                        </strong>
                        <span className="text-[#F1EBDD]/90">{firm.auditSpotlight.services[0].deliverable}</span>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <strong className="text-[#B49A64] font-mono uppercase tracking-wider block mb-0.5">
                          Mandatory Applicable Entities:
                        </strong>
                        <span className="text-[#F1EBDD]/90">{firm.auditSpotlight.services[0].applicableEntity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-[#183529]/80 rounded-2xl p-6 border border-[#B49A64]/30 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#B49A64] font-semibold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>ICAI Mandatory Compliance</span>
                    </div>
                    <ul className="space-y-2 text-xs text-[#F1EBDD]/80">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                        <span>CARO 2020 Reporting Clauses</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                        <span>Internal Financial Controls (IFC)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                        <span>Form ADT-1 / AOC-4 Filings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                        <span>Mandatory UDIN Authentication</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <Button to="/contact" variant="primary" size="sm" className="w-full">
                        Inquire Regarding Statutory Audit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2-Col Grid for Streams 02-09 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {firm.auditSpotlight.services.slice(1).map((audit, idx) => (
              <div 
                key={idx} 
                className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#183529]/10 text-[#183529] font-mono text-xs font-semibold">
                      Stream 0{idx + 2}
                    </span>
                    <span className="font-mono text-[11px] text-[#7E5E1E] bg-[#FAF7F0] px-2.5 py-0.5 rounded-full border border-[#D8D0BE]">
                      {audit.statute}
                    </span>
                  </div>

                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#183529]">
                    {audit.name}
                  </h4>

                  <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                    {audit.scope}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#D8D0BE]/70 text-xs space-y-1.5">
                    <div>
                      <strong className="text-[#7E5E1E] font-mono text-[11px] block">Deliverable:</strong>
                      <span className="text-[#35271F]">{audit.deliverable}</span>
                    </div>
                    <div>
                      <strong className="text-[#7E5E1E] font-mono text-[11px] block">Applicability:</strong>
                      <span className="text-[#525954]">{audit.applicableEntity}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#D8D0BE]/60 flex items-center justify-between text-xs">
                  <span className="text-[#525954]">Partner Supervision</span>
                  <Link
                    to="/contact"
                    className="text-[#183529] hover:text-[#071B14] font-semibold inline-flex items-center gap-1 min-h-[44px]"
                  >
                    <span>Engage Practice &rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Dual CA + CMA Audit Advantage */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <Badge variant="gold">COMPETITIVE DIFFERENTIATION</Badge>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
              The Dual CA + CMA Audit Advantage
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              Why our dual accreditation delivers deeper assurance than single-discipline audit firms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FAF7F0] p-7 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#183529]/10 text-[#183529] font-mono text-xs font-semibold">
                ICAI Chartered Accountant
              </span>
              <h3 className="font-serif text-xl font-bold text-[#183529]">
                External Statutory Rigor
              </h3>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                Companies Act compliance, true &amp; fair view certification, CARO 2020 verification, tax audit Form 3CD integrity, and formal statutory reporting to boards and shareholders.
              </p>
            </div>

            <div className="bg-[#FAF7F0] p-7 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#B49A64]/20 text-[#7E5E1E] font-mono text-xs font-semibold">
                ICMAI Cost Accountant (AIR 49)
              </span>
              <h3 className="font-serif text-xl font-bold text-[#183529]">
                Internal Operational Depth
              </h3>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                Unit cost analysis, margin leak identification, inventory valuation under Ind AS 2, working capital optimization, and operational efficiency reviews that traditional financial audits miss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Statutory Timelines & Readiness CTA */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#FAF7F0] text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <Badge variant="gold">PLAN UPCOMING AUDIT CYCLE</Badge>
          <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#183529]">
            Prepare Your Organization for Statutory Audit
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
            Reach out to our Tirupati chambers to schedule pre-audit readiness reviews, verify CARO 2020 documentation, or structure concurrent audit mandates.
          </p>
          <div className="pt-4 flex justify-center gap-3 flex-wrap">
            <Button to="/contact" variant="primary" size="md" dualArrow>
              Schedule Audit Consultation
            </Button>
            <a
              href={getRouteWhatsAppUrl('/services/audit-assurance')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>WhatsApp Audit Desk</span>
            </a>
            <button
              type="button"
              onClick={() => setChecklistOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#B49A64] border border-[#B49A64]/50 text-xs font-semibold transition-all hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
            >
              <CheckSquare className="w-4 h-4 text-[#B49A64]" />
              <span>Audit Readiness Kit</span>
            </button>
            <Button href={`tel:${firm.contact.primaryPhoneClean}`} variant="outline" size="md" leftIcon={<Phone className="w-4 h-4 text-[#B49A64]" />}>
              Call Senior Partner
            </Button>
          </div>
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

export default AuditAssurancePage;
