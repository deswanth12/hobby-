with open('src/components/ServicesSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Fix Card 1
c = c.replace(
    'relative">\n            <CornerBrackets size={16} variant="gold" />\n          >',
    'relative">\n            <CornerBrackets size={16} variant="gold" />'
)

# Fix Card 4
c = c.replace(
    'relative">\n            <CornerBrackets size={16} variant="gold" />\n          >',
    'relative">\n            <CornerBrackets size={16} variant="gold" />'
)

with open('src/components/ServicesSection.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("Fixed closing tag in ServicesSection.tsx")
