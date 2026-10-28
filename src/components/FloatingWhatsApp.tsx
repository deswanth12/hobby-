import React from 'react';
import { MessageSquare } from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <aside aria-label="Direct WhatsApp Consultation" className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40">
      <a
        href={FIRM_DATA.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-3 rounded-full shadow-card hover:shadow-card-hover border border-gold/40 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Chat directly with CA KavithaVijay SRJ on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
        </span>
        <MessageSquare className="w-5 h-5 text-gold-light" aria-hidden="true" />
        <span className="font-semibold text-xs tracking-wide hidden sm:inline">
          Consult on WhatsApp
        </span>
      </a>
    </aside>
  );
};
