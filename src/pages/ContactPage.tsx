import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { ContactForm } from '../components/ContactForm';
import { SEOHead } from '../components/SEOHead';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-brand-warm">
      <SEOHead
        title="Contact CA KavithaVijay SRJ | Tirupati Practice Chambers"
        description="Schedule a consultation with CA KavithaVijay SRJ. Call +91 96263 50900 or connect via official WhatsApp for audit, corporate advisory, and tax compliance inquiries."
        canonicalPath="/contact"
      />
      {/* Header Banner */}
      <section className="bg-brand-surface py-14 sm:py-18 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Practice Consultation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              Contact Kavitha & Associates
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              Reach out directly to CA KavithaVijay SRJ and our senior audit team for initial consultations, regulatory assessments, and compliance engagements.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Contact Overview */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-brand-primary">
                  Official Communication Channels
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-2 leading-relaxed">
                  We welcome direct inquiries from corporate directors, finance leaders, startups, and individual taxpayers.
                </p>
              </div>

              {/* Cards */}
              <div className="space-y-4">
                {/* Telephone */}
                <div className="p-5 rounded-xl border border-border bg-white shadow-subtle space-y-2">
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
                      <a href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`} className="hover:text-brand-deep hover:underline">
                        {FIRM_DATA.contact.primaryPhone}
                      </a>
                      <span className="text-xs font-normal text-charcoal-light ml-2">(Primary Desk)</span>
                    </div>
                    <div>
                      <a href={`tel:${FIRM_DATA.contact.secondaryPhoneClean}`} className="hover:text-brand-deep hover:underline">
                        {FIRM_DATA.contact.secondaryPhone}
                      </a>
                      <span className="text-xs font-normal text-charcoal-light ml-2">(Alternative Line)</span>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="p-5 rounded-xl border border-border bg-white shadow-subtle space-y-2">
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
                    <a href={`mailto:${FIRM_DATA.contact.email}`} className="hover:text-brand-deep hover:underline break-all">
                      {FIRM_DATA.contact.email}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/60 shadow-subtle space-y-2">
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      <span>Start WhatsApp Conversation</span>
                    </a>
                  </div>
                </div>

                {/* Office Location */}
                <div className="p-5 rounded-xl border border-border bg-white shadow-subtle space-y-2">
                  <div className="flex items-center gap-3 text-brand-primary">
                    <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center border border-emerald-100">
                      <MapPin className="w-5 h-5 text-emerald-800" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
                        Principal Location
                      </span>
                      <span className="text-xs text-charcoal-muted">Practice Chambers</span>
                    </div>
                  </div>
                  <div className="pt-1 pl-13 text-xs text-charcoal leading-relaxed">
                    <strong className="text-brand-primary text-sm">Tirupati, Andhra Pradesh, India</strong>
                    <p className="text-charcoal-muted mt-0.5">
                      Consultation visits in Chennai, Bengaluru, Hyderabad, and Coimbatore arranged on client mandate.
                    </p>
                  </div>
                </div>
              </div>

              {/* ICAI Compliance note */}
              <div className="p-4 rounded-xl bg-brand-pale border border-emerald-200/80 text-xs text-brand-primary flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  All initial inquiries are held in strict professional confidence under the ethical standards established by the Institute of Chartered Accountants of India.
                </p>
              </div>
            </div>

            {/* Right Interactive Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
