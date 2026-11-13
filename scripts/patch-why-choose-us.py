import re

file_path = 'src/components/WhyChooseUs.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    c = f.read()

# Add architectural imports
c = c.replace(
    "import { AnimatedDotPattern, LetterReveal, WordReveal, TextHighlight } from './animations';",
    "import { AnimatedDotPattern, LetterReveal, WordReveal, TextHighlight } from './animations';\nimport { CornerBrackets, EditorialMarker, PrecisionDotMatrix, GeometricSymbol } from './architectural';"
)

# Add EditorialMarker to Left Column
old_left_eyebrow = """            {/* Luminous Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">
              <span className="text-[#D4AF37] font-mono font-bold">//</span>
              <LetterReveal text="WHY CHOOSE US" as="span" className="tracking-widest uppercase font-semibold text-[#153F32]" />
            </div>"""

new_left_eyebrow = """            {/* Numbered Editorial Marker & Eyebrow Badge */}
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <EditorialMarker number="03" label="INSTITUTIONAL MERIT" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">
                <span className="text-[#D4AF37] font-mono font-bold">//</span>
                <LetterReveal text="WHY CHOOSE US" as="span" className="tracking-widest uppercase font-semibold text-[#153F32]" />
              </div>
            </div>"""

c = c.replace(old_left_eyebrow, new_left_eyebrow)

# Replace the entire Right Column (lines 177-240 that contain the two images) with typography-led geometric architectural composition
old_right_col_content = """              {/* Composition Stack */}
              <div className="relative z-10 space-y-3 sm:space-y-4">
                
                {/* 1. Primary Arched Consultation Photo (CARVI Silhouette) */}
                <div className="rounded-t-[56px] sm:rounded-t-[72px] lg:rounded-t-[88px] rounded-br-2xl rounded-bl-2xl overflow-hidden border border-[#E8D5B5] shadow-card bg-[#FFF9EF] group card-v4-inner-border">
                  <img
                    src="/images/ai-generated/why-choose-us/consultation.webp"
                    alt="Chartered accountant in executive business advisory consultation"
                    width="1280"
                    height="720"
                    loading="lazy"
                    className="w-full h-64 sm:h-72 lg:h-80 object-cover object-center image-v4-zoom transition-transform duration-700"
                  />
                </div>

                {/* 2. Lower Dual-Cluster: Companion Analysis Photo + Partner Attention Card */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-stretch">
                  
                  {/* Companion Analysis / Review Photo */}
                  <div className="sm:col-span-5 rounded-2xl overflow-hidden border border-[#E8D5B5] shadow-subtle bg-[#FFF9EF] group min-h-[120px] card-v4-inner-border relative">
                    {/* Subtle corner brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C3A66B]/50 rounded-tl-sm pointer-events-none z-10" aria-hidden="true" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C3A66B]/50 rounded-br-sm pointer-events-none z-10" aria-hidden="true" />
                    <img
                      src="/images/ai-generated/why-choose-us/analysis.webp"
                      alt="Financial scrutiny and working papers review"
                      width="1200"
                      height="800"
                      loading="lazy"
                      className="w-full h-32 sm:h-full object-cover object-center image-v4-zoom transition-transform duration-700"
                    />
                  </div>

                  {/* Partner Supervision Credential Plaque */}
                  <div className="sm:col-span-7 p-3.5 sm:p-4 rounded-2xl bg-[#FFF9EF] border border-[#E8D5B5] shadow-card card-v4-luxury card-v4-inner-border flex flex-col justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#153F32] flex items-center justify-center shrink-0 text-[#D4AF37] shadow-xs mt-0.5">
                        <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <span className="font-editorial-meta text-[10px] text-[#7E5E1E] uppercase tracking-wider block font-semibold">
                          Direct Partner Attention
                        </span>
                        <p className="font-serif text-xs sm:text-sm font-bold text-[#153F32] leading-tight mt-0.5">
                          CA Kavitha Vijay
                        </p>
                        <p className="font-editorial-body text-[11px] text-[#525954] mt-0.5">
                          B.Com, CA, CMA (AIR 49)
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#E8D5B5] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[#153F32]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#153F32]" />
                        <span className="text-[11px] font-semibold text-[#153F32]">100% Partner-Led</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta text-[10px] font-semibold border border-[#153F32]/15">
                        Pan-India
                      </span>
                    </div>
                  </div>

                </div>

              </div>"""

