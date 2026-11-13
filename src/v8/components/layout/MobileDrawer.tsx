import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronDown, Phone, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { CrestMonogram } from '../common/CrestMonogram';
import { useFirmData } from '../../../context/FirmDataContext';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { data: FIRM_DATA } = useFirmData();
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Lock body scroll and set up ESC and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Focus close button on open
    const focusTimeout = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const practiceCorridors = [
    { label: 'Audit & Assurance', path: '/services/audit-assurance', code: 'PRAC-01' },
    { label: 'Direct Tax & ITR', path: '/services/income-tax-consultant-tirupati', code: 'PRAC-02' },
    { label: 'Indirect Tax & GST', path: '/services/gst-consultant-tirupati', code: 'PRAC-03' },
    { label: 'Corporate Secretarial', path: '/services/company-registration-tirupati', code: 'PRAC-04' },
    { label: 'Virtual CFO Advisory', path: '/services/virtual-cfo-tirupati', code: 'PRAC-05' },
    { label: 'Real Estate RERA', path: '/services/rera-consultant-tirupati', code: 'PRAC-06' },
  ];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-[100] flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#071B14]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-sm h-full bg-[#0B241C] text-[#F1EBDD] border-l border-[#B49A64]/40 shadow-2xl flex flex-col justify-between overflow-y-auto select-none"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#B49A64]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CrestMonogram variant="compact" size="sm" />
            <div>
              <span className="block font-serif font-bold text-sm tracking-wide text-[#F1EBDD]">
                Kavitha &amp; Associates
              </span>
              <span className="block text-[10px] font-semibold text-[#B49A64] tracking-wider uppercase">
                Chartered Accountants
              </span>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#B49A64] border border-[#B49A64]/30 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Close mobile navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-5 space-y-1 overflow-y-auto">
          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'bg-[#183529] text-[#B49A64] font-semibold' : 'text-[#F1EBDD] hover:bg-[#183529]/50'
            }`}
          >
            <span>Home</span>
            <ArrowRight className="w-4 h-4 text-[#B49A64]/60" />
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/about' ? 'bg-[#183529] text-[#B49A64] font-semibold' : 'text-[#F1EBDD] hover:bg-[#183529]/50'
            }`}
          >
            <span>The Firm</span>
            <ArrowRight className="w-4 h-4 text-[#B49A64]/60" />
          </Link>

          <Link
            to="/leadership"
            onClick={onClose}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/leadership' ? 'bg-[#183529] text-[#B49A64] font-semibold' : 'text-[#F1EBDD] hover:bg-[#183529]/50'
            }`}
          >
            <span>Leadership &amp; Credentials</span>
            <ArrowRight className="w-4 h-4 text-[#B49A64]/60" />
          </Link>

          {/* Practice Areas Collapsible */}
          <div>
            <button
              type="button"
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
              className="w-full flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium text-[#F1EBDD] hover:bg-[#183529]/50 transition-colors"
            >
              <span>Practice Disciplines</span>
              <ChevronDown
                className={`w-4 h-4 text-[#B49A64] transition-transform duration-200 ${
                  servicesOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {servicesOpen && (
              <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-[#B49A64]/30 my-1 ml-3">
                <Link
                  to="/services"
                  onClick={onClose}
                  className="block py-2 px-3 rounded-lg text-xs font-semibold text-[#B49A64] hover:bg-[#183529]/50 transition-colors"
                >
                  All Practice Areas Overview →
                </Link>
                {practiceCorridors.map((c) => (
                  <Link
                    key={c.path}
                    to={c.path}
                    onClick={onClose}
                    className="flex items-center justify-between py-2 px-3 rounded-lg text-xs text-[#AAB4A0] hover:text-[#F1EBDD] hover:bg-[#183529]/40 transition-colors"
                  >
                    <span>{c.label}</span>
                    <span className="text-[10px] font-mono text-[#B49A64]/80">{c.code}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/industries"
            onClick={onClose}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/industries' ? 'bg-[#183529] text-[#B49A64] font-semibold' : 'text-[#F1EBDD] hover:bg-[#183529]/50'
            }`}
          >
            <span>Industries</span>
            <ArrowRight className="w-4 h-4 text-[#B49A64]/60" />
          </Link>

          {/* Explicit /blog route link verified by E2E tests */}
          <Link
            to="/blog"
            onClick={onClose}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname.startsWith('/blog') ? 'bg-[#183529] text-[#B49A64] font-semibold' : 'text-[#F1EBDD] hover:bg-[#183529]/50'
            }`}
          >
            <span>Articles &amp; Insights</span>
            <ArrowRight className="w-4 h-4 text-[#B49A64]/60" />
          </Link>

          <Link
            to="/locations"
            onClick={onClose}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/locations' ? 'bg-[#183529] text-[#B49A64] font-semibold' : 'text-[#F1EBDD] hover:bg-[#183529]/50'
            }`}
          >
            <span>Chambers &amp; Footprint</span>
            <ArrowRight className="w-4 h-4 text-[#B49A64]/60" />
          </Link>

          <Link
            to="/contact"
            onClick={onClose}
            className={`flex items-center justify-between py-3 px-3.5 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/contact' ? 'bg-[#183529] text-[#B49A64] font-semibold' : 'text-[#F1EBDD] hover:bg-[#183529]/50'
            }`}
          >
            <span>Contact Chambers</span>
            <ArrowRight className="w-4 h-4 text-[#B49A64]/60" />
          </Link>
        </div>

        {/* Footer & Direct Channels */}
        <div className="p-5 border-t border-[#B49A64]/20 space-y-3 bg-[#071B14]">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${FIRM_DATA.contact.primaryPhone.replace(/\s+/g, '')}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#183529] text-[#F1EBDD] border border-[#B49A64]/30 text-xs font-semibold hover:border-[#B49A64] transition-colors min-h-[44px]"
            >
              <Phone className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Call Chambers</span>
            </a>
            <a
              href={FIRM_DATA.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#183529] text-[#F1EBDD] border border-emerald-500/40 text-xs font-semibold hover:border-emerald-400 transition-colors min-h-[44px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>

          <Link
            to="/contact"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#B49A64] hover:bg-[#9E844E] text-[#071B14] font-semibold text-xs uppercase tracking-wider transition-all shadow-md min-h-[44px]"
          >
            <span>Request Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <p className="text-[10px] text-center text-[#AAB4A0] flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64]" />
            <span>ICAI &amp; ICMAI Practicing Practice</span>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileDrawer;
