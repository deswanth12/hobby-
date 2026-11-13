import re

# 1. Update src/components/WorkingProcess.tsx
with open('src/components/WorkingProcess.tsx', 'r', encoding='utf-8') as f:
    wp = f.read()

# Add AnimatedDotPattern import
if "AnimatedDotPattern" not in wp:
    wp = wp.replace(
        "import { DualArrowButton } from './animations/DualArrowButton';",
        "import { DualArrowButton } from './animations/DualArrowButton';\nimport { AnimatedDotPattern } from './animations';"
    )

# Replace blur-3xl slop with subtle radial gradient
wp = wp.replace(
    'className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"',
    'className="absolute top-0 right-0 w-96 h-96 bg-radial from-brand-gold/10 to-transparent rounded-full pointer-events-none -mr-20 -mt-20"'
)
wp = wp.replace(
    'className="absolute bottom-0 left-0 w-96 h-96 bg-brand-forest/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"',
    'className="absolute bottom-0 left-0 w-96 h-96 bg-radial from-brand-forest/10 to-transparent rounded-full pointer-events-none -ml-20 -mb-20"'
)

# Add AnimatedDotPattern in section header
if "AnimatedDotPattern rows={4}" not in wp:
    wp = wp.replace(
        '<div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-24 scroll-reveal">',
        '''<div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-24 scroll-reveal relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none -z-0 opacity-40 hidden md:block">
            <AnimatedDotPattern rows={3} cols={8} variant="gold" staggerMode="wave" />
          </div>'''
    )

# Add motion-timeline-spine to desktop central spine
wp = wp.replace(
    'className="absolute left-1/2 top-8 bottom-16 -translate-x-1/2 w-[2px] bg-gradient-to-b from-brand-forest/20 via-brand-gold to-brand-forest/20 pointer-events-none z-0"',
    'className="absolute left-1/2 top-8 bottom-16 -translate-x-1/2 w-[2px] bg-gradient-to-b from-brand-forest/20 via-brand-gold to-brand-forest/20 pointer-events-none z-0 motion-timeline-spine"'
)

# Add motion-timeline-spine to mobile vertical spine
wp = wp.replace(
    'className="absolute top-4 bottom-8 left-3 sm:left-4 w-[2px] bg-gradient-to-b from-brand-forest via-brand-gold to-brand-forest/30 pointer-events-none z-0"',
    'className="absolute top-4 bottom-8 left-3 sm:left-4 w-[2px] bg-gradient-to-b from-brand-forest via-brand-gold to-brand-forest/30 pointer-events-none z-0 motion-timeline-spine"'
)

with open('src/components/WorkingProcess.tsx', 'w', encoding='utf-8') as f:
    f.write(wp)
print("SUCCESS: Updated WorkingProcess.tsx")

# 2. Update src/pages/HomePage.tsx
with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    home = f.read()

# Add useMouseParallax and CurvedPathReveal
if "useMouseParallax" not in home:
    home = home.replace(
        "import { DualArrowButton, SectorMarquee, AccentTicker, AnimatedDotPattern, RotatingGeometricMesh, FloatingGeometricShapes } from '../components/animations';",
        "import { DualArrowButton, SectorMarquee, AccentTicker, AnimatedDotPattern, RotatingGeometricMesh, FloatingGeometricShapes, CurvedPathReveal } from '../components/animations';\nimport { useMouseParallax } from '../hooks/useMouseParallax';"
    )
    home = home.replace(
        "const { data: FIRM_DATA } = useFirmData();",
        "const { data: FIRM_DATA } = useFirmData();\n  const { getStyle: getParallaxStyle } = useMouseParallax(10);"
    )

# Add motion-float-hero to hero plaque
home = home.replace(
    'className="animate-fade-up rounded-2xl p-1 bg-gradient-to-br from-[#EDE2CF] to-[#FFF1D9] shadow-editorial-lg overflow-hidden"',
    'className="animate-fade-up motion-float-hero rounded-2xl p-1 bg-gradient-to-br from-[#EDE2CF] to-[#FFF1D9] shadow-editorial-lg overflow-hidden"'
)

# Add CurvedPathReveal wave in hero background if not present
if 'CurvedPathReveal variant="wave"' not in home:
    home = home.replace(
        '{/* Subtle Decorative Animated Dot Pattern in Top-Left */}',
        '''{/* Subtle Curved Path Wave in Hero Backdrop */}
        <div className="absolute -bottom-8 left-1/4 pointer-events-none -z-0 opacity-25 hidden lg:block">
          <CurvedPathReveal variant="wave" width={380} height={100} />
        </div>
        {/* Subtle Decorative Animated Dot Pattern in Top-Left */}'''
    )

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(home)
print("SUCCESS: Updated HomePage.tsx")

# 3. Update src/components/AboutSection.tsx and src/pages/AboutPage.tsx for wave stagger and value card hover
for path in ['src/components/AboutSection.tsx', 'src/pages/AboutPage.tsx']:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('variant="mixed"', 'variant="mixed" staggerMode="wave"')
    content = content.replace(
        'className="p-2.5 sm:p-3 rounded-xl bg-[#FFFFFF] border border-[#EDE2CF] shadow-subtle flex items-center gap-2"',
        'className="p-2.5 sm:p-3 rounded-xl bg-[#FFFFFF] border border-[#EDE2CF] shadow-subtle flex items-center gap-2 motion-card-lift cursor-pointer hover:border-[#C9A66B]"'
    )
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"SUCCESS: Updated {path}")

# 4. Update src/components/WhyChooseUs.tsx for icon and arrow micro-interactions
with open('src/components/WhyChooseUs.tsx', 'r', encoding='utf-8') as f:
    why = f.read()

# Add motion-pulse-ring to decorative top-right arc
why = why.replace(
    'className="absolute -top-6 -right-6 w-36 h-36 rounded-full border-4 border-[#C9A66B]/30 pointer-events-none hidden sm:block"',
    'className="absolute -top-6 -right-6 w-36 h-36 rounded-full border-4 border-[#C9A66B]/30 pointer-events-none hidden sm:block motion-pulse-ring"'
)

# Add motion-card-lift to WhyChooseUs cards
why = why.replace('motion-card-hover', 'motion-card-lift')

# Add motion-icon-hover to icon circle
why = why.replace(
    'className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#EAF3E9] text-[#356B50] flex items-center justify-center shrink-0 border border-[#356B50]/20 group-hover:bg-[#356B50] group-hover:text-white transition-colors duration-300"',
    'className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#EAF3E9] text-[#356B50] flex items-center justify-center shrink-0 border border-[#356B50]/20 group-hover:bg-[#356B50] group-hover:text-white transition-colors duration-300 motion-icon-hover"'
)

# Add motion-arrow-hover to arrow pill
why = why.replace(
    'className="w-4 h-4 text-[#C9A66B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"',
    'className="w-4 h-4 text-[#C9A66B] motion-arrow-hover"'
)

with open('src/components/WhyChooseUs.tsx', 'w', encoding='utf-8') as f:
    f.write(why)
print("SUCCESS: Updated WhyChooseUs.tsx")
