with open('src/components/WorkingProcess.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden texture-linen', 'bg-[#F1EBDD] border-b border-[#D8D0BE] relative overflow-hidden texture-warm-ivory')
c = c.replace('border-[#E8D5B5]', 'border-[#D8D0BE]')
c = c.replace('bg-[#FFF9EF]', 'bg-[#FAF7F0]')
c = c.replace('text-[#0F3E2E]', 'text-[#35271F]')
c = c.replace('text-[#153F32]', 'text-[#35271F]')
c = c.replace('border-[#C5A059]', 'border-[#B49A64]')
c = c.replace('text-[#C5A059]', 'text-[#B49A64]')
c = c.replace('bg-[#C5A059]', 'bg-[#B49A64]')
c = c.replace('bg-[#0F3E2E]', 'bg-[#183529]')
c = c.replace('text-[#D4AF37]', 'text-[#B49A64]')
c = c.replace('hover:border-[#C5A059]', 'hover:border-[#B49A64]')

with open('src/components/WorkingProcess.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('WorkingProcess updated')
