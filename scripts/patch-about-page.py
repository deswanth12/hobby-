with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add imports
old_import = "import { StatCounter } from '../components/animations';"
new_import = """import { StatCounter } from '../components/animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';"""

c = c.replace(old_import, new_import)

# Replace portrait block
old_portrait_block = """                {/* Editorial Portrait Presentation Frame (Cream and Forest-Green Framing) */}
                <div className="relative rounded-2xl overflow-hidden bg-[#153F32] border border-[#C3A66B]/50 p-2 sm:p-2.5 shadow-card group">
                  {/* Subtle Architectural Corner Accents in Gold */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C3A66B] rounded-tl-sm pointer-events-none z-10" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C3A66B] rounded-br-sm pointer-events-none z-10" aria-hidden="true" />

                  {/* Inner Portrait Container */}
                  <div className="relative rounded-xl overflow-hidden aspect-square w-full bg-[#102D25] border border-[#C3A66B]/30">
                    <img
                      src="/images/partner/ca-kavitha-vijay.webp"
                      alt="CA Kavitha Vijay, Managing Partner & Practicing Chartered Accountant at Kavitha & Associates"
                      width="400"
                      height="400"
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    {/* Subtle grounded gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#153F32]/85 via-[#153F32]/20 to-transparent pointer-events-none" />

                    {/* Grounded Plaque Labels */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                      <span className="font-editorial-meta font-semibold uppercase tracking-wider text-[#D4AF37] px-2.5 py-1 rounded-md bg-[#153F32]/90 backdrop-blur-sm border border-[#C3A66B]/40 shadow-xs">
                        Managing Partner
                      </span>
                      <span className="font-mono text-[10px] text-white/90 bg-[#102D25]/90 px-2 py-1 rounded-md border border-[#C3A66B]/30 shadow-xs">
                        10+ Years Practice
                      </span>
                    </div>
                  </div>
                </div>"""

new_portrait_block = """                {/* Authoritative Partner Credential Seal Frame (Portrait Held Unpublished Until Client Consent) */}
                <div className="relative rounded-2xl overflow-hidden bg-[#153F32] border border-[#C3A66B]/50 p-6 sm:p-8 shadow-card group text-center card-v4-inner-border">
                  <CornerBrackets size={16} variant="gold" />
                  <PrecisionDotMatrix rows={3} cols={4} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />

                  <div className="relative z-10 space-y-4">
                    {/* Credential Medallion */}
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-[#102D25] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-card group-hover:scale-105 transition-transform duration-300">
                      <ShieldCheck className="w-10 h-10 text-[#D4AF37]" />
                    </div>

                    <div>
                      <span className="font-editorial-meta text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
                        INSTITUTIONAL LEADERSHIP
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                        {partner.name}
                      </h3>
                      <p className="font-editorial-meta text-xs text-[#E8D5B5] mt-1 font-semibold">
                        {partner.qualifications} (AIR 49)
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#C3A66B]/30 flex items-center justify-between text-xs text-[#E8D5B5]">
                      <span className="font-editorial-meta font-semibold uppercase tracking-wider text-[#D4AF37] px-2.5 py-1 rounded-md bg-[#102D25] border border-[#C3A66B]/40">
                        Managing Partner
                      </span>
                      <span className="font-mono text-[11px] text-white/90 bg-[#102D25] px-2.5 py-1 rounded-md border border-[#C3A66B]/30">
                        10+ Years Experience
                      </span>
                    </div>
                  </div>
                </div>"""

if old_portrait_block in c:
    c = c.replace(old_portrait_block, new_portrait_block)
    print("[OK] Replaced portrait with Partner Credential Seal in AboutPage.tsx")
else:
    print("[WARN] Portrait old block not found in AboutPage.tsx")

# Replace leadership-space image block
old_space_block = """              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-[#E8D5B5] shadow-xs bg-[#FFF9EF] p-2">
                  <img
                    src="/images/ai-generated/about/leadership-space.webp"
                    alt="Executive corporate leadership and remote client consultation environment"
                    width="1280"
                    height="720"
                    loading="eager"
                    className="w-full h-48 sm:h-56 object-cover object-center rounded-xl"
                  />
                  <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-[#525954]">
                    <span>Remote &amp; In-Person Engagements</span>
                    <span className="font-semibold text-[#153F32]">Serving Clients Across India</span>
                  </div>
                </div>
              </div>"""

new_space_block = """              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-[#E8D5B5] shadow-card bg-[#FFF9EF] p-6 relative card-v4-inner-border">
                  <CornerBrackets size={14} variant="gold" />
                  <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-3 right-3 opacity-20 hidden sm:block" />

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#153F32] flex items-center justify-center text-[#D4AF37] shadow-xs shrink-0">
                      <Globe className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="font-editorial-meta text-[10px] text-[#C9A66B] uppercase tracking-wider block font-bold">
                        SECURE DIGITAL INFRASTRUCTURE
                      </span>
                      <h4 className="font-serif text-base font-bold text-[#153F32]">
                        Pan-India Compliance Pipeline
                      </h4>
                    </div>
                  </div>

                  <p className="font-editorial-body text-xs text-[#525954] leading-relaxed mb-4">
                    Enterprise-grade encrypted client portals, structured digital working papers, and scheduled virtual audit hearings ensure immediate statutory responsiveness for corporate entities across India.
                  </p>

                  <div className="pt-3 border-t border-[#E8D5B5]/70 flex items-center justify-between text-xs text-[#153F32]">
                    <span className="font-medium">Encrypted Remote Intake</span>
                    <span className="font-semibold px-2 py-0.5 rounded bg-[#DDE8D9] border border-[#153F32]/15 text-[11px]">All 28 States</span>
                  </div>
                </div>
              </div>"""

if old_space_block in c:
    c = c.replace(old_space_block, new_space_block)
    print("[OK] Replaced leadership-space image with digital compliance pipeline card in AboutPage.tsx")
else:
    print("[WARN] Old space block not found in AboutPage.tsx")

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
