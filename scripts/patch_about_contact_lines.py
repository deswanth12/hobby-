with open('src/v8/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = 'services to enterprises and emerging businesses across South India.\n            </p>'
replacement = 'services to enterprises and emerging businesses across South India.\n            </p>\n\n            {/* About Double-Rule Accent */}\n            <ArchitecturalLines type="double-rule" variant="bronze" length="100px" className="my-3.5 opacity-60" />'

if target in text:
    text = text.replace(target, replacement, 1)
    with open('src/v8/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Patched AboutPage.tsx")
else:
    print("Target not found in AboutPage.tsx")

with open('src/v8/pages/ContactPage.tsx', 'r', encoding='utf-8') as f:
    text_c = f.read()

target_c = 'ICAI Code of Ethics.\n            </p>'
replacement_c = 'ICAI Code of Ethics.\n            </p>\n\n            {/* Contact Header Double-Rule Accent */}\n            <ArchitecturalLines type="double-rule" variant="bronze" length="90px" className="my-3.5 opacity-60" />'

if target_c in text_c:
    text_c = text_c.replace(target_c, replacement_c, 1)
    with open('src/v8/pages/ContactPage.tsx', 'w', encoding='utf-8') as f:
        f.write(text_c)
    print("Patched ContactPage.tsx")
else:
    print("Target not found in ContactPage.tsx")
