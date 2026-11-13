new_contact_page = """import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck, Globe, Clock, ArrowRight } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { ContactForm } from '../components/ContactForm';
import { SEOHead } from '../components/SEOHead';

export const ContactPage: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();

  return (
    <div className="bg-[#FBF7EF] text-[#292B27] min-h-screen page-reveal">
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
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* -------------------------------------------------------------------
                LEFT COLUMN: Introduction, 4 Contact Cards & Supporting Visual
                ------------------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-8 scroll-reveal-left">
              
              {/* Header & Introduction */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D30] text-[#C9A66B] font-editorial-meta text-xs border border-[#C9A66B]/40 shadow-xs mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] motion-safe:animate-pulse" />
                  <span className="tracking-widest uppercase font-semibold">LET'S CONNECT</span>
                </div>

                <h1 className="font-editorial-h1 text-[#183D30] tracking-tight">
                  Let's Discuss Your Business Needs.
                </h1>

                <p className="mt-4 font-editorial-body text-base text-[#66665E] leading-relaxed">
                  Looking for professional financial guidance? Connect with our team for assistance with audit, taxation, GST, compliance and business advisory services across India.
                </p>
              </div>

              {/* 4 Contact Information Cards */}
              <div className="space-y-4 scroll-stagger">
                
                {/* 1. Call Our Team */}
                <div className="p-5 rounded-2xl border border-[#E9E0D2] bg-[#FFFDF8] shadow-subtle card-premium-hover scroll-reveal">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 border border-[#356B50]/20">
                      <Phone className="w-5 h-5 text-[#356B50]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-editorial-meta text-[11px] font-bold text-[#C9A66B] uppercase tracking-wider block mb-0.5">
                        Direct Inquiries
                      </span>
                      <h2 className="font-serif text-lg font-bold text-[#183D30] leading-snug">
                        Call Our Team
                      </h2>
                      <p className="text-xs text-[#66665E] mt-0.5 mb-2">
                        Direct telephone lines for priority client scheduling
                      </p>
                      <div className="space-y-1 font-sans text-sm font-semibold text-[#183D30]">
                        <div>
                          <a
                            href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                            className="hover:text-[#356B50] hover:underline btn-tactile inline-flex items-center gap-1.5"
                          >
                            <span>{FIRM_DATA.contact.primaryPhone}</span>
                            <span className="text-xs font-normal text-[#66665E]">(Primary Desk)</span>
                          </a>
                        </div>
                        <div>
                          <a
                            href={`tel:${FIRM_DATA.contact.secondaryPhoneClean}`}
                            className="hover:text-[#356B50] hover:underline btn-tactile inline-flex items-center gap-1.5 text-xs font-medium text-[#66665E] hover:text-[#183D30]"
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
                <div className="p-5 rounded-2xl border border-[#E9E0D2] bg-[#FFFDF8] shadow-subtle card-premium-hover scroll-reveal">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 border border-[#356B50]/20">
                      <Mail className="w-5 h-5 text-[#356B50]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-editorial-meta text-[11px] font-bold text-[#C9A66B] uppercase tracking-wider block mb-0.5">
                        Written Enquiries
                      </span>
                      <h2 className="font-serif text-lg font-bold text-[#183D30] leading-snug">
                        Email Us
                      </h2>
                      <p className="text-xs text-[#66665E] mt-0.5 mb-2">
                        For proposals, detailed statutory briefs, and documentation
                      </p>
                      <a
                        href={`mailto:${FIRM_DATA.contact.email}`}
                        className="text-sm font-bold text-[#183D30] hover:text-[#356B50] hover:underline break-all btn-tactile inline-block"
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
                      <h2 className="font-serif text-lg font-bold text-[#183D30] leading-snug">
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
                <div className="p-5 rounded-2xl border border-[#E9E0D2] bg-[#FFFDF8] shadow-subtle card-premium-hover scroll-reveal">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#C9A66B]/15 text-[#C9A66B] flex items-center justify-center shrink-0 border border-[#C9A66B]/30">
                      <Globe className="w-5 h-5 text-[#C9A66B]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-editorial-meta text-[11px] font-bold text-[#C9A66B] uppercase tracking-wider block mb-0.5">
                        National Reach
                      </span>
                      <h2 className="font-serif text-lg font-bold text-[#183D30] leading-snug">
                        Pan-India Services
                      </h2>
                      <p className="text-xs font-semibold text-[#356B50] mt-0.5 mb-1">
                        Serving Businesses Across India.
                      </p>
                      <p className="text-xs text-[#66665E] leading-relaxed">
                        Virtual CFO advisory, corporate audits, direct tax representation, and GST compliance delivered securely via cloud-based client portals to enterprises in all Indian States and Union Territories.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Supporting Visual: Consultation Experience */}
              <div className="rounded-2xl overflow-hidden border border-[#E9E0D2] shadow-subtle bg-[#FFFDF8] p-2.5 scroll-reveal">
                <img
                  src="/images/contact/consultation.webp"
                  alt="Professional Indian Corporate Consultation in Progress"
                  width="600"
                  height="335"
                  loading="lazy"
                  className="w-full h-48 sm:h-56 object-cover rounded-xl"
                />
                <div className="pt-2.5 px-1.5 flex items-center justify-between text-xs text-[#66665E]">
                  <span className="font-editorial-meta text-[#356B50] font-semibold">Chambers Advisory</span>
                  <span className="font-sans">Kavitha &amp; Associates</span>
                </div>
              </div>

              {/* Physical Chambers Identification (For ICAI / Statutory Compliance) */}
              <div className="p-5 rounded-2xl border border-[#E9E0D2] bg-[#FFFDF8] shadow-subtle space-y-2.5 card-tactile scroll-reveal">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 border border-[#356B50]/20">
                    <MapPin className="w-5 h-5 text-[#356B50]" />
                  </div>
                  <div>
                    <span className="font-editorial-meta text-[11px] font-bold text-[#C9A66B] uppercase tracking-wider block">
                      Principal Practice Chambers
                    </span>
                    <span className="text-xs text-[#66665E]">Registered Operating Office</span>
                  </div>
                </div>

                <div className="pt-1 pl-[52px] text-xs text-[#292B27] leading-relaxed space-y-1.5">
                  <strong className="text-[#183D30] text-sm block">
                    19-12-46, 1st Floor, Near Bairagipetteda Arch
                  </strong>
                  <p className="text-[#66665E]">
                    Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#66665E] pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Monday – Saturday: 9:30 AM – 6:30 PM IST</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={FIRM_DATA.contact.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#356B50] text-white hover:bg-[#183D30] font-semibold text-xs shadow-xs btn-tactile transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#C9A66B]" />
                      <span>View Directions on Google Maps ↗</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Ethical Standards Note */}
              <div className="p-4 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] text-xs text-[#66665E] flex items-start gap-3 scroll-reveal">
                <ShieldCheck className="w-5 h-5 text-[#C9A66B] shrink-0 mt-0.5" />
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
      <section className="pb-16 sm:pb-20 border-t border-[#E9E0D2] pt-14 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden border border-[#E9E0D2] bg-[#FFFDF8] shadow-card scroll-reveal">
            <div className="p-6 sm:p-7 bg-[#FFFDF8] border-b border-[#E9E0D2] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-editorial-meta text-xs uppercase tracking-wider text-[#C9A66B] font-semibold block mb-1">
                  Chambers Coordinates
                </span>
                <h3 className="font-editorial-h3 text-xl sm:text-2xl font-bold text-[#183D30]">
                  CA Kavitha &amp; Associates • Practice Chambers
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-[#66665E] mt-1">
                  19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, Andhra Pradesh – 517501
                </p>
              </div>
              <a
                href={FIRM_DATA.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#356B50] text-white text-xs font-semibold hover:bg-[#183D30] transition-colors duration-200 shadow-xs btn-tactile shrink-0"
              >
                <MapPin className="w-4 h-4 text-[#C9A66B]" />
                <span>Open Google Maps Directions ↗</span>
              </a>
            </div>
            <div className="w-full h-72 sm:h-80 md:h-96 relative bg-[#FBF7EF]">
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
"""

with open('src/pages/ContactPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_contact_page)

print("Updated ContactPage.tsx successfully!")
