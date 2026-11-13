import re

path = 'src/pages/AuditAssurancePage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Section 1 Header Banner
text = re.sub(
    r'<section className="bg-brand-surface py-10 sm:py-16 md:py-20 lg:py-28 border-b border-brand-border">',
    r'<section className="bg-[#FFFCF5] py-10 sm:py-16 md:py-20 lg:py-28 border-b border-[#EDE2CF]">',
    text
)

# Header badge
text = text.replace(
    'bg-brand-forest text-brand-gold font-editorial-meta mb-4 border border-brand-gold/40 shadow-inner',
    'bg-[#EAF3E9] text-[#356B50] font-editorial-meta mb-4 border border-[#356B50]/30 shadow-xs'
)
text = text.replace(
    '<ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />',
    '<ShieldCheck className="w-4 h-4 text-[#356B50] shrink-0" />'
)
text = text.replace(
    '<h1 className="font-editorial-h1 text-brand-forest">',
    '<h1 className="font-editorial-h1 text-[#254B38] font-serif font-bold">'
)
text = text.replace(
    '<p className="mt-4 font-editorial-body text-brand-muted leading-relaxed text-base sm:text-lg">',
    '<p className="mt-4 font-editorial-body text-[#625F55] leading-relaxed text-base sm:text-lg">'
)

# 2. Section 2: SAs Governance Strip
text = re.sub(
    r'<section className="py-12 bg-brand-surface border-b border-brand-border">',
    r'<section className="py-12 bg-[#FFFDF7] border-b border-[#EDE2CF]">',
    text
)
text = text.replace(
    'bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20',
    'bg-[#EAF3E9] text-[#356B50] flex items-center justify-center shrink-0 border border-[#356B50]/20'
)
text = text.replace(
    'font-editorial-meta text-brand-gold text-[10px] block mb-1',
    'inline-block px-2.5 py-0.5 rounded-full bg-[#FFF1D9] text-[#855E1C] font-editorial-meta text-[10px] font-semibold mb-2'
)
text = text.replace(
    'font-editorial-h3 text-base font-bold text-brand-forest',
    'font-serif text-lg font-bold text-[#254B38]'
)
text = text.replace(
    'font-editorial-body text-xs text-brand-muted mt-1 leading-relaxed',
    'font-editorial-body text-xs text-[#625F55] mt-1 leading-relaxed'
)

# 3. Section 3: 4-Phase Lifecycle
text = re.sub(
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-brand-ivory border-b border-brand-border">',
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFFCF5] border-b border-[#EDE2CF]">',
    text
)
text = text.replace(
    'font-editorial-meta text-brand-gold block mb-2.5',
    'inline-block px-3 py-1 rounded-full bg-[#FFF1D9] text-[#855E1C] font-editorial-meta text-xs font-semibold mb-3'
)
text = text.replace(
    'font-editorial-h2 text-brand-forest',
    'font-editorial-h2 text-[#254B38] font-serif font-bold'
)
text = text.replace(
    'font-editorial-body text-sm sm:text-base text-brand-muted mt-3 leading-relaxed',
    'font-editorial-body text-sm sm:text-base text-[#625F55] mt-3 leading-relaxed'
)
text = text.replace(
    'font-editorial-meta text-brand-gold text-base',
    'px-2.5 py-1 rounded-full bg-[#FFF1D9] text-[#855E1C] font-editorial-meta text-xs font-semibold'
)

# 4. Section 4: The 9 Streams
text = re.sub(
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-24">',
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFFDF7] border-b border-[#EDE2CF]">',
    text
)
# Flagship plaque: replace dark background with bright white & gold accent card
text = text.replace(
    '''<div 
                      className="double-bezel-inner-dark bg-brand-deep rounded-2xl p-8 sm:p-10 lg:p-12 text-white border border-white/10 shadow-editorial-lg"
                      style={{ backgroundColor: '#102D25', color: '#FFFFFF' }}
                    >''',
    '''<div 
                      className="bg-white rounded-2xl p-8 sm:p-10 lg:p-12 text-[#292B27] border-2 border-[#EDE2CF] shadow-editorial-lg"
                    >'''
)
text = text.replace(
    'border-b border-white/10 mb-6 gap-4',
    'border-b border-[#EDE2CF] mb-6 gap-4'
)
text = text.replace(
    'font-editorial-meta text-brand-gold bg-brand-forest px-3 py-1 rounded-full border border-brand-gold/40 text-xs',
    'font-editorial-meta text-[#356B50] bg-[#EAF3E9] px-3 py-1 rounded-full border border-[#356B50]/30 text-xs font-semibold'
)
text = text.replace(
    'font-editorial-meta text-emerald-300 bg-black/40 px-3 py-1 rounded-full border border-white/10 text-xs',
    'font-editorial-meta text-[#855E1C] bg-[#FFF1D9] px-3 py-1 rounded-full border border-[#EDE2CF] text-xs font-semibold'
)
text = text.replace(
    'font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-bold text-white',
    'font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#254B38]'
)
text = text.replace(
    'font-editorial-meta text-brand-gold bg-black/30 px-3 py-1.5 rounded-full border border-white/10 text-xs self-start lg:self-center',
    'font-editorial-meta text-[#356B50] bg-[#EAF3E9] px-3 py-1.5 rounded-full border border-[#356B50]/20 text-xs font-semibold self-start lg:self-center'
)
text = text.replace(
    'font-editorial-body text-emerald-100/90 text-sm sm:text-base leading-relaxed',
    'font-editorial-body text-[#625F55] text-sm sm:text-base leading-relaxed'
)
text = text.replace(
    'bg-black/20 p-5 rounded-xl border border-white/10',
    'bg-[#FFFDF7] p-5 rounded-xl border border-[#EDE2CF]'
)
text = text.replace(
    'text-white block font-serif font-semibold text-sm',
    'text-[#254B38] block font-serif font-semibold text-sm'
)
text = text.replace(
    'text-white/80 block mt-1 leading-relaxed',
    'text-[#625F55] block mt-1 leading-relaxed'
)
text = text.replace(
    'bg-brand-forest hover:bg-forest-600 text-brand-white border border-brand-gold/40',
    'bg-[#356B50] hover:bg-[#254B38] text-white border border-[#C9A66B]/40'
)

# 5. Section 5 & 6
text = re.sub(
    r'<section className="py-10 sm:py-16 md:py-20 bg-brand-surface border-y border-brand-border">',
    r'<section className="py-10 sm:py-16 md:py-20 bg-[#EAF3E9] border-y border-[#EDE2CF]">',
    text
)
text = re.sub(
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-brand-surface text-center">',
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFF1D9] text-center border-b border-[#EDE2CF]">',
    text
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated AuditAssurancePage.tsx with bright global color system!')
