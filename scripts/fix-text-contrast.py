import os

pages = [
    'src/pages/AuditAssurancePage.tsx',
    'src/pages/IncomeTaxPage.tsx',
    'src/pages/GSTServicesPage.tsx',
    'src/pages/CompanyRegistrationPage.tsx',
    'src/pages/VirtualCFOPage.tsx',
    'src/pages/RERAConsultantPage.tsx'
]

for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace white h1 in header banner
    content = content.replace(
        '<h1 className="font-editorial-h1 text-white">',
        '<h1 className="font-editorial-h1 text-brand-forest">'
    )
    # Replace light emerald body in header banner
    content = content.replace(
        '<p className="mt-4 font-editorial-body text-emerald-100/90 leading-relaxed text-base sm:text-lg">',
        '<p className="mt-4 font-editorial-body text-brand-muted leading-relaxed text-base sm:text-lg">'
    )
    # Replace white h2 in bottom intake banner
    content = content.replace(
        'font-bold text-white max-w-2xl mx-auto',
        'font-bold text-brand-forest max-w-2xl mx-auto'
    )
    # Replace light emerald body in bottom intake banner
    content = content.replace(
        'text-emerald-100/90 max-w-xl mx-auto leading-relaxed',
        'text-brand-muted max-w-xl mx-auto leading-relaxed'
    )
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {p}")

# Also update ServicesPage.tsx
with open('src/pages/ServicesPage.tsx', 'r', encoding='utf-8') as f:
    sp = f.read()

# Fix phone number text color
sp = sp.replace(
    'text-xs font-semibold text-emerald-200 hover:text-white px-3 py-2',
    'text-xs font-semibold text-brand-forest hover:text-brand-deep px-3 py-2'
)
# Fix discipline badge
sp = sp.replace(
    'text-emerald-200 bg-brand-pale text-gold-dark px-3 py-1',
    'bg-brand-pale text-gold-dark px-3 py-1'
)
# Fix right column inner items from bg-brand-surface/60 to dark badges with high contrast
sp = sp.replace(
    'bg-brand-surface/60 border border-brand-border/60',
    'bg-brand-deep/80 border border-brand-gold/20'
)
sp = sp.replace(
    'font-editorial-body text-xs text-emerald-100 font-medium leading-relaxed',
    'font-editorial-body text-xs text-brand-ivory font-medium leading-relaxed'
)

with open('src/pages/ServicesPage.tsx', 'w', encoding='utf-8') as f:
    f.write(sp)
print("Updated src/pages/ServicesPage.tsx")
