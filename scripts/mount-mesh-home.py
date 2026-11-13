with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = '<div className="lg:col-span-5 scroll-reveal-right">'
replacement = '''<div className="lg:col-span-5 scroll-reveal-right relative">
              {/* Subtle Rotating Geometric Mesh behind Plaque */}
              <div className="absolute -top-12 -right-10 pointer-events-none -z-0 opacity-40 hidden sm:block">
                <RotatingGeometricMesh size={240} />
              </div>'''

if target in c:
    c = c.replace(target, replacement, 1)
    with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("SUCCESS")
else:
    print("TARGET NOT FOUND")
