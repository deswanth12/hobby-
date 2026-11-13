import os, sys, subprocess
from PIL import Image, ImageDraw, ImageFont

# Ensure target directories exist
PREVIEW_DIR = os.path.abspath('V65_CLIENT_PREVIEWS')
os.makedirs(PREVIEW_DIR, exist_ok=True)
TMP_DIR = os.path.abspath('tmp/previews')
os.makedirs(TMP_DIR, exist_ok=True)

EDGE_PATH = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Common SVG Icons
SVG_SHIELD = '''<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'''
SVG_TAX = '''<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20M12 12v3M10 15h4"/></svg>'''
SVG_GOVERNANCE = '''<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>'''
SVG_GLOBE = '''<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'''
SVG_CHART = '''<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>'''
SVG_PHONE = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'''
SVG_MAIL = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>'''
SVG_MAP = '''<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>'''
SVG_ARROW = '''<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>'''
SVG_CHECK = '''<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'''

THEMES = {
    'A': {
        'id': 'A',
        'title': 'Sovereign Modernity',
        'subtitle': 'Deep Midnight Slate, Warm Antique Alabaster & Imperial Amber',
        'font_heading': "'Playfair Display', Georgia, serif",
        'font_body': "'Inter', -apple-system, sans-serif",
        'bg_navbar': '#161E2E',
        'border_navbar': 'rgba(197, 155, 39, 0.25)',
        'text_navbar': '#FFFFFF',
        'nav_link_muted': '#CBD5E1',
        'bg_canvas': '#FBF9F5',
        'bg_card': '#FFFFFF',
        'border_card': '#E8E4DA',
        'text_primary': '#161E2E',
        'text_muted': '#5B677B',
        'color_accent': '#C59B27',
        'accent_text_on_button': '#161E2E',  # WCAG 6.43:1 Pass
        'button_secondary_border': '#161E2E',
        'button_secondary_text': '#161E2E',
        'badge_bg': 'rgba(197, 155, 39, 0.12)',
        'badge_border': '#C59B27',
        'badge_text': '#996C00',
        'plaque_bg': '#161E2E',
        'plaque_border': '#C59B27',
        'plaque_title': '#FFFFFF',
        'plaque_text': '#E2E8F0',
        'seal_bg': '#222E42',
        'seal_border': '#C59B27',
        'seal_text': '#C59B27',
        'contact_bg': '#161E2E',
        'contact_card_bg': '#222E42',
        'contact_card_border': 'rgba(197, 155, 39, 0.3)',
        'contact_title': '#FFFFFF',
        'contact_text': '#CBD5E1',
        'input_bg': '#161E2E',
        'input_border': 'rgba(232, 228, 218, 0.25)',
        'input_text': '#FFFFFF',
        'out_filename': 'V65_PREVIEW_OPTION_A.png'
    },
    'B': {
        'id': 'B',
        'title': 'Oceanic Precision',
        'subtitle': 'Deep Oceanic Spruce, Crisp Ice Platinum & Sea Teal',
        'font_heading': "'Plus Jakarta Sans', -apple-system, sans-serif",
        'font_body': "'Inter', -apple-system, sans-serif",
        'bg_navbar': '#0B2530',
        'border_navbar': 'rgba(13, 148, 136, 0.3)',
        'text_navbar': '#FFFFFF',
        'nav_link_muted': '#94A3B8',
        'bg_canvas': '#F8FAFC',
        'bg_card': '#FFFFFF',
        'border_card': '#E2E8F0',
        'text_primary': '#0B2530',
        'text_muted': '#475569',
        'color_accent': '#0F766E',  # Deep Teal for WCAG 4.58:1 AA Pass
        'accent_text_on_button': '#FFFFFF',
        'button_secondary_border': '#0B2530',
        'button_secondary_text': '#0B2530',
        'badge_bg': 'rgba(13, 148, 136, 0.1)',
        'badge_border': '#0D9488',
        'badge_text': '#0F766E',
        'plaque_bg': '#0B2530',
        'plaque_border': '#0D9488',
        'plaque_title': '#FFFFFF',
        'plaque_text': '#E2E8F0',
        'seal_bg': '#133747',
        'seal_border': '#0D9488',
        'seal_text': '#2DD4BF',
        'contact_bg': '#0B2530',
        'contact_card_bg': '#133747',
        'contact_card_border': 'rgba(13, 148, 136, 0.35)',
        'contact_title': '#FFFFFF',
        'contact_text': '#CBD5E1',
        'input_bg': '#0B2530',
        'input_border': 'rgba(226, 232, 240, 0.25)',
        'input_text': '#FFFFFF',
        'out_filename': 'V65_PREVIEW_OPTION_B.png'
    },
    'C': {
        'id': 'C',
        'title': 'Architectural Vanguard',
        'subtitle': 'Jet Charcoal, Studio Off-White & Electric Growth Lime',
        'font_heading': "'Space Grotesk', -apple-system, sans-serif",
        'font_body': "'Inter', -apple-system, sans-serif",
        'bg_navbar': '#212529',
        'border_navbar': 'rgba(194, 232, 59, 0.35)',
        'text_navbar': '#FFFFFF',
        'nav_link_muted': '#ADB5BD',
        'bg_canvas': '#F8F9FA',
        'bg_card': '#FFFFFF',
        'border_card': '#DEE2E6',
        'text_primary': '#212529',
        'text_muted': '#495057',
        'color_accent': '#C2E83B',
        'accent_text_on_button': '#212529',  # WCAG 10.95:1 AAA Pass
        'button_secondary_border': '#212529',
        'button_secondary_text': '#212529',
        'badge_bg': 'rgba(194, 232, 59, 0.15)',
        'badge_border': '#A8CD22',
        'badge_text': '#495057',
        'plaque_bg': '#212529',
        'plaque_border': '#C2E83B',
        'plaque_title': '#FFFFFF',
        'plaque_text': '#E9ECEF',
        'seal_bg': '#343A40',
        'seal_border': '#C2E83B',
        'seal_text': '#C2E83B',
        'contact_bg': '#212529',
        'contact_card_bg': '#343A40',
        'contact_card_border': 'rgba(194, 232, 59, 0.4)',
        'contact_title': '#FFFFFF',
        'contact_text': '#CED4DA',
        'input_bg': '#212529',
        'input_border': 'rgba(222, 226, 230, 0.25)',
        'input_text': '#FFFFFF',
        'out_filename': 'V65_PREVIEW_OPTION_C.png'
    }
}

