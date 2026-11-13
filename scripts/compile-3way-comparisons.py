import os
from PIL import Image, ImageDraw, ImageFont

out_dir = 'reports/color_comparisons'
os.makedirs(out_dir, exist_ok=True)

triplets = [
    (
        'homepage',
        'reports/color_redesign_before/before_homepage_1440px.png',
        'reports/v4_1_snapshots/after_homepage_1440px.png',
        'reports/v4_2_cream/v4_2_homepage_1440px.png'
    ),
    (
        'about',
        'reports/color_redesign_before/before_about_1440px.png',
        'reports/v4_1_snapshots/after_about_1440px.png',
        'reports/v4_2_cream/v4_2_about_1440px.png'
    ),
    (
        'services',
        'reports/color_redesign_before/before_services_1440px.png',
        'reports/v4_1_snapshots/after_services_1440px.png',
        'reports/v4_2_cream/v4_2_services_1440px.png'
    ),
    (
        'contact',
        'reports/color_redesign_before/before_contact_1440px.png',
        'reports/v4_1_snapshots/after_contact_1440px.png',
        'reports/v4_2_cream/v4_2_contact_1440px.png'
    ),
    (
        'why_choose_us',
        'reports/final_visual_qa/why_choose_us_1440px.png',
        'reports/why_choose_us_refined/why_choose_us_refined_1440px.png',
        'reports/v4_2_cream/v4_2_section_why_choose_us_1440px.png'
    ),
    (
        'mobile_home',
        'reports/color_redesign_before/before_homepage_390px.png',
        'reports/v4_1_snapshots/after_homepage_390px.png',
        'reports/v4_2_cream/v4_2_homepage_390px.png'
    ),
]

for name, v4_path, v41_path, v42_path in triplets:
    if not (os.path.exists(v4_path) and os.path.exists(v41_path) and os.path.exists(v42_path)):
        print(f"Skipping {name}, missing one of: {v4_path}, {v41_path}, {v42_path}")
        continue
    
    img_v4 = Image.open(v4_path)
    img_v41 = Image.open(v41_path)
    img_v42 = Image.open(v42_path)
    
    target_h = min(img_v4.height, img_v41.height, img_v42.height)
    w_v4 = int(img_v4.width * (target_h / img_v4.height))
    w_v41 = int(img_v41.width * (target_h / img_v41.height))
    w_v42 = int(img_v42.width * (target_h / img_v42.height))
    
    r_v4 = img_v4.resize((w_v4, target_h), Image.Resampling.LANCZOS)
    r_v41 = img_v41.resize((w_v41, target_h), Image.Resampling.LANCZOS)
    r_v42 = img_v42.resize((w_v42, target_h), Image.Resampling.LANCZOS)
    
    header_h = 64
    gutter = 16
    total_w = w_v4 + w_v41 + w_v42 + (gutter * 2)
    total_h = target_h + header_h
    
    # Warm cream luxury canvas backing
    canvas = Image.new('RGB', (total_w, total_h), color=(248, 239, 223))
    draw = ImageDraw.Draw(canvas)
    
    # 1. V4 Header (Muted Parchment)
    draw.rectangle([0, 0, w_v4, header_h], fill=(235, 230, 220))
    draw.text((16, 20), f"V4: Subdued & Muted ({name.upper()})", fill=(60, 60, 55))
    
    # 2. V4.1 Header (Too White / Stark)
    draw.rectangle([w_v4 + gutter, 0, w_v4 + gutter + w_v41, header_h], fill=(255, 255, 255))
    draw.text((w_v4 + gutter + 16, 20), f"V4.1: Too White & Light ({name.upper()})", fill=(100, 100, 100))
    
    # 3. V4.2 Header (Warm Cream Luxury)
    draw.rectangle([w_v4 + gutter + w_v41 + gutter, 0, total_w, header_h], fill=(245, 234, 216))
    draw.text((w_v4 + gutter + w_v41 + gutter + 16, 20), f"V4.2: Warm Cream Luxury [APPROVED] ({name.upper()})", fill=(21, 63, 50))
    
    # Paste panels
    canvas.paste(r_v4, (0, header_h))
    canvas.paste(r_v41, (w_v4 + gutter, header_h))
    canvas.paste(r_v42, (w_v4 + gutter + w_v41 + gutter, header_h))
    
    out_file = os.path.join(out_dir, f"{name}_v4_vs_v41_vs_v42.png")
    canvas.save(out_file, optimize=True)
    print(f"[OK] Saved 3-way comparison: {out_file} ({canvas.width}x{canvas.height})")

