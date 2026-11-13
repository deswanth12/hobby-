import os
from PIL import Image

base_dir = r'c:\kavatha ca\public\images'
os.makedirs(os.path.join(base_dir, 'working-process'), exist_ok=True)
os.makedirs(os.path.join(base_dir, 'about'), exist_ok=True)
os.makedirs(os.path.join(base_dir, 'services'), exist_ok=True)
os.makedirs(os.path.join(base_dir, 'contact'), exist_ok=True)

# Process About images
img_office = Image.open(r'c:\kavatha ca\public\uploads\blog\internal-audit-best-practices.webp')
img_office.save(os.path.join(base_dir, 'about', 'office-interior.webp'), 'WEBP', quality=88)

img_leadership = Image.open(r'c:\kavatha ca\public\uploads\blog\statutory-audit-guidelines-2026.webp')
img_leadership.save(os.path.join(base_dir, 'about', 'leadership-space.webp'), 'WEBP', quality=88)

# Process Services images
img_audit = Image.open(r'c:\kavatha ca\public\uploads\blog\statutory-audit-guidelines-2026.webp')
img_audit.save(os.path.join(base_dir, 'services', 'audit.webp'), 'WEBP', quality=88)

img_tax = Image.open(r'c:\kavatha ca\public\uploads\blog\corporate-tax-planning-2026.webp')
img_tax.save(os.path.join(base_dir, 'services', 'taxation.webp'), 'WEBP', quality=88)

img_adv = Image.open(r'c:\kavatha ca\public\uploads\blog\gst-annual-return-compliance.webp')
img_adv.save(os.path.join(base_dir, 'services', 'advisory.webp'), 'WEBP', quality=88)

img_cfo = Image.open(r'c:\kavatha ca\public\images\working-process\planning.webp')
img_cfo.save(os.path.join(base_dir, 'services', 'virtual-cfo.webp'), 'WEBP', quality=88)

# Process Contact image
img_contact = Image.open(r'c:\kavatha ca\public\images\working-process\understanding.webp')
img_contact.save(os.path.join(base_dir, 'contact', 'consultation.webp'), 'WEBP', quality=88)

print('All 11 required assets populated in public/images/')
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.webp'):
            p = os.path.join(root, f)
            print(f'  {os.path.relpath(p, base_dir)}: {os.path.getsize(p)} bytes')
