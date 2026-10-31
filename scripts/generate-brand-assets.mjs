/**
 * Brand Assets Generator for Kavitha & Associates
 * Recreates the AI emblem as clean, mathematical vector typography & flat SVGs:
 * 1. ka-monogram-flat.svg (Standalone flat monogram emblem)
 * 2. ka-logo-header.svg (Compact horizontal navbar brandmark)
 * 3. ka-logo-full.svg (Full horizontal corporate brandmark)
 * 4. ka-logo-vertical.svg (Centered vertical emblem brandmark)
 * 5. favicon.svg (Modern tab icon)
 * 6. ka-google-profile-logo.svg (Google Business Profile 1:1 avatar)
 * 7. ka-google-cover-banner.svg (Google Business Profile 16:9 banner)
 * 8. ka-business-card-front.svg (3.5" x 2" executive dark green & gold card)
 * 9. ka-business-card-back.svg (3.5" x 2" luxury ivory credential card)
 * 10. index.html (Interactive Brand Asset Showcase)
 */

import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('public/brand');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Canonical Luxury Editorial Brand Colors
const COLORS = {
  forest: '#153F32',     // Primary Forest Green
  deep: '#102D25',       // Deep Forest Green
  gold: '#C3A66B',       // Muted Refined Gold
  goldLight: '#E0CDA9',  // Light Accent Gold
  goldDark: '#A68848',   // Deep Gold
  ivory: '#F5F1E8',      // Warm Ivory
  charcoal: '#252B27',   // Dark Charcoal
  muted: '#747A73',      // Subdued Secondary
  border: '#E5E1D8',     // Architectural Hairline
  white: '#FFFFFF'
};

/**
 * Reusable Vector Monogram Definition (The intertwined K & A with dynamic swoop and 3 growth bars)
 * Coordinate system: 0 0 240 180 (centered)
 */
function getMonogramSvgElements({ darkBackground = false, scale = 1, x = 0, y = 0 } = {}) {
  const kColor = darkBackground ? COLORS.white : COLORS.forest;
  const aColor = COLORS.gold;
  const swooshColor = COLORS.gold;
  const swooshShadow = darkBackground ? 'rgba(0,0,0,0.3)' : 'rgba(16,45,37,0.25)';
  const barColor = darkBackground ? COLORS.goldLight : COLORS.forest;

  return `
  <g transform="translate(${x}, ${y}) scale(${scale})">
    <!-- DEFINITIONS: Subtle refined linear gradients for flat vector richness -->
    <defs>
      <linearGradient id="goldGrad_${darkBackground ? 'dark' : 'light'}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${COLORS.goldLight}" />
        <stop offset="50%" stop-color="${COLORS.gold}" />
        <stop offset="100%" stop-color="${COLORS.goldDark}" />
      </linearGradient>
      <linearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E5443" />
        <stop offset="60%" stop-color="${COLORS.forest}" />
        <stop offset="100%" stop-color="${COLORS.deep}" />
      </linearGradient>
      <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="${swooshShadow}" />
      </filter>
    </defs>

    <!-- ===================================================================
         LETTER 'K' (Classical Roman Capital Serif in Forest Green)
         Stem: Left x=35-52, height 28-142
         Upper Arm: Slopes up-right to (115, 28)
         Lower Leg: Slopes down-right to (118, 142)
         =================================================================== -->
    <g id="letter-K" fill="${darkBackground ? COLORS.white : 'url(#forestGrad)'}">
      <!-- K Stem -->
      <path d="M 35 34 
               L 43 34 
               L 43 136 
               L 35 136 
               C 32 136, 30 137, 30 140 
               L 30 142 
               L 60 142 
               L 60 140 
               C 60 137, 58 136, 55 136 
               L 48 136 
               L 48 34 
               L 55 34 
               C 58 34, 60 33, 60 30 
               L 60 28 
               L 30 28 
               L 30 30 
               C 30 33, 32 34, 35 34 Z" />

      <!-- K Upper Arm (Diagonal) -->
      <path d="M 48 94 
               L 95 36 
               L 88 36 
               C 85 36, 84 35, 84 32 
               L 84 28 
               L 115 28 
               L 115 32 
               C 115 35, 113 36, 110 36 
               L 104 36 
               L 62 88 
               Z" />

      <!-- K Lower Leg (Diagonal with classical flared foot terminal) -->
      <path d="M 54 84 
               L 98 136 
               L 92 136 
               C 89 136, 88 137, 88 140 
               L 88 142 
               L 122 142 
               C 120 138, 117 136, 112 133 
               L 72 84 
               Z" />
    </g>

    <!-- ===================================================================
         LETTER 'A' (Classical Intertwined Serif in Refined Matte Gold)
         Apex: x=135, y=28
         Left diagonal slopes to x=86, y=142
         Right diagonal slopes to x=175, y=142
         =================================================================== -->
    <g id="letter-A" fill="url(#goldGrad_${darkBackground ? 'dark' : 'light'})">
      <!-- Apex Serif / Crown -->
      <path d="M 125 28 
               L 145 28 
               L 143 33 
               L 127 33 Z" />

      <!-- Left Diagonal Leg (Thin / Harmonic stroke) -->
      <path d="M 133 33 
               L 90 136 
               L 84 136 
               C 81 136, 80 137, 80 140 
               L 80 142 
               L 108 142 
               L 108 140 
               C 108 137, 106 136, 103 136 
               L 98 136 
               L 112 102 
               L 136 102 
               L 138 95 
               L 115 95 
               L 137 42 
               Z" />

      <!-- Right Diagonal Leg (Heavy architectural stroke) -->
      <path d="M 137 33 
               L 170 136 
               L 165 136 
               C 162 136, 160 137, 160 140 
               L 160 142 
               L 190 142 
               L 190 140 
               C 190 137, 188 136, 184 136 
               L 178 136 
               L 148 33 
               Z" />

      <!-- A Crossbar (Hairline bridge) -->
      <path d="M 112 102 L 158 102 L 157 106 L 111 106 Z" opacity="0.9" />
    </g>

    <!-- ===================================================================
         FINANCIAL GROWTH BARS (Inside the triangular counter of the A)
         Signifies Auditing, Accounting, Assurance & Strategic Financial Growth
         =================================================================== -->
    <g id="growth-bars" fill="${barColor}">
      <!-- Bar 1 (Left - Foundation): h=16px -->
      <rect x="131" y="90" width="4.5" height="12" rx="1.2" />
      <!-- Bar 2 (Middle - Acceleration): h=24px -->
      <rect x="138" y="82" width="4.5" height="20" rx="1.2" />
      <!-- Bar 3 (Right - Statutory Rigor & Peak Governance): h=32px -->
      <rect x="145" y="74" width="4.5" height="28" rx="1.2" />
    </g>

    <!-- ===================================================================
         DYNAMIC TRAJECTORY SWOOSH (Golden Ascending Arch)
         Curves fluidly from K's waist through A, symbolizing forward commercial momentum
         =================================================================== -->
    <path id="dynamic-swoosh"
          d="M 28 88 
             C 48 83, 76 87, 105 103 
             C 128 116, 152 119, 180 110 
             C 162 115, 140 112, 118 102 
             C 88 88, 56 82, 28 88 Z"
          fill="url(#goldGrad_${darkBackground ? 'dark' : 'light'})"
          filter="url(#subtleGlow)" />

    <!-- Secondary Upper Accent Arc (Echoing the crest of the letter A) -->
    <path id="crest-swoosh"
          d="M 88 116 
             C 120 78, 160 58, 204 65 
             C 172 66, 138 82, 108 114 
             C 101 122, 94 125, 88 116 Z"
          fill="url(#goldGrad_${darkBackground ? 'dark' : 'light'})"
          opacity="0.95" />
  </g>
  `;
}

