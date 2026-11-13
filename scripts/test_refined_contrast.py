def srgb_to_linear(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def luminance(hex_str):
    hex_str = hex_str.lstrip('#')
    r, g, b = [int(hex_str[i:i+2], 16) for i in (0, 2, 4)]
    return 0.2126 * srgb_to_linear(r) + 0.7152 * srgb_to_linear(g) + 0.0722 * srgb_to_linear(b)

def contrast(hex1, hex2):
    l1 = luminance(hex1)
    l2 = luminance(hex2)
    b = max(l1, l2)
    d = min(l1, l2)
    return (b + 0.05) / (d + 0.05)

colors = [
    ('Walnut #2E1C14 on Ivory #FAF7F0', '#2E1C14', '#FAF7F0'),
    ('Walnut #2E1C14 on White #FFFFFF', '#2E1C14', '#FFFFFF'),
    ('White #FFFFFF on Forest #16422F', '#FFFFFF', '#16422F'),
    ('Forest #16422F on Ivory #FAF7F0', '#16422F', '#FAF7F0'),
    ('Muted #5C5046 on Ivory #FAF7F0', '#5C5046', '#FAF7F0'),
    ('Sage #4D705B on Ivory #FAF7F0', '#4D705B', '#FAF7F0'),
]

for label, c1, c2 in colors:
    cr = contrast(c1, c2)
    status = "PASS AAA" if cr >= 7.0 else "PASS AA" if cr >= 4.5 else "FAIL"
    print(f"{label:35}: {cr:5.2f}:1 -> {status}")
