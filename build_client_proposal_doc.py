import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def create_client_proposal():
    doc = docx.Document()
    
    # Page setup - Standard A4 with 0.75 in margins
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
        hrun = hp.add_run("Kavitha & Associates — Commercial Website Proposal & Specification | October 2026")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(100, 113, 108)
        
        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
        frun1 = fp.add_run("PREPARED FOR: CA KAVITHAVIJAY SRJ (B.COM, FCA, CMA) — KAVITHA & ASSOCIATES")
        frun1.font.name = "Calibri"
        frun1.font.size = Pt(8)
        frun1.font.color.rgb = RGBColor(140, 153, 147)

    # Color Palette definitions
    C_FOREST = RGBColor(15, 62, 46)      # #0F3E2E Primary Brand Forest Green
    C_DEEP = RGBColor(10, 47, 36)        # #0A2F24 Deep Green
    C_INTERACTIVE = RGBColor(27, 115, 79)# #1B734F Medium Green
    C_GOLD = RGBColor(180, 140, 60)      # #C5A059 Muted Gold Accent
    C_CHARCOAL = RGBColor(36, 52, 47)    # #24342F Dark Charcoal Body Text
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

    # Styling helpers
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
        run.font.size = Pt(13.5)
        run.font.bold = True
        run.font.color.rgb = C_FOREST
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        style_paragraph(p, space_before=10, space_after=3)
        run = p.add_run(text)
        run.font.name = "Georgia"
        run.font.size = Pt(11)
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

    def add_bullet(bold_prefix="", text=""):
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
        
        p_sp = doc.add_paragraph()
        style_paragraph(p_sp, space_before=0, space_after=3)

    # =========================================================================
    # EXECUTIVE CLIENT COVER BLOCK
    # =========================================================================
    hdr_table = doc.add_table(rows=1, cols=1)
    hdr_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_table.autofit = False
    c_hdr = hdr_table.cell(0, 0)
    c_hdr.width = Inches(6.77)
    set_cell_shading(c_hdr, HEX_FOREST)
    set_cell_margins(c_hdr, top=180, bottom=180, left=200, right=200)
    set_cell_border(c_hdr, 
                    top={"val": "single", "sz": "4", "color": HEX_FOREST},
                    bottom={"val": "single", "sz": "14", "color": HEX_GOLD_BORDER},
                    left={"val": "single", "sz": "4", "color": HEX_FOREST},
                    right={"val": "single", "sz": "4", "color": HEX_FOREST})

    p_top = c_hdr.paragraphs[0]
    style_paragraph(p_top, space_before=0, space_after=2)
    r_firm = p_top.add_run("KAVITHA & ASSOCIATES")
    r_firm.font.name = "Georgia"
    r_firm.font.size = Pt(20)
    r_firm.font.bold = True
    r_firm.font.color.rgb = C_WHITE

    p_sub = c_hdr.add_paragraph()
    style_paragraph(p_sub, space_before=0, space_after=8)
    r_sub = p_sub.add_run("CHARTERED ACCOUNTANTS  |  COST ACCOUNTANTS  •  TIRUPATI & PAN-INDIA")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(10)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(220, 190, 120)

    p_title = c_hdr.add_paragraph()
    style_paragraph(p_title, space_before=4, space_after=3)
    r_t = p_title.add_run("Website Development Proposal & Digital Presence Specification")
    r_t.font.name = "Georgia"
    r_t.font.size = Pt(13)
    r_t.font.bold = True
    r_t.font.color.rgb = C_WHITE

    p_meta = c_hdr.add_paragraph()
    style_paragraph(p_meta, space_before=3, space_after=0)
    r_m = p_meta.add_run(
        "Prepared For: CA KavithaVijay SRJ (B.Com, FCA, CMA), Senior Partner\n"
        "Practice Chambers: Bairagi Patteda, Tirupati, Andhra Pradesh – 517501\n"
        "Contact: +91 96263 50900  |  +91 95421 53906  |  cakavithasrj@gmail.com\n"
        "Date of Presentation: October 29, 2026  •  Proposal Reference: KA-WEB-2026-V1"
    )
    r_m.font.name = "Calibri"
    r_m.font.size = Pt(9)
    r_m.font.color.rgb = RGBColor(210, 230, 220)

    doc.add_paragraph() # Spacer

    # =========================================================================
    # SECTION 1: EXECUTIVE PROPOSAL SUMMARY
    # =========================================================================
    add_h1("1. Executive Summary & Practice Vision")
    add_body(
        "Kavitha & Associates is an established professional practice providing comprehensive statutory audit, "
        "taxation, corporate secretarial, and strategic financial advisory services. Led by CA KavithaVijay SRJ, "
        "who holds prestigious dual credentials as both a Fellow Chartered Accountant (FCA) and Cost & Management "
        "Accountant (CMA), the firm brings more than a decade of corporate and regulatory acumen to businesses across India."
    )
    add_body(
        "The objective of this engagement is to establish a modern, authoritative digital presence for Kavitha & Associates. "
        "The web application has been tailored to reflect the dignified visual identity of the firm (Forest Green #0F3E2E, "
        "Warm White #FCFCFA, and Muted Gold #C5A059), ensuring immediate credibility with institutional lenders, corporate directors, "
        "and statutory regulators while adhering strictly to the ethical standards of the Institute of Chartered Accountants of India (ICAI)."
    )

    add_callout("CORE ENGAGEMENT VALUE PROPOSITIONS", [
        "• Statutory & Ethical Dignity: Designed strictly on the ICAI 'pull' model without aggressive commercial popups, prohibited superlatives, or fee advertising.",
        "• Comprehensive 7-Route Architecture: Complete coverage of all 9 statutory audit streams, 5 core practice domains, and 10 commercial industry sectors.",
        "• Verified Chambers Location: Prominently positions the firm's headquarters at Bairagi Patteda, Tirupati – 517501 (GPS: 13°37'09.3\"N 79°25'04.9\"E) with Google Maps integration.",
        "• Frictionless WhatsApp Lead Routing: Directly compiles client inquiries into formatted WhatsApp messages without capturing or storing confidential taxpayer data.",
        "• Transparent & Fixed Pricing: Professional website development delivered at a fixed one-time fee of ₹5,000, with optional Google Business Profile optimization at ₹3,000."
    ], hex_bg=HEX_PALE_SAGE, border_color=HEX_FOREST)

    # =========================================================================
    # SECTION 2: WEBSITE ARCHITECTURE & PAGE SPECIFICATIONS
    # =========================================================================
    add_h1("2. Website Architecture & Section Specifications")
    add_body(
        "The developed website prototype encompasses 7 canonical sections and an intelligent 404 recovery page, "
        "structured to provide complete clarity to corporate and MSME clients:"
    )

    t_pages = doc.add_table(rows=1, cols=3)
    t_pages.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_pages.autofit = False
    col_pg = [Inches(1.8), Inches(1.5), Inches(3.47)]
    for i, h in enumerate(["Website Section", "Route URL", "Content Scope & Client Experience"]):
        cell = t_pages.cell(0, i)
        cell.width = col_pg[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    page_specs = [
        ("1. Home Page\n(Executive Landing)", "/", "Architectural hero section, partner credentials badge (B.Com, FCA, CMA), 5 practice pillars, audit spotlight preview, industries overview, Tirupati chambers locator, and WhatsApp consultation desk."),
        ("2. About the Partner\n(Leadership & Ethics)", "/about", "Detailed professional biography of CA KavithaVijay SRJ, celebrating 10+ years corporate experience, dual statutory qualifications, professional values, and formal ICAI compliance commitment."),
        ("3. Practice Portfolio\n(Comprehensive Services)", "/services", "Detailed engagement breakdown across 5 practice areas: Direct Tax, GST, Corporate/ROC, RERA Certification, and Management Advisory. Clearly structured for prospective clients."),
        ("4. Audit & Assurance\n(Dedicated Spotlight)", "/services/audit-assurance", "Dedicated statutory audit hub highlighting all 9 specialized audit categories with explicit statutory references (Companies Act 2013, Income Tax Act Sec 44AB, Banking Norms, etc.)."),
        ("5. Industries Served\n(Commercial Sectors)", "/industries", "Profiles 10 commercial sectors: Startups, MSMEs, Manufacturing, Real Estate, Retail, Healthcare, Education, E-Commerce, Consultants, and NGOs/Trusts."),
        ("6. Service Footprint\n(Chambers & Corridors)", "/locations", "Establishes Bairagi Patteda, Tirupati as Principal Chambers, and defines Chennai, Bengaluru, Hyderabad, and Coimbatore as active regional client coverage corridors."),
        ("7. Direct Contact Desk\n(Inquiry & Routing)", "/contact", "Interactive communication hub with native click-to-call for both phone lines, official email, verified Google Maps link, and structured WhatsApp inquiry form."),
        ("8. Not Found Recovery\n(Directory Guide)", "/*", "Dignified 404 recovery page providing clean navigation links back to active practice areas and direct emergency phone contact.")
    ]

    for r_idx, pg_data in enumerate(page_specs):
        row = t_pages.add_row()
        bg = HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, txt in enumerate(pg_data):
            cell = row.cells[c_idx]
            cell.width = col_pg[c_idx]
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

    # =========================================================================
    # SECTION 3: PRACTICE SERVICES & AUDIT SPOTLIGHT BREAKDOWN
    # =========================================================================
    add_h1("3. Practice Portfolio & Audit Specializations")
    add_body("The website explicitly showcases the breadth of professional capabilities offered by Kavitha & Associates:")

    add_h2("3.1 The Nine Statutory Audit & Assurance Streams")
    add_bullet("1. Statutory Audit:", "Independent opinion on true and fair view of accounts under the Companies Act, 2013, Internal Financial Controls (IFC), and CARO reporting.")
    add_bullet("2. Tax Audit:", "Verification of books, allowable business deductions, and comprehensive 3CD reporting clauses under Section 44AB of the Income Tax Act.")
    add_bullet("3. Internal Audit:", "Objective operational risk appraisal, process gap analysis, and internal fraud prevention controls for corporate management.")
    add_bullet("4. Concurrent Audit:", "Continuous verification of high-value bank transactions, loan disbursements, and prudential treasury compliance.")
    add_bullet("5. Stock & Inventory Audit:", "Physical stock verification, valuation testing, non-moving stock identification, and bank drawing-power certification.")
    add_bullet("6. Due Diligence:", "Comprehensive financial, tax, and legal scrutiny evaluating liabilities and asset valuations for M&A and venture investors.")
    add_bullet("7. Turnover Audit:", "Independent revenue and turnover verification required for government tenders, EPC bids, and regulatory thresholds.")
    add_bullet("8. Compliance Review & Risk Assessment:", "Multi-statute audit verifying direct tax, GST, labor laws, and secretarial requirements to preempt litigation.")
    add_bullet("9. Management Audit:", "Executive appraisal of departmental efficiency, operating overheads, capital utilization, and organizational governance.")

    add_h2("3.2 Five Multi-Disciplinary Practice Streams")
    add_bullet("• Income Tax Services:", "ITR filing for entities and HNIs, tax planning, corporate compliance, TDS returns, scrutiny assessment representation, and appellate advocacy.")
    add_bullet("• Goods & Services Tax (GST):", "Registration, monthly/quarterly returns (GSTR-1, 3B, 9, 9C), GST audit reconciliations, input tax credit optimization, and departmental litigation defense.")
    add_bullet("• Corporate & MCA Services:", "Company and LLP incorporation, ROC filings, director appointment/changes, startup structuring, corporate restructuring, and Virtual CFO support.")
    add_bullet("• RERA Compliance & Certification:", "RERA registration for builders and developers, quarterly disclosures, and mandatory Chartered Accountant financial utilization certificates.")
    add_bullet("• Strategic Advisory & Consulting:", "Business process optimization, working capital planning, forensic review, investment feasibility analysis, and loan syndication.")

    # =========================================================================
    # SECTION 4: TECHNICAL SPECIFICATIONS & SECURITY
    # =========================================================================
    add_h1("4. Technical Specifications & Privacy Architecture")
    add_body("The website has been engineered according to modern enterprise frontend standards, ensuring zero maintenance friction and maximum security:")

    t_tech = doc.add_table(rows=1, cols=3)
    t_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_tech.autofit = False
    col_tc = [Inches(2.0), Inches(2.0), Inches(2.77)]
    for i, h in enumerate(["Technical Dimension", "Technology Standard", "Operational Benefit to Firm"]):
        cell = t_tech.cell(0, i)
        cell.width = col_tc[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    tech_rows = [
        ("Core Frontend Engine", "React 18.3 + TypeScript 5.6", "Zero runtime crashes, strict type safety, smooth single-page application transitions without page reloads."),
        ("Build & Optimization", "Vite 5.4 Bundler", "Lightning-fast page loading; compiled asset size under 330 kB total, ensuring immediate rendering even on 3G mobile."),
        ("Responsive Layout", "Tailwind CSS 3.4", "Adaptive grid engineered for iPhone, Android, iPad, and desktop viewports with 44px minimum touch targets."),
        ("Technical SEO Setup", "SEOHead + Schema.org JSON-LD", "Dynamic per-route meta titles and descriptions, OpenGraph social preview cards, and Google AccountingService rich schema."),
        ("Search Engine Assets", "robots.txt & sitemap.xml", "Ensures complete indexation across Google and Bing with canonical URLs to prevent duplicate content penalties."),
        ("Data Privacy & Security", "Zero-Database Routing", "Inquiry form encodes data directly into WhatsApp URL. No taxpayer PANs or contact details stored on servers."),
        ("Static Cloud Hosting", "Cloudflare Pages / Netlify", "Enterprise 99.99% uptime, global CDN edge delivery, automatic SSL encryption certificate provisioned.")
    ]

    for r_idx, tc_data in enumerate(tech_rows):
        row = t_tech.add_row()
        bg = HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, txt in enumerate(tc_data):
            cell = row.cells[c_idx]
            cell.width = col_tc[c_idx]
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

    # =========================================================================
    # SECTION 5: ICAI REGULATORY COMPLIANCE FRAMEWORK
    # =========================================================================
    add_h1("5. ICAI Regulatory & Ethical Compliance Safeguards")
    add_body(
        "As a practicing Chartered Accountancy firm, Kavitha & Associates is bound by the Chartered Accountants Act, 1949 "
        "and the Code of Ethics issued by the Institute of Chartered Accountants of India (ICAI). The website has been "
        "meticulously designed to comply with all relevant Council guidelines:"
    )

    add_callout("REGULATORY SAFEGUARDS INCORPORATED IN THE APPLICATION", [
        "1. Strict Pull-Model Operation: Information is made accessible only to visitors who intentionally request it. No push popups, intrusive newsletter captures, or automated chat prompts.",
        "2. Zero Superlatives or Comparison: Terms such as 'Best CA in Tirupati' or 'Top Audit Firm' are strictly prohibited and entirely omitted.",
        "3. Complete Ban on Fee Advertising: No rates, discounts, or fee comparisons are displayed anywhere on the website.",
        "4. No Client Logos or Testimonials: To prevent direct or indirect solicitation, no client names, corporate logos, or client reviews are published.",
        "5. Section 27 Branch Regulation Safeguard: Chennai, Bengaluru, Hyderabad, and Coimbatore are classified as 'Regional Client Coverage Corridors' rather than branches, ensuring strict compliance with ICAI Section 27.",
        "6. Statutory Disclaimer: Prominently featured in the website footer, informing visitors that the site is informational and does not solicit professional work."
    ], hex_bg=HEX_PALE_SAGE, border_color=HEX_FOREST)

    # =========================================================================
    # SECTION 6: COMMERCIAL PROPOSAL & INVESTMENT PACKAGES
    # =========================================================================
    add_h1("6. Commercial Proposal & Investment Packages")
    add_body("We present two transparent, fixed investment options for the firm's consideration:")

    t_comm = doc.add_table(rows=1, cols=3)
    t_comm.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_comm.autofit = False
    col_cm = [Inches(2.5), Inches(1.5), Inches(2.77)]
    for i, h in enumerate(["Package Option", "Professional Fee", "Included Deliverables & Scope Summary"]):
        cell = t_comm.cell(0, i)
        cell.width = col_cm[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    comm_packages = [
        ("PACKAGE A:\nProfessional Website Development", "₹5,000\n(One-Time)", 
         "• Full bespoke 7-page website + 404 recovery page.\n"
         "• Complete partner bio, 9 audit streams, 5 service domains.\n"
         "• Mobile responsiveness across all smartphones & tablets.\n"
         "• Direct click-to-call, email, and WhatsApp lead desk.\n"
         "• On-page SEO, Schema.org markup, robots.txt, sitemap.xml.\n"
         "• Production deployment setup to high-speed cloud.\n"
         "• One consolidated round of text and layout revisions."),
        ("PACKAGE B (RECOMMENDED):\nWebsite + Google Business Profile Setup", "₹8,000\n(One-Time)", 
         "• Everything included in Package A (₹5,000 value).\n"
         "• Full setup / optimization of Google Business Profile on Google Maps.\n"
         "• Precise NAP configuration for Bairagi Patteda, Tirupati.\n"
         "• Category setup: Chartered Accountant & Tax Consultant.\n"
         "• Service catalog matching website practice areas.\n"
         "• Configuration of regional service areas (Chennai, BLR, HYD, CJB).\n"
         "• Guidance on Google verification and local review collection.")
    ]

    for r_idx, cm_data in enumerate(comm_packages):
        row = t_comm.add_row()
        bg = HEX_GOLD_PALE if "RECOMMENDED" in cm_data[0] else "FFFFFF"
        for c_idx, txt in enumerate(cm_data):
            cell = row.cells[c_idx]
            cell.width = col_cm[c_idx]
            set_cell_shading(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            set_cell_border(cell, top={"val": "single", "sz": "4", "color": HEX_BORDER}, bottom={"val": "single", "sz": "4", "color": HEX_BORDER})
            p = cell.paragraphs[0]
            style_paragraph(p, space_before=0, space_after=0)
            r = p.add_run(txt)
            r.font.name = "Calibri"
            r.font.size = Pt(8.5)
            r.font.color.rgb = C_CHARCOAL
            if c_idx == 1 or "RECOMMENDED" in cm_data[0]:
                r.font.bold = True
                if "RECOMMENDED" in cm_data[0]:
                    r.font.color.rgb = C_FOREST

    add_body("", space_after=4)

    add_h2("6.1 Third-Party Costs (Paid Directly at Cost by Firm)")
    add_bullet("• Custom Domain Name (.com / .in):", "Approximately ₹800 to ₹1,200 per year, purchased directly from accredited registrars (e.g., Namecheap, Cloudflare, GoDaddy). The domain remains 100% owned and registered under the firm's name.")
    add_bullet("• Cloud Web Hosting:", "Hosted on enterprise static cloud edge networks (Cloudflare Pages / Netlify). For standard professional firm traffic, hosting is ₹0 per month on free-tier infrastructure.")

    add_callout("HONEST SEARCH ENGINE & ALGORITHM DISCLOSURE", [
        "• Google Business Profile verification methods (SMS, video call, or postal mail) and search ranking placements are governed solely by Google LLC algorithms. No consultant can legally or ethically promise a guaranteed '#1 ranking' on Google.",
        "• Our service ensures that your business information, categories, location pins, and website links adhere 100% to Google's official quality guidelines for maximum local discovery."
    ], hex_bg=HEX_GOLD_PALE, border_color=HEX_GOLD_BORDER)

    # =========================================================================
    # SECTION 7: IMPLEMENTATION ROADMAP & NEXT STEPS
    # =========================================================================
    add_h1("7. Implementation Roadmap & Milestones")
    add_body("Upon selection of your preferred package, deployment follows a structured 4-stage timeline:")

    t_road = doc.add_table(rows=1, cols=4)
    t_road.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_road.autofit = False
    col_rd = [Inches(1.2), Inches(1.8), Inches(1.2), Inches(2.57)]
    for i, h in enumerate(["Stage", "Focus Area", "Target Window", "Deliverables"]):
        cell = t_road.cell(0, i)
        cell.width = col_rd[i]
        set_cell_shading(cell, HEX_FOREST)
        set_cell_margins(cell, top=70, bottom=70, left=80, right=80)
        p = cell.paragraphs[0]
        style_paragraph(p, space_before=0, space_after=0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = C_WHITE

    roadmap_steps = [
        ("Stage 1", "Prototype Review & Scope Sign-Off", "Day 1 (Today)", "Walkthrough of working demo, selection of commercial package, and confirmation of door/suite number in Bairagi Patteda."),
        ("Stage 2", "Domain Setup & Revisions", "Days 2 – 3", "Domain registration (.com/.in), incorporation of firm's finalized copy revisions, FRN/MRN footer details, and logo/photo assets."),
        ("Stage 3", "Cloud Deployment & QA", "Days 4 – 5", "Production build deployment to cloud CDN, automated SSL certificate provisioning, live link QA, and WhatsApp lead testing."),
        ("Stage 4", "Public Handover & Google Setup", "Days 6 – 7", "Public domain go-live, Google Business Profile configuration (if selected), Search Console sitemap submission, and handover.")
    ]

    for r_idx, rd_data in enumerate(roadmap_steps):
        row = t_road.add_row()
        bg = HEX_LIGHT_GRAY if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, txt in enumerate(rd_data):
            cell = row.cells[c_idx]
            cell.width = col_rd[c_idx]
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

    # =========================================================================
    # SECTION 8: FORMAL CLIENT SIGN-OFF & ACCEPTANCE
    # =========================================================================
    add_h1("8. Client Authorization & Engagement Sign-Off")
    add_body("To initiate project finalization and production deployment, please indicate your package selection and sign below:")

    t_sign = doc.add_table(rows=1, cols=1)
    t_sign.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_sign.autofit = False
    c_s = t_sign.cell(0, 0)
    c_s.width = Inches(6.77)
    set_cell_shading(c_s, "FFFFFF")
    set_cell_margins(c_s, top=120, bottom=120, left=150, right=150)
    set_cell_border(c_s, 
                    top={"val": "single", "sz": "8", "color": HEX_FOREST},
                    bottom={"val": "single", "sz": "8", "color": HEX_FOREST},
                    left={"val": "single", "sz": "8", "color": HEX_FOREST},
                    right={"val": "single", "sz": "8", "color": HEX_FOREST})

    p_s1 = c_s.paragraphs[0]
    style_paragraph(p_s1, space_before=0, space_after=3)
    r_s1 = p_s1.add_run("COMMERCIAL ENGAGEMENT SELECTION")
    r_s1.font.name = "Georgia"
    r_s1.font.size = Pt(11)
    r_s1.font.bold = True
    r_s1.font.color.rgb = C_FOREST

    p_s2 = c_s.add_paragraph()
    style_paragraph(p_s2, space_before=2, space_after=6)
    r_s2 = p_s2.add_run(
        "[  ] OPTION A: Professional Website Development Package ─────────────── ₹5,000 One-Time\n"
        "[  ] OPTION B: Professional Website + Google Business Profile Setup ──── ₹8,000 One-Time"
    )
    r_s2.font.name = "Calibri"
    r_s2.font.size = Pt(9.5)
    r_s2.font.bold = True
    r_s2.font.color.rgb = C_CHARCOAL

    p_s3 = c_s.add_paragraph()
    style_paragraph(p_s3, space_before=4, space_after=6)
    r_s3 = p_s3.add_run(
        "Preferred Domain Name: [  ] kavithaassociates.com   [  ] kavithaassociates.in   [  ] cakavithasrj.com\n"
        "Other Domain: _________________________________________________________________\n\n"
        "Official Practice Chambers Address in Tirupati:\n"
        "Locality: Bairagi Patteda, Tirupati – 517501, Andhra Pradesh (GPS: 13°37'09.3\"N 79°25'04.9\"E)\n"
        "Building / Complex Name: _______________________________________________________\n"
        "Door / Flat / Suite No.: _______________________________________________________\n"
        "Street / Cross Road:     _______________________________________________________\n\n"
        "ICAI Professional Registration Details:\n"
        "Firm Registration Number (FRN): ________________  [ ] Publish on Website Footer\n"
        "Partner Membership Number (MRN): _______________  [ ] Publish on Website Footer"
    )
    r_s3.font.name = "Calibri"
    r_s3.font.size = Pt(9)
    r_s3.font.color.rgb = C_CHARCOAL

    p_s4 = c_s.add_paragraph()
    style_paragraph(p_s4, space_before=10, space_after=2)
    r_s4 = p_s4.add_run(
        "Client Authorization:\n\n\n"
        "____________________________________________             _______________________\n"
        "CA KavithaVijay SRJ (B.Com, FCA, CMA)                   Date of Authorization\n"
        "Senior Partner, Kavitha & Associates\n"
        "Office Seal / Stamp"
    )
    r_s4.font.name = "Calibri"
    r_s4.font.size = Pt(9)
    r_s4.font.bold = True
    r_s4.font.color.rgb = C_FOREST

    # Save Word document
    out_docx = r"C:\kavatha ca\Kavitha_Associates_Website_Proposal_Client.docx"
    doc.save(out_docx)
    print(f"Client DOCX successfully generated at: {out_docx}")

    # Convert to PDF via Word COM
    out_pdf = r"C:\kavatha ca\Kavitha_Associates_Website_Proposal_Client.pdf"
    try:
        import win32com.client
        word = win32com.client.Dispatch("Word.Application")
        word.Visible = False
        wb = word.Documents.Open(os.path.abspath(out_docx))
        wb.SaveAs(os.path.abspath(out_pdf), FileFormat=17) # 17 = wdFormatPDF
        wb.Close()
        word.Quit()
        print(f"Client PDF successfully generated at: {out_pdf}")
    except Exception as e:
        print(f"Error converting to PDF via Word COM: {e}")

if __name__ == "__main__":
    create_client_proposal()
