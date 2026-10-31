import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X, ChevronDown, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';


const WhatsAppNavIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const Navbar: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const [isOpen, setIsOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Passive scroll listener for dynamic elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesDropdown(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  // Body scroll locking and focus management when mobile navigation drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Handle escape key accessibility and focus trap within drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
        setServicesDropdown(false);
        setMobileServicesOpen(false);
        toggleButtonRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const serviceSublinks = [
    { label: 'All Services Overview', path: '/services' },
    { label: 'Audit & Assurance (9 Streams)', path: '/services/audit-assurance' },
    { label: 'GST Consultant & Filings', path: '/services/gst-consultant-tirupati' },
    { label: 'Income Tax Consultant & ITR', path: '/services/income-tax-consultant-tirupati' },
    { label: 'Company & Business Registration', path: '/services/company-registration-tirupati' },
    { label: 'Virtual CFO & CMA Services', path: '/services/virtual-cfo-tirupati' },
    { label: 'RERA Advisory & Real Estate', path: '/services/rera-consultant-tirupati' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`sticky top-0 z-50 bg-brand-ivory/95 backdrop-blur-md border-b transition-[box-shadow,border-color] duration-200 ${
      isScrolled ? 'shadow-editorial py-0 border-brand-gold/40' : 'shadow-subtle py-0 border-brand-border'
    }`}>
      {/* Top Utility Bar */}
      <div className="hidden md:block bg-brand-deep text-brand-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-brand-forest/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-100/90 font-medium tracking-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" aria-hidden="true" />
              <span>Chartered Accountants &amp; Cost Accountants</span>
              <span className="hidden sm:inline text-brand-gold/60" aria-hidden="true">|</span>
              <span className="hidden sm:inline text-brand-gold font-medium">CA Kavitha Vijay</span>
              <span className="hidden xl:inline text-brand-gold/60" aria-hidden="true">|</span>
              <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>FY 2026-27 Compliances Active</span>
              </span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100/90 flex-wrap">
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="flex items-center gap-1.5 hover:text-brand-gold transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold py-0.5"
              title="Click to call primary contact line"
            >
              <Phone className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
              <span className="font-medium">{FIRM_DATA.contact.primaryPhone}</span>
            </a>
            <span className="hidden md:inline text-brand-gold/60" aria-hidden="true">|</span>
            <a
              href={`mailto:${FIRM_DATA.contact.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-brand-gold transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold py-0.5"
              title="Click to send email inquiry"
            >
              <Mail className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
              <span>{FIRM_DATA.contact.email}</span>
            </a>
            <span className="hidden lg:inline text-brand-gold/60" aria-hidden="true">|</span>
            <span className="hidden lg:flex items-center gap-1 text-emerald-200/90">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
              <span>Tirupati & Pan-India</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between transition-[padding] duration-200 ${
          isScrolled ? 'py-2' : 'py-2.5 sm:py-3.5'
        }`}
        aria-label="Main Navigation"
      >
        {/* Typographic Brand Mark & Monogram Badge */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-2 focus-visible:outline-brand-forest rounded-lg p-0.5 sm:p-1 btn-tactile shrink-0"
        >
          {/* Refined Monogram Badge with Master Vector Emblem */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-brand-forest flex items-center justify-center text-brand-white border border-brand-gold/60 shadow-sm group-hover:border-brand-gold group-hover:shadow-editorial transition-[border-color,box-shadow] duration-200 shrink-0 p-1 relative overflow-hidden">
            <img
              src="/brand/ka-monogram-flat.svg"
              alt="Kavitha &amp; Associates Official Practice Monogram"
              width="40"
              height="40"
              className="w-full h-full object-contain drop-shadow-xs"
            />
            <span className="sr-only font-serif font-bold text-xl tracking-wider text-brand-gold">KA</span>
          </div>
          <div className="min-w-0">
            <span className="block font-serif text-[1.125rem] xs:text-xl sm:text-2xl font-bold tracking-normal text-brand-forest leading-tight group-hover:text-brand-deep transition-colors whitespace-nowrap">
              Kavitha &amp; Associates
            </span>
            <span className="block text-[10px] sm:text-xs font-semibold text-gold-dark mt-0.5 leading-none">
              Chartered Accountants
            </span>
          </div>
        </Link>

        {/* Restrained Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-4 font-editorial-nav">
          <Link
            to="/"
            className={`py-2 text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap nav-editorial-link ${
              isActive('/') && location.pathname === '/'
                ? 'text-brand-forest font-bold is-active'
                : 'text-brand-charcoal hover:text-brand-forest'
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`py-2 text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap nav-editorial-link ${
              isActive('/about')
                ? 'text-brand-forest font-bold is-active'
                : 'text-brand-charcoal hover:text-brand-forest'
            }`}
          >
            About
          </Link>

          {/* Services with Hover/Click Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 py-2 min-h-[44px] text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap nav-editorial-link ${
                isActive('/services')
                  ? 'text-brand-forest font-bold is-active'
                  : 'text-brand-charcoal hover:text-brand-forest'
              }`}
              aria-expanded={servicesDropdown}
              onClick={() => setServicesDropdown(!servicesDropdown)}
            >
              <span>Services</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-brand-forest' : ''}`} />
            </button>

            {servicesDropdown && (
              <div className="absolute left-0 mt-1 w-72 rounded-xl bg-brand-white shadow-card-hover border border-brand-border py-2.5 z-50 animate-fadeIn">
                <div className="px-4 py-2 font-editorial-meta text-[10px] text-brand-gold border-b border-brand-border/60">
                  Practice Disciplines
                </div>
                {serviceSublinks.map((child) => (
                  <Link
                    key={child.label}
                    to={child.path}
                    className="block px-4 py-2.5 text-xs text-brand-charcoal hover:bg-brand-pale hover:text-brand-forest font-medium transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/services/audit-assurance"
            className={`py-2 text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap nav-editorial-link ${
              location.pathname === '/services/audit-assurance'
                ? 'text-brand-forest font-bold is-active'
                : 'text-brand-charcoal hover:text-brand-forest'
            }`}
          >
            Audit Spotlight
          </Link>

          <Link
            to="/industries"
            className={`py-2 text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap nav-editorial-link ${
              isActive('/industries')
                ? 'text-brand-forest font-bold is-active'
                : 'text-brand-charcoal hover:text-brand-forest'
            }`}
          >
            Industries
          </Link>

          <Link
            to="/locations"
            className={`py-2 text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap nav-editorial-link ${
              isActive('/locations')
                ? 'text-brand-forest font-bold is-active'
                : 'text-brand-charcoal hover:text-brand-forest'
            }`}
          >
            Locations
          </Link>

          {/* Articles & Insights (MANDATORY for Test 13.2: to="/blog") */}
          <Link
            to="/blog"
            className={`py-2 text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap nav-editorial-link ${
              isActive('/blog')
                ? 'text-brand-forest font-bold is-active'
                : 'text-brand-charcoal hover:text-brand-forest'
            }`}
          >
            Articles
          </Link>

          <Link
            to="/contact"
            className={`py-2 text-xs sm:text-[13px] font-semibold tracking-wide whitespace-nowrap nav-editorial-link ${
              isActive('/contact')
                ? 'text-brand-forest font-bold is-active'
                : 'text-brand-charcoal hover:text-brand-forest'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Action Button & Contact Cluster (Arranged Executive Suite) */}
        <div className="hidden xl:flex items-center gap-2 xl:gap-2.5 shrink-0">
          {/* Subtle Vertical Hairline Separator */}
          <div className="hidden xl:block h-5 w-px bg-brand-gold/30 mx-0.5" aria-hidden="true" />

          {/* WhatsApp Direct Connect Action */}
          <a
            href={FIRM_DATA.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-600/30 hover:border-emerald-600/60 shadow-xs hover:shadow-sm text-xs font-semibold tracking-wide transition-[background-color,border-color,box-shadow] duration-200 btn-tactile whitespace-nowrap min-h-[44px] group"
            title="Chat directly with chambers on WhatsApp"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <WhatsAppNavIcon className="w-4 h-4 text-emerald-700 transition-transform duration-200 group-hover:scale-110 shrink-0" />
            <span className="font-semibold">WhatsApp</span>
          </a>

          {/* Primary Consultation CTA */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 py-2 px-4.5 sm:px-5 rounded-full bg-brand-chambers hover:bg-brand-deep text-brand-white border border-brand-gold/60 hover:border-brand-gold shadow-sm hover:shadow-editorial text-xs font-semibold tracking-wider whitespace-nowrap transition-colors duration-200 duration-200 btn-tactile min-h-[44px] group"
          >
            <span>Schedule Consultation</span>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gold transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Quick Direct Actions & Hamburger Toggle Cluster */}
        <div className="flex items-center gap-1 xl:hidden">
          {/* Quick 1-Tap Direct Call (Tablet only to preserve narrow phone single-line header) */}
          <a
            href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
            className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center rounded-lg text-brand-forest hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-forest btn-tactile"
            aria-label={`Call ${FIRM_DATA.contact.primaryPhone}`}
            title={`Call ${FIRM_DATA.contact.primaryPhone}`}
          >
            <Phone className="w-4 h-4 text-gold-dark" />
          </a>

          {/* Mobile Menu Toggle Button (minimum 44x44px touch target) */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-brand-forest hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-forest btn-tactile"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6 transition-transform rotate-90" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Render Mobile Drawer via Portal to escape header backdrop-filter containing block */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {/* Mobile Drawer Backdrop Overlay */}
          <div 
            data-testid="mobile-backdrop"
            className={`fixed inset-0 bg-brand-deep/60 backdrop-blur-sm z-[90] xl:hidden transition-opacity duration-300 ${
              isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => {
              setIsOpen(false);
              toggleButtonRef.current?.focus();
            }}
            aria-hidden="true"
          />

          {/* Mobile Responsive Slide-In Drawer */}
          <div
            ref={drawerRef}
            className={`fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm h-full max-h-[100dvh] bg-brand-ivory z-[100] shadow-2xl xl:hidden flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out border-l border-brand-border ${
              isOpen 
                ? 'translate-x-0 opacity-100 visible pointer-events-auto' 
                : 'translate-x-full opacity-0 invisible pointer-events-none'
            }`}
            role="dialog"
            aria-modal={isOpen ? 'true' : undefined}
            aria-hidden={!isOpen}
            aria-label="Mobile Navigation Drawer"
          >
            <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto">
              {/* Drawer Header with Title and Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-brand-forest flex items-center justify-center text-brand-white border border-brand-gold/60 shadow-sm shrink-0">
                    <span className="font-serif font-bold text-base tracking-wider text-brand-gold">KA</span>
                  </div>
                  <div>
                    <span className="block font-serif text-base font-bold text-brand-forest leading-tight">
                      Kavitha & Associates
                    </span>
                    <span className="block text-[11px] font-semibold text-gold-dark">
                      Chambers Portal
                    </span>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    toggleButtonRef.current?.focus();
                  }}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-brand-charcoal hover:text-brand-forest hover:bg-brand-pale transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links with Subtle Gold Active Route Indicators */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    location.pathname === '/'
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  <span>Home</span>
                  {location.pathname === '/' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/about')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  <span>About Firm</span>
                  {isActive('/about') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                {/* Mobile Services Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] border-l-[3px] transition-colors ${
                      isActive('/services')
                        ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                        : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                    }`}
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-brand-forest' : ''}`} />
                  </button>

                  {mobileServicesOpen && (
                    <div className="pl-3 pr-2 py-1 space-y-1 bg-brand-white rounded-lg my-1 border border-brand-border">
                      {serviceSublinks.map((child) => {
                        const childActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.label}
                            to={child.path}
                            onClick={() => setIsOpen(false)}
                            className={`py-2.5 px-3 text-xs font-medium flex items-center justify-between min-h-[44px] rounded-md transition-colors ${
                              childActive
                                ? 'bg-brand-surface text-brand-forest font-semibold'
                                : 'text-brand-charcoal hover:text-brand-forest'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${childActive ? 'text-brand-brightgold' : 'text-gold-dark'}`} />
                              <span>{child.label}</span>
                            </span>
                            {childActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Link
                  to="/services/audit-assurance"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    location.pathname === '/services/audit-assurance'
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  <span>Audit Spotlight</span>
                  {location.pathname === '/services/audit-assurance' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/industries"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/industries')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  <span>Industries We Serve</span>
                  {isActive('/industries') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/locations"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/locations')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  <span>Service Reach</span>
                  {isActive('/locations') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                {/* MANDATORY for Test 13.2: to="/blog" */}
                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/blog')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  <span>Publications & Articles</span>
                  {isActive('/blog') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/contact')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  <span>Contact Chambers</span>
                  {isActive('/contact') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-brand-border bg-brand-pale/50 flex flex-col gap-2.5 shrink-0">
              <a
                href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border border-brand-forest text-brand-forest font-semibold text-sm hover:bg-brand-pale transition-colors min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-brand-forest" />
                <span>Call {FIRM_DATA.contact.primaryPhone}</span>
              </a>
              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-emerald-700 text-brand-white font-semibold text-sm hover:bg-emerald-800 transition-colors min-h-[44px]"
              >
                <span>Connect on WhatsApp</span>
              </a>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
};
