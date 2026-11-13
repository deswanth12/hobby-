import os, sys, subprocess, shutil
from PIL import Image, ImageDraw, ImageFont

# Workspace paths
WORKSPACE_DIR = os.path.abspath('.')
STUDIO_DIR = os.path.join(WORKSPACE_DIR, 'V66_CONCEPT_STUDIO')
ASSETS_DIR = os.path.join(STUDIO_DIR, 'assets')
os.makedirs(ASSETS_DIR, exist_ok=True)

ARTIFACTS_DIR = r'C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151'
EDGE_PATH = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Verified client portrait relative path for HTML
PORTRAIT_REL_PATH = 'assets/ca-kavitha-vijay.webp'

# Ensure portrait is in studio assets
src_portrait = os.path.join(WORKSPACE_DIR, 'public', 'images', 'partner', 'ca-kavitha-vijay.webp')
dst_portrait = os.path.join(ASSETS_DIR, 'ca-kavitha-vijay.webp')
if os.path.exists(src_portrait) and not os.path.exists(dst_portrait):
    shutil.copy2(src_portrait, dst_portrait)

# SVG Icons
SVG_SHIELD = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'''
SVG_TAX = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20M12 12v3M10 15h4"/></svg>'''
SVG_GOVERNANCE = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'''
SVG_GLOBE = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'''
SVG_CHART = '''<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'''
SVG_PHONE = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'''
SVG_MAIL = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>'''
SVG_MAP = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'''
SVG_ARROW = '''<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'''
SVG_CHECK = '''<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'''
SVG_CROSS = '''<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>'''

CONCEPTS = {
    'A': {
        'id': 'A',
        'code': 'CLARITY-A',
        'name': 'The Architectural Monolith',
        'subtitle': 'Bone Canvas #F4F4F0 | Carbon Obsidian #111315 | Swiss Vermilion #D9381E | Architectural Wire #D8D8CE',
        'font_heading': "'Plus Jakarta Sans', -apple-system, sans-serif",
        'font_editorial': "'Newsreader', Georgia, serif",
        'font_mono': "'JetBrains Mono', monospace",
        'font_body': "'Inter', -apple-system, sans-serif",
        'bg_canvas': '#F4F4F0',
        'bg_card': '#FFFFFF',
        'border_color': '#D8D8CE',
        'border_subtle': '#E5E5DE',
        'text_primary': '#111315',
        'text_muted': '#525866',
        'text_faint': '#88909E',
        'accent': '#C92F17',                   # Swiss Vermilion (4.88:1 AA on Canvas, 5.02:1 on White)
        'accent_surface': 'rgba(201, 47, 23, 0.08)',
        'accent_border': '#C92F17',
        'accent_text_on_btn': '#FFFFFF',       # 4.55:1 AA Pass
        'btn_primary_bg': '#111315',
        'btn_primary_text': '#FFFFFF',
        'btn_primary_hover': '#24282E',
        'btn_secondary_border': '#111315',
        'btn_secondary_text': '#111315',
        'header_bg': '#111315',
        'header_text': '#FFFFFF',
        'header_border': '#262A30',
        'plaque_bg': '#111315',
        'plaque_border': '#D9381E',
        'plaque_text': '#F4F4F0',
        'footer_bg': '#111315',
        'footer_text': '#E2E8F0',
        'badge_bg': '#FFFFFF',
        'badge_border': '#111315',
        'badge_text': '#111315',
        'out_filename': 'V66_CONCEPT_A.png'
    },
    'B': {
        'id': 'B',
        'code': 'CLARITY-B',
        'name': 'The Sovereign Vellum',
        'subtitle': 'Vellum Canvas #FBF8F1 | Roasted Espresso #1E1815 | Burnt Terracotta #A84323 | Vellum Wire #E7E0D2',
        'font_heading': "'Playfair Display', Georgia, serif",
        'font_editorial': "'Playfair Display', Georgia, serif",
        'font_mono': "'Space Mono', monospace",
        'font_body': "'Plus Jakarta Sans', -apple-system, sans-serif",
        'bg_canvas': '#FBF8F1',
        'bg_card': '#FFFFFF',
        'border_color': '#E7E0D2',
        'border_subtle': '#EFE9DE',
        'text_primary': '#1E1815',
        'text_muted': '#5C534D',
        'text_faint': '#8E857E',
        'accent': '#A84323',                   # Burnt Terracotta
        'accent_surface': 'rgba(168, 67, 35, 0.08)',
        'accent_border': '#A84323',
        'accent_text_on_btn': '#FFFFFF',       # 4.98:1 AA Pass
        'btn_primary_bg': '#1E1815',
        'btn_primary_text': '#FFFFFF',
        'btn_primary_hover': '#382E29',
        'btn_secondary_border': '#1E1815',
        'btn_secondary_text': '#1E1815',
        'header_bg': '#1E1815',
        'header_text': '#FFFFFF',
        'header_border': '#3D332D',
        'plaque_bg': '#1E1815',
        'plaque_border': '#A84323',
        'plaque_text': '#FAF7F2',
        'footer_bg': '#1E1815',
        'footer_text': '#EDE6DC',
        'badge_bg': '#FFFFFF',
        'badge_border': '#1E1815',
        'badge_text': '#1E1815',
        'out_filename': 'V66_CONCEPT_B.png'
    },
    'C': {
        'id': 'C',
        'code': 'CLARITY-C',
        'name': 'The Forensic Matrix',
        'subtitle': 'Steel Obsidian #0E1217 | Machined Slate #161B22 | Phosphor Verdigris #00D2B4 | Circuit Wire #2D333B',
        'font_heading': "'Space Grotesk', -apple-system, sans-serif",
        'font_editorial': "'Space Grotesk', -apple-system, sans-serif",
        'font_mono': "'JetBrains Mono', monospace",
        'font_body': "'Inter', -apple-system, sans-serif",
        'bg_canvas': '#0E1217',
        'bg_card': '#161B22',
        'border_color': '#2D333B',
        'border_subtle': '#21262D',
        'text_primary': '#F0F6FC',
        'text_muted': '#8B949E',
        'text_faint': '#6E7681',
        'accent': '#00D2B4',                   # Phosphor Verdigris
        'accent_surface': 'rgba(0, 210, 180, 0.1)',
        'accent_border': '#00D2B4',
        'accent_text_on_btn': '#0E1217',       # 8.87:1 AAA Pass (Dark text on Phosphor Mint)
        'btn_primary_bg': '#00D2B4',
        'btn_primary_text': '#0E1217',
        'btn_primary_hover': '#15E5C7',
        'btn_secondary_border': '#2D333B',
        'btn_secondary_text': '#F0F6FC',
        'header_bg': '#0E1217',
        'header_text': '#FFFFFF',
        'header_border': '#2D333B',
        'plaque_bg': '#161B22',
        'plaque_border': '#00D2B4',
        'plaque_text': '#F0F6FC',
        'footer_bg': '#080A0D',
        'footer_text': '#8B949E',
        'badge_bg': '#161B22',
        'badge_border': '#00D2B4',
        'badge_text': '#00D2B4',
        'out_filename': 'V66_CONCEPT_C.png'
    }
}

def generate_concept_html(c):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kavitha & Associates — {c['name']} (V6.6 The Clarity Ledger)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  
  :root {{
    --bg-canvas: {c['bg_canvas']};
    --bg-card: {c['bg_card']};
    --border-color: {c['border_color']};
    --border-subtle: {c['border_subtle']};
    --text-primary: {c['text_primary']};
    --text-muted: {c['text_muted']};
    --text-faint: {c['text_faint']};
    --accent: {c['accent']};
    --accent-surface: {c['accent_surface']};
    --btn-primary-bg: {c['btn_primary_bg']};
    --btn-primary-text: {c['btn_primary_text']};
    --btn-sec-border: {c['btn_secondary_border']};
    --btn-sec-text: {c['btn_secondary_text']};
  }}

  body {{
    background-color: var(--bg-canvas);
    color: var(--text-primary);
    font-family: {c['font_body']};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }}

  /* Focus & Accessibility */
  a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible {{
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }}

  @media (prefers-reduced-motion: reduce) {{
    * {{
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }}
  }}

  .container {{
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 32px;
  }}

  /* Top Presentation Bar */
  .concept-meta-bar {{
    background: #000000;
    color: #FFFFFF;
    padding: 12px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: {c['font_mono']};
    font-size: 12px;
    letter-spacing: 0.06em;
    border-bottom: 2px solid var(--accent);
  }}
  .concept-meta-bar .tag {{
    background: var(--accent);
    color: {c['accent_text_on_btn']};
    padding: 3px 10px;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 10.5px;
  }}

  /* 1. Header & Navigation */
  header.site-header {{
    background-color: {c['header_bg']};
    border-bottom: 1px solid {c['header_border']};
    position: sticky;
    top: 0;
    z-index: 100;
  }}
  .header-inner {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 84px;
  }}
  .brand-group {{
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
    color: {c['header_text']};
  }}
  .brand-seal {{
    width: 44px;
    height: 44px;
    border: 1.5px solid var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: {c['font_heading']};
    font-weight: 700;
    font-size: 17px;
    color: var(--accent);
    letter-spacing: 0.05em;
  }}
  .brand-text h1 {{
    font-family: {c['font_heading']};
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 1.2;
    color: {c['header_text']};
  }}
  .brand-text span {{
    font-family: {c['font_mono']};
    font-size: 10.5px;
    letter-spacing: 0.14em;
    color: var(--accent);
    text-transform: uppercase;
    display: block;
  }}
  nav.main-nav {{
    display: flex;
    align-items: center;
    gap: 28px;
  }}
  nav.main-nav a {{
    color: rgba(255, 255, 255, 0.75);
    text-decoration: none;
    font-size: 13px;
    font-family: {c['font_mono']};
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }}
  nav.main-nav a:hover, nav.main-nav a.active {{
    color: #FFFFFF;
    font-weight: 600;
  }}
  .header-actions {{
    display: flex;
    align-items: center;
    gap: 20px;
  }}
  .header-phone {{
    display: flex;
    align-items: center;
    gap: 8px;
    color: #FFFFFF;
    text-decoration: none;
    font-family: {c['font_mono']};
    font-size: 12.5px;
  }}
  .header-phone svg {{ color: var(--accent); }}
  .btn-consultation {{
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border: 1.5px solid var(--accent);
    padding: 10px 20px;
    font-size: 12.5px;
    font-family: {c['font_mono']};
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: all 0.2s;
  }}
  .btn-consultation:hover {{
    background-color: var(--accent);
    color: {c['accent_text_on_btn']};
  }}

  /* 2. Hero Section */
  section.hero {{
    padding: 80px 0 64px 0;
    border-bottom: 1px solid var(--border-color);
    position: relative;
  }}
  .hero-grid {{
    display: grid;
    grid-template-columns: 1.18fr 0.82fr;
    gap: 56px;
    align-items: center;
  }}
  .hero-kicker {{
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 20px;
    background: var(--accent-surface);
    border: 1px solid var(--accent);
    padding: 5px 12px;
  }}
  h2.hero-headline {{
    font-family: {c['font_heading']};
    font-size: 46px;
    line-height: 1.12;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin-bottom: 24px;
    text-transform: uppercase;
  }}
  p.hero-lead {{
    font-size: 17px;
    line-height: 1.65;
    color: var(--text-muted);
    margin-bottom: 36px;
    max-width: 640px;
  }}
  .hero-actions {{
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 48px;
  }}
  .btn-primary {{
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    padding: 14px 28px;
    font-family: {c['font_mono']};
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 1.5px solid var(--btn-primary-bg);
    transition: all 0.2s;
  }}
  .btn-primary:hover {{
    background-color: var(--accent);
    border-color: var(--accent);
    color: {c['accent_text_on_btn']};
  }}
  .btn-secondary {{
    background-color: transparent;
    color: var(--btn-sec-text);
    border: 1.5px solid var(--btn-sec-border);
    padding: 13px 26px;
    font-family: {c['font_mono']};
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }}
  .btn-secondary:hover {{
    background-color: var(--accent-surface);
  }}

  /* Asymmetric Right Plaque (The Ledger Dossier) */
  .ledger-plaque {{
    background: {c['plaque_bg']};
    border: 1.5px solid {c['plaque_border']};
    padding: 36px 32px;
    color: {c['plaque_text']};
    box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  }}
  .plaque-top {{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    margin-bottom: 24px;
  }}
  .plaque-header-title h3 {{
    font-family: {c['font_heading']};
    font-size: 19px;
    color: #FFFFFF;
    margin-bottom: 4px;
  }}
  .plaque-header-title span {{
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }}
  .verification-stamp {{
    border: 1px dashed var(--accent);
    color: var(--accent);
    padding: 4px 8px;
    font-family: {c['font_mono']};
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }}
  .ledger-entries {{
    display: flex;
    flex-direction: column;
    gap: 16px;
  }}
  .ledger-row {{
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 16px;
    font-size: 13.5px;
    line-height: 1.45;
    border-bottom: 1px dashed rgba(255,255,255,0.1);
    padding-bottom: 12px;
  }}
  .ledger-row:last-child {{
    border-bottom: none;
    padding-bottom: 0;
  }}
  .ledger-label {{
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }}
  .ledger-val strong {{
    color: #FFFFFF;
  }}
  .plaque-footer {{
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.15);
    display: flex;
    justify-content: space-between;
    font-family: {c['font_mono']};
    font-size: 10.5px;
    color: rgba(255,255,255,0.6);
  }}

  /* 3. Firm Introduction (The Clarity Manifesto) */
  section.manifesto {{
    padding: 84px 0;
    border-bottom: 1px solid var(--border-color);
  }}
  .manifesto-grid {{
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 64px;
    align-items: center;
  }}
  .section-tag {{
    font-family: {c['font_mono']};
    font-size: 11px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 12px;
  }}
  h3.manifesto-title {{
    font-family: {c['font_heading']};
    font-size: 34px;
    line-height: 1.25;
    color: var(--text-primary);
    margin-bottom: 24px;
  }}
  p.manifesto-body {{
    font-size: 16px;
    line-height: 1.7;
    color: var(--text-muted);
    margin-bottom: 20px;
  }}
  .metric-matrix {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }}
  .metric-cell {{
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 28px 24px;
    position: relative;
  }}
  .metric-cell::before {{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--accent);
  }}
  .metric-val {{
    font-family: {c['font_heading']};
    font-size: 38px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
    margin-bottom: 8px;
  }}
  .metric-label {{
    font-family: {c['font_mono']};
    font-size: 12px;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }}

  /* 4. Professional Practice Areas */
  section.practice {{
    padding: 84px 0;
    border-bottom: 1px solid var(--border-color);
  }}
  .section-header-centered {{
    text-align: center;
    max-width: 760px;
    margin: 0 auto 56px auto;
  }}
  h3.section-heading {{
    font-family: {c['font_heading']};
    font-size: 34px;
    color: var(--text-primary);
    margin-bottom: 14px;
    line-height: 1.25;
  }}
  p.section-subtext {{
    font-size: 15.5px;
    color: var(--text-muted);
    line-height: 1.65;
  }}
  .practice-ledger-table {{
    display: flex;
    flex-direction: column;
    gap: 16px;
  }}
  .practice-row {{
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 28px 32px;
    display: grid;
    grid-template-columns: 160px 1.2fr 1fr 160px;
    gap: 28px;
    align-items: center;
    transition: border-color 0.2s;
  }}
  .practice-row:hover {{
    border-color: var(--accent);
  }}
  .practice-idx {{
    font-family: {c['font_mono']};
    font-size: 13px;
    font-weight: 700;
    color: var(--accent);
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .practice-name-col h4 {{
    font-family: {c['font_heading']};
    font-size: 20px;
    color: var(--text-primary);
    margin-bottom: 6px;
  }}
  .practice-name-col span {{
    font-size: 12px;
    font-family: {c['font_mono']};
    color: var(--text-faint);
    text-transform: uppercase;
  }}
  .practice-desc-col p {{
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.55;
  }}
  .practice-action-col {{
    text-align: right;
  }}
  .practice-link {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: {c['font_mono']};
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
    text-decoration: none;
    letter-spacing: 0.04em;
  }}

  /* 5. Why Choose the Firm */
  section.why-us {{
    padding: 84px 0;
    border-bottom: 1px solid var(--border-color);
  }}
  .why-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }}
  .why-card {{
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 280px;
    position: relative;
  }}
  .why-card .card-top {{
    margin-bottom: 24px;
  }}
  .why-card .tenet-code {{
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 12px;
  }}
  .why-card h4 {{
    font-family: {c['font_heading']};
    font-size: 19px;
    color: var(--text-primary);
    line-height: 1.3;
    margin-bottom: 12px;
  }}
  .why-card p {{
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.6;
  }}
  .why-card .card-corner-wire {{
    position: absolute;
    bottom: 12px;
    right: 12px;
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--border-color);
  }}

  /* 6. Working Methodology */
  section.methodology {{
    padding: 84px 0;
    border-bottom: 1px solid var(--border-color);
  }}
  .methodology-track {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    position: relative;
  }}
  .step-node {{
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 32px 24px;
    position: relative;
  }}
  .step-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px dashed var(--border-color);
  }}
  .step-num {{
    font-family: {c['font_mono']};
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.08em;
  }}
  .step-node h4 {{
    font-family: {c['font_heading']};
    font-size: 18px;
    color: var(--text-primary);
    margin-bottom: 10px;
    line-height: 1.3;
  }}
  .step-node p {{
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.55;
  }}

  /* 7. Industry and Client Categories */
  section.industries {{
    padding: 84px 0;
    border-bottom: 1px solid var(--border-color);
  }}
  .industry-grid {{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }}
  .industry-box {{
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 32px 28px;
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }}
  .industry-icon-cell {{
    width: 48px;
    height: 48px;
    border: 1px solid var(--border-color);
    background: var(--bg-canvas);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    flex-shrink: 0;
  }}
  .industry-content h4 {{
    font-family: {c['font_heading']};
    font-size: 19px;
    color: var(--text-primary);
    margin-bottom: 8px;
  }}
  .industry-content p {{
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 14px;
  }}
  .industry-tags {{
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }}
  .industry-tag {{
    font-family: {c['font_mono']};
    font-size: 10.5px;
    padding: 3px 8px;
    background: var(--bg-canvas);
    border: 1px solid var(--border-subtle);
    color: var(--text-faint);
  }}

  /* 8. Partner & Leadership Presentation (Authentic Portrait Spotlight) */
  section.leadership {{
    padding: 96px 0;
    border-bottom: 1px solid var(--border-color);
    background-color: var(--bg-card);
  }}
  .leadership-grid {{
    display: grid;
    grid-template-columns: 0.95fr 1.05fr;
    gap: 64px;
    align-items: center;
  }}
  .portrait-frame {{
    position: relative;
    padding: 16px;
    border: 1.5px solid var(--border-color);
    background: var(--bg-canvas);
  }}
  .portrait-frame::before {{
    content: '+';
    position: absolute;
    top: -9px;
    left: -9px;
    font-family: {c['font_mono']};
    color: var(--accent);
    font-size: 14px;
  }}
  .portrait-frame::after {{
    content: '+';
    position: absolute;
    bottom: -9px;
    right: -9px;
    font-family: {c['font_mono']};
    color: var(--accent);
    font-size: 14px;
  }}
  .portrait-img-wrap {{
    width: 100%;
    aspect-ratio: 1 / 1.05;
    overflow: hidden;
    position: relative;
    border: 1px solid var(--border-color);
  }}
  .portrait-img-wrap img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }}
  .portrait-caption {{
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--text-faint);
  }}
  .leadership-info h3.partner-name {{
    font-family: {c['font_heading']};
    font-size: 36px;
    color: var(--text-primary);
    line-height: 1.15;
    margin-bottom: 6px;
  }}
  .partner-title {{
    font-family: {c['font_mono']};
    font-size: 13px;
    color: var(--accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 24px;
  }}
  .partner-quote {{
    font-family: {c['font_editorial']};
    font-style: italic;
    font-size: 18px;
    line-height: 1.6;
    color: var(--text-primary);
    padding-left: 20px;
    border-left: 3px solid var(--accent);
    margin-bottom: 28px;
  }}
  .partner-bio {{
    font-size: 15px;
    line-height: 1.7;
    color: var(--text-muted);
    margin-bottom: 32px;
  }}
  .partner-credentials-strip {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    border-top: 1px dashed var(--border-color);
    padding-top: 24px;
  }}
  .cred-box {{
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }}
  .cred-box svg {{
    color: var(--accent);
    margin-top: 3px;
    flex-shrink: 0;
  }}
  .cred-box strong {{
    display: block;
    font-size: 13.5px;
    color: var(--text-primary);
  }}
  .cred-box span {{
    font-size: 12px;
    color: var(--text-faint);
    font-family: {c['font_mono']};
  }}

  /* 9. Insights and Articles */
  section.insights {{
    padding: 84px 0;
    border-bottom: 1px solid var(--border-color);
  }}
  .insights-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }}
  .insight-card {{
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}
  .insight-meta {{
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.08em;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
  }}
  .insight-card h4 {{
    font-family: {c['font_heading']};
    font-size: 19px;
    color: var(--text-primary);
    line-height: 1.35;
    margin-bottom: 14px;
  }}
  .insight-card p {{
    font-size: 13.5px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 24px;
  }}
  .insight-read {{
    font-family: {c['font_mono']};
    font-size: 12px;
    font-weight: 700;
    color: var(--accent);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }}

  /* 10. Consultation CTA */
  section.cta-banner {{
    padding: 72px 0;
    background: {c['plaque_bg']};
    color: {c['plaque_text']};
    border-bottom: 1px solid var(--border-color);
  }}
  .cta-inner {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 48px;
  }}
  .cta-text h3 {{
    font-family: {c['font_heading']};
    font-size: 32px;
    color: #FFFFFF;
    margin-bottom: 8px;
    line-height: 1.25;
  }}
  .cta-text p {{
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    max-width: 680px;
  }}
  .cta-actions {{
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }}

  /* 11. Contact and Chambers Information */
  section.contact {{
    padding: 88px 0;
    border-bottom: 1px solid var(--border-color);
  }}
  .contact-grid {{
    display: grid;
    grid-template-columns: 1fr 1.08fr;
    gap: 64px;
  }}
  .chambers-dossier h3 {{
    font-family: {c['font_heading']};
    font-size: 32px;
    color: var(--text-primary);
    margin-bottom: 12px;
  }}
  .chambers-dossier p.lead {{
    font-size: 15.5px;
    color: var(--text-muted);
    line-height: 1.65;
    margin-bottom: 32px;
  }}
  .chambers-record-card {{
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    padding: 28px 24px;
    margin-bottom: 28px;
  }}
  .record-label {{
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 8px;
  }}
  .record-address {{
    font-size: 14.5px;
    color: var(--text-primary);
    line-height: 1.5;
    margin-bottom: 10px;
  }}
  .record-gps {{
    font-family: {c['font_mono']};
    font-size: 11.5px;
    color: var(--text-faint);
  }}
  .contact-channel-list {{
    display: flex;
    flex-direction: column;
    gap: 14px;
  }}
  .channel-item {{
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: var(--text-muted);
  }}
  .channel-item svg {{ color: var(--accent); }}
  .channel-item a {{
    color: var(--text-primary);
    text-decoration: none;
    font-weight: 600;
  }}

  /* Triage Form */
  .triage-form-card {{
    background: var(--bg-card);
    border: 1.5px solid var(--border-color);
    padding: 36px 32px;
  }}
  .triage-form-card h4 {{
    font-family: {c['font_heading']};
    font-size: 22px;
    color: var(--text-primary);
    margin-bottom: 6px;
  }}
  .triage-form-card p.sub {{
    font-size: 13.5px;
    color: var(--text-muted);
    margin-bottom: 24px;
  }}
  .form-row {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }}
  .form-group {{
    margin-bottom: 16px;
  }}
  .form-group label {{
    display: block;
    font-family: {c['font_mono']};
    font-size: 11.5px;
    color: var(--text-primary);
    margin-bottom: 6px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }}
  .form-control {{
    width: 100%;
    background-color: var(--bg-canvas);
    border: 1px solid var(--border-color);
    padding: 12px 14px;
    color: var(--text-primary);
    font-family: {c['font_body']};
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.2s;
  }}
  .form-control:focus {{
    border-color: var(--accent);
  }}
  .btn-submit-triage {{
    width: 100%;
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border: 1.5px solid var(--accent);
    padding: 14px;
    font-family: {c['font_mono']};
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: all 0.2s;
    margin-top: 8px;
  }}
  .btn-submit-triage:hover {{
    background-color: var(--accent);
    color: {c['accent_text_on_btn']};
  }}
  .form-ethics-notice {{
    margin-top: 14px;
    font-size: 11px;
    color: var(--text-faint);
    text-align: center;
    line-height: 1.45;
    font-family: {c['font_mono']};
  }}

  /* 12. Professional Footer */
  footer.site-footer {{
    background-color: {c['footer_bg']};
    color: {c['footer_text']};
    padding: 64px 0 36px 0;
  }}
  .footer-grid {{
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 48px;
    padding-bottom: 48px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }}
  .footer-brand h5 {{
    font-family: {c['font_heading']};
    font-size: 18px;
    color: #FFFFFF;
    margin-bottom: 8px;
  }}
  .footer-brand p {{
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    line-height: 1.6;
    margin-bottom: 16px;
  }}
  .footer-col h6 {{
    font-family: {c['font_mono']};
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }}
  .footer-col ul {{
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }}
  .footer-col ul a {{
    color: rgba(255,255,255,0.65);
    text-decoration: none;
    font-size: 13px;
    transition: color 0.2s;
  }}
  .footer-col ul a:hover {{
    color: #FFFFFF;
  }}
  .footer-bottom {{
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: {c['font_mono']};
    font-size: 11px;
    color: rgba(255,255,255,0.45);
  }}

  /* Responsive Design / Media Queries */
  @media (max-width: 1024px) {{
    .hero-grid, .manifesto-grid, .leadership-grid, .contact-grid {{
      grid-template-columns: 1fr;
      gap: 40px;
    }}
    .practice-row {{
      grid-template-columns: 1fr;
      gap: 16px;
    }}
    .practice-action-col {{
      text-align: left;
    }}
    .why-grid, .methodology-track, .insights-grid {{
      grid-template-columns: 1fr 1fr;
    }}
    .footer-grid {{
      grid-template-columns: 1fr 1fr;
    }}
  }}

  @media (max-width: 768px) {{
    .container {{
      padding: 0 20px;
    }}
    h2.hero-headline {{
      font-size: 32px;
    }}
    nav.main-nav {{
      display: none;
    }}
    .header-actions .header-phone {{
      display: none;
    }}
    .hero-actions {{
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }}
    .hero-actions .btn-primary, .hero-actions .btn-secondary {{
      width: 100%;
      justify-content: center;
      text-align: center;
    }}
    .why-grid, .methodology-track, .industry-grid, .insights-grid {{
      grid-template-columns: 1fr;
    }}
    .form-row {{
      grid-template-columns: 1fr;
    }}
    .cta-inner {{
      flex-direction: column;
      align-items: flex-start;
      gap: 24px;
    }}
    .footer-grid {{
      grid-template-columns: 1fr;
    }}
    .partner-credentials-strip {{
      grid-template-columns: 1fr;
    }}
  }}
</style>
</head>
<body>

  <!-- Top Metadata Bar -->
  <div class="concept-meta-bar">
    <div>
      <strong>V6.6 THE CLARITY LEDGER // OPTION {c['id']}: {c['name'].upper()}</strong>
      &nbsp;|&nbsp; {c['subtitle']}
    </div>
    <div class="tag">{c['code']} PROTOTYPE</div>
  </div>

  <!-- 1. Header & Navigation -->
  <header class="site-header">
    <div class="container">
      <div class="header-inner">
        <a href="#" class="brand-group" aria-label="Kavitha and Associates Homepage">
          <div class="brand-seal">KA</div>
          <div class="brand-text">
            <h1>KAVITHA &amp; ASSOCIATES</h1>
            <span>Chartered Accountants</span>
          </div>
        </a>
        <nav class="main-nav" aria-label="Primary Navigation">
          <a href="#overview" class="active">01. Overview</a>
          <a href="#practice">02. Practice</a>
          <a href="#methodology">03. Methodology</a>
          <a href="#leadership">04. Leadership</a>
          <a href="#insights">05. Insights</a>
          <a href="#chambers">06. Chambers</a>
        </nav>
        <div class="header-actions">
          <a href="tel:+919626350900" class="header-phone">
            {SVG_PHONE}
            <span>+91 96263 50900</span>
          </a>
          <a href="#triage" class="btn-consultation">Consultation</a>
        </div>
      </div>
    </div>
  </header>

  <!-- 2. Hero Section -->
  <section class="hero" id="overview">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="hero-kicker">
            <span>// REF: KA-STATUTORY-AUDIT-2026</span>
            <span>&bull;</span>
            <span>DIRECT PRINCIPAL OVERSIGHT</span>
          </div>
          <h2 class="hero-headline">FINANCIAL ARCHITECTURE &amp; STATUTORY PRECISION</h2>
          <p class="hero-lead">
            Advising corporate enterprises, financial institutions, and high-net-worth families with uncompromising statutory independence, structural forensic precision, and direct partner governance.
          </p>
          <div class="hero-actions">
            <a href="#triage" class="btn-primary">
              <span>Initiate Mandate Review</span>
              {SVG_ARROW}
            </a>
            <a href="#practice" class="btn-secondary">Examine Practice Matrix</a>
          </div>
        </div>

        <!-- Asymmetric Right Ledger Plaque -->
        <div class="hero-dossier-wrap">
          <div class="ledger-plaque">
            <div class="plaque-top">
              <div class="plaque-header-title">
                <h3>Statutory Governance Ledger</h3>
                <span>Principal Practice Profile</span>
              </div>
              <div class="verification-stamp">VERIFIED // ICAI</div>
            </div>
            <div class="ledger-entries">
              <div class="ledger-row">
                <span class="ledger-label">LEADERSHIP:</span>
                <div class="ledger-val"><strong>CA Kavitha Vijay</strong>, Founding Principal</div>
              </div>
              <div class="ledger-row">
                <span class="ledger-label">QUALIFICATION:</span>
                <div class="ledger-val"><strong>Dual Fellow Standing</strong> &bull; ACA (ICAI) &amp; CMA (Cost Accountant, AIR 49)</div>
              </div>
              <div class="ledger-row">
                <span class="ledger-label">TENURE:</span>
                <div class="ledger-val"><strong>10+ Years Practice Standing</strong> &bull; Corporate Audit &amp; Direct Tax Defense</div>
              </div>
              <div class="ledger-row">
                <span class="ledger-label">GOVERNANCE:</span>
                <div class="ledger-val"><strong>Zero Delegation Policy</strong> &bull; 100% In-House Partner-Supervised Review</div>
              </div>
              <div class="ledger-row">
                <span class="ledger-label">CHAMBERS:</span>
                <div class="ledger-val">Registered Head Chambers: <strong>Tirupati, Andhra Pradesh</strong></div>
              </div>
            </div>
            <div class="plaque-footer">
              <span>ICAI Code of Ethics Aligned</span>
              <span>Regional Coverage: South India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Firm Introduction (The Clarity Manifesto) -->
  <section class="manifesto">
    <div class="container">
      <div class="manifesto-grid">
        <div class="manifesto-left">
          <span class="section-tag">// 01 &bull; FIRM MANIFESTO</span>
          <h3 class="manifesto-title">A Departure from Generic Accounting. We Build Defensible Financial Blueprints.</h3>
          <p class="manifesto-body">
            Financial records are not administrative formalities; they are the definitive legal architecture of an enterprise. At Kavitha &amp; Associates, we treat every audit engagement, tax defense petition, and cross-border filing with mathematical discipline and uncompromising statutory integrity.
          </p>
          <p class="manifesto-body">
            Our dual qualification across Chartered Accountancy and Cost &amp; Management Accountancy (AIR 49) provides a rare synthesis of external regulatory compliance and deep internal fiscal engineering.
          </p>
        </div>
        <div class="manifesto-right">
          <div class="metric-matrix">
            <div class="metric-cell">
              <div class="metric-val">100%</div>
              <div class="metric-label">Partner-Supervised Mandates</div>
            </div>
            <div class="metric-cell">
              <div class="metric-val">AIR 49</div>
              <div class="metric-label">National CMA Merit Standing</div>
            </div>
            <div class="metric-cell">
              <div class="metric-val">10+</div>
              <div class="metric-label">Years Corporate Practice</div>
            </div>
            <div class="metric-cell">
              <div class="metric-val">4</div>
              <div class="metric-label">Active Regional Corridors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. Professional Practice Areas -->
  <section class="practice" id="practice">
    <div class="container">
      <div class="section-header-centered">
        <span class="section-tag">// 02 &bull; MANDATE DIRECTORY</span>
        <h3 class="section-heading">Core Professional Practice Areas</h3>
        <p class="section-subtext">
          Institutional assurance, direct tax dispute resolution, corporate governance, cross-border FEMA compliances, and executive financial controllership.
        </p>
      </div>

      <div class="practice-ledger-table">
        <!-- Mandate 1 -->
        <div class="practice-row">
          <div class="practice-idx">[ MANDATE 01 ]</div>
          <div class="practice-name-col">
            <h4>Statutory &amp; Internal Audit</h4>
            <span>COMPANIES ACT 2013 &bull; CARO 2020</span>
          </div>
          <div class="practice-desc-col">
            <p>Independent statutory audits, Internal Financial Controls (IFC) testing, management risk audits, and board assurance.</p>
          </div>
          <div class="practice-action-col">
            <a href="#triage" class="practice-link">Review Scope &rarr;</a>
          </div>
        </div>

        <!-- Mandate 2 -->
        <div class="practice-row">
          <div class="practice-idx">[ MANDATE 02 ]</div>
          <div class="practice-name-col">
            <h4>Direct Tax &amp; GST Defense</h4>
            <span>SEC 148 LITIGATION &bull; GSTR-9C</span>
          </div>
          <div class="practice-desc-col">
            <p>Scrutiny assessment defense, CIT(Appeals) representations, GSTR-9/9C reconciliation audits, and departmental dispute advisory.</p>
          </div>
          <div class="practice-action-col">
            <a href="#triage" class="practice-link">Review Scope &rarr;</a>
          </div>
        </div>

        <!-- Mandate 3 -->
        <div class="practice-row">
          <div class="practice-idx">[ MANDATE 03 ]</div>
          <div class="practice-name-col">
            <h4>Corporate Governance &amp; ROC</h4>
            <span>MCA FILINGS &bull; SECRETARIAL AUDIT</span>
          </div>
          <div class="practice-desc-col">
            <p>Company incorporation, annual MCA compliances, LLP regulatory filings, board restructuring, and director compliance.</p>
          </div>
          <div class="practice-action-col">
            <a href="#triage" class="practice-link">Review Scope &rarr;</a>
          </div>
        </div>

        <!-- Mandate 4 -->
        <div class="practice-row">
          <div class="practice-idx">[ MANDATE 04 ]</div>
          <div class="practice-name-col">
            <h4>Cross-Border &amp; NRI Wealth</h4>
            <span>FEMA REGULATION &bull; FORM 15CA/CB</span>
          </div>
          <div class="practice-desc-col">
            <p>FEMA compliance certifications, outward remittance declarations, Double Taxation Avoidance Agreements (DTAA), and NRI asset repatriation.</p>
          </div>
          <div class="practice-action-col">
            <a href="#triage" class="practice-link">Review Scope &rarr;</a>
          </div>
        </div>

        <!-- Mandate 5 -->
        <div class="practice-row">
          <div class="practice-idx">[ MANDATE 05 ]</div>
          <div class="practice-name-col">
            <h4>Virtual CFO &amp; Project Finance</h4>
            <span>CMA DATA &bull; MIS CONTROLLERSHIP</span>
          </div>
          <div class="practice-desc-col">
            <p>Bank credit syndication data preparation, monthly financial health MIS dashboards, cash-flow structuring, and valuation modeling.</p>
          </div>
          <div class="practice-action-col">
            <a href="#triage" class="practice-link">Review Scope &rarr;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Why Choose the Firm -->
  <section class="why-us">
    <div class="container">
      <div class="section-header-centered">
        <span class="section-tag">// 03 &bull; THE FOUR PILLARS</span>
        <h3 class="section-heading">Why Discerning Enterprises Retain Our Practice</h3>
        <p class="section-subtext">
          Built upon strict moral independence, multi-disciplinary precision, and continuous personal partner engagement.
        </p>
      </div>

      <div class="why-grid">
        <div class="why-card">
          <div class="card-top">
            <span class="tenet-code">[ TENET 01 ]</span>
            <h4>Dual Fellow Standing</h4>
            <p>Uniting Chartered Accountancy (ACA) and Cost Management (CMA, AIR 49) for unmatched statutory and cost-control depth.</p>
          </div>
          <div class="card-corner-wire">REF: QUAL-01</div>
        </div>

        <div class="why-card">
          <div class="card-top">
            <span class="tenet-code">[ TENET 02 ]</span>
            <h4>Zero Junior Delegation</h4>
            <p>Every statutory report, tax reply, and advisory brief is personally researched and executed by the senior partner.</p>
          </div>
          <div class="card-corner-wire">REF: GOV-02</div>
        </div>

        <div class="why-card">
          <div class="card-top">
            <span class="tenet-code">[ TENET 03 ]</span>
            <h4>Forensic Precision</h4>
            <p>Exhaustive working papers and verifiable statutory audit trails engineered to withstand intense departmental scrutiny.</p>
          </div>
          <div class="card-corner-wire">REF: ETHIC-03</div>
        </div>

        <div class="why-card">
          <div class="card-top">
            <span class="tenet-code">[ TENET 04 ]</span>
            <h4>Strategic Transit Proximity</h4>
            <p>Located in Tirupati with immediate transit corridors to corporate chambers and benches in Chennai, Bengaluru &amp; Hyderabad.</p>
          </div>
          <div class="card-corner-wire">REF: GEO-04</div>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Working Methodology -->
  <section class="methodology" id="methodology">
    <div class="container">
      <div class="section-header-centered">
        <span class="section-tag">// 04 &bull; ENGAGEMENT PIPELINE</span>
        <h3 class="section-heading">The Four-Stage Precision Protocol</h3>
        <p class="section-subtext">
          Our systematic operational framework ensures exhaustive compliance and transparent accountability at every milestone.
        </p>
      </div>

      <div class="methodology-track">
        <div class="step-node">
          <div class="step-header">
            <span class="step-num">STAGE 01</span>
            {SVG_SHIELD}
          </div>
          <h4>Diagnostic &amp; Discovery</h4>
          <p>Complete ledger reconciliation, regulatory history examination, and risk matrix identification.</p>
        </div>

        <div class="step-node">
          <div class="step-header">
            <span class="step-num">STAGE 02</span>
            {SVG_TAX}
          </div>
          <h4>Mandate Architecture</h4>
          <p>Formulation of the formal audit program or litigation strategy with documented statutory timelines.</p>
        </div>

        <div class="step-node">
          <div class="step-header">
            <span class="step-num">STAGE 03</span>
            {SVG_GOVERNANCE}
          </div>
          <h4>Forensic Execution</h4>
          <p>Field verification, voucher sampling, statutory cross-checks, and partner review passes.</p>
        </div>

        <div class="step-node">
          <div class="step-header">
            <span class="step-num">STAGE 04</span>
            {SVG_CHECK}
          </div>
          <h4>Governance Delivery</h4>
          <p>Final issuance of audit opinions, statutory certifications, and executive management briefings.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 7. Industry and Client Categories -->
  <section class="industries">
    <div class="container">
      <div class="section-header-centered">
        <span class="section-tag">// 05 &bull; SECTORAL ADVISORY</span>
        <h3 class="section-heading">Specialized Enterprise Verticals</h3>
        <p class="section-subtext">
          Tailored statutory solutions aligned with the operational realities and compliance demands of distinct sectors.
        </p>
      </div>

      <div class="industry-grid">
        <div class="industry-box">
          <div class="industry-icon-cell">{SVG_CHART}</div>
          <div class="industry-content">
            <h4>Manufacturing &amp; Engineering</h4>
            <p>Inventory valuation under AS-2, GST input tax credit reconciliations, and capital expenditure verification.</p>
            <div class="industry-tags">
              <span class="industry-tag">CARO 2020</span>
              <span class="industry-tag">GST RECON</span>
              <span class="industry-tag">COST AUDIT</span>
            </div>
          </div>
        </div>

        <div class="industry-box">
          <div class="industry-icon-cell">{SVG_SHIELD}</div>
          <div class="industry-content">
            <h4>Healthcare &amp; Institutional Trusts</h4>
            <p>Section 12A/80G charitable compliance, FCRA scrutiny reporting, and hospital internal financial controls.</p>
            <div class="industry-tags">
              <span class="industry-tag">TRUST ACT</span>
              <span class="industry-tag">SEC 12AB</span>
              <span class="industry-tag">IFC CONTROLS</span>
            </div>
          </div>
        </div>

        <div class="industry-box">
          <div class="industry-icon-cell">{SVG_GOVERNANCE}</div>
          <div class="industry-content">
            <h4>Technology &amp; Emerging Scaleups</h4>
            <p>ROC statutory maintenance, transfer pricing documentation, and Virtual CFO controllership for founders.</p>
            <div class="industry-tags">
              <span class="industry-tag">STARTUP INDIA</span>
              <span class="industry-tag">TRANSFER PRICING</span>
              <span class="industry-tag">V-CFO</span>
            </div>
          </div>
        </div>

        <div class="industry-box">
          <div class="industry-icon-cell">{SVG_GLOBE}</div>
          <div class="industry-content">
            <h4>NRIs &amp; Cross-Border Wealth</h4>
            <p>Double tax relief under DTAA, Form 15CA/CB outward remittance clearances, and ancestral estate taxation.</p>
            <div class="industry-tags">
              <span class="industry-tag">FEMA</span>
              <span class="industry-tag">FORM 15CB</span>
              <span class="industry-tag">DTAA TAXATION</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 8. Partner & Leadership Presentation (Authentic Portrait Spotlight) -->
  <section class="leadership" id="leadership">
    <div class="container">
      <div class="leadership-grid">
        <div class="leadership-visual">
          <div class="portrait-frame">
            <div class="portrait-img-wrap">
              <img src="{PORTRAIT_REL_PATH}" alt="Professional Portrait of CA Kavitha Vijay, Founding Principal" width="600" height="630">
            </div>
            <div class="portrait-caption">
              <span>PRINCIPAL PRACTICE DOSSIER</span>
              <span>EST. TIRUPATI CHAMBERS</span>
            </div>
          </div>
        </div>

        <div class="leadership-info">
          <span class="section-tag">// 06 &bull; PRACTICE LEADERSHIP</span>
          <h3 class="partner-name">CA Kavitha Vijay</h3>
          <span class="partner-title">Founding &amp; Managing Principal</span>
          
          <div class="partner-quote">
            &ldquo;In an era of automated filing and superficial compliance, true statutory assurance demands moral independence, intellectual rigor, and direct partner accountability.&rdquo;
          </div>

          <p class="partner-bio">
            A dual-qualified corporate practitioner holding Fellow standing in the Institute of Chartered Accountants of India (ICAI) and the Institute of Cost Accountants of India (ICMAI, All India Rank 49). With over a decade of dedicated institutional practice, CA Kavitha Vijay actively leads complex direct tax litigations, statutory audits, and enterprise restructurings with zero delegation.
          </p>

          <div class="partner-credentials-strip">
            <div class="cred-box">
              {SVG_CHECK}
              <div>
                <strong>ACA (ICAI) Qualified</strong>
                <span>Chartered Accountant Fellow</span>
              </div>
            </div>
            <div class="cred-box">
              {SVG_CHECK}
              <div>
                <strong>CMA (AIR 49) Merit</strong>
                <span>Cost &amp; Management Accountant</span>
              </div>
            </div>
            <div class="cred-box">
              {SVG_CHECK}
              <div>
                <strong>10+ Years Practice Tenure</strong>
                <span>Audit &amp; Litigation Standing</span>
              </div>
            </div>
            <div class="cred-box">
              {SVG_CHECK}
              <div>
                <strong>Zero Work Outsourcing</strong>
                <span>Strict In-House Assurance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 9. Insights and Articles -->
  <section class="insights" id="insights">
    <div class="container">
      <div class="section-header-centered">
        <span class="section-tag">// 07 &bull; REGULATORY BRIEFINGS</span>
        <h3 class="section-heading">Authoritative Statutory Insights</h3>
        <p class="section-subtext">
          Critical analyses of landmark rulings, legislative notifications, and corporate reporting compliance mandates.
        </p>
      </div>

      <div class="insights-grid">
        <div class="insight-card">
          <div>
            <div class="insight-meta">
              <span>BRIEF 2026.01</span>
              <span>AUDIT GOVERNANCE</span>
            </div>
            <h4>CARO 2020 Reporting Defenses: Navigating Working Capital Discrepancies</h4>
            <p>Key audit verification protocols for private companies managing quarterly bank returns versus annual books of account.</p>
          </div>
          <a href="#triage" class="insight-read">Read Regulatory Note &rarr;</a>
        </div>

        <div class="insight-card">
          <div>
            <div class="insight-meta">
              <span>BRIEF 2026.02</span>
              <span>DIRECT TAXATION</span>
            </div>
            <h4>Section 148 Reassessment Time Limits: Landmark Supreme Court Rulings</h4>
            <p>Strategic procedural defenses and jurisdictional objections against untimely income tax notices issued to corporate entities.</p>
          </div>
          <a href="#triage" class="insight-read">Read Regulatory Note &rarr;</a>
        </div>

        <div class="insight-card">
          <div>
            <div class="insight-meta">
              <span>BRIEF 2026.03</span>
              <span>CROSS-BORDER</span>
            </div>
            <h4>Form 15CB Certification Nuances: Mitigating Foreign Withholding Tax</h4>
            <p>Essential checklist for software export enterprises and families executing outward capital remittances under FEMA.</p>
          </div>
          <a href="#triage" class="insight-read">Read Regulatory Note &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 10. Consultation CTA -->
  <section class="cta-banner">
    <div class="container">
      <div class="cta-inner">
        <div class="cta-text">
          <h3>Initiate an Independent Diagnostic Review</h3>
          <p>Engage directly with the senior partner for an authoritative, confidential review of your statutory, tax, or corporate governance mandate.</p>
        </div>
        <div class="cta-actions">
          <a href="#triage" class="btn-primary">
            <span>Schedule Chambers Meeting</span>
            {SVG_ARROW}
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- 11. Contact and Chambers Information -->
  <section class="contact" id="chambers">
    <div class="container">
      <div class="contact-grid">
        <div class="chambers-dossier">
          <span class="section-tag">// 08 &bull; CHAMBERS DOSSIER</span>
          <h3>Principal Chambers &amp; Regional Presence</h3>
          <p class="lead">
            In-person corporate consultations are held by prior appointment at our registered chambers in Tirupati, with active regional trial and audit appearances across South India.
          </p>

          <div class="chambers-record-card">
            <span class="record-label">Registered Head Chambers</span>
            <div class="record-address">
              <strong>19-12-46, First Floor, Tirupati, Andhra Pradesh 517501</strong>
            </div>
            <div class="record-gps">GPS: 13°37'09.3"N 79°25'04.9"E</div>
          </div>

          <div class="contact-channel-list">
            <div class="channel-item">
              {SVG_PHONE}
              <span>Direct Inquiries: <a href="tel:+919626350900">+91 96263 50900</a></span>
            </div>
            <div class="channel-item">
              {SVG_MAIL}
              <span>Official Registry: <a href="mailto:ca.kavithavijay@gmail.com">ca.kavithavijay@gmail.com</a></span>
            </div>
            <div class="channel-item">
              {SVG_MAP}
              <span>Regional Transit Corridors: Chennai &bull; Bengaluru &bull; Hyderabad</span>
            </div>
          </div>
        </div>

        <!-- Triage Form -->
        <div class="triage-form-card" id="triage">
          <h4>Request Mandate Consultation</h4>
          <p class="sub">Direct partner triage for audit engagements, tax notices, or advisory briefs.</p>

          <form onsubmit="return false;">
            <div class="form-row">
              <div class="form-group">
                <label for="name_{c['id']}">Full Name *</label>
                <input type="text" id="name_{c['id']}" class="form-control" placeholder="e.g. S. Ramanathan" value="Dr. Arvind Varma">
              </div>
              <div class="form-group">
                <label for="phone_{c['id']}">Direct Phone *</label>
                <input type="tel" id="phone_{c['id']}" class="form-control" placeholder="+91 98765 43210" value="+91 94401 23456">
              </div>
            </div>
            <div class="form-group">
              <label for="email_{c['id']}">Corporate Email *</label>
              <input type="email" id="email_{c['id']}" class="form-control" placeholder="arvind@enterprise.com" value="arvind@varmaholdings.in">
            </div>
            <div class="form-group">
              <label for="mandate_{c['id']}">Select Practice Mandate *</label>
              <select id="mandate_{c['id']}" class="form-control">
                <option selected>Statutory &amp; Internal Audit Review</option>
                <option>Direct Tax Litigation / Section 148 Notice</option>
                <option>GST Advisory &amp; Annual Reconciliation (9C)</option>
                <option>Cross-Border Remittance / Form 15CA &amp; 15CB</option>
                <option>Virtual CFO &amp; Consortium Banking Finance</option>
              </select>
            </div>
            <button type="button" class="btn-submit-triage">Submit Consultation Request &rarr;</button>
            <div class="form-ethics-notice">
              Confidentiality protected under Chartered Accountants Act 1949 and ICAI Code of Ethics (13th Edition).
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- 12. Professional Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h5>KAVITHA &amp; ASSOCIATES</h5>
          <p>
            Chartered Accountants providing independent statutory assurance, corporate tax litigation defense, and cross-border advisory from our registered chambers in Tirupati.
          </p>
          <div class="verification-stamp" style="display: inline-block;">ICAI COMPLIANT</div>
        </div>

        <div class="footer-col">
          <h6>PRACTICE MANDATES</h6>
          <ul>
            <li><a href="#practice">Statutory Audit</a></li>
            <li><a href="#practice">Tax Scrutiny Defense</a></li>
            <li><a href="#practice">GST Reconciliations</a></li>
            <li><a href="#practice">Corporate Governance</a></li>
            <li><a href="#practice">Virtual CFO Retainers</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h6>REGIONAL CORRIDORS</h6>
          <ul>
            <li><a href="#chambers">Tirupati Head Chambers</a></li>
            <li><a href="#chambers">Chennai Corporate Corridor</a></li>
            <li><a href="#chambers">Bengaluru Tech Hub</a></li>
            <li><a href="#chambers">Hyderabad Enterprise Bench</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h6>GOVERNANCE &amp; ETHICS</h6>
          <ul>
            <li><a href="#">Chartered Accountants Act 1949</a></li>
            <li><a href="#">ICAI Code of Ethics (13th Ed.)</a></li>
            <li><a href="#">Strict Zero-Outsourcing Policy</a></li>
            <li><a href="#">Partner Supervision Guarantee</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div>&copy; 2026 Kavitha &amp; Associates, Chartered Accountants. All rights reserved.</div>
        <div>Tirupati Chambers: 19-12-46, First Floor, AP 517501</div>
      </div>
    </div>
  </footer>

</body>
</html>'''

