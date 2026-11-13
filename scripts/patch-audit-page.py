with open('src/pages/AuditAssurancePage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add imports
old_import = "import { AnimatedDotPattern, LetterReveal, WordReveal, TextHighlight } from '../components/animations';"
new_import = """import { AnimatedDotPattern, LetterReveal, WordReveal, TextHighlight } from '../components/animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';"""

c = c.replace(old_import, new_import)

# Header kicker
old_kicker = """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/30 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#153F32] shrink-0" />
              <LetterReveal text="Dedicated Audit Practice • Tirupati Chambers" as="span" />
            </div>"""

new_kicker = """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="01" label="AUDIT & ASSURANCE" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/30 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-[#153F32] shrink-0" />
                <LetterReveal text="Dedicated Audit Practice • Tirupati Chambers" as="span" />
              </div>
            </div>"""

if old_kicker in c:
    c = c.replace(old_kicker, new_kicker)
    print("[OK] Replaced header kicker in AuditAssurancePage.tsx")

# Add CornerBrackets to the 4 phase cards
old_phase_card = """            <div className="bg-brand-white p-7 rounded-2xl border border-brand-border shadow-card card-tactile flex flex-col justify-between scroll-reveal">"""
new_phase_card = """            <div className="bg-brand-white p-7 rounded-2xl border border-brand-border shadow-card card-tactile flex flex-col justify-between scroll-reveal relative card-v4-inner-border">
              <CornerBrackets size={12} variant="gold" />"""

c = c.replace(old_phase_card, new_phase_card)
print("[OK] Replaced phase cards with CornerBrackets in AuditAssurancePage.tsx")

# Add CornerBrackets & PrecisionDotMatrix to Flagship Audit Card
old_flagship = """                    <div 
                      className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 text-[#252B27] border-2 border-[#E8D5B5] shadow-editorial-lg"
                    >"""

new_flagship = """                    <div 
                      className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 text-[#252B27] border-2 border-[#E8D5B5] shadow-editorial-lg relative card-v4-inner-border"
                    >
                      <CornerBrackets size={16} variant="gold" />
                      <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />"""

if old_flagship in c:
    c = c.replace(old_flagship, new_flagship)
    print("[OK] Added CornerBrackets to flagship audit card")

# Integrate GeometricSymbol
old_geo_target = """            <span className="inline-block px-3 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold mb-3">
              Statutory Scope & Assurance Streams
            </span>"""

new_geo_target = """            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D5B5] text-[#7E5E1E] font-editorial-meta text-xs font-semibold mb-3">
              <GeometricSymbol type="diamond" />
              <span>Statutory Scope &amp; Assurance Streams</span>
            </span>"""

if old_geo_target in c:
    c = c.replace(old_geo_target, new_geo_target)
    print("[OK] Integrated GeometricSymbol in AuditAssurancePage.tsx")

with open('src/pages/AuditAssurancePage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] Updated AuditAssurancePage.tsx")
