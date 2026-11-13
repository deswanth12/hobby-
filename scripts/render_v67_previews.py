#!/usr/bin/env python3
"""
Render high-resolution desktop and mobile previews for V6.7 concepts
and compose the master side-by-side comparison board.
Refined Concept A included as the leading candidate.
"""

import os
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFont

BROWSER_PATHS = [
    r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    r'C:\Program Files\Google\Chrome\Application\chrome.exe',
    r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
]

CONCEPTS = [
    {
        'id': 'concept_a',
        'html': 'V67_CLIENT_CONCEPT_STUDIO/concept_a.html',
        'desktop_png': 'V67_BROWN_GREEN_CONCEPT_A.png',
        'mobile_png': 'V67_BROWN_GREEN_CONCEPT_A_mobile.png',
        'title': 'Concept A: Walnut & Forest Botanical (Leading Candidate)',
        'subtitle': 'Warm Walnut (#2E1C14) & Distinct Forest Green (#16422F) on Ivory (#FAF7F0)',
        'contrast': 'Body Text: 15.19:1 (AAA) | Button: 11.32:1 (AAA) | Sage: 5.19:1 (AA)',
        'badge': 'LEADING CANDIDATE'
    },
    {
        'id': 'concept_b',
        'html': 'V67_CLIENT_CONCEPT_STUDIO/concept_b.html',
        'desktop_png': 'V67_BROWN_GREEN_CONCEPT_B.png',
        'mobile_png': 'V67_BROWN_GREEN_CONCEPT_B_mobile.png',
        'title': 'Concept B: Deep Chocolate & Muted Sage',
        'subtitle': 'Espresso Chocolate (#1E140E) & Sage (#3D5647) on Soft Alabaster (#F8F6F0)',
        'contrast': 'Body Text: 16.73:1 (AAA) | Button: 8.01:1 (AAA)',
        'badge': 'WARM EDITORIAL LUXURY'
    },
    {
        'id': 'concept_c',
        'html': 'V67_CLIENT_CONCEPT_STUDIO/concept_c.html',
        'desktop_png': 'V67_BROWN_GREEN_CONCEPT_C.png',
        'mobile_png': 'V67_BROWN_GREEN_CONCEPT_C_mobile.png',
        'title': 'Concept C: Botanical Emerald & Raw Umber',
        'subtitle': 'Botanical Spruce (#0F251E) & Umber (#32251D) on Porcelain Linen (#F9F9F6)',
        'contrast': 'Body Text: 15.27:1 (AAA) | Button: 16.11:1 (AAA)',
        'badge': 'BOTANICAL PRECISION'
    },
    {
        'id': 'concept_d',
        'html': 'V67_CLIENT_CONCEPT_STUDIO/concept_d.html',
        'desktop_png': 'V67_ALTERNATIVE_CONCEPT_D.png',
        'mobile_png': 'V67_ALTERNATIVE_CONCEPT_D_mobile.png',
        'title': 'Concept D: Architectural Slate & Royal Cognac',
        'subtitle': 'Architectural Slate (#1A222D) & Cognac (#A65D37) on Warm Chalk (#F6F7F9)',
        'contrast': 'Body Text: 14.95:1 (AAA) | Button: 16.02:1 (AAA)',
        'badge': 'NON-BROWN/GREEN BACKUP'
    }
]

ARTIFACT_DIR = r"C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151"

def find_browser():
    for p in BROWSER_PATHS:
        if os.path.exists(p):
            return p
    raise RuntimeError("No headless browser found.")

def render_screens():
    browser = find_browser()
    print(f"Using browser: {browser}")
    
    for c in CONCEPTS:
        html_abs = os.path.abspath(c['html']).replace('\\', '/')
        desktop_abs = os.path.abspath(c['desktop_png'])
        mobile_abs = os.path.abspath(c['mobile_png'])
        
        # Desktop 1440x6400
        print(f"Rendering desktop: {c['desktop_png']}...")
        cmd_desktop = [
            browser,
            '--headless=new',
            '--hide-scrollbars',
            '--window-size=1440,6400',
            f'--screenshot={desktop_abs}',
            f'file:///{html_abs}'
        ]
        res_d = subprocess.run(cmd_desktop, capture_output=True, text=True)
        if res_d.returncode != 0:
            print(f"Error desktop {c['id']}: {res_d.stderr}")
        else:
            print(f"  Saved {c['desktop_png']} ({os.path.getsize(desktop_abs)} bytes)")
            
        # Mobile 390x11200
        print(f"Rendering mobile: {c['mobile_png']}...")
        cmd_mobile = [
            browser,
            '--headless=new',
            '--hide-scrollbars',
            '--window-size=390,11200',
            f'--screenshot={mobile_abs}',
            f'file:///{html_abs}'
        ]
        res_m = subprocess.run(cmd_mobile, capture_output=True, text=True)
        if res_m.returncode != 0:
            print(f"Error mobile {c['id']}: {res_m.stderr}")
        else:
            print(f"  Saved {c['mobile_png']} ({os.path.getsize(mobile_abs)} bytes)")
            
        # Copy Concept A as explicit Refined output files
        if c['id'] == 'concept_a':
            refined_d = 'V67_CONCEPT_A_REFINED.png'
            refined_m = 'V67_CONCEPT_A_REFINED_mobile.png'
            shutil.copy2(desktop_abs, refined_d)
            shutil.copy2(mobile_abs, refined_m)
            print(f"  Copied {refined_d} and {refined_m}")

