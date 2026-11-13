import React from 'react';
import { 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  Phone
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { getAllServices, getAuditSpotlightServices } from '../adapters/contentAdapter';
import { useFirmProfile } from '../adapters/backendAdapter';
import { Button } from '../components/common/Button';
import { SectionAccent, DotGrid, ArchitecturalLines, DecorativeLayer } from '../components/decorative';
import { Badge } from '../components/common/Badge';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animation';

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
  const services = getAllServices();
  const auditServices = getAuditSpotlightServices();

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
              <a href="#audit-spotlight-banner" className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile">
                Audit &amp; Assurance ({auditServices.length} Streams)
              </a>
              <a href="#income-tax" className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile">
                Income Tax
              </a>
              <a href="#gst" className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile">
                GST Compliance
              </a>
              <a href="#corporate-business" className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile">
                ROC &amp; Corporate
              </a>
              <a href="#rera-compliance" className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile">
                RERA Practice
              </a>
              <a href="#virtual-cfo" className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#183529] text-[#F1EBDD] border border-[#B49A64]/40 text-xs font-semibold hover:bg-[#071B14] transition-colors btn-tactile">
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

      {/* 4. The Practice Disciplines (5:7 Grid Ledgers with 34 Sub-Service Scopes) */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {services.map((category, idx) => (
            <Reveal key={category.id} delay={60 + idx * 30} duration={650}>
              <div
                id={category.id}
                className="scroll-mt-32 p-6 sm:p-10 lg:p-12 rounded-2xl border border-[#D8D0BE] bg-[#FAF7F0] shadow-card relative transition-all duration-300 hover:border-[#B49A64]/60"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                  {/* Left 5 Cols: Discipline Overview */}
                  <div className="lg:col-span-5 space-y-5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#183529]/10 text-[#183529] font-mono text-xs font-semibold border border-[#183529]/20">
                        Discipline 0{idx + 1}
                      </span>
                      {category.statutoryFramework && (
                        <span className="font-mono text-[11px] text-[#7E5E1E] bg-[#F1EBDD] px-2.5 py-0.5 rounded-full border border-[#D8D0BE]">
                          {category.statutoryFramework}
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183529]">
                      {category.title}
                    </h2>

                    <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                      {category.fullDescription}
                    </p>

                    {category.targetClients && (
                      <div className="p-4 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] text-xs">
                        <strong className="block font-mono text-[11px] font-bold text-[#7E5E1E] uppercase tracking-wider mb-1">
                          Applicable Entities:
                        </strong>
                        <span className="font-editorial-body text-[#35271F] leading-relaxed">
                          {category.targetClients}
                        </span>
                      </div>
                    )}

                    {category.typicalScenarios && (
                      <div className="pt-2">
                        <strong className="block font-serif text-xs font-bold text-[#183529] mb-2 uppercase tracking-wider">
                          Common Practice Triggers:
                        </strong>
                        <ul className="space-y-1.5 text-xs text-[#525954]">
                          {category.typicalScenarios.map((scen, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0 mt-1.5" />
                              <span>{scen}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-[#D8D0BE]">
                      {DEDICATED_PRACTICE_PAGES[category.id] && (
                        <Button
                          to={DEDICATED_PRACTICE_PAGES[category.id].path}
                          variant="secondary"
                          size="sm"
                          dualArrow
                        >
                          {DEDICATED_PRACTICE_PAGES[category.id].label}
                        </Button>
                      )}
                      <Button
                        to="/contact"
                        variant="primary"
                        size="sm"
                      >
                        Inquire Regarding {category.title}
                      </Button>
                    </div>
                  </div>

                  {/* Right 7 Cols: Ruled Service Scope Ledger */}
                  <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#D8D0BE] shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#D8D0BE] pb-3 mb-5">
                      <h3 className="font-serif text-sm font-bold text-[#183529] uppercase tracking-wider">
                        Statutory Scope &amp; Engagements Included ({category.services.length} Scopes)
                      </h3>
                      <Badge variant="statutory">Partner Supervision</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {category.services.map((scopeItem, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF7F0] border border-[#D8D0BE]/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B49A64]/40">
                          <CheckCircle2 className="w-4 h-4 text-[#183529] shrink-0 mt-0.5" />
                          <span className="font-editorial-body text-xs text-[#35271F] font-medium leading-relaxed">
                            {scopeItem}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#D8D0BE]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#525954]">
                      <span>Compliant with prevailing Indian statutory frameworks</span>
                      <a
                        href={firmProfile.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#183529] hover:text-[#071B14] font-semibold inline-flex items-center gap-1 min-h-[44px]"
                      >
                        <span>Quick WhatsApp Query</span>
                        <span>&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}

          {/* Discipline 06: Deep Evergreen Virtual CFO Showcase */}
          <Reveal delay={120} duration={650}>
            <div
              id="virtual-cfo"
              className="scroll-mt-32 p-7 sm:p-10 lg:p-12 rounded-2xl border border-[#B49A64]/40 bg-[#071B14] text-[#F1EBDD] shadow-2xl transition-all duration-300 hover:border-[#B49A64]/80"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                <div className="lg:col-span-5 space-y-5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#183529] text-[#B49A64] font-mono text-xs font-semibold border border-[#B49A64]/40">
                      Discipline 06
                    </span>
                    <span className="font-mono text-[11px] text-[#AAB4A0] bg-[#0B241C] px-2.5 py-0.5 rounded-full border border-white/10">
                      Multi-Statute Strategic Retainer
                    </span>
                  </div>

                  <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD]">
                    Virtual CFO &amp; Retainership Practice
                  </h2>

                  <p className="font-editorial-body text-xs sm:text-sm text-[#F1EBDD]/80 leading-relaxed">
                    Outsourced financial leadership, strategic cash flow governance, and consolidated compliance retainers designed for startups, MSMEs, and expanding enterprises that need high-level CFO expertise without the overhead of an in-house executive.
                  </p>

                  <div className="p-4 rounded-xl bg-[#183529]/60 border border-[#B49A64]/25 text-xs">
                    <strong className="block font-mono text-[11px] text-[#B49A64] uppercase tracking-wider mb-1">
                      Applicable Entities:
                    </strong>
                    <span className="text-[#F1EBDD]/90 leading-relaxed">
                      Funded Startups, Manufacturing MSMEs, Commercial Real Estate Developers &amp; Mid-Market Enterprises
                    </span>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-white/10">
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
                  </div>
                </div>

                <div className="lg:col-span-7 bg-[#183529]/70 rounded-2xl p-6 sm:p-8 border border-[#B49A64]/25">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
                    <h3 className="font-serif text-sm font-bold text-[#F1EBDD] uppercase tracking-wider">
                      Virtual CFO Mandate &amp; Deliverables
                    </h3>
                    <Badge variant="kicker">CMA + CA Supervision</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      'Monthly MIS, Operating Variance & Unit Cost Modeling',
                      'Continuous Advance Tax & Quarterly TDS Structuring',
                      'Bank Credit Facility CMA Data & Project Reports',
                      'Multi-Branch GST Health Checks & ITC Maximization',
                      'Annual MCA & ROC Secretarial Governance Oversight',
                      'Board-Level Strategic Counsel with CA Kavitha Vijay'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#071B14]/80 border border-[#B49A64]/20 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B49A64]/50">
                        <CheckCircle2 className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                        <span className="text-xs text-[#F1EBDD]/90 font-medium leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#AAB4A0]">
                    <span>Structured annual or quarterly engagement retainers</span>
                    <a
                      href={firmProfile.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B49A64] hover:text-[#F1EBDD] font-semibold inline-flex items-center gap-1 min-h-[44px]"
                    >
                      <span>Direct WhatsApp Query &rarr;</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
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
              <div className="pt-4 flex justify-center gap-4 flex-wrap">
                <Button to="/contact" variant="primary" size="md" dualArrow>
                  Schedule a Discussion
                </Button>
                <Button href={`tel:${firmProfile.contact.primaryPhoneClean}`} variant="outline" size="md" leftIcon={<Phone className="w-4 h-4 text-[#B49A64]" />}>
                  Call Senior Partner
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