new_right_col_content = """              {/* Typography-Led Architectural Composition (Photos Replaced with Minimalist Value Matrix) */}
              <div className="relative z-10 space-y-4">
                
                {/* 1. Primary Architectural Value Propositions Card */}
                <div className="rounded-3xl p-6 sm:p-8 border border-[#E8D5B5] shadow-card bg-[#FFF9EF] card-v4-inner-border relative">
                  <CornerBrackets size={16} variant="gold" />
                  <PrecisionDotMatrix rows={3} cols={4} variant="gold" className="absolute top-4 right-4 opacity-25 hidden sm:block" />

                  <div className="mb-6">
                    <span className="font-editorial-meta text-[11px] font-bold text-[#C9A66B] uppercase tracking-wider block mb-1">
                      INSTITUTIONAL PILLARS
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#153F32]">
                      Why Enterprises Partner With Our Chambers
                    </h3>
                  </div>

                  {/* Three Concise Value Propositions */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5 pb-3.5 border-b border-[#E8D5B5]/70">
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-[#153F32] text-[#D4AF37] shrink-0 mt-0.5">
                        01
                      </span>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#153F32] flex items-center gap-1.5">
                          <span>Big 4 &amp; Multinational Standard</span>
                          <GeometricSymbol type="diamond" />
                        </h4>
                        <p className="font-editorial-body text-xs text-[#525954] mt-0.5 leading-relaxed">
                          Progressive audit senior tenure at Deloitte Haskins &amp; Sells and Fortune 50 multinational internal audit at Ford Motor Company.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 pb-3.5 border-b border-[#E8D5B5]/70">
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-[#153F32] text-[#D4AF37] shrink-0 mt-0.5">
                        02
                      </span>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#153F32] flex items-center gap-1.5">
                          <span>Dual Statutory CA + CMA Advantage</span>
                          <GeometricSymbol type="diamond" />
                        </h4>
                        <p className="font-editorial-body text-xs text-[#525954] mt-0.5 leading-relaxed">
                          Rare dual credentialing integrating statutory compliance assurance with All India Rank 49 cost accounting and working capital modeling.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-[#153F32] text-[#D4AF37] shrink-0 mt-0.5">
                        03
                      </span>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#153F32] flex items-center gap-1.5">
                          <span>100% Direct Partner Accountability</span>
                          <GeometricSymbol type="diamond" />
                        </h4>
                        <p className="font-editorial-body text-xs text-[#525954] mt-0.5 leading-relaxed">
                          Every tax return, balance sheet verification, and statutory disclosure is examined and signed directly under senior partner supervision.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Partner Supervision Credential Plaque */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9EF] border border-[#E8D5B5] shadow-card card-v4-luxury card-v4-inner-border flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#153F32] flex items-center justify-center shrink-0 text-[#D4AF37] shadow-xs">
                        <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <span className="font-editorial-meta text-[10px] text-[#7E5E1E] uppercase tracking-wider block font-semibold">
                          Direct Partner Attention
                        </span>
                        <p className="font-serif text-sm sm:text-base font-bold text-[#153F32] leading-tight">
                          CA Kavitha Vijay
                        </p>
                        <p className="font-editorial-body text-xs text-[#525954] mt-0.5">
                          B.Com, CA, CMA (AIR 49)
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta text-[10px] font-semibold border border-[#153F32]/15 block mb-1">
                        Pan-India Reach
                      </span>
                      <span className="text-[11px] font-semibold text-[#153F32] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#153F32]" />
                        <span>100% Partner-Led</span>
                      </span>
                    </div>
                  </div>
                </div>

              </div>"""

if old_right_col_content in c:
    c = c.replace(old_right_col_content, new_right_col_content)
    print("[OK] Replaced WhyChooseUs photos with typography-led value matrix")
else:
    print("[ERROR] Could not find right col content in WhyChooseUs.tsx")

with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
