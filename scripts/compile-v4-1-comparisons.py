import os
from PIL import Image, ImageDraw, ImageFont

out_dir = 'reports/color_comparisons'
os.makedirs(out_dir, exist_ok=True)

pairs = [
    ('homepage', 'reports/color_redesign_before/before_homepage_1440px.png', 'reports/color_redesign_after/after_homepage_1440px.png'),
    ('services', 'reports/color_redesign_before/before_services_1440px.png', 'reports/color_redesign_after/after_services_1440px.png'),
    ('contact', 'reports/color_redesign_before/before_contact_1440px.png', 'reports/color_redesign_after/after_contact_1440px.png'),
    ('about', 'reports/color_redesign_before/before_about_1440px.png', 'reports/color_redesign_after/after_about_1440px.png'),
    ('audit_spotlight', 'reports/color_redesign_before/before_audit_spotlight_1440px.png', 'reports/color_redesign_after/after_audit_spotlight_1440px.png'),
    ('mobile_home', 'reports/color_redesign_before/before_homepage_390px.png', 'reports/color_redesign_after/after_homepage_390px.png'),
]

for name, before_p, after_p in pairs:
    if not (os.path.exists(before_p) and os.path.exists(after_p)):
        print(f"Skipping {name}, files not found: {before_p}, {after_p}")
        continue
    
    img_b = Image.open(before_p)
    img_a = Image.open(after_p)
    
    target_h = min(img_b.height, img_a.height)
    wb = int(img_b.width * (target_h / img_b.height))
    wa = int(img_a.width * (target_h / img_a.height))
    
    rb = img_b.resize((wb, target_h), Image.Resampling.LANCZOS)
    ra = img_a.resize((wa, target_h), Image.Resampling.LANCZOS)
    
    header_h = 60
    total_w = wb + wa + 20
    total_h = target_h + header_h
    
    canvas = Image.new('RGB', (total_w, total_h), color=(255, 253, 249))
    draw = ImageDraw.Draw(canvas)
    
    # Draw headers
    draw.rectangle([0, 0, wb, header_h], fill=(245, 241, 232))
    draw.rectangle([wb + 20, 0, total_w, header_h], fill=(237, 247, 238))
    
    # Text banner labels
    draw.text((20, 18), f"BEFORE: V4 Muted & Subdued ({name.upper()})", fill=(37, 43, 39))
    draw.text((wb + 40, 18), f"AFTER: V4.1 Brighter & Vibrant ({name.upper()})", fill=(21, 63, 50))
    
    # Paste images
    canvas.paste(rb, (0, header_h))
    canvas.paste(ra, (wb + 20, header_h))
    
    out_path = os.path.join(out_dir, f"{name}_comparison.png")
    canvas.save(out_path, optimize=True)
    print(f"Generated comparison: {out_path} ({canvas.width}x{canvas.height})")

# Generate responsive overview grid (1440px, 1024px, 768px, 390px)
viewports = [
    ('1440px Desktop', 'reports/color_redesign_after/after_homepage_1440px.png'),
    ('1024px Laptop', 'reports/color_redesign_after/after_homepage_1024px.png'),
    ('768px Tablet', 'reports/color_redesign_after/after_homepage_768px.png'),
    ('390px Mobile', 'reports/color_redesign_after/after_homepage_390px.png'),
]

v_imgs = []
target_h = 700
total_w = 0
header_h = 45

for label, p in viewports:
    if os.path.exists(p):
        im = Image.open(p)
        w = int(im.width * (target_h / im.height))
        r = im.resize((w, target_h), Image.Resampling.LANCZOS)
        v_imgs.append((label, r, w))
        total_w += w + 16

if v_imgs:
    grid_canvas = Image.new('RGB', (total_w, target_h + header_h), color=(255, 253, 249))
    draw_g = ImageDraw.Draw(grid_canvas)
    cur_x = 0
    for label, im, w in v_imgs:
        draw_g.rectangle([cur_x, 0, cur_x + w, header_h], fill=(237, 247, 238))
        draw_g.text((cur_x + 12, 14), f"V4.1 {label}", fill=(21, 63, 50))
        grid_canvas.paste(im, (cur_x, header_h))
        cur_x += w + 16
    
    grid_out = os.path.join(out_dir, "responsive_v4_1_comparison_grid.png")
    grid_canvas.save(grid_out, optimize=True)
    print(f"Generated responsive grid: {grid_out} ({grid_canvas.width}x{grid_canvas.height})")

print("All comparison images created successfully!")
