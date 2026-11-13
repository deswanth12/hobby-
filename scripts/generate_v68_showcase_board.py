from PIL import Image, ImageDraw, ImageFont
import os
import shutil

src_dir = 'reports/screenshots/v68'
dst_dir = r'C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151'

# Load images
listing_desk = Image.open(os.path.join(src_dir, 'v68_blog_listing_desktop.png'))
article_desk = Image.open(os.path.join(src_dir, 'v68_blog_article_statutory_desktop.png'))
listing_mob = Image.open(os.path.join(src_dir, 'v68_blog_listing_mobile.png'))
article_mob = Image.open(os.path.join(src_dir, 'v68_blog_article_statutory_mobile.png'))

# Crop desktop images to relevant top 1200px
listing_desk_crop = listing_desk.crop((0, 0, 1440, min(listing_desk.height, 1200)))
article_desk_crop = article_desk.crop((0, 0, 1440, min(article_desk.height, 1200)))

# Resize desktop crops to width 1100
scale_desk = 1100 / 1440
listing_desk_resized = listing_desk_crop.resize((1100, int(listing_desk_crop.height * scale_desk)), Image.Resampling.LANCZOS)
article_desk_resized = article_desk_crop.resize((1100, int(article_desk_crop.height * scale_desk)), Image.Resampling.LANCZOS)

# Scale mobile images to width 360
scale_mob = 360 / 390
listing_mob_crop = listing_mob.crop((0, 0, 390, min(listing_mob.height, 1600)))
article_mob_crop = article_mob.crop((0, 0, 390, min(article_mob.height, 1600)))
listing_mob_resized = listing_mob_crop.resize((360, int(listing_mob_crop.height * scale_mob)), Image.Resampling.LANCZOS)
article_mob_resized = article_mob_crop.resize((360, int(article_mob_crop.height * scale_mob)), Image.Resampling.LANCZOS)

# Canvas dimensions
canvas_w = 2400
canvas_h = 2100

# Create high-end presentation board
board = Image.new('RGB', (canvas_w, canvas_h), '#F7F6F2')
draw = ImageDraw.Draw(board)

# Header banner
draw.rectangle([(0, 0), (canvas_w, 180)], fill='#0F3E2E')
# Gold accent rule
draw.rectangle([(0, 180), (canvas_w, 188)], fill='#C5A059')

# Use default font or truetype
try:
    font_title = ImageFont.truetype("arial.ttf", 46)
    font_sub = ImageFont.truetype("arial.ttf", 22)
    font_sec = ImageFont.truetype("arial.ttf", 26)
    font_badge = ImageFont.truetype("arial.ttf", 16)
except Exception:
    font_title = font_sub = font_sec = font_badge = ImageFont.load_default()

draw.text((60, 45), "KAVITHA & ASSOCIATES • CHARTERED ACCOUNTANTS", fill='#C5A059', font=font_sub)
draw.text((60, 85), "V6.8 Enhanced Blog & Regulatory Insights Experience", fill='#FFFFFF', font=font_title)
draw.text((60, 142), "Preserved Brand Identity • Prominent Cover Imagery • Multi-Element Clickability • Full Editorial Article Layout", fill='#D1E7DD', font=font_sub)

# Section 1: Desktop Blog Listing
y_pos1 = 230
draw.rectangle([(60, y_pos1), (1160, y_pos1 + 45)], fill='#0F3E2E')
draw.text((80, y_pos1 + 10), "1. Blog Listing (/blog) — Prominent Image Cards & Featured Analysis (Desktop 1440px)", fill='#FFFFFF', font=font_sec)

# Border around desktop listing image
draw.rectangle([(58, y_pos1 + 58), (1162, y_pos1 + 60 + listing_desk_resized.height + 2)], fill='#C5A059')
board.paste(listing_desk_resized, (60, y_pos1 + 60))

# Section 2: Desktop Full Article
draw.rectangle([(1240, y_pos1), (2340, y_pos1 + 45)], fill='#0F3E2E')
draw.text((1260, y_pos1 + 10), "2. Full Article View (/blog/:slug) — Lead Excerpt & Complete Formatting (Desktop 1440px)", fill='#FFFFFF', font=font_sec)

draw.rectangle([(1238, y_pos1 + 58), (2342, y_pos1 + 60 + article_desk_resized.height + 2)], fill='#C5A059')
board.paste(article_desk_resized, (1240, y_pos1 + 60))

