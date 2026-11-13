import re

with open('src/components/Navbar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace desktop link typography to refined uppercase
c = re.sub(
    r'text-xs sm:text-\[13px\] font-semibold tracking-wide whitespace-nowrap nav-editorial-link',
    r'text-xs uppercase tracking-wider font-medium whitespace-nowrap nav-editorial-link transition-colors',
    c
)

# Replace dark text colors in navbar with warm ivory / antique bronze
c = c.replace('text-[#302B24] hover:text-[#356B50]', 'text-[#F1EBDD]/85 hover:text-[#B49A64]')
c = c.replace('text-[#302B24]', 'text-[#F1EBDD]')
c = c.replace("isActive('/') && location.pathname === '/' ? 'text-[#F1EBDD] font-bold is-active'", "isActive('/') && location.pathname === '/' ? 'text-[#B49A64] font-bold is-active'")
c = c.replace("isActive('/about') ? 'text-[#F1EBDD] font-bold is-active'", "isActive('/about') ? 'text-[#B49A64] font-bold is-active'")
c = c.replace("isActive('/services') ? 'text-[#F1EBDD] font-bold is-active'", "isActive('/services') ? 'text-[#B49A64] font-bold is-active'")
c = c.replace("isActive('/blog') ? 'text-[#F1EBDD] font-bold is-active'", "isActive('/blog') ? 'text-[#B49A64] font-bold is-active'")
c = c.replace("isActive('/contact') ? 'text-[#F1EBDD] font-bold is-active'", "isActive('/contact') ? 'text-[#B49A64] font-bold is-active'")

# Dropdown menu styling
c = c.replace(
    'bg-[#FFFDF7] shadow-[0_12px_36px_-4px_rgba(24,61,48,0.12)] border border-[#E6C98F]',
    'bg-[#0B241C] shadow-[0_12px_36px_-4px_rgba(7,27,20,0.5)] border border-[#B49A64]/30'
)
c = c.replace('hover:bg-[#FFF6E8] hover:text-[#F1EBDD]', 'hover:bg-[#183529] hover:text-[#B49A64]')
c = c.replace('border-b border-[#E6C98F]/50', 'border-b border-[#B49A64]/20')

# CTA button
c = c.replace(
    'bg-[#183D30] hover:bg-[#356B50] text-[#FFFDF7] border border-[#C9A66B]/60 hover:border-[#C9A66B]',
    'bg-[#B49A64] hover:bg-[#9E844E] text-[#071B14] font-semibold border border-[#B49A64]'
)
c = c.replace('Schedule Consultation', 'Request Consultation')

# WhatsApp button refinement on navbar
c = c.replace(
    'bg-[#EAF3EE] hover:bg-[#DDEEE4] text-[#F1EBDD] border border-[#356B50]/30 hover:border-[#356B50]',
    'bg-[#183529] hover:bg-[#294B39] text-[#F1EBDD] border border-[#B49A64]/30 hover:border-[#B49A64]'
)
c = c.replace('text-[#356B50]', 'text-[#B49A64]')

# Mobile drawer styling
c = c.replace('bg-[#FFFCF5] shadow-2xl', 'bg-[#071B14] text-[#F1EBDD] border-l border-[#B49A64]/30 shadow-2xl')
c = c.replace('bg-[#FFFDF7]', 'bg-[#0B241C]')
c = c.replace('bg-[#FFF6E8]', 'bg-[#183529]')
c = c.replace('text-[#153F32]', 'text-[#B49A64]')
c = c.replace('text-[#525954]', 'text-[#D8D0BE]')
c = c.replace('border-[#E8D5B5]', 'border-[#B49A64]/20')

with open('src/components/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Navbar script executed successfully')
