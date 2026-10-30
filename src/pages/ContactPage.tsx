import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { ContactForm } from '../components/ContactForm';
import { SEOHead } from '../components/SEOHead';

export const ContactPage: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  return (
    <div className="bg-brand-ivory page-reveal min-h-screen">
      <SEOHead
        title="Contact CA Kavitha Vijay | Tirupati Practice Chambers"
        description="Schedule a consultation with CA Kavitha Vijay (ICAI Mem. 252985). Call +91 96263 50900 or connect via official WhatsApp for audit, corporate advisory, and tax compliance inquiries."
        canonicalPath="/contact"
      />
      {/* Header Banner */}
      <section className="bg-brand-surface py-20 sm:py-24 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl scroll-reveal">
            <span className="badge-gold-pill mb-3">
              Practice Consultation • Direct Channels
            </span>
            <h1 className="font-editorial-h1 text-brand-forest mt-2">
              Contact Kavitha & Associates
            </h1>
            <p className="mt-4 font-editorial-body text-base sm:text-lg text-brand-muted leading-relaxed">
              Reach out directly to CA Kavitha Vijay and our senior audit team for initial consultations, regulatory assessments, and compliance engagements.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Contact Overview */}
            <div className="lg:col-span-5 space-y-6 scroll-reveal-left">
              <div>
                <h2 className="font-editorial-h2 text-brand-forest">
                  Official Communication Channels
                </h2>
                <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
                  We welcome direct inquiries from corporate directors, finance leaders, startups, and individual taxpayers.
                </p>
              </div>

              {/* Cards */}
              <div className="space-y-4 scroll-stagger">
                {/* Telephone */}
                <div className="p-5 rounded-2xl border border-border bg-white shadow-subtle space-y-2 card-premium-hover scroll-reveal">
                  <div className="flex items-center gap-3 text-brand-primary">
                    <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center border border-emerald-100">
                      <Phone className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
                        Telephone Enquiries
                      </span>
                      <span className="text-xs text-charcoal-muted">Click to call directly</span>
                    </div>
                  </div>
                  <div className="pt-2 pl-13 space-y-1 text-sm font-semibold text-brand-primary">
                    <div>
                      <a href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`} className="hover:text-brand-deep hover:underline btn-tactile inline-block">
                        {FIRM_DATA.contact.primaryPhone}
                      </a>
                      <span className="text-xs font-normal text-charcoal-light ml-2">(Primary Desk)</span>
                    </div>
                    <div>
                      <a href={`tel:${FIRM_DATA.contact.secondaryPhoneClean}`} className="hover:text-brand-deep hover:underline btn-tactile inline-block">
                        {FIRM_DATA.contact.secondaryPhone}
                      </a>
                      <span className="text-xs font-normal text-charcoal-light ml-2">(Alternative Line)</span>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="p-5 rounded-2xl border border-border bg-white shadow-subtle space-y-2 card-premium-hover scroll-reveal">
                  <div className="flex items-center gap-3 text-brand-primary">
                    <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center border border-emerald-100">
                      <Mail className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
                        Written Enquiries
                      </span>
                      <span className="text-xs text-charcoal-muted">For proposals and documentation</span>
                    </div>
                  </div>
                  <div className="pt-2 pl-13 text-sm font-semibold text-brand-primary">
                    <a href={`mailto:${FIRM_DATA.contact.email}`} className="hover:text-brand-deep hover:underline break-all btn-tactile inline-block">
                      {FIRM_DATA.contact.email}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 shadow-subtle space-y-2 card-premium-hover scroll-reveal">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                          Instant Messaging
                        </span>
                        <span className="text-xs text-emerald-700">Official WhatsApp Business Desk</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 pl-13">
                    <a
                      href={FIRM_DATA.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs btn-tactile"
                    >
                      <span>Start WhatsApp Conversation</span>
                    </a>
                  </div>
                </div>

                {/* Office Location */}
                <div className="p-5 rounded-xl border border-border bg-white shadow-subtle space-y-2 card-tactile scroll-reveal">
                  <div className="flex items-center gap-3 text-brand-primary">
                    <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center border border-emerald-100">
                      <MapPin className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
                        Principal Chambers Location
                      </span>
                      <span className="text-xs text-charcoal-muted">Registered Practice Office</span>
                    </div>
                  </div>
                  <div className="pt-1 pl-13 text-xs text-charcoal leading-relaxed space-y-1">
                    <strong className="text-brand-primary text-sm block">19-12-46, 1st Floor, Near Bairagipetteda Arch</strong>
                    <p className="text-charcoal-muted">
                      Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India
                    </p>
                    <p className="font-mono text-[11px] text-emerald-800 pt-0.5">
                      GPS: 13°37'09.2"N 79°25'05.0"E (13.6192242, 79.418046)
                    </p>
                    <div className="pt-2">
                      <a
                        href={FIRM_DATA.contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-forest text-white hover:bg-brand-deep font-semibold text-xs shadow-xs btn-tactile"
                      >
                        <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                        <span>Open Exact Location in Google Maps ↗</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* ICAI Compliance note */}
              <div className="p-4 rounded-xl bg-brand-pale border border-emerald-200/80 text-xs text-brand-primary flex items-start gap-2.5 scroll-reveal">
                <ShieldCheck className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  All initial inquiries are held in strict professional confidence under the ethical standards established by the Institute of Chartered Accountants of India.
                </p>
              </div>
            </div>

            {/* Right Interactive Form */}
            <div className="lg:col-span-7 scroll-reveal-right">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE GOOGLE MAPS CHAMBERS EMBED SECTION
          ========================================================================= */}
      <section className="pb-20 sm:pb-24 border-t border-brand-border/60 pt-16 bg-brand-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl overflow-hidden border border-brand-border bg-brand-white shadow-card scroll-reveal">
            <div className="p-6 sm:p-8 bg-brand-surface/70 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-editorial-meta text-xs uppercase tracking-wider text-gold-dark block mb-1">
                  Interactive Practice Chambers Location
                </span>
                <h3 className="font-editorial-h3 text-2xl font-bold text-brand-forest">
                  CA Kavitha &amp; Associates • Tirupati
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-brand-muted mt-1">
                  19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, Andhra Pradesh 517501, India
                </p>
              </div>
              <a
                href={FIRM_DATA.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-forest text-white text-xs font-semibold hover:bg-brand-deep transition-all shadow-xs btn-tactile shrink-0"
              >
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Open Google Maps Directions ↗</span>
              </a>
            </div>
            <div className="w-full h-80 sm:h-96 md:h-[420px] relative bg-brand-surface">
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
