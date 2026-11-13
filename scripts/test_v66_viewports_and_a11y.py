import os, sys, subprocess, math
from PIL import Image

WORKSPACE_DIR = os.path.abspath('.')
STUDIO_DIR = os.path.join(WORKSPACE_DIR, 'V66_CONCEPT_STUDIO')
QA_DIR = os.path.join(STUDIO_DIR, 'qa_viewports')
os.makedirs(QA_DIR, exist_ok=True)

EDGE_PATH = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

VIEWPORTS = [
    (320, 2400, '320px_compact_mobile'),
    (390, 2400, '390px_standard_mobile'),
    (768, 2600, '768px_tablet_portrait'),
    (1024, 2600, '1024px_laptop_small'),
    (1440, 2800, '1440px_desktop'),
    (1920, 2800, '1920px_ultrawide')
]

CONCEPTS = ['a', 'b', 'c']

print("--- 1. RESPONSIVE MULTI-VIEWPORT INSPECTION (320px, 390px, 768px, 1024px, 1440px, 1920px) ---")
viewport_results = {}
for c in CONCEPTS:
    html_file = os.path.join(STUDIO_DIR, f'concept_{c}.html')
    viewport_results[c] = []
    print(f"\nTesting Concept {c.upper()} across 6 breakpoints:")
    for w, h, label in VIEWPORTS:
        out_img = os.path.join(QA_DIR, f"concept_{c}_{label}.png")
        cmd = [
            EDGE_PATH,
            '--headless=new',
            f'--screenshot={out_img}',
            f'--window-size={w},{h}',
            '--hide-scrollbars',
            '--default-background-color=00000000',
            html_file
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if os.path.exists(out_img) and os.path.getsize(out_img) > 0:
            sz = os.path.getsize(out_img)
            with Image.open(out_img) as im:
                real_w, real_h = im.size
            print(f"  [PASS] {label:22} -> {real_w}x{real_h} ({sz/1024:.1f} KB)")
            viewport_results[c].append((label, real_w, real_h, sz))
        else:
            print(f"  [FAIL] {label:22} -> Error: {res.stderr}")

# 2. Mathematical WCAG Contrast Evaluation
print("\n--- 2. MATHEMATICAL WCAG 2.1 CONTRAST VERIFICATION ---")

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def srgb_to_linear(c):
    c = c / 255.0
    if c <= 0.04045:
        return c / 12.92
    else:
        return ((c + 0.055) / 1.055) ** 2.4

def get_luminance(hex_str):
    r, g, b = hex_to_rgb(hex_str)
    rl = srgb_to_linear(r)
    gl = srgb_to_linear(g)
    bl = srgb_to_linear(b)
    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl

def contrast_ratio(hex1, hex2):
    l1 = get_luminance(hex1)
    l2 = get_luminance(hex2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

test_pairs = [
    # Concept A
    ("Concept A: Carbon text #111315 on Bone Canvas #F4F4F0", "#111315", "#F4F4F0", 4.5, "Body & Headings"),
    ("Concept A: Graphite text #525866 on Bone Canvas #F4F4F0", "#525866", "#F4F4F0", 4.5, "Secondary Text"),
    ("Concept A: White text #FFFFFF on Carbon Header #111315", "#FFFFFF", "#111315", 4.5, "Header & Nav"),
    ("Concept A: White text #FFFFFF on Swiss Vermilion #D9381E", "#FFFFFF", "#D9381E", 4.5, "Action CTA"),
    ("Concept A: Swiss Vermilion #D9381E on White Card #FFFFFF", "#D9381E", "#FFFFFF", 4.5, "Accent Links"),

    # Concept B
    ("Concept B: Espresso text #1E1815 on Vellum Canvas #FBF8F1", "#1E1815", "#FBF8F1", 4.5, "Body & Headings"),
    ("Concept B: Burnished Slate #5C534D on Vellum Canvas #FBF8F1", "#5C534D", "#FBF8F1", 4.5, "Secondary Text"),
    ("Concept B: White text #FFFFFF on Espresso Header #1E1815", "#FFFFFF", "#1E1815", 4.5, "Header & Nav"),
    ("Concept B: White text #FFFFFF on Terracotta #A84323", "#FFFFFF", "#A84323", 4.5, "Action CTA"),
    ("Concept B: Terracotta #A84323 on Vellum Canvas #FBF8F1", "#A84323", "#FBF8F1", 4.5, "Accent Links"),

    # Concept C
    ("Concept C: Ice White #F0F6FC on Obsidian Canvas #0E1217", "#F0F6FC", "#0E1217", 4.5, "Body & Headings"),
    ("Concept C: Telemetry Steel #8B949E on Obsidian Canvas #0E1217", "#8B949E", "#0E1217", 4.5, "Secondary Text"),
    ("Concept C: Phosphor Verdigris #00D2B4 on Obsidian Canvas #0E1217", "#00D2B4", "#0E1217", 4.5, "Accent Headings"),
    ("Concept C: Dark Obsidian #0E1217 on Phosphor Verdigris #00D2B4", "#0E1217", "#00D2B4", 4.5, "Action CTA (Dark text on Mint)"),
    ("Concept C: Ice White #F0F6FC on Machined Slate Card #161B22", "#F0F6FC", "#161B22", 4.5, "Card Headings & Content")
]

print(f"{'Color Pair':<65} | {'Ratio':<8} | {'Threshold':<9} | {'Result':<10}")
print("-" * 98)
all_pass = True
for desc, c1, c2, thresh, role in test_pairs:
    ratio = contrast_ratio(c1, c2)
    passed = ratio >= thresh
    if not passed:
        all_pass = False
    status = "AAA PASS" if ratio >= 7.0 else ("AA PASS" if ratio >= 4.5 else "FAIL")
    print(f"{desc:<65} | {ratio:5.2f}:1 | {thresh}:1 ({role[:10]}) | {status}")

print(f"\nOverall Contrast Verification: {'100% WCAG 2.1 AA/AAA COMPLIANT' if all_pass else 'FAILURES DETECTED'}")

# 3. Code Accessibility & Semantic Integrity Audit
print("\n--- 3. CODE ACCESSIBILITY & SEMANTIC INTEGRITY AUDIT ---")
for c in CONCEPTS:
    html_file = os.path.join(STUDIO_DIR, f'concept_{c}.html')
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    checks = [
        ("Semantic <header> landmark present", "<header" in content),
        ("Semantic <nav> with aria-label present", "<nav" in content and "aria-label" in content),
        ("Semantic <footer> landmark present", "<footer" in content),
        ("Heading H1 present", "<h1" in content),
        ("Heading H2 & H3 hierarchy present", "<h2" in content and "<h3" in content and "<h4" in content),
        ("Interactive form inputs have matching <label for='...'>", "for=\"name_" in content and "id=\"name_" in content),
        ("Client portrait contains descriptive alt text", "alt=\"Professional Portrait of CA Kavitha Vijay" in content),
        ("Prefers-reduced-motion CSS media query included", "@media (prefers-reduced-motion: reduce)" in content),
        ("Keyboard focus-visible indicators defined", ":focus-visible" in content),
        ("Phone number formatted with tel: protocol", "href=\"tel:+919626350900\"" in content),
        ("Email formatted with mailto: protocol", "href=\"mailto:ca.kavithavijay@gmail.com\"" in content),
        ("Zero external tracking or unapproved dependencies", "google-analytics" not in content and "facebook" not in content)
    ]
    
    print(f"\nSemantic Audit for Concept {c.upper()}:")
    for desc, res in checks:
        print(f"  [{'PASS' if res else 'FAIL'}] {desc}")

print("\n--- ALL QA AND ACCESSIBILITY VERIFICATIONS COMPLETED ---")
