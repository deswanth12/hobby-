import re

file_path = 'src/components/AboutSection.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace import to include architectural primitives
old_import = "import { RotatingGeometricMesh, FloatingGeometricShapes, AnimatedDotPattern, CurvedPathReveal, LetterReveal, WordReveal, TextHighlight } from './animations';"
new_import = "import { RotatingGeometricMesh, FloatingGeometricShapes, AnimatedDotPattern, CurvedPathReveal, LetterReveal, WordReveal, TextHighlight } from './animations';\nimport { CornerBrackets, PrecisionDotMatrix, EditorialMarker } from './architectural';"

if old_import in content:
    content = content.replace(old_import, new_import)

# Replace the 3-image collage and floating card with the 1-image architectural composition
old_left_col_start = '              {/* Inner 3-Image Collage Stack */}'
old_left_col_end = '              </div>\n\n            </div>\n          </div>'

new_left_col = """              {/* Single Dominant Professional Consultation Photograph */}
              <div className="relative z-10">
                <div className="rounded-2xl overflow-hidden shadow-card border border-[#E8D5B5] group bg-[#FFF9EF] card-v4-inner-border relative">
                  <CornerBrackets size={16} strokeWidth={1.5} variant="gold" />
                  <img
                    src="/images/ai-generated/about/consultation-main.webp"
                    alt="Senior corporate chartered accountant in strategic consultation with enterprise client"
                    width="1376"
                    height="768"
                    loading="lazy"
                    className="w-full h-72 sm:h-80 lg:h-96 object-cover object-center image-v4-zoom transition-transform duration-700"
                  />
                  {/* Subtle architectural vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#153F32]/60 via-transparent to-transparent pointer-events-none" />

                  {/* Grounded Chambers Practice Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#153F32]/90 backdrop-blur-sm border border-[#C3A66B]/40 text-white flex items-center gap-2 text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] motion-safe:animate-pulse" />
                    <span>Estd. Tirupati Chambers • Pan-India Reach</span>
                  </div>
                </div>
              </div>

              {/* Floating Partner Credential Plaque (Pre-Release Editorial Seal) */}
              <div className="absolute -bottom-4 right-2 sm:-bottom-5 sm:right-6 z-20 bg-[#153F32] rounded-2xl p-3.5 sm:p-4 text-white border border-[#C3A66B]/50 shadow-2xl backdrop-blur-md max-w-[290px] sm:max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#0D2820] border-2 border-[#C3A66B] flex items-center justify-center text-[#D4AF37] shadow-md shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-editorial-meta text-[10px] sm:text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider truncate">
                        ICAI Practice Lead
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0D2820] text-[#D4AF37] border border-[#C3A66B]/30 shrink-0">
                        AIR 49
                      </span>
                    </div>
                    <p className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-tight truncate">
                      {FIRM_DATA.partner.name}
                    </p>
                    <p className="font-editorial-body text-[10px] sm:text-[11px] text-[#A3B899] mt-0.5 truncate">
                      {FIRM_DATA.partner.qualifications} • 10+ Years Experience
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#1F5443] flex items-center justify-between text-[10px] text-[#DDE8D9]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                    <span>100% Partner-Led</span>
                  </span>
                  <span className="font-editorial-meta uppercase tracking-wider text-[#D4AF37]">
                    Pan-India
                  </span>
                </div>
              </div>

            </div>
          </div>"""

# Replace in content
pattern = r'\{\/\* Inner 3-Image Collage Stack \*\/\}[\s\S]*?\{\/\* Floating Partner Credential Card[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>'
match = re.search(pattern, content)
if match:
    content = content[:match.start()] + new_left_col + content[match.end():]
    print("[OK] Replaced left column with single dominant photograph and restrained partner seal")
else:
    print("[WARN] Regex match failed, trying direct substring")

# Add EditorialMarker in Right Column header if not present
old_eyebrow = """          <div className="lg:col-span-6 scroll-reveal-right">
            
            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs mb-3">"""

new_eyebrow = """          <div className="lg:col-span-6 scroll-reveal-right">
            
            {/* Numbered Editorial Marker */}
            <div className="flex items-center gap-2.5 mb-3">
              <EditorialMarker number="01" label="ABOUT THE FIRM" />
            </div>

            {/* Editorial Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs mb-3">"""

if old_eyebrow in content:
    content = content.replace(old_eyebrow, new_eyebrow)
    print("[OK] Added EditorialMarker to AboutSection right column")

with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("[DONE] Updated AboutSection.tsx")
