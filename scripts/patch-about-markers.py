with open('src/components/AboutSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace AnimatedDotPattern with PrecisionDotMatrix in left column
c = c.replace(
    '<AnimatedDotPattern rows={3} cols={4} variant="gold" />',
    '<PrecisionDotMatrix rows={4} cols={5} variant="gold" className="opacity-30" />'
)

# Insert EditorialMarker in right column
old_eyebrow = """          <div className="lg:col-span-6 space-y-4 sm:space-y-5 scroll-reveal-right">
            
            {/* Luminous Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">"""

new_eyebrow = """          <div className="lg:col-span-6 space-y-4 sm:space-y-5 scroll-reveal-right">
            
            {/* Numbered Editorial Marker & Eyebrow Badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <EditorialMarker number="01" label="ABOUT THE FIRM" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">"""

c = c.replace(old_eyebrow, new_eyebrow)

with open('src/components/AboutSection.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] Integrated PrecisionDotMatrix and EditorialMarker in AboutSection.tsx")
