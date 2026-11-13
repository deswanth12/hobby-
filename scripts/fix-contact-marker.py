with open('src/pages/ContactPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#C3A66B] motion-safe:animate-pulse" />
                  <LetterReveal text="LET'S CONNECT" as="span" className="tracking-widest uppercase font-semibold" />
                </div>"""

replacement = """                <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                  <EditorialMarker number="07" label="PRACTICE CONTACT" />
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF9EF] text-[#153F32] font-editorial-meta text-xs border border-[#C3A66B]/60 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#C3A66B] motion-safe:animate-pulse" />
                    <LetterReveal text="LET'S CONNECT" as="span" className="tracking-widest uppercase font-semibold" />
                  </div>
                </div>"""

c = c.replace(target, replacement)

with open('src/pages/ContactPage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
print("[OK] Integrated EditorialMarker into ContactPage.tsx")
