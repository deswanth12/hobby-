with open('src/pages/ServicesPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """                      <strong className="block font-editorial-meta text-brand-forest mb-2.5 text-xs">
                        Common Practice Triggers:
                      </strong>"""

replacement = """                      <strong className="flex items-center gap-1.5 font-editorial-meta text-brand-forest mb-2.5 text-xs">
                        <GeometricSymbol type="diamond" />
                        <span>Common Practice Triggers:</span>
                      </strong>"""

c = c.replace(target, replacement)

with open('src/pages/ServicesPage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] Integrated GeometricSymbol into ServicesPage.tsx")