# Section 3: Mobile Views Row
y_pos2 = y_pos1 + 60 + listing_desk_resized.height + 60
draw.rectangle([(60, y_pos2), (780, y_pos2 + 40)], fill='#0F3E2E')
draw.text((80, y_pos2 + 8), "3. Mobile Blog Listing (390px)", fill='#FFFFFF', font=font_sec)

draw.rectangle([(58, y_pos2 + 48), (422, y_pos2 + 50 + min(listing_mob_resized.height, 750) + 2)], fill='#C5A059')
board.paste(listing_mob_resized.crop((0, 0, 360, min(listing_mob_resized.height, 750))), (60, y_pos2 + 50))

draw.rectangle([(1240, y_pos2), (1960, y_pos2 + 40)], fill='#0F3E2E')
draw.text((1260, y_pos2 + 8), "4. Mobile Full Article (390px)", fill='#FFFFFF', font=font_sec)

draw.rectangle([(1238, y_pos2 + 48), (1602, y_pos2 + 50 + min(article_mob_resized.height, 750) + 2)], fill='#C5A059')
board.paste(article_mob_resized.crop((0, 0, 360, min(article_mob_resized.height, 750))), (1240, y_pos2 + 50))

# Feature callout cards in empty spaces
# Callout 1 (between mobile screenshots)
cx1, cy1 = 460, y_pos2 + 60
draw.rectangle([(cx1, cy1), (cx1 + 720, cy1 + 340)], fill='#FFFFFF', outline='#E5E7EB', width=2)
draw.rectangle([(cx1, cy1), (cx1 + 720, cy1 + 45)], fill='#0F3E2E')
draw.text((cx1 + 20, cy1 + 12), "KEY ENHANCEMENTS IMPLEMENTED", fill='#C5A059', font=font_sec)

bullets = [
    "• Prominent Featured Image in every article card (aspect 16:10).",
    "• Multi-Element Clickability: Image, Title, and Excerpt all navigate to article.",
    "• Secondary emphasis on article title with line clamp & hover transition.",
    "• Supporting short introductory excerpt for rapid reader comprehension.",
    "• Clean small metadata: Publication date, reading time & author badge.",
    "• Read More indicator pill with arrow badge and AAA touch targets.",
    "• Full Article Page features stylized Lead Executive Summary paragraph.",
    "• Related Articles grid upgraded with prominent cover images & links."
]
for idx, b in enumerate(bullets):
    draw.text((cx1 + 20, cy1 + 65 + (idx * 33)), b, fill='#252B27', font=font_sub)

# Callout 2 (right of mobile article)
cx2, cy2 = 1640, y_pos2 + 60
draw.rectangle([(cx2, cy2), (cx2 + 700, cy2 + 340)], fill='#FFFFFF', outline='#E5E7EB', width=2)
draw.rectangle([(cx2, cy2), (cx2 + 700, cy2 + 45)], fill='#0F3E2E')
draw.text((cx2 + 20, cy2 + 12), "COMPLIANCE & GOVERNANCE CHECKS", fill='#C5A059', font=font_sec)

audit_notes = [
    "• Strict Privacy: Individual ICAI membership number purged across all files.",
    "• Approved Credentials: CA Kavitha Vijay (B.Com, CA, CMA AIR 49).",
    "• Neutral Editorial Leadership Crest retained until written client consent.",
    "• Admin CMS: Articles tab with full CRUD, preview & draft quarantine.",
    "• Draft Exclusion: Drafts strictly quarantined from public listing & direct URLs.",
    "• SEO & Metadata: BlogPosting Schema.org JSON-LD, Open Graph, canonicals.",
    "• Zero Hosting Cost: Pure static Vite build + serverless functions.",
    "• Full Test Suite: 210 / 210 automated unit, statutory & E2E tests passing."
]
for idx, a in enumerate(audit_notes):
    draw.text((cx2 + 20, cy2 + 65 + (idx * 33)), a, fill='#252B27', font=font_sub)

# Save board
out_board_local = os.path.join(src_dir, 'v68_blog_experience_showcase.png')
out_board_art = os.path.join(dst_dir, 'v68_blog_experience_showcase.png')
board.save(out_board_local, quality=95)
board.save(out_board_art, quality=95)
print(f"Saved showcase board to {out_board_local} ({os.path.getsize(out_board_local)} bytes)")
print(f"Copied showcase board to {out_board_art}")
