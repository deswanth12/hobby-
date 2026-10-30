import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

export const FloatingWhatsApp: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  return (
    <aside aria-label="Direct WhatsApp Consultation" className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40">
      <a
        href={FIRM_DATA.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-2.5 min-w-[44px] min-h-[44px] bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-full shadow-card hover:shadow-card-hover border border-gold/40 transition-all duration-300 ease-spring hover:-translate-y-0.5 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Chat directly with CA Kavitha Vijay on WhatsApp"
      >
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <MessageSquare className="w-5 h-5 text-gold-light" aria-hidden="true" />
        <span className="font-semibold text-xs tracking-wide hidden sm:inline">
          Consult on WhatsApp
        </span>
      </a>
    </aside>
  );
};
