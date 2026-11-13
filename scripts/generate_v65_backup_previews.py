import os, sys, subprocess
from PIL import Image, ImageDraw, ImageFont

# 1. Output directories
WORKSPACE_DIR = os.path.abspath('.')
BACKUP_DIR = os.path.join(WORKSPACE_DIR, 'V65_CLIENT_PREVIEWS_BACKUP')
os.makedirs(BACKUP_DIR, exist_ok=True)

TMP_DIR = os.path.join(WORKSPACE_DIR, 'tmp', 'previews_backup')
os.makedirs(TMP_DIR, exist_ok=True)

ARTIFACTS_DIR = r'C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151'

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

THEMES_BACKUP = {
    'D': {
        'id': 'D',
        'title': 'Graphite & Electric Blue',
        'subtitle': 'Graphite #18212F | Cool Mist #F5F7FA | Electric Blue #3B82F6 | Slate #64748B',
        'font_heading': "'Plus Jakarta Sans', -apple-system, sans-serif",
        'font_body': "'Inter', -apple-system, sans-serif",
        'bg_navbar': '#18212F',
        'border_navbar': 'rgba(59, 130, 246, 0.3)',
        'text_navbar': '#FFFFFF',
        'nav_link_muted': '#94A3B8',
        'bg_canvas': '#F5F7FA',
        'bg_card': '#FFFFFF',
        'border_card': '#E2E8F0',
        'text_primary': '#18212F',
        'text_muted': '#475569',
        'color_accent': '#2563EB',          # Vivid Royal/Electric Blue for primary buttons (WCAG 4.7:1 AA on white)
        'color_accent_glow': '#3B82F6',     # Electric Blue accent
        'accent_text_on_button': '#FFFFFF',
        'button_secondary_border': '#18212F',
        'button_secondary_text': '#18212F',
        'badge_bg': 'rgba(59, 130, 246, 0.1)',
        'badge_border': '#3B82F6',
        'badge_text': '#1D4ED8',
        'plaque_bg': '#18212F',
        'plaque_border': '#3B82F6',
        'plaque_title': '#FFFFFF',
        'plaque_text': '#E2E8F0',
        'seal_bg': '#243044',
        'seal_border': '#3B82F6',
        'seal_text': '#60A5FA',
        'contact_bg': '#18212F',
        'contact_card_bg': '#243044',
        'contact_card_border': 'rgba(59, 130, 246, 0.35)',
        'contact_title': '#FFFFFF',
        'contact_text': '#CBD5E1',
        'input_bg': '#18212F',
        'input_border': 'rgba(226, 232, 240, 0.25)',
        'input_text': '#FFFFFF',
        'out_filename': 'V65_PREVIEW_OPTION_D.png'
    },
    'E': {
        'id': 'E',
        'title': 'Burgundy & Porcelain',
        'subtitle': 'Deep Burgundy #4A1F2D | Porcelain #F7F8FA | Rose Crimson #B94B61 | Slate #77808D',
        'font_heading': "'Playfair Display', Georgia, serif",
        'font_body': "'Inter', -apple-system, sans-serif",
        'bg_navbar': '#4A1F2D',
        'border_navbar': 'rgba(185, 75, 97, 0.35)',
        'text_navbar': '#FFFFFF',
        'nav_link_muted': '#D1D5DB',
        'bg_canvas': '#F7F8FA',
        'bg_card': '#FFFFFF',
        'border_card': '#E5E7EB',
        'text_primary': '#4A1F2D',
        'text_muted': '#58626F',
        'color_accent': '#B94B61',          # Rose Crimson accent (WCAG 5.68:1 AA Pass on Porcelain)
        'color_accent_glow': '#B94B61',
        'accent_text_on_button': '#FFFFFF',  # WCAG 5.68:1 AA Pass on #B94B61
        'button_secondary_border': '#4A1F2D',
        'button_secondary_text': '#4A1F2D',
        'badge_bg': 'rgba(185, 75, 97, 0.1)',
        'badge_border': '#B94B61',
        'badge_text': '#881337',
        'plaque_bg': '#4A1F2D',
        'plaque_border': '#B94B61',
        'plaque_title': '#FFFFFF',
        'plaque_text': '#F3F4F6',
        'seal_bg': '#5C2838',
        'seal_border': '#B94B61',
        'seal_text': '#FDA4AF',
        'contact_bg': '#4A1F2D',
        'contact_card_bg': '#5C2838',
        'contact_card_border': 'rgba(185, 75, 97, 0.4)',
        'contact_title': '#FFFFFF',
        'contact_text': '#E5E7EB',
        'input_bg': '#4A1F2D',
        'input_border': 'rgba(247, 248, 250, 0.25)',
        'input_text': '#FFFFFF',
        'out_filename': 'V65_PREVIEW_OPTION_E.png'
    },
    'F': {
        'id': 'F',
        'title': 'Royal Indigo & Arctic Mint',
        'subtitle': 'Royal Indigo #182552 | Arctic Frost #F4F7FB | Vibrant Cobalt #3A5BCC | Arctic Mint #50BFA5',
        'font_heading': "'Space Grotesk', -apple-system, sans-serif",
        'font_body': "'Inter', -apple-system, sans-serif",
        'bg_navbar': '#182552',
        'border_navbar': 'rgba(80, 191, 165, 0.35)',
        'text_navbar': '#FFFFFF',
        'nav_link_muted': '#93C5FD',
        'bg_canvas': '#F4F7FB',
        'bg_card': '#FFFFFF',
        'border_card': '#E2E8F0',
        'text_primary': '#182552',
        'text_muted': '#4B5563',
        'color_accent': '#50BFA5',          # Arctic Mint
        'color_accent_glow': '#3A5BCC',     # Vibrant Cobalt
        'accent_text_on_button': '#182552',  # WCAG 6.90:1 AAA Pass (Dark Indigo text on Arctic Mint!)
        'button_secondary_border': '#182552',
        'button_secondary_text': '#182552',
        'badge_bg': 'rgba(80, 191, 165, 0.15)',
        'badge_border': '#50BFA5',
        'badge_text': '#0F766E',
        'plaque_bg': '#182552',
        'plaque_border': '#50BFA5',
        'plaque_title': '#FFFFFF',
        'plaque_text': '#E0E7FF',
        'seal_bg': '#25356D',
        'seal_border': '#50BFA5',
        'seal_text': '#50BFA5',
        'contact_bg': '#182552',
        'contact_card_bg': '#25356D',
        'contact_card_border': 'rgba(80, 191, 165, 0.35)',
        'contact_title': '#FFFFFF',
        'contact_text': '#CBD5E1',
        'input_bg': '#182552',
        'input_border': 'rgba(244, 247, 251, 0.25)',
        'input_text': '#FFFFFF',
        'out_filename': 'V65_PREVIEW_OPTION_F.png'
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

# 1. Generate HTML files for D, E, F
print("Generating HTML mockups for Options D, E, F...")
html_files = {}
for key, theme in THEMES_BACKUP.items():
    html_content = generate_html(theme)
    file_path = os.path.join(TMP_DIR, f'option_{key.lower()}.html')
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    html_files[key] = file_path
    print(f"  Saved HTML: {file_path}")

# 2. Render each HTML to 1440px PNG via Edge headless
print("\nRendering HTML mockups to high-res PNG via Edge headless...")
rendered_pngs = {}
for key, theme in THEMES_BACKUP.items():
    html_path = html_files[key]
    out_png = os.path.join(BACKUP_DIR, theme['out_filename'])
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

# 3. Create the Combined Three-Direction Comparison Image for Backup Directions (D, E, F)
print("\nComposing combined backup comparison image (V65_THREE_BACKUP_DIRECTION_COMPARISON.png)...")
comparison_path = os.path.join(BACKUP_DIR, 'V65_THREE_BACKUP_DIRECTION_COMPARISON.png')

# Load the three images
img_d = Image.open(rendered_pngs['D'])
img_e = Image.open(rendered_pngs['E'])
img_f = Image.open(rendered_pngs['F'])

# Downsample width for 3-column side-by-side comparison
target_col_w = 720
scale = target_col_w / img_d.width
target_h = int(img_d.height * scale)

thumb_d = img_d.resize((target_col_w, target_h), Image.Resampling.LANCZOS)
thumb_e = img_e.resize((target_col_w, target_h), Image.Resampling.LANCZOS)
thumb_f = img_f.resize((target_col_w, target_h), Image.Resampling.LANCZOS)

banner_h = 140
gap = 24
comp_w = (target_col_w * 3) + (gap * 4)
comp_h = target_h + banner_h + gap + 30

comp_img = Image.new('RGB', (comp_w, comp_h), color='#0B1120')
draw = ImageDraw.Draw(comp_img)

# Fonts
try:
    font_title = ImageFont.truetype("arialbd.ttf", 36)
    font_sub = ImageFont.truetype("arial.ttf", 20)
    font_col = ImageFont.truetype("arialbd.ttf", 22)
    font_col_sub = ImageFont.truetype("arial.ttf", 15)
except Exception:
    font_title = font_sub = font_col = font_col_sub = ImageFont.load_default()

# Draw Main Header
title_text = "KAVITHA & ASSOCIATES — THREE ALTERNATIVE VISUAL DIRECTIONS (PHASE 2)"
sub_text = "Comparative 1440px Desktop Previews for Client Review (Options D, E & F with Identical Section Structure)"
draw.text((gap, 30), title_text, fill='#FFFFFF', font=font_title)
draw.text((gap, 78), sub_text, fill='#94A3B8', font=font_sub)

# Draw Column Titles & Place Images
columns = [
    ('OPTION D: GRAPHITE & ELECTRIC BLUE', '#3B82F6', 'Graphite #18212F | Cool Mist #F5F7FA | Electric #3B82F6 | Slate #64748B', thumb_d),
    ('OPTION E: BURGUNDY & PORCELAIN', '#FDA4AF', 'Burgundy #4A1F2D | Porcelain #F7F8FA | Rose Crimson #B94B61 | Slate #77808D', thumb_e),
    ('OPTION F: ROYAL INDIGO & ARCTIC MINT', '#50BFA5', 'Royal Indigo #182552 | Arctic Frost #F4F7FB | Vibrant #3A5BCC | Mint #50BFA5', thumb_f)
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
print(f"[SUCCESS] Combined backup comparison image saved: {comparison_path} ({comp_w}x{comp_h}, {comp_sz/1024:.1f} KB)")

# Mirror to root directory
root_comp = os.path.abspath('V65_THREE_BACKUP_DIRECTION_COMPARISON.png')
comp_img.save(root_comp, quality=95)
print(f"[SUCCESS] Mirrored to root directory: {root_comp}")

# Also copy all 4 files to the Antigravity Artifacts directory for inline preview
if os.path.exists(ARTIFACTS_DIR):
    import shutil
    for fname in ['V65_PREVIEW_OPTION_D.png', 'V65_PREVIEW_OPTION_E.png', 'V65_PREVIEW_OPTION_F.png', 'V65_THREE_BACKUP_DIRECTION_COMPARISON.png']:
        src_f = os.path.join(BACKUP_DIR, fname)
        dst_f = os.path.join(ARTIFACTS_DIR, fname)
        if os.path.exists(src_f):
            shutil.copy2(src_f, dst_f)
            print(f"[SUCCESS] Copied to Artifacts: {dst_f}")

print("\n--- ALL V6.5 PHASE 2 PREVIEWS COMPLETED SUCCESSFULLY ---")
