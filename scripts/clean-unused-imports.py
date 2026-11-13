with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

unused = [
    'Award,\n',
    'CheckCircle2,\n',
    'ExternalLink,\n',
    'FileText,\n',
    'Clock,\n',
    'Award,',
    'CheckCircle2,',
    'ExternalLink,',
    'FileText,',
    'Clock,'
]

for u in unused:
    c = c.replace(u, '')

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Cleaned up unused imports!')
