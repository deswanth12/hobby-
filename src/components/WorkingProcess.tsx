import React from 'react';
import { 
  Search, 
  FileCheck2, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { LetterReveal, WordReveal } from './animations';
import { CornerBrackets, EditorialMarker } from './architectural';

export interface ProcessStep {
  step: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    badge: 'STEP 01',
    title: 'Assessment & Scope Definition',
    description: 'Thorough initial review of statutory records, accounting frameworks, and institutional compliance obligations.',
    icon: Search
  },
  {
    step: '02',
    badge: 'STEP 02',
    title: 'Technical Execution & Rigor',
    description: 'Direct partner supervision of audit procedures, tax computations, and regulatory documentation standards.',
    icon: FileCheck2
  },
  {
    step: '03',
    badge: 'STEP 03',
    title: 'Ongoing Compliance & Reporting',
    description: 'Structured management reporting, statutory filing execution, and proactive advisory for emerging regulatory changes.',
    icon: TrendingUp
  }
];

interface WorkingProcessProps {
  className?: string;
}

export const WorkingProcess: React.FC<WorkingProcessProps> = ({ className = '' }) => {
  return (
    <section 
      id="working-process"
      aria-labelledby="working-process-heading"
      className={`py-10 sm:py-14 lg:py-16 bg-[#F1EBDD] border-b border-[#D8D0BE] relative overflow-hidden texture-warm-ivory ${className}`.trim()}
    >
      {/* Background Architectural Ambient Lighting */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(195,166,107,0.08)_0%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 scroll-reveal relative">
          <div className="flex items-center justify-center gap-2.5 mb-2.5 flex-wrap">
            <EditorialMarker number="04" label="ENGAGEMENT METHODOLOGY" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F0] border border-[#B49A64]/60 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
              <LetterReveal
                text="OUR WORKING PROCESS"
                as="span"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-[#35271F]"
              />
            </div>
          </div>

          <h2 
            id="working-process-heading"
            className="font-editorial-h2 text-[#35271F] text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight mb-3"
          >
            <WordReveal text="From First Consultation to Lasting Success" as="span" />
          </h2>

          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed max-w-xl mx-auto">
            A transparent, disciplined three-step engagement framework designed to protect your statutory compliance.
          </p>
        </div>

        {/* Exactly 3 Chronological Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10 scroll-stagger">
          {PROCESS_STEPS.map((item) => {
            const IconComponent = item.icon;

            return (
              <div 
                key={item.step}
                className="bg-[#FAF7F0] rounded-2xl p-5 sm:p-6 border border-[#D8D0BE] shadow-card hover:border-[#B49A64] transition-all duration-300 relative flex flex-col justify-between scroll-reveal group"
              >
                <CornerBrackets size={14} variant="gold" />

                <div>
                  {/* Badge & Partner Supervised Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E5E1E] bg-[#E8D5B5] px-2.5 py-0.5 rounded-full border border-[#B49A64]/50 shadow-xs">
                      <IconComponent className="w-3.5 h-3.5 text-[#7E5E1E]" />
                      <span>{item.badge}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#35271F] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64]" />
                      <span>Partner-Supervised</span>
                    </span>
                  </div>

                  {/* Step Title */}
                  <h3 className="font-editorial-h3 text-lg sm:text-xl font-bold text-[#35271F] group-hover:text-[#183529] transition-colors mb-2.5">
                    {item.title}
                  </h3>

                  {/* Concise Description (~14 words) */}
                  <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WorkingProcess;
