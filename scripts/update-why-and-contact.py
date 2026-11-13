# Update WhyChooseUs.tsx
with open('src/components/WhyChooseUs.tsx', 'r', encoding='utf-8') as f:
    why = f.read()

# Make sure imports are clean
if "AnimatedDotPattern" not in why:
    why = why.replace(
        "import {\n  ShieldCheck,",
        "import { AnimatedDotPattern } from './animations';\nimport {\n  ShieldCheck,"
    )

# Add motion-path-reveal-loop to circle strokes
why = why.replace('opacity="0.8" />', 'opacity="0.8" className="motion-path-reveal-loop" />')
why = why.replace('opacity="0.6" />', 'opacity="0.6" className="motion-path-reveal-loop" />')
why = why.replace('opacity="0.75" />', 'opacity="0.75" className="motion-path-reveal-loop" />')
why = why.replace('opacity="0.5" />', 'opacity="0.5" className="motion-path-reveal-loop" />')

if "AnimatedDotPattern rows={4}" not in why:
    why = why.replace(
        '</svg>\n\n      <div className="max-w-7xl mx-auto',
        '</svg>\n\n      {/* Reusable Animated Dot Pattern in Top-Right */}\n      <div className="absolute top-6 right-8 pointer-events-none -z-0 opacity-50 hidden lg:block">\n        <AnimatedDotPattern rows={4} cols={6} variant="gold" />\n      </div>\n\n      <div className="max-w-7xl mx-auto'
    )

# Add motion-card-hover to WhyChooseUs cards
why = why.replace(
    'hover:border-[#C9A66B] hover:shadow-card transition-all duration-300',
    'motion-card-hover'
)

with open('src/components/WhyChooseUs.tsx', 'w', encoding='utf-8') as f:
    f.write(why)
print("SUCCESS: Updated src/components/WhyChooseUs.tsx")

# Update ContactPage.tsx
with open('src/pages/ContactPage.tsx', 'r', encoding='utf-8') as f:
    contact = f.read()

if "AnimatedDotPattern" not in contact:
    contact = contact.replace(
        "import { SEOHead } from '../components/SEOHead';",
        "import { SEOHead } from '../components/SEOHead';\nimport { AnimatedDotPattern, CurvedPathReveal } from '../components/animations';"
    )

old_sec = '<section className="py-12 sm:py-16 md:py-20 lg:py-24">'
new_sec = '''<section className="py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        {/* Subtle Decorative Animated Dot Pattern in Top Right */}
        <div className="absolute top-8 right-10 pointer-events-none -z-0 opacity-40 hidden lg:block">
          <AnimatedDotPattern rows={4} cols={6} variant="gold" />
        </div>
        {/* Curved Path Accent in Bottom Left */}
        <div className="absolute -bottom-10 -left-10 pointer-events-none -z-0 opacity-25 hidden md:block">
          <CurvedPathReveal variant="corner" width={220} height={220} />
        </div>'''

if old_sec in contact:
    contact = contact.replace(old_sec, new_sec)
    with open('src/pages/ContactPage.tsx', 'w', encoding='utf-8') as f:
        f.write(contact)
    print("SUCCESS: Updated src/pages/ContactPage.tsx")
else:
    print("WARNING: Could not find old_sec in ContactPage.tsx")
