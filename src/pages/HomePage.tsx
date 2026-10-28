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
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { ContactForm } from '../components/ContactForm';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-surface via-white to-white pt-10 sm:pt-16 pb-16 lg:pb-24 border-b border-gray-100">
        {/* Subtle geometric background accents inspired by the visiting card */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-pale/40 to-transparent pointer-events-none -z-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-100/30 blur-3xl pointer-events-none -z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Core Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Partner Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pale border border-emerald-200/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-xs font-semibold text-brand-primary tracking-wide uppercase">
                  Chartered Accountant | Cost Accountant
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-brand-primary tracking-tight leading-[1.18]">
                Trusted Financial, Tax and Compliance Support
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-2xl">
                Professional support across audit, income tax, GST, corporate compliance, and business advisory. Dependable, compliant, and growth-oriented counsel rooted in extensive technical expertise and partner-level accountability.
              </p>

              {/* Partner Credentials Card (Inspired by the Visiting Card) */}
              <div className="bg-white rounded-xl border-l-4 border-l-gold border-y border-r border-gray-200 p-4 sm:p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-gold-dark uppercase tracking-widest block">
                    Practicing Chartered Accountant
                  </span>
                  <h3 className="font-serif text-xl font-bold text-brand-primary">
                    {FIRM_DATA.partner.name}
                  </h3>
                  <p className="text-xs text-charcoal-muted font-medium mt-0.5">
                    {FIRM_DATA.partner.qualifications} • Headquartered in Tirupati
                  </p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                  <span className="text-[11px] text-gray-500 uppercase tracking-wider block">Service Footprint</span>
                  <span className="text-xs font-semibold text-brand-primary">Tirupati & Pan-India</span>
                </div>
              </div>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#contact-section"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-secondary shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-brand-primary"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="w-4 h-4 text-gold" />
                </a>

                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg border-2 border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-pale transition-all focus:ring-2 focus:ring-brand-primary"
                >
                  <span>Explore Services</span>
                </Link>

                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-secondary py-2.5 px-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-dark" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>

              {/* Trust Tagline (Directly from Card) */}
              <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-charcoal-light font-medium tracking-wider uppercase">
                <span className="text-brand-primary font-bold">TRUST</span>
                <span>|</span>
                <span className="text-brand-primary font-bold">EXPERTISE</span>
                <span>|</span>
                <span className="text-brand-primary font-bold">YOUR GROWTH PARTNER</span>
              </div>
            </div>

            {/* Right Column: Hero Visual Feature Box */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden border-2 border-gold/40">
                {/* Decorative Pattern Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-emerald-800/80 pb-5 mb-6">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                      Practice Snapshot
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white">
                      Kavitha & Associates
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-white/10 border border-gold/50 flex items-center justify-center font-serif text-xl font-bold text-gold-light">
                    KA
                  </div>
                </div>

                {/* 100% Source-Backed Core Metrics */}
                <div className="grid grid-cols-2 gap-3.5 mb-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                    <span className="block font-serif text-xl sm:text-2xl font-bold text-gold">FCA & CMA</span>
                    <span className="text-xs text-emerald-100 font-medium">Dual Qualifications</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                    <span className="block font-serif text-xl sm:text-2xl font-bold text-gold">5 Cities</span>
                    <span className="text-xs text-emerald-100 font-medium">Regional Reach</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                    <span className="block font-serif text-xl sm:text-2xl font-bold text-gold">PAN India</span>
                    <span className="text-xs text-emerald-100 font-medium">Client Coverage</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10">
                    <span className="block font-serif text-xl sm:text-2xl font-bold text-gold">Partner</span>
                    <span className="text-xs text-emerald-100 font-medium">Direct Attention</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-emerald-100/90 border-t border-emerald-800/80 pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span>Statutory, Internal & Tax Audit Rigor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span>Direct Tax Assessment & Scrutiny Representation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span>GST Returns, Audit & ITC Optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span>RERA & MCA Company Law Compliance</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-800/60 text-[11px] text-emerald-200/80 flex items-center justify-between">
                  <span>Registered: Tirupati, AP</span>
                  <span className="text-gold font-semibold">ICAI Compliant</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. AUDIT SPOTLIGHT (Featured in PDF Page 1)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-pale/70 border-b border-emerald-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-brand-primary text-gold text-xs font-bold uppercase tracking-widest mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>{FIRM_DATA.auditSpotlight.subtitle}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">
              {FIRM_DATA.auditSpotlight.title}
            </h2>
            <p className="mt-3 text-base text-charcoal-muted leading-relaxed">
              {FIRM_DATA.auditSpotlight.description}
            </p>
          </div>

          {/* Audit Services Grid with Detailed Statute & Scope */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FIRM_DATA.auditSpotlight.services.map((service, index) => (
              <div
                key={service.name}
                className="bg-white rounded-xl p-5 border border-emerald-950/10 shadow-subtle hover:shadow-card hover:border-gold/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-brand-pale px-2 py-0.5 rounded border border-emerald-100">
                      {service.statute}
                    </span>
                    <span className="text-xs font-serif font-bold text-gray-400">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                    {service.scope}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Partner-Supervised</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-200/60">
            <Link
              to="/services/audit-assurance"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-secondary underline underline-offset-4"
            >
              <span>Explore Dedicated Audit & Assurance Practice</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="text-xs font-semibold text-charcoal-muted hover:text-brand-primary"
            >
              Have an upcoming audit deadline? Call {FIRM_DATA.contact.primaryPhone}
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FULL SERVICE SPECTRUM (From PDF Page 2)
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white" id="services-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Our Practice Areas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
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
                className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-pale text-brand-primary flex items-center justify-center mb-5 border border-emerald-100">
                    {category.id === 'income-tax' && <FileText className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'gst' && <BarChart3 className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'corporate-business' && <Building2 className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'rera-compliance' && <Briefcase className="w-6 h-6 text-brand-primary" />}
                    {category.id === 'advisory-consulting' && <Users className="w-6 h-6 text-brand-primary" />}
                  </div>

                  <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">
                    {category.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
                    {category.shortDescription}
                  </p>

                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-[11px] font-semibold text-gold-dark uppercase tracking-wider block mb-2">
                      Key Engagements:
                    </span>
                    <ul className="space-y-1.5">
                      {category.services.slice(0, 5).map((srv) => (
                        <li key={srv} className="text-xs text-charcoal flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{srv}</span>
                        </li>
                      ))}
                      {category.services.length > 5 && (
                        <li className="text-[11px] text-brand-primary font-medium pl-5 pt-1">
                          + {category.services.length - 5} additional specialized services
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100">
                  <Link
                    to={`/services#${category.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-secondary"
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
          4. WHY WORK WITH KAVITHA & ASSOCIATES (Pillars from PDF)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-surface border-y border-emerald-950/10">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FIRM_DATA.pillars.map((pillar, idx) => (
              <div
                key={pillar.title}
                className="bg-white rounded-xl p-6 border border-emerald-950/10 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center font-serif font-bold text-sm mb-4 border border-emerald-200">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-primary mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Regulatory Ethics Callout Card */}
            <div className="bg-brand-primary text-white rounded-xl p-6 border-2 border-gold/40 shadow-subtle flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-white/10 text-gold flex items-center justify-center font-serif font-bold text-sm mb-4 border border-gold/40">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">
                  ICAI Code of Conduct
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and data confidentiality established by the Institute of Chartered Accountants of India.
                </p>
              </div>
              <div className="pt-4 text-[11px] text-gold font-medium">
                Ethical & Transparent Standards
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. INDUSTRIES WE SERVE
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
                Industry Capabilities
              </span>
              <h2 className="font-serif text-3xl font-bold text-brand-primary tracking-tight">
                Industries We Serve
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-md">
              Specialized accounting, tax structuring, and compliance practices tailored to the commercial realities of diverse sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {FIRM_DATA.industries.map((ind) => (
              <div
                key={ind}
                className="bg-brand-pale/50 hover:bg-brand-pale rounded-xl p-4 text-center border border-emerald-950/10 hover:border-gold/60 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-white text-brand-primary flex items-center justify-center mx-auto mb-2.5 shadow-xs border border-emerald-100 group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4 text-gold-dark" />
                </div>
                <span className="text-xs font-semibold text-brand-primary block">
                  {ind}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SERVICE LOCATIONS & REACH (Source-backed)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-pale/40 border-t border-emerald-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Geographic Presence
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-primary tracking-tight">
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
                className={`rounded-xl p-5 border text-center transition-all ${
                  loc.type === 'Primary Chambers'
                    ? 'bg-white border-2 border-brand-primary shadow-card'
                    : 'bg-white border-gray-200 shadow-subtle'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-pale text-brand-primary flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-5 h-5 text-emerald-800" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-primary">{loc.city}</h3>
                <span className="text-xs text-charcoal-muted block">{loc.state}</span>
                <span
                  className={`inline-block mt-3 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    loc.type === 'Primary Chambers'
                      ? 'bg-brand-primary text-white'
                      : 'bg-gray-100 text-charcoal'
                  }`}
                >
                  {loc.type}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-xs text-charcoal-muted max-w-2xl mx-auto">
            <p>
              * Source-Backed Note: Tirupati serves as the registered practice. Client consultations and field audits in Chennai, Bengaluru, Hyderabad, and Coimbatore are arranged on scheduled mandate requirements.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. CONTACT & CONSULTATION SECTION
          ========================================================================= */}
      <section className="py-16 sm:py-24 bg-white" id="contact-section">
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
              <div className="space-y-4 pt-2">
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-brand-surface hover:border-brand-primary transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gold-dark uppercase tracking-wider block">
                      Direct Telephone Line
                    </span>
                    <span className="text-sm font-bold text-brand-primary group-hover:text-brand-secondary">
                      {FIRM_DATA.contact.primaryPhone}
                    </span>
                    <span className="block text-xs text-charcoal-muted">
                      Alternative: {FIRM_DATA.contact.secondaryPhone}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${FIRM_DATA.contact.email}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-brand-surface hover:border-brand-primary transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gold-dark uppercase tracking-wider block">
                      Official Practice Email
                    </span>
                    <span className="text-sm font-bold text-brand-primary group-hover:text-brand-secondary break-all">
                      {FIRM_DATA.contact.email}
                    </span>
                    <span className="block text-xs text-charcoal-muted">
                      Prompt written response on professional queries
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 bg-brand-surface">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary text-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-gold-dark uppercase tracking-wider block">
                      Principal Practice Chambers
                    </span>
                    <span className="text-sm font-bold text-brand-primary">
                      {FIRM_DATA.contact.primaryLocation}
                    </span>
                    <span className="block text-xs text-charcoal-muted">
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
