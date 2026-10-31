import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  FileText, 
  Building2, 
  BarChart3, 
  MapPin, 
  ArrowRight,
  ArrowUpRight, 
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
  Compass,
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { ContactForm } from '../components/ContactForm';
import { KnowledgeFAQ } from '../components/KnowledgeFAQ';
import { SEOHead } from '../components/SEOHead';
import { DualArrowButton, SectorMarquee, AccentTicker } from '../components/animations';
import { ConnectedTimeline } from '../components/ConnectedTimeline';

export const HomePage: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const [activeSection, setActiveSection] = useState<string>('audit-spotlight');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // IntersectionObserver to dynamically highlight the active section in the quick-jump strip
  useEffect(() => {
    const sectionIds = [
      'audit-spotlight',
      'services-overview',
      'income-tax',
      'gst',
      'corporate-business',
      'rera-compliance',
      'advisory-consulting',
      'knowledge-faq',
      'contact-section'
    ];

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
    <div className="bg-brand-ivory page-reveal">
      <SEOHead
        title="Chartered Accountants & Cost Accountants | Tirupati & Pan India"
        description="Independent Chartered Accountancy practice led by CA Kavitha Vijay (ICAI Mem. 252985, B.Com, CA, CMA AIR 49). Ex-Deloitte Big 4 & Ford Motor Company auditor. Professional support across Statutory Audit, Income Tax, GST, and Corporate Governance."
        canonicalPath="/"
      />

      {/* =========================================================================
          SECTION 1: HERO & PRACTICE REGISTRY PLAQUE (Asymmetric 7:5 Split)
          Canvas: Warm Ivory #F5F1E8 (bg-brand-ivory)
          ========================================================================= */}
      <section className="bg-brand-ivory pt-12 sm:pt-16 lg:pt-16 xl:pt-14 pb-14 sm:pb-20 lg:pb-16 xl:pb-14 border-b border-brand-border relative overflow-hidden min-h-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left 7 Columns: Editorial Narrative & Action Cluster */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 scroll-reveal-left">
              
              {/* Institutional Practice Kicker */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-brand-surface border border-brand-border/80 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-brand-gold motion-safe:animate-pulse" />
                <span className="text-xs font-semibold text-brand-forest">
                  Independent Chartered Accountancy Practice, Tirupati
                </span>
              </div>

              {/* Master Headline (Cormorant Garamond Monumental Serif) */}
              <div className="space-y-1">
                <h1 className="font-editorial-h1 text-brand-forest leading-[1.15]">
                  Statutory Rigor.
                </h1>
                <h1 className="font-editorial-h1 text-brand-gold leading-[1.15]">
                  Practical Commercial Counsel.
                </h1>
              </div>

              {/* Authoritative Lead Narrative */}
              <p className="font-editorial-body text-brand-charcoal/85 leading-relaxed max-w-2xl font-normal">
                Founded by <strong className="text-brand-forest font-semibold">CA Kavitha Vijay (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49)</strong>, an MNC Auditor with 10+ years of Big 4 (Deloitte) and Fortune 50 multinational experience, our practice bridges rigorous statutory assurance with strategic financial governance. We safeguard corporate compliance, navigate complex tax scrutiny, and deliver direct partner-level counsel to enterprises, MSMEs, and institutions across South India.
              </p>

              {/* Primary Call to Action Cluster with Dual-Arrow Micro-physics */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2">
                <DualArrowButton
                  href="#contact-section"
                  variant="primary"
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
                >
                  Request Consultation
                </DualArrowButton>

                <DualArrowButton
                  to="/services"
                  variant="secondary"
                  className="w-full sm:w-auto text-xs sm:text-sm font-semibold"
                >
                  Explore Practice Disciplines
                </DualArrowButton>

                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-forest w-full sm:w-auto justify-center inline-flex items-center gap-2 text-xs font-semibold text-brand-charcoal hover:text-brand-forest py-2.5 px-3.5 rounded-full hover:bg-brand-surface transition-colors btn-tactile min-h-[44px]"
                  title="Direct telephone line"
                >
                  <Phone className="w-4 h-4 text-gold-dark" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>

              {/* Trust Creed Strip */}
              <div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center gap-3 text-xs text-brand-muted">
                <span className="text-brand-forest font-semibold">Trust</span>
                <span className="text-brand-gold/60" aria-hidden="true">,</span>
                <span className="text-brand-forest font-semibold">Expertise</span>
                <span className="text-brand-gold/60" aria-hidden="true">,</span>
                <span className="text-brand-forest font-semibold">Strategic Counsel</span>
                <span className="text-brand-gold/60 hidden sm:inline" aria-hidden="true">,</span>
                <span className="text-brand-forest hidden sm:inline font-semibold">Established Practice</span>
              </div>
            </div>

            {/* Right 5 Columns: Executive Practice Registry Plaque */}
            <div className="lg:col-span-5 scroll-reveal-right">
              
              {/* Executive Practice Registry Plaque (Double-Bezel Architecture) */}
              <div 
                className="double-bezel-dark animate-fade-up rounded-3xl p-1.5"
                
              >
                <div 
                  className="double-bezel-inner-dark bg-brand-deep text-brand-white p-6 sm:p-8 relative overflow-hidden rounded-2xl"
                  
                >
                  
                  {/* Subtle decorative seal watermark */}
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-brand-gold/5 border border-brand-gold/10 pointer-events-none" />

                  {/* Plaque Header & Monogram Seal */}
                  <div className="flex items-center justify-between border-b border-brand-forest pb-5 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 flex items-center justify-center shrink-0">
                        <img 
                          src="/brand/ka-seal-medallion.png" 
                          alt="KA Official Practice Seal" 
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      </div>
                      <div>
                        <span 
                          className="text-xs font-semibold text-brand-brightgold block">
                          Practice Register , Estd. Tirupati
                        </span>
                        <h3 
                          className="font-editorial-h3 text-2xl font-bold text-white tracking-wide"
                          
                        >
                          Kavitha & Associates
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Senior Partner Credential Block */}
                  <div 
                    className="bg-brand-forest/90 rounded-xl p-4 border border-brand-gold/30 mb-5 space-y-1"
                    
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-[11px] font-semibold text-brand-brightgold bg-brand-deep px-2.5 py-0.5 rounded border border-brand-gold/30">
                        Senior Partner
                      </span>
                      <span 
                        className="text-[10px] text-emerald-200 font-medium"
                        
                      >
                        ICAI Mem. 252985, CMA AIR 49
                      </span>
                    </div>
                    <h4 
                      className="font-editorial-h3 text-xl font-bold text-white mt-1"
                      
                    >
                      {FIRM_DATA.partner.name}
                    </h4>
                    <p 
                      className="text-xs text-brand-gold font-semibold tracking-wide"
                      
                    >
                      {FIRM_DATA.partner.qualifications} (Dual Qualifications)
                    </p>
                  </div>

                  {/* Architectural Ledger Rows */}
                  <div className="space-y-3 font-editorial-body text-xs divide-y divide-brand-forest/60 pt-1">
                    
                    {/* Chambers & GPS Coordinates */}
                    <div className="flex items-start justify-between gap-3 pt-2">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"  />
                        <div>
                          <strong 
                            className="text-white block text-xs font-semibold"
                            
                          >
                            Principal Chambers:
                          </strong>
                          <span 
                            className="text-emerald-100 text-xs font-normal"
                            
                          >
                            19-12-46, Near Bairagipetteda Arch, Tirupati 517501, AP
                          </span>
                        </div>
                      </div>
                      <a
                        href={FIRM_DATA.contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-gold hover:text-white hover:underline shrink-0 mt-0.5"
                        
                      >
                        <span>Map Pin</span><ArrowUpRight className="w-3.5 h-3.5 ml-1 inline text-brand-gold" aria-hidden="true" />
                      </a>
                    </div>

                    {/* Dual Strategic Competence */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"  />
                      <div>
                        <strong 
                          className="text-white block text-xs font-semibold"
                          
                        >
                          Dual Strategic Advantage:
                        </strong>
                        <span 
                          className="text-emerald-100 text-xs font-normal"
                          
                        >
                          External Statutory Audit + Internal Cost Accounting (CMA)
                        </span>
                      </div>
                    </div>

                    {/* Regional Service Corridors */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <Compass className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"  />
                      <div>
                        <strong 
                          className="text-white block text-xs font-semibold"
                          
                        >
                          Regional Service Corridors:
                        </strong>
                        <span 
                          className="text-emerald-100 text-xs font-normal"
                          
                        >
                          Tirupati, Chennai, Bengaluru, Hyderabad & Coimbatore
                        </span>
                      </div>
                    </div>

                    {/* Partner Supervision Guarantee */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <UserCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"  />
                      <div>
                        <strong 
                          className="text-white block text-xs font-semibold"
                          
                        >
                          Partner-Supervised Accountability:
                        </strong>
                        <span 
                          className="text-emerald-100 text-xs font-normal"
                          
                        >
                          Every file reviewed directly by CA Kavitha Vijay
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Plaque Footer & Direct Action */}
                  <div className="mt-5 pt-4 border-t border-brand-forest flex items-center justify-between text-xs">
                    <div 
                      className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-medium"
                      
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                      <span>Practice Chambers Open</span>
                    </div>
                    <a
                      href={FIRM_DATA.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-gold hover:text-white font-semibold text-xs transition-colors"
                      
                    >
                      <span>Direct WhatsApp Desk</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          STAGE 1: CROSSED TYPOGRAPHICAL ACCENT BANDS & SECTOR MARQUEE
          Canvas: Warm Ivory #F5F1E8
          ========================================================================= */}
      <AccentTicker />

      {/* Infinite Sector Marquee Engine with Left & Right Gradient Masks */}
      <div className="bg-brand-ivory py-4 border-b border-brand-border/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
          <div className="flex items-center justify-between text-xs text-xs font-medium text-gold-dark">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
              <span>Verified Industry Sectors Under Coverage</span>
            </span>
            <span className="hidden sm:inline text-brand-muted">Pan-South India & Pan-India Scope</span>
          </div>
        </div>
        <SectorMarquee />
      </div>

      {/* =========================================================================
          SECTION 2: PRACTICE QUICK-JUMP NAVIGATION STRIP (Sticky Anchor Observer)
          Canvas: Surface Tint #EDE8DF (bg-brand-surface)
          ========================================================================= */}
      <nav
        aria-label="Practice Disciplines Quick Navigation"
        className="bg-brand-surface/95 backdrop-blur-md py-3.5 border-b border-brand-border sticky top-[57px] sm:top-[65px] z-30 shadow-subtle overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-0.5 w-full min-w-0">
            <span className="text-xs font-medium text-gold-dark shrink-0 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-gold-dark" />
              <span>Practice Disciplines:</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#audit-spotlight"
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
                  activeSection === 'audit-spotlight'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
                }`}
              >
                Audit & Assurance
              </a>
              <a
                href="#income-tax"
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
                  activeSection === 'income-tax'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
                }`}
              >
                Income Tax & Appeals
              </a>
              <a
                href="#gst"
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
                  activeSection === 'gst'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
                }`}
              >
                GST & ITC Optimization
              </a>
              <a
                href="#corporate-business"
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
                  activeSection === 'corporate-business'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
                }`}
              >
                ROC & Virtual CFO
              </a>
              <a
                href="#rera-compliance"
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
                  activeSection === 'rera-compliance'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
                }`}
              >
                RERA Certifications
              </a>
              <a
                href="#advisory-consulting"
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
                  activeSection === 'advisory-consulting'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
                }`}
              >
                Strategic Advisory
              </a>
              <a
                href="#knowledge-faq"
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
                  activeSection === 'knowledge-faq'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
                }`}
              >
                Statutory FAQ
              </a>
              <a
                href="#contact-section"
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
                  activeSection === 'contact-section'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-pale text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                Direct Consultation
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          SECTION 3: AUDIT & ASSURANCE SPOTLIGHT (Asymmetric 4:8 Split)
          Canvas: Pure White #FFFFFF (bg-brand-white)
          ========================================================================= */}
      <section
        className="py-20 sm:py-28 lg:py-32 bg-brand-white border-b border-brand-border scroll-mt-28"
        id="audit-spotlight"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Sticky Assurance Briefing & Standards Guarantee (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6 scroll-reveal-left">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-forest text-brand-gold text-xs font-semibold mb-3 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Assurance Spotlight</span>
                </div>
                <h2 className="font-editorial-h2 text-brand-forest leading-tight mt-6 mb-3">
                  Statutory, Tax & Operational Audit Schedule
                </h2>
                <p className="mt-3 font-editorial-body text-sm text-brand-muted leading-relaxed">
                  Independent, thorough, and compliant audits that foster trust with lenders, investors, regulatory bodies, and corporate boards , delivered under the personal oversight of CA Kavitha Vijay.
                </p>
              </div>

              {/* ICAI Standards Guarantee Card */}
              <div className="bg-brand-surface rounded-xl p-5 border border-brand-border shadow-card space-y-3">
                <span className="text-xs font-semibold text-gold-dark block">
                  Methodology & Professional Standards
                </span>
                <div className="space-y-2 text-xs font-editorial-body text-brand-muted">
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
                  className="w-full inline-flex items-center justify-between px-5 py-3 rounded-xl bg-brand-forest text-brand-white text-xs font-semibold hover:bg-brand-deep shadow-sm transition-colors btn-tactile"
                >
                  <span>Explore Dedicated Audit Hub</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold" />
                </Link>
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="block text-center text-xs text-brand-muted hover:text-brand-forest py-1 font-medium"
                >
                  Statutory audit deadline approaching? Call <strong className="text-brand-forest font-semibold">{FIRM_DATA.contact.primaryPhone}</strong>
                </a>
              </div>
            </div>

            {/* Right Column: 9-Item Structured Assurance Dossier (8 cols) */}
            <div className="lg:col-span-8 scroll-reveal-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 scroll-stagger">
                {FIRM_DATA.auditSpotlight.services.map((service, index) => (
                  <div
                    key={service.name}
                    className="bg-brand-white card-tactile card-premium-hover rounded-xl p-5 sm:p-6 border border-brand-border shadow-card flex flex-col justify-between scroll-reveal"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-emerald-800 bg-brand-pale px-2.5 py-0.5 rounded border border-emerald-200">
                          {service.statute}
                        </span>
                        <span className="font-serif text-xs font-bold text-charcoal-light">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="font-editorial-h3 text-lg sm:text-xl text-brand-forest leading-snug">
                        {service.name}
                      </h3>

                      <p className="font-editorial-body text-xs text-brand-muted mt-2 leading-relaxed">
                        {service.scope}
                      </p>

                      {service.deliverable && (
                        <div className="mt-3 pt-2.5 border-t border-brand-border/60 text-[11px] text-brand-muted space-y-1 bg-brand-surface/60 p-2.5 rounded-lg">
                          <div>
                            <strong className="text-brand-forest font-semibold">Deliverable:</strong> {service.deliverable}
                          </div>
                          {service.applicableEntity && (
                            <div className="text-charcoal-light">
                              <strong className="text-emerald-800 font-semibold">Applies to:</strong> {service.applicableEntity}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-brand-border/50 text-[11px] text-emerald-800 font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>Partner Oversight</span>
                      </span>
                      <a
                        href={FIRM_DATA.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-dark hover:underline font-semibold"
                      >
                        <span>Inquire Audit</span><ArrowRight className="w-3.5 h-3.5 ml-1 inline text-brand-gold" aria-hidden="true" />
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
          SECTION 4: COMPREHENSIVE SERVICE SPECTRUM (3x2 Editorial Grid)
          Canvas: Warm Ivory #F5F1E8 (bg-brand-ivory)
          ========================================================================= */}
      <section className="py-20 sm:py-28 lg:py-32 bg-brand-ivory border-b border-brand-border" id="services-overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
            <span className="text-xs font-semibold text-gold-dark block mb-2">
              Our Practice Areas
            </span>
            <h2 className="font-editorial-h2 text-brand-forest">
              Comprehensive Financial, Tax & Regulatory Support
            </h2>
            <p className="font-editorial-body text-base text-brand-muted mt-3">
              End-to-end professional disciplines under one roof, executed with rigorous diligence and transparent partner-level communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 scroll-stagger">
            {/* 5 Statutory Category Cards with Curtain Expansion */}
            {FIRM_DATA.serviceCategories.map((category) => {
              const isExpanded = expandedCardId === category.id;
              return (
                <div
                  key={category.id}
                  id={category.id}
                  className={`scroll-mt-28 bg-brand-white card-tactile card-premium-hover rounded-2xl border border-brand-border p-6 sm:p-8 shadow-card flex flex-col justify-between scroll-reveal service-card-interactive group/card ${
                    isExpanded ? 'service-card-expanded border-brand-gold/80' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-pale text-brand-forest flex items-center justify-center border border-emerald-100 group-hover/card:bg-brand-forest group-hover/card:text-brand-gold transition-colors">
                        {category.id === 'income-tax' && <FileText className="w-6 h-6" />}
                        {category.id === 'gst' && <BarChart3 className="w-6 h-6" />}
                        {category.id === 'corporate-business' && <Building2 className="w-6 h-6" />}
                        {category.id === 'rera-compliance' && <Briefcase className="w-6 h-6" />}
                        {category.id === 'advisory-consulting' && <Users className="w-6 h-6" />}
                      </div>
                      {category.statutoryFramework && (
                        <span className="font-editorial-meta text-[11px] font-semibold text-emerald-800 bg-brand-pale px-2.5 py-1 rounded border border-emerald-200 text-right max-w-[180px] leading-tight">
                          {category.statutoryFramework.split('&')[0]}
                        </span>
                      )}
                    </div>

                    <h3 className="font-editorial-h3 text-2xl text-brand-forest mb-2 group-hover/card:text-brand-deep transition-colors">
                      {category.title}
                    </h3>
                    <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
                      {category.shortDescription}
                    </p>

                    {category.targetClients && (
                      <div className="mb-4 p-2.5 rounded-lg bg-brand-surface/70 border border-brand-border/60 text-xs">
                        <span className="font-semibold text-brand-forest block text-xs font-semibold text-gold-dark mb-0.5">
                          Target Entities:
                        </span>
                        <p className="font-editorial-body text-brand-muted text-[11px] leading-relaxed">
                          {category.targetClients}
                        </p>
                      </div>
                    )}

                    <div className="border-t border-brand-border/60 pt-4">
                      <span className="text-xs font-semibold text-gold-dark block mb-2.5">
                        Key Engagements:
                      </span>
                      <ul className="space-y-2">
                        {category.services.slice(0, 5).map((srv) => (
                          <li key={srv} className="font-editorial-body text-xs text-brand-charcoal flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                            <span>{srv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expanding Curtain Section with Typical Scenarios & Scope */}
                    <div id={`curtain-${category.id}`} className="service-curtain-body mt-3">
                      <div className="service-curtain-inner pt-3 border-t border-brand-gold/30 space-y-3">
                        {category.typicalScenarios && category.typicalScenarios.length > 0 && (
                          <div className="p-3 rounded-lg bg-brand-surface/90 border border-brand-border/80 text-xs">
                            <span className="text-[11px] font-semibold text-gold-dark block mb-1.5">
                              Typical Statutory Scenarios:
                            </span>
                            <ul className="space-y-1.5">
                              {category.typicalScenarios.map((scen, sIdx) => (
                                <li key={sIdx} className="font-editorial-body text-[11px] text-brand-muted flex items-start gap-2">
                                  <span className="text-brand-gold shrink-0 mt-0.5">▸</span>
                                  <span>{scen}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {category.services.length > 5 && (
                          <div className="text-[11px] text-brand-forest font-medium pt-1">
                            <span className="text-[11px] font-semibold text-gold-dark block mb-1">Additional Engagements:</span>
                            <span>{category.services.slice(5).join(' • ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Mobile Tap Toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedCardId(isExpanded ? null : category.id)}
                      className="mt-3 text-[11px] text-gold-dark hover:text-brand-forest font-semibold flex items-center gap-1 sm:hidden cursor-pointer"
                      aria-expanded={isExpanded}
                      aria-controls={`curtain-${category.id}`}
                    >
                      <span>{isExpanded ? 'Collapse Scope ↑' : 'Expand Full Scope ↓'}</span>
                    </button>
                  </div>

                  <div className="pt-5 mt-5 border-t border-brand-border flex items-center justify-between">
                    <Link
                      to={`/services#${category.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-forest hover:text-brand-deep group"
                    >
                      <span>View all {category.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gold-dark group-hover:translate-x-0.5 transition-transform" />
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
              );
            })}

            {/* Coordinating 6th Card: Virtual CFO & Strategic Financial Retainer with Curtain Expansion */}
            {(() => {
              const isCfoExpanded = expandedCardId === 'virtual-cfo';
              return (
                <div
                  id="virtual-cfo"
                  className={`bg-brand-deep text-brand-white rounded-2xl border border-brand-forest p-6 sm:p-8 shadow-card flex flex-col justify-between scroll-reveal service-card-interactive group/card ${
                    isCfoExpanded ? 'service-card-expanded border-brand-gold/80' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-forest text-brand-gold flex items-center justify-center border border-brand-gold/40 group-hover/card:bg-brand-gold group-hover/card:text-brand-deep transition-colors">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="font-editorial-meta text-[11px] font-semibold text-brand-gold bg-brand-forest/60 px-2.5 py-1 rounded border border-brand-gold/30">
                        Strategic Retainer
                      </span>
                    </div>

                    <h3 className="font-editorial-h3 text-2xl text-white mb-2">
                      Virtual CFO & Retainerships
                    </h3>
                    <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
                      Outsourced financial leadership and integrated compliance retainers designed for high-growth enterprises and established businesses.
                    </p>

                    <div className="mb-4 p-2.5 rounded-lg bg-brand-forest/80 border border-brand-gold/20 text-xs">
                      <span className="text-xs font-semibold text-brand-gold block mb-0.5">
                        Target Entities:
                      </span>
                      <p className="font-editorial-body text-emerald-200/90 text-[11px] leading-relaxed">
                        Growth-Stage Startups, MSMEs & Established Corporate Enterprises
                      </p>
                    </div>

                    <div className="border-t border-brand-forest pt-4">
                      <span className="text-xs font-semibold text-brand-gold block mb-2.5">
                        Retainer Scope:
                      </span>
                      <ul className="space-y-2">
                        <li className="font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Monthly MIS & Operational Cash Flow Budgeting</span>
                        </li>
                        <li className="font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Continuous Advance Tax & Quarterly TDS Structuring</span>
                        </li>
                        <li className="font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Bank Loan CMA Data & Project Financial Modeling</span>
                        </li>
                        <li className="font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Board-Level Fiscal Counseling with Senior Partner</span>
                        </li>
                      </ul>
                    </div>

                    {/* Expanding Curtain Section for Virtual CFO */}
                    <div id="curtain-virtual-cfo" className="service-curtain-body mt-3">
                      <div className="service-curtain-inner pt-3 border-t border-brand-gold/20 space-y-2.5">
                        <div className="p-3 rounded-lg bg-brand-forest/90 border border-brand-gold/20 text-xs text-emerald-100">
                          <span className="text-[11px] font-semibold text-brand-gold block mb-1">
                            Executive Oversight:
                          </span>
                          <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                            Direct access to CA Kavitha Vijay for board reviews, debt restructuring, and investor due diligence briefings.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Mobile Tap Toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedCardId(isCfoExpanded ? null : 'virtual-cfo')}
                      className="mt-3 text-[11px] text-brand-gold hover:text-white font-semibold flex items-center gap-1 sm:hidden cursor-pointer"
                      aria-expanded={isCfoExpanded}
                      aria-controls="curtain-virtual-cfo"
                    >
                      <span>{isCfoExpanded ? 'Collapse Scope ↑' : 'Expand Full Scope ↓'}</span>
                    </button>
                  </div>

                  <div className="pt-5 mt-5 border-t border-brand-forest flex items-center justify-between">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-white group"
                    >
                      <span>Discuss Retainer Scope</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <a
                      href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                      className="text-[11px] font-semibold text-emerald-300 hover:text-white underline underline-offset-2"
                    >
                      Call Directly
                    </a>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: ENGAGEMENT METHODOLOGY (Connected Process Timeline)
          Canvas: Surface Tint #EDE8DF (bg-brand-surface)
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-brand-surface border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
            <span className="text-xs font-semibold text-gold-dark block mb-2">
              Our Methodology
            </span>
            <h2 className="font-editorial-h2 text-brand-forest">
              How We Work With You
            </h2>
            <p className="font-editorial-body text-base text-brand-muted mt-2">
              A structured, transparent 4-step connected engagement model ensuring regulatory compliance and proactive guidance.
            </p>
          </div>

          <ConnectedTimeline />
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PRACTICE PHILOSOPHY & GOVERNANCE (Dual Advantage & ICAI Ethics)
          Canvas: Warm Ivory #F5F1E8 (bg-brand-ivory)
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-brand-ivory border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 scroll-reveal">
            <span className="text-xs font-semibold text-gold-dark block mb-2">
              Practice Philosophy & Governance
            </span>
            <h2 className="font-editorial-h2 text-brand-forest">
              Technical Excellence & Practical Thinking
            </h2>
            <p className="font-editorial-body text-base text-brand-muted mt-3">
              {FIRM_DATA.philosophy.statement}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-stagger">
            {FIRM_DATA.philosophy.corePrinciples.map((principle, idx) => (
              <div
                key={principle.title}
                className="bg-brand-white card-tactile rounded-xl p-6 border border-brand-border shadow-card flex items-start gap-4 scroll-reveal"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-forest flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-emerald-200 text-gold-dark">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="font-editorial-h3 text-lg font-bold text-brand-forest mb-1">
                    {principle.title}
                  </h3>
                  <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Dual Qualification Advantage Panel */}
            <div className="bg-brand-white card-tactile rounded-xl p-6 border-2 border-brand-gold/50 shadow-card flex items-start gap-4 scroll-reveal">
              <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-forest flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-brand-gold/40 text-gold-dark">
                ★
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-editorial-h3 text-lg font-bold text-brand-forest">
                    Dual FCA & CMA Qualification
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-pale text-emerald-800 border border-emerald-200">
                    Key Advantage
                  </span>
                </div>
                <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Chartered Accountancy (statutory reporting, tax audit, legal compliance) integrated with Cost & Management Accountancy (internal controls, unit cost optimization, working capital budgeting).
                </p>
              </div>
            </div>

            {/* ICAI Code of Ethics Commitment Panel */}
            <div className="bg-brand-deep text-brand-white rounded-xl p-6 border border-brand-forest shadow-card flex items-start gap-4 scroll-reveal">
              <div className="w-10 h-10 rounded-lg bg-brand-forest text-brand-gold flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-brand-gold/40">
                <Shield className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-editorial-h3 text-lg font-bold text-white mb-1">
                  ICAI Code of Conduct & Independence
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and client confidentiality established by the Institute of Chartered Accountants of India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: INDUSTRIES WE SERVE (10 Contextual Sector Profiles)
          Canvas: Pure White #FFFFFF (bg-brand-white)
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-brand-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4 scroll-reveal">
            <div>
              <span className="text-xs font-semibold text-gold-dark block mb-2">
                Industry Capabilities
              </span>
              <h2 className="font-editorial-h2 text-brand-forest">
                Industries We Serve
              </h2>
            </div>
            <p className="font-editorial-body text-xs sm:text-sm text-brand-muted max-w-md">
              Specialized accounting, tax structuring, and compliance practices tailored to the commercial realities of diverse sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 scroll-stagger">
            {FIRM_DATA.industries.map((ind) => {
              const IconComp = getIndustryIcon(ind);
              return (
                <div
                  key={ind}
                  className="bg-brand-white card-tactile rounded-xl p-5 text-center border border-brand-border shadow-subtle group hover:border-brand-gold scroll-reveal"
                >
                  <div className="w-11 h-11 rounded-lg bg-brand-pale text-brand-forest flex items-center justify-center mx-auto mb-3 border border-emerald-100 group-hover:bg-brand-white transition-colors">
                    <IconComp className="w-5 h-5 text-brand-forest" />
                  </div>
                  <span className="font-editorial-meta text-xs font-semibold text-brand-forest block leading-tight">
                    {ind}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: SERVICE LOCATIONS & REACH (Principal Chambers & Corridors)
          Canvas: Warm Ivory #F5F1E8 (bg-brand-ivory)
          ========================================================================= */}
      <section className="py-20 sm:py-28 bg-brand-ivory border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
            <span className="text-xs font-semibold text-gold-dark block mb-2">
              Geographic Presence
            </span>
            <h2 className="font-editorial-h2 text-brand-forest">
              Service Locations & Reach
            </h2>
            <p className="font-editorial-body text-sm text-brand-muted mt-2">
              Principal chambers established in Tirupati, extending active consultation and audit coverage across key southern economic centers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 scroll-stagger">
            {FIRM_DATA.serviceFootprint.map((loc) => (
              <div
                key={loc.city}
                className={`rounded-xl p-5 border text-center card-tactile flex flex-col justify-between scroll-reveal ${
                  loc.type === 'Primary Chambers'
                    ? 'bg-brand-white border-2 border-brand-forest shadow-card relative'
                    : 'bg-brand-white border-brand-border shadow-subtle'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-forest flex items-center justify-center mx-auto mb-3 border border-emerald-100">
                    <MapPin className="w-5 h-5 text-emerald-800" />
                  </div>
                  <h3 className="font-editorial-h3 text-lg font-bold text-brand-forest">{loc.city}</h3>
                  <span className="font-editorial-body text-xs text-brand-muted block mt-0.5">{loc.state}</span>
                  {loc.type === 'Primary Chambers' ? (
                    <span className="font-editorial-meta text-[11px] text-emerald-800 font-semibold block mt-1">
                      Near Bairagipetteda Arch
                    </span>
                  ) : (
                    <span className="font-editorial-meta text-[11px] text-charcoal-light block mt-1">
                      Client Corridor
                    </span>
                  )}
                </div>
                <div>
                  <span
                    className={`inline-block mt-3 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      loc.type === 'Primary Chambers'
                        ? 'bg-brand-forest text-brand-white'
                        : 'bg-brand-pale text-brand-forest border border-emerald-100'
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
                      <span>View on Map</span><ArrowUpRight className="w-3.5 h-3.5 ml-1 inline text-brand-gold" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center font-editorial-body text-xs text-brand-muted max-w-2xl mx-auto">
            <p>
              * Operational Note: Tirupati chambers serve as principal practice location with regular scheduled client coverage across Chennai, Bengaluru, Hyderabad, and Coimbatore.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: STATUTORY KNOWLEDGE & ADVISORY FAQ
          Canvas: Surface Tint #EDE8DF (bg-brand-surface)
          ========================================================================= */}
      <div id="knowledge-faq" className="scroll-mt-28 scroll-reveal">
        <KnowledgeFAQ />
      </div>

      {/* =========================================================================
          SECTION 10: CHAMBERS CONSULTATION & INTAKE (Asymmetric 5:7 Split)
          Canvas: Warm Ivory #F5F1E8 (bg-brand-ivory)
          ========================================================================= */}
      <section className="py-20 sm:py-28 lg:py-32 bg-brand-ivory" id="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
            
            {/* Left 5 Columns: Chambers Contact Information */}
            <div className="lg:col-span-5 space-y-6 scroll-reveal-left">
              <div>
                <span className="text-xs font-semibold text-gold-dark block mb-2">
                  Connect With CA Kavitha & Associates
                </span>
                <h2 className="font-editorial-h2 text-brand-forest">
                  Let's Discuss Your Financial & Compliance Priorities
                </h2>
                <p className="font-editorial-body text-sm text-brand-muted mt-3 leading-relaxed">
                  Whether you are planning statutory audits, seeking guidance on complex GST assessments, or setting up a corporate entity, our senior team is ready to assist.
                </p>
              </div>

              {/* Direct Communication Cards */}
              <div className="space-y-4 pt-1">
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-brand-border bg-brand-white group shadow-subtle card-tactile btn-tactile"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-forest text-brand-white flex items-center justify-center shrink-0 group-hover:bg-brand-deep transition-colors">
                    <Phone className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold-dark block">
                      Direct Telephone Line
                    </span>
                    <span className="font-editorial-body text-sm font-bold text-brand-forest group-hover:text-brand-deep">
                      {FIRM_DATA.contact.primaryPhone}
                    </span>
                    <span className="block font-editorial-body text-xs text-brand-muted mt-0.5">
                      Alternative: {FIRM_DATA.contact.secondaryPhone}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${FIRM_DATA.contact.email}`}
                  className="flex items-start gap-4 p-4 rounded-xl border border-brand-border bg-brand-white group shadow-subtle card-tactile btn-tactile"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-forest text-brand-white flex items-center justify-center shrink-0 group-hover:bg-brand-deep transition-colors">
                    <Mail className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold-dark block">
                      Official Practice Email
                    </span>
                    <span className="font-editorial-body text-sm font-bold text-brand-forest group-hover:text-brand-deep break-all">
                      {FIRM_DATA.contact.email}
                    </span>
                    <span className="block font-editorial-body text-xs text-brand-muted mt-0.5">
                      Prompt written response on professional queries
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-brand-border bg-brand-white shadow-subtle">
                  <div className="w-10 h-10 rounded-lg bg-brand-forest text-brand-white flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gold-dark block">
                      Principal Practice Chambers
                    </span>
                    <span className="font-editorial-body text-sm font-bold text-brand-forest">
                      {FIRM_DATA.contact.primaryLocation}
                    </span>
                    <span className="block font-editorial-body text-xs text-brand-muted mt-0.5">
                      Serving clients across South India & Pan-India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Columns: Embedded ContactForm */}
            <div className="lg:col-span-7 scroll-reveal-right">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
