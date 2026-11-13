import os
import re

img_srcs = []
for root, _, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fl:
                c = fl.read()
                matches = re.findall(r'src=["\']([^"\']+\.(?:webp|png|jpg|jpeg))["\']', c)
                matches += re.findall(r'image:\s*["\']([^"\']+\.(?:webp|png|jpg|jpeg))["\']', c)
                for m in matches:
                    img_srcs.append((m, os.path.relpath(p, 'src')))

for src, comp in sorted(set(img_srcs)):
    print(f"{src}  <--  {comp}")
