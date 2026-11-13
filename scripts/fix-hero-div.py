with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """                <LetterReveal
                  text="INDEPENDENT CHARTERED ACCOUNTANCY PRACTICE • TIRUPATI"
                  as="span"
                  className="text-[11px] sm:text-xs font-semibold text-brand-forest tracking-wide"
                />
              </div>"""

replacement = """                <LetterReveal
                  text="INDEPENDENT CHARTERED ACCOUNTANCY PRACTICE • TIRUPATI"
                  as="span"
                  className="text-[11px] sm:text-xs font-semibold text-brand-forest tracking-wide"
                />
                </div>
              </div>"""

c = c.replace(target, replacement)

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
print("[OK] Closed outer div")
