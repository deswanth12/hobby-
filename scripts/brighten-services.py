import re

# 1. Update ServicesPage.tsx
with open(r'src/pages/ServicesPage.tsx', 'r', encoding='utf-8') as f:
    services = f.read()

services = services.replace(
    'scroll-mt-32 p-7 sm:p-10 lg:p-12 rounded-2xl border border-brand-gold/30 bg-brand-deep text-white shadow-editorial-lg scroll-reveal-scale',
    'scroll-mt-32 p-7 sm:p-10 lg:p-12 rounded-2xl border-2 border-brand-gold/60 bg-brand-white text-brand-charcoal shadow-card scroll-reveal-scale'
)
services = services.replace('font-editorial-h2 text-white', 'font-editorial-h2 text-brand-forest')
services = services.replace('text-emerald-100/90 leading-relaxed', 'text-brand-muted leading-relaxed')
services = services.replace('bg-brand-forest/60 border border-brand-forest text-xs', 'bg-brand-surface/70 border border-brand-border/60 text-xs')
services = services.replace('text-xs font-editorial-body text-emerald-100/90', 'text-xs font-editorial-body text-brand-charcoal')
services = services.replace('bg-brand-deep/80 border border-white/10', 'bg-brand-surface/60 border border-brand-border/60')
services = services.replace('font-semibold text-white text-sm', 'font-semibold text-brand-forest text-sm')
services = services.replace('text-xs text-emerald-200/90 mt-1', 'text-xs text-brand-muted mt-1')
services = services.replace('bg-black/40 px-3 py-1 rounded-full border border-white/10 text-[11px]', 'bg-brand-pale text-gold-dark px-3 py-1 rounded-full border border-brand-gold/30 text-[11px]')

with open(r'src/pages/ServicesPage.tsx', 'w', encoding='utf-8') as f:
    f.write(services)

print('ServicesPage.tsx brightened successfully!')

# 2. Update Service Detail Pages
service_detail_pages = [
    r'src/pages/AuditAssurancePage.tsx',
    r'src/pages/IncomeTaxPage.tsx',
    r'src/pages/GSTServicesPage.tsx',
    r'src/pages/CompanyRegistrationPage.tsx',
    r'src/pages/VirtualCFOPage.tsx',
    r'src/pages/RERAConsultantPage.tsx'
]

for page_path in service_detail_pages:
    with open(page_path, 'r', encoding='utf-8') as f:
        code = f.read()

    # Brighten hero banner
    code = code.replace(
        '<section className="bg-brand-deep text-white py-10 sm:py-16 md:py-20 lg:py-28 border-b border-brand-gold/30">',
        '<section className="bg-brand-surface py-10 sm:py-16 md:py-20 lg:py-28 border-b border-brand-border">'
    )
    code = code.replace(
        '<section className="bg-brand-deep text-white py-20 sm:py-24 lg:py-28 border-b border-brand-gold/30">',
        '<section className="bg-brand-surface py-20 sm:py-24 lg:py-28 border-b border-brand-border">'
    )

    # Brighten CTA section
    code = code.replace(
        '<section className="py-16 bg-brand-deep text-white border-t border-brand-gold/30">',
        '<section className="py-16 bg-brand-surface text-brand-charcoal border-t border-brand-border">'
    )

    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(code)

    print(f'Brightened {page_path}')
