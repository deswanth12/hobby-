with open('src/pages/IndustriesPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """                      <h3 className="font-editorial-h3 text-base font-bold text-brand-forest">
                        Critical Statutory & Tax Foci
                      </h3>"""

replacement = """                      <h3 className="font-editorial-h3 text-base font-bold text-brand-forest flex items-center gap-1.5">
                        <GeometricSymbol type="diamond" />
                        <span>Critical Statutory &amp; Tax Foci</span>
                      </h3>"""

c = c.replace(target, replacement)

with open('src/pages/IndustriesPage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] Integrated GeometricSymbol into IndustriesPage.tsx")
