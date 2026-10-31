import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// 1. UPDATE FloatingWhatsApp.tsx
// ---------------------------------------------------------------------------
const floatingPath = path.resolve('C:/kavitha ca/src/components/FloatingWhatsApp.tsx');

const floatingContent = `import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const FloatingWhatsApp: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <aside 
      aria-label="Direct WhatsApp Consultation" 
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end"
    >
      {/* Alive Interactive Consultation Speech Bubble */}
      {showTooltip && (
        <div 
          className="mb-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-gold/60 shadow-[0_12px_32px_-6px_rgba(16,45,37,0.25)] text-brand-forest max-w-[280px] sm:max-w-[300px] animate-fade-up relative transition-all duration-300"
          role="status"
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
              </span>
              <span className="font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                Active Partner Desk
                <Sparkles className="w-2.5 h-2.5 text-brand-gold shrink-0" />
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-gray-400 hover:text-gray-700 -mt-0.5 -mr-0.5 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Dismiss consultation prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-editorial-body text-[11px] sm:text-xs text-brand-charcoal leading-snug">
            Need urgent statutory advice or tax audit counsel? Connect directly with <strong className="text-brand-forest">CA Kavitha Vijay</strong>.
          </p>
          {/* Subtle triangle pointer pointing to button */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white/95 border-b border-r border-brand-gold/60 rotate-45" />
        </div>
      )}

      {/* Alive Floating Action Button */}
      <a
        href={FIRM_DATA.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center gap-2.5 min-w-[44px] min-h-[44px] bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#0F3E2E] hover:from-emerald-500 hover:to-emerald-700 text-white px-4 py-3 rounded-full shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5),0_0_0_1px_rgba(195,166,107,0.45)] hover:shadow-[0_16px_36px_-4px_rgba(16,185,129,0.7),0_0_0_1.5px_rgba(195,166,107,0.8)] border border-brand-gold/40 transition-all duration-300 ease-spring hover:-translate-y-1 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Chat directly with CA Kavitha Vijay on WhatsApp"
      >
        {/* Alive Luminescent Aura Ring */}
        <span 
          className="absolute -inset-1 rounded-full bg-emerald-400/30 blur-md animate-pulse pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Live Double Radar Ping */}
        <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-80" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366] shadow-[0_0_8px_#25D366]" />
        </span>

        {/* Branded WhatsApp Vector Glyph with Micro-Bounce */}
        <WhatsAppIcon className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shrink-0 drop-shadow-sm" />

        {/* Action Label & Status */}
        <span className="font-semibold text-xs tracking-wide hidden sm:inline whitespace-nowrap drop-shadow-xs">
          Consult on WhatsApp
        </span>

        {/* Online Status Pill */}
        <span className="hidden xl:inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-100 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-400/30">
          Online
        </span>
      </a>
    </aside>
  );
};
`;

fs.writeFileSync(floatingPath, floatingContent, 'utf8');
console.log('SUCCESS: FloatingWhatsApp.tsx updated with alive presence');

// ---------------------------------------------------------------------------
// 2. UPDATE Navbar.tsx (Arranging Top Navigation & Buttons)
// ---------------------------------------------------------------------------
const navbarPath = path.resolve('C:/kavitha ca/src/components/Navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// Ensure WhatsAppIcon SVG component is present in Navbar.tsx
const waIconDef = `
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
`;

if (!navbarContent.includes('const WhatsAppNavIcon')) {
  navbarContent = navbarContent.replace('export const Navbar: React.FC = () => {', `${waIconDef}\nexport const Navbar: React.FC = () => {`);
}

// Calibrate navigation links gap
navbarContent = navbarContent.replace(
  '<div className="hidden lg:flex items-center gap-3.5 xl:gap-6">',
  '<div className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-5">'
);

// Replace action buttons container with arranged suite
const oldActionStart = '{/* Action Button & Contact Cluster */}';
const oldActionEnd = '{/* Mobile Menu Toggle Button (minimum 44x44px touch target) */}';

const newActionSuite = `{/* Action Button & Contact Cluster (Arranged Executive Suite) */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0">
          {/* Subtle Vertical Hairline Separator */}
          <div className="hidden xl:block h-5 w-px bg-brand-gold/30 mx-0.5" aria-hidden="true" />

          {/* WhatsApp Direct Connect Action */}
          <a
            href={FIRM_DATA.contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border border-emerald-600/30 hover:border-emerald-600/60 shadow-xs hover:shadow-sm text-xs font-semibold tracking-wide transition-all duration-200 btn-tactile whitespace-nowrap min-h-[44px] group"
            title="Chat directly with chambers on WhatsApp"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
            </span>
            <WhatsAppNavIcon className="w-4 h-4 text-emerald-700 transition-transform duration-200 group-hover:scale-110 shrink-0" />
            <span className="font-semibold">WhatsApp</span>
          </a>

          {/* Primary Consultation CTA */}
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 py-2 px-4.5 sm:px-5 rounded-full bg-[#0A241D] hover:bg-[#12382C] text-brand-white border border-brand-gold/60 hover:border-brand-gold shadow-sm hover:shadow-editorial text-xs font-semibold tracking-wider whitespace-nowrap transition-all duration-200 btn-tactile min-h-[44px] group"
          >
            <span>Schedule Consultation</span>
            <ChevronRight className="w-3.5 h-3.5 text-brand-gold transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
          </Link>
        </div>

        `;

if (navbarContent.includes(oldActionStart) && navbarContent.includes(oldActionEnd)) {
  const startIndex = navbarContent.indexOf(oldActionStart);
  const endIndex = navbarContent.indexOf(oldActionEnd);

  const before = navbarContent.substring(0, startIndex);
  const after = navbarContent.substring(endIndex);

  navbarContent = before + newActionSuite + after;
  fs.writeFileSync(navbarPath, navbarContent, 'utf8');
  console.log('SUCCESS: Navbar.tsx updated with arranged top buttons and calibrated spacing');
} else {
  console.error('ERROR: Could not find action button markers in Navbar.tsx');
  process.exit(1);
}
