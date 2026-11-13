import React from 'react';
import { Search, FileCheck2, TrendingUp, ShieldCheck } from 'lucide-react';
import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../decorative';
import { Reveal, StaggerContainer, StaggerItem } from '../animation';

export interface ProcessStep {
  step: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const METHODOLOGY_STEPS: ProcessStep[] = [
  {
    step: '01',
    badge: 'STEP 01',
    title: 'Assessment & Scope Definition',
    description: 'Thorough initial review of statutory records, accounting frameworks, and institutional compliance obligations.',
    icon: Search,
  },
  {
    step: '02',
    badge: 'STEP 02',
    title: 'Technical Execution & Rigor',
    description: 'Direct partner supervision of audit procedures, tax computations, and regulatory documentation standards.',
    icon: FileCheck2,
  },
  {
    step: '03',
    badge: 'STEP 03',
    title: 'Ongoing Compliance & Reporting',
    description: 'Structured management reporting, statutory filing execution, and proactive advisory for emerging regulatory changes.',
    icon: TrendingUp,
  },
];

export const MethodologySection: React.FC = () => {
  return (
    <section 
      id="methodology"
      aria-labelledby="working-process-heading"
      className="py-12 sm:py-16 lg:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE] relative overflow-hidden texture-warm-ivory scroll-mt-28"
    >
      {/* Anchor Aliases for Deep Linking and Test Continuity */}
      <div id="working-process" className="scroll-mt-28" />

      {/* Ambient Decorative Layer */}
      <DecorativeLayer>
        <DotGrid
          variant="sage"
          width={240}
          height={240}
          className="absolute -bottom-10 -right-10 opacity-20 hidden md:block"
        />
      </DecorativeLayer>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <Reveal delay={60} duration={650}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2.5 mb-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#7E5E1E] bg-[#FAF7F0] px-2.5 py-1 rounded-md border border-[#D8D0BE]">
                04 / METHODOLOGY
              </span>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F0] border border-[#B49A64]/60 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#35271F]">
                  OUR WORKING PROCESS
                </span>
              </div>
            </div>

            <h2 
              id="working-process-heading"
              className="font-editorial-h2 text-[#35271F] text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight mb-3"
            >
              From First Consultation to Lasting Success
            </h2>

            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed max-w-xl mx-auto">
              A transparent, disciplined three-step engagement framework designed to protect your statutory compliance.
            </p>

            {/* Methodology Centered Double-Rule Accent */}
            <div className="flex justify-center mt-3">
              <ArchitecturalLines type="double-rule" variant="bronze" length="90px" className="opacity-60" />
            </div>
          </div>
        </Reveal>

        {/* Connecting Track Line Between Steps (Desktop Only) with Glowing Nodes */}
        <div className="hidden md:flex items-center justify-between absolute top-1/2 left-[18%] right-[18%] -translate-y-20 pointer-events-none z-0 opacity-60" aria-hidden="true">
          <span className="w-3 h-3 rounded-full bg-[#B49A64] motion-safe:animate-pulse ring-4 ring-[#B49A64]/20 shadow-xs" />
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-[#B49A64]/30 via-[#B49A64] to-[#B49A64]/30 transition-transform duration-900 origin-left" />
          <span className="w-3 h-3 rounded-full bg-[#B49A64] motion-safe:animate-pulse ring-4 ring-[#B49A64]/20 shadow-xs" />
          <div className="flex-1 h-[1.5px] bg-gradient-to-r from-[#B49A64]/30 via-[#B49A64] to-[#B49A64]/30 transition-transform duration-900 origin-left" />
          <span className="w-3 h-3 rounded-full bg-[#B49A64] motion-safe:animate-pulse ring-4 ring-[#B49A64]/20 shadow-xs" />
        </div>

        {/* Exactly 3 Chronological Steps Grid */}
        <StaggerContainer staggerMs={100} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {METHODOLOGY_STEPS.map((item, idx) => {
            const IconComponent = item.icon;

            return (
              <StaggerItem key={item.step} index={idx} distance={20} durationMs={600} className="h-full flex">
                <div 
                  className="w-full bg-[#FAF7F0] rounded-2xl p-5 sm:p-6 border border-[#D8D0BE] shadow-card hover:border-[#B49A64] hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col justify-between group"
                >
                  {/* Dynamic Corner Brass Accents (Expand on Hover) */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-t-2 border-l-2 border-[#B49A64]/40 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-b-2 border-r-2 border-[#B49A64]/40 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                  <div>
                    {/* Badge & Partner Supervised Tag */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E5E1E] bg-[#E8D5B5] px-2.5 py-0.5 rounded-full border border-[#B49A64]/50 shadow-xs group-hover:bg-[#7E5E1E] group-hover:text-white transition-colors duration-300">
                        <IconComponent className="w-3.5 h-3.5 text-[#7E5E1E] group-hover:text-white transition-colors" />
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

                    {/* Concise Description (~13–14 words) */}
                    <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
};

export default MethodologySection;
