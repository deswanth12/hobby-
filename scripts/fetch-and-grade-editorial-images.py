import urllib.request
from PIL import Image, ImageEnhance
import numpy as np
import io
import os

images_map = {
    'about/office-space': 'photo-1497366216548-37526070297c',       # Modern luxury boardroom with natural window light
    'services/audit': 'photo-1556761175-5973dc0f32e7',           # Corporate assurance and strategic review
    'services/taxation': 'photo-1454165804606-c3d57bc86b40',        # Financial planning and tax analysis
    'services/advisory': 'photo-1551836022-d5d88e9218df',        # Executive advisory and consulting
    'services/virtual-cfo': 'photo-1507679799987-c73779587ccf',     # Executive corporate financial leadership
    'process/understanding': 'photo-1573496359142-b8d87734a5a2',    # Professional Indian business leader in consultation
    'process/planning': 'photo-1454165804606-c3d57bc86b40',         # Strategic financial planning and roadmaps
    'process/execution': 'photo-1497215728101-856f4ea42174',        # High-focus modern corporate office workstations
    'process/ongoing-support': 'photo-1522071820081-009f0129c71c',  # Collaborative ongoing corporate advisory
    'contact/consultation': 'photo-1497366811353-6870744d04b2',     # Executive consultation chamber interior
}

def grade_image(im, target_size=(1280, 720)):
    # Crop to ratio
    target_w, target_h = target_size
    target_ratio = target_w / target_h
    w, h = im.size
    current_ratio = w / h
    
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))
        
    im = im.resize(target_size, Image.Resampling.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(1.03)
    im = ImageEnhance.Contrast(im).enhance(1.05)
    im = ImageEnhance.Color(im).enhance(1.02)
    im = ImageEnhance.Sharpness(im).enhance(1.15)
    
    # Warm cream grading (#F8EFDF: 248, 239, 223)
    arr = np.array(im).astype(float)
    tint = np.array([248.0, 239.0, 223.0])
    arr = arr * (1.0 - 0.035) + tint * 0.035
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))

for rel_path, unsplash_id in images_map.items():
    dest_path = os.path.join('public', 'images', 'ai-generated', f"{rel_path}.webp")
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    url = f"https://images.unsplash.com/{unsplash_id}?auto=format&fit=crop&w=1600&q=85"
    print(f"Fetching {rel_path} from Unsplash {unsplash_id}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as res:
            raw_data = res.read()
            im = Image.open(io.BytesIO(raw_data)).convert('RGB')
            graded = grade_image(im, target_size=(1280, 720))
            graded.save(dest_path, 'WEBP', quality=90, method=6)
            print(f"Successfully saved {dest_path} ({os.path.getsize(dest_path)} bytes, size={graded.size})")
    except Exception as e:
        print(f"Failed {rel_path}: {e}")
