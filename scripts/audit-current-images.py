import os
import re

files = []
for root, dirs, fnames in os.walk('src'):
    if 'admin' in root.lower():
        continue
    for f in fnames:
        if f.endswith(('.tsx', '.ts')):
            files.append(os.path.join(root, f))

image_refs = {}
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Match /images/ or /brand/
    matches = re.findall(r'src=["\'](/images/[^"\']+)["\']', content)
    for m in matches:
        if m not in image_refs:
            image_refs[m] = []
        image_refs[m].append(os.path.basename(fpath))

print(f"Total unique public image references: {len(image_refs)}")
for img, components in sorted(image_refs.items()):
    print(f"{img} -> {', '.join(set(components))}")
