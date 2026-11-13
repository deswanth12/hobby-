with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'src="/brand/ka-seal-medallion.webp"',
    'src="/brand/ca-india-logo.png"'
)
c = c.replace(
    'alt="KA Official Practice Seal"',
    'alt="Official CA India Logo"'
)
c = c.replace(
    'className="w-16 h-16 flex items-center justify-center shrink-0"',
    'className="w-16 h-16 flex items-center justify-center shrink-0 bg-white rounded-xl p-2 border border-brand-gold/40 shadow-sm"'
)

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Updated AboutPage.tsx!')
