import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, Globe, Clock, ArrowRight } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { ContactForm } from '../components/ContactForm';
import { SEOHead } from '../components/SEOHead';
import { AnimatedDotPattern, CurvedPathReveal, LetterReveal, WordReveal, TextHighlight } from '../components/animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';

export const ContactPage: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();

  return (
    <div className="bg-[#F5EAD8] text-[#302B24] min-h-screen page-reveal">
      <SEOHead
        title="Contact Chartered Accountant in Tirupati | Kavitha & Associates"
        description="Connect with CA Kavitha Vijay for professional audit, taxation, GST, compliance, and corporate advisory services across India. Direct telephone, email, and WhatsApp consultation."
        canonicalPath="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AccountingService',
          name: 'Kavitha & Associates',
          url: 'https://kavithaassociates.com/contact',
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
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:30',
            closes: '18:30'
          }
        }}
      />

      {/* =========================================================================
          PRIMARY CONSULTATION & CONTACT EXPERIENCE (Split 5:7 Layout)
          ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden texture-ivory-paper">
        {/* Subtle Decorative Animated Dot Accent in Top Right */}
        <div className="absolute top-8 right-10 pointer-events-none -z-0 opacity-20 hidden lg:block">
          <AnimatedDotPattern rows={3} cols={4} variant="gold" />
        </div>
        {/* Curved Path Accent in Bottom Left */}
        <div className="absolute -bottom-10 -left-10 pointer-events-none -z-0 opacity-25 hidden md:block">
          <CurvedPathReveal variant="corner" width={220} height={220} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* -------------------------------------------------------------------
                LEFT COLUMN: Introduction, 4 Contact Cards & Supporting Visual
                ------------------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-8 scroll-reveal-left">
              
              {/* Header & Introduction */}
              <div>
                <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                  <EditorialMarker number="07" label="PRACTICE CONTACT" />
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#C3A66B] motion-safe:animate-pulse" />
                    <LetterReveal text="LET'S CONNECT" as="span" className="tracking-widest uppercase font-semibold" />
                  </div>
                </div>

                <h1 className="font-editorial-h1 text-[#153F32] tracking-tight">
                  <WordReveal text="Let's Discuss Your Business Needs." as="span" />
                </h1>

                <p className="mt-4 font-editorial-body text-base text-[#525954] leading-relaxed">
                  Looking for professional financial guidance? Connect with our team for assistance with audit, taxation, GST, compliance and business advisory services <TextHighlight>across India</TextHighlight>.
                </p>
              </div>

              {/* 4 Contact Information Cards */}
              <div className="space-y-4 scroll-stagger">
                
                {/* 1. Call Our Team */}
                <div className="p-5 rounded-2xl border border-[#E8D5B5] bg-[#FFF9EF] shadow-subtle card-premium-hover scroll-reveal">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#DDE8D9] text-[#153F32] flex items-center justify-center shrink-0 border border-[#153F32]/20">
                      <Phone className="w-5 h-5 text-[#153F32]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-editorial-meta text-[11px] font-bold text-[#7E5E1E] uppercase tracking-wider block mb-0.5">
                        Direct Inquiries
                      </span>
                      <h2 className="font-serif text-lg font-bold text-[#153F32] leading-snug">
                        Call Our Team
                      </h2>
                      <p className="text-xs text-[#525954] mt-0.5 mb-2">
                        Direct telephone lines for priority client scheduling
                      </p>
                      <div className="space-y-1 font-sans text-sm font-semibold text-[#153F32]">
                        <div>
                          <a
                            href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                            className="hover:text-[#153F32] hover:underline btn-tactile inline-flex items-center gap-1.5"
                          >
                            <span>{FIRM_DATA.contact.primaryPhone}</span>
                            <span className="text-xs font-normal text-[#525954]">(Primary Desk)</span>
                          </a>
                        </div>
                        <div>
                          <a
                            href={`tel:${FIRM_DATA.contact.secondaryPhoneClean}`}
                            className="hover:text-[#153F32] hover:underline btn-tactile inline-flex items-center gap-1.5 text-xs font-medium text-[#525954] hover:text-[#153F32]"
                          >
                            <span>{FIRM_DATA.contact.secondaryPhone}</span>
                            <span>(Alternative Line)</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Email Us */}
                <div className="p-5 rounded-2xl border border-[#E8D5B5] bg-[#FFF9EF] shadow-subtle card-premium-hover scroll-reveal">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#DDE8D9] text-[#153F32] flex items-center justify-center shrink-0 border border-[#153F32]/20">
                      <Mail className="w-5 h-5 text-[#153F32]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-editorial-meta text-[11px] font-bold text-[#7E5E1E] uppercase tracking-wider block mb-0.5">
                        Written Enquiries
                      </span>
                      <h2 className="font-serif text-lg font-bold text-[#153F32] leading-snug">
                        Email Us
                      </h2>
                      <p className="text-xs text-[#525954] mt-0.5 mb-2">
                        For proposals, detailed statutory briefs, and documentation
                      </p>
                      <a
                        href={`mailto:${FIRM_DATA.contact.email}`}
                        className="text-sm font-bold text-[#153F32] hover:text-[#153F32] hover:underline break-all btn-tactile inline-block"
                      >
                        {FIRM_DATA.contact.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. WhatsApp Enquiries */}
                <div className="p-5 rounded-2xl border border-emerald-300/60 bg-emerald-50/40 shadow-subtle card-premium-hover scroll-reveal">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-editorial-meta text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-0.5">
                        Instant Messaging
                      </span>
                      <h2 className="font-serif text-lg font-bold text-[#153F32] leading-snug">
                        WhatsApp Enquiries
                      </h2>
                      <p className="text-xs text-emerald-800/80 mt-0.5 mb-3">
                        Official practice WhatsApp desk for swift consultation coordination
                      </p>
                      <a
                        href={FIRM_DATA.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors shadow-xs btn-tactile"
                      >
                        <span>Start WhatsApp Conversation</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 4. Pan-India Services */}
                <div className="p-5 rounded-2xl border border-[#E8D5B5] bg-[#FFF9EF] shadow-subtle card-premium-hover scroll-reveal">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#C3A66B]/15 text-[#C3A66B] flex items-center justify-center shrink-0 border border-[#C3A66B]/30">
                      <Globe className="w-5 h-5 text-[#C3A66B]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-editorial-meta text-[11px] font-bold text-[#7E5E1E] uppercase tracking-wider block mb-0.5">
                        National Reach
                      </span>
                      <h2 className="font-serif text-lg font-bold text-[#153F32] leading-snug">
                        Pan-India Services
                      </h2>
                      <p className="text-xs font-semibold text-[#153F32] mt-0.5 mb-1">
                        Serving Businesses Across India.
                      </p>
                      <p className="text-xs text-[#525954] leading-relaxed">
                        Virtual CFO advisory, corporate audits, direct tax representation, and GST compliance delivered securely via cloud-based client portals to enterprises in all Indian States and Union Territories.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Minimalist Chambers Advisory & Intake Protocol Surface */}
              <div className="rounded-2xl border border-[#E8D5B5] shadow-card bg-[#FFF9EF] p-6 scroll-reveal relative card-v4-inner-border">
                <CornerBrackets size={14} variant="gold" />
                <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#153F32] flex items-center justify-center text-[#D4AF37] shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#7E5E1E] uppercase tracking-wider block font-bold">
                      OFFICIAL PRACTICE ENGAGEMENT
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#153F32]">
                      Chambers Intake Protocol
                    </h3>
                  </div>
                </div>

                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed mb-4">
                  All consultations and statutory inquiries are evaluated directly by senior practice leadership. Consultations are available both in person at our Tirupati chambers and via secure virtual channels across India.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E8D5B5]/70 text-xs">
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#7E5E1E] uppercase tracking-wider block font-bold mb-0.5 flex items-center gap-1">
                      <GeometricSymbol type="diamond" />
                      <span>OFFICE HOURS</span>
                    </span>
                    <span className="font-semibold text-[#153F32] block">09:30 AM – 07:00 PM</span>
                    <span className="text-[11px] text-[#525954]">Monday – Saturday</span>
                  </div>
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#7E5E1E] uppercase tracking-wider block font-bold mb-0.5 flex items-center gap-1">
                      <GeometricSymbol type="diamond" />
                      <span>CONFIDENTIALITY</span>
                    </span>
                    <span className="font-semibold text-[#153F32] block">Strict NDAs Honored</span>
                    <span className="text-[11px] text-[#525954]">Partner Supervision</span>
                  </div>
                </div>
              </div>

              {/* Physical Chambers Identification (For ICAI / Statutory Compliance) */}
              <div className="p-5 rounded-2xl border border-[#E8D5B5] bg-[#FFF9EF] shadow-subtle space-y-2.5 card-tactile scroll-reveal">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DDE8D9] text-[#153F32] flex items-center justify-center shrink-0 border border-[#153F32]/20">
                    <MapPin className="w-5 h-5 text-[#153F32]" />
                  </div>
                  <div>
                    <span className="font-editorial-meta text-[11px] font-bold text-[#7E5E1E] uppercase tracking-wider block">
                      Principal Practice Chambers
                    </span>
                    <span className="text-xs text-[#525954]">Registered Operating Office</span>
                  </div>
                </div>

                <div className="pt-1 pl-[52px] text-xs text-[#252B27] leading-relaxed space-y-1.5">
                  <strong className="text-[#153F32] text-sm block">
                    19-12-46, 1st Floor, Near Bairagipetteda Arch
                  </strong>
                  <p className="text-[#525954]">
                    Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#525954] pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#C3A66B]" />
                    <span>Monday – Saturday: 9:30 AM – 6:30 PM IST</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={FIRM_DATA.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#153F32] text-white hover:bg-[#102D25] font-semibold text-xs shadow-xs btn-tactile transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#C3A66B]" />
                      <span>View Directions on Google Maps ↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Ethical Standards Note */}
              <div className="p-4 rounded-xl bg-[#FFF9EF] border border-[#E8D5B5] text-xs text-[#525954] flex items-start gap-3 scroll-reveal">
                <ShieldCheck className="w-5 h-5 text-[#C3A66B] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  In strict accordance with the Code of Ethics of the Institute of Chartered Accountants of India (ICAI), all consultation inquiries are held in rigorous professional confidence.
                </p>
              </div>

            </div>

            {/* -------------------------------------------------------------------
                RIGHT COLUMN: Premium Ivory Consultation Form
                ------------------------------------------------------------------- */}
            <div className="lg:col-span-7 scroll-reveal-right">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE GOOGLE MAPS EMBED SECTION (Positioned Below Split Layout)
          ========================================================================= */}
      <section className="pb-16 sm:pb-20 border-t border-[#E8D5B5] pt-14 bg-[#F8EFDF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden border border-[#E8D5B5] bg-[#FFF9EF] shadow-card scroll-reveal">
            <div className="p-6 sm:p-7 bg-[#FFF9EF] border-b border-[#E8D5B5] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-editorial-meta text-xs uppercase tracking-wider text-[#7E5E1E] font-semibold block mb-1">
                  Chambers Coordinates
                </span>
                <h3 className="font-editorial-h3 text-xl sm:text-2xl font-bold text-[#153F32]">
                  CA Kavitha &amp; Associates • Practice Chambers
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-1">
                  19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, Andhra Pradesh – 517501
                </p>
              </div>
              <a
                href={FIRM_DATA.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#153F32] text-white text-xs font-semibold hover:bg-[#102D25] transition-colors duration-200 shadow-xs btn-tactile shrink-0"
              >
                <MapPin className="w-4 h-4 text-[#C3A66B]" />
                <span>Open Google Maps Directions ↗</span>
              </a>
            </div>
            <div className="w-full h-72 sm:h-80 md:h-96 relative bg-[#F8EFDF]">
              <iframe
                title="CA Kavitha & Associates Office Location Map"
                src="https://maps.google.com/maps?q=13.6192242,79.418046+(CA+Kavitha+%26+Associates)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
