with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """              {/* Institutional Practice Kicker */}
              <div className="hero-entrance-fade hero-delay-1 inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-surface border border-brand-border/80 shadow-xs">"""

replacement = """              {/* Institutional Practice Kicker & Editorial Marker */}
              <div className="hero-entrance-fade hero-delay-1 flex items-center gap-2.5 flex-wrap">
                <EditorialMarker number="01" label="INSTITUTIONAL PRACTICE" />
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand-surface border border-brand-border/80 shadow-xs">"""

if target in c:
    c = c.replace(target, replacement)
    print("[OK] Added EditorialMarker to Hero kicker")
else:
    print("[WARN] Target not found")

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
