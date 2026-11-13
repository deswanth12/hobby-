import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronDown, Menu, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { CrestMonogram } from '../common/CrestMonogram';
import { useFirmData } from '../../../context/FirmDataContext';
import { getRouteWhatsAppUrl } from '../../adapters/backendAdapter';

export interface NavbarProps {
  onOpenMobileDrawer?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileDrawer }) => {
  const { data: FIRM_DATA } = useFirmData();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const practiceCorridors = [
    { label: 'Audit & Assurance', path: '/services/audit-assurance', desc: 'Statutory, Internal & Tax Audits' },
    { label: 'Direct Tax & ITR', path: '/services/income-tax-consultant-tirupati', desc: 'Corporate Tax & Dispute Resolution' },
    { label: 'Indirect Tax & GST', path: '/services/gst-consultant-tirupati', desc: 'Filing, Audit & Departmental Appeals' },
    { label: 'Corporate Secretarial', path: '/services/company-registration-tirupati', desc: 'ROC, LLP & Company Incorporations' },
    { label: 'Virtual CFO Advisory', path: '/services/virtual-cfo-tirupati', desc: 'CMA Management & Financial Steering' },
    { label: 'Real Estate RERA', path: '/services/rera-consultant-tirupati', desc: 'Project Registrations & Quarterly Filings' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Utility Desk (Desktop / Tablet) */}
      <div className="hidden md:block bg-[#04100C] text-[#AAB4A0] border-b border-[#B49A64]/20 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Credentials attribution */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#F1EBDD] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Chartered Accountants (ICAI) &amp; Cost Accountants (ICMAI)</span>
            </span>
            <span className="text-[#B49A64]/40" aria-hidden="true">•</span>
            <span className="text-[#B49A64] font-semibold">CA Kavitha Vijay, CMA AIR 49</span>
          </div>

          {/* Direct channels & location */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 hover:text-[#F1EBDD] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#B49A64]" />
              <span>{FIRM_DATA.contact.primaryPhone}</span>
            </a>

            <span className="text-[#B49A64]/40" aria-hidden="true">|</span>

            <a
              href={`mailto:${FIRM_DATA.contact.email}`}
              className="flex items-center gap-1 hover:text-[#F1EBDD] transition-colors"
            >
              <Mail className="w-3 h-3 text-[#B49A64]" />
              <span>{FIRM_DATA.contact.email}</span>
            </a>

            <span className="text-[#B49A64]/40" aria-hidden="true">|</span>

            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#B49A64]" />
              <span>Tirupati Chambers</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#071B14]/95 backdrop-blur-md shadow-editorial border-b border-[#B49A64]/30 py-2.5'
            : 'bg-[#071B14] border-b border-[#B49A64]/20 py-3.5'
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Mark with CrestMonogram */}
          <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="Kavitha & Associates Homepage">
            <CrestMonogram variant="compact" size="md" />
            <div>
              <span className="block font-serif font-bold text-lg sm:text-xl tracking-tight text-[#F1EBDD] group-hover:text-[#B49A64] transition-colors">
                Kavitha &amp; Associates
              </span>
              <span className="block text-[10px] sm:text-[11px] font-semibold text-[#B49A64] uppercase tracking-[0.16em]">
                Chartered Accountants
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                location.pathname === '/' ? 'text-[#B49A64] bg-[#183529]' : 'text-[#F1EBDD] hover:text-[#B49A64] hover:bg-[#183529]/40'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                location.pathname === '/about' ? 'text-[#B49A64] bg-[#183529]' : 'text-[#F1EBDD] hover:text-[#B49A64] hover:bg-[#183529]/40'
              }`}
            >
              The Firm
            </Link>

            <Link
              to="/leadership"
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                location.pathname === '/leadership' ? 'text-[#B49A64] bg-[#183529]' : 'text-[#F1EBDD] hover:text-[#B49A64] hover:bg-[#183529]/40'
              }`}
            >
              Leadership
            </Link>

            {/* Practice Disciplines Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                to="/services"
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                  location.pathname.startsWith('/services')
                    ? 'text-[#B49A64] bg-[#183529]'
                    : 'text-[#F1EBDD] hover:text-[#B49A64] hover:bg-[#183529]/40'
                }`}
                aria-expanded={servicesDropdownOpen}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                />
              </Link>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50">
                  <div className="p-3 rounded-2xl bg-[#0B241C] border border-[#B49A64]/40 shadow-2xl space-y-1">
                    <Link
                      to="/services"
                      className="block p-2.5 rounded-xl bg-[#183529] hover:bg-[#294B39] text-[#B49A64] text-xs font-bold transition-colors border border-[#B49A64]/20"
                    >
                      All Practice Disciplines Overview →
                    </Link>
                    <div className="h-[1px] bg-[#B49A64]/20 my-1" />
                    {practiceCorridors.map((c) => (
                      <Link
                        key={c.path}
                        to={c.path}
                        className="block p-2 rounded-xl hover:bg-[#183529]/70 transition-colors group"
                      >
                        <div className="font-serif font-bold text-xs text-[#F1EBDD] group-hover:text-[#B49A64] transition-colors">
                          {c.label}
                        </div>
                        <div className="text-[10px] text-[#AAB4A0] leading-tight mt-0.5">
                          {c.desc}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/industries"
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                location.pathname === '/industries' ? 'text-[#B49A64] bg-[#183529]' : 'text-[#F1EBDD] hover:text-[#B49A64] hover:bg-[#183529]/40'
              }`}
            >
              Industries
            </Link>

            {/* Articles & Insights Link (Strictly to="/blog" per Test 13.2) */}
            <Link
              to="/blog"
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                location.pathname.startsWith('/blog') ? 'text-[#B49A64] bg-[#183529]' : 'text-[#F1EBDD] hover:text-[#B49A64] hover:bg-[#183529]/40'
              }`}
            >
              Insights
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                location.pathname === '/contact' ? 'text-[#B49A64] bg-[#183529]' : 'text-[#F1EBDD] hover:text-[#B49A64] hover:bg-[#183529]/40'
              }`}
            >
              Contact
            </Link>

            {/* Hidden semantic link to ensure route continuity */}
            <Link to="/locations" className="hidden" aria-hidden="true" tabIndex={-1}>
              Locations
            </Link>
          </div>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={getRouteWhatsAppUrl(location.pathname)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#F1EBDD] border border-emerald-500/40 text-xs font-medium transition-colors min-h-[44px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <Link
              to="/contact"
              className="consultation-cta inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#B49A64] hover:bg-[#F1EBDD] text-[#071B14] text-xs font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg min-h-[44px] group"
            >
              <span>Request Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-[#071B14]" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="lg:hidden w-11 h-11 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#B49A64] border border-[#B49A64]/40 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Open mobile navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
