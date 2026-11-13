with open('src/pages/ServicesPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add imports
old_import = "import { DualArrowButton, LetterReveal, WordReveal, AnimatedDotPattern } from '../components/animations';"
new_import = """import { DualArrowButton, LetterReveal, WordReveal, AnimatedDotPattern } from '../components/animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from '../components/architectural';"""

c = c.replace(old_import, new_import)

# Add EditorialMarker to Header
old_header_kicker = """            <span className="font-editorial-meta text-gold-dark block mb-3">
              <LetterReveal text="PRACTICE AREAS & DISCIPLINES" as="span" className="tracking-widest uppercase font-semibold text-brand-forest text-xs" />
            </span>"""

new_header_kicker = """            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <EditorialMarker number="02" label="PRACTICE AREAS & DISCIPLINES" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-white border border-brand-border shadow-xs">
                <span className="text-brand-gold font-mono font-bold">//</span>
                <LetterReveal text="FULL PRACTICE SPECTRUM • 100% PARTNER-LED" as="span" className="tracking-widest uppercase font-semibold text-brand-forest text-xs" />
              </div>
            </div>"""

if old_header_kicker in c:
    c = c.replace(old_header_kicker, new_header_kicker)
    print("[OK] Replaced header kicker in ServicesPage.tsx")

# Add CornerBrackets & PrecisionDotMatrix to service categories
old_cat_card = """            <div
              key={category.id}
              id={category.id}
              className="scroll-mt-32 p-5 sm:p-10 lg:p-12 rounded-2xl border border-brand-border bg-brand-white shadow-card card-tactile scroll-reveal"
            >"""

new_cat_card = """            <div
              key={category.id}
              id={category.id}
              className="scroll-mt-32 p-5 sm:p-10 lg:p-12 rounded-2xl border border-brand-border bg-brand-white shadow-card card-tactile scroll-reveal relative card-v4-inner-border"
            >
              <CornerBrackets size={16} variant="gold" />
              <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />"""

if old_cat_card in c:
    c = c.replace(old_cat_card, new_cat_card)
    print("[OK] Added CornerBrackets to categories in ServicesPage.tsx")

# Add CornerBrackets to Audit spotlight banner
old_audit_spotlight = """          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-white p-7 sm:p-9 rounded-2xl border border-brand-border shadow-card card-tactile scroll-reveal">"""
new_audit_spotlight = """          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-white p-7 sm:p-9 rounded-2xl border border-brand-border shadow-card card-tactile scroll-reveal relative card-v4-inner-border">
            <CornerBrackets size={14} variant="gold" />"""

if old_audit_spotlight in c:
    c = c.replace(old_audit_spotlight, new_audit_spotlight)
    print("[OK] Added CornerBrackets to audit spotlight in ServicesPage.tsx")

with open('src/pages/ServicesPage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] Updated ServicesPage.tsx")
