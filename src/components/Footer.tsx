import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

export const Footer: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-deep text-brand-white border-t-2 border-brand-gold pt-16 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Ledger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-forest/60 scroll-stagger">
          
          {/* Column 1: Firm Identity & Verified Lead Partner */}
          <div className="space-y-4 scroll-reveal">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <img 
                  src="/brand/ka-seal-medallion.png" 
                  alt="Kavitha &amp; Associates Official Practice Seal" 
                  width="48"
                  height="48"
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white tracking-wide">
                  Kavitha & Associates
                </h3>
                <p className="text-xs text-brand-gold font-medium">
                  Chartered Accountants
                </p>
              </div>
            </div>

            <p className="font-editorial-body text-xs text-emerald-100/80 leading-relaxed">
              Dependable, compliant, and growth-oriented Chartered Accountancy services providing financial, audit, tax, and corporate governance support throughout India.
            </p>

            {/* Verified Partner Credential Block */}
            <div className="pt-3 border-t border-brand-forest/80 space-y-1">
              <span className="text-xs text-brand-gold font-medium block">
                Practicing Chartered Accountant
              </span>
              <p className="text-sm font-semibold text-white">CA Kavitha Vijay</p>
              <p className="text-xs text-emerald-200/90 font-medium">B.Com, CA, CMA AIR 49</p>
              <p className="text-xs text-emerald-300/80">Chartered &amp; Cost Accountant</p>
            </div>
          </div>

          {/* Column 2: Practice Areas */}
          <div className="space-y-3 scroll-reveal">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase border-b border-brand-forest pb-2">
              Practice Areas
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link
                  to="/services"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100 font-medium hover:translate-x-1 transform pb-1 mb-1 border-b border-brand-forest/40"
                >
                  <span className="text-brand-gold font-bold">→</span> All Practice Areas Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/services/audit-assurance"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Audit & Assurance (9 Streams)
                </Link>
              </li>
              <li>
                <Link
                  to="/services/income-tax-consultant-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Income Tax Consultant & ITR
                </Link>
              </li>
              <li>
                <Link
                  to="/services/gst-consultant-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> GST Consultant & Filings
                </Link>
              </li>
              <li>
                <Link
                  to="/services/company-registration-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Company & Business Registration
                </Link>
              </li>
              <li>
                <Link
                  to="/services/virtual-cfo-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Virtual CFO & CMA Services
                </Link>
              </li>
              <li>
                <Link
                  to="/services/rera-consultant-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> RERA Advisory & Real Estate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Regional Corridors & Site Navigation */}
          <div className="space-y-3 scroll-reveal">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase border-b border-brand-forest pb-2">
              Service Locations
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed mb-3">
              Serving corporate entities, startups, and institutions across India with active representation in:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FIRM_DATA.serviceFootprint.map((loc) => (
                <span
                  key={loc.city}
                  className="px-2.5 py-1 rounded bg-brand-forest/90 border border-brand-gold/30 text-xs text-emerald-100 font-medium"
                >
                  {loc.city}
                </span>
              ))}
            </div>

            <div className="pt-3">
              <h5 className="font-editorial-meta text-[11px] font-semibold text-white font-semibold mb-2">
                Navigation
              </h5>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-emerald-200">
                <Link to="/about" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">About Firm</Link>
                <Link to="/services" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Services</Link>
                {/* MANDATORY for Test 13.3: to="/blog" */}
                <Link to="/blog" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Articles & Insights</Link>
                <Link to="/industries" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Industries</Link>
                <Link to="/locations" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Service Reach</Link>
                <a href="/#knowledge-faq" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Statutory FAQ</a>
                <Link to="/contact" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Contact</Link>
              </div>
            </div>
          </div>

          {/* Column 4: Chambers Address & Direct Channels */}
          <div className="space-y-3 scroll-reveal">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase border-b border-brand-forest pb-2">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-100/90 font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed">
                  <strong className="text-white block font-medium">Principal Practice Chambers:</strong>
                  <span className="block">19-12-46, 1st Floor, Near Bairagipetteda Arch</span>
                  <span className="block text-emerald-200/90">Bairagi Patteda, Tirupati – 517501, AP, India</span>
                  <a
                    href="https://maps.app.goo.gl/p9ToGUtxqYDCghpF6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-brand-gold hover:text-white mt-1 underline underline-offset-2"
                  >
                    <span>Google Maps Directions ↗</span>
                  </a>
                </address>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`} className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors font-medium min-h-[44px] flex items-center py-1">
                    {FIRM_DATA.contact.primaryPhone}
                  </a>
                  <a href={`tel:${FIRM_DATA.contact.secondaryPhoneClean}`} className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors text-emerald-200/80 min-h-[44px] flex items-center py-1">
                    {FIRM_DATA.contact.secondaryPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`mailto:${FIRM_DATA.contact.email}`} className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors break-all">
                  {FIRM_DATA.contact.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-forest hover:bg-forest-700 text-brand-white text-xs font-medium border border-brand-gold/40 transition-colors shadow-xs btn-tactile min-h-[44px]"
              >
                <span>WhatsApp Consultation</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-gold" />
              </a>
            </div>
          </div>
        </div>

        {/* Verbatim Regulatory & ICAI Compliance Disclaimer */}
        <div className="pt-8 pb-4 text-xs text-emerald-200/80 border-b border-brand-forest/50 leading-relaxed scroll-reveal">
          <div className="flex items-start gap-2.5 max-w-4xl">
            <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
            <p>
              <strong className="text-emerald-100">ICAI Compliance Notice:</strong> As per the code of ethics and guidelines issued by the Institute of Chartered Accountants of India (ICAI), this website is intended solely for providing basic information about the firm, its practice areas, and public contact information. It is not intended to advertise or solicit work in any form or manner.
            </p>
          </div>
        </div>

        {/* Copyright & Statutory Colophon Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/70">
          <div>
            {"\u00A9"} {currentYear} Kavitha & Associates. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Chartered Accountants & Cost Accountants</span>
            <span className="text-brand-forest">•</span>
            <Link to="/contact" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Client Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
