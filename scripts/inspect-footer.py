with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for i, l in enumerate(lines):
    if 'PRACTICE AREAS' in l or 'Practice Areas' in l or 'Practice Areas Overview' in l:
        for j in range(max(0, i-2), min(len(lines), i+25)):
            print(f"{j+1}: {lines[j]}")
        break
