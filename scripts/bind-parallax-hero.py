with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''        {/* Subtle Decorative Animated Dot Pattern in Top-Left */}
        <div className="absolute top-4 left-6 pointer-events-none -z-0 opacity-50 hidden md:block">
          <AnimatedDotPattern rows={5} cols={5} variant="mixed" />
        </div>
        {/* Floating Ring Accent near Top Center */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none -z-0 opacity-40 hidden xl:block">
          <FloatingGeometricShapes type="cluster" size={90} />
        </div>'''

replacement = '''        {/* Subtle Decorative Animated Dot Pattern in Top-Left with Desktop Parallax */}
        <div 
          style={getParallaxStyle(0.6)}
          className="absolute top-4 left-6 pointer-events-none -z-0 opacity-50 hidden md:block"
        >
          <AnimatedDotPattern rows={5} cols={5} variant="mixed" />
        </div>
        {/* Floating Ring Accent near Top Center with Inverted Parallax */}
        <div 
          style={getParallaxStyle(-0.8)}
          className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none -z-0 opacity-40 hidden xl:block"
        >
          <FloatingGeometricShapes type="cluster" size={90} />
        </div>'''

if target in content:
    content = content.replace(target, replacement, 1)
    with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("TARGET NOT FOUND")
