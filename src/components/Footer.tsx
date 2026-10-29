import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A2F24] text-gray-200 border-t-2 border-gold pt-14 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Column 1: Firm Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white text-brand-primary flex items-center justify-center font-serif font-bold text-lg border border-gold shadow-sm">
                KA
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  Kavitha & Associates
                </h3>
                <p className="text-xs text-gold font-medium uppercase tracking-wider">
                  Chartered Accountants
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Dependable, compliant, and growth-oriented Chartered Accountancy services providing financial, audit, tax, and corporate governance support throughout India.
            </p>

            <div className="pt-2 border-t border-emerald-900/40">
              <span className="text-xs text-gold uppercase tracking-wider font-semibold block mb-0.5">
                Practicing Chartered Accountant
              </span>
              <p className="text-sm font-medium text-white">{FIRM_DATA.partner.name}</p>
              <p className="text-xs text-emerald-200/90">{FIRM_DATA.partner.qualifications}</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase border-b border-emerald-800/80 pb-2">
              Practice Areas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/audit-assurance" className="hover:text-gold transition-colors flex items-center gap-2 text-emerald-100/90 hover:translate-x-0.5 transform">
                  <span className="text-gold">•</span> Audit & Assurance (Spotlight)
                </Link>
              </li>
              <li>
                <Link to="/services#income-tax" className="hover:text-gold transition-colors flex items-center gap-2 text-emerald-100/90 hover:translate-x-0.5 transform">
                  <span className="text-gold">•</span> Income Tax Filing & Advisory
                </Link>
              </li>
              <li>
                <Link to="/services#gst" className="hover:text-gold transition-colors flex items-center gap-2 text-emerald-100/90 hover:translate-x-0.5 transform">
                  <span className="text-gold">•</span> GST Compliance & Representation
                </Link>
              </li>
              <li>
                <Link to="/services#corporate-business" className="hover:text-gold transition-colors flex items-center gap-2 text-emerald-100/90 hover:translate-x-0.5 transform">
                  <span className="text-gold">•</span> ROC & Corporate Secretarial
                </Link>
              </li>
              <li>
                <Link to="/services#rera-compliance" className="hover:text-gold transition-colors flex items-center gap-2 text-emerald-100/90 hover:translate-x-0.5 transform">
                  <span className="text-gold">•</span> RERA Certification & Compliance
                </Link>
              </li>
              <li>
                <Link to="/services#advisory-consulting" className="hover:text-gold transition-colors flex items-center gap-2 text-emerald-100/90 hover:translate-x-0.5 transform">
                  <span className="text-gold">•</span> Strategic Financial Advisory
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Regional Presence & Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase border-b border-emerald-800/80 pb-2">
              Service Locations
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed mb-3">
              Serving corporate entities, startups, and institutions across India with active representation in:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {FIRM_DATA.serviceFootprint.map((loc) => (
                <span
                  key={loc.city}
                  className="px-2.5 py-1 rounded bg-emerald-900/80 border border-emerald-700/60 text-xs text-emerald-100 font-medium"
                >
                  {loc.city}
                </span>
              ))}
            </div>

            <div className="pt-3">
              <h5 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Navigation</h5>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-emerald-200">
                <Link to="/about" className="hover:text-gold transition-colors">About Firm</Link>
                <Link to="/industries" className="hover:text-gold transition-colors">Industries</Link>
                <Link to="/locations" className="hover:text-gold transition-colors">Service Reach</Link>
                <a href="/#knowledge-faq" className="hover:text-gold transition-colors">Statutory FAQ</a>
                <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase border-b border-emerald-800/80 pb-2">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-emerald-100/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Principal Practice:</strong> Bairagi Patteda, Tirupati – 517501, AP
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`} className="hover:text-gold transition-colors font-medium">
                    {FIRM_DATA.contact.primaryPhone}
                  </a>
                  <a href={`tel:${FIRM_DATA.contact.secondaryPhoneClean}`} className="hover:text-gold transition-colors">
                    {FIRM_DATA.contact.secondaryPhone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${FIRM_DATA.contact.email}`} className="hover:text-gold transition-colors break-all">
                  {FIRM_DATA.contact.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-medium border border-emerald-500/40 transition-colors shadow-xs"
              >
                <span>WhatsApp Consultation</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold" />
              </a>
            </div>
          </div>
        </div>

        {/* Regulatory & ICAI Compliance Disclaimer */}
        <div className="pt-8 pb-4 text-xs text-emerald-200/80 border-b border-emerald-900/50 leading-relaxed">
          <div className="flex items-start gap-2.5 max-w-4xl">
            <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <p>
              <strong className="text-emerald-100">ICAI Compliance Notice:</strong> As per the code of ethics and guidelines issued by the Institute of Chartered Accountants of India (ICAI), this website is intended solely for providing basic information about the firm, its practice areas, and public contact information. It is not intended to advertise or solicit work in any form or manner.
            </p>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-200/70">
          <div>
            © {new Date().getFullYear()} Kavitha & Associates. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Chartered Accountants & Cost Accountants</span>
            <span className="text-emerald-500/60">•</span>
            <Link to="/contact" className="hover:text-gold transition-colors">Client Support & Privacy Notice</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
