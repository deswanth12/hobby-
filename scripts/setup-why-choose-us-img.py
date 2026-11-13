import os, shutil
from PIL import Image

src_dir = 'public/images'
target_dir = 'public/images/why-choose-us'
os.makedirs(target_dir, exist_ok=True)

# Check contact consultation image
p1 = 'public/images/contact/consultation.webp'
im1 = Image.open(p1)
print(f"im1 {p1}: {im1.size}")

# Copy to dedicated why-choose-us directory
dst = os.path.join(target_dir, 'consultation.webp')
shutil.copy2(p1, dst)
print(f"Copied {p1} to {dst}")
