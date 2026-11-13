import React from 'react';
import { ShieldCheck, MessageSquare, Phone, CheckSquare, Clock } from 'lucide-react';
import { getRouteWhatsAppUrl } from '../../adapters/backendAdapter';
import { FIRM_DATA } from '../../../data/firmData';

interface CorridorConversionPlaqueProps {
  serviceTitle: string;
  disciplineCode?: string;
  onOpenChecklist?: () => void;
  className?: string;
}

export const CorridorConversionPlaque: React.FC<CorridorConversionPlaqueProps> = ({
  serviceTitle,
  disciplineCode = 'PRAC',
  onOpenChecklist,
  className = ''
}) => {
  const whatsappUrl = getRouteWhatsAppUrl(typeof window !== 'undefined' ? window.location.pathname : '', serviceTitle);
  const cleanPhone = (FIRM_DATA.contact.primaryPhoneClean || '919626350900').replace(/[^0-9]/g, '');

  return (
    <section 
      aria-label="Direct Partner Consultation Guarantee"
      className={`my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B241C] via-[#113126] to-[#071913] text-[#F1EBDD] border-2 border-[#B49A64]/50 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Decorative architectural accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B49A64]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#183529] text-[#B49A64] text-xs font-mono font-bold border border-[#B49A64]/40">
              {disciplineCode} • STATUTORY COUNSEL
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Clock className="w-3.5 h-3.5" />
              <span>24-Hour Chambers Callback SLA</span>
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F1EBDD] tracking-tight">
            Need Expert Counsel on {serviceTitle}?
          </h3>

          <p className="font-editorial-body text-sm sm:text-base text-[#D8D0BE] leading-relaxed">
            Every statutory submission, tax defense brief, and financial syndication model is prepared and verified under the direct personal supervision of <strong className="text-[#F1EBDD]">CA Kavitha Vijay (B.Com, CA, CMA AIR 49 &#123;ICMAI&#125;)</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#D8D0BE]/90 pt-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
              <span>100% Confidentiality Protected</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
              <span>Direct Partner Oversight</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#B49A64]" />
              <span>No Junior Delegation</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-72">
          {/* WhatsApp Direct with Prefill */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>Consult on WhatsApp</span>
          </a>

          {/* Open Statutory Checklist */}
          {onOpenChecklist && (
            <button
              type="button"
              onClick={onOpenChecklist}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#B49A64] border border-[#B49A64]/50 text-xs font-semibold transition-all hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
            >
              <CheckSquare className="w-4 h-4 text-[#B49A64]" />
              <span>View Statutory Checklist</span>
            </button>
          )}

          {/* Direct Chambers Call */}
          <a
            href={`tel:+${cleanPhone}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#071B14] hover:bg-[#183529] text-[#D8D0BE] border border-[#B49A64]/30 text-xs font-semibold transition-all min-h-[44px]"
          >
            <Phone className="w-4 h-4 text-[#B49A64]" />
            <span>Call Chambers (+91 96263 50900)</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CorridorConversionPlaque;
