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
  HeartHandshake
} from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { ContactForm } from '../components/ContactForm';
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
          1. HERO SECTION (Clean, Solid, Dignified Architecture)
          ========================================================================= */}
      <section className="bg-brand-warm pt-12 sm:pt-16 pb-16 lg:pb-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Headlines & Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Partner Credentials Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-pale border border-emerald-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-xs font-semibold text-brand-primary tracking-wider uppercase">
                  Chartered Accountant • Cost Accountant
                </span>
              </div>

              {/* Main Headline (Cormorant Garamond Luxury Serif) */}
              <h1 className="font-serif text-3xl sm:text-5xl md:text-5xl lg:text-[3.5rem] font-bold text-brand-primary tracking-tight leading-[1.14]">
                Trusted Financial, Tax and Compliance Support
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-2xl font-normal">
                Professional support across audit, income tax, GST, corporate compliance, and business advisory. Dependable, compliant, and growth-oriented counsel rooted in extensive technical expertise and partner-level accountability.
              </p>

              {/* Partner Credentials Card (Restrained, Architectural) */}
              <div className="bg-white rounded-xl border border-border p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block">
                    Practicing Chartered Accountant
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-brand-primary mt-0.5">
                    {FIRM_DATA.partner.name}
                  </h2>
                  <p className="text-xs text-charcoal-muted font-medium mt-1">
                    {FIRM_DATA.partner.qualifications} • Headquartered in Tirupati
                  </p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  <span className="text-xs text-charcoal-light uppercase tracking-wider block">Service Footprint</span>
                  <span className="text-xs font-semibold text-brand-primary">Tirupati & Pan-India</span>
                </div>
              </div>

              {/* Primary Call to Actions (Standardized, Solid, Authoritative) */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <a
                  href="#contact-section"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-sm transition-colors focus:ring-2 focus:ring-brand-primary btn-tactile"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border bg-white text-brand-primary text-sm font-semibold hover:bg-brand-pale shadow-subtle transition-colors focus:ring-2 focus:ring-brand-primary btn-tactile"
                >
                  <span>Explore Services</span>
                </Link>

                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-deep py-2 px-3 rounded-lg hover:bg-brand-pale transition-colors btn-tactile"
                >
                  <Phone className="w-4 h-4 text-gold-dark" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>

              {/* Trust Tagline (Directly from Client Business Card) */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-charcoal-muted font-semibold tracking-wider uppercase">
                <span className="text-brand-primary font-bold">TRUST</span>
                <span className="text-gold-dark">•</span>
                <span className="text-brand-primary font-bold">EXPERTISE</span>
                <span className="text-gold-dark">•</span>
                <span className="text-brand-primary font-bold">YOUR GROWTH PARTNER</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Feature Box (Solid Architectural Design) */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A2F24] text-white rounded-xl shadow-card p-6 sm:p-7 border border-emerald-900">
                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-5 mb-5">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                      Practice Snapshot
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                      Kavitha & Associates
                    </h3>
                  </div>
                  <div className="w-11 h-11 rounded-lg bg-[#0F3E2E] border border-gold/40 flex items-center justify-center font-serif text-lg font-bold text-gold-light">
                    KA
                  </div>
                </div>

                {/* 100% Source-Backed Core Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[#0F3E2E] rounded-lg p-3 border border-emerald-800/70">
                    <span className="block font-serif text-2xl font-bold text-gold">FCA & CMA</span>
                    <span className="text-xs text-emerald-100/90 font-medium">Dual Qualifications</span>
                  </div>
                  <div className="bg-[#0F3E2E] rounded-lg p-3 border border-emerald-800/70">
                    <span className="block font-serif text-2xl font-bold text-gold">5 Cities</span>
                    <span className="text-xs text-emerald-100/90 font-medium">Regional Reach</span>
                  </div>
                  <div className="bg-[#0F3E2E] rounded-lg p-3 border border-emerald-800/70">
                    <span className="block font-serif text-2xl font-bold text-gold">PAN India</span>
                    <span className="text-xs text-emerald-100/90 font-medium">Client Coverage</span>
                  </div>
                  <div className="bg-[#0F3E2E] rounded-lg p-3 border border-emerald-800/70">
                    <span className="block font-serif text-2xl font-bold text-gold">Partner</span>
                    <span className="text-xs text-emerald-100/90 font-medium">Direct Attention</span>
                  </div>
                </div>

                {/* Core Disciplines List */}
                <div className="space-y-2.5 text-xs text-emerald-100/90 border-t border-emerald-800/80 pt-4">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                    <span>Statutory, Internal & Tax Audit Rigor</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                    <span>Direct Tax Assessment & Scrutiny Representation</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                    <span>GST Returns, Audit & ITC Optimization</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                    <span>RERA & MCA Company Law Compliance</span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-emerald-800/60 text-xs text-emerald-200/80 flex items-center justify-between">
                  <span>Practice Location: Tirupati, AP</span>
                  <span className="text-gold font-medium">Professional Practice</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. AUDIT SPOTLIGHT (Featured in PDF Page 1)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-pale/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-primary text-gold text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>{FIRM_DATA.auditSpotlight.subtitle}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
              {FIRM_DATA.auditSpotlight.title}
            </h2>
            <p className="mt-3 text-base text-charcoal-muted leading-relaxed">
              {FIRM_DATA.auditSpotlight.description}
            </p>
          </div>

          {/* Audit Services Grid with Detailed Statute & Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIRM_DATA.auditSpotlight.services.map((service, index) => (
              <div
                key={service.name}
                className="bg-white rounded-xl p-6 border border-border shadow-card card-tactile flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gold-dark uppercase tracking-wider bg-brand-pale px-2.5 py-0.5 rounded border border-emerald-100">
                      {service.statute}
                    </span>
                    <span className="text-xs font-serif font-bold text-charcoal-light">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-brand-primary">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal-muted mt-2.5 leading-relaxed">
                    {service.scope}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/60 text-xs text-emerald-800 font-medium">
                  Supervised by CA KavithaVijay SRJ
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
            <Link
              to="/services/audit-assurance"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-deep underline underline-offset-4"
            >
              <span>Explore Dedicated Audit & Assurance Practice</span>
              <ChevronRight className="w-4 h-4 text-gold-dark" />
            </Link>

            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="text-xs font-semibold text-charcoal-muted hover:text-brand-primary"
            >
              Have an upcoming statutory audit deadline? Call {FIRM_DATA.contact.primaryPhone}
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FULL SERVICE SPECTRUM (Editorial Clean Architecture)
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
              End-to-end professional support under one roof, executed with rigorous diligence and transparent communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FIRM_DATA.serviceCategories.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="scroll-mt-24 bg-white rounded-xl border border-border p-6 sm:p-7 shadow-card card-tactile flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-pale text-brand-primary flex items-center justify-center mb-5 border border-emerald-100">
                    {category.id === 'income-tax' && <FileText className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'gst' && <BarChart3 className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'corporate-business' && <Building2 className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'rera-compliance' && <Briefcase className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'advisory-consulting' && <Users className="w-6 h-6 text-brand-primary" />}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-brand-primary mb-2">
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-4">
                    {category.shortDescription}
                  </p>

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

                <div className="pt-5 mt-5 border-t border-border">
                  <Link
                    to={`/services#${category.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-deep group"
                  >
                    <span>View all {category.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gold-dark" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. WHY WORK WITH KAVITHA & ASSOCIATES (Distinct 2-Column Editorial Grid)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Professional Foundation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
              Why Choose Kavitha & Associates?
            </h2>
            <p className="text-base text-charcoal-muted mt-2">
              Built on ethics, partner-level accessibility, and robust regulatory competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FIRM_DATA.pillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="bg-white rounded-xl p-6 border border-border shadow-card flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-emerald-200">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-primary mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}

            {/* ICAI Code of Ethics Commitment Panel */}
            <div className="bg-[#0A2F24] text-white rounded-xl p-6 border border-emerald-900 shadow-card flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0F3E2E] text-gold flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-gold/40">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white mb-1">
                  ICAI Code of Conduct & Ethics
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and data confidentiality established by the Institute of Chartered Accountants of India.
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
                className={`rounded-xl p-5 border text-center card-tactile ${
                  loc.type === 'Primary Chambers'
                    ? 'bg-white border-2 border-brand-primary shadow-card'
                    : 'bg-white border-border shadow-subtle'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-primary">{loc.city}</h3>
                <span className="text-xs text-charcoal-muted block mt-0.5">{loc.state}</span>
                <span
                  className={`inline-block mt-3 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                    loc.type === 'Primary Chambers'
                      ? 'bg-brand-primary text-white'
                      : 'bg-brand-pale text-brand-primary border border-emerald-100'
                  }`}
                >
                  {loc.type}
                </span>
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
          7. CONTACT & CONSULTATION SECTION
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