/**
 * 1. STANDALONE FLAT MONOGRAM EMBLEM (Vector SVG)
 */
function generateMonogramSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="100%" height="100%">
  <title>Kavitha &amp; Associates — Monogram Emblem</title>
  <desc>Simplified flat vector monogram with classical serif K, gold serif A, financial growth bars, and dynamic ascending trajectory swoosh.</desc>
  ${getMonogramSvgElements({ darkBackground: false, scale: 1, x: 10, y: 5 })}
</svg>`;
}

/**
 * 2. STANDALONE GOLD MONOGRAM EMBLEM (For dark backgrounds)
 */
function generateMonogramGoldSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180" width="100%" height="100%">
  <title>Kavitha &amp; Associates — Gold Monogram Emblem</title>
  ${getMonogramSvgElements({ darkBackground: true, scale: 1, x: 10, y: 5 })}
</svg>`;
}

/**
 * 3. COMPACT HORIZONTAL WEBSITE HEADER LOGO (320x56)
 * Specifically optimized for the website header navigation bar
 */
function generateHeaderLogoSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 56" width="340" height="56">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&amp;family=Inter:wght@600;700&amp;display=swap');
      .header-title {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 21px;
        font-weight: 700;
        letter-spacing: 0.02em;
        fill: ${COLORS.forest};
      }
      .header-title-amp {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 20px;
        font-weight: 600;
        font-style: italic;
        fill: ${COLORS.gold};
      }
      .header-subtitle {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        fill: ${COLORS.goldDark};
      }
    </style>
  </defs>

  <!-- Left: Monogram Mark (Scales down crisply to fit 48px height) -->
  ${getMonogramSvgElements({ darkBackground: false, scale: 0.32, x: 4, y: 0 })}

  <!-- Right: Clean Vector Typography -->
  <g transform="translate(74, 0)">
    <!-- Primary Title -->
    <text x="0" y="28" class="header-title">
      KAVITHA <tspan class="header-title-amp">&amp;</tspan> ASSOCIATES
    </text>

    <!-- Hairline Accent Rule + Subtitle -->
    <line x1="0" y1="36" x2="250" y2="36" stroke="${COLORS.border}" stroke-width="1" />
    <text x="0" y="47" class="header-subtitle">
      CHARTERED ACCOUNTANTS
    </text>
  </g>
