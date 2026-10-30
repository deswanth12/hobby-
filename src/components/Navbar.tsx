import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Menu, X, ChevronDown, ShieldCheck, MapPin, ChevronRight } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

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
    <header className={`sticky top-0 z-50 bg-brand-ivory/95 backdrop-blur-md border-b transition-all duration-200 ${
      isScrolled ? 'shadow-editorial py-0 border-brand-gold/40' : 'shadow-subtle py-0 border-brand-border'
    }`}>
      {/* Top Utility Bar */}
      <div className="bg-brand-deep text-brand-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-brand-forest/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-100/90 font-medium tracking-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" aria-hidden="true" />
              <span>Chartered Accountants &amp; Cost Accountants</span>
              <span className="hidden sm:inline text-brand-gold/60">•</span>
              <span className="hidden sm:inline text-brand-gold font-medium">CA Kavitha Vijay</span>
              <span className="hidden xl:inline text-brand-gold/60">•</span>
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
            <span className="hidden md:inline text-brand-gold/60">•</span>
            <a
              href={`mailto:${FIRM_DATA.contact.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-brand-gold transition-colors focus:outline-none focus:ring-1 focus:ring-brand-gold py-0.5"
              title="Click to send email inquiry"
            >
              <Mail className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
              <span>{FIRM_DATA.contact.email}</span>
            </a>
            <span className="hidden lg:inline text-brand-gold/60">•</span>
            <span className="hidden lg:flex items-center gap-1 text-emerald-200/90">
              <MapPin className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
              <span>Tirupati & Pan-India</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-200 ${
          isScrolled ? 'py-2.5' : 'py-3.5'
        }`}
        aria-label="Main Navigation"
      >
        {/* Typographic Brand Mark & Monogram Badge */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-brand-forest rounded-lg p-1 btn-tactile"
        >
          {/* Refined Monogram Badge with Master Vector Emblem */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-brand-forest flex items-center justify-center text-brand-white border border-brand-gold/60 shadow-sm group-hover:border-brand-gold group-hover:shadow-editorial transition-all shrink-0 p-1 relative overflow-hidden">
            <img
              src="/brand/ka-monogram-flat.svg"
              alt="Kavitha &amp; Associates Official Practice Monogram"
              className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
            />
            <span className="sr-only font-serif font-bold text-xl tracking-wider text-brand-gold">KA</span>
          </div>
          <div>
            <span className="block font-serif text-xl sm:text-2xl font-bold tracking-normal text-brand-forest leading-snug group-hover:text-brand-deep transition-colors">
              Kavitha & Associates
            </span>
            <span className="block font-editorial-meta text-[11px] tracking-wider uppercase font-semibold text-gold-dark mt-0.5">
              Chartered Accountants
            </span>
          </div>
        </Link>

        {/* Restrained Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-3.5 xl:gap-6">
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

        {/* Action Button & Contact Cluster */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a
            href={FIRM_DATA.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 transition-colors btn-tactile whitespace-nowrap min-h-[44px]"
            title="Chat directly with chambers on WhatsApp"
          >
            <span>WhatsApp</span>
          </a>
          <Link
            to="/contact"
            className="btn-pill-primary py-2 px-5 text-xs font-semibold tracking-wider whitespace-nowrap shadow-sm hover:shadow-md min-h-[44px]"
          >
            <span>Schedule Consultation</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button (minimum 44x44px touch target) */}
        <button
          ref={toggleButtonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-brand-forest hover:bg-brand-pale focus:outline-none focus:ring-2 focus:ring-brand-forest btn-tactile"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6 transition-transform rotate-90" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Render Mobile Drawer via Portal to escape header backdrop-filter containing block */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {/* Mobile Drawer Backdrop Overlay */}
          <div 
            data-testid="mobile-backdrop"
            className={`fixed inset-0 bg-brand-deep/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity duration-300 ${
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
            className={`fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm h-full max-h-[100dvh] bg-brand-ivory z-[100] shadow-2xl lg:hidden flex flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out border-l border-brand-border ${
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
                    <span className="block font-editorial-meta text-[10px] uppercase font-semibold text-gold-dark">
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

              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                    location.pathname === '/'
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                    isActive('/about')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  About Firm
                </Link>

                {/* Mobile Services Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-brand-charcoal hover:bg-brand-white min-h-[44px]"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-brand-forest' : ''}`} />
                  </button>

                  {mobileServicesOpen && (
                    <div className="pl-3 pr-2 py-1 space-y-1 bg-brand-white rounded-lg my-1 border border-brand-border">
                      {serviceSublinks.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className="py-2.5 px-3 text-xs font-medium text-brand-charcoal hover:text-brand-forest flex items-center gap-2 min-h-[44px]"
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
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                    location.pathname === '/services/audit-assurance'
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  Audit Spotlight
                </Link>

                <Link
                  to="/industries"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                    isActive('/industries')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  Industries We Serve
                </Link>

                <Link
                  to="/locations"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                    isActive('/locations')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  Service Reach
                </Link>

                {/* MANDATORY for Test 13.2: to="/blog" */}
                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                    isActive('/blog')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  Publications & Articles
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
                    isActive('/contact')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }`}
                >
                  Contact Chambers
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
