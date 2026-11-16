import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { useFirmProfile } from '../../adapters/backendAdapter';
import { ContactForm } from '../forms/ContactForm';
import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../decorative';
import { Reveal } from '../animation';
import { ChambersStatusIndicator } from '../common/ChambersStatusIndicator';

export const ChambersIntakeSection: React.FC = () => {
  const firmProfile = useFirmProfile();

  return (
    <section 
      id="chambers-contact"
      data-contact-section="true"
      className="py-12 sm:py-16 lg:py-20 bg-[#071B14] text-[#F1EBDD] border-b border-[#B49A64]/20 texture-architectural-lines relative overflow-hidden scroll-mt-28" 
    >
      {/* Anchor Aliases */}
      <div id="contact-section" className="scroll-mt-28" />
      <div id="contact" className="scroll-mt-28" />

      {/* Ambient Decorative Layer */}
      <DecorativeLayer>
        <DotGrid
          variant="sage"
          width={220}
          height={220}
          className="absolute -bottom-8 -right-8 opacity-20 hidden md:block"
        />
      </DecorativeLayer>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-start">
          
          {/* Left 5 Columns: Chambers Contact Coordinates & 17-Word Invitation */}
          <div className="lg:col-span-5 space-y-5">
            <Reveal direction="left" delay={60} duration={650}>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-2.5">
                  <span className="text-xs font-semibold text-[#B49A64] font-mono uppercase tracking-wider">
                    Connect With CA Kavitha &amp; Associates
                  </span>
                  <ChambersStatusIndicator variant="pill" theme="dark" showDetail={true} />
                </div>
                <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#F1EBDD] font-serif font-bold tracking-tight">
                  Let's Discuss Your Financial &amp; Compliance Priorities
                </h2>
                {/* Strictly 17-Word Invitation */}
                <p className="font-editorial-body text-sm text-[#D8D0BE] mt-3 leading-relaxed border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4">
                  Discuss your statutory audit, tax advisory, or financial governance requirements directly with our practice desk in Tirupati.
                </p>

                {/* Chambers Double-Rule Accent */}
                <ArchitecturalLines type="double-rule" variant="bronze" length="90px" className="my-3 opacity-60" />
              </div>

              {/* Direct Communication Cards */}
              <div className="space-y-3 pt-1">
                {/* Telephone Desk */}
                <a
                  href={`tel:${firmProfile.contact.primaryPhoneClean}`}
                  className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#B49A64]/30 bg-[#0B241C] group hover:border-[#B49A64] hover:shadow-[0_8px_24px_rgba(180,154,100,0.18)] hover:-translate-y-1 transition-all duration-300 btn-tactile min-h-[44px] relative overflow-hidden"
                >
                  <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />
                  <div className="absolute top-2 left-2 w-3 h-3 group-hover:w-4 group-hover:h-4 border-t-2 border-l-2 border-[#B49A64]/40 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 group-hover:w-4 group-hover:h-4 border-b-2 border-r-2 border-[#B49A64]/40 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                  <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30 group-hover:bg-[#071B14] group-hover:scale-110 group-hover:rotate-6 group-hover:border-[#C5A059] group-hover:shadow-[0_0_16px_rgba(180,154,100,0.35)] transition-all duration-300">
                    <Phone className="w-5 h-5 text-[#B49A64] group-hover:text-[#F1EBDD] transition-colors" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#B49A64] block">
                      Direct Telephone Desk
                    </span>
                    <span className="font-editorial-body text-sm font-bold text-[#F1EBDD] group-hover:text-white transition-colors">
                      {firmProfile.contact.primaryPhone}
                    </span>
                    <span className="block font-editorial-body text-xs text-[#D8D0BE] mt-0.5">
                      Alternative: {firmProfile.contact.secondaryPhone}
                    </span>
                  </div>
                </a>

                {/* Confidential Email Desk */}
                <a
                  href={`mailto:${firmProfile.contact.email}`}
                  className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#B49A64]/30 bg-[#0B241C] group hover:border-[#B49A64] hover:shadow-[0_8px_24px_rgba(180,154,100,0.18)] hover:-translate-y-1 transition-all duration-300 btn-tactile min-h-[44px] relative overflow-hidden"
                >
                  <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />
                  <div className="absolute top-2 left-2 w-3 h-3 group-hover:w-4 group-hover:h-4 border-t-2 border-l-2 border-[#B49A64]/40 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 group-hover:w-4 group-hover:h-4 border-b-2 border-r-2 border-[#B49A64]/40 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                  <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30 group-hover:bg-[#071B14] group-hover:scale-110 group-hover:rotate-6 group-hover:border-[#C5A059] group-hover:shadow-[0_0_16px_rgba(180,154,100,0.35)] transition-all duration-300">
                    <Mail className="w-5 h-5 text-[#B49A64] group-hover:text-[#F1EBDD] transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#B49A64] block">
                      Confidential Practice Email
                    </span>
                    <span className="font-editorial-body text-sm font-bold text-[#F1EBDD] group-hover:text-white truncate block transition-colors">
                      {firmProfile.contact.email}
                    </span>
                    <span className="block font-editorial-body text-xs text-[#D8D0BE] mt-0.5">
                      Encrypted regulatory submission channel
                    </span>
                  </div>
                </a>

                {/* Principal Chambers Coordinates */}
                <a
                  href={firmProfile.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#B49A64]/30 bg-[#0B241C] group hover:border-[#B49A64] hover:shadow-[0_8px_24px_rgba(180,154,100,0.18)] hover:-translate-y-1 transition-all duration-300 btn-tactile min-h-[44px] relative overflow-hidden"
                >
                  <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />
                  <div className="absolute top-2 left-2 w-3 h-3 group-hover:w-4 group-hover:h-4 border-t-2 border-l-2 border-[#B49A64]/40 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 group-hover:w-4 group-hover:h-4 border-b-2 border-r-2 border-[#B49A64]/40 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                  <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30 group-hover:bg-[#071B14] group-hover:scale-110 group-hover:rotate-6 group-hover:border-[#C5A059] group-hover:shadow-[0_0_16px_rgba(180,154,100,0.35)] transition-all duration-300">
                    <MapPin className="w-5 h-5 text-[#B49A64] group-hover:text-[#F1EBDD] transition-colors" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#B49A64] block">
                      Principal Chambers
                    </span>
                    <span className="font-editorial-body text-xs sm:text-sm font-medium text-[#F1EBDD] group-hover:text-white leading-snug block transition-colors">
                      {firmProfile.contact.streetAddress}, {firmProfile.contact.locality}, Andhra Pradesh {firmProfile.contact.postalCode}
                    </span>
                    <span className="block font-editorial-body text-xs text-[#B49A64] mt-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                      View on Google Maps →
                    </span>
                  </div>
                </a>

                {/* Verified Chambers Coordinates & Directions on Google Maps */}
                <a
                  href={firmProfile.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border border-[#B49A64]/40 bg-[#0B241C] group hover:border-[#B49A64] hover:shadow-[0_8px_24px_rgba(180,154,100,0.18)] hover:-translate-y-1 transition-all duration-300 btn-tactile min-h-[44px] relative overflow-hidden"
                >
                  <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />
                  <div className="absolute top-2 left-2 w-3 h-3 group-hover:w-4 group-hover:h-4 border-t-2 border-l-2 border-[#B49A64]/40 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 group-hover:w-4 group-hover:h-4 border-b-2 border-r-2 border-[#B49A64]/40 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30 group-hover:bg-[#071B14] group-hover:scale-110 group-hover:rotate-6 group-hover:border-[#C5A059] group-hover:shadow-[0_0_16px_rgba(180,154,100,0.35)] transition-all duration-300 font-serif font-black text-lg">
                      <MapPin className="w-5 h-5 text-[#B49A64] group-hover:text-[#F1EBDD] transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-editorial-body text-xs font-bold text-[#F1EBDD] group-hover:text-white transition-colors">Verified Chambers Coordinates</span>
                        <span className="font-mono text-[10px] font-bold text-[#B49A64] bg-[#183529] px-2 py-0.5 rounded border border-[#B49A64]/30 group-hover:bg-[#B49A64] group-hover:text-[#071B14] transition-colors">Google Maps</span>
                      </div>
                      <span className="text-xs text-[#D8D0BE] mt-0.5 block">
                        Principal Chambers • Bairagi Patteda, Tirupati
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#B49A64] font-semibold flex items-center gap-1 shrink-0 group-hover:translate-x-1 group-hover:text-[#F1EBDD] transition-all">
                    View Directions →
                  </span>
                </a>

                {/* Working Hours & Ethics Guarantee */}
                <div className="p-4 rounded-2xl border border-[#B49A64]/20 bg-[#0B241C] flex items-center justify-between text-xs text-[#AAB4A0] flex-wrap gap-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#B49A64]" />
                      <span>Mon–Fri: 09:30–18:30 | Sat: 10:00–14:00</span>
                    </span>
                    <ChambersStatusIndicator variant="compact" theme="dark" showDetail={false} />
                  </div>
                  <span className="flex items-center gap-1.5 text-[#B49A64] font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ICAI Code of Ethics Adherence</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right 7 Columns: Embedded Consultation Intake Form */}
          <div className="lg:col-span-7">
            <Reveal direction="right" delay={120} duration={650}>
              <div className="bg-[#0B241C] p-6 sm:p-8 rounded-2xl border border-[#B49A64]/30 shadow-2xl relative group hover:border-[#B49A64]/60 hover:shadow-[0_24px_56px_rgba(7,27,20,0.5)] transition-all duration-500 overflow-hidden">
                {/* Top Metallic Hairline */}
                <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/40 to-transparent group-hover:via-[#B49A64] transition-all duration-500" aria-hidden="true" />
                {/* Dynamic Corner Brass Accents (Expand on Hover) */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-t-2 border-l-2 border-[#B49A64]/50 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-b-2 border-r-2 border-[#B49A64]/50 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                <div className="mb-6">
                  <span className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider block mb-1">
                    DIRECT CONSULTATION INTAKE
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#F1EBDD]">
                    Initiate a Confidential Practice Inquiry
                  </h3>
                  <p className="text-xs text-[#AAB4A0] mt-1">
                    All communications are protected under professional privilege and ICAI client confidentiality standards.
                  </p>
                </div>

                {/* Embedded V8 Reusable ContactForm */}
                <ContactForm
                  initialService="Statutory Audit & Assurance"
                  initialEntity="Private Limited Company"
                />
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ChambersIntakeSection;
