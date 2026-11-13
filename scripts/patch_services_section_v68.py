with open('src/components/ServicesSection.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden texture-linen', 'bg-[#F1EBDD] border-b border-[#D8D0BE] relative overflow-hidden texture-warm-ivory')
c = c.replace('border-[#E8D5B5]', 'border-[#D8D0BE]')
c = c.replace('bg-[#FFF9EF]', 'bg-[#FAF7F0]')
c = c.replace('text-[#183D30]', 'text-[#35271F]')
c = c.replace('border-[#C3A66B]', 'border-[#B49A64]')
c = c.replace('text-[#C3A66B]', 'text-[#B49A64]')
c = c.replace('text-[#8C6D37]', 'text-[#B49A64]')
c = c.replace('text-[#D4AF37]', 'text-[#B49A64]')
c = c.replace('hover:border-[#C3A66B]', 'hover:border-[#B49A64]')
c = c.replace('border-[#E6C98F]', 'border-[#D8D0BE]')
c = c.replace('hover:text-[#183D30]', 'hover:text-[#35271F]')

with open('src/components/ServicesSection.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('ServicesSection updated')
