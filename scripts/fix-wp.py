with open('src/components/WorkingProcess.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = '<CornerBrackets size={14} variant="gold" />'
replacement = '<CornerBrackets size={14} variant="gold" />\n                          <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-3 right-3 opacity-20 hidden sm:block" />'

c = c.replace(target, replacement)

with open('src/components/WorkingProcess.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] Integrated PrecisionDotMatrix into WorkingProcess")
