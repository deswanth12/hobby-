import re

files_to_brighten = [
    'src/pages/AboutPage.tsx',
    'src/components/AboutSection.tsx',
    'src/components/WhyChooseUs.tsx',
    'src/pages/ContactPage.tsx',
    'src/components/ContactForm.tsx'
]

replacements = [
    ('#FBF7EF', '#FFFCF5'),
    ('#fbf7ef', '#fffcf5'),
    ('#FFFDF8', '#FFFFFF'),
    ('#fffdf8', '#ffffff'),
    ('#E9E0D2', '#EDE2CF'),
    ('#e9e0d2', '#ede2cf'),
    ('#183D30', '#254B38'),
    ('#183d30', '#254b38'),
    ('#66665E', '#625F55'),
    ('#66665e', '#625f55'),
    ('#F2E8D5', '#FFF1D9'),
    ('#f2e8d5', '#fff1d9'),
    ('#E4D0A5', '#E6C98F'),
    ('#e4d0a5', '#e6c98f')
]

for path in files_to_brighten:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        content = content.replace(old.lower(), new.lower())
        content = content.replace(old.upper(), new)

    # In icon containers: change bg-[#356B50]/10 to bg-[#EAF3E9] for fresh sage pop
    content = content.replace('bg-[#356B50]/10', 'bg-[#EAF3E9]')
    content = content.replace('bg-brand-forest/10', 'bg-[#EAF3E9]')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Brightened {path}')

