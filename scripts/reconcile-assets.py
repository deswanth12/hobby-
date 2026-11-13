import os
import re

all_refs = set()
ref_locations = {}

def scan_file(fpath):
    try:
        with open(fpath, 'r', encoding='utf-8') as fh:
            content = fh.read()
        matches = re.findall(r"(/images/[a-zA-Z0-9_\-\./]+(?:\.webp|\.jpg|\.png|\.jpeg|\.svg))", content)
        for m in matches:
            all_refs.add(m)
            ref_locations.setdefault(m, []).append(fpath)
    except Exception:
        pass

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.jsx', '.css')):
            scan_file(os.path.join(root, file))

for root, dirs, files in os.walk('content'):
    for file in files:
        scan_file(os.path.join(root, file))

disk_images = set()
for root, dirs, files in os.walk('public/images'):
    for file in files:
        rel = os.path.relpath(os.path.join(root, file), 'public').replace('\\', '/')
        disk_images.add('/' + rel)

broken = []
for ref in all_refs:
    path = os.path.join('public', ref.lstrip('/'))
    if not os.path.exists(path):
        broken.append(ref)

unused = []
for d in disk_images:
    if d not in all_refs:
        unused.append(d)

print(f"Total unique /images/ references in src & content: {len(all_refs)}")
print(f"Total images on disk in public/images: {len(disk_images)}")
print(f"Broken references: {len(broken)} -> {broken}")
print(f"Unused images on disk: {len(unused)}")

print("\n--- IN-USE IMAGES ---")
for ref in sorted(all_refs):
    path = os.path.join('public', ref.lstrip('/'))
    exists = os.path.exists(path)
    size = os.path.getsize(path) / 1024 if exists else 0
    locs = ", ".join([os.path.basename(p) for p in ref_locations.get(ref, [])[:3]])
    print(f"  [OK] {ref.ljust(55)} | {size:6.1f} KB | {locs}")

print("\n--- UNUSED IMAGES ON DISK ---")
for d in sorted(unused):
    path = os.path.join('public', d.lstrip('/'))
    size = os.path.getsize(path) / 1024
    print(f"  [UNUSED] {d.ljust(55)} | {size:6.1f} KB")
