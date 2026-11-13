with open('src/components/ServicesSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('<CornerBrackets size={16} variant="gold" />>', '<CornerBrackets size={16} variant="gold" />')

with open('src/components/ServicesSection.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
