import re

# 1. Update HomePage.tsx
with open(r'src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Virtual CFO card classes and text colors
old_cfo_class = 'bg-brand-deep text-brand-white rounded-2xl border border-brand-forest'
new_cfo_class = 'bg-brand-white text-brand-charcoal rounded-2xl border-2 border-brand-gold/60'
content = content.replace(old_cfo_class, new_cfo_class)

content = content.replace('text-2xl text-white mb-2', 'text-2xl text-brand-forest mb-2 group-hover/card:text-brand-deep transition-colors')
content = content.replace('text-emerald-100/90 leading-relaxed mb-4', 'text-brand-muted leading-relaxed mb-4')
content = content.replace('bg-brand-forest/80 border border-brand-gold/20 text-xs', 'bg-brand-surface/70 border border-brand-border/60 text-xs')
content = content.replace('text-emerald-200/90 text-[11px] leading-relaxed', 'text-brand-muted text-[11px] leading-relaxed')
content = content.replace('border-t border-brand-forest pt-4', 'border-t border-brand-border/60 pt-4')
content = content.replace('font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5', 'font-editorial-body text-xs text-brand-charcoal flex items-start gap-2.5')
content = content.replace('bg-brand-forest/90 border border-brand-gold/20 text-xs text-emerald-100', 'bg-brand-surface/90 border border-brand-border/80 text-xs text-brand-charcoal')
content = content.replace('border-t border-brand-gold/20 space-y-2.5', 'border-t border-brand-gold/30 space-y-2.5')
content = content.replace('text-[11px] text-emerald-200/90 leading-relaxed', 'text-[11px] text-brand-muted leading-relaxed')
content = content.replace('pt-5 mt-5 border-t border-brand-forest flex items-center justify-between', 'pt-5 mt-5 border-t border-brand-border flex items-center justify-between')
content = content.replace('text-brand-gold hover:text-white group', 'text-brand-forest hover:text-brand-deep group')
content = content.replace('text-[11px] font-semibold text-emerald-300 hover:text-white underline underline-offset-2', 'text-[11px] font-semibold text-brand-forest hover:underline underline-offset-2')
content = content.replace('bg-brand-forest/60 px-2.5 py-1 rounded border border-brand-gold/30', 'bg-brand-pale text-gold-dark px-2.5 py-1 rounded border border-brand-gold/30')

# Replace ICAI card classes and text colors
old_icai_block = '''<div className="bg-brand-deep text-brand-white rounded-xl p-6 border border-brand-forest shadow-card flex items-start gap-4 scroll-reveal">
              <div className="w-10 h-10 rounded-lg bg-brand-forest text-brand-gold flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-brand-gold/40">
                <Shield className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-editorial-h3 text-lg font-bold text-white mb-1">
                  ICAI Code of Conduct & Independence
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and client confidentiality established by the Institute of Chartered Accountants of India.
                </p>
              </div>
            </div>'''

new_icai_block = '''<div className="bg-brand-white card-tactile rounded-xl p-6 border-2 border-brand-forest/20 shadow-card flex items-start gap-4 scroll-reveal">
              <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-forest flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-brand-forest/20">
                <Shield className="w-5 h-5 text-brand-forest" />
              </div>
              <div>
                <h3 className="font-editorial-h3 text-lg font-bold text-brand-forest mb-1">
                  ICAI Code of Conduct & Independence
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and client confidentiality established by the Institute of Chartered Accountants of India.
                </p>
              </div>
            </div>'''

content = content.replace(old_icai_block, new_icai_block)

with open(r'src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('HomePage.tsx brightened successfully!')
