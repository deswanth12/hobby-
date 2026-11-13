with open('src/pages/BlogPage.tsx', 'r', encoding='utf-8') as f:
    bp = f.read()

# Update BlogPage container & hero banner
bp = bp.replace('bg-brand-ivory text-brand-charcoal min-h-screen page-reveal', 'bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal texture-warm-ivory')
bp = bp.replace('bg-brand-surface py-10 sm:py-16 md:py-20 lg:py-24 border-b border-brand-border', 'bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/25 texture-architectural-lines')
bp = bp.replace('bg-brand-forest/10 text-brand-forest font-editorial-meta mb-4 border border-brand-forest/20', 'bg-[#0B241C] text-[#B49A64] font-editorial-meta mb-4 border border-[#B49A64]/40')
bp = bp.replace('text-brand-forest', 'text-[#F1EBDD]')
bp = bp.replace('text-brand-muted leading-relaxed', 'text-[#D8D0BE] leading-relaxed')

# Featured showcase card on BlogPage
bp = bp.replace('bg-white/50', 'bg-[#F1EBDD]/60')
bp = bp.replace('border-brand-border', 'border-[#D8D0BE]')
bp = bp.replace("style={{ backgroundColor: '#102D25', color: '#FFFFFF' }}", "style={{ backgroundColor: '#071B14', color: '#F1EBDD' }}")
bp = bp.replace('bg-brand-gold text-brand-deep hover:bg-white hover:text-brand-forest', 'bg-[#B49A64] text-[#071B14] hover:bg-[#9E844E]')
bp = bp.replace('text-brand-gold', 'text-[#B49A64]')

# Article cards grid on BlogPage
bp = bp.replace('bg-white rounded-2xl border border-brand-border hover:shadow-card-hover', 'bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] hover:shadow-card-hover hover:border-[#B49A64]')
bp = bp.replace('text-brand-charcoal group-hover:text-brand-forest', 'text-[#35271F] group-hover:text-[#183529]')
bp = bp.replace('text-brand-secondary', 'text-[#525954]')
bp = bp.replace('border-brand-border/60', 'border-[#D8D0BE]/60')
bp = bp.replace('bg-brand-forest/10 text-brand-forest', 'bg-[#071B14]/85 text-[#F1EBDD] border border-[#B49A64]/40')

with open('src/pages/BlogPage.tsx', 'w', encoding='utf-8') as f:
    f.write(bp)

print('BlogPage updated')

with open('src/pages/BlogArticlePage.tsx', 'r', encoding='utf-8') as f:
    bap = f.read()

# Update BlogArticlePage container & hero
bap = bap.replace('bg-brand-warm page-reveal min-h-screen', 'bg-[#F1EBDD] text-[#35271F] page-reveal min-h-screen texture-warm-ivory')
bap = bap.replace('bg-brand-surface py-10 sm:py-14 border-b border-brand-border', 'bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 border-b border-[#B49A64]/25 texture-architectural-lines')
bap = bap.replace('text-brand-forest', 'text-[#F1EBDD]')
bap = bap.replace('text-brand-muted', 'text-[#D8D0BE]')
bap = bap.replace('border-brand-border', 'border-[#D8D0BE]')
bap = bap.replace('bg-white border border-brand-border border-l-4 border-l-brand-gold shadow-card scroll-reveal', 'bg-[#FAF7F0] border border-[#D8D0BE] border-l-4 border-l-[#B49A64] shadow-card scroll-reveal')
bap = bap.replace('text-brand-gold', 'text-[#B49A64]')
bap = bap.replace('text-brand-charcoal', 'text-[#35271F]')

# Related articles cards in BlogArticlePage
bap = bap.replace('bg-white rounded-2xl border border-brand-border', 'bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE]')

with open('src/pages/BlogArticlePage.tsx', 'w', encoding='utf-8') as f:
    f.write(bap)

print('BlogArticlePage updated')
