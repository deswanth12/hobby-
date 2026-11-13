import os
from PIL import Image

def crop_to_16_10(src_path, dst_path, target_width=1200, target_height=750):
    im = Image.open(src_path).convert("RGB")
    src_w, src_h = im.size
    target_aspect = target_width / target_height # 1.6
    src_aspect = src_w / src_h

    if src_aspect > target_aspect:
        # Crop width (centered)
        new_w = int(src_h * target_aspect)
        left = (src_w - new_w) // 2
        im = im.crop((left, 0, left + new_w, src_h))
    else:
        # Crop height (centered)
        new_h = int(src_w / target_aspect)
        top = (src_h - new_h) // 2
        im = im.crop((0, top, src_w, top + new_h))

    im_resized = im.resize((target_width, target_height), Image.Resampling.LANCZOS)
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    im_resized.save(dst_path, format="WEBP", quality=92, method=6)
    print(f"[OK] Saved {dst_path} ({target_width}x{target_height}, 16:10) from {src_path}")

# 1. Statutory Audit: Financial records and document review
crop_to_16_10(
    "public/images/ai-generated/about/document-review.webp",
    "public/uploads/blog/statutory-audit-guidelines-2026.webp"
)

# 2. GST: Tax documentation and business accounting
crop_to_16_10(
    "public/images/ai-generated/services/taxation.webp",
    "public/uploads/blog/gst-annual-return-compliance.webp"
)

# 3. Corporate Taxation: Financial planning and professional advisory
crop_to_16_10(
    "public/images/ai-generated/services/advisory.webp",
    "public/uploads/blog/corporate-tax-planning-2026.webp"
)

# 4. Internal Audit: Risk appraisal and control testing
crop_to_16_10(
    "public/images/ai-generated/why-choose-us/analysis.webp",
    "public/uploads/blog/internal-audit-best-practices.webp"
)

print("[SUCCESS] All 4 blog covers updated to 16:10 pure editorial photography.")
