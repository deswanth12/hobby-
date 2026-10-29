import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = docx.Document()
    
    # Page setup - Standard A4 with 0.75 in (54 pt) margins
    for section in doc.sections:
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)
        
        # Header & Footer setup
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("Kavitha & Associates — Website Proposal & Client Meeting Notes | October 2026")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(100, 113, 108)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun1 = fp.add_run("CONFIDENTIAL & PRIVILEGED — PRACTICE CLIENT CONSULTATION RECORD")
        frun1.font.name = "Calibri"
        frun1.font.size = Pt(8)
        frun1.font.color.rgb = RGBColor(140, 153, 147)
        
    # Color Palette definitions
    C_FOREST = RGBColor(15, 62, 46)      # #0F3E2E Primary Brand Forest Green
    C_DEEP = RGBColor(10, 47, 36)        # #0A2F24 Deep Green
    C_INTERACTIVE = RGBColor(27, 115, 79)# #1B734F Medium Green
    C_GOLD = RGBColor(180, 140, 60)      # #C5A059 Muted Gold Accent
    C_CHARCOAL = RGBColor(36, 52, 47)    # #24342F Dark Charcoal Body
    C_MUTED = RGBColor(100, 113, 108)    # #64716C Secondary Text
    C_WHITE = RGBColor(255, 255, 255)
    
    HEX_FOREST = "0F3E2E"
    HEX_DEEP = "0A2F24"
    HEX_PALE_SAGE = "F0F7F3"
    HEX_WARM_BG = "FCFCFA"
    HEX_BORDER = "D1DCD5"
    HEX_LIGHT_GRAY = "F4F6F5"
    HEX_GOLD_PALE = "FAF6EE"
    HEX_GOLD_BORDER = "C5A059"
    
    # Helper functions for styling
    def set_cell_shading(cell, hex_color):
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shd)
        
    def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
        tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
        cell._tc.get_or_add_tcPr().append(tcMar)
        
    def set_cell_border(cell, top=None, bottom=None, left=None, right=None):
        borders = f'<w:tcBorders {nsdecls("w")}>'
        borders += f'<w:top w:val="{top.get("val","single") if top else "none"}" w:sz="{top.get("sz","4") if top else "0"}" w:space="0" w:color="{top.get("color", HEX_BORDER) if top else "auto"}"/>'
        borders += f'<w:left w:val="{left.get("val","single") if left else "none"}" w:sz="{left.get("sz","4") if left else "0"}" w:space="0" w:color="{left.get("color", HEX_BORDER) if left else "auto"}"/>'
        borders += f'<w:bottom w:val="{bottom.get("val","single") if bottom else "none"}" w:sz="{bottom.get("sz","4") if bottom else "0"}" w:space="0" w:color="{bottom.get("color", HEX_BORDER) if bottom else "auto"}"/>'
        borders += f'<w:right w:val="{right.get("val","single") if right else "none"}" w:sz="{right.get("sz","4") if right else "0"}" w:space="0" w:color="{right.get("color", HEX_BORDER) if right else "auto"}"/>'
        borders += '</w:tcBorders>'
        cell._tc.get_or_add_tcPr().append(parse_xml(borders))
        
    def style_paragraph(p, space_before=2, space_after=4, line_spacing=1.15):
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing

    def add_h1(text):
        p = doc.add_paragraph()
        style_paragraph(p, space_before=14, space_after=5)
        run = p.add_run(text)
        run.font.name = "Georgia"
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = C_FOREST
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        style_paragraph(p, space_before=10, space_after=3)
        run = p.add_run(text)
        run.font.name = "Georgia"
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = C_INTERACTIVE
        return p

    def add_body(text, bold=False, italic=False, color=C_CHARCOAL, space_after=3):
        p = doc.add_paragraph()
        style_paragraph(p, space_before=1, space_after=space_after)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10)
        run.font.bold = bold
        run.font.italic = italic
        run.font.color.rgb = color
        return p

    def add_bullet(p_or_text, bold_prefix="", text="", level=0):
        p = doc.add_paragraph(style='List Bullet')
        style_paragraph(p, space_before=1, space_after=2)
        if bold_prefix:
            r_pre = p.add_run(bold_prefix + " ")
            r_pre.font.name = "Calibri"
            r_pre.font.size = Pt(9.5)
            r_pre.font.bold = True
            r_pre.font.color.rgb = C_FOREST
        r_txt = p.add_run(text)
        r_txt.font.name = "Calibri"
        r_txt.font.size = Pt(9.5)
        r_txt.font.color.rgb = C_CHARCOAL
        return p

    def add_callout(title, text_lines, hex_bg=HEX_PALE_SAGE, border_color=HEX_FOREST):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        cell = table.cell(0, 0)
        cell.width = Inches(6.77)
        set_cell_shading(cell, hex_bg)
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
        set_cell_border(cell, 
                        top={"val": "single", "sz": "4", "color": border_color},
                        bottom={"val": "single", "sz": "4", "color": border_color},
                        left={"val": "single", "sz": "18", "color": border_color},
                        right={"val": "single", "sz": "4", "color": border_color})
        
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=1, space_after=3)
        r_title = p.add_run(title)
        r_title.font.name = "Georgia"
        r_title.font.size = Pt(10)
        r_title.font.bold = True
        r_title.font.color.rgb = C_FOREST
        
        for line in text_lines:
            p2 = cell.add_paragraph()
            style_paragraph(p2, space_before=1, space_after=2)
            r = p2.add_run(line)
            r.font.name = "Calibri"
            r.font.size = Pt(9)
            r.font.color.rgb = C_CHARCOAL
        
        # Spacer
        p_sp = doc.add_paragraph()
        style_paragraph(p_sp, space_before=0, space_after=3)

    # =========================================================================
    # COVER / HEADER BLOCK
    # =========================================================================
    hdr_table = doc.add_table(rows=1, cols=1)
    hdr_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_table.autofit = False
    c_hdr = hdr_table.cell(0, 0)
    c_hdr.width = Inches(6.77)
    set_cell_shading(c_hdr, HEX_FOREST)
    set_cell_margins(c_hdr, top=160, bottom=160, left=180, right=180)
    set_cell_border(c_hdr, 
                    top={"val": "single", "sz": "4", "color": HEX_FOREST},
                    bottom={"val": "single", "sz": "12", "color": HEX_GOLD_BORDER},
                    left={"val": "single", "sz": "4", "color": HEX_FOREST},
                    right={"val": "single", "sz": "4", "color": HEX_FOREST})

    p_top = c_hdr.paragraphs[0]
    style_paragraph(p_top, space_before=0, space_after=2)
    r_firm = p_top.add_run("KAVITHA & ASSOCIATES")
    r_firm.font.name = "Georgia"
    r_firm.font.size = Pt(18)
    r_firm.font.bold = True
    r_firm.font.color.rgb = C_WHITE

    p_sub = c_hdr.add_paragraph()
    style_paragraph(p_sub, space_before=0, space_after=8)
    r_sub = p_sub.add_run("CHARTERED ACCOUNTANTS  |  COST ACCOUNTANTS  •  TIRUPATI & PAN-INDIA")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(9.5)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(220, 190, 120)

    p_title = c_hdr.add_paragraph()
    style_paragraph(p_title, space_before=4, space_after=2)
    r_t = p_title.add_run("Website Proposal & Client Meeting Consultation Guide")
    r_t.font.name = "Georgia"
    r_t.font.size = Pt(13)
    r_t.font.bold = True
    r_t.font.color.rgb = C_WHITE

    p_meta = c_hdr.add_paragraph()
    style_paragraph(p_meta, space_before=2, space_after=0)
    r_m = p_meta.add_run("Meeting Focus: Live Prototype Demonstration, Scope Clarity, Operational Data Capture & Launch Sign-Off\nTarget Recipient: CA KavithaVijay SRJ (B.Com, FCA, CMA), Senior Partner  •  Date: October 29, 2026")
    r_m.font.name = "Calibri"
    r_m.font.size = Pt(8.5)
    r_m.font.color.rgb = RGBColor(210, 230, 220)

    doc.add_paragraph() # Spacer

    # =========================================================================
    # SECTION 1: EXECUTIVE BRIEFING & PROJECT MATERIALS INSPECTION
    # =========================================================================
    add_h1("1. Executive Briefing & Project Materials Inspection")
    
    add_body("This document has been prepared for the prospective client consultation with Kavitha & Associates. All factual statements, practice metrics, and compliance controls are grounded directly in the inspected project files, firm profile, and verified build outputs.")
    
    add_h2("1.1 Available Project Artifacts Inspected Prior to Meeting")
    
    # Table of inspected materials
    t_inspect = doc.add_table(rows=1, cols=4)
    t_inspect.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_inspect.autofit = False
    
    col_w = [Inches(1.5), Inches(1.8), Inches(1.0), Inches(2.47)]
    headers = ["Artifact / Source", "File Location", "Status", "Inspected Facts & Scope Verified"]
    
    for i, h in enumerate(headers):
        cell = t_inspect.cell(0, i)
        cell.width = col_w[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_WHITE
        
    inspect_data = [
        ("Firm Profile PDF", "Kavitha_and_Associates_Firm_Profile.pdf", "Available (897 KB)", "2 pages verified. Partner: CA KavithaVijay SRJ (B.Com, FCA, CMA). 5 cities, 9 audit specializations, 5 practice domains, phones, email."),
        ("Comprehensive Audit", "reports/ca-website-audit.md", "Available (25.8 KB)", "15-section technical audit confirming 0 build errors, 7-route QA pass, ICAI compliance alignment, SEO assets, responsive audit across 5 viewports."),
        ("Confirmation Checklist", "reports/client-confirmation-checklist.md", "Available (2.4 KB)", "Identifies 5 essential operational items: Tirupati street address, FRN/MRN display permissions, branch classification, domain, communication routing."),
        ("Firm Data Store", "src/data/firmData.ts", "Available (11.1 KB)", "Central data model for firm profile, services, contact desk, WhatsApp URL parameters, verification notes, and regional reach descriptions."),
        ("HTML & Schema Setup", "index.html", "Available (3.7 KB)", "OpenGraph tags, Twitter cards, Google Fonts (Cormorant Garamond + Plus Jakarta Sans), Schema.org AccountingService JSON-LD structured data."),
        ("Technical SEO Assets", "public/robots.txt, sitemap.xml", "Available", "Robots.txt allowing indexing; XML sitemap indexing all 7 canonical public routes with priority weights and lastmod dates."),
        ("Hosting Rewrite Config", "public/_redirects, vercel.json", "Available", "Production SPA routing rewrites configured to prevent 404 errors on deep route refreshes on Netlify, Cloudflare Pages, and Vercel."),
        ("Production Build", "dist/ (compiled output)", "Verified", "Compiled cleanly via 'tsc -b && vite build' in 13.3s with 0 errors. Dist bundle: index.html (3.83 kB), CSS (31.4 kB), JS (294.9 kB)."),
        ("Official Firm Logo File", "Workspace root", "Unavailable", "Vector/PNG logo graphic not provided by client. Clean typographic monogram seal ('KA') created for demo; requires client decision."),
        ("Partner Headshot Photo", "Workspace root", "Unavailable", "High-res photograph of CA KavithaVijay SRJ not yet provided. Curated professional placeholder used in demo; pending client supply.")
    ]
    
    for row_idx, data in enumerate(inspect_data):
        row = t_inspect.add_row()
        bg_color = HEX_LIGHT_GRAY if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            cell.width = col_w[col_idx]
            set_cell_shading(cell, bg_color)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            set_cell_border(cell, 
                            top={"val": "single", "sz": "4", "color": HEX_BORDER},
                            bottom={"val": "single", "sz": "4", "color": HEX_BORDER})
            p = cell.paragraphs[0]
            style_paragraph(p, space_before=0, space_after=0)
            r = p.add_run(text)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = C_CHARCOAL
            if col_idx == 2:
                r.font.bold = True
                if "Available" in text or "Verified" in text:
                    r.font.color.rgb = C_FOREST
                else:
                    r.font.color.rgb = RGBColor(160, 60, 40)

    add_body("", space_after=4)

    add_h2("1.2 Known Practice Details & Project Readiness Status")
    add_bullet(None, "Official Practice Name:", "Kavitha & Associates (Chartered Accountants | Cost Accountants)")
    add_bullet(None, "Lead Partner:", "CA KavithaVijay SRJ (B.Com, FCA, CMA), Practicing Chartered Accountant")
    add_bullet(None, "Primary Operating Chambers:", "Bairagi Patteda, Tirupati, Andhra Pradesh – 517501 (GPS: 13°37'09.3\"N 79°25'04.9\"E • Verified via Client Coordinates)")
    add_bullet(None, "Official Contact Desks:", "Phone 1: +91 96263 50900 (Voice/WhatsApp)  |  Phone 2: +91 95421 53906  |  Email: cakavithasrj@gmail.com")
    add_bullet(None, "Website Demonstration URL:", "http://localhost:5173/ (Local development server running on consultant's demo device; not public)")
    add_bullet(None, "Demonstration Pages (8 Routes):", "Home (/), About (/about), Services (/services), Audit & Assurance (/services/audit-assurance), Industries (/industries), Locations (/locations), Contact (/contact), Not Found (/*)")
    add_bullet(None, "Technology Architecture:", "React 18.3.1, TypeScript 5.6.3, Vite 5.4.11, Tailwind CSS 3.4.16, Lucide React 1.16.0")

    add_callout("PROJECT READINESS CLASSIFICATION MATRIX", [
        "• Completed & Verified: Codebase compilation (0 TS errors), 7-route navigation, mobile drawer, touch targets (>=44px), click-to-call, mailto, WhatsApp inquiry generation, robots.txt, sitemap.xml, SPA redirects, production build assets.",
        "• Completed in Code / Pending Client Input: Physical door/street address in Tirupati, ICAI FRN/MRN footer display confirmation, 4-city branch classification, final approval of '10+ years' corporate experience wording.",
        "• Work Needing Post-Launch Testing: Live domain DNS propagation, SSL certificate validation, Google Search Console indexing, and Google Business Profile phone/postcard verification."
    ])

    # =========================================================================
    # SECTION 2: PRACTICAL 15-20 MINUTE MEETING AGENDA & DEMO ORDER
    # =========================================================================
    add_h1("2. Practical Meeting Agenda (15–20 Minutes)")
    add_body("This time-boxed agenda keeps the discussion structured, authoritative, and respectful of the client's time:")
    
    t_agenda = doc.add_table(rows=1, cols=3)
    t_agenda.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_agenda.autofit = False
    col_ag = [Inches(1.2), Inches(2.2), Inches(3.37)]
    for i, h in enumerate(["Time", "Agenda Phase", "Key Objectives & Discussion Points"]):
        cell = t_agenda.cell(0, i)
        cell.width = col_ag[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_WHITE
        
    agenda_steps = [
        ("00:00 - 03:00 (3 min)", "1. Welcome & Business Context", "Establish rapport, understand core business goals, target client segments, and high-priority practice areas."),
        ("03:00 - 09:00 (6 min)", "2. Live Prototype Demonstration", "Screen walkthrough following logical demonstration order (Home -> Audit -> Services -> About -> Locations -> Contact/WhatsApp)."),
        ("09:00 - 12:00 (3 min)", "3. Services & Credentials Review", "Review 9 statutory audit streams, 5 service categories, partner FCA/CMA qualifications, and ethical positioning."),
        ("12:00 - 14:00 (2 min)", "4. Office Details & Local Search", "Confirm physical Tirupati address, FRN/MRN numbers, 4 regional cities status, and Google Business Profile expectations."),
        ("14:00 - 17:00 (3 min)", "5. Commercial Proposal & Scope", "Explain ₹5,000 website package, optional ₹3,000 Google add-on, domain/hosting at cost, and scope boundaries."),
        ("17:00 - 20:00 (3 min)", "6. Approvals & Launch Plan", "Record commercial decision, assign owners to pending items, agree on payment terms and target launch date.")
    ]
    
    for r_idx, step in enumerate(agenda_steps):
        row = t_agenda.add_row()
        bg = HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, txt in enumerate(step):
            cell = row.cells[c_idx]
            cell.width = col_ag[c_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            set_cell_border(cell, top={"val": "single", "sz": "4", "color": HEX_BORDER}, bottom={"val": "single", "sz": "4", "color": HEX_BORDER})
            p = cell.paragraphs[0]
            style_paragraph(p, space_before=0, space_after=0)
            r = p.add_run(txt)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = C_CHARCOAL
            if c_idx == 0: r.font.bold = True

    add_body("", space_after=4)

    add_h2("2.1 Natural Spoken Opening Sentence (To Say Aloud)")
    add_callout("SPOKEN OPENING SCRIPT", [
        "\"Good morning / afternoon, CA Kavitha. Thank you very much for taking time out of your busy schedule today.",
        "Based on the firm profile and credentials you shared, our team has designed and built a working website prototype for Kavitha & Associates.",
        "The site is designed around your visiting-card identity—dignified forest green, warm white, and muted gold—and is specifically tailored to present your dual FCA and CMA qualifications with the institutional dignity required under ICAI standards.",
        "Today, I'd like to walk you through the live demo on my screen, gather your direct feedback on the layout and services, confirm a few practical office details, and agree on our launch plan. Does that sound good?\""
    ], hex_bg=HEX_GOLD_PALE, border_color=HEX_GOLD_BORDER)

    add_h2("2.2 Recommended Demonstration Order & Screen Flow")
    add_bullet(None, "Step 1: Home Page (/)", "Show executive hero, partner credentials card, core practice pillars, and immediate consultation desk. Emphasize the absence of generic templates, popups, or aggressive marketing banners.")
    add_bullet(None, "Step 2: Audit & Assurance Spotlight (/services/audit-assurance)", "Walk through the 9 statutory audit specializations with explicit statutory references (Companies Act 2013, Income Tax 44AB, Banking norms). Demonstrates rigorous corporate depth.")
    add_bullet(None, "Step 3: Practice Services Portfolio (/services)", "Review the 5 categorized practice domains (Income Tax, GST, Corporate/MCA, RERA, Advisory). Show how prospective clients quickly locate exact compliance solutions.")
    add_bullet(None, "Step 4: About the Partner & Practice (/about)", "Highlight the biographical profile of CA KavithaVijay SRJ, dual FCA/CMA credentials, ethical commitments, and independence standards under ICAI guidelines.")
    add_bullet(None, "Step 5: Practice Chambers & Service Reach (/locations)", "Demonstrate how Tirupati is positioned as the Primary Operating Chambers, while Chennai, Bengaluru, Hyderabad, and Coimbatore are framed as active regional client coverage corridors.")
    add_bullet(None, "Step 6: Contact & WhatsApp Consultation Desk (/contact)", "Test live click-to-call links (+91 96263 50900 / 95421 53906), email link, and the interactive WhatsApp form that pre-compiles user details into a secure direct message.")
    add_bullet(None, "Step 7: Mobile Viewport Demonstration", "Switch to smartphone resolution to demonstrate responsive touch-friendly navigation, mobile drawer menu, and clean single-column readability.")

    # =========================================================================
    # SECTION 3: COMMERCIAL PROPOSAL & PRICING BREAKDOWN
    # =========================================================================
    add_h1("3. Commercial Proposal & Transparent Pricing")
    add_body("The commercial proposal is structured into distinct, transparent components without hidden recurring fees or hosting markups:")

    t_pricing = doc.add_table(rows=1, cols=3)
    t_pricing.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_pricing.autofit = False
    col_pr = [Inches(3.2), Inches(1.5), Inches(2.07)]
    for i, h in enumerate(["Package / Service Tier", "Proposed Price", "Commercial Inclusions & Scope Summary"]):
        cell = t_pricing.cell(0, i)
        cell.width = col_pr[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    pricing_rows = [
        ("Package 1: Professional Business Website\n(Full 7-page custom responsive application)", "₹5,000\n(One-time)", "Complete bespoke website, mobile layout, 7 pages + 404, partner bio, 9 audit streams, 5 service domains, click-to-call, WhatsApp desk, on-page SEO, sitemap/robots, cloud setup, 1 revision round."),
        ("Package 2 (Optional Add-on): Google Business Profile\n(Google Maps & Local Search Optimization)", "₹3,000\n(One-time)", "Assistance claiming/creating profile, accurate NAP and category entry (Chartered Accountant / Tax Consultant), office hours, photo upload, service corridor configuration, local discovery checklist."),
        ("Third-Party Costs: Domain Registration\n(Direct registrar purchase: .com or .in)", "At Cost\n(~₹800 - ₹1,200/yr)", "Purchased directly from registrar (Namecheap, Cloudflare, GoDaddy). Client retains 100% legal ownership and control."),
        ("Third-Party Costs: Web Hosting\n(Modern high-speed static cloud networks)", "Typically ₹0\n(Free Tier)", "Hosted on Netlify / Cloudflare Pages. Zero hosting fees for standard CA practice traffic. Custom server billed at cost if requested."),
        ("COMBINED OPTION A: Website Only", "₹5,000 + Domain", "Full website development package plus direct domain registration cost (~₹800 - ₹1,200/yr)."),
        ("COMBINED OPTION B: Website + Google Setup", "₹8,000 + Domain", "Full website package + complete Google Business Profile setup plus direct domain registration cost.")
    ]

    for r_idx, pr_data in enumerate(pricing_rows):
        row = t_pricing.add_row()
        bg = HEX_GOLD_PALE if "COMBINED" in pr_data[0] else (HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, txt in enumerate(pr_data):
            cell = row.cells[c_idx]
            cell.width = col_pr[c_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            set_cell_border(cell, top={"val": "single", "sz": "4", "color": HEX_BORDER}, bottom={"val": "single", "sz": "4", "color": HEX_BORDER})
            p = cell.paragraphs[0]
            style_paragraph(p, space_before=0, space_after=0)
            r = p.add_run(txt)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = C_CHARCOAL
            if c_idx == 1 or "COMBINED" in pr_data[0]:
                r.font.bold = True
                if "COMBINED" in pr_data[0]:
                    r.font.color.rgb = C_FOREST

    add_body("", space_after=4)

    add_callout("CRITICAL COMMERCIAL PRINCIPLES", [
        "1. Proposed Prices, Not Assumptions: The ₹5,000 and ₹8,000 figures are proposed package fees for client review, not pre-confirmed charges. Space is provided in Section 6 to record the client's final selection.",
        "2. Google Setup is 100% Optional: Never suggest that the client must purchase the ₹3,000 Google profile setup. Present it purely as a high-value optional service.",
        "3. No Ongoing SEO or Maintenance Included: The packages include initial launch SEO and one revision round. Ongoing monthly SEO or unlimited maintenance is not included and requires a separate agreement if requested."
    ])

    # =========================================================================
    # SECTION 4: CONCISE SPOKEN PRICING SCRIPT
    # =========================================================================
    add_h1("4. Concise Spoken Pricing Script (Non-Pushy & Conversational)")
    add_body("Deliver this natural explanation during Section 5 of the meeting:")

    add_callout("VERBATIM SPOKEN PRICING EXPLANATION", [
        "\"Regarding the investment for this project, we have kept it simple, transparent, and structured into two clear components:",
        "",
        "First, the complete website package is a one-time fee of ₹5,000. That covers the complete design and development of all seven pages you just saw, full mobile responsiveness, the direct WhatsApp inquiry system, search engine setup, and deploying the site to a fast, reliable cloud host. It also includes a round of revisions so we can update any text, addresses, or photos you provide.",
        "",
        "Second, we offer an optional setup service for your Google Business Profile on Google Maps for an additional ₹3,000. If you choose this, we handle the entire setup: configuring your exact Tirupati location, entering your services correctly under Chartered Accountant and Tax Consultant categories, linking your website, and setting up your regional service areas. Because Google independently controls their verification and ranking algorithms, no honest consultant can promise an automatic '#1 ranking,' but we ensure your profile is completely optimized according to Google’s best practices.",
        "",
        "The only separate cost is your domain name—such as kavithaassociates.com—which typically costs around ₹800 to ₹1,200 a year paid directly to the registrar. That ensures you retain 100% ownership and control over your web address. Hosting on our modern cloud platform is typically ₹0 for normal practice traffic.",
        "",
        "If you'd like us to handle just the website, your total investment is ₹5,000 plus the domain. If you'd like us to set up your Google profile as well, it's ₹8,000 plus the domain. The Google setup is entirely optional—you are very welcome to start with just the website today if you prefer.",
        "",
        "How does that scope and structure feel to you?\""
    ], hex_bg=HEX_PALE_SAGE, border_color=HEX_FOREST)

    # =========================================================================
    # SECTION 5: CLIENT QUESTION CHECKLIST
    # =========================================================================
    add_h1("5. Client Question Checklist & Priority Filter")
    add_body("Do not overwhelm the client by reading every question at once. Use this list to guide natural discussion, ensuring the five essential launch blockers are resolved first.")

    add_callout("⭐ THE 5 ESSENTIAL QUESTIONS (MUST CONFIRM BEFORE PUBLIC LAUNCH)", [
        "1. [CRITICAL 1] Specific Building & Door/Suite Number in Bairagi Patteda: The client coordinates (13°37'09.3\"N 79°25'04.9\"E) pinpoint your chambers in Bairagi Patteda, Tirupati – 517501. What is the specific Door/Suite/Flat number and Building/Complex name to print on official invoices and the website contact card?",
        "2. [CRITICAL 2] ICAI FRN & MRN Display Permission: Would you like your Firm Registration Number (FRN) and Membership Number (MRN) displayed in the footer, or should we display partner qualifications only?",
        "3. [CRITICAL 3] Practice Footprint Status: Are Chennai, Bengaluru, Hyderabad, and Coimbatore physical registered branch offices, or are they active regional client service corridors? (Demo frames them as corridors for ICAI compliance).",
        "4. [CRITICAL 4] Preferred Domain Name & Ownership: Which domain do you prefer (kavithaassociates.com, cakavithasrj.com, kavithaassociates.in), and do you already own it or need assistance registering it today?",
        "5. [CRITICAL 5] Commercial Package Selection: Would you like to proceed with the core Website Package (₹5,000) or the combined Website + Google Business Profile Package (₹8,000), and what is your target launch date?"
    ], hex_bg=HEX_GOLD_PALE, border_color=HEX_GOLD_BORDER)

    add_h2("5.1 Business Goals & Target Audience")
    add_bullet(None, "☐ Purpose:", "What is the primary purpose of the website? (e.g., Establishing institutional credibility, bank empanelment, attracting MSME/startup clients, digital visiting card?)")
    add_bullet(None, "☐ Priority Services:", "Which services should receive the most prominence? (e.g., Statutory & Internal Audit, Tax Planning, GST Litigation, ROC Compliance, RERA Certification?)")
    add_bullet(None, "☐ Target Clientele:", "Who are the main types of clients the firm primarily targets? (e.g., Local Tirupati traders, South India MSMEs, real estate developers, tech startups?)")
    add_bullet(None, "☐ Geographic Coverage:", "Which geographic areas does the firm actively serve on a regular basis?")

    add_h2("5.2 Firm Details & Regulatory Identity")
    add_bullet(None, "☐ Official Firm Name:", "What is the exact registered legal firm name? (Confirm: 'Kavitha & Associates')")
    add_bullet(None, "☐ Complete Office Address:", "What is the complete physical street address, building name, and 6-digit postal PIN code?")
    add_bullet(None, "☐ Registration Display:", "What professional registration numbers (FRN, MRN) should be displayed on the public website?")
    add_bullet(None, "☐ Experience Claims:", "The supplied profile states 'more than ten years of robust corporate experience'. Is this exact wording approved for the bio?")
    add_bullet(None, "☐ 5-City Classification:", "Are Chennai, Bengaluru, Hyderabad, and Coimbatore physical registered branches or regional client coverage corridors?")
    add_bullet(None, "☐ Team Representation:", "Should the website feature CA KavithaVijay SRJ exclusively, or are there additional partners or senior staff to introduce?")

    add_h2("5.3 Website Content & Branding Assets")
    add_bullet(None, "☐ Design & Color Approval:", "Does the client approve of the forest green, warm white, and muted gold palette demonstrated in the prototype?")
    add_bullet(None, "☐ Content Accuracy:", "Are the service descriptions and audit specializations accurate to the firm's actual practice scope?")
    add_bullet(None, "☐ Brand Assets:", "Can the client provide a high-resolution logo file and a professional headshot photograph of CA KavithaVijay SRJ?")
    add_bullet(None, "☐ Language Requirements:", "Is English-only content sufficient, or will bilingual content (e.g., English + Telugu) be requested in a future phase?")
    add_bullet(None, "☐ Existing Digital Assets:", "Does the firm already own an existing domain name or legacy website?")

    add_h2("5.4 Google Business Profile & Local Discovery")
    add_bullet(None, "☐ Existing Profile:", "Does Kavitha & Associates already have an active Google Business Profile on Google Maps?")
    add_bullet(None, "☐ Account Ownership:", "Who currently owns or manages the Google account associated with the practice?")
    add_bullet(None, "☐ Physical Address Display:", "Is the firm eligible and willing to display its physical office address publicly on Google Maps?")
    add_bullet(None, "☐ Algorithm Awareness:", "Is the client aware that Google verification methods and local rankings are controlled by Google and cannot be guaranteed?")

    add_h2("5.5 Project Approvals & Administrative Workflow")
    add_bullet(None, "☐ Commercial Acceptance:", "Is the ₹5,000 website development scope acceptable to the firm?")
    add_bullet(None, "☐ Optional Google Setup:", "Does the firm wish to include the optional ₹3,000 Google Business Profile setup service?")
    add_bullet(None, "☐ Decision-Maker:", "Who in the firm will provide final feedback and authorize deployment of the live website?")
    add_bullet(None, "☐ Target Launch Date:", "What is the firm's ideal target launch date?")
    add_bullet(None, "☐ Third-Party Approvals:", "Who will approve and fund domain registration and hosting expenses?")

    # =========================================================================
    # SECTION 6: LIVE MEETING NOTES SHEET (PRINTABLE / FILLABLE FORM)
    # =========================================================================
    add_h1("6. Live Meeting Notes Sheet (Fillable Consultation Record)")
    add_body("Record client responses, decisions, and action items directly in these blank fields during the meeting:")

    t_notes = doc.add_table(rows=1, cols=2)
    t_notes.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_notes.autofit = False
    col_n = [Inches(3.38), Inches(3.39)]
    
    for i, h in enumerate(["Meeting Administration & Practice Identity", "Operational & Compliance Decisions"]):
        cell = t_notes.cell(0, i)
        cell.width = col_n[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    notes_fields = [
        ("Meeting Date: ____________________\nMeeting Time: ____________________\nMeeting Venue: ___________________\nClient Attendees: ________________\nConsultant Lead: _________________",
         "Primary Business Goal:\n[ ] Corporate Credibility / Bank Empanelment\n[ ] Attracting MSME / Startup Clients\n[ ] Digital Visiting Card for Referrals\n[ ] Other: ________________________________"),
        ("Approved Legal Firm Name:\n________________________________________\nLead Partner Name:\n________________________________________\nApproved Qualifications:\n[ ] B.Com, FCA, CMA  [ ] Other: _________",
         "Priority Practice Services to Highlight:\n1. _____________________________________\n2. _____________________________________\n3. _____________________________________"),
        ("Tirupati Chambers Address (GPS Verified):\nGPS: 13°37'09.3\"N 79°25'04.9\"E (Verified)\nLocality: Bairagi Patteda, Tirupati – 517501\nBuilding/Complex Name: _________________\nDoor/Suite/Flat No.: ___________________\nStreet/Cross Road: _____________________",
         "Registration Numbers & Display Consent:\nFirm Registration No. (FRN): ___________\nMembership No. (MRN): __________________\nDisplay on Website Footer:\n[ ] Yes, display FRN & MRN  [ ] Partner bio only"),
        ("Approved Phone & Email Desks:\nPrimary (WhatsApp): ____________________\nSecondary Phone: _______________________\nOfficial Email: ________________________",
         "5-City Practice Footprint Classification:\n[ ] Tirupati = Primary Chambers; 4 Cities =\n    Regional Service Corridors (Recommended)\n[ ] Physical Registered Branches exist in:\n    ____________________________________"),
        ("Design & Content Decisions:\nDesign/Colors: [ ] Approved  [ ] Revisions\nLogo Status:   [ ] Client supplying\n               [ ] Use 'KA' seal\nPartner Photo: [ ] Client supplying\n               [ ] Omit photo",
         "Domain & Infrastructure Decision:\nPreferred Domain: ______________________\nDomain Status:    [ ] Already owned\n                  [ ] Consultant to assist\nQuoted Cost:      ₹__________ / year\nHosting Choice:   [ ] Static Cloud (₹0/mo)"),
        ("Google Business Profile Status:\n[ ] Existing Profile (Needs optimization)\n[ ] New Profile (Needs creation & verification)\n[ ] Client will manage internally\nGoogle Account Owner: __________________",
         "Commercial Package Decision:\n[ ] Package A: Website Only (₹5,000)\n[ ] Package B: Website + Google Setup (₹8,000)\n[ ] Decision Deferred until: ____________\nPayment Terms: _________________________"),
        ("Target Public Launch Date:\n________________________________________\nNext Scheduled Follow-up:\n________________________________________",
         "Authorized Sign-Off Person:\nName: __________________________________\nPhone: _________________________________\nEmail: _________________________________")
    ]

    for r_idx, (col1_txt, col2_txt) in enumerate(notes_fields):
        row = t_notes.add_row()
        bg = HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, txt in enumerate([col1_txt, col2_txt]):
            cell = row.cells[c_idx]
            cell.width = col_n[c_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            set_cell_border(cell, top={"val": "single", "sz": "4", "color": HEX_BORDER}, bottom={"val": "single", "sz": "4", "color": HEX_BORDER})
            p = cell.paragraphs[0]
            style_paragraph(p, space_before=0, space_after=0)
            r = p.add_run(txt)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = C_CHARCOAL

    add_body("", space_after=4)

    # Additional notes box
    add_h2("6.1 Additional Client Observations & Custom Notes")
    box_notes = doc.add_table(rows=1, cols=1)
    box_notes.alignment = WD_TABLE_ALIGNMENT.CENTER
    box_notes.autofit = False
    c_bn = box_notes.cell(0, 0)
    c_bn.width = Inches(6.77)
    set_cell_shading(c_bn, "FFFFFF")
    set_cell_margins(c_bn, top=80, bottom=80, left=100, right=100)
    set_cell_border(c_bn, 
                    top={"val": "single", "sz": "4", "color": HEX_BORDER},
                    bottom={"val": "single", "sz": "4", "color": HEX_BORDER},
                    left={"val": "single", "sz": "4", "color": HEX_BORDER},
                    right={"val": "single", "sz": "4", "color": HEX_BORDER})
    p_bn = c_bn.paragraphs[0]
    style_paragraph(p_bn, space_before=0, space_after=0)
    r_bn = p_bn.add_run("Use this space to record special instructions, custom industry emphasis, or regulatory comments:\n\n\n\n\n\n")
    r_bn.font.name = "Calibri"
    r_bn.font.size = Pt(9)
    r_bn.font.color.rgb = C_MUTED

    add_body("", space_after=4)

    # =========================================================================
    # SECTION 7: DECISION AND ACTION TRACKER
    # =========================================================================
    add_h1("7. Decision and Action Tracker")
    add_body("Assign clear ownership and agreed completion targets to every pending post-meeting activity:")

    t_track = doc.add_table(rows=1, cols=5)
    t_track.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_track.autofit = False
    col_tr = [Inches(2.2), Inches(1.2), Inches(1.0), Inches(0.9), Inches(1.47)]
    for i, h in enumerate(["Action Item", "Responsible", "Due Date", "Status", "Notes / Delivery Requirements"]):
        cell = t_track.cell(0, i)
        cell.width = col_tr[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    tracker_items = [
        ("1. Confirm building/door no. in Bairagi Patteda (GPS 13°37'09.3\"N 79°25'04.9\"E)", "CA Kavitha / Client", "To be agreed", "Coordinates Verified", "Locality confirmed as Bairagi Patteda – 517501; confirm building name and door no."),
        ("2. Confirm ICAI FRN & MRN display consent", "CA Kavitha / Client", "To be agreed", "Pending", "Confirm whether registration numbers appear publicly in footer."),
        ("3. Confirm branch vs. service corridor status", "CA Kavitha / Client", "To be agreed", "Pending", "Ensures compliance with ICAI Section 27 for Chennai, BLR, HYD, CJB."),
        ("4. Supply firm logo file & partner headshot", "Client Office", "To be agreed", "Pending", "If unavailable, website will retain clean typographic seal."),
        ("5. Finalize domain purchase (.com or .in)", "Client / Consultant", "To be agreed", "Pending", "Client purchases directly; consultant configures DNS records."),
        ("6. Implement client's text & layout revisions", "Developer", "To be agreed", "Ready", "Single consolidated revision pass to finalize copy across all 7 routes."),
        ("7. Configure DNS records & static cloud deployment", "Developer", "To be agreed", "Ready", "Point DNS A/CNAME records to Netlify / Cloudflare Pages / Vercel."),
        ("8. Verify SSL certificate & test live links", "Developer", "Post-Deploy", "Scheduled", "Test telephone, mailto, WhatsApp routing, and meta tags on live domain."),
        ("9. Setup Google Business Profile (if opted in)", "Consultant / Client", "Post-Deploy", "Conditional", "Configure NAP, business categories, service corridors, and photos."),
        ("10. Final pre-launch inspection & public launch sign-off", "Client / Consultant", "Launch Target", "Scheduled", "Client inspects live production site and authorizes public launch.")
    ]

    for r_idx, tr_data in enumerate(tracker_items):
        row = t_track.add_row()
        bg = HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, txt in enumerate(tr_data):
            cell = row.cells[c_idx]
            cell.width = col_tr[c_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            set_cell_border(cell, top={"val": "single", "sz": "4", "color": HEX_BORDER}, bottom={"val": "single", "sz": "4", "color": HEX_BORDER})
            p = cell.paragraphs[0]
            style_paragraph(p, space_before=0, space_after=0)
            r = p.add_run(txt)
            r.font.name = "Calibri"
            r.font.size = Pt(8)
            r.font.color.rgb = C_CHARCOAL
            if c_idx == 1: r.font.bold = True

    add_body("", space_after=4)

    # =========================================================================
    # SECTION 8: SCOPE BOUNDARIES & TECHNICAL GOVERNANCE
    # =========================================================================
    add_h1("8. Scope Boundaries & Technical Governance")
    add_body("To prevent scope creep and establish unambiguous expectations, project boundaries are categorized across six operational dimensions:")

    t_scope = doc.add_table(rows=1, cols=2)
    t_scope.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_scope.autofit = False
    col_sc = [Inches(3.38), Inches(3.39)]
    for i, h in enumerate(["Scope Category", "Governing Inclusions & Limitations"]):
        cell = t_scope.cell(0, i)
        cell.width = col_sc[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    scope_categories = [
        ("1. Included in Website Base Package\n(₹5,000 One-Time)", 
         "• 7 Content pages + 404 recovery page.\n• Full responsive mobile/desktop layout.\n• Click-to-call, mailto, and WhatsApp inquiry desk.\n• Technical on-page SEO, sitemap.xml, robots.txt.\n• Hosting setup on Netlify/Cloudflare/Vercel.\n• One consolidated round of post-demo revisions."),
        ("2. Included in Optional Google Add-On\n(₹3,000 One-Time)", 
         "• Google Business Profile creation or claiming.\n• Accurate legal NAP and category configuration.\n• Addition of service catalog matching website.\n• Setup of service coverage areas for 4 cities.\n• Upload of client-supplied photos & local guide."),
        ("3. Separate Third-Party Expenses\n(Paid Directly at Cost by Client)", 
         "• Annual domain registration (~₹800 - ₹1,200/yr).\n• Specialized paid web hosting (if requested).\n• Paid third-party plugins, fonts, or stock photos.\n• Any government or statutory registration fees."),
        ("4. Additional Work Requiring Separate Quote\n(Out of Current Scope)", 
         "• Custom client portal logins or dashboard areas.\n• Interactive tax calculators requiring tax law maintenance.\n• Dynamic CMS or multi-author blogging engine.\n• Ongoing monthly SEO retainers or advertising campaigns.\n• Additional web pages beyond the agreed 7 pages."),
        ("5. Credentials & Delegated Access Rules\n(CRITICAL SECURITY POLICY)", 
         "• PASSWORDS MUST NEVER BE REQUESTED OR WRITTEN.\n• Client grants access via official delegated permissions\n  (e.g., DNS Manager, Google Business Profile Manager).\n• Setup can also be completed together via screenshare.\n• Client retains 100% ownership of all master accounts."),
        ("6. External Dependencies & Disclaimers\n(Beyond Consultant Control)", 
         "• No Search Rankings Guaranteed: Google ranking algorithms\n  are proprietary and cannot be promised by any consultant.\n• Google Verification: Google controls whether verification\n  is via SMS, video call, or postal mail.\n• Regulatory Compliance: Legal adherence to ICAI guidelines\n  remains the professional duty of the practicing CA.")
    ]

    for r_idx, (cat, desc) in enumerate(scope_categories):
        row = t_scope.add_row()
        bg = HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, txt in enumerate([cat, desc]):
            cell = row.cells[c_idx]
            cell.width = col_sc[c_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            set_cell_border(cell, top={"val": "single", "sz": "4", "color": HEX_BORDER}, bottom={"val": "single", "sz": "4", "color": HEX_BORDER})
            p = cell.paragraphs[0]
            style_paragraph(p, space_before=0, space_after=0)
            r = p.add_run(txt)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = C_CHARCOAL
            if c_idx == 0: r.font.bold = True

    add_body("", space_after=4)

    # =========================================================================
    # SECTION 9: PRE-LAUNCH & HANDOVER CHECKLIST
    # =========================================================================
    add_h1("9. Pre-Launch and Handover Checklist")
    add_body("Every operational item must be verified prior to pointing live domain DNS records to production servers:")

    t_pre = doc.add_table(rows=1, cols=4)
    t_pre.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_pre.autofit = False
    col_p = [Inches(0.6), Inches(2.6), Inches(1.3), Inches(2.27)]
    for i, h in enumerate(["#", "Pre-Flight Checkpoint", "Current Status", "Verification Method / Evidence"]):
        cell = t_pre.cell(0, i)
        cell.width = col_p[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    preflight_items = [
        ("1", "Final Content & Services Approved", "Pending Client", "Awaiting client review of service descriptions and experience claims."),
        ("2", "Contact Phone & Email Verified", "VERIFIED", "Primary (+91 96263 50900), Secondary (+91 95421 53906), Email verified."),
        ("3", "Tirupati Address & GPS Coordinates", "COORDINATES CONFIRMED", "GPS 13°37'09.3\"N 79°25'04.9\"E mapped to Bairagi Patteda – 517501; confirm door/building no."),
        ("4", "Regional Office Status Confirmed", "Needs Confirmation", "Must confirm whether 4 cities are branches or regional service corridors."),
        ("5", "Domain Registered & DNS Mapped", "Pending Client", "Client to finalize domain purchase; DNS A/CNAME mapped to host."),
        ("6", "SSL / HTTPS Encryption Active", "Post-Deploy", "Auto-provisioned by Cloudflare/Netlify upon DNS propagation."),
        ("7", "Mobile & Desktop Responsive Pass", "VERIFIED", "Tested across 5 viewports (320px to 1440px). Zero horizontal overflow."),
        ("8", "WhatsApp Inquiry Desk Tested", "VERIFIED", "Form formats structured text into wa.me link directly to +91 96263 50900."),
        ("9", "Technical SEO & Schema Markup", "VERIFIED", "Dynamic title/meta tags via SEOHead.tsx; Schema.org JSON-LD active."),
        ("10", "Sitemap.xml & Robots.txt Active", "VERIFIED", "Public crawler instruction files verified in production build output."),
        ("11", "ICAI Compliance Disclaimer Check", "VERIFIED", "Non-solicitation notice active in footer; 0 superlatives or fee cards."),
        ("12", "Client Handover & Sign-Off", "Launch Target", "Written sign-off from CA KavithaVijay SRJ prior to public launch.")
    ]

    for r_idx, pf in enumerate(preflight_items):
        row = t_pre.add_row()
        bg = HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, txt in enumerate(pf):
            cell = row.cells[c_idx]
            cell.width = col_p[c_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=45, bottom=45, left=60, right=60)
            set_cell_border(cell, top={"val": "single", "sz": "4", "color": HEX_BORDER}, bottom={"val": "single", "sz": "4", "color": HEX_BORDER})
            p = cell.paragraphs[0]
            style_paragraph(p, space_before=0, space_after=0)
            r = p.add_run(txt)
            r.font.name = "Calibri"
            r.font.size = Pt(8)
            r.font.color.rgb = C_CHARCOAL
            if c_idx == 2:
                r.font.bold = True
                if txt == "VERIFIED":
                    r.font.color.rgb = C_FOREST
                elif "Pending" in txt:
                    r.font.color.rgb = RGBColor(160, 60, 40)
                else:
                    r.font.color.rgb = RGBColor(180, 120, 30)

    add_body("", space_after=4)

    # =========================================================================
    # SECTION 10: PROFESSIONAL REGULATORY & COMPLIANCE NOTE
    # =========================================================================
    add_h1("10. Professional Regulatory & ICAI Compliance Note")
    add_body("Kavitha & Associates operates under the statutory oversight of the Institute of Chartered Accountants of India (ICAI) and the Chartered Accountants Act, 1949.")

    add_callout("ICAI CODE OF ETHICS & WEBSITE GUIDELINE SAFEGUARDS", [
        "1. The 'Pull' Access Principle: ICAI guidelines mandate that CA firm websites operate strictly on a pull basis. Information is accessible only to visitors who intentionally navigate to the website. The demo strictly excludes push popups, intrusive newsletter captures, automated chat prompts, or commercial banner ads.",
        "2. Prohibition on Superlatives (Clause 6 & 7, Part I, First Schedule): Claims such as 'Best CA in Tirupati', 'Top Accounting Firm', or 'Lowest Fee Guaranteed' constitute professional misconduct. All website copy has been audited to ensure purely factual, dignified language.",
        "3. Zero Fee Advertising or Rate Cards: In compliance with statutory prohibitions against soliciting professional work through fee competition, no prices, fees, or discounts appear anywhere on the website.",
        "4. No Client Logos or Testimonials: To prevent direct or indirect solicitation, no client names, corporate logos, or client testimonials are published.",
        "5. Section 27 Branch Office Compliance: Section 27 requires that every branch office of a CA firm be in separate charge of an ICAI member. The website deliberately classifies Chennai, Bengaluru, Hyderabad, and Coimbatore as 'Regional Client Coverage Corridors' rather than registered branches to ensure strict regulatory compliance.",
        "6. Mandatory Compliance Disclaimer: While the development team has executed rigorous technical audits, automated tools cannot substitute for official statutory review. CA KavithaVijay SRJ is requested to perform a final compliance review of all copy and disclosures prior to authorizing live deployment."
    ], hex_bg=HEX_PALE_SAGE, border_color=HEX_FOREST)

    # =========================================================================
    # SECTION 11: CONSULTANT'S PRE-MEETING CHEAT SHEET
    # =========================================================================
    add_h1("11. Consultant's Quick Pre-Meeting Cheat Sheet")
    add_body("Keep these core reference points at hand when leading the client discussion:")

    add_callout("MEETING CHEAT SHEET — 5 KEY REMINDERS", [
        "1. The Core Elevator Message: \"We built a working, elegant, mobile-friendly website that respects your professional dignity as an FCA and CMA, avoids cheap marketing gimmicks, and makes it effortless for business clients to reach your desk.\"",
        "2. The Demo Path: Home hero -> 9 Audit specializations -> 5 Practice domains -> About partner -> Regional reach -> Contact/WhatsApp desk.",
        "3. The Commercial Proposition: Website is ₹5,000 one-time. Google Business Profile setup is an optional ₹3,000 one-time. Domain is paid at cost (~₹800-₹1,200/yr). Never push the Google add-on.",
        "4. The Security Rule: Never ask for or record passwords. All access is via official manager invitations or screenshare.",
        "5. The 5 Must-Confirm Launch Blockers: (1) Exact Tirupati address & PIN, (2) FRN/MRN footer display permission, (3) 4-city corridor status, (4) Domain selection, (5) Commercial package selection & target launch date."
    ], hex_bg=HEX_GOLD_PALE, border_color=HEX_GOLD_BORDER)

    # Save Word document
    out_docx = r"C:\kavatha ca\Kavitha_Associates_Client_Meeting_Notes.docx"
    doc.save(out_docx)
    print(f"DOCX successfully generated at: {out_docx}")

    # Convert to PDF via Word COM
    out_pdf = r"C:\kavatha ca\Kavitha_Associates_Client_Meeting_Notes.pdf"
    try:
        import win32com.client
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        wb = word.Documents.Open(os.path.abspath(out_docx))
        wb.SaveAs(os.path.abspath(out_pdf), FileFormat=17) # 17 = wdFormatPDF
        wb.Close()
        word.Quit()
        print(f"PDF successfully generated at: {out_pdf}")
    except Exception as e:
        print(f"Error converting to PDF via Word COM: {e}")

if __name__ == "__main__":
    create_document()
