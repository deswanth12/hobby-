import re

with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

def fix_tag(match):
    tag = match.group(0)
    attrs = match.group(2)
    if 'min-h-[44px]' not in attrs:
        if 'className="' in tag:
            return tag.replace('className="', 'className="min-h-[44px] ')
        elif 'className={`' in tag:
            return tag.replace('className={`', 'className={`min-h-[44px] ')
        else:
            space_idx = tag.find(' ')
            return tag[:space_idx] + ' className="min-h-[44px]"' + tag[space_idx:]
    return tag

new_text = re.sub(r'<(a|Link|button)\b([^>]*?)>', fix_tag, text)

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Updated all interactive tags in AboutPage.tsx")