def compose_comparison():
    print("Composing V67_CONCEPT_COMPARISON.png...")
    
    board_w = 2560
    board_h = 3680
    bg_color = (244, 245, 247)
    
    board = Image.new("RGB", (board_w, board_h), bg_color)
    draw = ImageDraw.Draw(board)
    
    # Header Banner
    banner_h = 240
    draw.rectangle([(0, 0), (board_w, banner_h)], fill=(36, 22, 16))
    
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 52)
        font_sub = ImageFont.truetype("arial.ttf", 26)
        font_card_title = ImageFont.truetype("arialbd.ttf", 36)
        font_card_sub = ImageFont.truetype("arial.ttf", 22)
        font_badge = ImageFont.truetype("arialbd.ttf", 20)
    except Exception:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_card_title = ImageFont.load_default()
        font_card_sub = ImageFont.load_default()
        font_badge = ImageFont.load_default()
        
    draw.text((60, 45), "KAVITHA & ASSOCIATES — V6.7 CLIENT DESIGN CONCEPTS", fill=(255, 255, 255), font=font_title)
    draw.text((60, 115), "Leading Candidate: Concept A (Walnut & Forest Botanical) + Streamlined 9-Section Architecture", fill=(230, 225, 215), font=font_sub)
    draw.text((60, 155), "Dual CA & CMA Leadership (ICAI & ICMAI) • Big 4 & MNC Corporate Experience • 100% WCAG AAA/AA Compliant", fill=(195, 185, 175), font=font_sub)
    
    # Grid coordinates
    card_w = 1180
    card_h = 1580
    pad_x = 60
    gap_x = 80
    pad_y = banner_h + 50
    gap_y = 70
    
    coords = [
        (pad_x, pad_y),
        (pad_x + card_w + gap_x, pad_y),
        (pad_x, pad_y + card_h + gap_y),
        (pad_x + card_w + gap_x, pad_y + card_h + gap_y)
    ]
    
    for i, c in enumerate(CONCEPTS):
        x, y = coords[i]
        
        # Card outer border & background
        draw.rectangle([(x - 8, y - 8), (x + card_w + 8, y + card_h + 8)], fill=(255, 255, 255), outline=(215, 220, 228), width=2)
        
        # Header strip inside card
        strip_h = 90
        draw.rectangle([(x, y), (x + card_w, y + strip_h)], fill=(250, 250, 252), outline=(230, 233, 238), width=1)
        
        # Title & Subtitle inside strip
        draw.text((x + 20, y + 14), c['title'], fill=(36, 22, 16), font=font_card_title)
        draw.text((x + 20, y + 54), c['subtitle'], fill=(90, 85, 80), font=font_card_sub)
        
        # Badge on the right
        badge_text = c['badge']
        badge_color = (22, 66, 47) if 'LEADING' in badge_text else (140, 103, 55) if 'LUXURY' in badge_text else (30, 107, 82) if 'PRECISION' in badge_text else (166, 93, 55)
        draw.rectangle([(x + card_w - 290, y + 25), (x + card_w - 20, y + 65)], fill=badge_color)
        draw.text((x + card_w - 280, y + 33), badge_text, fill=(255, 255, 255), font=font_badge)
        
        # Crop top of desktop screenshot
        desktop_img = Image.open(c['desktop_png'])
        crop_box = (0, 0, 1440, 3600)
        cropped = desktop_img.crop(crop_box)
        resized = cropped.resize((card_w, card_h - strip_h), Image.Resampling.LANCZOS)
        
        board.paste(resized, (x, y + strip_h))
        
    out_comparison = 'V67_CONCEPT_COMPARISON.png'
    board.save(out_comparison, quality=95)
    print(f"Generated {out_comparison} ({os.path.getsize(out_comparison)} bytes)")

def mirror_to_artifacts():
    print(f"Mirroring files to artifacts directory: {ARTIFACT_DIR}...")
    os.makedirs(ARTIFACT_DIR, exist_ok=True)
    
    files_to_copy = [
        'V67_BROWN_GREEN_CONCEPT_A.png',
        'V67_BROWN_GREEN_CONCEPT_A_mobile.png',
        'V67_CONCEPT_A_REFINED.png',
        'V67_CONCEPT_A_REFINED_mobile.png',
        'V67_BROWN_GREEN_CONCEPT_B.png',
        'V67_BROWN_GREEN_CONCEPT_B_mobile.png',
        'V67_BROWN_GREEN_CONCEPT_C.png',
        'V67_BROWN_GREEN_CONCEPT_C_mobile.png',
        'V67_ALTERNATIVE_CONCEPT_D.png',
        'V67_ALTERNATIVE_CONCEPT_D_mobile.png',
        'V67_CONCEPT_COMPARISON.png',
        'V67_REFERENCE_WEBSITE_AUDIT.md',
        'V67_BROCHURE_CONTENT_MAPPING.md',
        'V67_CONTENT_SIMPLIFICATION_REPORT.md',
        'V67_COLOUR_DIRECTION_PROPOSALS.md',
        'V67_DESIGN_CONCEPT_COMPARISON.md',
        'V67_ACCESSIBILITY_REPORT.md',
        'V67_CLIENT_APPROVAL_PRESENTATION.md',
        'V67_FINAL_VALIDATION_REPORT.md'
    ]
    
    for fname in files_to_copy:
        if os.path.exists(fname):
            dest = os.path.join(ARTIFACT_DIR, fname)
            shutil.copy2(fname, dest)
            print(f"  Copied {fname} -> artifacts")
        else:
            print(f"  Warning: {fname} does not exist!")

if __name__ == '__main__':
    render_screens()
    compose_comparison()
    mirror_to_artifacts()
    print("All renders and artifacts completed successfully!")
