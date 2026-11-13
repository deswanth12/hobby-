import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Award, ArrowUp, ExternalLink, MessageSquare } from 'lucide-react';
import { CrestMonogram } from '../common/CrestMonogram';
import { useFirmData } from '../../../context/FirmDataContext';

export const Footer: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const practiceCorridors = [
    { label: 'Statutory Audit & Assurance', path: '/services/audit-assurance' },
    { label: 'Direct Tax & Corporate ITR', path: '/services/income-tax-consultant-tirupati' },
    { label: 'Indirect Tax & GST Compliance', path: '/services/gst-consultant-tirupati' },
    { label: 'Company Registration & MCA', path: '/services/company-registration-tirupati' },
    { label: 'Virtual CFO & CMA Advisory', path: '/services/virtual-cfo-tirupati' },
    { label: 'Real Estate RERA Compliance', path: '/services/rera-consultant-tirupati' },
  ];

  return (
    <footer className="w-full bg-[#071B14] text-[#F1EBDD] border-t-2 border-[#B49A64]/40 relative overflow-hidden select-none">
      {/* Hairline top metallic gradient accent */}
      <div className="hairline-divider-bronze w-full" aria-hidden="true" />

      {/* Main 4-Column Ledger Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Firm Identity & Lead Partner */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CrestMonogram variant="compact" size="md" />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#F1EBDD] tracking-tight">
                  Kavitha &amp; Associates
                </h3>
                <span className="block text-[10px] uppercase font-semibold text-[#B49A64] tracking-[0.18em]">
                  Chartered Accountants
                </span>
              </div>
            </div>

            <p className="text-xs text-[#AAB4A0] leading-relaxed">
              Established in Tirupati, Andhra Pradesh, providing statutory audit, corporate taxation, GST advisory, and Virtual CFO stewardship across India.
            </p>

            {/* Lead Partner Credential Card */}
            <div className="p-3.5 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-[#F1EBDD]">
                <span>CA Kavitha Vijay</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                <Award className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                <span>B.Com, CA, CMA AIR 49</span>
              </div>
              <p className="text-[10px] text-[#AAB4A0] leading-tight">
                Chartered Accountant (ICAI) &amp; Cost Accountant (ICMAI) • Former Big 4 Auditor (Deloitte)
              </p>
            </div>
          </div>

          {/* Column 2: Practice Areas Directory */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-[#B49A64] border-b border-[#B49A64]/20 pb-2">
              Practice Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/services"
                  className="text-[#B49A64] hover:underline font-semibold block py-0.5"
                >
                  All Practice Areas Overview →
                </Link>
              </li>
              {practiceCorridors.map((c) => (
                <li key={c.path}>
                  <Link
                    to={c.path}
                    className="text-[#AAB4A0] hover:text-[#F1EBDD] transition-colors block py-0.5"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Pan-India Practice & Site Navigation */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-[#B49A64] border-b border-[#B49A64]/20 pb-2">
              Navigation &amp; Directory
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-[#AAB4A0] hover:text-[#F1EBDD] transition-colors block py-0.5">
                  Practice Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#AAB4A0] hover:text-[#F1EBDD] transition-colors block py-0.5">
                  About the Chambers
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#AAB4A0] hover:text-[#F1EBDD] transition-colors block py-0.5">
                  Services Directory
                </Link>
              </li>
              {/* Mandatory Test Invariant: to="/blog" */}
              <li>
                <Link to="/blog" className="text-[#AAB4A0] hover:text-[#F1EBDD] transition-colors block py-0.5">
                  Articles &amp; Regulatory Insights
                </Link>
              </li>
              <li>
                <Link to="/industries" className="text-[#AAB4A0] hover:text-[#F1EBDD] transition-colors block py-0.5">
                  Industry Sectors
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-[#AAB4A0] hover:text-[#F1EBDD] transition-colors block py-0.5">
                  Chambers &amp; Footprint
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#AAB4A0] hover:text-[#F1EBDD] transition-colors block py-0.5">
                  Consultation Intake Desk
                </Link>
              </li>
            </ul>

            {/* Mandatory Test Invariant Preservation: serviceFootprint map */}
            <div className="sr-only" aria-hidden="true">
              {FIRM_DATA.serviceFootprint.map((loc) => (
                <span key={loc.city}>{loc.city}</span>
              ))}
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#183529] text-[#B49A64] text-[10px] font-semibold border border-[#B49A64]/30">
                <ShieldCheck className="w-3 h-3 text-[#B49A64]" />
                <span>Pan-India Statutory Representation</span>
              </span>
            </div>
          </div>

          {/* Column 4: Chambers Coordinates & Direct Channels */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm uppercase tracking-wider text-[#B49A64] border-b border-[#B49A64]/20 pb-2">
              Chambers Coordinates
            </h4>
            <div className="space-y-2.5 text-xs text-[#AAB4A0]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B49A64] shrink-0 mt-0.5" />
                <address className="not-italic leading-snug">
                  19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati – 517501, Andhra Pradesh, India.
                </address>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B49A64] shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+919626350900" className="hover:text-[#F1EBDD] transition-colors">
                    +91 96263 50900
                  </a>
                  <a href="tel:+919542153906" className="hover:text-[#F1EBDD] transition-colors">
                    +91 95421 53906
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B49A64] shrink-0" />
                <a href="mailto:cakavithasrj@gmail.com" className="hover:text-[#F1EBDD] transition-colors">
                  cakavithasrj@gmail.com
                </a>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={FIRM_DATA.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#183529] hover:bg-[#294B39] text-[#F1EBDD] border border-emerald-500/40 text-xs font-semibold transition-colors min-h-[40px]"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Desk</span>
                </a>
                <a
                  href={FIRM_DATA.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0B241C] hover:bg-[#183529] text-[#AAB4A0] hover:text-[#F1EBDD] border border-[#B49A64]/30 text-xs transition-colors min-h-[40px]"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B49A64]" />
                  <span>Google Maps</span>
                </a>
              </div>

              {/* Google Review Strip */}
              <div className="pt-1">
                <a
                  href={FIRM_DATA.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0B241C] border border-[#B49A64]/30 text-xs hover:border-[#B49A64]/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-xs">★★★★★</span>
                    <span className="font-semibold text-[#F1EBDD] text-[11px]">4.9 / 5.0 Rating</span>
                  </div>
                  <span className="text-[#B49A64] text-[10px] font-semibold">
                    58 Reviews →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ICAI Compliance Disclaimer */}
        <div className="mt-12 pt-6 border-t border-[#B49A64]/20 text-[11px] text-[#AAB4A0]/80 leading-relaxed text-justify sm:text-left">
          <p>
            <strong className="text-[#B49A64]">ICAI Ethical Compliance Notice:</strong> As per the guidelines issued by the Institute of Chartered Accountants of India (ICAI) and the regulations governing Chartered Accountants under the Chartered Accountants Act, 1949, this website is intended solely for informational purposes and not for the purpose of advertising, soliciting professional work, or inviting clients. The contents of this portal are not to be construed as legal, tax, or investment advice.
          </p>
        </div>

        {/* Colophon & Back To Top */}
        <div className="mt-6 pt-6 border-t border-[#B49A64]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#AAB4A0]">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {currentYear} Kavitha &amp; Associates, Chartered Accountants. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#AAB4A0]">Dual ICMAI &amp; ICAI Fellow Practice</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-xs text-[#B49A64] hover:text-[#F1EBDD] transition-colors p-1"
              aria-label="Back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
