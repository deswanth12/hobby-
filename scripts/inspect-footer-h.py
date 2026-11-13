with open('tests/challenger_m3_adversarial_deep_dive.mjs', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
for i, l in enumerate(lines):
    if 'Footer links to' in l:
        for j in range(max(0, i-5), min(len(lines), i+5)):
            print(f"{j+1}: {lines[j]}")
        break
