with open('tests/challenger_m3_adversarial_deep_dive.mjs', 'r', encoding='utf-8') as f:
    text = f.read()

for line in text.splitlines():
    if 'Footer links to' in line:
        print(line)
