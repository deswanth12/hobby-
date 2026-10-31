import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { DualArrowButton } from './animations/DualArrowButton';

interface ConnectedTimelineProps {
  className?: string;
}

export const ConnectedTimeline: React.FC<ConnectedTimelineProps> = ({ className = '' }) => {
  const { data: FIRM_DATA } = useFirmData();
  const workflow = FIRM_DATA.workflow;

  return (
    <div className={`relative w-full ${className}`.trim()}>
      
      {/* =====================================================================
          DESKTOP CONNECTED TIMELINE (lg: and above)
          Horizontal connecting rail with milestone dots and cards
          ===================================================================== */}
      <div className="hidden lg:block relative">
        {/* Architectural Connecting Rail */}
        <div 
          className="absolute top-6 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-brand-forest via-brand-gold to-brand-forest z-0 pointer-events-none"
          aria-hidden="true"
        />

        <div className="grid grid-cols-4 gap-6 relative z-10 scroll-stagger">
          {workflow.map((flow, idx) => (
            <div
              key={flow.step}
              className="group flex flex-col items-center scroll-reveal"
            >
              {/* Milestone Indicator Node */}
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="w-12 h-12 rounded-full bg-brand-forest border-2 border-brand-gold flex items-center justify-center font-serif text-base font-bold text-brand-gold shadow-md group-hover:scale-110 group-hover:bg-brand-deep group-hover:shadow-gold-glow transition-[transform,background-color,box-shadow] duration-200"
                >
                  {flow.step}
                </div>
                {/* Micro vertical connector stem to card */}
                <div className="w-0.5 h-4 bg-brand-gold/60 group-hover:h-6 group-hover:bg-brand-gold transition-[transform,background-color,box-shadow] duration-200" />
              </div>

              {/* Step Detail Card */}
              <div className="w-full bg-brand-white rounded-2xl p-6 border border-brand-border group-hover:border-brand-gold/70 shadow-card flex flex-col justify-between flex-1 relative transition-[transform,background-color,box-shadow] duration-200 group-hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gold-dark bg-brand-pale px-2.5 py-0.5 rounded border border-brand-gold/30">
                      Phase {idx + 1}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <h3 className="font-editorial-h3 text-lg font-bold text-brand-forest mb-2 group-hover:text-brand-deep transition-colors">
                    {flow.title}
                  </h3>

                  <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                    {flow.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-brand-border/60 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>Partner-Supervised</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          MOBILE & TABLET TIMELINE (Under lg: screen size)
          Vertical spine with milestones and indented step cards
          ===================================================================== */}
      <div className="lg:hidden relative pl-6 sm:pl-8">
        {/* Vertical Connecting Spine */}
        <div 
          className="absolute top-4 bottom-8 left-2 sm:left-3 w-0.5 bg-gradient-to-b from-brand-forest via-brand-gold to-brand-forest z-0 pointer-events-none"
          aria-hidden="true"
        />

        <div className="space-y-6 scroll-stagger">
          {workflow.map((flow, idx) => (
            <div
              key={`mobile-${flow.step}`}
              className="relative group scroll-reveal"
            >
              {/* Vertical Milestone Node */}
              <div 
                className="absolute -left-6 sm:-left-8 top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-forest border-2 border-brand-gold text-brand-gold font-serif text-xs font-bold flex items-center justify-center shadow-sm z-10"
              >
                {flow.step}
              </div>

              {/* Step Card */}
              <div className="bg-brand-white rounded-xl p-5 border border-brand-border shadow-card hover:border-brand-gold/60 transition-[border-color,box-shadow] duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gold-dark bg-brand-pale px-2 py-0.5 rounded border border-brand-gold/30">
                    Phase {idx + 1}
                  </span>
                  <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Partner-Supervised</span>
                  </div>
                </div>

                <h3 className="font-editorial-h3 text-base sm:text-lg font-bold text-brand-forest mb-1.5">
                  {flow.title}
                </h3>

                <p className="font-editorial-body text-xs text-brand-muted leading-relaxed">
                  {flow.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Strip */}
      <div className="mt-12 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-xl bg-brand-white border border-brand-border shadow-subtle max-w-full">
          <span className="font-editorial-body text-xs sm:text-sm text-brand-charcoal font-medium">
            Ready to review your firm's compliance or upcoming audit requirements?
          </span>
          <DualArrowButton
            href={FIRM_DATA.contact.whatsappLink}
            external
            variant="primary"
            className="text-xs font-semibold"
          >
            Schedule a Consultation
          </DualArrowButton>
        </div>
      </div>

    </div>
  );
};
