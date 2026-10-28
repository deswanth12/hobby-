import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle, 
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
  CheckCircle2,
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

export const HomePage: React.FC = () => {
  // Dedicated icon map for all 10 industries
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
    <div className="bg-brand-warm relative">
      {/* =========================================================================
          1. HERO SECTION (Editorial Luxury Archetype: Asymmetric Layout)
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-surface via-brand-warm to-brand-warm pt-14 sm:pt-20 pb-20 lg:pb-28 border-b border-border">
        {/* Subtle atmospheric ambient glow */}
        <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-l from-brand-pale/60 to-transparent pointer-events-none -z-0" />
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-emerald-100/30 blur-3xl pointer-events-none -z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Headlines & Core Value Proposition */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Partner Credentials Eyebrow Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-border shadow-subtle">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-xs font-semibold text-brand-primary tracking-wider uppercase">
                  Chartered Accountant • Cost Accountant
                </span>
              </div>

              {/* Main Headline (Cormorant Garamond Display Luxury) */}
              <h1 className="font-serif text-3xl sm:text-5xl md:text-5xl lg:text-[3.5rem] font-bold text-brand-primary tracking-tight leading-[1.12]">
                Trusted Financial, Tax and Compliance Support
              </h1>

              {/* Sub-headline with constrained line length for optimal readability */}
              <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-2xl font-normal">
                Professional support across audit, income tax, GST, corporate compliance, and business advisory. Dependable, compliant, and growth-oriented counsel rooted in extensive technical expertise and partner-level accountability.
              </p>

              {/* Partner Credentials Card (Double-Bezel Architecture) */}
              <div className="p-1.5 rounded-2xl bg-black/[0.02] border border-border/80 shadow-card">
                <div className="bg-white rounded-[calc(1rem-2px)] border-l-4 border-l-gold border-y border-r border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gold-dark uppercase tracking-widest block">
                      Practicing Chartered Accountant
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-primary mt-0.5">
                      {FIRM_DATA.partner.name}
                    </h3>
                    <p className="text-xs text-charcoal-muted font-medium mt-1">
                      {FIRM_DATA.partner.qualifications} • Headquartered in Tirupati
                    </p>
                  </div>
                  <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                    <span className="text-xs text-charcoal-light uppercase tracking-wider block">Service Footprint</span>
                    <span className="text-xs font-semibold text-brand-primary">Tirupati & Pan-India</span>
                  </div>
                </div>
              </div>

              {/* Primary Call to Actions with "Button-in-Button" Trailing Icon Architecture */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#contact-section"
                  className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-card hover:shadow-card-hover transition-all duration-300 active:scale-[0.985]"
                >
                  <span>Request Consultation</span>
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </a>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border bg-white text-brand-primary text-sm font-semibold hover:bg-brand-pale shadow-subtle transition-all duration-300 active:scale-[0.985]"
                >
                  <span>Explore Services</span>
                </Link>

                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-deep py-2.5 px-3 rounded-full hover:bg-brand-pale transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-dark" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>

              {/* Trust Tagline (Directly from Client Business Card) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-charcoal-muted font-semibold tracking-widest uppercase">
                <span className="text-brand-primary font-bold">TRUST</span>
                <span className="text-gold">•</span>
                <span className="text-brand-primary font-bold">EXPERTISE</span>
                <span className="text-gold">•</span>
                <span className="text-brand-primary font-bold">YOUR GROWTH PARTNER</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Feature Box (Double-Bezel Hardware Enclosure) */}
            <div className="lg:col-span-5">
              <div className="p-2 rounded-3xl bg-black/[0.03] border border-border">
                <div className="bg-[#0F3E2E] bg-gradient-to-br from-[#0F3E2E] to-[#0A2F24] text-white rounded-2xl shadow-elevated p-6 sm:p-8 relative overflow-hidden border border-gold/40">
                  {/* Subtle decorative gold illumination */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-emerald-800/80 pb-5 mb-6">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                        Practice Snapshot
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                        Kavitha & Associates
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-gold/50 flex items-center justify-center font-serif text-xl font-bold text-gold-light shadow-inner">
                      KA
                    </div>
                  </div>

                  {/* 100% Source-Backed Core Metrics with Concentric Bezel */}
                  <div className="grid grid-cols-2 gap-3.5 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                      <span className="block font-serif text-2xl font-bold text-gold">FCA & CMA</span>
                      <span className="text-xs text-emerald-100 font-medium">Dual Qualifications</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                      <span className="block font-serif text-2xl font-bold text-gold">5 Cities</span>
                      <span className="text-xs text-emerald-100 font-medium">Regional Reach</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                      <span className="block font-serif text-2xl font-bold text-gold">PAN India</span>
                      <span className="text-xs text-emerald-100 font-medium">Client Coverage</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                      <span className="block font-serif text-2xl font-bold text-gold">Partner</span>
                      <span className="text-xs text-emerald-100 font-medium">Direct Attention</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-emerald-100/90 border-t border-emerald-800/80 pt-5">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                      <span>Statutory, Internal & Tax Audit Rigor</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                      <span>Direct Tax Assessment & Scrutiny Representation</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                      <span>GST Returns, Audit & ITC Optimization</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                      <span>RERA & MCA Company Law Compliance</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-800/60 text-xs text-emerald-200/80 flex items-center justify-between">
                    <span>Practice Location: Tirupati, AP</span>
                    <span className="text-gold font-medium">Professional Practice</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. AUDIT SPOTLIGHT (Featured in PDF Page 1)
          ========================================================================= */}
      <section className="py-20 sm:py-24 bg-brand-pale/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-primary text-gold text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
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
                className="bg-white rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover hover:border-gold/60 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gold-dark uppercase tracking-wider bg-brand-pale px-3 py-1 rounded-full border border-emerald-100">
                      {service.statute}
                    </span>
                    <span className="text-xs font-serif font-bold text-charcoal-light">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-brand-primary group-hover:text-brand-deep transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal-muted mt-2.5 leading-relaxed">
                    {service.scope}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-border/60 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Partner-Supervised Engagement</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border">
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
          3. FULL SERVICE SPECTRUM (From PDF Page 2)
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-brand-warm" id="services-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Our Practice Areas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              Comprehensive Financial, Tax & Regulatory Support
            </h2>
            <p className="text-base text-charcoal-muted mt-3.5">
              End-to-end professional support under one roof, executed with rigorous diligence and transparent communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FIRM_DATA.serviceCategories.map((category) => (
              <div
                key={category.id}
                id={category.id}
                className="scroll-mt-24 bg-white rounded-2xl border border-border p-7 shadow-card hover:shadow-card-hover hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-brand-pale text-brand-primary flex items-center justify-center mb-6 border border-emerald-100 p-3">
                    {category.id === 'income-tax' && <FileText className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'gst' && <BarChart3 className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'corporate-business' && <Building2 className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'rera-compliance' && <Briefcase className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'advisory-consulting' && <Users className="w-6 h-6 text-brand-primary" />}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-brand-primary mb-2.5">
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-5">
                    {category.shortDescription}
                  </p>

                  <div className="border-t border-border/60 pt-4">
                    <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block mb-3">
                      Key Engagements:
                    </span>
                    <ul className="space-y-2">
                      {category.services.slice(0, 5).map((srv) => (
                        <li key={srv} className="text-xs text-charcoal flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                          <span>{srv}</span>
                        </li>
                      ))}
                      {category.services.length > 5 && (
                        <li className="text-xs text-brand-primary font-medium pl-6 pt-1">
                          + {category.services.length - 5} additional specialized services
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border">
                  <Link
                    to={`/services#${category.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-deep group"
                  >
                    <span>View all {category.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gold-dark group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. WHY WORK WITH KAVITHA & ASSOCIATES (Pillars from PDF)
          ========================================================================= */}
      <section className="py-20 sm:py-24 bg-brand-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Professional Foundation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
              Why Choose Kavitha & Associates?
            </h2>
            <p className="text-base text-charcoal-muted mt-2.5">
              Built on ethics, partner-level accessibility, and robust regulatory competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIRM_DATA.pillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-7 border border-border shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-pale text-brand-primary flex items-center justify-center font-serif font-bold text-sm mb-4 border border-emerald-200">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-brand-primary mb-2.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Regulatory Ethics Callout Card */}
            <div className="bg-[#0F3E2E] text-white rounded-2xl p-7 border border-gold/40 shadow-card flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 text-gold flex items-center justify-center font-serif font-bold text-sm mb-4 border border-gold/40">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-2.5">
                  ICAI Code of Conduct
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and data confidentiality established by the Institute of Chartered Accountants of India.
                </p>
              </div>
              <div className="pt-4 text-xs text-gold font-medium tracking-wide">
                Ethical & Transparent Standards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. INDUSTRIES WE SERVE (10 Contextual Sector Icons)
          ========================================================================= */}
      <section className="py-20 sm:py-24 bg-brand-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
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
                  className="bg-white hover:bg-brand-pale rounded-2xl p-5 text-center border border-border hover:border-gold/60 shadow-subtle hover:shadow-card transition-all duration-300 group hover:-translate-y-0.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-pale text-brand-primary flex items-center justify-center mx-auto mb-3 shadow-xs border border-emerald-100 group-hover:bg-white group-hover:scale-105 transition-all">
                    <IconComp className="w-5 h-5 text-brand-primary group-hover:text-brand-deep" />
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
      <section className="py-20 sm:py-24 bg-brand-pale/50 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Geographic Presence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
              Service Locations & Reach
            </h2>
            <p className="text-sm text-charcoal-muted mt-2.5">
              Principal chambers established in Tirupati, extending active consultation and audit coverage across key southern economic centers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {FIRM_DATA.serviceFootprint.map((loc) => (
              <div
                key={loc.city}
                className={`rounded-2xl p-6 border text-center transition-all duration-300 ${
                  loc.type === 'Primary Chambers'
                    ? 'bg-white border-2 border-brand-primary shadow-card hover:-translate-y-0.5'
                    : 'bg-white border-border shadow-subtle hover:border-emerald-300 hover:shadow-card'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-brand-pale text-brand-primary flex items-center justify-center mx-auto mb-3.5 border border-emerald-100">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-primary">{loc.city}</h3>
                <span className="text-xs text-charcoal-muted block mt-0.5">{loc.state}</span>
                <span
                  className={`inline-block mt-3.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
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

          <div className="mt-10 text-center text-xs text-charcoal-muted max-w-2xl mx-auto">
            <p>
              * Operational Note (For Discussion): Proposed representation listing Tirupati as the primary practice location with scheduled client coverage across Chennai, Bengaluru, Hyderabad, and Coimbatore. Subject to client confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CONTACT & CONSULTATION SECTION
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-brand-warm" id="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
            
            {/* Left Contact Information */}
            <div className="lg:col-span-5 space-y-7">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
                  Connect With CA Kavitha & Associates
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
                  Let's Discuss Your Financial & Compliance Priorities
                </h2>
                <p className="text-sm text-charcoal-muted mt-3.5 leading-relaxed">
                  Whether you are planning statutory audits, seeking guidance on complex GST assessments, or setting up a corporate entity, our senior team is ready to assist.
                </p>
              </div>

              {/* Direct Communication Cards */}
              <div className="space-y-4 pt-1">
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="flex items-start gap-4 p-4.5 rounded-2xl border border-border bg-white hover:border-brand-primary transition-all duration-300 group shadow-subtle hover:shadow-card"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 group-hover:bg-brand-deep transition-colors">
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
                  className="flex items-start gap-4 p-4.5 rounded-2xl border border-border bg-white hover:border-brand-primary transition-all duration-300 group shadow-subtle hover:shadow-card"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0 group-hover:bg-brand-deep transition-colors">
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

                <div className="flex items-start gap-4 p-4.5 rounded-2xl border border-border bg-white shadow-subtle">
                  <div className="w-11 h-11 rounded-xl bg-brand-primary text-white flex items-center justify-center shrink-0">
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
