with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
m = re.search(r'<section className="bg-brand-ivory pt-6.*?</section>', text, re.DOTALL)
if m:
    hero = m.group(0)
    print("Hero found, length:", len(hero))
    # Find card on the right
    card_m = re.search(r'<div className="[^"]*double-bezel[^"]*".*?</div>\s*</div>\s*</div>\s*</div>', hero, re.DOTALL)
    if not card_m:
        # look for col-span-5 or similar
        print("Looking for right column:")
        col2 = re.search(r'lg:col-span-5.*?</div>\s*</div>\s*</div>', hero, re.DOTALL)
        if col2:
            print(col2.group(0)[:1000])
