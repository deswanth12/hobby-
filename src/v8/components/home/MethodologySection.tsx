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
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
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

        {/* Horizontal Connecting Track Line with 3 Glowing Circular Nodes (Desktop/Tablet) */}
        <div 
          className="hidden md:block relative pointer-events-none" 
          aria-hidden="true"
        >
          <div className="grid grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {/* Step 01 Node & Track Line to Step 02 */}
            <div className="relative flex flex-col items-center">
              <div className="absolute top-2.5 left-1/2 w-[calc(100%+2rem)] -translate-y-1/2 h-[1.5px] bg-gradient-to-r from-[#B49A64] via-[#B49A64] to-[#B49A64]/70 z-0" />
              <span className="relative z-10 w-5 h-5 rounded-full bg-[#FAF7F0] border-2 border-[#B49A64] ring-4 ring-[#B49A64]/20 shadow-xs flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
              </span>
              <span className="block h-[17px] -mb-px w-px bg-gradient-to-b from-[#B49A64] to-[#B49A64]/40" />
            </div>

            {/* Step 02 Node & Track Line to Step 03 */}
            <div className="relative flex flex-col items-center">
              <div className="absolute top-2.5 left-1/2 w-[calc(100%+2rem)] -translate-y-1/2 h-[1.5px] bg-gradient-to-r from-[#B49A64]/70 via-[#B49A64] to-[#B49A64] z-0" />
              <span className="relative z-10 w-5 h-5 rounded-full bg-[#FAF7F0] border-2 border-[#B49A64] ring-4 ring-[#B49A64]/20 shadow-xs flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
              </span>
              <span className="block h-[17px] -mb-px w-px bg-gradient-to-b from-[#B49A64] to-[#B49A64]/40" />
            </div>

            {/* Step 03 Node (Terminal Step) */}
            <div className="relative flex flex-col items-center">
              <span className="relative z-10 w-5 h-5 rounded-full bg-[#FAF7F0] border-2 border-[#B49A64] ring-4 ring-[#B49A64]/20 shadow-xs flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
              </span>
              <span className="block h-[17px] -mb-px w-px bg-gradient-to-b from-[#B49A64] to-[#B49A64]/40" />
            </div>
          </div>
        </div>

        {/* Exactly 3 Chronological Steps Grid */}
        <StaggerContainer staggerMs={100} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {METHODOLOGY_STEPS.map((item, idx) => {
            const IconComponent = item.icon;

            return (
              <StaggerItem key={item.step} index={idx} distance={20} durationMs={600} className="h-full flex">
                <div 
                  className="w-full bg-[#FAF7F0] rounded-2xl p-5 sm:p-6 border border-[#D8D0BE] shadow-card card-parchment-bevel hover:border-[#B49A64] hover:shadow-[0_16px_36px_rgba(180,154,100,0.18)] md:hover:-translate-y-2 transition-all duration-300 relative flex flex-col justify-between group overflow-hidden"
                >
                  {/* Top Metallic Hairline Accent */}
                  <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#B49A64]/0 to-transparent group-hover:via-[#B49A64]/70 transition-all duration-500" aria-hidden="true" />

                  {/* Dynamic Corner Brass Accents (Expand on Hover) */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-t-2 border-l-2 border-[#B49A64]/40 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 group-hover:w-5 group-hover:h-5 border-b-2 border-r-2 border-[#B49A64]/40 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-all duration-300" aria-hidden="true" />

                  {/* Mobile Vertical Timeline Step Connector (Between Cards) */}
                  {idx < METHODOLOGY_STEPS.length - 1 && (
                    <div 
                      className="md:hidden absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 h-6 sm:h-8 w-6 flex flex-col items-center justify-center z-20 pointer-events-none" 
                      aria-hidden="true"
                    >
                      <div className="absolute -top-px -bottom-px left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-[#B49A64]/60 via-[#B49A64] to-[#B49A64]/60" />
                      <span className="relative z-10 w-4 h-4 rounded-full bg-[#FAF7F0] border-2 border-[#B49A64] ring-2 ring-[#B49A64]/20 shadow-xs flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] motion-safe:animate-pulse" />
                      </span>
                    </div>
                  )}

                  <div>
                    {/* Step Medallion, Badge & Partner Supervised Tag */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#183529] text-[#B49A64] font-mono font-bold text-xs flex items-center justify-center border border-[#B49A64]/40 shadow-xs group-hover:bg-[#071B14] group-hover:scale-105 group-hover:border-[#C5A059] transition-all duration-300 shrink-0">
                          {item.step}
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7E5E1E] bg-[#E8D5B5] px-2.5 py-0.5 rounded-full border border-[#B49A64]/50 shadow-xs group-hover:bg-[#7E5E1E] group-hover:text-white transition-colors duration-300 shrink-0">
                          <IconComponent className="w-3.5 h-3.5 text-[#7E5E1E] group-hover:text-white transition-colors shrink-0" />
                          <span>{item.badge}</span>
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#35271F] flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
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
