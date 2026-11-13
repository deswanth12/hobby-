with open('src/pages/ContactPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add imports
old_import = "import { AnimatedDotPattern, CurvedPathReveal, LetterReveal, WordReveal, TextHighlight } from '../components/animations';"
new_import = """import { AnimatedDotPattern, CurvedPathReveal, LetterReveal, WordReveal, TextHighlight } from '../components/animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';"""

c = c.replace(old_import, new_import)

# Replace the photo card
old_photo_block = """              {/* Supporting Visual: Consultation Experience */}
              <div className="rounded-2xl overflow-hidden border border-[#E8D5B5] shadow-subtle bg-[#FFF9EF] p-2.5 scroll-reveal">
                <img
                  src="/images/ai-generated/contact/consultation.webp"
                  alt="Professional chartered accountancy corporate consultation session"
                  width="1280"
                  height="720"
                  loading="lazy"
                  className="w-full h-48 sm:h-56 object-cover rounded-xl"
                />
                <div className="pt-2.5 px-1.5 flex items-center justify-between text-xs text-[#525954]">
                  <span className="font-editorial-meta text-[#153F32] font-semibold">Chambers Advisory</span>
                  <span className="font-sans">Kavitha &amp; Associates</span>
                </div>
              </div>"""

new_card_block = """              {/* Minimalist Chambers Advisory & Intake Protocol Surface */}
              <div className="rounded-2xl border border-[#E8D5B5] shadow-card bg-[#FFF9EF] p-6 scroll-reveal relative card-v4-inner-border">
                <CornerBrackets size={14} variant="gold" />
                <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#153F32] flex items-center justify-center text-[#D4AF37] shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#C9A66B] uppercase tracking-wider block font-bold">
                      OFFICIAL PRACTICE ENGAGEMENT
                    </span>
                    <h3 className="font-serif text-base font-bold text-[#153F32]">
                      Chambers Intake Protocol
                    </h3>
                  </div>
                </div>

                <p className="font-editorial-body text-xs text-[#525954] leading-relaxed mb-4">
                  All consultations and statutory inquiries are evaluated directly by senior practice leadership. Consultations are available both in person at our Tirupati chambers and via secure virtual channels across India.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E8D5B5]/70 text-xs">
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#C9A66B] uppercase tracking-wider block font-bold mb-0.5 flex items-center gap-1">
                      <GeometricSymbol type="diamond" />
                      <span>OFFICE HOURS</span>
                    </span>
                    <span className="font-semibold text-[#153F32] block">09:30 AM – 07:00 PM</span>
                    <span className="text-[11px] text-[#525954]">Monday – Saturday</span>
                  </div>
                  <div>
                    <span className="font-editorial-meta text-[10px] text-[#C9A66B] uppercase tracking-wider block font-bold mb-0.5 flex items-center gap-1">
                      <GeometricSymbol type="diamond" />
                      <span>CONFIDENTIALITY</span>
                    </span>
                    <span className="font-semibold text-[#153F32] block">Strict NDAs Honored</span>
                    <span className="text-[11px] text-[#525954]">Partner Supervision</span>
                  </div>
                </div>
              </div>"""

if old_photo_block in c:
    c = c.replace(old_photo_block, new_card_block)
    print("[OK] Replaced contact photo with Minimalist Chambers Protocol Card in ContactPage.tsx")
else:
    print("[WARN] Old photo block not found in ContactPage.tsx")

with open('src/pages/ContactPage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