</svg>`;
}

/**
 * 4. FULL CORPORATE HORIZONTAL LOGO (800x180)
 * Master corporate identity lockup with all 3 tiers of typography
 */
function generateFullLogoSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 180" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&amp;family=Inter:wght@500;600;700&amp;display=swap');
      .corp-title-main {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 42px;
        font-weight: 700;
        letter-spacing: 0.08em;
        fill: ${COLORS.forest};
      }
      .corp-title-amp {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 40px;
        font-weight: 600;
        font-style: italic;
        fill: ${COLORS.gold};
      }
      .corp-sub-text {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 14px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.32em;
        fill: ${COLORS.goldDark};
      }
      .corp-disciplines {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.36em;
        fill: ${COLORS.muted};
      }
    </style>
  </defs>

  <!-- Left Monogram Icon Block -->
  ${getMonogramSvgElements({ darkBackground: false, scale: 0.95, x: 10, y: 10 })}

  <!-- Right Typography Block -->
  <g transform="translate(240, 10)">
    <!-- Tier 1: Master Wordmark -->
    <text x="0" y="62" class="corp-title-main">
      KAVITHA <tspan class="corp-title-amp">&amp;</tspan> ASSOCIATES
    </text>

    <!-- Tier 2: Subtitle with Flanking Hairline Rules -->
    <g transform="translate(0, 96)">
      <line x1="0" y1="-5" x2="60" y2="-5" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.6" />
      <text x="75" y="0" class="corp-sub-text">CHARTERED ACCOUNTANTS</text>
      <line x1="495" y1="-5" x2="570" y2="-5" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.6" />
    </g>

    <!-- Tier 3: Core Disciplines Kicker -->
    <text x="2" y="138" class="corp-disciplines">
      AUDIT  <tspan fill="${COLORS.gold}">•</tspan>  TAX  <tspan fill="${COLORS.gold}">•</tspan>  ADVISORY  <tspan fill="${COLORS.gold}">•</tspan>  COMPLIANCE
    </text>
  </g>
</svg>`;
}

/**
 * 5. VERTICAL STACKED LOGO LOCKUP (600x520)
 * Exact recreation of the user's uploaded orientation in flat vector typography
 */
function generateVerticalLogoSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 520" width="100%" height="100%">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&amp;family=Inter:wght@500;600;700&amp;display=swap');
      .vert-title-main {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 46px;
        font-weight: 700;
        letter-spacing: 0.08em;
        fill: ${COLORS.forest};
        text-anchor: middle;
      }
      .vert-title-amp {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 44px;
        font-weight: 600;
        font-style: italic;
        fill: ${COLORS.gold};
      }
      .vert-sub-text {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 14.5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.36em;
        fill: ${COLORS.goldDark};
        text-anchor: middle;
      }
      .vert-disciplines {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 11.5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.38em;
        fill: ${COLORS.muted};
        text-anchor: middle;
      }
    </style>
  </defs>

  <!-- Centered Monogram Mark -->
  ${getMonogramSvgElements({ darkBackground: false, scale: 1.35, x: 155, y: 15 })}

  <!-- Centered Typography Hierarchy -->
  <g transform="translate(300, 310)">
    <!-- Master Wordmark -->
    <text x="0" y="30" class="vert-title-main">
      KAVITHA <tspan class="vert-title-amp">&amp;</tspan> ASSOCIATES
    </text>

    <!-- Hairline Separator with Tracked Subtitle -->
    <g transform="translate(0, 78)">
      <line x1="-240" y1="-5" x2="-145" y2="-5" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.7" />
      <text x="0" y="0" class="vert-sub-text">CHARTERED ACCOUNTANTS</text>
      <line x1="145" y1="-5" x2="240" y2="-5" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.7" />
    </g>

    <!-- Practice Disciplines -->
    <text x="0" y="125" class="vert-disciplines">
      AUDIT  <tspan fill="${COLORS.gold}">•</tspan>  TAX  <tspan fill="${COLORS.gold}">•</tspan>  ADVISORY  <tspan fill="${COLORS.gold}">•</tspan>  COMPLIANCE
    </text>
  </g>
</svg>`;
}

/**
 * 6. FAVICON & APP ICON (64x64)
 * High-legibility browser tab icon with luxury dark-forest squircle & gold monogram
 */
function generateFaviconSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#153F32" />
      <stop offset="100%" stop-color="#0E2720" />
    </linearGradient>
    <linearGradient id="favGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E0CDA9" />
      <stop offset="60%" stop-color="#C3A66B" />
      <stop offset="100%" stop-color="#A68848" />
    </linearGradient>
  </defs>

  <!-- Squircle Base Frame -->
  <rect width="64" height="64" rx="16" fill="url(#favBg)" />
  <rect x="2" y="2" width="60" height="60" rx="14" fill="none" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.55" />

  <!-- Monogram Elements centered on 64x64 canvas -->
  ${getMonogramSvgElements({ darkBackground: true, scale: 0.28, x: 4, y: 7 })}
</svg>`;
}

