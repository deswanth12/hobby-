path = 'C:/kavitha ca/src/pages/HomePage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if 'Chartered Accountant in Tirupati</span>' in line:
        # replace the surrounding h1 block
        pass
    new_lines.append(line)

with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

import re
old_block = r'''              {/\* Master Headline \(Cormorant Garamond Monumental Serif\) \*/}
              <div className="space-y-1">
                <h1 className="font-editorial-h1 leading-\[1\.15\]">
                <span className="block text-brand-forest">Chartered Accountant in Tirupati</span>
                <span className="block text-brand-gold font-serif italic text-\[0\.82em\] mt-1\.5 font-normal">Statutory Rigor & Commercial Tax Counsel</span>
              </h1>
              </div>'''

replacement = '''              {/* Master Headline (Cormorant Garamond Monumental Serif) */}
              <h1 className="font-editorial-h1 text-brand-forest leading-[1.14] tracking-tight lg:text-[2.85rem] xl:text-[3.35rem]">
                <span className="block">Statutory Rigor.</span>
                <span className="block text-brand-forest/90">Practical Commercial Counsel.</span>
              </h1>'''

text_norm = text.replace('\r\n', '\n')
new_text = re.sub(old_block, replacement, text_norm)

if new_text != text_norm:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Replaced headline successfully!")
else:
    print("Regex match failed")
