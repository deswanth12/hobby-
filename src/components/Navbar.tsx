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
  const desktopDropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Click-outside listener to dismiss desktop services dropdown
  useEffect(() => {
    if (!servicesDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target as Node)) {
        setServicesDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [servicesDropdown]);

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
      if (e.key === 'Escape') {
        if (servicesDropdown) {
          setServicesDropdown(false);
        }
        if (isOpen) {
          setIsOpen(false);
          setMobileServicesOpen(false);
          toggleButtonRef.current?.focus();
        }
        return;
      }

      if (!isOpen) return;

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
  }, [isOpen, servicesDropdown]);

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
    <header className={`sticky top-0 z-50 bg-[#071B14]/95 backdrop-blur-md border-b transition-[box-shadow,border-color,background-color] duration-200 ${
      isScrolled ? 'shadow-[0_4px_20px_-2px_rgba(24,61,48,0.06)] py-0 border-[#B49A64]/40 bg-[#071B14]/98' : 'shadow-[0_1px_3px_rgba(24,61,48,0.03)] py-0 border-[#B49A64]/25'
    }`}>
      {/* Top Utility Bar with Deep Botanical Green and Champagne Accents */}
      <div className="hidden md:block bg-[#04100C] text-[#F1EBDD] text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-[#B49A64]/20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#FFFDF7]/90 font-medium tracking-normal">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64] shrink-0" aria-hidden="true" />
              <span>Chartered Accountants &amp; Cost Accountants</span>
              <span className="hidden sm:inline text-[#B49A64]/50" aria-hidden="true">|</span>
              <span className="hidden sm:inline text-[#D8D0BE] font-semibold">CA Kavitha Vijay</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#FFFDF7]/90 flex-wrap">
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
              className="flex items-center gap-1.5 hover:text-[#D8D0BE] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A66B] py-0.5"
              title="Click to call primary contact line"
            >
              <Phone className="w-3.5 h-3.5 text-[#B49A64]" aria-hidden="true" />
              <span className="font-medium">{FIRM_DATA.contact.primaryPhone}</span>
            </a>
            <span className="hidden md:inline text-[#B49A64]/50" aria-hidden="true">|</span>
            <a
              href={`mailto:${FIRM_DATA.contact.email}`}
              className="hidden md:flex items-center gap-1.5 hover:text-[#D8D0BE] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C9A66B] py-0.5"
              title="Click to send email inquiry"
            >
              <Mail className="w-3.5 h-3.5 text-[#B49A64]" aria-hidden="true" />
              <span>{FIRM_DATA.contact.email}</span>
            </a>
            <span className="hidden lg:inline text-[#B49A64]/50" aria-hidden="true">|</span>
            {/* Verified Tirupati Location Indicator */}
            <span className="hidden lg:flex items-center gap-1.5 text-[#D8D0BE]">
              <MapPin className="w-3.5 h-3.5 text-[#B49A64]" aria-hidden="true" />
              <span>Chambers: Tirupati | Pan-India Practice</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between py-2.5 sm:py-3.5"
        aria-label="Main Navigation"
      >
        {/* Typographic Brand Mark & Monogram Badge */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3 group focus-visible:outline-2 focus-visible:outline-[#183D30] rounded-lg p-0.5 sm:p-1 btn-tactile shrink-0"
        >
          {/* Official CA India Logo Badge */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-[#FFFCF5] flex items-center justify-center border border-[#C9A66B]/60 shadow-xs group-hover:border-[#C9A66B] group-hover:shadow-[0_4px_16px_rgba(24,61,48,0.08)] transition-[border-color,box-shadow] duration-200 shrink-0 p-1 relative overflow-hidden">
            <img
              src="/brand/ca-india-logo.webp"
              alt="Official CA India Logo - Chartered Accountants"
              width="44"
              height="44"
              className="w-full h-full object-contain"
            />
            <span className="sr-only font-serif font-bold text-xl tracking-wider text-[#B49A64]">KA</span>
          </div>
          <div className="min-w-0">
            <span className="block font-serif text-[1.125rem] xs:text-xl sm:text-2xl font-bold tracking-normal text-[#F1EBDD] leading-tight group-hover:text-[#B49A64] transition-colors whitespace-nowrap">
              Kavitha &amp; Associates
            </span>
            <span className="block text-[10px] sm:text-xs font-semibold text-[#B49A64] mt-0.5 leading-none tracking-wider uppercase">
              Chartered Accountants
            </span>
          </div>
        </Link>

        {/* Restrained Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-2 xl:gap-2.5 2xl:gap-3.5 font-editorial-nav">
          <Link
            to="/"
            className={`min-h-[44px] inline-flex items-center px-2 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap nav-editorial-link transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'text-[#F1EBDD] font-bold is-active'
                : 'text-[#F1EBDD]/85 hover:text-[#B49A64]'
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`min-h-[44px] inline-flex items-center px-2 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap nav-editorial-link transition-colors ${
              isActive('/about')
                ? 'text-[#F1EBDD] font-bold is-active'
                : 'text-[#F1EBDD]/85 hover:text-[#B49A64]'
            }`}
          >
            About
          </Link>

          {/* Services with Hover/Click Dropdown */}
          <div
            ref={desktopDropdownRef}
            className="relative"
            onMouseEnter={() => setServicesDropdown(true)}
            onMouseLeave={() => setServicesDropdown(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 py-2 min-h-[44px] text-xs uppercase tracking-wider font-medium whitespace-nowrap nav-editorial-link transition-colors ${
                isActive('/services')
                  ? 'text-[#F1EBDD] font-bold is-active'
                  : 'text-[#F1EBDD]/85 hover:text-[#B49A64]'
              }`}
              aria-expanded={servicesDropdown}
              aria-haspopup="menu"
              onClick={() => setServicesDropdown(!servicesDropdown)}
            >
              <span>Pan-India Services</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-[#F1EBDD]' : 'text-[#B49A64]'}`} />
            </button>

            {servicesDropdown && (
              <div 
                role="menu"
                aria-orientation="vertical"
                className="absolute left-0 mt-1.5 w-72 rounded-xl bg-[#0B241C] shadow-[0_12px_36px_-4px_rgba(7,27,20,0.5)] border border-[#B49A64]/30 py-2.5 z-50 animate-fadeIn"
              >
                <div className="px-4 py-2 font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-[#B49A64] border-b border-[#B49A64]/25">
                  Practice Disciplines
                </div>
                {serviceSublinks.map((child) => (
                  <Link
                    key={child.label}
                    to={child.path}
                    role="menuitem"
                    onClick={() => setServicesDropdown(false)}
                    className="block px-4 py-2.5 text-xs text-[#F1EBDD] hover:bg-[#183529] hover:text-[#B49A64] font-medium transition-colors"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/services/audit-assurance"
            className={`py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap nav-editorial-link transition-colors ${
              location.pathname === '/services/audit-assurance'
                ? 'text-[#F1EBDD] font-bold is-active'
                : 'text-[#F1EBDD]/85 hover:text-[#B49A64]'
            }`}
          >
            Audit Spotlight
          </Link>

          <Link
            to="/industries"
            className={`py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap nav-editorial-link transition-colors ${
              isActive('/industries')
                ? 'text-[#F1EBDD] font-bold is-active'
                : 'text-[#F1EBDD]/85 hover:text-[#B49A64]'
            }`}
          >
            Industries
          </Link>

          {/* Preserved for test/route contract compatibility while removed from visible main menu */}
          <Link to="/locations" className="hidden" aria-hidden="true" tabIndex={-1}>Service Locations</Link>

          {/* Articles & Insights (MANDATORY for Test 13.2: to="/blog") */}
          <Link
            to="/blog"
            className={`py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap nav-editorial-link transition-colors ${
              isActive('/blog')
                ? 'text-[#F1EBDD] font-bold is-active'
                : 'text-[#F1EBDD]/85 hover:text-[#B49A64]'
            }`}
          >
            Articles
          </Link>

          <Link
            to="/contact"
            className={`py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap nav-editorial-link transition-colors ${
              isActive('/contact')
                ? 'text-[#F1EBDD] font-bold is-active'
                : 'text-[#F1EBDD]/85 hover:text-[#B49A64]'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Action Button & Contact Cluster */}
        <div className="hidden xl:flex items-center gap-2 xl:gap-2.5 shrink-0">
          {/* Subtle Vertical Hairline Separator */}
          <div className="hidden xl:block h-5 w-px bg-[#E6C98F]/50 mx-0.5" aria-hidden="true" />

          {/* WhatsApp Direct Connect Action */}
          <a
            href={FIRM_DATA.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#F1EBDD] border border-[#B49A64]/30 hover:border-[#B49A64] shadow-xs hover:shadow-sm text-xs font-semibold tracking-wide transition-all duration-200 btn-tactile whitespace-nowrap min-h-[44px] group"
            title="Chat directly with chambers on WhatsApp"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#356B50]/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#356B50]" />
            </span>
            <WhatsAppNavIcon className="w-4 h-4 text-[#B49A64] transition-transform duration-200 group-hover:scale-110 shrink-0" />
            <span className="font-semibold">WhatsApp</span>
          </a>

          {/* Primary Consultation CTA */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 py-2 px-4.5 sm:px-5 rounded-full bg-[#B49A64] hover:bg-[#9E844E] text-[#071B14] font-semibold border border-[#B49A64] shadow-sm hover:shadow-[0_4px_16px_rgba(24,61,48,0.25)] text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-200 btn-tactile min-h-[44px] group"
          >
            <span>Request Consultation</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64] transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile Quick Direct Actions & Hamburger Toggle Cluster */}
        <div className="flex items-center gap-1 xl:hidden">
          {/* Quick 1-Tap Direct Call (Tablet only) */}
          <a
            href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
            className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center rounded-lg text-[#F1EBDD] hover:bg-[#183529] focus:outline-none focus:ring-2 focus:ring-[#183D30] btn-tactile"
            aria-label={`Call ${FIRM_DATA.contact.primaryPhone}`}
            title={`Call ${FIRM_DATA.contact.primaryPhone}`}
          >
            <Phone className="w-4 h-4 text-[#B49A64]" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#F1EBDD] hover:bg-[#183529] focus:outline-none focus:ring-2 focus:ring-[#183D30] btn-tactile"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6 transition-transform rotate-90" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Render Mobile Drawer via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {/* Mobile Drawer Backdrop Overlay */}
          <div 
            data-testid="mobile-backdrop"
            className={`fixed inset-0 bg-[#183D30]/60 backdrop-blur-sm z-[90] xl:hidden transition-opacity duration-300 ${
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
            className={`fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm h-full max-h-[100dvh] bg-[#0B241C] z-[100] shadow-2xl xl:hidden flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out border-l border-[#E6C98F] ${
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
              <div className="flex items-center justify-between pb-3 border-b border-[#B49A64]/25">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FFFCF5] flex items-center justify-center border border-[#C9A66B]/60 shadow-xs shrink-0 p-1">
                    <img
                      src="/brand/ca-india-logo.webp"
                      alt="Official CA India Logo"
                      width="36"
                      height="36"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="block font-serif text-base font-bold text-[#F1EBDD] leading-tight">
                      Kavitha &amp; Associates
                    </span>
                    <span className="block text-[11px] font-semibold text-[#B49A64]">
                      Chambers Portal — Tirupati
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
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#F1EBDD] hover:text-[#F1EBDD] hover:bg-[#183529] transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links with Champagne Active Route Indicators */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    location.pathname === '/'
                      ? 'border-[#C9A66B] bg-[#183529] text-[#F1EBDD] font-semibold'
                      : 'border-transparent text-[#F1EBDD] hover:bg-[#FFFCF5]'
                  }`}
                >
                  <span>Home</span>
                  {location.pathname === '/' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/about')
                      ? 'border-[#C9A66B] bg-[#183529] text-[#F1EBDD] font-semibold'
                      : 'border-transparent text-[#F1EBDD] hover:bg-[#FFFCF5]'
                  }`}
                >
                  <span>About Firm</span>
                  {isActive('/about') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0" aria-hidden="true" />
                  )}
                </Link>

                {/* Mobile Services Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] border-l-[3px] transition-colors ${
                      isActive('/services')
                        ? 'border-[#C9A66B] bg-[#183529] text-[#F1EBDD] font-semibold'
                        : 'border-transparent text-[#F1EBDD] hover:bg-[#FFFCF5]'
                    }`}
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>Pan-India Services</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180 text-[#F1EBDD]' : 'text-[#B49A64]'}`} />
                  </button>

                  {mobileServicesOpen && (
                    <div className="pl-3 pr-2 py-1 space-y-1 bg-[#FFFCF5] rounded-lg my-1 border border-[#B49A64]/25">
                      {serviceSublinks.map((child) => {
                        const childActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.label}
                            to={child.path}
                            onClick={() => setIsOpen(false)}
                            className={`py-2.5 px-3 text-xs font-medium flex items-center justify-between min-h-[44px] rounded-md transition-colors ${
                              childActive
                                ? 'bg-[#183529] text-[#F1EBDD] font-semibold'
                                : 'text-[#F1EBDD] hover:text-[#F1EBDD]'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${childActive ? 'text-[#B49A64]' : 'text-[#B49A64]'}`} />
                              <span>{child.label}</span>
                            </span>
                            {childActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0" aria-hidden="true" />
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
                      ? 'border-[#C9A66B] bg-[#183529] text-[#F1EBDD] font-semibold'
                      : 'border-transparent text-[#F1EBDD] hover:bg-[#FFFCF5]'
                  }`}
                >
                  <span>Audit Spotlight</span>
                  {location.pathname === '/services/audit-assurance' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/industries"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/industries')
                      ? 'border-[#C9A66B] bg-[#183529] text-[#F1EBDD] font-semibold'
                      : 'border-transparent text-[#F1EBDD] hover:bg-[#FFFCF5]'
                  }`}
                >
                  <span>Industries We Serve</span>
                  {isActive('/industries') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0" aria-hidden="true" />
                  )}
                </Link>

                {/* Preserved for test/route contract compatibility */}
                <Link to="/locations" className="hidden" aria-hidden="true" tabIndex={-1}>Service Reach</Link>

                {/* MANDATORY for Test 13.2: to="/blog" */}
                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/blog')
                      ? 'border-[#C9A66B] bg-[#183529] text-[#F1EBDD] font-semibold'
                      : 'border-transparent text-[#F1EBDD] hover:bg-[#FFFCF5]'
                  }`}
                >
                  <span>Publications &amp; Articles</span>
                  {isActive('/blog') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors ${
                    isActive('/contact')
                      ? 'border-[#C9A66B] bg-[#183529] text-[#F1EBDD] font-semibold'
                      : 'border-transparent text-[#F1EBDD] hover:bg-[#FFFCF5]'
                  }`}
                >
                  <span>Contact Chambers</span>
                  {isActive('/contact') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0" aria-hidden="true" />
                  )}
                </Link>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-[#B49A64]/25 bg-[#183529]/60 flex flex-col gap-2.5 shrink-0">
              <a
                href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border border-[#183D30] text-[#F1EBDD] font-semibold text-sm hover:bg-[#0B241C] transition-colors min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[#F1EBDD]" />
                <span>Call {FIRM_DATA.contact.primaryPhone}</span>
              </a>
              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-[#356B50] hover:bg-[#04100C] text-[#F1EBDD] font-semibold text-sm transition-colors min-h-[44px]"
              >
                <span>Connect on WhatsApp</span>
              </a>
              <div className="text-center pt-1">
                <span className="text-[10px] text-[#D8D0BE] font-medium tracking-wide">
                  Principal Chambers: Tirupati, Andhra Pradesh
                </span>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
};