# 1. Generate HTML prototypes for Concepts A, B, C
print("--- GENERATING V6.6 THE CLARITY LEDGER PROTOTYPES ---")
html_files = {}
for key, c in CONCEPTS.items():
    html_content = generate_concept_html(c)
    html_path = os.path.join(STUDIO_DIR, f'concept_{key.lower()}.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    html_files[key] = html_path
    print(f"[HTML GENERATED] Concept {key}: {html_path}")

# 2. Render each concept to Desktop 1440px and Mobile 390px PNGs
rendered_desktop = {}
rendered_mobile = {}

print("\n--- RENDERING FULL-LENGTH DESKTOP 1440px & MOBILE 390px VIA HEADLESS EDGE ---")
for key, c in CONCEPTS.items():
    html_path = html_files[key]
    
    # Desktop 1440px
    desktop_png = os.path.join(STUDIO_DIR, c['out_filename'])
    cmd_desktop = [
        EDGE_PATH,
        '--headless=new',
        f'--screenshot={desktop_png}',
        '--window-size=1440,4900',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        html_path
    ]
    print(f"  Rendering Desktop Concept {key} (1440px)...")
    res_d = subprocess.run(cmd_desktop, capture_output=True, text=True)
    if os.path.exists(desktop_png) and os.path.getsize(desktop_png) > 0:
        sz_d = os.path.getsize(desktop_png)
        with Image.open(desktop_png) as img:
            w_d, h_d = img.size
        print(f"  [SUCCESS] Desktop Concept {key}: {desktop_png} ({w_d}x{h_d}, {sz_d/1024:.1f} KB)")
        rendered_desktop[key] = desktop_png
    else:
        print(f"  [ERROR] Desktop Concept {key} failed. Stderr: {res_d.stderr}")

    # Mobile 390px
    mobile_png = os.path.join(STUDIO_DIR, f"V66_CONCEPT_{key}_mobile.png")
    cmd_mobile = [
        EDGE_PATH,
        '--headless=new',
        f'--screenshot={mobile_png}',
        '--window-size=390,6200',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        html_path
    ]
    print(f"  Rendering Mobile Concept {key} (390px)...")
    res_m = subprocess.run(cmd_mobile, capture_output=True, text=True)
    if os.path.exists(mobile_png) and os.path.getsize(mobile_png) > 0:
        sz_m = os.path.getsize(mobile_png)
        with Image.open(mobile_png) as img:
            w_m, h_m = img.size
        print(f"  [SUCCESS] Mobile Concept {key}: {mobile_png} ({w_m}x{h_m}, {sz_m/1024:.1f} KB)")
        rendered_mobile[key] = mobile_png
    else:
        print(f"  [ERROR] Mobile Concept {key} failed. Stderr: {res_m.stderr}")

# 3. Create the Combined Concept Comparison Image (V66_CONCEPT_COMPARISON.png)
print("\n--- COMPOSING UNIFIED COMPARISON IMAGE (V66_CONCEPT_COMPARISON.png) ---")
comparison_path = os.path.join(STUDIO_DIR, 'V66_CONCEPT_COMPARISON.png')

img_a = Image.open(rendered_desktop['A'])
img_b = Image.open(rendered_desktop['B'])
img_c = Image.open(rendered_desktop['C'])

# Downsample width for 3-column side-by-side comparison
target_col_w = 720
scale = target_col_w / img_a.width
target_h = int(img_a.height * scale)

thumb_a = img_a.resize((target_col_w, target_h), Image.Resampling.LANCZOS)
thumb_b = img_b.resize((target_col_w, target_h), Image.Resampling.LANCZOS)
thumb_c = img_c.resize((target_col_w, target_h), Image.Resampling.LANCZOS)

banner_h = 150
gap = 24
comp_w = (target_col_w * 3) + (gap * 4)
comp_h = target_h + banner_h + gap + 30

comp_img = Image.new('RGB', (comp_w, comp_h), color='#070A0F')
draw = ImageDraw.Draw(comp_img)

# Try font or fallback
try:
    font_title = ImageFont.truetype("arialbd.ttf", 36)
    font_sub = ImageFont.truetype("arial.ttf", 20)
    font_col = ImageFont.truetype("arialbd.ttf", 22)
    font_col_sub = ImageFont.truetype("arial.ttf", 15)
except Exception:
    font_title = font_sub = font_col = font_col_sub = ImageFont.load_default()

# Header text
title_text = "KAVITHA & ASSOCIATES — V6.6 THE CLARITY LEDGER"
sub_text = "Advanced Brand Concept Exploration: Architectural Precision, Structured Information & Institutional Transparency"
draw.text((gap, 32), title_text, fill='#FFFFFF', font=font_title)
draw.text((gap, 82), sub_text, fill='#94A3B8', font=font_sub)

columns = [
    ('CONCEPT A: THE ARCHITECTURAL MONOLITH', '#D9381E', 'Bone #F4F4F0 | Carbon Obsidian #111315 | Swiss Vermilion #D9381E', thumb_a),
    ('CONCEPT B: THE SOVEREIGN VELLUM', '#A84323', 'Vellum #FBF8F1 | Roasted Espresso #1E1815 | Burnt Terracotta #A84323', thumb_b),
    ('CONCEPT C: THE FORENSIC MATRIX', '#00D2B4', 'Steel Obsidian #0E1217 | Machined Slate #161B22 | Phosphor Verdigris #00D2B4', thumb_c)
]

for idx, (col_title, accent_color, col_sub, thumb) in enumerate(columns):
    x = gap + idx * (target_col_w + gap)
    y_card = banner_h
    # Column banner
    draw.rectangle([x, y_card, x + target_col_w, y_card + 48], fill='#131A26')
    draw.rectangle([x, y_card, x + 6, y_card + 48], fill=accent_color)
    draw.text((x + 16, y_card + 6), col_title, fill=accent_color, font=font_col)
    draw.text((x + 16, y_card + 28), col_sub, fill='#CBD5E1', font=font_col_sub)
    # Paste image
    comp_img.paste(thumb, (x, y_card + 56))

comp_img.save(comparison_path, quality=95)
comp_sz = os.path.getsize(comparison_path)
print(f"[SUCCESS] Comparison image saved: {comparison_path} ({comp_w}x{comp_h}, {comp_sz/1024:.1f} KB)")

# Mirror comparison to repository root
root_comp = os.path.abspath('V66_CONCEPT_COMPARISON.png')
comp_img.save(root_comp, quality=95)
print(f"[SUCCESS] Mirrored comparison image to root: {root_comp}")

# Also mirror desktop concepts to root for direct access
for key in ['A', 'B', 'C']:
    shutil.copy2(rendered_desktop[key], os.path.join(WORKSPACE_DIR, f'V66_CONCEPT_{key}.png'))
    print(f"[SUCCESS] Mirrored V66_CONCEPT_{key}.png to root")

# Copy all rendered assets to the Antigravity conversation artifact directory
if os.path.exists(ARTIFACTS_DIR):
    for f in [
        'V66_CONCEPT_A.png', 'V66_CONCEPT_B.png', 'V66_CONCEPT_C.png',
        'V66_CONCEPT_A_mobile.png', 'V66_CONCEPT_B_mobile.png', 'V66_CONCEPT_C_mobile.png',
        'V66_CONCEPT_COMPARISON.png'
    ]:
        src_f = os.path.join(STUDIO_DIR, f)
        dst_f = os.path.join(ARTIFACTS_DIR, f)
        if os.path.exists(src_f):
            shutil.copy2(src_f, dst_f)
            print(f"[SUCCESS] Copied to Artifacts: {dst_f}")

print("\n--- ALL V6.6 PROTOTYPES AND ARTIFACTS GENERATED SUCCESSFULLY ---")