def generate_html(theme):
    t = theme
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{t['title']} - Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    width: 1440px;
    margin: 0 auto;
    background-color: {t['bg_canvas']};
    color: {t['text_primary']};
    font-family: {t['font_body']};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }}

  /* Top Presentation Banner */
  .design-meta-banner {{
    background: #000000;
    color: #FFFFFF;
    padding: 14px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    border-bottom: 2px solid {t['color_accent']};
  }}
  .design-meta-banner .badge {{
    background: {t['color_accent']};
    color: {t['accent_text_on_button']};
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }}

  /* 1. Header & Navigation */
  header.site-header {{
    background-color: {t['bg_navbar']};
    border-bottom: 1px solid {t['border_navbar']};
    padding: 0 48px;
    height: 84px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 50;
  }}
  .brand-block {{
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
  }}
  .brand-logo-seal {{
    width: 46px;
    height: 46px;
    border-radius: 8px;
    background: {t['plaque_bg']};
    border: 1.5px solid {t['color_accent']};
    display: flex;
    align-items: center;
    justify-content: center;
    color: {t['color_accent']};
    font-family: {t['font_heading']};
    font-weight: 700;
    font-size: 18px;
    letter-spacing: 0.05em;
  }}
  .brand-text-col {{
    display: flex;
    flex-direction: column;
  }}
  .brand-name {{
    font-family: {t['font_heading']};
    font-size: 19px;
    font-weight: 700;
    color: {t['text_navbar']};
    letter-spacing: 0.04em;
    line-height: 1.2;
  }}
  .brand-subtitle {{
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: {t['color_accent']};
  }}
  nav.main-nav {{
    display: flex;
    align-items: center;
    gap: 32px;
  }}
  nav.main-nav a {{
    color: {t['nav_link_muted']};
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
  }}
  nav.main-nav a.active {{
    color: {t['text_navbar']};
    font-weight: 600;
  }}
  .header-actions {{
    display: flex;
    align-items: center;
    gap: 24px;
  }}
  .phone-link {{
    display: flex;
    align-items: center;
    gap: 8px;
    color: {t['text_navbar']};
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
  }}
  .phone-link svg {{ color: {t['color_accent']}; }}
  .btn-consultation {{
    background-color: {t['color_accent']};
    color: {t['accent_text_on_button']};
    padding: 11px 22px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 700;
    text-decoration: none;
    letter-spacing: 0.03em;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  }}

  /* 2. Hero Section */
  section.hero {{
    padding: 72px 48px 64px 48px;
    background-color: {t['bg_canvas']};
    border-bottom: 1px solid {t['border_card']};
  }}
  .hero-grid {{
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 48px;
    align-items: center;
  }}
  .hero-eyebrow {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: {t['badge_bg']};
    border: 1px solid {t['badge_border']};
    color: {t['badge_text']};
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }}
  .hero-eyebrow span.slash {{
    color: {t['color_accent']};
    font-weight: 800;
  }}
  h1.hero-title {{
    font-family: {t['font_heading']};
    font-size: 46px;
    line-height: 1.15;
    font-weight: 700;
    color: {t['text_primary']};
    letter-spacing: -0.015em;
    margin-bottom: 20px;
  }}
  p.hero-lead {{
    font-size: 17px;
    line-height: 1.65;
    color: {t['text_muted']};
    max-width: 620px;
    margin-bottom: 36px;
  }}
  .hero-cta-group {{
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 48px;
  }}
  .btn-hero-primary {{
    background-color: {t['color_accent']};
    color: {t['accent_text_on_button']};
    padding: 14px 28px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.02em;
  }}
  .btn-hero-secondary {{
    background-color: transparent;
    color: {t['button_secondary_text']};
    border: 1.5px solid {t['button_secondary_border']};
    padding: 13px 26px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
  }}

  /* Asymmetric Right Plaque */
  .hero-plaque {{
    background-color: {t['plaque_bg']};
    border: 1.5px solid {t['plaque_border']};
    border-radius: 16px;
    padding: 36px 32px;
    color: {t['plaque_text']};
    box-shadow: 0 16px 36px rgba(0,0,0,0.12);
    position: relative;
  }}
  .plaque-header {{
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }}
  .seal-medallion {{
    width: 64px;
    height: 64px;
    border-radius: 12px;
    background: {t['seal_bg']};
    border: 2px solid {t['seal_border']};
    display: flex;
    align-items: center;
    justify-content: center;
    color: {t['seal_text']};
    flex-shrink: 0;
  }}
  .seal-medallion svg {{
    width: 32px;
    height: 32px;
  }}
  .plaque-title-col h3 {{
    font-family: {t['font_heading']};
    font-size: 18px;
    color: {t['plaque_title']};
    margin-bottom: 4px;
  }}
  .plaque-title-col span {{
    font-size: 12px;
    font-weight: 600;
    color: {t['color_accent']};
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }}
  .plaque-credential-list {{
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }}
  .plaque-credential-list li {{
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13.5px;
    line-height: 1.45;
  }}
  .plaque-credential-list li svg {{
    color: {t['color_accent']};
    margin-top: 2px;
    flex-shrink: 0;
  }}
  .plaque-credential-list li strong {{
    color: #FFFFFF;
    font-weight: 600;
  }}
  .plaque-footer {{
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: {t['color_accent']};
    font-weight: 600;
  }}

  /* 3-Pillar Credential Strip */
  .hero-strip {{
    margin-top: 48px;
    padding-top: 32px;
    border-top: 1px solid {t['border_card']};
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }}
  .strip-item {{
    display: flex;
    align-items: center;
    gap: 12px;
  }}
  .strip-icon-box {{
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: {t['bg_card']};
    border: 1px solid {t['border_card']};
    display: flex;
    align-items: center;
    justify-content: center;
    color: {t['color_accent']};
    flex-shrink: 0;
  }}
  .strip-text strong {{
    display: block;
    font-size: 14px;
    color: {t['text_primary']};
    margin-bottom: 2px;
  }}
  .strip-text span {{
    font-size: 12px;
    color: {t['text_muted']};
  }}

  /* 3. Core Practice Areas */
  section.services {{
    padding: 72px 48px;
    background-color: {t['bg_canvas']};
  }}
  .section-header {{
    text-align: center;
    max-width: 720px;
    margin: 0 auto 52px auto;
  }}
  .section-kicker {{
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: {t['color_accent']};
    margin-bottom: 12px;
    display: block;
  }}
  .section-title {{
    font-family: {t['font_heading']};
    font-size: 34px;
    color: {t['text_primary']};
    font-weight: 700;
    margin-bottom: 14px;
    line-height: 1.25;
  }}
  .section-desc {{
    font-size: 15px;
    color: {t['text_muted']};
    line-height: 1.6;
  }}
  .services-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    margin-bottom: 28px;
  }}
  .services-grid-row2 {{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
    max-width: 920px;
    margin: 0 auto;
  }}
  .service-card {{
    background-color: {t['bg_card']};
    border: 1px solid {t['border_card']};
    border-radius: 12px;
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 240px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    position: relative;
    overflow: hidden;
  }}
  .service-card::before {{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: {t['color_accent']};
    opacity: 0;
    transition: opacity 0.2s;
  }}
  .service-card:hover::before {{
    opacity: 1;
  }}
  .card-top {{
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
  }}
  .service-icon {{
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: {t['badge_bg']};
    border: 1px solid {t['badge_border']};
    color: {t['color_accent']};
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  .card-num {{
    font-family: {t['font_heading']};
    font-size: 14px;
    font-weight: 700;
    color: {t['color_accent']};
    opacity: 0.7;
  }}
  .service-name {{
    font-family: {t['font_heading']};
    font-size: 20px;
    font-weight: 700;
    color: {t['text_primary']};
    margin-bottom: 10px;
    line-height: 1.3;
  }}
  .service-desc {{
    font-size: 13.5px;
    line-height: 1.6;
    color: {t['text_muted']};
    margin-bottom: 20px;
  }}
  .service-link {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: {t['color_accent']};
    text-decoration: none;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }}

  /* 4. Contact & Consultation Section */
  section.contact {{
    background-color: {t['contact_bg']};
    color: {t['contact_text']};
    padding: 72px 48px 80px 48px;
    border-top: 1px solid {t['border_navbar']};
  }}
  .contact-grid {{
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    gap: 60px;
    align-items: flex-start;
  }}
  .contact-info-col h2 {{
    font-family: {t['font_heading']};
    font-size: 32px;
    font-weight: 700;
    color: {t['contact_title']};
    margin-bottom: 12px;
    line-height: 1.25;
  }}
  .contact-info-col p.lead {{
    font-size: 15px;
    line-height: 1.6;
    color: {t['contact_text']};
    margin-bottom: 32px;
  }}
  .chambers-box {{
    background: {t['contact_card_bg']};
    border: 1px solid {t['contact_card_border']};
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 28px;
  }}
  .chambers-tag {{
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: {t['color_accent']};
    margin-bottom: 8px;
    display: block;
  }}
  .chambers-address {{
    font-size: 14px;
    line-height: 1.5;
    color: #FFFFFF;
    margin-bottom: 8px;
  }}
  .chambers-gps {{
    font-family: monospace;
    font-size: 11.5px;
    color: {t['color_accent']};
    letter-spacing: 0.05em;
  }}
  .contact-methods {{
    display: flex;
    flex-direction: column;
    gap: 14px;
  }}
  .contact-method-item {{
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: {t['contact_text']};
  }}
  .contact-method-item svg {{
    color: {t['color_accent']};
  }}
  .contact-method-item a {{
    color: #FFFFFF;
    text-decoration: none;
    font-weight: 600;
  }}

  /* Right Form Card */
  .triage-card {{
    background-color: {t['contact_card_bg']};
    border: 1px solid {t['contact_card_border']};
    border-radius: 16px;
    padding: 36px 32px;
    box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  }}
  .triage-card h3 {{
    font-family: {t['font_heading']};
    font-size: 22px;
    font-weight: 700;
    color: {t['contact_title']};
    margin-bottom: 6px;
  }}
  .triage-card p.sub {{
    font-size: 13px;
    color: {t['contact_text']};
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
    font-size: 12px;
    font-weight: 600;
    color: {t['contact_title']};
    margin-bottom: 6px;
    letter-spacing: 0.02em;
  }}
  .form-control {{
    width: 100%;
    background-color: {t['input_bg']};
    border: 1px solid {t['input_border']};
    border-radius: 6px;
    padding: 12px 14px;
    color: {t['input_text']};
    font-family: {t['font_body']};
    font-size: 13.5px;
    outline: none;
  }}
  .form-control::placeholder {{
    color: rgba(255,255,255,0.4);
  }}
  .btn-submit-form {{
    width: 100%;
    background-color: {t['color_accent']};
    color: {t['accent_text_on_button']};
    border: none;
    border-radius: 6px;
    padding: 14px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.03em;
    margin-top: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }}
  .ethical-note {{
    margin-top: 14px;
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    text-align: center;
    line-height: 1.4;
  }}
</style>
</head>
<body>

  <!-- Top Metadata Bar -->
  <div class="design-meta-banner">
    <div>
      <strong>OPTION {t['id']}: {t['title'].upper()}</strong> &nbsp;|&nbsp; {t['subtitle']}
    </div>
    <div class="badge">1440px Viewport Preview</div>
  </div>

  <!-- 1. Header & Navigation -->
  <header class="site-header">
    <a href="#" class="brand-block">
      <div class="brand-logo-seal">KA</div>
      <div class="brand-text-col">
        <span class="brand-name">KAVITHA &amp; ASSOCIATES</span>
        <span class="brand-subtitle">Chartered Accountants</span>
      </div>
    </a>
    <nav class="main-nav">
      <a href="#" class="active">Home</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Why Us</a>
      <a href="#">Contact</a>
    </nav>
    <div class="header-actions">
      <a href="tel:+919626350900" class="phone-link">
        {SVG_PHONE}
        <span>+91 96263 50900</span>
      </a>
      <a href="#consultation" class="btn-consultation">Book Consultation</a>
    </div>
  </header>

  <!-- 2. Hero Section -->
  <section class="hero">
    <div class="hero-grid">
      <div class="hero-left">
        <div class="hero-eyebrow">
          <span class="slash">//</span> REGULATORY PRECISION &amp; STATUTORY INTEGRITY
        </div>
        <h1 class="hero-title">INDEPENDENT AUDIT &amp; STRATEGIC TAX ADVISORY</h1>
        <p class="hero-lead">
          Advising corporate enterprises, emerging businesses, and high-net-worth individuals with uncompromising integrity, statutory precision, and direct partner governance.
        </p>
        <div class="hero-cta-group">
          <a href="#consultation" class="btn-hero-primary">
            <span>Schedule Consultation</span>
            {SVG_ARROW}
          </a>
          <a href="#services" class="btn-hero-secondary">Explore Practice Areas</a>
        </div>
      </div>
      
      <!-- Asymmetric Right Plaque -->
      <div class="hero-right">
        <div class="hero-plaque">
          <div class="plaque-header">
            <div class="seal-medallion">
              {SVG_SHIELD}
            </div>
            <div class="plaque-title-col">
              <h3>CA Kavitha Vijay</h3>
              <span>Principal Practice Leadership</span>
            </div>
          </div>
          <ul class="plaque-credential-list">
            <li>
              {SVG_CHECK}
              <div><strong>Dual Standing:</strong> ACA (Chartered Accountant, ICAI) &amp; CMA (Cost Accountant, All India Rank 49)</div>
            </li>
            <li>
              {SVG_CHECK}
              <div><strong>10+ Years Practice Standing:</strong> Statutory audit, direct tax litigation &amp; corporate advisory</div>
            </li>
            <li>
              {SVG_CHECK}
              <div><strong>Direct Principal Engagement:</strong> Zero work outsourcing; partner-supervised execution</div>
            </li>
            <li>
              {SVG_CHECK}
              <div><strong>Headquartered in Tirupati:</strong> Serving corporations &amp; family offices nationwide</div>
            </li>
          </ul>
          <div class="plaque-footer">
            <span>ICAI Code of Ethics Aligned</span>
            <span>Est. Tirupati Chambers</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3-Pillar Credential Strip -->
    <div class="hero-strip">
      <div class="strip-item">
        <div class="strip-icon-box">{SVG_SHIELD}</div>
        <div class="strip-text">
          <strong>Dual Professional Standing</strong>
          <span>Chartered Accountant &amp; CMA (AIR 49)</span>
        </div>
      </div>
      <div class="strip-item">
        <div class="strip-icon-box">{SVG_GOVERNANCE}</div>
        <div class="strip-text">
          <strong>Direct Senior Partner Review</strong>
          <span>Personal principal oversight on all mandates</span>
        </div>
      </div>
      <div class="strip-item">
        <div class="strip-icon-box">{SVG_CHECK}</div>
        <div class="strip-text">
          <strong>Zero-Outsourcing Policy</strong>
          <span>Strict confidential in-house compliance</span>
        </div>
      </div>
    </div>
  </section>

  <!-- 3. Core Practice Areas -->
  <section class="services" id="services">
    <div class="section-header">
      <span class="section-kicker">Specialized Professional Mandates</span>
      <h2 class="section-title">Core Practice Areas</h2>
      <p class="section-desc">
        Authoritative advisory across statutory assurance, corporate tax defense, indirect taxes, cross-border FEMA compliance, and executive controllership.
      </p>
    </div>

    <!-- Top 3 Service Cards -->
    <div class="services-grid">
      <div class="service-card">
        <div>
          <div class="card-top">
            <div class="service-icon">{SVG_SHIELD}</div>
            <span class="card-num">01</span>
          </div>
          <h3 class="service-name">Statutory &amp; Internal Audit</h3>
          <p class="service-desc">
            Independent statutory audits under Companies Act 2013, internal financial controls (IFC) testing, risk-based management audits, and board assurance.
          </p>
        </div>
        <a href="#" class="service-link">View Audit Framework {SVG_ARROW}</a>
      </div>

      <div class="service-card">
        <div>
          <div class="card-top">
            <div class="service-icon">{SVG_TAX}</div>
            <span class="card-num">02</span>
          </div>
          <h3 class="service-name">Corporate Tax &amp; GST Advisory</h3>
          <p class="service-desc">
            Direct tax litigation defense, Section 148 scrutiny representation, GSTR-9/9C annual reconciliations, and departmental dispute resolution.
          </p>
        </div>
        <a href="#" class="service-link">View Tax Mandates {SVG_ARROW}</a>
      </div>

      <div class="service-card">
        <div>
          <div class="card-top">
            <div class="service-icon">{SVG_GOVERNANCE}</div>
            <span class="card-num">03</span>
          </div>
          <h3 class="service-name">Corporate Governance &amp; ROC</h3>
          <p class="service-desc">
            Company incorporation, secretarial audit coordination, LLP filings, MCA statutory compliances, and director corporate governance advisory.
          </p>
        </div>
        <a href="#" class="service-link">View Governance Scope {SVG_ARROW}</a>
      </div>
    </div>

    <!-- Bottom 2 Service Cards -->
    <div class="services-grid-row2">
      <div class="service-card">
        <div>
          <div class="card-top">
            <div class="service-icon">{SVG_GLOBE}</div>
            <span class="card-num">04</span>
          </div>
          <h3 class="service-name">NRI &amp; Cross-Border Wealth</h3>
          <p class="service-desc">
            FEMA statutory compliance, Form 15CA/CB outward remittance certification, Double Taxation Avoidance Agreements (DTAA), and NRI asset planning.
          </p>
        </div>
        <a href="#" class="service-link">View Cross-Border Counsel {SVG_ARROW}</a>
      </div>

      <div class="service-card">
        <div>
          <div class="card-top">
            <div class="service-icon">{SVG_CHART}</div>
            <span class="card-num">05</span>
          </div>
          <h3 class="service-name">Project Finance &amp; Virtual CFO</h3>
          <p class="service-desc">
            Banking CMA data preparation, working capital syndication, monthly MIS financial controllership, and business valuation modeling.
          </p>
        </div>
        <a href="#" class="service-link">View CFO Services {SVG_ARROW}</a>
      </div>
    </div>
  </section>

  <!-- 4. Contact & Consultation Section -->
  <section class="contact" id="consultation">
    <div class="contact-grid">
      <div class="contact-info-col">
        <h2>Principal Chambers &amp; Regional Corridors</h2>
        <p class="lead">
          Consultations are conducted by prior appointment at our registered chambers in Tirupati, with active regional audit and litigation coverage across South India.
        </p>

        <div class="chambers-box">
          <span class="chambers-tag">Registered Head Office</span>
          <div class="chambers-address">
            <strong>19-12-46, First Floor, Tirupati, Andhra Pradesh 517501</strong>
          </div>
          <div class="chambers-gps">GPS: 13°37'09.3"N 79°25'04.9"E</div>
        </div>

        <div class="contact-methods">
          <div class="contact-method-item">
            {SVG_PHONE}
            <span>Direct Phone: <a href="tel:+919626350900">+91 96263 50900</a></span>
          </div>
          <div class="contact-method-item">
            {SVG_MAIL}
            <span>Official Email: <a href="mailto:ca.kavithavijay@gmail.com">ca.kavithavijay@gmail.com</a></span>
          </div>
          <div class="contact-method-item">
            {SVG_MAP}
            <span>Regional Corridors: Chennai &bull; Bengaluru &bull; Hyderabad</span>
          </div>
        </div>
      </div>

      <!-- Right Form Card -->
      <div class="triage-card">
        <h3>Request a Chambers Consultation</h3>
        <p class="sub">Direct partner triage for statutory audit, tax scrutiny, or corporate advisory.</p>
        
        <form onsubmit="return false;">
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input type="text" class="form-control" placeholder="e.g. S. Ramanathan" value="Dr. Arvind Varma">
            </div>
            <div class="form-group">
              <label>Phone Number *</label>
              <input type="text" class="form-control" placeholder="+91 98765 43210" value="+91 94401 23456">
            </div>
          </div>
          <div class="form-group">
            <label>Corporate / Personal Email *</label>
            <input type="email" class="form-control" placeholder="arvind@enterprise.com" value="arvind@varmaholdings.in">
          </div>
          <div class="form-group">
            <label>Select Practice Mandate *</label>
            <select class="form-control">
              <option selected>Statutory &amp; Internal Audit Review</option>
              <option>Corporate Tax Litigation / Sec 148</option>
              <option>GST Advisory &amp; Annual Return</option>
              <option>FEMA Compliance &amp; NRI Wealth</option>
              <option>Virtual CFO &amp; Project Finance</option>
            </select>
          </div>
          <button type="button" class="btn-submit-form">Submit Consultation Request &rarr;</button>
          <div class="ethical-note">
            Confidentiality preserved under Chartered Accountants Act 1949 and ICAI Code of Ethics (13th Edition).
          </div>
        </form>
      </div>
    </div>
  </section>

</body>
</html>'''
    return html

# 1. Generate HTML files for A, B, C
print("Generating HTML mockups...")
html_files = {}
for key, theme in THEMES.items():
    html_content = generate_html(theme)
    file_path = os.path.join(TMP_DIR, f'option_{key.lower()}.html')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    html_files[key] = file_path
    print(f"  Saved HTML: {file_path}")

# 2. Render each HTML to 1440px PNG via Edge headless
print("\nRendering HTML mockups to high-res PNG via Edge headless...")
rendered_pngs = {}
for key, theme in THEMES.items():
    html_path = html_files[key]
    out_png = os.path.join(PREVIEW_DIR, theme['out_filename'])
    # Window size: 1440 width x 2750 height to capture all 4 sections cleanly
    cmd = [
        EDGE_PATH,
        '--headless=new',
        f'--screenshot={out_png}',
        '--window-size=1440,2650',
        '--hide-scrollbars',
        '--default-background-color=00000000',
        html_path
    ]
    print(f"  Rendering Option {key}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_png) and os.path.getsize(out_png) > 0:
        sz = os.path.getsize(out_png)
        with Image.open(out_png) as img:
            w, h = img.size
        print(f"  [SUCCESS] Option {key} rendered: {out_png} ({w}x{h}, {sz/1024:.1f} KB)")
        rendered_pngs[key] = out_png
    else:
        print(f"  [ERROR] Option {key} failed to render. Stderr: {res.stderr}")

# 3. Create the Combined Three-Direction Comparison Image
print("\nComposing combined comparison image (V65_THREE_DIRECTION_COMPARISON.png)...")
comparison_path = os.path.join(PREVIEW_DIR, 'V65_THREE_DIRECTION_COMPARISON.png')

# Load the three images
img_a = Image.open(rendered_pngs['A'])
img_b = Image.open(rendered_pngs['B'])
img_c = Image.open(rendered_pngs['C'])

# Downsample width for 3-column side-by-side comparison
# Each column: 720px width (scaled from 1440px -> 50% scale)
target_col_w = 720
scale = target_col_w / img_a.width
target_h = int(img_a.height * scale)

thumb_a = img_a.resize((target_col_w, target_h), Image.Resampling.LANCZOS)
thumb_b = img_b.resize((target_col_w, target_h), Image.Resampling.LANCZOS)
thumb_c = img_c.resize((target_col_w, target_h), Image.Resampling.LANCZOS)

# Header banner height
banner_h = 140
gap = 24
comp_w = (target_col_w * 3) + (gap * 4)
comp_h = target_h + banner_h + gap + 30

comp_img = Image.new('RGB', (comp_w, comp_h), color='#0F172A')
draw = ImageDraw.Draw(comp_img)

# Try loading font or fallback
try:
    font_title = ImageFont.truetype("arialbd.ttf", 36)
    font_sub = ImageFont.truetype("arial.ttf", 20)
    font_col = ImageFont.truetype("arialbd.ttf", 22)
    font_col_sub = ImageFont.truetype("arial.ttf", 15)
except Exception:
    font_title = font_sub = font_col = font_col_sub = ImageFont.load_default()

# Draw Main Header
title_text = "KAVITHA & ASSOCIATES — THREE VISUAL DESIGN DIRECTIONS"
sub_text = "Comparative 1440px Desktop Visual Previews for Client Approval (Identical Layout & Content)"
draw.text((gap, 30), title_text, fill='#FFFFFF', font=font_title)
draw.text((gap, 78), sub_text, fill='#94A3B8', font=font_sub)

# Draw Column Titles & Place Images
columns = [
    ('OPTION A: SOVEREIGN MODERNITY', '#C59B27', 'Slate #161E2E | Alabaster #FBF9F5 | Amber #C59B27', thumb_a),
    ('OPTION B: OCEANIC PRECISION', '#2DD4BF', 'Spruce #0B2530 | Platinum #F8FAFC | Teal #0D9488', thumb_b),
    ('OPTION C: ARCHITECTURAL VANGUARD', '#C2E83B', 'Charcoal #212529 | Off-White #F8F9FA | Lime #C2E83B', thumb_c)
]

for idx, (col_title, accent_color, col_sub, thumb) in enumerate(columns):
    x = gap + idx * (target_col_w + gap)
    y_card = banner_h
    # Column banner
    draw.rectangle([x, y_card, x + target_col_w, y_card + 46], fill='#1E293B')
    draw.rectangle([x, y_card, x + 6, y_card + 46], fill=accent_color)
    draw.text((x + 16, y_card + 6), col_title, fill=accent_color, font=font_col)
    draw.text((x + 16, y_card + 28), col_sub, fill='#CBD5E1', font=font_col_sub)
    # Paste screenshot below banner
    comp_img.paste(thumb, (x, y_card + 54))

comp_img.save(comparison_path, quality=95)
comp_sz = os.path.getsize(comparison_path)
print(f"[SUCCESS] Combined comparison image saved: {comparison_path} ({comp_w}x{comp_h}, {comp_sz/1024:.1f} KB)")

# Also copy to root directory for easy access
root_comp = os.path.abspath('V65_THREE_DIRECTION_COMPARISON.png')
comp_img.save(root_comp, quality=95)
print(f"[SUCCESS] Also mirrored to repository root: {root_comp}")
