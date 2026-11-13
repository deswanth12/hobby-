file_path = 'src/pages/HomePage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add architectural imports
import_target = "import { IndustriesSection } from '../components/IndustriesSection';"
import_replacement = """import { IndustriesSection } from '../components/IndustriesSection';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';"""

if import_target in c:
    c = c.replace(import_target, import_replacement)
    print("[OK] Added architectural imports to HomePage.tsx")
else:
    print("[WARN] Import target not found")

# 2. Add EditorialMarker to Hero Eyebrow
hero_eyebrow_old = """            {/* Luminous Architectural Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs mb-3">
              <span className="text-[#D4AF37] font-mono font-bold">//</span>
              <LetterReveal text="ESTABLISHED CHARTERED ACCOUNTANCY PRACTICE • TIRUPATI" as="span" className="tracking-widest uppercase font-semibold text-[#153F32]" />
            </div>"""

hero_eyebrow_new = """            {/* Editorial Marker & Practice Eyebrow Badge */}
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <EditorialMarker number="01" label="INSTITUTIONAL PRACTICE" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">
                <span className="text-[#D4AF37] font-mono font-bold">//</span>
                <LetterReveal text="ESTABLISHED CHARTERED ACCOUNTANCY PRACTICE • TIRUPATI" as="span" className="tracking-widest uppercase font-semibold text-[#153F32]" />
              </div>
            </div>"""

if hero_eyebrow_old in c:
    c = c.replace(hero_eyebrow_old, hero_eyebrow_new)
    print("[OK] Added EditorialMarker to Hero eyebrow")
else:
    print("[WARN] Hero eyebrow target not found")

# 3. Add EditorialMarker to Section 9 Insights Eyebrow
insights_eyebrow_old = """              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EF] border border-[#C3A66B]/50 shadow-xs mb-3">
                <BookOpen className="w-3.5 h-3.5 text-brand-forest" />
                <span className="font-editorial-meta text-xs font-semibold uppercase tracking-wider text-brand-forest">
                  TECHNICAL COMMENTARY
                </span>
              </div>"""

insights_eyebrow_new = """              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <EditorialMarker number="06" label="KNOWLEDGE BANK" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EF] border border-[#C3A66B]/50 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 text-brand-forest" />
                  <span className="font-editorial-meta text-xs font-semibold uppercase tracking-wider text-brand-forest">
                    TECHNICAL COMMENTARY
                  </span>
                </div>
              </div>"""

if insights_eyebrow_old in c:
    c = c.replace(insights_eyebrow_old, insights_eyebrow_new)
    print("[OK] Added EditorialMarker to Insights eyebrow")
else:
    print("[WARN] Insights eyebrow target not found")

# 4. Replace Contact image with Minimalist Chambers Consultation Card
contact_old = """              {/* Consultation Visual Showcase with AI Image */}
              <div className="rounded-2xl overflow-hidden border border-[#E8D5B5] shadow-card bg-[#FFF9EF] p-2.5">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#E8D5B5]">
                  <img
                    src="/images/ai-generated/contact/consultation.webp"
                    alt="Senior chartered accountant in corporate client consultation at Tirupati practice chambers"
                    width="1280"
                    height="720"
                    loading="lazy"
                    className="w-full h-full object-cover object-center image-v4-zoom transition-transform duration-700"
                  />
                  <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded bg-[#153F32]/90 backdrop-blur-sm border border-[#C3A66B]/30 text-white text-[11px] font-medium">
                    Chambers Advisory • In-Person &amp; Remote
                  </div>
                </div>
              </div>"""

contact_new = """              {/* Chambers Intake & Advisory Protocol Card (Minimalist Surface) */}
              <div className="rounded-2xl p-6 border border-[#E8D5B5] shadow-card bg-[#FFF9EF] relative card-v4-inner-border">
                <CornerBrackets size={14} variant="gold" />
                <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#153F32] flex items-center justify-center text-[#D4AF37] shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#C9A66B] uppercase tracking-wider block font-bold">
                      OFFICIAL PRACTICE CHAMBERS
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#153F32]">
                      Chambers Intake &amp; Advisory Protocol
                    </h3>
                  </div>
                </div>

                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed mb-4">
                  All consultations are scheduled directly under senior partner oversight. In-person meetings are hosted at our registered Tirupati chambers, with encrypted virtual consultations available for corporate clients across India.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E8D5B5]/70 text-xs">
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#C9A66B] uppercase tracking-wider block font-bold mb-0.5 flex items-center gap-1">
                      <GeometricSymbol type="diamond" />
                      <span>HOURS</span>
                    </span>
                    <span className="font-semibold text-[#153F32] block">09:30 AM – 07:00 PM</span>
                    <span className="text-[11px] text-[#525954]">Monday – Saturday</span>
                  </div>
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#C9A66B] uppercase tracking-wider block font-bold mb-0.5 flex items-center gap-1">
                      <GeometricSymbol type="diamond" />
                      <span>PRIVACY</span>
                    </span>
                    <span className="font-semibold text-[#153F32] block">100% Confidential</span>
                    <span className="text-[11px] text-[#525954]">Partner Signoff</span>
                  </div>
                </div>
              </div>"""

if contact_old in c:
    c = c.replace(contact_old, contact_new)
    print("[OK] Replaced contact photo with Chambers Protocol Card")
else:
    print("[WARN] Contact old block not found")

with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
