import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Building2, 
  BarChart3, 
  MapPin, 
  ArrowRight, 
  Users, 
  Phone, 
  Mail, 
  Briefcase, 
  ChevronRight,
  ShieldCheck,
  Rocket,
  Factory,
  Home,
  ShoppingCart,
  Stethoscope,
  GraduationCap,
  Globe,
  UserCheck,
  HeartHandshake,
  Compass
} from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { ContactForm } from '../components/ContactForm';
import { KnowledgeFAQ } from '../components/KnowledgeFAQ';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  // Contextual icon map for the 10 industry sectors
  const getIndustryIcon = (industryName: string) => {
    switch (industryName) {
      case 'Startups':
        return Rocket;
      case 'MSMEs':
        return Building2;
      case 'Manufacturing':
        return Factory;
      case 'Real Estate & Construction':
        return Home;
      case 'Retail & Trading':
        return ShoppingCart;
      case 'Healthcare':
        return Stethoscope;
      case 'Education':
        return GraduationCap;
      case 'E-Commerce':
        return Globe;
      case 'Professionals & Consultants':
        return UserCheck;
      case 'NGOs & Trusts':
        return HeartHandshake;
      default:
        return Building2;
    }
  };

  return (
    <div className="bg-brand-warm page-reveal">
      <SEOHead
        title="Chartered Accountants & Cost Accountants | Tirupati & Pan India"
        description="Independent Chartered Accountancy practice led by CA KavithaVijay SRJ (B.Com, FCA, CMA). Professional support across Statutory Audit, Income Tax, GST, Corporate Compliance, and Strategic Advisory."
        canonicalPath="/"
      />
      {/* =========================================================================
          1. HERO SECTION (Executive Architectural Design — ₹50,000 Standard)
          ========================================================================= */}
      <section className="bg-brand-warm pt-12 sm:pt-20 pb-16 lg:pb-24 border-b border-border relative overflow-hidden">
        {/* Subtle architectural ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-pale/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Authoritative Editorial Headlines */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Institutional Practice Kicker */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-surface border border-border/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-semibold text-brand-primary tracking-wider uppercase">
                  Independent Chartered Accountancy Practice • Tirupati, AP
                </span>
              </div>

              {/* Master Headline (Cormorant Garamond Luxury Serif) */}
              <div className="space-y-1">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold text-brand-primary tracking-tight leading-[1.1]">
                  Statutory Rigor.
                </h1>
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold text-gold-dark tracking-tight leading-[1.1]">
                  Practical Commercial Counsel.
                </h1>
              </div>

              {/* Authoritative Lead Narrative */}
              <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed max-w-2xl font-normal">
                Founded by <strong className="text-brand-primary font-semibold">CA KavithaVijay SRJ (B.Com, FCA, CMA)</strong>, our practice bridges rigorous statutory assurance with strategic financial governance. We safeguard corporate compliance, navigate complex tax scrutiny, and deliver direct partner-level counsel to enterprises, MSMEs, and institutions across South India.
              </p>

              {/* Primary Call to Action Cluster */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#contact-section"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-card hover:shadow-card-hover border border-gold/30 transition-all focus:ring-2 focus:ring-brand-primary btn-tactile"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-border bg-white text-brand-primary text-sm font-semibold hover:bg-brand-surface hover:border-gold/60 shadow-subtle transition-all focus:ring-2 focus:ring-brand-primary btn-tactile"
                >
                  <span>Explore Practice Disciplines</span>
                </Link>

                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-charcoal hover:text-brand-primary py-2.5 px-3.5 rounded-xl hover:bg-brand-surface transition-colors btn-tactile"
                  title="Direct telephone line"
                >
                  <Phone className="w-4 h-4 text-gold-dark" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>

              {/* Trust Creed Strip (From Client Business Card) */}
              <div className="pt-3 border-t border-border/60 flex flex-wrap items-center gap-3 text-xs text-charcoal-muted font-bold tracking-widest uppercase">
                <span className="text-brand-primary">TRUST</span>
                <span className="text-gold-dark">•</span>
                <span className="text-brand-primary">EXPERTISE</span>
                <span className="text-gold-dark">•</span>
                <span className="text-brand-primary">YOUR GROWTH PARTNER</span>
                <span className="text-gold-dark hidden sm:inline">•</span>
                <span className="text-emerald-800 hidden sm:inline font-semibold">ESTABLISHED PRACTICE</span>
              </div>
            </div>

            {/* Right Column: Executive Practice Registry Plaque (Signature Component) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A2F24] text-white rounded-2xl shadow-card-hover p-6 sm:p-8 border border-gold/40 relative overflow-hidden card-tactile">
                
                {/* Decorative subtle seal watermark */}
                <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-gold/5 border border-gold/10 pointer-events-none" />

                {/* Plaque Header & Monogram Seal */}
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-5 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#0F3E2E] border border-gold/60 flex items-center justify-center font-serif text-xl font-bold text-gold shadow-sm">
                      KA
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gold block">
                        PRACTICE REGISTER • ESTD. TIRUPATI
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
                        Kavitha & Associates
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Senior Partner Credential Block */}
                <div className="bg-[#0F3E2E] rounded-xl p-4 border border-emerald-800/90 mb-5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-light bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Senior Partner
                    </span>
                    <span className="text-[10px] text-emerald-200/80">ICAI Fellow & ICMAI</span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-white mt-1">
                    {FIRM_DATA.partner.name}
                  </h4>
                  <p className="text-xs text-gold font-semibold tracking-wide">
                    {FIRM_DATA.partner.qualifications} (Dual Qualifications)
                  </p>
                </div>

                {/* Architectural Ledger Rows */}
                <div className="space-y-3 text-xs text-emerald-100/90 divide-y divide-emerald-800/60 pt-1">
                  
                  {/* Chambers & GPS */}
                  <div className="flex items-start justify-between gap-3 pt-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white block text-xs">Principal Chambers:</strong>
                        <span className="text-emerald-200/90 text-[11px]">Bairagi Patteda, Tirupati – 517501, AP</span>
                      </div>
                    </div>
                    <a
                      href={FIRM_DATA.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-gold hover:underline shrink-0 mt-0.5"
                    >
                      Map Pin →
                    </a>
                  </div>

                  {/* Dual Competence */}
                  <div className="flex items-start gap-2 pt-3">
                    <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Dual Strategic Advantage:</strong>
                      <span className="text-emerald-200/90 text-[11px]">External Statutory Audit + Internal Cost Accounting (CMA)</span>
                    </div>
                  </div>

                  {/* Core Coverage Corridors */}
                  <div className="flex items-start gap-2 pt-3">
                    <Compass className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Regional Service Corridors:</strong>
                      <span className="text-emerald-200/90 text-[11px]">Tirupati, Chennai, Bengaluru, Hyderabad & Coimbatore</span>
                    </div>
                  </div>

                  {/* Partner Supervision */}
                  <div className="flex items-start gap-2 pt-3">
                    <UserCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block text-xs">Partner-Supervised Accountability:</strong>
                      <span className="text-emerald-200/90 text-[11px]">Every file reviewed directly by CA KavithaVijay SRJ</span>
                    </div>
                  </div>

                </div>

                {/* Plaque Footer & Direct Action */}
                <div className="mt-5 pt-4 border-t border-emerald-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Practice Chambers Open</span>
                  </div>
                  <a
                    href={FIRM_DATA.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold hover:text-white font-semibold text-xs transition-colors"
                  >
                    <span>Direct WhatsApp Desk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          PRACTICE QUICK-JUMP NAVIGATION STRIP (Carvi Approachable Navigation)
          ========================================================================= */}
      <nav aria-label="Practice Disciplines Quick Navigation" className="bg-brand-surface py-3.5 border-b border-border sticky top-[57px] sm:top-[65px] z-30 shadow-xs backdrop-blur-sm bg-brand-surface/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider shrink-0 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-gold-dark" />
              <span>Practice Disciplines:</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <a href="#audit-spotlight" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                Audit & Assurance
              </a>
              <a href="#income-tax" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                Income Tax & Appeals
              </a>
              <a href="#gst" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                GST & ITC Optimization
              </a>
              <a href="#corporate-business" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                ROC & Virtual CFO
              </a>
              <a href="#rera-compliance" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                RERA Certifications
              </a>
              <a href="#advisory-consulting" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                Strategic Advisory
              </a>
              <a href="#knowledge-faq" className="px-3 py-1.5 rounded-lg bg-white border border-border text-xs font-semibold text-brand-primary hover:border-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile">
                Statutory FAQ
              </a>
              <a href="#contact-section" className="px-3 py-1.5 rounded-lg bg-brand-pale border border-emerald-300 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors btn-tactile">
                Direct Consultation
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          2. AUDIT SPOTLIGHT (Dual-Pane Statutory Audit Matrix — ₹50,000 Standard)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-brand-pale/50 border-b border-border scroll-mt-28" id="audit-spotlight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Sticky Assurance Briefing & Standards (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-primary text-gold text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                  <span>Assurance Spotlight</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight leading-tight">
                  Statutory, Tax & Operational Audit Schedule
                </h2>
                <p className="mt-3 text-sm text-charcoal-muted leading-relaxed">
                  Independent, thorough, and compliant audits that foster trust with lenders, investors, regulatory bodies, and corporate boards — delivered under the personal oversight of CA KavithaVijay SRJ.
                </p>
              </div>

              {/* ICAI Standards Guarantee Card */}
              <div className="bg-white rounded-xl p-5 border border-border shadow-card space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark block">
                  Methodology & Professional Standards
                </span>
                <div className="space-y-2 text-xs text-charcoal-muted">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                    <span>Strict compliance with ICAI Standards on Auditing (SAs)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                    <span>Internal Financial Controls (IFC) testing under Sec 143(3)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                    <span>Partner-supervised field audit and direct signature</span>
                  </div>
                </div>
              </div>

              {/* Direct Practice Links */}
              <div className="space-y-3 pt-1">
                <Link
                  to="/services/audit-assurance"
                  className="w-full inline-flex items-center justify-between px-5 py-3 rounded-xl bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep shadow-sm transition-colors btn-tactile"
                >
                  <span>Explore Dedicated Audit Hub</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </Link>
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="block text-center text-xs text-charcoal-muted hover:text-brand-primary py-1 font-medium"
                >
                  Statutory audit deadline approaching? Call <strong className="text-brand-primary font-semibold">{FIRM_DATA.contact.primaryPhone}</strong>
                </a>
              </div>
            </div>

            {/* Right Column: 9-Item Structured Assurance Dossier (8 cols) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FIRM_DATA.auditSpotlight.services.map((service, index) => (
                  <div
                    key={service.name}
                    className="bg-white rounded-xl p-5 border border-border shadow-card hover:border-gold/60 transition-all card-tactile flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-brand-pale px-2.5 py-0.5 rounded border border-emerald-200">
                          {service.statute}
                        </span>
                        <span className="font-serif text-xs font-bold text-charcoal-light">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-brand-primary leading-snug">
                        {service.name}
                      </h3>

                      <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                        {service.scope}
                      </p>

                      {service.deliverable && (
                        <div className="mt-3 pt-2.5 border-t border-border/60 text-[11px] text-charcoal-muted space-y-1 bg-brand-surface/60 p-2.5 rounded-lg">
                          <div>
                            <strong className="text-brand-primary font-semibold">Deliverable:</strong> {service.deliverable}
                          </div>
                          {service.applicableEntity && (
                            <div className="text-charcoal-light">
                              <strong className="text-emerald-800 font-semibold">Applies to:</strong> {service.applicableEntity}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-border/50 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                      <span>Partner Oversight</span>
                      <a
                        href={FIRM_DATA.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-dark hover:underline font-semibold"
                      >
                        Inquire Audit →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. FULL SERVICE SPECTRUM (Balanced 3x2 Editorial Grid — ₹50,000 Standard)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-brand-warm" id="services-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Our Practice Areas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              Comprehensive Financial, Tax & Regulatory Support
            </h2>
            <p className="text-base text-charcoal-muted mt-3">
              End-to-end professional disciplines under one roof, executed with rigorous diligence and transparent partner-level communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FIRM_DATA.serviceCategories.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="scroll-mt-28 bg-white rounded-xl border border-border p-6 sm:p-7 shadow-card card-tactile flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-pale text-brand-primary flex items-center justify-center border border-emerald-100">
                      {category.id === 'income-tax' && <FileText className="w-6 h-6 text-brand-primary" />}
                      {category.id === 'gst' && <BarChart3 className="w-6 h-6 text-brand-primary" />}
                      {category.id === 'corporate-business' && <Building2 className="w-6 h-6 text-brand-primary" />}
                      {category.id === 'rera-compliance' && <Briefcase className="w-6 h-6 text-brand-primary" />}
                      {category.id === 'advisory-consulting' && <Users className="w-6 h-6 text-brand-primary" />}
                    </div>
                    {category.statutoryFramework && (
                      <span className="text-[11px] font-semibold text-emerald-800 bg-brand-pale px-2.5 py-1 rounded border border-emerald-200 text-right max-w-[180px] leading-tight">
                        {category.statutoryFramework.split('&')[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-brand-primary mb-2">
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-4">
                    {category.shortDescription}
                  </p>

                  {category.targetClients && (
                    <div className="mb-4 p-2.5 rounded-lg bg-brand-surface/70 border border-border/60 text-xs">
                      <span className="font-semibold text-brand-primary block text-[11px] uppercase tracking-wider text-gold-dark mb-0.5">
                        Target Entities:
                      </span>
                      <p className="text-charcoal-muted text-[11px] leading-relaxed">
                        {category.targetClients}
                      </p>
                    </div>
                  )}

                  <div className="border-t border-border/60 pt-4">
                    <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block mb-2.5">
                      Key Engagements:
                    </span>
                    <ul className="space-y-2">
                      {category.services.slice(0, 5).map((srv) => (
                        <li key={srv} className="text-xs text-charcoal flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                          <span>{srv}</span>
                        </li>
                      ))}
                      {category.services.length > 5 && (
                        <li className="text-xs text-brand-primary font-medium pl-4 pt-1">
                          + {category.services.length - 5} additional specialized services
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-border flex items-center justify-between">
                  <Link
                    to={`/services#${category.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-deep group"
                  >
                    <span>View all {category.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gold-dark" />
                  </Link>
                  <a
                    href={FIRM_DATA.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
                  >
                    Inquire
                  </a>
                </div>
              </div>
            ))}

            {/* Coordinating 6th Card: Virtual CFO & Strategic Financial Retainer */}
            <div className="bg-[#0A2F24] text-white rounded-xl border border-emerald-900 p-6 sm:p-7 shadow-card card-tactile flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#0F3E2E] text-gold flex items-center justify-center border border-gold/40">
                    <ShieldCheck className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-[11px] font-semibold text-gold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                    Strategic Retainer
                  </span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  Virtual CFO & Retainerships
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
                  Outsourced financial leadership and integrated compliance retainers designed for high-growth enterprises and established businesses.
                </p>

                <div className="mb-4 p-2.5 rounded-lg bg-[#0F3E2E]/80 border border-emerald-800/80 text-xs">
                  <span className="font-semibold text-gold block text-[11px] uppercase tracking-wider mb-0.5">
                    Target Entities:
                  </span>
                  <p className="text-emerald-200/90 text-[11px] leading-relaxed">
                    Growth-Stage Startups, MSMEs & Established Corporate Enterprises
                  </p>
                </div>

                <div className="border-t border-emerald-800/80 pt-4">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider block mb-2.5">
                    Retainer Scope:
                  </span>
                  <ul className="space-y-2">
                    <li className="text-xs text-emerald-100/90 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                      <span>Monthly MIS & Operational Cash Flow Budgeting</span>
                    </li>
                    <li className="text-xs text-emerald-100/90 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                      <span>Continuous Advance Tax & Quarterly TDS Structuring</span>
                    </li>
                    <li className="text-xs text-emerald-100/90 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                      <span>Bank Loan CMA Data & Project Financial Modeling</span>
                    </li>
                    <li className="text-xs text-emerald-100/90 flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                      <span>Board-Level Fiscal Counseling with Senior Partner</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-emerald-800/80 flex items-center justify-between">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-white group"
                >
                  <span>Discuss Retainer Scope</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gold" />
                </Link>
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="text-[11px] font-semibold text-emerald-300 hover:text-white underline underline-offset-2"
                >
                  Call Directly
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3.5 HOW WE WORK (4-Step Engagement Process - Carvi Approachable Journey)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Our Methodology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
              How We Work With You
            </h2>
            <p className="text-base text-charcoal-muted mt-2">
              A structured, transparent 4-step engagement model ensuring regulatory compliance and proactive guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FIRM_DATA.workflow.map((flow) => (
              <div
                key={flow.step}
                className="bg-white rounded-xl p-6 border border-border shadow-card flex flex-col justify-between card-tactile relative"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-pale text-brand-primary flex items-center justify-center font-serif text-xl font-bold mb-4 border border-emerald-100 text-gold-dark">
                    {flow.step}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-primary mb-2">
                    {flow.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {flow.description}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-border/50 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                  <span>Partner-Supervised</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-xl bg-white border border-border shadow-subtle">
              <span className="text-xs text-charcoal font-medium">
                Ready to review your firm's compliance or upcoming audit requirements?
              </span>
              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors shadow-xs btn-tactile"
              >
                <span>Schedule a Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PRACTICE PHILOSOPHY & GOVERNANCE (NSKA Rigor + ICAI Commitment)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-pale/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Practice Philosophy & Governance
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
              Technical Excellence & Practical Thinking
            </h2>
            <p className="text-base text-charcoal-muted mt-3">
              {FIRM_DATA.philosophy.statement}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FIRM_DATA.philosophy.corePrinciples.map((principle, idx) => (
              <div
                key={principle.title}
                className="bg-white rounded-xl p-6 border border-border shadow-card flex items-start gap-4 card-tactile"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-emerald-200 text-gold-dark">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-primary mb-1">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Dual Qualification Advantage Panel */}
            <div className="bg-white rounded-xl p-6 border-2 border-gold/40 shadow-card flex items-start gap-4 card-tactile">
              <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-gold/40 text-gold-dark">
                ★
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg font-bold text-brand-primary">
                    Dual FCA & CMA Qualification
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-brand-pale text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                    Key Advantage
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  Chartered Accountancy (statutory reporting, tax audit, legal compliance) integrated with Cost & Management Accountancy (internal controls, unit cost optimization, working capital budgeting).
                </p>
              </div>
            </div>

            {/* ICAI Code of Ethics Commitment Panel */}
            <div className="bg-[#0A2F24] text-white rounded-xl p-6 border border-emerald-900 shadow-card flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0F3E2E] text-gold flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-gold/40">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white mb-1">
                  ICAI Code of Conduct & Independence
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and client confidentiality established by the Institute of Chartered Accountants of India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. INDUSTRIES WE SERVE (10 Contextual Sector Icons)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
                Industry Capabilities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
                Industries We Serve
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-md">
              Specialized accounting, tax structuring, and compliance practices tailored to the commercial realities of diverse sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {FIRM_DATA.industries.map((ind) => {
              const IconComp = getIndustryIcon(ind);
              return (
                <div
                  key={ind}
                  className="bg-white rounded-xl p-4 text-center border border-border shadow-subtle card-tactile group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center mx-auto mb-2.5 border border-emerald-100 group-hover:bg-white transition-colors">
                    <IconComp className="w-5 h-5 text-brand-primary" />
                  </div>
                  <span className="text-xs font-semibold text-brand-primary block leading-tight">
                    {ind}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SERVICE LOCATIONS & REACH (Source-backed)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-pale/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Geographic Presence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
              Service Locations & Reach
            </h2>
            <p className="text-sm text-charcoal-muted mt-2">
              Principal chambers established in Tirupati, extending active consultation and audit coverage across key southern economic centers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {FIRM_DATA.serviceFootprint.map((loc) => (
              <div
                key={loc.city}
                className={`rounded-xl p-5 border text-center card-tactile flex flex-col justify-between ${
                  loc.type === 'Primary Chambers'
                    ? 'bg-white border-2 border-brand-primary shadow-card relative'
                    : 'bg-white border-border shadow-subtle'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                    <MapPin className="w-5 h-5 text-emerald-800" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-primary">{loc.city}</h3>
                  <span className="text-xs text-charcoal-muted block mt-0.5">{loc.state}</span>
                  {loc.type === 'Primary Chambers' ? (
                    <span className="text-[11px] text-emerald-800 font-semibold block mt-1">
                      Bairagi Patteda
                    </span>
                  ) : (
                    <span className="text-[11px] text-charcoal-light block mt-1">
                      Client Corridor
                    </span>
                  )}
                </div>
                <div>
                  <span
                    className={`inline-block mt-3 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                      loc.type === 'Primary Chambers'
                        ? 'bg-brand-primary text-white'
                        : 'bg-brand-pale text-brand-primary border border-emerald-100'
                    }`}
                  >
                    {loc.type}
                  </span>
                  {loc.type === 'Primary Chambers' && (
                    <a
                      href={FIRM_DATA.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-[11px] text-gold-dark hover:underline font-semibold"
                    >
                      View on Map →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-charcoal-muted max-w-2xl mx-auto">
            <p>
              * Operational Note (For Discussion): Proposed representation listing Tirupati as the primary practice location with scheduled client coverage across Chennai, Bengaluru, Hyderabad, and Coimbatore. Subject to client confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. STATUTORY KNOWLEDGE & ADVISORY FAQ
          ========================================================================= */}
      <KnowledgeFAQ />

      {/* =========================================================================
          8. CONTACT & CONSULTATION SECTION
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-brand-warm" id="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
                  Connect With CA Kavitha & Associates
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
                  Let's Discuss Your Financial & Compliance Priorities
                </h2>
                <p className="text-sm text-charcoal-muted mt-3 leading-relaxed">
                  Whether you are planning statutory audits, seeking guidance on complex GST assessments, or setting up a corporate entity, our senior team is ready to assist.
                </p>
              </div>

              {/* Direct Communication Cards */}
              <div className="space-y-4 pt-1">
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-white group shadow-subtle card-tactile btn-tactile"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0 group-hover:bg-brand-deep transition-colors">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block">
                      Direct Telephone Line
                    </span>
                    <span className="text-sm font-bold text-brand-primary group-hover:text-brand-deep">
                      {FIRM_DATA.contact.primaryPhone}
                    </span>
                    <span className="block text-xs text-charcoal-muted mt-0.5">
                      Alternative: {FIRM_DATA.contact.secondaryPhone}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${FIRM_DATA.contact.email}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-border bg-white group shadow-subtle card-tactile btn-tactile"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0 group-hover:bg-brand-deep transition-colors">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block">
                      Official Practice Email
                    </span>
                    <span className="text-sm font-bold text-brand-primary group-hover:text-brand-deep break-all">
                      {FIRM_DATA.contact.email}
                    </span>
                    <span className="block text-xs text-charcoal-muted mt-0.5">
                      Prompt written response on professional queries
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-white shadow-subtle">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block">
                      Principal Practice Chambers
                    </span>
                    <span className="text-sm font-bold text-brand-primary">
                      {FIRM_DATA.contact.primaryLocation}
                    </span>
                    <span className="block text-xs text-charcoal-muted mt-0.5">
                      Serving clients across South India & Pan-India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
