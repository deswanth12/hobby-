with open('src/components/WhyChooseUs.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Update background to Deep Evergreen
c = c.replace(
    'bg-[#F5EAD8] border-b border-[#E8D5B5] relative overflow-hidden texture-geometric-paper',
    'bg-[#071B14] text-[#F1EBDD] border-b border-[#B49A64]/20 relative overflow-hidden texture-architectural-lines'
)

# Text & badge replacements
c = c.replace('text-[#153F32]', 'text-[#F1EBDD]')
c = c.replace('text-brand-forest', 'text-[#F1EBDD]')
c = c.replace('text-brand-charcoal', 'text-[#D8D0BE]')
c = c.replace('text-[#525954]', 'text-[#D8D0BE]')
c = c.replace('bg-[#FFF9EF]', 'bg-[#0B241C]')
c = c.replace('border-[#E8D5B5]', 'border-[#B49A64]/30')
c = c.replace('border-[#C3A66B]', 'border-[#B49A64]')
c = c.replace('text-[#C3A66B]', 'text-[#B49A64]')
c = c.replace('text-[#D4AF37]', 'text-[#B49A64]')
c = c.replace('hover:border-[#C3A66B]', 'hover:border-[#B49A64]')
c = c.replace('bg-[#FFF6E8]', 'bg-[#183529]')

with open('src/components/WhyChooseUs.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('WhyChooseUs updated to Deep Evergreen')
