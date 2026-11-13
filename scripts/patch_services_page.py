with open('src/v8/pages/ServicesPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '<Badge variant="kicker">02 / PRACTICE DISCIPLINES</Badge>'
replacement = '<Badge variant="kicker">02 / PRACTICE DISCIPLINES</Badge>\n              <SectionAccent variant="bronze" className="hidden sm:flex" />'

target_sec = 'texture-architectural-lines relative overflow-hidden">'
replacement_sec = 'texture-architectural-lines relative overflow-hidden">\n        {/* Ambient Decorative Layer */}\n        <DecorativeLayer>\n          <DotGrid\n            variant="bronze"\n            width={260}\n            height={260}\n            className="absolute -top-10 -right-10 opacity-15 hidden md:block"\n          />\n        </DecorativeLayer>'

if target in text:
    text = text.replace(target, replacement, 1)
    text = text.replace(target_sec, replacement_sec, 1)
    with open('src/v8/pages/ServicesPage.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Patched ServicesPage.tsx successfully")
else:
    print("Target not found in ServicesPage.tsx")
