import React, { useMemo } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin 
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { ContactForm } from '../components/ContactForm';
import { SEOHead } from '../components/SEOHead';
import { 
  DualArrowButton, 
  AnimatedDotPattern,
  RotatingGeometricMesh,
  FloatingGeometricShapes,
  CurvedPathReveal,
  LetterReveal,
  WordReveal,
  BlurReveal 
} from '../components/animations';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { WorkingProcess } from '../components/WorkingProcess';
import { FeaturedInsights } from '../components/FeaturedInsights';
import { 
  EditorialMarker, 
  CornerDotMatrix
} from '../components/architectural';
import { BlogService, BlogPost } from '../services/blogService';

export const HomePage: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const { getStyle: getHeroParallax } = useMouseParallax(8);

  // Retrieve published blog posts for Featured Insights (Layer 2 Draft Quarantine)
  const recentArticles: BlogPost[] = useMemo(() => {
    return BlogService.getAllPosts(false).slice(0, 3);
  }, []);

  return (
    <div className="bg-brand-ivory page-reveal">
      <SEOHead
        title="Chartered Accountant in Tirupati | Kavitha & Associates"
        description="Kavitha & Associates, led by CA Kavitha Vijay, provides professional accounting, taxation, audit and business compliance services in Tirupati, Andhra Pradesh."
        canonicalPath="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AccountingService',
            name: 'Kavitha & Associates',
            legalName: 'Kavitha & Associates Chartered Accountants',
            url: 'https://kavithaassociates.com/',
            logo: 'https://kavithaassociates.com/favicon.svg',
            image: 'https://kavithaassociates.com/brand/ka-google-cover-banner.svg',
            telephone: '+919626350900',
            email: 'cakavithasrj@gmail.com',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
              addressLocality: 'Tirupati',
              addressRegion: 'Andhra Pradesh',
              postalCode: '517501',
              addressCountry: 'IN'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 13.6192242,
              longitude: 79.418046
            },
            hasMap: 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6',
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:30',
                closes: '18:30'
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday'],
                opens: '10:00',
                closes: '14:00'
              }
            ],
            founder: {
              '@type': 'Person',
              name: 'CA Kavitha Vijay',
              jobTitle: 'Practicing Chartered Accountant & Cost Accountant',
              honorificPrefix: 'CA',
              description: 'B.Com, CA, CMA (AIR 49)'
            },
            areaServed: ['Tirupati', 'Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore', 'India'],
            knowsAbout: [
              'Statutory Audit',
              'Internal Audit',
              'Income Tax Return Filing',
              'GST Compliance & Litigation',
              'ROC & MCA Filings',
              'RERA Certifications',
              'Virtual CFO Services'
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Kavitha & Associates',
            url: 'https://kavithaassociates.com/'
          }
        ]}
      />

      {/* =========================================================================
          SECTION 1: HERO & PRACTICE REGISTRY
          Headline: "Clarity in Finance. Confidence in Every Decision."
          Supporting sentence: Exactly 20 words
          CTAs: Exactly 2 CTAs
          Canvas: Deep Evergreen #071B14
          ========================================================================= */}
      <section id="hero-section" className="bg-[#071B14] text-[#F1EBDD] pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-14 lg:pb-16 border-b border-[#B49A64]/20 relative overflow-hidden min-h-0 flex items-center texture-architectural-lines">
        {/* Luminous Ambient Radial Background Lighting */}
        <div className="hero-step-1 absolute -top-32 -left-32 w-96 h-96 rounded-full bg-ambient-radial-gold pointer-events-none -z-0" />
        <div className="hero-step-1 absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-ambient-radial-sage pointer-events-none -z-0" />

        {/* Precision Dot System Anchors */}
        <div className="hero-step-2 absolute top-6 left-6 pointer-events-none z-0 hidden lg:block opacity-40">
          <CornerDotMatrix rows={3} cols={3} variant="gold" position="top-left" />
        </div>

        {/* Subtle CurvedPathReveal corner accent */}
        <div className="hero-step-10 absolute -top-6 -right-6 w-36 h-36 pointer-events-none -z-0 opacity-25 hidden md:block">
          <CurvedPathReveal variant="corner" width={140} height={140} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left 7 Columns: Editorial Narrative & Exactly 2 CTAs */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 scroll-reveal-left">
              
              {/* Institutional Practice Kicker & Editorial Marker */}
              <div className="hero-step-3 flex items-center gap-2.5 flex-wrap">
                <EditorialMarker number="01" label="INSTITUTIONAL PRACTICE" variant="dark" />
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#0B241C] border border-[#B49A64]/30 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-brand-gold motion-safe:animate-pulse" />
                  <LetterReveal
                    text="INDEPENDENT CHARTERED ACCOUNTANCY PRACTICE • TIRUPATI"
                    as="span"
                    className="text-[11px] sm:text-xs font-semibold text-[#B49A64] tracking-widest uppercase"
                  />
                </div>
              </div>

              {/* Master Headline */}
              <div className="space-y-1 hero-step-4">
                <h1 className="font-editorial-h1 leading-[1.14]">
                  <span className="sr-only">Clarity in Finance. Confidence in Every Decision.</span>
                  <WordReveal
                    text="Clarity in Finance."
                    as="span"
                    className="block text-[#F1EBDD]"
                  />
                  <BlurReveal
                    as="span"
                    delayMs={280}
                    className="block font-editorial-hero-sub text-[#B49A64] font-serif italic mt-1.5 sm:mt-2 font-medium"
                  >
                    Confidence in Every Decision.
                  </BlurReveal>
                </h1>
              </div>

              {/* Authoritative Supporting Sentence (Exactly 20 words) */}
              <p className="hero-step-5 font-editorial-body text-[#D8D0BE] max-w-xl font-normal leading-relaxed text-sm sm:text-base border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4">
                Partner-led Chartered Accountancy and statutory counsel in Tirupati, advising growth enterprises and established businesses across India.
              </p>

              {/* Staggered Call to Action Cluster: Exactly 2 CTAs */}
              <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-3 pt-2">
                <div className="hero-step-7a w-full sm:w-auto">
                  <DualArrowButton
                    href="#practice-areas"
                    variant="secondary"
                    className="w-full sm:w-auto text-xs sm:text-[13px] font-semibold justify-center py-2.5 px-5 min-h-[46px] whitespace-nowrap"
                  >
                    Explore Practice Areas
                  </DualArrowButton>
                </div>

                <div className="hero-step-7b w-full sm:w-auto">
                  <DualArrowButton
                    href="#contact-section"
                    variant="primary"
                    className="w-full sm:w-auto text-xs sm:text-[13px] font-semibold justify-center py-2.5 px-5 min-h-[46px] whitespace-nowrap"
                  >
                    Schedule Consultation
                  </DualArrowButton>
                </div>
              </div>

            </div>

            {/* Right 5 Columns: Photography Showcase with Practice Seal Badge */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Subtle Architectural Grounding Hairline Divider (Desktop) */}
              <div 
                className="hidden lg:block absolute -left-6 lg:-left-8 top-1/2 -translate-y-1/2 h-3/4 w-[1px] bg-gradient-to-b from-transparent via-[#C5A059]/35 to-transparent pointer-events-none" 
                aria-hidden="true" 
              />

              {/* Architectural Framing Backdrop */}
              <div 
                className="absolute -inset-3 sm:-inset-4 rounded-[32px] border border-[#C5A059]/25 bg-[#FFF9EF]/40 -z-10 pointer-events-none hidden sm:block shadow-xs" 
                aria-hidden="true" 
              />

              {/* Dot Grid at Top-Right Boundary */}
              <div className="hero-step-2 absolute -top-3 -right-3 pointer-events-none z-0 opacity-30 hidden sm:block">
                <AnimatedDotPattern rows={3} cols={4} variant="champagne" />
              </div>

              {/* Floating Orbital Ring at Bottom-Left Boundary */}
              <div className="hero-step-10 absolute -bottom-4 -left-4 pointer-events-none z-0 opacity-30 hidden sm:block">
                <FloatingGeometricShapes type="ring" size={54} />
              </div>

              {/* Rotating Geometric Mesh behind the frame */}
              <div className="hero-step-10 absolute -top-6 -right-4 pointer-events-none -z-0 opacity-20 hidden sm:block">
                <RotatingGeometricMesh size={240} />
              </div>

              {/* Desktop Subtle Mouse Parallax Container */}
              <div
                style={getHeroParallax(1)}
                className="w-full relative z-10"
              >
                <div className="w-full">
                  {/* Double-Bezel Editorial Photography Showcase */}
                  <div className="rounded-3xl p-2 sm:p-2.5 bg-[#0B241C]/85 border border-[#B49A64]/30 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                    
                    {/* Architectural Corner Accents */}
                    <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#B49A64]/60 rounded-tl-sm pointer-events-none z-20" aria-hidden="true" />
                    <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#B49A64]/60 rounded-br-sm pointer-events-none z-20" aria-hidden="true" />

                    {/* Primary Consultation Photograph */}
                    <div className="hero-step-8 relative rounded-2xl overflow-hidden border border-[#B49A64]/30 bg-[#071B14]/10 aspect-[16/9] w-full">
                      <img
                        src="/images/ai-generated/hero/hero-consultation.webp"
                        alt="Senior corporate accounting and statutory audit consultation session"
                        width="1376"
                        height="768"
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-full object-cover object-center image-v4-zoom transition-transform duration-700"
                      />
                      {/* Subtle champagne gradient vignette for grounding */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#153F32]/60 via-transparent to-transparent opacity-70 pointer-events-none" />
                      
                      {/* Top Floating Practice Seal Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#071B14]/85 backdrop-blur-md border border-[#C5A059]/40 shadow-sm">
                        <img 
                          src="/brand/ka-seal-medallion.webp" 
                          alt="KA Official Practice Seal" 
                          width="24"
                          height="24"
                          className="w-6 h-6 object-contain shrink-0 drop-shadow-xs"
                        />
                        <span className="font-editorial-meta text-[11px] font-semibold text-[#B49A64] tracking-wide">
                          Estd. Tirupati Chambers
                        </span>
                      </div>
                    </div>

                    {/* Compact Partner Credential Strip */}
                    <div className="hero-step-9 mt-2.5 bg-[#071B14] rounded-xl p-3 text-white border border-[#C5A059]/30 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse shrink-0" />
                        <div>
                          <p className="font-serif text-sm font-bold text-white tracking-wide leading-tight">
                            {FIRM_DATA.partner.name}
                          </p>
                          <p className="text-[11px] text-[#B49A64]">
                            {FIRM_DATA.partner.qualifications} • Managing Partner
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0B241C] text-[#B49A64] border border-[#B49A64]/30 shrink-0">
                        AIR 49
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT THE FIRM
          Concise overview (~64 words) + Single CTA to /about
          Canvas: Warm Ivory #F1EBDD
          ========================================================================= */}
      <AboutSection showReadMore={true} headingLevel="h2" readMoreHref="/about" />

      {/* =========================================================================
          SECTION 3: CORE PRACTICE AREAS
          Exactly 5 clear categories (~15–25 words each) with direct links
          Canvas: Warm Ivory #F1EBDD
          ========================================================================= */}
      <ServicesSection />

      {/* =========================================================================
          SECTION 4: WHY CHOOSE US
          Exactly 4 factual institutional strengths (~15–25 words each)
          Canvas: Deep Evergreen #071B14
          ========================================================================= */}
      <WhyChooseUs />

      {/* =========================================================================
          SECTION 5: WORKING APPROACH
          Exactly 3 chronological engagement steps (~14 words each)
          Canvas: Warm Ivory #F1EBDD
          ========================================================================= */}
      <WorkingProcess />

      {/* =========================================================================
          SECTION 6: FEATURED INSIGHTS (V7.0.2 Refined Editorial Asymmetric Layout)
          Canvas: Warm Cream #F8EFDF
          ========================================================================= */}
      <FeaturedInsights articles={recentArticles} />

      {/* =========================================================================
          SECTION 7: CHAMBERS CONSULTATION & INTAKE
          Essential contact details, short invitation (17 words), simple enquiry form
          Canvas: Deep Evergreen #071B14
          ========================================================================= */}
      <section data-contact-section="true" className="py-10 sm:py-14 lg:py-16 bg-[#071B14] text-[#F1EBDD] border-b border-[#B49A64]/20 texture-architectural-lines relative overflow-hidden" id="contact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14">
            
            {/* Left 5 Columns: Chambers Contact Information */}
            <div className="lg:col-span-5 space-y-5 scroll-reveal-left">
              <div>
                <span className="text-xs font-semibold text-[#B49A64] block mb-2">
                  Connect With CA Kavitha &amp; Associates
                </span>
                <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#F1EBDD] font-serif font-bold tracking-tight">
                  Let's Discuss Your Financial &amp; Compliance Priorities
                </h2>
                <p className="font-editorial-body text-sm text-[#D8D0BE] mt-3 leading-relaxed border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4">
                  Discuss your statutory audit, tax advisory, or financial governance requirements directly with our practice desk.
                </p>
              </div>

              {/* Direct Communication Cards */}
              <div className="space-y-3.5 pt-1">
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-[#B49A64]/30 bg-[#0B241C] group shadow-card hover:border-[#B49A64] transition-colors btn-tactile min-h-[44px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 group-hover:bg-[#071B14] transition-colors">
                    <Phone className="w-5 h-5 text-[#B49A64]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#B49A64] block">
                      Direct Telephone Desk
                    </span>
                    <span className="font-editorial-body text-sm font-bold text-[#F1EBDD] group-hover:text-white">
                      {FIRM_DATA.contact.primaryPhone}
                    </span>
                    <span className="block font-editorial-body text-xs text-[#D8D0BE] mt-0.5">
                      Alternative: {FIRM_DATA.contact.secondaryPhone}
                    </span>
                  </div>
                </a>

                <a
                  href={`mailto:${FIRM_DATA.contact.email}`}
                  className="flex items-start gap-3.5 p-4 rounded-xl border border-[#B49A64]/30 bg-[#0B241C] group shadow-card hover:border-[#B49A64] transition-colors btn-tactile min-h-[44px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 group-hover:bg-[#071B14] transition-colors">
                    <Mail className="w-5 h-5 text-[#B49A64]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#B49A64] block">
                      Official Practice Email
                    </span>
                    <span className="font-editorial-body text-sm font-bold text-[#F1EBDD] group-hover:text-white break-all">
                      {FIRM_DATA.contact.email}
                    </span>
                    <span className="block font-editorial-body text-xs text-[#D8D0BE] mt-0.5">
                      Prompt written response on professional queries
                    </span>
                  </div>
                </a>

                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-[#B49A64]/30 bg-[#0B241C] shadow-card">
                  <div className="w-10 h-10 rounded-lg bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#B49A64]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#B49A64] block">
                      Principal Practice Chambers
                    </span>
                    <span className="font-editorial-body text-sm font-bold text-[#F1EBDD]">
                      {FIRM_DATA.contact.primaryLocation}
                    </span>
                    <span className="block font-editorial-body text-xs text-[#D8D0BE] mt-0.5">
                      Serving clients across South India &amp; Pan-India
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

export default HomePage;
