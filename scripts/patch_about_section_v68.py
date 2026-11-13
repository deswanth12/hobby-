with open('src/components/AboutSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Update background and borders
c = c.replace('bg-[#F8EFDF] border-b border-[#E8D5B5] overflow-hidden relative texture-warm-plaster', 'bg-[#F1EBDD] border-b border-[#D8D0BE] overflow-hidden relative texture-warm-ivory')
c = c.replace('bg-[#FFF9EF]/85 border border-[#E8D5B5]', 'bg-[#FAF7F0] border border-[#D8D0BE]')
c = c.replace('border-[#E8D5B5]', 'border-[#D8D0BE]')
c = c.replace('border-[#C3A66B]', 'border-[#B49A64]')
c = c.replace('text-[#153F32]', 'text-[#35271F]')
c = c.replace('text-brand-forest', 'text-[#35271F]')
c = c.replace('text-[#C3A66B]', 'text-[#B49A64]')
c = c.replace('bg-[#FFF9EF]', 'bg-[#FAF7F0]')
c = c.replace('bg-[#153F32]', 'bg-[#183529]')
c = c.replace('text-[#D4AF37]', 'text-[#B49A64]')

with open('src/components/AboutSection.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('AboutSection updated')
