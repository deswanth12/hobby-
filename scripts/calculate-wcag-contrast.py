def srgb_to_lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def relative_luminance(hex_str):
    hex_str = hex_str.lstrip('#')
    r = int(hex_str[0:2], 16)
    g = int(hex_str[2:4], 16)
    b = int(hex_str[4:6], 16)
    return 0.2126 * srgb_to_lin(r) + 0.7152 * srgb_to_lin(g) + 0.0722 * srgb_to_lin(b)

def contrast_ratio(hex1, hex2):
    l1 = relative_luminance(hex1)
    l2 = relative_luminance(hex2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

palettes = {
    "Direction 1: Sovereign Slate & Imperial Amber": {
        "primary_base": "#161E2E",
        "primary_surface": "#222E42",
        "secondary_steel": "#4A5D7E",
        "accent_amber": "#C59B27",
        "accent_hover": "#A8821B",
        "canvas_bg": "#FBF9F5",
        "card_bg": "#FFFFFF",
        "text_main": "#161E2E",
        "text_muted": "#5B677B",
        "border_subtle": "#E8E4DA"
    },
    "Direction 2: Botanical Verdant & Champagne Gold": {
        "primary_base": "#183024",
        "primary_surface": "#234232",
        "secondary_sage": "#4D6B5A",
        "accent_gold": "#D4AF37",
        "accent_hover": "#B39228",
        "canvas_bg": "#F7F6F2",
        "card_bg": "#FFFFFF",
        "text_main": "#183024",
        "text_muted": "#5C6B61",
        "border_subtle": "#E3E0D5"
    },
    "Direction 3: Oceanic Teal & Crisp Platinum": {
        "primary_base": "#0B2530",
        "primary_surface": "#133747",
        "secondary_slate": "#3B6070",
        "accent_teal": "#0D9488",
        "accent_hover": "#0F766E",
        "canvas_bg": "#F8FAFC",
        "card_bg": "#FFFFFF",
        "text_main": "#0B2530",
        "text_muted": "#475569",
        "border_subtle": "#E2E8F0"
    },
    "Direction 4: Architectural Charcoal & Growth Lime": {
        "primary_base": "#212529",
        "primary_surface": "#343A40",
        "secondary_steel": "#495057",
        "accent_lime": "#C2E83B",
        "accent_hover": "#A8CD22",
        "canvas_bg": "#F8F9FA",
        "card_bg": "#FFFFFF",
        "text_main": "#212529",
        "text_muted": "#6C757D",
        "border_subtle": "#DEE2E6"
    }
}

print("="*80)
print("WCAG 2.1 CONTRAST AUDIT ACROSS ALL PROPOSED PALETTES")
print("="*80)

for pal_name, tokens in palettes.items():
    print(f"\n--- {pal_name} ---")
    canvas = tokens['canvas_bg']
    card = tokens['card_bg']
    text = tokens['text_main']
    muted = tokens['text_muted']
    
    # Text on Canvas
    cr_text_canvas = contrast_ratio(text, canvas)
    # Text on Card
    cr_text_card = contrast_ratio(text, card)
    # Muted on Canvas
    cr_muted_canvas = contrast_ratio(muted, canvas)
    # Muted on Card
    cr_muted_card = contrast_ratio(muted, card)
    
    print(f"  • Body Text ({text}) on Canvas ({canvas}): {cr_text_canvas:.2f}:1 -> {'AAA PASS' if cr_text_canvas >= 7 else 'AA PASS' if cr_text_canvas >= 4.5 else 'FAIL'}")
    print(f"  • Body Text ({text}) on Card ({card}): {cr_text_card:.2f}:1 -> {'AAA PASS' if cr_text_card >= 7 else 'AA PASS' if cr_text_card >= 4.5 else 'FAIL'}")
    print(f"  • Muted Text ({muted}) on Canvas ({canvas}): {cr_muted_canvas:.2f}:1 -> {'AAA PASS' if cr_muted_canvas >= 7 else 'AA PASS' if cr_muted_canvas >= 4.5 else 'FAIL'}")
    print(f"  • Muted Text ({muted}) on Card ({card}): {cr_muted_card:.2f}:1 -> {'AAA PASS' if cr_muted_card >= 7 else 'AA PASS' if cr_muted_card >= 4.5 else 'FAIL'}")
    
    # Check Accent colors
    accent_keys = [k for k in tokens if 'accent' in k and 'hover' not in k]
    for ak in accent_keys:
        acc = tokens[ak]
        # On Canvas
        cr_acc_canvas = contrast_ratio(acc, canvas)
        # On Primary Base (dark)
        cr_acc_dark = contrast_ratio(acc, tokens['primary_base'])
        # White on Accent
        cr_white_acc = contrast_ratio("#FFFFFF", acc)
        # Dark on Accent
        cr_dark_acc = contrast_ratio(tokens['primary_base'], acc)
        
        print(f"  • Accent ({acc}):")
        print(f"      - vs Dark Base ({tokens['primary_base']}): {cr_acc_dark:.2f}:1 -> {'Large/UI Pass' if cr_acc_dark >= 3 else 'Fail'} (Normal text: {'Pass' if cr_acc_dark >= 4.5 else 'Fail'})")
        print(f"      - vs Canvas ({canvas}): {cr_acc_canvas:.2f}:1 -> {'Large/UI Pass' if cr_acc_canvas >= 3 else 'Fail'}")
        print(f"      - White text on Accent: {cr_white_acc:.2f}:1 -> {'PASS' if cr_white_acc >= 4.5 else 'FAILS (<4.5:1)'}")
        print(f"      - Dark text ({tokens['primary_base']}) on Accent: {cr_dark_acc:.2f}:1 -> {'PASS (Recommended)' if cr_dark_acc >= 4.5 else 'FAILS'}")
