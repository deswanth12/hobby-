import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Lock
} from 'lucide-react';
import { LetterReveal, WordReveal } from './animations';
import { CornerBrackets, EditorialMarker } from './architectural';

export const WhyChooseUs: React.FC = () => {
  const strengths = [
    {
      num: '01',
      title: 'Big 4 Audit Experience & Rigor',
      description: 'Assurance methodologies grounded in senior statutory audit tenure at Deloitte Haskins & Sells and Fortune 50 multinational corporate exposure.',
      icon: ShieldCheck
    },
    {
      num: '02',
      title: 'Dual CA & CMA (AIR 49, ICMAI)',
      description: 'Professional credentials as Chartered Accountant (ICAI) and Cost Accountant (ICMAI AIR 49), integrating statutory audit with operational cost modeling.',
      icon: Award
    },
    {
      num: '03',
      title: 'Direct Partner Supervision',
      description: 'Every audit engagement, regulatory submission, and statutory opinion is supervised, analyzed, and signed under direct partner leadership.',
      icon: Users
    },
    {
      num: '04',
      title: 'Ethical Compliance & Confidentiality',
      description: 'Adherence to applicable ICAI auditing standards, statutory compliance rigor, and institutional-grade data privacy protocols.',
      icon: Lock
    }
  ];

  return (
    <section 
      className="py-10 sm:py-14 lg:py-16 bg-[#071B14] text-[#F1EBDD] border-b border-[#B49A64]/20 relative overflow-hidden texture-architectural-lines" 
      id="why-choose-us"
    >
      {/* Ambient Radial Background Lighting */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-ambient-radial-gold pointer-events-none -z-0" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-ambient-radial-sage pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-12 scroll-reveal">
          <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
            <EditorialMarker number="03" label="INSTITUTIONAL MERIT" variant="dark" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B241C] text-[#F1EBDD] font-editorial-meta text-xs border border-[#B49A64]/60 shadow-xs">
              <span className="text-[#B49A64] font-mono font-bold">//</span>
              <LetterReveal text="WHY CHOOSE US" as="span" className="tracking-widest uppercase font-semibold text-[#F1EBDD]" />
            </div>
          </div>

          <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#F1EBDD] font-serif font-bold tracking-tight leading-tight">
            <WordReveal text="Institutional Rigor. Direct Partner Accountability." as="span" />
          </h2>

          <p className="font-editorial-body text-sm sm:text-base text-[#D8D0BE] leading-relaxed mt-3 border-l-2 border-[#B49A64]/40 pl-3.5 sm:pl-4">
            Independent Chartered Accountancy practice delivering partner-led statutory assurance, cost management, and regulatory compliance across India.
          </p>
        </div>

        {/* Exactly 4 Factual Institutional Strengths Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 scroll-stagger">
          {strengths.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.num}
                className="p-5 sm:p-6 rounded-2xl bg-[#0B241C] border border-[#B49A64]/30 shadow-card hover:border-[#B49A64] transition-all duration-300 relative group flex flex-col justify-between"
              >
                <CornerBrackets size={12} variant="gold" />
                
                <div>
                  {/* Top Meta: Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#153F32] text-[#B49A64] border border-[#B49A64]/30">
                      {item.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#153F32] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30 group-hover:bg-[#071B14] transition-colors">
                      <IconComponent className="w-5 h-5 text-[#B49A64]" aria-hidden="true" />
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
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