# Also generate a responsive 4-viewport showcase of V4.2
v42_viewports = [
    ('1440px Desktop', 'reports/v4_2_cream/v4_2_homepage_1440px.png'),
    ('768px Tablet', 'reports/v4_2_cream/v4_2_homepage_768px.png'),
    ('390px Mobile', 'reports/v4_2_cream/v4_2_homepage_390px.png'),
]

v42_imgs = []
for label, p in v42_viewports:
    if os.path.exists(p):
        v42_imgs.append((label, Image.open(p)))

if len(v42_imgs) == 3:
    target_h = 700
    res_imgs = []
    tot_w = 0
    for label, im in v42_imgs:
        w = int(im.width * (target_h / im.height))
        res_imgs.append((label, im.resize((w, target_h), Image.Resampling.LANCZOS)))
        tot_w += w
    
    gutter = 16
    grid_w = tot_w + (gutter * (len(res_imgs) - 1))
    grid_h = target_h + 70
    
    grid_canvas = Image.new('RGB', (grid_w, grid_h), color=(245, 234, 216))
    gdraw = ImageDraw.Draw(grid_canvas)
    
    cur_x = 0
    for label, im in res_imgs:
        gdraw.rectangle([cur_x, 0, cur_x + im.width, 60], fill=(248, 239, 223))
        gdraw.text((cur_x + 16, 20), f"V4.2 Warm Cream - {label}", fill=(21, 63, 50))
        grid_canvas.paste(im, (cur_x, 60))
        cur_x += im.width + gutter
    
    grid_out = os.path.join(out_dir, 'v4_2_responsive_showcase.png')
    grid_canvas.save(grid_out, optimize=True)
    print(f"[OK] Saved V4.2 responsive showcase: {grid_out}")

# Stitch vertical full homepage scroll from key sections
section_files = [
    'reports/v4_2_cream/v4_2_section_hero_1440px.png',
    'reports/v4_2_cream/v4_2_audit_spotlight_1440px.png',
    'reports/v4_2_cream/v4_2_section_working_process_1440px.png',
    'reports/v4_2_cream/v4_2_section_about_1440px.png',
    'reports/v4_2_cream/v4_2_section_why_choose_us_1440px.png',
    'reports/v4_2_cream/v4_2_section_contact_1440px.png',
]

existing_sections = [Image.open(f) for f in section_files if os.path.exists(f)]
if existing_sections:
    target_width = 1440
    scaled_secs = []
    tot_h = 0
    for im in existing_sections:
        h = int(im.height * (target_width / im.width))
        sc = im.resize((target_width, h), Image.Resampling.LANCZOS)
        scaled_secs.append(sc)
        tot_h += h
    
    full_scroll = Image.new('RGB', (target_width, tot_h), color=(248, 239, 223))
    curr_y = 0
    for sc in scaled_secs:
        full_scroll.paste(sc, (0, curr_y))
        curr_y += sc.height
    
    scroll_out = 'reports/v4_2_cream/v4_2_homepage_full_scroll_1440px.png'
    full_scroll.save(scroll_out, optimize=True)
    print(f"[OK] Saved stitched full homepage scroll: {scroll_out} ({full_scroll.width}x{full_scroll.height})")