/**
 * 7. GOOGLE BUSINESS PROFILE 1:1 SQUARE AVATAR (1024x1024)
 * Specifically includes a circular safe-zone preview (radius 460) so nothing is clipped on Google Maps / Search
 */
function generateGoogleProfileLogoSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&amp;family=Inter:wght@600;700&amp;display=swap');
      .gbp-title {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 64px;
        font-weight: 700;
        letter-spacing: 0.08em;
        fill: #FFFFFF;
        text-anchor: middle;
      }
      .gbp-amp {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 60px;
        font-weight: 600;
        font-style: italic;
        fill: ${COLORS.gold};
      }
      .gbp-subtitle {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 20px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.36em;
        fill: ${COLORS.goldLight};
        text-anchor: middle;
      }
      .gbp-meta {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 15px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.28em;
        fill: #A7F3D0;
        text-anchor: middle;
      }
    </style>
    <linearGradient id="gbpBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#153F32" />
      <stop offset="50%" stop-color="#102D25" />
      <stop offset="100%" stop-color="#0A1F19" />
    </linearGradient>
    <radialGradient id="goldRadial" cx="50%" cy="38%" r="45%">
      <stop offset="0%" stop-color="rgba(195,166,107,0.18)" />
      <stop offset="100%" stop-color="rgba(195,166,107,0)" />
    </radialGradient>
  </defs>

  <!-- Deep Forest Green Canvas -->
  <rect width="1024" height="1024" fill="url(#gbpBg)" />

  <!-- Subtle Radial Glow Behind Monogram -->
  <circle cx="512" cy="400" r="380" fill="url(#goldRadial)" />

  <!-- Outer Architectural Circular Hairline (Matches Google's round crop boundary) -->
  <circle cx="512" cy="512" r="480" fill="none" stroke="${COLORS.gold}" stroke-width="2.5" stroke-opacity="0.35" />
  <circle cx="512" cy="512" r="468" fill="none" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.2" />

  <!-- Centered Flat KA Monogram -->
  ${getMonogramSvgElements({ darkBackground: true, scale: 2.35, x: 250, y: 130 })}

  <!-- Brand Typography Lockup (Within circular safe zone: y=610 to y=880) -->
  <g transform="translate(512, 650)">
    <!-- Master Brand Name -->
    <text x="0" y="30" class="gbp-title">
      KAVITHA <tspan class="gbp-amp">&amp;</tspan> ASSOCIATES
    </text>

    <!-- Hairline Accent with Subtitle -->
    <g transform="translate(0, 75)">
      <line x1="-300" y1="-7" x2="-190" y2="-7" stroke="${COLORS.gold}" stroke-width="1.5" stroke-opacity="0.7" />
      <text x="0" y="0" class="gbp-subtitle">CHARTERED ACCOUNTANTS</text>
      <line x1="190" y1="-7" x2="300" y2="-7" stroke="${COLORS.gold}" stroke-width="1.5" stroke-opacity="0.7" />
    </g>

    <!-- Statutory Authority Pill / Location Meta -->
    <g transform="translate(0, 130)">
      <rect x="-190" y="-18" width="380" height="36" rx="18" fill="rgba(21,63,50,0.85)" stroke="${COLORS.gold}" stroke-width="1" stroke-opacity="0.4" />
      <text x="0" y="5" class="gbp-meta">TIRUPATI • PAN-INDIA PRACTICE</text>
    </g>
  </g>
</svg>`;
}

/**
 * 8. GOOGLE BUSINESS PROFILE 16:9 COVER BANNER (1024x576)
 * Landscape banner for Google Maps, desktop Google Search knowledge panel & social headers
 */
function generateGoogleCoverBannerSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 576" width="1024" height="576">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&amp;family=Inter:wght@400;500;600;700&amp;display=swap');
      .banner-kicker {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.28em;
        fill: ${COLORS.gold};
      }
      .banner-title {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 52px;
        font-weight: 700;
        letter-spacing: 0.04em;
        fill: #FFFFFF;
      }
      .banner-amp {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 48px;
        font-weight: 600;
        font-style: italic;
        fill: ${COLORS.gold};
      }
      .banner-sub {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 15px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.32em;
        fill: ${COLORS.goldLight};
      }
      .banner-lead {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 13.5px;
        font-weight: 400;
        line-height: 1.6;
        fill: #D1FAE5;
      }
      .banner-badge {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.12em;
        fill: #FFFFFF;
      }
    </style>
    <linearGradient id="coverBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#153F32" />
      <stop offset="60%" stop-color="#102D25" />
      <stop offset="100%" stop-color="#0A1F19" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1024" height="576" fill="url(#coverBg)" />

  <!-- Perimeter Hairline Border -->
  <rect x="20" y="20" width="984" height="536" rx="12" fill="none" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.3" />

  <!-- Left: Content Narrative -->
  <g transform="translate(65, 85)">
    <!-- Institutional Kicker -->
    <rect x="0" y="0" width="310" height="28" rx="14" fill="rgba(21,63,50,0.9)" stroke="${COLORS.gold}" stroke-width="1" stroke-opacity="0.4" />
    <circle cx="15" cy="14" r="3.5" fill="${COLORS.gold}" />
    <text x="28" y="18" class="banner-kicker">INDEPENDENT CA PRACTICE • TIRUPATI</text>

    <!-- Master Headline -->
    <text x="0" y="85" class="banner-title">
      KAVITHA <tspan class="banner-amp">&amp;</tspan> ASSOCIATES
    </text>

    <!-- Subtitle -->
    <text x="0" y="118" class="banner-sub">
      CHARTERED ACCOUNTANTS
    </text>

    <!-- Divider -->
    <line x1="0" y1="138" x2="480" y2="138" stroke="${COLORS.gold}" stroke-width="1" stroke-opacity="0.4" />

    <!-- Lead Body -->
    <text x="0" y="172" class="banner-lead">
      <tspan x="0" dy="0">Statutory Audit • Corporate Governance • Direct &amp; Indirect Tax Defense</tspan>
      <tspan x="0" dy="24">Led by CA Kavitha Vijay (ICAI Mem. [REDACTED_MEMBERSHIP_NO] | B.Com, CA, CMA AIR 49)</tspan>
      <tspan x="0" dy="24">10+ Years Big 4 (Deloitte) &amp; Fortune 50 Multinational Audit Leadership</tspan>
    </text>

    <!-- Badges Row -->
    <g transform="translate(0, 275)">
      <rect x="0" y="0" width="165" height="32" rx="16" fill="rgba(255,255,255,0.08)" stroke="${COLORS.gold}" stroke-width="1" stroke-opacity="0.35" />
      <text x="82" y="20" class="banner-badge" text-anchor="middle">ICAI Mem. [REDACTED_MEMBERSHIP_NO]</text>

      <rect x="178" y="0" width="160" height="32" rx="16" fill="rgba(255,255,255,0.08)" stroke="${COLORS.gold}" stroke-width="1" stroke-opacity="0.35" />
      <text x="258" y="20" class="banner-badge" text-anchor="middle">AIR 49 CMA Inter</text>

      <rect x="350" y="0" width="170" height="32" rx="16" fill="rgba(255,255,255,0.08)" stroke="${COLORS.gold}" stroke-width="1" stroke-opacity="0.35" />
      <text x="435" y="20" class="banner-badge" text-anchor="middle">Tirupati Chambers</text>
    </g>
  </g>

  <!-- Right: Prominent Monogram Emblem -->
  ${getMonogramSvgElements({ darkBackground: true, scale: 1.85, x: 570, y: 95 })}
</svg>`;
}

