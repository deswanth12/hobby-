# 1. HeroSection.tsx
with open('src/v8/components/home/HeroSection.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = 'advising growth enterprises and established businesses across India.\n            </p>'
replacement = 'advising growth enterprises and established businesses across India.\n            </p>\n\n            {/* Hero Double-Rule Accent */}\n            <ArchitecturalLines type="double-rule" variant="bronze" length="100px" className="my-3 opacity-60" />'

if target in text:
    text = text.replace(target, replacement, 1)
    with open('src/v8/components/home/HeroSection.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Patched HeroSection.tsx")
else:
    print("Target not found in HeroSection.tsx")

# 2. PracticeAreasSection.tsx
with open('src/v8/components/home/PracticeAreasSection.tsx', 'r', encoding='utf-8') as f:
    text_p = f.read()

target_p = 'corporate governance, and financial controllership across India.\n            </p>'
replacement_p = 'corporate governance, and financial controllership across India.\n            </p>\n\n            {/* Practice Areas Double-Rule Accent */}\n            <ArchitecturalLines type="double-rule" variant="bronze" length="90px" className="mt-2.5 opacity-60" />'

if target_p in text_p:
    text_p = text_p.replace(target_p, replacement_p, 1)
    with open('src/v8/components/home/PracticeAreasSection.tsx', 'w', encoding='utf-8') as f:
        f.write(text_p)
    print("Patched PracticeAreasSection.tsx")
else:
    print("Target not found in PracticeAreasSection.tsx")

# 3. MethodologySection.tsx
with open('src/v8/components/home/MethodologySection.tsx', 'r', encoding='utf-8') as f:
    text_m = f.read()

target_m = 'designed to protect your statutory compliance.\n          </p>'
replacement_m = 'designed to protect your statutory compliance.\n          </p>\n\n          {/* Methodology Centered Double-Rule Accent */}\n          <div className="flex justify-center mt-3">\n            <ArchitecturalLines type="double-rule" variant="bronze" length="90px" className="opacity-60" />\n          </div>'

if target_m in text_m:
    text_m = text_m.replace(target_m, replacement_m, 1)
    with open('src/v8/components/home/MethodologySection.tsx', 'w', encoding='utf-8') as f:
        f.write(text_m)
    print("Patched MethodologySection.tsx")
else:
    print("Target not found in MethodologySection.tsx")
