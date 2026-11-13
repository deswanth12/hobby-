with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('bg-brand-deep text-brand-white border-t-2 border-brand-gold', 'bg-[#071B14] text-[#F1EBDD] border-t-2 border-[#B49A64]')
c = c.replace('text-brand-gold', 'text-[#B49A64]')
c = c.replace('border-brand-gold', 'border-[#B49A64]')
c = c.replace('border-brand-forest/60', 'border-[#B49A64]/20')
c = c.replace('border-brand-forest/80', 'border-[#B49A64]/20')
c = c.replace('border-brand-forest', 'border-[#B49A64]/20')
c = c.replace('text-emerald-100/80', 'text-[#D8D0BE]')
c = c.replace('text-emerald-200/90', 'text-[#D8D0BE]')
c = c.replace('text-emerald-300/80', 'text-[#AAB4A0]')
c = c.replace('text-emerald-100', 'text-[#F1EBDD]')
c = c.replace('text-emerald-200', 'text-[#D8D0BE]')
c = c.replace('text-emerald-300', 'text-[#AAB4A0]')
c = c.replace('hover:text-brand-gold', 'hover:text-[#B49A64]')
c = c.replace('text-brand-white', 'text-[#F1EBDD]')

with open('src/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Footer updated')
