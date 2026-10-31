import React, { useState, useEffect } from 'react';
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
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session to prevent repeated covering of content
    try {
      if (sessionStorage.getItem('ka_wa_dismissed')) {
        return;
      }
    } catch (e) {
      // sessionStorage unavailable
    }

    // Delay prompt appearance so it doesn't immediately obscure page entry
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 1200);

    // Auto-dismiss after 10 seconds to keep reading flow unobstructed
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 11200);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    try {
      sessionStorage.setItem('ka_wa_dismissed', '1');
    } catch (err) {
      // ignore
    }
  };

  return (
    <aside 
      aria-label="Direct WhatsApp Consultation" 
      className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end pointer-events-none"
    >
      {/* Interactive Consultation Speech Bubble (Desktop/Tablet only, auto-timed & non-blocking) */}
      {showTooltip && (
        <div 
          className="hidden sm:block mb-2.5 p-3 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-brand-gold/60 shadow-editorial-lg text-brand-forest max-w-[280px] sm:max-w-[300px] animate-fade-up relative transition-[opacity,transform] duration-200 pointer-events-auto"
          role="status"
        >
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                Active Partner Desk
                <Sparkles className="w-2.5 h-2.5 text-brand-gold shrink-0" />
              </span>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-gray-700 -mt-1 -mr-1 rounded-full hover:bg-gray-100 transition-colors"
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

      {/* Floating Action Button */}
      <a
        href={FIRM_DATA.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-center gap-2.5 min-w-[48px] min-h-[48px] w-12 h-12 sm:w-auto sm:h-auto bg-emerald-700 hover:bg-emerald-800 text-white sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-editorial-lg border border-brand-gold/40 transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Chat directly with CA Kavitha Vijay on WhatsApp"
      >
        {/* Live Double Radar Ping */}
        <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
          <span className="motion-safe:animate-[pulse_3s_ease-in-out_infinite] absolute inline-flex h-full w-full rounded-full bg-emerald-400/40" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-sm" />
        </span>

        {/* Branded WhatsApp Vector Glyph */}
        <WhatsAppIcon className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shrink-0 drop-shadow-sm" />

        {/* Action Label & Status */}
        <span className="font-semibold text-xs tracking-wide hidden sm:inline whitespace-nowrap drop-shadow-xs">
          Consult on WhatsApp
        </span>

        {/* Online Status Pill */}
        <span className="hidden xl:inline-flex items-center text-[10px] font-semibold text-emerald-100 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-400/30">
          Online
        </span>
      </a>
    </aside>
  );
};