/**
 * 9. BUSINESS CARD — FRONT (3.5" x 2" @ 300 DPI = 1050x600 px)
 * Executive Deep Forest Green canvas with refined gold foil emblem & typography
 */
function generateBusinessCardFrontSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 600" width="1050" height="600">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&amp;family=Inter:wght@500;600;700&amp;display=swap');
      .bc-front-title {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 50px;
        font-weight: 700;
        letter-spacing: 0.12em;
        fill: #FFFFFF;
        text-anchor: middle;
      }
      .bc-front-amp {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 46px;
        font-weight: 600;
        font-style: italic;
        fill: ${COLORS.gold};
      }
      .bc-front-sub {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 15px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.42em;
        fill: ${COLORS.goldLight};
        text-anchor: middle;
      }
      .bc-front-disciplines {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.36em;
        fill: #A7F3D0;
        text-anchor: middle;
      }
    </style>
    <linearGradient id="bcBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#153F32" />
      <stop offset="60%" stop-color="#102D25" />
      <stop offset="100%" stop-color="#0A1F19" />
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="1050" height="600" fill="url(#bcBg)" />

  <!-- Double-Bezel Architectural Frame -->
  <rect x="24" y="24" width="1002" height="552" rx="16" fill="none" stroke="${COLORS.gold}" stroke-width="1.8" stroke-opacity="0.4" />
  <rect x="36" y="36" width="978" height="528" rx="10" fill="none" stroke="${COLORS.gold}" stroke-width="0.8" stroke-opacity="0.2" />

  <!-- Centered Emblem -->
  ${getMonogramSvgElements({ darkBackground: true, scale: 1.6, x: 335, y: 70 })}

  <!-- Centered Typography -->
  <g transform="translate(525, 385)">
    <!-- Wordmark -->
    <text x="0" y="20" class="bc-front-title">
      KAVITHA <tspan class="bc-front-amp">&amp;</tspan> ASSOCIATES
    </text>

    <!-- Subtitle with Hairlines -->
    <g transform="translate(0, 65)">
      <line x1="-240" y1="-5" x2="-145" y2="-5" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.7" />
      <text x="0" y="0" class="bc-front-sub">CHARTERED ACCOUNTANTS</text>
      <line x1="145" y1="-5" x2="240" y2="-5" stroke="${COLORS.gold}" stroke-width="1.2" stroke-opacity="0.7" />
    </g>

    <!-- Disciplines -->
    <text x="0" y="112" class="bc-front-disciplines">
      STATUTORY AUDIT  •  TAX DEFENSE  •  CORPORATE GOVERNANCE
    </text>
  </g>
