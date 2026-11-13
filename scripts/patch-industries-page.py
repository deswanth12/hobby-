with open('src/pages/IndustriesPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add imports
old_import = "import { LetterReveal, WordReveal } from '../components/animations';"
new_import = """import { LetterReveal, WordReveal } from '../components/animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';"""

c = c.replace(old_import, new_import)

# Header kicker
old_kicker = """            <span className="font-editorial-meta text-gold-dark block mb-3">
              <LetterReveal text="Commercial Verticals • Specialized Statutory Frameworks" as="span" />
            </span>"""

new_kicker = """            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <EditorialMarker number="05" label="COMMERCIAL VERTICALS" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-white border border-brand-border shadow-xs">
                <span className="text-brand-gold font-mono font-bold">//</span>
                <LetterReveal text="SPECIALIZED STATUTORY FRAMEWORKS • 10 COMMERCIAL DOMAINS" as="span" className="tracking-widest uppercase font-semibold text-brand-forest text-xs" />
              </div>
            </div>"""

if old_kicker in c:
    c = c.replace(old_kicker, new_kicker)
    print("[OK] Replaced header kicker in IndustriesPage.tsx")

# Add CornerBrackets & PrecisionDotMatrix to sector profile cards
old_sector_card = """              <div
                key={ind.id}
                id={ind.id}
                className="scroll-mt-32 p-5 sm:p-10 lg:p-12 rounded-2xl border border-brand-border bg-brand-white shadow-card card-tactile scroll-reveal"
              >"""

new_sector_card = """              <div
                key={ind.id}
                id={ind.id}
                className="scroll-mt-32 p-5 sm:p-10 lg:p-12 rounded-2xl border border-brand-border bg-brand-white shadow-card card-tactile scroll-reveal relative card-v4-inner-border"
              >
                <CornerBrackets size={16} variant="gold" />
                <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />"""

if old_sector_card in c:
    c = c.replace(old_sector_card, new_sector_card)
    print("[OK] Added CornerBrackets to sector cards in IndustriesPage.tsx")

# Add GeometricSymbol to statutory focus title
old_focus_title = """                      <strong className="block font-editorial-meta text-brand-forest mb-3 text-xs">
                        Key Statutory Foci:
                      </strong>"""

new_focus_title = """                      <strong className="flex items-center gap-1.5 font-editorial-meta text-brand-forest mb-3 text-xs">
                        <GeometricSymbol type="diamond" />
                        <span>Key Statutory Foci:</span>
                      </strong>"""

if old_focus_title in c:
    c = c.replace(old_focus_title, new_focus_title)
    print("[OK] Integrated GeometricSymbol into IndustriesPage.tsx")

with open('src/pages/IndustriesPage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] Updated IndustriesPage.tsx")
