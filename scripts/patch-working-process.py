new_content = '''import React from 'react';
import { 
  Search, 
  Target, 
  FileCheck2, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { DualArrowButton, AnimatedDotPattern, LetterReveal, WordReveal } from './animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from './architectural';

export interface ProcessStep {
  step: string;
  badge: string;
  title: string;
  description: string;
  focusArea: string;
  icon: React.ElementType;
  keyPoints: string[];
}

/**
 * FOUR STATUTORY ENGAGEMENT STEPS
 * Minimalist, typography-led architectural timeline (zero decorative photography)
 */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    badge: 'STEP 01',
    title: 'Understanding Your Needs',
    description: 'We conduct a thorough preliminary appraisal of your business entity, transaction flows, and statutory filing obligations.',
    focusArea: 'Initial Discovery & Scoping',
    icon: Search,
    keyPoints: [
      'Business model & entity structure evaluation',
      'Statutory filing calendar & deadline mapping',
      'Direct engagement scoping with CA Kavitha Vijay'
    ]
  },
  {
    step: '02',
    badge: 'STEP 02',
    title: 'Planning and Strategy',
    description: 'We formulate a tailored compliance roadmap and tax structuring plan designed to minimize regulatory friction and prevent audit exposure.',
    focusArea: 'Tax Planning & Structuring',
    icon: Target,
    keyPoints: [
      'Tailored tax optimization roadmap',
      'Regulatory risk analysis & defense planning',
      'Reconciliation protocol design across ledgers'
    ]
  },
  {
    step: '03',
    badge: 'STEP 03',
    title: 'Execution & Verification',
    description: 'Our senior practice team conducts rigorous financial verification, ledger reconciliations, and filing execution under direct partner supervision.',
    focusArea: 'Partner-Supervised Audit & Filings',
    icon: FileCheck2,
    keyPoints: [
      'Rigorous verification of accounts & ledgers',
      'Accurate tax computation & portal submission',
      'Direct partner review ensuring statutory precision'
    ]
  },
  {
    step: '04',
    badge: 'STEP 04',
    title: 'Ongoing Support & Advisory',
    description: 'We provide continuous year-round statutory surveillance, departmental notice defense, and strategic financial advisory as your enterprise scales.',
    focusArea: 'Year-Round Compliance & Advisory',
    icon: TrendingUp,
    keyPoints: [
      'Proactive updates on regulatory & GST changes',
      'Departmental notices representation & reply support',
      'Virtual CFO & quarterly business performance reviews'
    ]
  }
];

interface WorkingProcessProps {
  className?: string;
}

export const WorkingProcess: React.FC<WorkingProcessProps> = ({ className = '' }) => {
  const { data: FIRM_DATA } = useFirmData();

  return (
    <section 
      id="working-process"
      aria-labelledby="working-process-heading"
      className={`py-12 sm:py-16 lg:py-20 bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden texture-linen ${className}`.trim()}
    >
      {/* Background Architectural Ambient Lighting */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(195,166,107,0.08)_0%,transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =====================================================================
            SECTION HEADER
            ===================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 lg:mb-16 scroll-reveal relative">
          {/* Numbered Editorial Marker & Eyebrow Badge */}
          <div className="flex items-center justify-center gap-2.5 mb-3 flex-wrap">
            <EditorialMarker number="04" label="ENGAGEMENT METHODOLOGY" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9EF] border border-[#C3A66B]/60 shadow-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <LetterReveal
                text="OUR WORKING PROCESS"
                as="span"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-[#153F32]"
              />
            </div>
          </div>

          {/* Main Heading */}
          <h2 
            id="working-process-heading"
            className="font-editorial-h2 text-[#153F32] text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight mb-4"
          >
            <WordReveal text="From First Consultation to Lasting Success" as="span" />
          </h2>

          <p className="font-editorial-body text-base sm:text-lg text-[#525954] leading-relaxed max-w-2xl mx-auto">
            A transparent, disciplined four-step engagement framework designed to protect your statutory compliance and accelerate long-term enterprise growth.
          </p>
        </div>

        {/* =====================================================================
            DESKTOP ALTERNATING ARCHITECTURAL TIMELINE (lg: and above)
            ===================================================================== */}
        <div className="hidden lg:block relative">
          
          {/* Anchored Dot Grids at Timeline Boundaries */}
          <div className="absolute -top-8 -right-4 pointer-events-none z-0 opacity-20 hidden lg:block">
            <AnimatedDotPattern rows={3} cols={4} variant="gold" />
          </div>
          <div className="absolute -bottom-8 -left-4 pointer-events-none z-0 opacity-20 hidden lg:block">
            <AnimatedDotPattern rows={3} cols={4} variant="gold" />
          </div>

          {/* Central Architectural Spine: Visible Green Timeline with Champagne Accents */}
          <div 
            className="absolute left-1/2 top-8 bottom-16 -translate-x-1/2 w-[3px] bg-gradient-to-b from-[#153F32] via-[#C3A66B] to-[#153F32] pointer-events-none z-0 motion-timeline-spine shadow-xs"
            aria-hidden="true"
          />

          <div className="space-y-14 lg:space-y-18 relative z-10">
            {PROCESS_STEPS.map((item, idx) => {
              const isEven = idx % 2 === 1; // 0=Odd, 1=Even
              const IconComponent = item.icon;

              return (
                <div 
                  key={item.step}
                  className="grid grid-cols-12 gap-8 items-center relative group"
                >
                  {/* Central Node Badge sitting exactly on the vertical spine */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-14 h-14 rounded-full bg-[#C3A66B]/25 scale-100 group-hover:scale-125 transition-transform duration-500 ease-out" />
                      
                      <div className="w-11 h-11 rounded-full bg-[#153F32] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif font-bold text-sm shadow-card group-hover:bg-[#102D25] group-hover:shadow-gold-glow transition-[transform,background-color,box-shadow] duration-300">
                        {item.step}
                      </div>
                    </div>
                  </div>

                  {/* LEFT COLUMN (Cols 1 to 5) */}
                  <div className="col-span-5">
                    {!isEven ? (
                      /* Strategy Overview for Odd Steps (01, 03) */
                      <div className="scroll-reveal-left text-right pr-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] text-xs font-semibold tracking-wider uppercase border border-[#C3A66B]/50 shadow-xs mb-3">
                          <IconComponent className="w-3.5 h-3.5 text-[#7E5E1E]" />
                          <span>{item.badge}</span>
                        </div>

                        <h3 className="font-editorial-h3 text-2xl font-bold text-[#153F32] mb-2.5 group-hover:text-[#102D25] transition-colors">
                          {item.title}
                        </h3>

                        <p className="font-editorial-body text-sm text-[#525954] leading-relaxed mb-4">
                          {item.description}
                        </p>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9EF] border border-[#C3A66B]/50 text-xs font-medium text-[#153F32]">
                          <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                          <span>{item.focusArea}</span>
                        </div>
                      </div>
                    ) : (
                      /* Deliverables Card for Even Steps (02, 04) */
                      <div className="scroll-reveal-left pr-6">
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF9EF] border border-[#E8D5B5] shadow-card card-v4-inner-border relative group-hover:border-[#C9A66B] transition-[border-color,box-shadow] duration-300">
                          <CornerBrackets size={14} variant="gold" />
                          
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8D5B5]/70">
                            <span className="font-editorial-meta text-[11px] font-bold text-[#C9A66B] uppercase tracking-wider flex items-center gap-1.5">
                              <GeometricSymbol type="diamond" />
                              <span>Key Deliverables</span>
                            </span>
                            <span className="text-[11px] font-semibold text-[#153F32] flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Partner-Supervised</span>
                            </span>
                          </div>

                          <ul className="space-y-2 text-xs text-[#525954]">
                            {item.keyPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#153F32] shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CENTER SPACER (Cols 6 to 7) */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div 
                      className={`h-[1px] w-full bg-gradient-to-r ${
                        isEven 
                          ? 'from-transparent via-[#C3A66B]/40 to-[#C3A66B]' 
                          : 'from-[#C3A66B] via-[#C3A66B]/40 to-transparent'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* RIGHT COLUMN (Cols 8 to 12) */}
                  <div className="col-span-5">
                    {!isEven ? (
                      /* Deliverables Card for Odd Steps (01, 03) */
                      <div className="scroll-reveal-right pl-6">
                        <div className="p-5 sm:p-6 rounded-2xl bg-[#FFF9EF] border border-[#E8D5B5] shadow-card card-v4-inner-border relative group-hover:border-[#C9A66B] transition-[border-color,box-shadow] duration-300">
                          <CornerBrackets size={14} variant="gold" />
                          
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8D5B5]/70">
                            <span className="font-editorial-meta text-[11px] font-bold text-[#C9A66B] uppercase tracking-wider flex items-center gap-1.5">
                              <GeometricSymbol type="diamond" />
                              <span>Key Deliverables</span>
                            </span>
                            <span className="text-[11px] font-semibold text-[#153F32] flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Partner-Supervised</span>
                            </span>
                          </div>

                          <ul className="space-y-2 text-xs text-[#525954]">
                            {item.keyPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#153F32] shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      /* Strategy Overview for Even Steps (02, 04) */
                      <div className="scroll-reveal-right text-left pl-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] text-xs font-semibold tracking-wider uppercase border border-[#C3A66B]/50 shadow-xs mb-3">
                          <IconComponent className="w-3.5 h-3.5 text-[#7E5E1E]" />
                          <span>{item.badge}</span>
                        </div>

                        <h3 className="font-editorial-h3 text-2xl font-bold text-[#153F32] mb-2.5 group-hover:text-[#102D25] transition-colors">
                          {item.title}
                        </h3>

                        <p className="font-editorial-body text-sm text-[#525954] leading-relaxed mb-4">
                          {item.description}
                        </p>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9EF] border border-[#C3A66B]/50 text-xs font-medium text-[#153F32]">
                          <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                          <span>{item.focusArea}</span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            MOBILE & TABLET TIMELINE (Under lg: screen size)
            Clean vertical timeline with left-hand spine (zero photography)
            ===================================================================== */}
        <div className="lg:hidden relative pl-6 sm:pl-8">
          
          {/* Vertical Connecting Spine */}
          <div 
            className="absolute top-4 bottom-8 left-3 sm:left-4 w-[3px] bg-gradient-to-b from-[#153F32] via-[#C3A66B] to-[#153F32]/50 pointer-events-none z-0 motion-timeline-spine shadow-xs"
            aria-hidden="true"
          />

          <div className="space-y-8 sm:space-y-10">
            {PROCESS_STEPS.map((item) => {
              const IconComponent = item.icon;

              return (
                <div 
                  key={`mobile-${item.step}`}
                  className="relative group scroll-reveal"
                >
                  {/* Step Number Node on Timeline Spine */}
                  <div 
                    className="absolute -left-6 sm:-left-8 top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#153F32] border-2 border-[#D4AF37] text-[#D4AF37] font-serif text-xs font-bold flex items-center justify-center shadow-md z-10"
                  >
                    {item.step}
                  </div>

                  {/* Step Card */}
                  <div className="bg-[#FFF9EF] rounded-2xl p-4 sm:p-6 border border-[#E8D5B5] shadow-card hover:border-[#C3A66B] transition-[border-color,box-shadow] duration-200 relative card-v4-inner-border">
                    <CornerBrackets size={12} variant="gold" />

                    {/* Badge & Focus Area Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7E5E1E] bg-[#E8D5B5] px-2.5 py-0.5 rounded-full border border-[#C3A66B]/50 shadow-xs">
                        <IconComponent className="w-3 h-3 text-[#7E5E1E]" />
                        {item.badge}
                      </span>
                      <span className="text-[11px] font-semibold text-[#153F32] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Partner-Supervised</span>
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="font-editorial-h3 text-xl font-bold text-[#153F32] mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Focus Area Pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8EFDF] border border-[#E8D5B5] text-[11px] font-medium text-[#153F32] mb-3.5">
                      <Sparkles className="w-3 h-3 text-[#C9A66B]" />
                      <span>{item.focusArea}</span>
                    </div>

                    {/* Key Deliverables */}
                    <div className="pt-3 border-t border-[#E8D5B5]/70">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#153F32]/80 block mb-1.5 flex items-center gap-1">
                        <GeometricSymbol type="diamond" />
                        <span>Key Deliverables:</span>
                      </span>
                      <ul className="space-y-1.5 text-xs text-[#525954]">
                        {item.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-[#153F32] shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            BOTTOM CALL-TO-ACTION STRIP
            ===================================================================== */}
        <div className="mt-16 sm:mt-20 text-center scroll-reveal">
          <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#FFF9EF] border border-[#E8D5B5] shadow-card max-w-3xl mx-auto w-full relative card-v4-inner-border">
            <CornerBrackets size={14} variant="gold" />
            <div className="text-left">
              <h4 className="font-editorial-h3 text-base sm:text-lg font-bold text-[#153F32]">
                Ready to begin your statutory journey?
              </h4>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-0.5">
                Schedule a confidential consultation directly with CA Kavitha Vijay.
              </p>
            </div>

            <DualArrowButton
              href={FIRM_DATA.contact.whatsappLink}
              external
              variant="primary"
              className="w-full sm:w-auto text-xs sm:text-sm font-semibold justify-center py-2.5 px-5 shrink-0"
            >
              Start Discovery Consultation
            </DualArrowButton>
          </div>
        </div>

      </div>
    </section>
  );
};
'''

with open('src/components/WorkingProcess.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(new_content)
print("[OK] Replaced WorkingProcess with minimalist architectural timeline")