</svg>`;
}

/**
 * 10. BUSINESS CARD — BACK (3.5" x 2" @ 300 DPI = 1050x600 px)
 * Luxury warm ivory canvas with partner credentials, contact channels, and chambers address
 */
function generateBusinessCardBackSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 600" width="1050" height="600">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&amp;family=Inter:wght@400;500;600;700&amp;display=swap');
      .bc-partner-name {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: 38px;
        font-weight: 700;
        letter-spacing: 0.04em;
        fill: ${COLORS.forest};
      }
      .bc-partner-title {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        fill: ${COLORS.goldDark};
      }
      .bc-quals {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 12.5px;
        font-weight: 600;
        letter-spacing: 0.06em;
        fill: ${COLORS.forest};
      }
      .bc-bio {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 11.5px;
        font-weight: 400;
        line-height: 1.5;
        fill: ${COLORS.muted};
      }
      .bc-label {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 9.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        fill: ${COLORS.goldDark};
      }
      .bc-value {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 12.5px;
        font-weight: 600;
        fill: ${COLORS.charcoal};
      }
    </style>
  </defs>

  <!-- Warm Ivory Background -->
  <rect width="1050" height="600" fill="${COLORS.ivory}" />

  <!-- Outer Hairline Frame -->
  <rect x="24" y="24" width="1002" height="552" rx="14" fill="none" stroke="${COLORS.border}" stroke-width="1.2" />

  <!-- Left Accent Color Pillar -->
  <rect x="24" y="24" width="12" height="552" rx="6" fill="${COLORS.forest}" />

  <!-- Left 5 Columns: Partner Credentials & Authority -->
  <g transform="translate(70, 75)">
    <!-- Small Monogram Watermark -->
    ${getMonogramSvgElements({ darkBackground: false, scale: 0.5, x: 0, y: 0 })}

    <g transform="translate(0, 115)">
      <text x="0" y="32" class="bc-partner-name">CA Kavitha Vijay</text>
      <text x="0" y="58" class="bc-partner-title">Senior Partner &amp; Managing Auditor</text>
      <text x="0" y="85" class="bc-quals">B.Com, CA, CMA (AIR 49)  |  ICAI Mem. [REDACTED_MEMBERSHIP_NO]</text>
      <line x1="0" y1="105" x2="380" y2="105" stroke="${COLORS.border}" stroke-width="1" />
      <text x="0" y="132" class="bc-bio">
        <tspan x="0" dy="0">10+ Years Big 4 (Deloitte) &amp; Fortune 50 MNC Experience.</tspan>
        <tspan x="0" dy="20">Direct partner supervision for all corporate audit &amp; tax files.</tspan>
      </text>
    </g>
  </g>

  <!-- Center Hairline Divider -->
  <line x1="535" y1="65" x2="535" y2="535" stroke="${COLORS.border}" stroke-width="1" stroke-dasharray="4 4" />

  <!-- Right Columns: Chambers & Direct Transmission Protocol -->
  <g transform="translate(585, 75)">
    <!-- Section 1: Phone -->
    <g transform="translate(0, 25)">
      <text x="0" y="0" class="bc-label">Direct Chambers Telephone</text>
      <text x="0" y="22" class="bc-value">+91 96263 50900  /  +91 95421 53906</text>
    </g>

    <!-- Section 2: Email -->
    <g transform="translate(0, 95)">
      <text x="0" y="0" class="bc-label">Written &amp; Statutory Enquiries</text>
      <text x="0" y="22" class="bc-value">cakavithasrj@gmail.com</text>
    </g>

    <!-- Section 3: Web Portal -->
    <g transform="translate(0, 165)">
      <text x="0" y="0" class="bc-label">Official Web Portal</text>
      <text x="0" y="22" class="bc-value">www.kavithaassociates.com</text>
    </g>

    <!-- Section 4: Physical Chambers -->
    <g transform="translate(0, 235)">
      <text x="0" y="0" class="bc-label">Principal Chambers (By Prior Appointment)</text>
      <text x="0" y="22" class="bc-value">Bairagi Patteda, Tirupati – 517501, Andhra Pradesh</text>
      <text x="0" y="42" class="bc-bio">Regional Corridors: Chennai • Bengaluru • Hyderabad • Coimbatore</text>
    </g>

    <!-- Section 5: Statutory Compliance Disclaimer -->
    <g transform="translate(0, 335)">
      <rect x="0" y="0" width="410" height="60" rx="6" fill="${COLORS.white}" stroke="${COLORS.border}" stroke-width="1" />
      <text x="14" y="24" class="bc-bio" fill="${COLORS.muted}">
        <tspan x="14" dy="0">Practicing Chartered Accountant governed by the regulations</tspan>
        <tspan x="14" dy="18">and code of ethics of the Institute of Chartered Accountants of India.</tspan>
      </text>
    </g>
  </g>
</svg>`;
}

