import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X, ChevronDown, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

export const Navbar: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdown(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setServicesDropdown(false);
        setMobileServicesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const serviceSublinks = [
    { label: 'All Services Overview', path: '/services' },
    { label: 'Audit & Assurance (Spotlight)', path: '/services/audit-assurance' },
    { label: 'Income Tax Services', path: '/services#income-tax' },
    { label: 'GST Services', path: '/services#gst' },
    { label: 'Corporate & ROC Compliance', path: '/services#corporate-business' },
    { label: 'RERA Compliance', path: '/services#rera-compliance' },
    { label: 'Advisory & Consulting', path: '/services#advisory-consulting' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-warm/95 backdrop-blur-md border-b border-border shadow-subtle transition-all">
      {/* Top Utility Bar */}
      <div className="bg-[#0A2F24] text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-emerald-950/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-100/90 font-medium tracking-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" aria-hidden="true" />
              <span>Chartered Accountants & Cost Accountants</span>
              <span className="hidden sm:inline text-emerald-400/40">•</span>
              <span className="hidden sm:inline text-emerald-200/90">CA {FIRM_DATA.partner.name.replace('CA ', '')}</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100/90 flex-wrap">
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors focus:outline-none focus:ring-1 focus:ring-gold py-0.5"
              title="Click to call primary contact"
            >
              <Phone className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span className="font-medium">{FIRM_DATA.contact.primaryPhone}</span>
            </a>
            <span className="hidden md:inline text-emerald-400/40">•</span>
            <a
              href={`mailto:${FIRM_DATA.contact.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-gold transition-colors focus:outline-none focus:ring-1 focus:ring-gold py-0.5"
              title="Click to send email"
            >
              <Mail className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>{FIRM_DATA.contact.email}</span>
            </a>
            <span className="hidden lg:inline text-emerald-400/40">•</span>
            <span className="hidden lg:flex items-center gap-1 text-emerald-200/90">
              <MapPin className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              <span>Tirupati & Pan-India</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between" aria-label="Main Navigation">
        {/* Logo and Brand Title */}
        <Link to="/" className="flex items-center gap-3.5 group focus-visible:outline-2 focus-visible:outline-brand-primary rounded-lg p-1 btn-tactile">
          {/* Refined Badge inspired by CA seal & corporate card */}
          <div className="w-11 h-11 rounded-lg bg-brand-primary flex items-center justify-center text-white border border-gold/60 shadow-sm group-hover:border-gold group-hover:shadow-subtle transition-all">
            <span className="font-serif font-bold text-xl tracking-wider text-gold-light">KA</span>
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-brand-primary leading-none group-hover:text-brand-deep transition-colors">
              Kavitha & Associates
            </span>
            <span className="block text-xs tracking-wider uppercase font-semibold text-gold-dark mt-1">
              Chartered Accountants
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7">
          <Link
            to="/"
            className={`py-2 text-sm font-medium transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'text-brand-primary font-semibold border-b-2 border-gold'
                : 'text-charcoal hover:text-brand-primary'
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`py-2 text-sm font-medium transition-colors ${
              isActive('/about')
                ? 'text-brand-primary font-semibold border-b-2 border-gold'
                : 'text-charcoal hover:text-brand-primary'
            }`}
          >
            About
          </Link>

          {/* Services with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 py-2 text-sm font-medium transition-colors ${
                isActive('/services')
                  ? 'text-brand-primary font-semibold border-b-2 border-gold'
                  : 'text-charcoal hover:text-brand-primary'
              }`}
              aria-expanded={servicesDropdown}
              onClick={() => setServicesDropdown(!servicesDropdown)}
            >
              <span>Services</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-brand-primary' : ''}`} />
            </button>

            {servicesDropdown && (
              <div className="absolute left-0 mt-1 w-72 rounded-xl bg-white shadow-card-hover border border-border py-2.5 z-50 animate-fadeIn">
                <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold-dark border-b border-border/60">
                  Practice Disciplines
                </div>
                {serviceSublinks.map((child) => (
                  <Link
                    key={child.label}
                    to={child.path}
                    className="block px-4 py-2.5 text-xs text-charcoal hover:bg-brand-pale hover:text-brand-primary font-medium transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/services/audit-assurance"
            className={`py-2 text-sm font-medium transition-colors ${
              location.pathname === '/services/audit-assurance'
                ? 'text-brand-primary font-semibold border-b-2 border-gold'
                : 'text-charcoal hover:text-brand-primary'
            }`}
          >
            Audit Spotlight
          </Link>

          <Link
            to="/industries"
            className={`py-2 text-sm font-medium transition-colors ${
              isActive('/industries')
                ? 'text-brand-primary font-semibold border-b-2 border-gold'
                : 'text-charcoal hover:text-brand-primary'
            }`}
          >
            Industries
          </Link>

          <Link
            to="/locations"
            className={`py-2 text-sm font-medium transition-colors ${
              isActive('/locations')
                ? 'text-brand-primary font-semibold border-b-2 border-gold'
                : 'text-charcoal hover:text-brand-primary'
            }`}
          >
            Locations
          </Link>

          <Link
            to="/contact"
            className={`py-2 text-sm font-medium transition-colors ${
              isActive('/contact')
                ? 'text-brand-primary font-semibold border-b-2 border-gold'
                : 'text-charcoal hover:text-brand-primary'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Action Button & Contact */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={FIRM_DATA.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 transition-colors btn-tactile"
            title="Chat directly via WhatsApp"
          >
            <span>WhatsApp</span>
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary btn-tactile"
          >
            Schedule Consultation
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-brand-primary hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-primary btn-tactile"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6 transition-transform rotate-90" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer with Accordion for Services */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-brand-warm px-4 pt-3 pb-6 shadow-card space-y-3 animate-fadeIn">
          <div className="space-y-1">
            <Link
              to="/"
              className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                location.pathname === '/'
                  ? 'bg-brand-pale text-brand-primary font-semibold'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                isActive('/about')
                  ? 'bg-brand-pale text-brand-primary font-semibold'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              About Firm
            </Link>

            {/* Mobile Services Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-charcoal hover:bg-white min-h-[44px]"
                aria-expanded={mobileServicesOpen}
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-brand-primary' : ''}`} />
              </button>

              {mobileServicesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-white rounded-lg my-1 border border-border">
                  {serviceSublinks.map((child) => (
                    <Link
                      key={child.label}
                      to={child.path}
                      className="block py-2.5 px-3 text-xs font-medium text-charcoal hover:text-brand-primary flex items-center gap-2 min-h-[40px]"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                      <span>{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/services/audit-assurance"
              className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                location.pathname === '/services/audit-assurance'
                  ? 'bg-brand-pale text-brand-primary font-semibold'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              Audit Spotlight
            </Link>

            <Link
              to="/industries"
              className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                isActive('/industries')
                  ? 'bg-brand-pale text-brand-primary font-semibold'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              Industries We Serve
            </Link>

            <Link
              to="/locations"
              className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                isActive('/locations')
                  ? 'bg-brand-pale text-brand-primary font-semibold'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              Service Reach
            </Link>

            <Link
              to="/contact"
              className={`block px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                isActive('/contact')
                  ? 'bg-brand-pale text-brand-primary font-semibold'
                  : 'text-charcoal hover:bg-white'
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border border-brand-primary text-brand-primary font-semibold text-sm hover:bg-brand-pale transition-colors min-h-[44px]"
            >
              <Phone className="w-4 h-4 text-brand-primary" />
              <span>Call +91 96263 50900</span>
            </a>
            <a
              href={FIRM_DATA.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800 transition-colors min-h-[44px]"
            >
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
