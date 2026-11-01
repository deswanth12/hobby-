"""
Script to generate Luxury Editorial branded WebP blog cover images for Kavitha & Associates.
Dimensions: 1200x630 (Standard OpenGraph 1.91:1)
Palette:
  - Forest Green: #153F32 (21, 63, 50)
  - Deep Chambers: #102D25 (16, 45, 37)
  - Warm Ivory: #F5F1E8 (245, 241, 232)
  - Muted Gold: #C3A66B (195, 166, 107)
  - Dark Gold: #73561E (115, 86, 30)
  - Sage Accent: #8EA89D (142, 168, 157)
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_blog_cover(
    filename,
    category,
    title_lines,
    subtitle,
    statutory_tags,
    accent_code="TAX-2026"
):
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (16, 45, 37, 255)) # Deep Chambers #102D25
    draw = ImageDraw.Draw(img)

    # 1. Subtle Background Depth / Vignette
    # Create radial gradient overlay
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Soft centered glow with Forest Green
    for r in range(500, 100, -20):
        alpha = int(18 * (1 - (r - 100) / 400.0))
        ov_draw.ellipse([W//2 - r*1.3, H//2 - r, W//2 + r*1.3, H//2 + r], fill=(21, 63, 50, alpha))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # 2. Subtle Geometric Grid / Watermark lines
    grid_color = (195, 166, 107, 18) # 7% gold
    for x in range(60, W - 60, 120):
        draw.line([(x, 40), (x, H - 40)], fill=grid_color, width=1)
    for y in range(60, H - 40, 90):
        draw.line([(40, y), (W - 40, y)], fill=grid_color, width=1)

    # 3. Double-Bezel Border (Brand Signature)
    gold = (195, 166, 107, 255)
    gold_muted = (195, 166, 107, 100)
    gold_dark = (115, 86, 30, 255)
    ivory = (245, 241, 232, 255)
    sage = (142, 168, 157, 255)

    # Outer border
    draw.rectangle([32, 32, W - 32, H - 32], outline=gold, width=2)
    # Inner border
    draw.rectangle([40, 40, W - 40, H - 40], outline=gold_muted, width=1)

    # Corner decorative squares
    for (cx, cy) in [(32, 32), (W-32, 32), (32, H-32), (W-32, H-32)]:
        draw.rectangle([cx-4, cy-4, cx+4, cy+4], fill=gold)

    # 4. Fonts
    font_serif_path = "C:\\Windows\\Fonts\\georgiab.ttf"
    font_serif_reg_path = "C:\\Windows\\Fonts\\georgia.ttf"
    font_sans_path = "C:\\Windows\\Fonts\\calibrib.ttf"
    font_sans_reg_path = "C:\\Windows\\Fonts\\calibri.ttf"

    font_brand = ImageFont.truetype(font_sans_path, 17)
    font_badge = ImageFont.truetype(font_sans_path, 15)
    font_category = ImageFont.truetype(font_sans_path, 14)
    font_title = ImageFont.truetype(font_serif_path, 38)
    font_subtitle = ImageFont.truetype(font_sans_reg_path, 21)
    font_meta = ImageFont.truetype(font_sans_path, 15)
    font_footer_reg = ImageFont.truetype(font_sans_reg_path, 14)

    # 5. Header Band
    # Top Left: Firm Name & Estd
    draw.text((65, 58), "KAVITHA & ASSOCIATES", font=font_brand, fill=gold)
    draw.text((275, 59), "•   CHARTERED ACCOUNTANTS", font=font_brand, fill=ivory)
    
    # Top Right: Reference Code / Research Tag
    tag_text = f"PRACTICE RESEARCH BULLETIN  |  REF {accent_code}"
    # Calculate text width
    bbox = font_badge.getbbox(tag_text)
    tw = bbox[2] - bbox[0]
    draw.text((W - 65 - tw, 58), tag_text, font=font_badge, fill=gold)

    # Divider below header
    draw.line([(65, 95), (W - 65, 95)], fill=(195, 166, 107, 80), width=1)

    # 6. Category Pill Badge
    cat_text = f"  {category.upper()}  "
    c_bbox = font_category.getbbox(cat_text)
    cw = c_bbox[2] - c_bbox[0] + 24
    ch = 30
    cat_y = 135
    # Pill background
    draw.rounded_rectangle([65, cat_y, 65 + cw, cat_y + ch], radius=5, fill=(21, 63, 50, 220), outline=gold, width=1)
    draw.text((77, cat_y + 6), cat_text, font=font_category, fill=gold)

    # 7. Article Title (Multi-line serif)
    title_y = 195
    for line in title_lines:
        draw.text((65, title_y), line, font=font_title, fill=ivory)
        title_y += 52

    # 8. Subtitle / Summary Focus
    title_y += 10
    draw.text((65, title_y), subtitle, font=font_subtitle, fill=sage)

    # 9. Statutory Tags / Chips
    tags_y = title_y + 45
    curr_x = 65
    for tag in statutory_tags:
        t_box = font_category.getbbox(tag)
        t_w = t_box[2] - t_box[0] + 20
        draw.rounded_rectangle([curr_x, tags_y, curr_x + t_w, tags_y + 26], radius=4, fill=(10, 30, 24, 200), outline=(195, 166, 107, 120), width=1)
        draw.text((curr_x + 10, tags_y + 5), tag, font=font_category, fill=ivory)
        curr_x += t_w + 12

    # 10. Footer Band & Lead Partner Credentials
    footer_divider_y = H - 110
    draw.line([(65, footer_divider_y), (W - 65, footer_divider_y)], fill=(195, 166, 107, 80), width=1)

    # Author Credentials (Left)
    draw.text((65, H - 92), "CA KAVITHA VIJAY", font=font_meta, fill=gold)
    draw.text((215, H - 92), "B.Com, FCA, CMA (AIR 49)  •  MANAGING PARTNER", font=font_meta, fill=ivory)
    draw.text((65, H - 68), "Principal Chambers: 19-12-46, Bairagi Patteda, Tirupati, AP 517501  •  ICAI Ethics Standard SA 700", font=font_footer_reg, fill=sage)

    # Official Seal Medallion (Right)
    seal_path = "public/brand/ka-seal-medallion.webp"
    if not os.path.exists(seal_path):
        seal_path = "public/brand/ka-seal-medallion.png"
    if os.path.exists(seal_path):
        seal = Image.open(seal_path).convert("RGBA")
        seal_size = (110, int(110 * seal.height / seal.width))
        seal_resized = seal.resize(seal_size, Image.Resampling.LANCZOS)
        # Paste seal in bottom right corner (overlapping footer cleanly)
        img.paste(seal_resized, (W - 190, H - 135), seal_resized)

    # Save as high-quality WebP
    out_dir = "public/uploads/blog"
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, filename)
    img_rgb = img.convert("RGB")
    img_rgb.save(out_path, "WEBP", quality=92, method=6)
    print(f"Generated {out_path} ({os.path.getsize(out_path):,} bytes)")

if __name__ == "__main__":
    posts = [
        {
            "filename": "corporate-tax-planning-2026.webp",
            "category": "Direct Taxation & Corporate Law",
            "title_lines": [
                "Corporate Tax Planning & Assessment Strategies",
                "under the Income Tax Act, 1961 for FY 2025-26"
            ],
            "subtitle": "Section 115BAA Regime Evaluation • MAT Credit Optimization • Faceless Defense",
            "statutory_tags": ["Sec 115BAA", "MAT Sec 115JB", "AIS/TIS Triangulation", "Advance Tax", "NaFAC Scrutiny"],
            "accent_code": "IT-115BAA"
        },
        {
            "filename": "gst-annual-return-compliance.webp",
            "category": "Indirect Taxation & GST Compliance",
            "title_lines": [
                "GST Annual Return & Reconciliation Statement:",
                "Technical Audit Protocol for Form GSTR-9 & 9C"
            ],
            "subtitle": "CGST Section 44 Compliance • Table 8D ITC Matching • DRC-01A Notice Safeguards",
            "statutory_tags": ["Form GSTR-9", "Form GSTR-9C", "Sec 16(2)(aa) ITC", "Table 14 Turnover", "Rule 80"],
            "accent_code": "GST-GSTR9"
        },
        {
            "filename": "statutory-audit-guidelines-2026.webp",
            "category": "Statutory Audit & Assurance",
            "title_lines": [
                "Statutory Audit Guidelines under Companies Act 2013:",
                "Auditor Obligations & Reporting Norms FY 2025-26"
            ],
            "subtitle": "Section 143 Reporting Framework • CARO 2020 Order • Internal Financial Controls (IFC)",
            "statutory_tags": ["Companies Act 2013", "CARO 2020", "ICAI SA 700/705", "IFC Testing", "NFRA Compliance"],
            "accent_code": "AUD-SEC143"
        },
        {
            "filename": "internal-audit-best-practices.webp",
            "category": "Internal Audit & Risk Governance",
            "title_lines": [
                "Internal Audit Framework & Operational Risk Appraisal:",
                "Control Architecture for Growing Corporate Enterprises"
            ],
            "subtitle": "Section 138 Mandate • Enterprise Risk Management • Fraud Detection & IFC Matrix",
            "statutory_tags": ["Sec 138 Mandate", "Risk-Based IA", "SIA Framework", "Fraud Risk Matrix", "Audit Committee"],
            "accent_code": "IA-SEC138"
        }
    ]

    for p in posts:
        create_blog_cover(
            p["filename"],
            p["category"],
            p["title_lines"],
            p["subtitle"],
            p["statutory_tags"],
            p["accent_code"]
        )
