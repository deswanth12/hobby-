import os
from PIL import Image, ImageDraw, ImageFont

artifact_dir = r"C:\Users\k deswanth\.gemini\antigravity\brain\915eb0d1-0751-489f-a770-da815fa3ba6c"
output_path = os.path.join(artifact_dir, "google_search_favicon_comparison.png")

# Canvas dimensions
w, h = 900, 480
img = Image.new("RGB", (w, h), "#181A1B")
draw = ImageDraw.Draw(img)

# Fonts
font_dir = os.path.join(os.environ["WINDIR"], "Fonts")
title_font = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 18)
subtitle_font = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 13)
status_font = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 14)
url_font = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 14)
link_font = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 20)
desc_font = ImageFont.truetype(os.path.join(font_dir, "segoeui.ttf"), 14)
badge_font = ImageFont.truetype(os.path.join(font_dir, "segoeuib.ttf"), 12)

# Load logo
logo_path = r"C:\kavatha ca\public\favicon-48x48.png"
logo = Image.open(logo_path).convert("RGBA")
logo_resized = logo.resize((26, 26), Image.Resampling.LANCZOS)

# Section 1: CURRENT LIVE PRODUCTION (Globe Icon)
y1 = 30
# Card background
draw.rounded_rectangle([30, y1, 870, y1 + 180], radius=12, fill="#202124", outline="#3c4043", width=1)
# Status Badge
draw.rounded_rectangle([50, y1 + 16, 210, y1 + 40], radius=6, fill="#3c2020", outline="#ea4335", width=1)
draw.text((60, y1 + 21), "CURRENT LIVE STATUS", font=badge_font, fill="#f28b82")
draw.text((225, y1 + 21), "• Missing 48x48 PNG in live HTML (only SVG present) -> Google shows default globe", font=subtitle_font, fill="#9aa0a6")

# Globe icon mock
globe_x, globe_y = 52, y1 + 55
draw.ellipse([globe_x, globe_y, globe_x + 28, globe_y + 28], fill="#303134", outline="#5f6368", width=1)
# draw simple globe meridians
draw.ellipse([globe_x + 4, globe_y + 4, globe_x + 24, globe_y + 24], outline="#9aa0a6", width=1)
draw.line([globe_x + 4, globe_y + 14, globe_x + 24, globe_y + 14], fill="#9aa0a6", width=1)
draw.ellipse([globe_x + 9, globe_y + 4, globe_x + 19, globe_y + 24], outline="#9aa0a6", width=1)

# Search Snippet URL
draw.text((globe_x + 38, globe_y + 4), "https://kavithaassociates.com", font=url_font, fill="#dadce0")
draw.text((globe_x + 265, globe_y + 4), "⋮", font=url_font, fill="#9aa0a6")

# Link Title
draw.text((50, y1 + 94), "Chartered Accountants & Cost Accountants | Tirupati & Pan India", font=link_font, fill="#8ab4f8")

# Snippet Description
desc1 = "Kavitha & Associates. Chartered Accountants. Dependable, compliant, and growth-oriented Chartered\nAccountancy services providing financial, audit, tax, and corporate advisory."
draw.text((50, y1 + 126), desc1, font=desc_font, fill="#bdc1c6", spacing=4)


# Section 2: TARGET STATE WITH CUSTOM LOGO
y2 = 250
# Card background
draw.rounded_rectangle([30, y2, 870, y2 + 195], radius=12, fill="#202124", outline="#1e463a", width=2)
# Status Badge
draw.rounded_rectangle([50, y2 + 16, 275, y2 + 40], radius=6, fill="#123524", outline="#34a853", width=1)
draw.text((60, y2 + 21), "TARGET STATE AFTER DEPLOYMENT", font=badge_font, fill="#81c995")
draw.text((290, y2 + 21), "• Standard 48x48 PNG favicon indexed by Googlebot-Image", font=subtitle_font, fill="#9aa0a6")

# Logo Favicon badge
fav_x, fav_y = 52, y2 + 55
# Circular white/gold badge backing
draw.ellipse([fav_x, fav_y, fav_x + 28, fav_y + 28], fill="#FFFFFF", outline="#D8C296", width=1)
# Paste logo in center
img.paste(logo_resized, (fav_x + 1, fav_y + 1), logo_resized)

# Search Snippet URL
draw.text((fav_x + 38, fav_y + 4), "https://kavithaassociates.com", font=url_font, fill="#dadce0")
draw.text((fav_x + 265, fav_y + 4), "⋮", font=url_font, fill="#9aa0a6")

# Link Title
draw.text((50, y2 + 94), "Chartered Accountant in Tirupati | Statutory Rigor & Commercial Tax", font=link_font, fill="#8ab4f8")

# Snippet Description
desc2 = "Kavitha & Associates. Independent Chartered Accountancy practice led by CA Kavitha Vijay in Tirupati.\nStatutory & Internal Audit, Income Tax, GST, Corporate Compliance, and Strategic Advisory."
draw.text((50, y2 + 126), desc2, font=desc_font, fill="#bdc1c6", spacing=4)

# Technical highlight pill
draw.rounded_rectangle([50, y2 + 172, 850, y2 + 190], fill="#181a1b")
draw.text((56, y2 + 174), "Required action: Merge verified branch to production, then submit URL for re-indexing in Google Search Console.", font=subtitle_font, fill="#e8eaed")

img.save(output_path, "PNG")
print("Saved comparison image to:", output_path)