/**
 * 11. INTERACTIVE BRAND ASSET SHOWCASE PORTAL
 */
function generateShowcaseHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kavitha &amp; Associates — Brand Identity Assets &amp; Guidelines</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand-forest: #153F32;
      --brand-deep: #102D25;
      --brand-gold: #C3A66B;
      --brand-ivory: #F5F1E8;
      --brand-charcoal: #252B27;
      --brand-border: #E5E1D8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--brand-ivory);
      color: var(--brand-charcoal);
      line-height: 1.6;
      padding: 40px 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      text-align: center;
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 1px solid var(--brand-border);
    }
    h1 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 42px;
      color: var(--brand-forest);
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.24em;
      color: var(--brand-gold);
      font-weight: 700;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 30px;
      margin-bottom: 50px;
    }
    .card {
      background: #FFFFFF;
      border-radius: 16px;
      border: 1px solid var(--brand-border);
      padding: 28px;
      box-shadow: 0 4px 20px rgba(21, 63, 50, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card-dark {
      background: var(--brand-deep);
      border-color: rgba(195, 166, 107, 0.4);
      color: #FFFFFF;
    }
    .card-header {
      margin-bottom: 20px;
    }
    .card-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--brand-forest);
      margin-bottom: 4px;
    }
    .card-dark .card-title {
      color: #FFFFFF;
    }
    .card-tag {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--brand-gold);
    }
    .preview-box {
      background: #FAF8F5;
      border: 1px solid var(--brand-border);
      border-radius: 12px;
      padding: 24px;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      overflow: hidden;
    }
    .preview-box.dark {
      background: var(--brand-deep);
      border-color: rgba(195, 166, 107, 0.3);
    }
    .preview-box img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    .btn-download {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--brand-forest);
      color: #FFFFFF;
      text-decoration: none;
      font-size: 12px;
      font-weight: 600;
      border-radius: 9999px;
      transition: all 0.2s ease;
      border: 1px solid var(--brand-gold);
    }
    .btn-download:hover {
      background: var(--brand-deep);
      transform: translateY(-2px);
    }
    .specs-list {
      font-size: 11px;
      color: #747A73;
      margin-bottom: 16px;
      line-height: 1.8;
    }
    .card-dark .specs-list {
      color: #A7F3D0;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <span class="subtitle">Official Brand Assets &amp; Vector System</span>
      <h1>Kavitha &amp; Associates</h1>
      <p style="color: #747A73; font-size: 14px; max-width: 650px; margin: 10px auto 0;">
        Recreated flat vector identity system with checked, precision typography, calibrated kerning, and pure mathematical SVG geometry based on the approved intertwined KA emblem direction.
      </p>
    </header>

    <div class="grid">
      <!-- 1. Header Logo -->
      <div class="card">
        <div class="card-header">
          <span class="card-tag">Deliverable 1 • Website Navigation</span>
          <h2 class="card-title">Website Header Logo</h2>
          <p class="specs-list">Horizontal layout (340x56) • Scaled for navbar height (36-48px) • Crisp vector text</p>
        </div>
        <div class="preview-box">
          <img src="ka-logo-header.svg" alt="Header Logo" style="max-height: 56px;">
        </div>
        <a href="ka-logo-header.svg" download class="btn-download">Download ka-logo-header.svg</a>
      </div>

      <!-- 2. Favicon & App Icon -->
      <div class="card">
        <div class="card-header">
          <span class="card-tag">Deliverable 2 • Browser &amp; Touch Icon</span>
          <h2 class="card-title">Favicon &amp; App Icon</h2>
          <p class="specs-list">Squircle 64x64 • Recognizable at 16px/32px • Embedded in public/favicon.svg</p>
        </div>
        <div class="preview-box">
          <img src="../favicon.svg" alt="Favicon" style="width: 64px; height: 64px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 16px;">
        </div>
        <a href="../favicon.svg" download class="btn-download">Download favicon.svg</a>
      </div>

      <!-- 3. Google Business Profile Avatar -->
      <div class="card card-dark">
        <div class="card-header">
          <span class="card-tag" style="color: #E0CDA9;">Deliverable 3 • Google Maps &amp; Search</span>
          <h2 class="card-title">Google Business Profile Avatar</h2>
          <p class="specs-list">1:1 Square (1024x1024) • Circular safe-crop tested (r=480px) • High-contrast</p>
        </div>
        <div class="preview-box dark">
          <img src="ka-google-profile-logo.svg" alt="Google Profile Logo" style="max-height: 180px; border-radius: 50%; border: 2px solid #C3A66B;">
        </div>
        <a href="ka-google-profile-logo.svg" download class="btn-download" style="background: #C3A66B; color: #102D25;">Download ka-google-profile-logo.svg</a>
      </div>

      <!-- 4. Google Business Profile Cover Banner -->
      <div class="card">
        <div class="card-header">
          <span class="card-tag">Deliverable 4 • Knowledge Panel Banner</span>
          <h2 class="card-title">Google Profile Cover Banner</h2>
          <p class="specs-list">16:9 Landscape (1024x576) • Practice pillars &amp; partner credentials • High resolution</p>
        </div>
        <div class="preview-box">
          <img src="ka-google-cover-banner.svg" alt="Cover Banner" style="max-height: 140px; border-radius: 8px;">
        </div>
        <a href="ka-google-cover-banner.svg" download class="btn-download">Download ka-google-cover-banner.svg</a>
      </div>

      <!-- 5. Business Card Front -->
      <div class="card card-dark">
        <div class="card-header">
          <span class="card-tag" style="color: #E0CDA9;">Deliverable 5 • Corporate Stationery</span>
          <h2 class="card-title">Business Card — Front</h2>
          <p class="specs-list">Standard 3.5" x 2" (1050x600 px @ 300 DPI) • Deep forest green with gold foil accents</p>
        </div>
        <div class="preview-box dark">
          <img src="ka-business-card-front.svg" alt="Business Card Front" style="max-height: 140px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.3);">
        </div>
        <a href="ka-business-card-front.svg" download class="btn-download" style="background: #C3A66B; color: #102D25;">Download ka-business-card-front.svg</a>
      </div>

      <!-- 6. Business Card Back -->
      <div class="card">
        <div class="card-header">
          <span class="card-tag">Deliverable 6 • Corporate Stationery</span>
          <h2 class="card-title">Business Card — Back</h2>
          <p class="specs-list">Standard 3.5" x 2" • Warm ivory with partner qualifications &amp; Tirupati chambers details</p>
        </div>
        <div class="preview-box">
          <img src="ka-business-card-back.svg" alt="Business Card Back" style="max-height: 140px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
        </div>
        <a href="ka-business-card-back.svg" download class="btn-download">Download ka-business-card-back.svg</a>
      </div>

      <!-- 7. Full Corporate Brandmark -->
      <div class="card" style="grid-column: 1 / -1;">
        <div class="card-header">
          <span class="card-tag">Master Corporate Lockup</span>
          <h2 class="card-title">Full Horizontal Corporate Brandmark</h2>
          <p class="specs-list">840x180 • Full 3-tier hierarchy: Wordmark + Chartered Accountants + Disciplines Kicker</p>
        </div>
        <div class="preview-box">
          <img src="ka-logo-full.svg" alt="Full Corporate Logo" style="max-height: 100px;">
        </div>
        <a href="ka-logo-full.svg" download class="btn-download">Download ka-logo-full.svg</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Generate all files
const assets = [
  { file: 'public/brand/ka-monogram-flat.svg', content: generateMonogramSvg() },
  { file: 'public/brand/ka-monogram-gold.svg', content: generateMonogramGoldSvg() },
  { file: 'public/brand/ka-logo-header.svg', content: generateHeaderLogoSvg() },
  { file: 'public/brand/ka-logo-full.svg', content: generateFullLogoSvg() },
  { file: 'public/brand/ka-logo-vertical.svg', content: generateVerticalLogoSvg() },
  { file: 'public/favicon.svg', content: generateFaviconSvg() },
  { file: 'public/brand/favicon.svg', content: generateFaviconSvg() },
  { file: 'public/brand/ka-google-profile-logo.svg', content: generateGoogleProfileLogoSvg() },
  { file: 'public/brand/ka-google-cover-banner.svg', content: generateGoogleCoverBannerSvg() },
  { file: 'public/brand/ka-business-card-front.svg', content: generateBusinessCardFrontSvg() },
  { file: 'public/brand/ka-business-card-back.svg', content: generateBusinessCardBackSvg() },
  { file: 'public/brand/index.html', content: generateShowcaseHtml() },
];

for (const asset of assets) {
  const filePath = path.resolve(asset.file);
  fs.writeFileSync(filePath, asset.content.trim(), 'utf8');
  console.log(`[GENERATED] ${asset.file} (${asset.content.length} bytes)`);
}

console.log('\\n[SUCCESS] All 11 brand assets generated with clean vector typography.');
