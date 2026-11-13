import urllib.request
from PIL import Image, ImageEnhance
import numpy as np
import io
import os

images_map = {
    'why-choose-us/consultation': 'photo-1573497019940-1c28c88b4f3e',  # Indian corporate advisory leader in modern office
    'why-choose-us/analysis': 'photo-1460925895917-afdab827c52f',      # Financial analysis, scrutiny and data sheets
    'about/leadership-space': 'photo-1507679799987-c73779587ccf',      # Executive leadership space
    'about/office-interior': 'photo-1497366754035-f200968a6e72',       # Premium modern office interior library
    'industries/manufacturing': 'photo-1581091226825-a6a2a5aee158',    # Precision manufacturing & engineering
    'industries/technology': 'photo-1522071820081-009f0129c71c',       # Tech startups and software
    'industries/corporate': 'photo-1486406146926-c627a92ad1ab',        # Commercial corporate enterprises
}

def grade_image(im, target_size=(1280, 720)):
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
            size = (1200, 800) if 'analysis' in rel_path else (1280, 720)
            graded = grade_image(im, target_size=size)
            graded.save(dest_path, 'WEBP', quality=90, method=6)
            print(f"Successfully saved {dest_path} ({os.path.getsize(dest_path)} bytes, size={graded.size})")
    except Exception as e:
        print(f"Failed {rel_path}: {e}")
