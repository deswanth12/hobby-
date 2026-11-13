import React, { useState, useEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setIsVisible(window.scrollY > 180);
        } else {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <aside 
      aria-label="Direct WhatsApp Consultation" 
      className={`fixed bottom-4 right-3.5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-30 flex flex-col items-end transition-[opacity,transform] duration-300 pointer-events-none ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-3 sm:opacity-100 sm:translate-y-0'
      }`}
    >
      {/* Floating Action Button (Clean, Non-Intrusive, No Unsolicited Speech Bubbles) */}
      <a
        href={FIRM_DATA.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center justify-center gap-2.5 min-w-[48px] min-h-[48px] w-12 h-12 sm:w-auto sm:h-auto bg-[#183529] hover:bg-[#071B14] text-[#F1EBDD] sm:px-4 sm:py-3 rounded-full shadow-lg border border-[#B49A64]/50 transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#B49A64] focus:ring-offset-2"
        aria-label="Chat directly with CA Kavitha Vijay on WhatsApp"
      >
        <span className="relative flex h-2.5 w-2.5 mr-0.5">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <WhatsAppIcon className="w-5 h-5 text-emerald-400 transition-transform duration-300 group-hover:scale-105 shrink-0" />
        <span className="font-semibold text-xs tracking-wide hidden sm:inline whitespace-nowrap">
          Connect via WhatsApp
        </span>
      </a>
    </aside>
  );
};

export default FloatingWhatsApp;
