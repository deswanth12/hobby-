with open('src/components/AboutSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('AnimatedDotPattern, ', '')
c = c.replace(', AnimatedDotPattern', '')

with open('src/components/AboutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
