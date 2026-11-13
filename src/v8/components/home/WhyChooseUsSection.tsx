import React from 'react';
import { ShieldCheck, Award, Users, Lock } from 'lucide-react';
import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../decorative';
import { Reveal, StaggerContainer, StaggerItem } from '../animation';

export const INSTITUTIONAL_STRENGTHS = [
  {
    num: '01',
    title: 'Big 4 Audit Experience & Rigor',
    description: 'Assurance methodologies grounded in senior statutory audit tenure at Deloitte Haskins & Sells and Fortune 50 multinational corporate exposure.',
    icon: ShieldCheck,
  },
  {
    num: '02',
    title: 'Dual CA & CMA (AIR 49, ICMAI)',
    description: 'Professional credentials as Chartered Accountant (ICAI) and Cost Accountant (ICMAI AIR 49), integrating statutory audit with operational cost modeling.',
    icon: Award,
  },
  {
    num: '03',
    title: 'Direct Partner Supervision',
    description: 'Every audit engagement, regulatory submission, and statutory opinion is supervised, analyzed, and signed under direct partner leadership.',
    icon: Users,
  },
  {
    num: '04',
    title: 'Ethical Compliance & Confidentiality',
    description: 'Adherence to applicable ICAI auditing standards, statutory compliance rigor, and institutional-grade data privacy protocols.',
    icon: Lock,
  },
];

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section 
      id="professional-approach"
      className="py-12 sm:py-16 lg:py-20 bg-[#071B14] text-[#F1EBDD] border-b border-[#B49A64]/20 relative overflow-hidden texture-architectural-lines scroll-mt-28" 
    >
      {/* Anchor Aliases for Deep Linking and Test Continuity */}
      <div id="why-choose-us" className="scroll-mt-28" />

      {/* Ambient Decorative Layer */}
      <DecorativeLayer>
        <DotGrid
          variant="bronze"
          width={200}
          height={200}
          className="absolute -bottom-8 -left-8 opacity-20 hidden md:block"
        />
      </DecorativeLayer>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <Reveal delay={60} duration={650}>
          <div className="max-w-3xl mb-8 sm:mb-12">
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#B49A64] bg-[#0B241C] px-2.5 py-1 rounded-md border border-[#B49A64]/40">
                03 / PROFESSIONAL APPROACH
              </span>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B241C] text-[#F1EBDD] font-editorial-meta text-xs border border-[#B49A64]/60 shadow-xs">
                <span className="text-[#B49A64] font-mono font-bold">//</span>
                <span className="tracking-widest uppercase font-semibold text-[#F1EBDD]">WHY CHOOSE US</span>
              </div>
            </div>

            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#F1EBDD] font-serif font-bold tracking-tight leading-tight">
              Institutional Rigor. Direct Partner Accountability.
            </h2>

            <p className="font-editorial-body text-sm sm:text-base text-[#D8D0BE] leading-relaxed mt-3 border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4">
              Independent Chartered Accountancy practice delivering partner-led statutory assurance, cost management, and regulatory compliance across India.
            </p>

            {/* WhyChooseUs Double-Rule Accent */}
            <ArchitecturalLines type="double-rule" variant="bronze" length="100px" className="mt-3.5 opacity-60" />
          </div>
        </Reveal>

        {/* Exactly 4 Factual Institutional Strengths Grid */}
        <StaggerContainer staggerMs={80} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {INSTITUTIONAL_STRENGTHS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <StaggerItem key={item.num} index={idx} distance={20} durationMs={550} className="h-full flex">
                <div
                  className="w-full p-5 sm:p-6 rounded-2xl bg-[#0B241C] border border-[#B49A64]/30 shadow-card hover:border-[#B49A64] hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between"
                >
                  {/* Corner Brass Accents */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#B49A64]/40 rounded-tl-sm pointer-events-none group-hover:border-[#B49A64] transition-colors" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#B49A64]/40 rounded-br-sm pointer-events-none group-hover:border-[#B49A64] transition-colors" aria-hidden="true" />
                  
                  <div>
                    {/* Top Meta: Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#183529] text-[#B49A64] border border-[#B49A64]/30">
                        {item.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30 group-hover:bg-[#071B14] transition-colors">
                        <IconComponent className="w-5 h-5 text-[#B49A64] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Heading */}
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#F1EBDD] group-hover:text-white transition-colors leading-snug mb-2.5">
                      {item.title}
                    </h3>

                    {/* Concise Description (~16–19 words) */}
                    <p className="font-editorial-body text-xs sm:text-[13px] text-[#D8D0BE] leading-relaxed">
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

export default WhyChooseUsSection;
