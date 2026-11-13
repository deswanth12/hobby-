with open('src/components/AboutSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """            <div className="flex items-center gap-2.5 flex-wrap">
              <EditorialMarker number="01" label="ABOUT THE FIRM" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] motion-safe:animate-pulse" />
              <LetterReveal text="ABOUT US" as="span" className="tracking-widest uppercase font-semibold text-[#153F32]" />
            </div>"""

replacement = """            <div className="flex items-center gap-2.5 flex-wrap">
              <EditorialMarker number="01" label="ABOUT THE FIRM" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] motion-safe:animate-pulse" />
                <LetterReveal text="ABOUT US" as="span" className="tracking-widest uppercase font-semibold text-[#153F32]" />
              </div>
            </div>"""

if target in c:
    c = c.replace(target, replacement)
    with open('src/components/AboutSection.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Fixed closing tag")
else:
    print("Target not found")
