with open('src/components/ServicesSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add PrecisionDotMatrix to Section background
c = c.replace(
    '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">',
    '<PrecisionDotMatrix rows={4} cols={6} variant="gold" className="absolute top-10 right-10 opacity-20 hidden lg:block" />\n      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">'
)

# Add CornerBrackets to Card 1
c = c.replace(
    'className="md:col-span-2 lg:col-span-7 bg-[#FFFDF7] rounded-2xl border border-[#E6C98F] shadow-card overflow-hidden flex flex-col justify-between group hover:border-[#C9A66B] hover:shadow-card-hover transition-all duration-300 scroll-reveal"',
    'className="md:col-span-2 lg:col-span-7 bg-[#FFFDF7] rounded-2xl border border-[#E6C98F] shadow-card overflow-hidden flex flex-col justify-between group hover:border-[#C9A66B] hover:shadow-card-hover transition-all duration-300 scroll-reveal relative">\n            <CornerBrackets size={16} variant="gold" />'
)

# Add CornerBrackets to Card 4
c = c.replace(
    'className="md:col-span-2 lg:col-span-7 bg-[#183D30] text-[#FFFDF7] rounded-2xl border border-[#356B50] shadow-card overflow-hidden flex flex-col justify-between group hover:border-[#C9A66B] hover:shadow-card-hover transition-all duration-300 scroll-reveal"',
    'className="md:col-span-2 lg:col-span-7 bg-[#183D30] text-[#FFFDF7] rounded-2xl border border-[#356B50] shadow-card overflow-hidden flex flex-col justify-between group hover:border-[#C9A66B] hover:shadow-card-hover transition-all duration-300 scroll-reveal relative">\n            <CornerBrackets size={16} variant="gold" />'
)

# Add GeometricSymbol to bullets
c = c.replace(
    '<span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] shrink-0" />',
    '<GeometricSymbol type="diamond" className="shrink-0 mt-0.5" />'
)
c = c.replace(
    '<span className="w-1.5 h-1.5 rounded-full bg-[#E6C98F] shrink-0" />',
    '<GeometricSymbol type="diamond" className="shrink-0 mt-0.5" />'
)

with open('src/components/ServicesSection.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("[OK] Integrated CornerBrackets, PrecisionDotMatrix and GeometricSymbol in ServicesSection.tsx")
