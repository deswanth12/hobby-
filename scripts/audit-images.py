import os
import re

found_images = set()

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            fpath = os.path.join(root, f)
            content = open(fpath, 'r', encoding='utf-8').read()
            srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
            for s in srcs:
                found_images.add((fpath, s))
            # Also check backgroundImage or url(...) in style or string
            bg_srcs = re.findall(r'url\(["\']?(/[^"\'\)]+)["\']?\)', content)
            for s in bg_srcs:
                found_images.add((fpath, s))
            # Also check direct image paths in data arrays like image: '/images/...'
            prop_srcs = re.findall(r'["\'](/images/[^"\']+)["\']', content)
            for s in prop_srcs:
                found_images.add((fpath, s))

print(f"Total image references found across src/: {len(found_images)}")
missing = []
for fpath, s in sorted(found_images):
    clean_s = s.lstrip('/')
    disk_path = os.path.join('public', clean_s)
    exists = os.path.exists(disk_path)
    file_size = os.path.getsize(disk_path) if exists else 0
    status = 'EXISTS' if exists else 'MISSING'
    if not exists:
        missing.append((fpath, s))
    print(f"[{status}] {s} (size: {file_size}b) from {fpath}")

print("\n--- MISSING IMAGES SUMMARY ---")
print(f"Total missing: {len(missing)}")
for fpath, s in missing:
    print(f"MISSING: {s} in {fpath}")
