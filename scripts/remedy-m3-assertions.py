import re

# 1. Fix LocationsPage.tsx GPS DMS coordinates
with open('src/pages/LocationsPage.tsx', 'r', encoding='utf-8') as f:
    loc_text = f.read()

loc_text = re.sub(
    r'GPS DMS:[^\n<]+',
    'GPS DMS: 13°37\'09.3"N 79°25\'04.9"E • Decimal: 13.6192242, 79.418046',
    loc_text
)

with open('src/pages/LocationsPage.tsx', 'w', encoding='utf-8') as f:
    f.write(loc_text)
print("Updated LocationsPage.tsx GPS")

# 2. Fix ServicesPage.tsx statutory-advisor id
with open('src/pages/ServicesPage.tsx', 'r', encoding='utf-8') as f:
    serv_text = f.read()

if '<div id="statutory-advisor"' not in serv_text:
    serv_text = serv_text.replace(
        '<StatutoryEntityAdvisor />',
        '<div id="statutory-advisor" className="scroll-mt-32">\n        <StatutoryEntityAdvisor />\n      </div>'
    )
    with open('src/pages/ServicesPage.tsx', 'w', encoding='utf-8') as f:
        f.write(serv_text)
    print("Updated ServicesPage.tsx with #statutory-advisor")

# 3. Fix AboutPage.tsx:
# a) rounded-3xl -> rounded-2xl
# b) bg-gradient-to-t -> remove
# c) backdrop-blur-md -> remove
# d) Ensure all interactive elements have min-h-[44px]
with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    abt_text = f.read()

# Replace rounded-3xl with rounded-2xl
abt_text = abt_text.replace('rounded-3xl', 'rounded-2xl')

# Remove bg-gradient-to-t
abt_text = abt_text.replace('bg-gradient-to-t from-black/50 via-transparent to-transparent', 'bg-black/20')

# Remove backdrop-blur-md
abt_text = abt_text.replace('backdrop-blur-md', '')

# Replace small links in expertise cards with min-h-[44px] touch target
abt_text = re.sub(
    r'className="mt-5 pt-3 border-t border-\[#E9E0D2\]/80 flex items-center justify-between text-xs font-semibold text-\[#356B50\] hover:text-\[#183D30\] transition-colors"',
    'className="mt-5 pt-3 border-t border-[#E9E0D2]/80 flex items-center justify-between text-xs font-semibold text-[#356B50] hover:text-[#183D30] transition-colors min-h-[44px]"',
    abt_text
)

# Also ensure any other Link or a in AboutPage has min-h-[44px]
abt_text = abt_text.replace(
    'className="inline-flex items-center gap-1.5 text-xs text-[#66665E] hover:text-[#183D30] font-semibold"',
    'className="inline-flex items-center gap-1.5 text-xs text-[#66665E] hover:text-[#183D30] font-semibold min-h-[44px]"'
)

abt_text = abt_text.replace(
    'className="inline-flex items-center gap-2 text-xs font-semibold text-[#356B50] hover:text-[#183D30]"',
    'className="inline-flex items-center gap-2 text-xs font-semibold text-[#356B50] hover:text-[#183D30] min-h-[44px]"'
)

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
    f.write(abt_text)
print("Updated AboutPage.tsx with anti-slop and touch ergonomics fixes")
