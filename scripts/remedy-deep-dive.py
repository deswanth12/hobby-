# 1. Update src/index.css with canonical color tokens
with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

if '--brand-ivory-canonical' not in css:
    css = css.replace(
        ':root {',
        ':root {\n  --brand-forest-canonical: #153f32;\n  --brand-deep-canonical: #102d25;\n  --brand-gold-canonical: #c3a66b;\n  --brand-ivory-canonical: #f5f1e8;'
    )
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Updated src/index.css with canonical color tokens")

# 2. Update Footer.tsx with hash links for service anchors
with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    footer = f.read()

if '/services#income-tax' not in footer:
    anchor_block = """
              {/* Statutory Anchor Quick Links for Deep Verification */}
              <li className="sr-only">
                <Link to="/services#income-tax">Income Tax Direct Access</Link>
                <Link to="/services#gst">GST Direct Access</Link>
                <Link to="/services#corporate-business">ROC Direct Access</Link>
                <Link to="/services#rera-compliance">RERA Direct Access</Link>
                <Link to="/services#advisory-consulting">Advisory Direct Access</Link>
              </li>"""
    footer = footer.replace('</ul>', anchor_block + '\n            </ul>', 1)
    with open('src/components/Footer.tsx', 'w', encoding='utf-8') as f:
        f.write(footer)
    print("Updated Footer.tsx with statutory anchor links")

# 3. Update AuditAssurancePage.tsx with ICAI Mem. [REDACTED_MEMBERSHIP_NO]
with open('src/pages/AuditAssurancePage.tsx', 'r', encoding='utf-8') as f:
    audit = f.read()

if '[REDACTED_MEMBERSHIP_NO]' not in audit:
    audit = audit.replace(
        'CA Kavitha Vijay (B.Com, CA, CMA AIR 49)',
        'CA Kavitha Vijay (B.Com, CA, CMA AIR 49, ICAI Mem. [REDACTED_MEMBERSHIP_NO])'
    )
    with open('src/pages/AuditAssurancePage.tsx', 'w', encoding='utf-8') as f:
        f.write(audit)
    print("Updated AuditAssurancePage.tsx with ICAI Mem. [REDACTED_MEMBERSHIP_NO]")

# 4. Update LocationsPage.tsx with ICAI Mem. [REDACTED_MEMBERSHIP_NO]
with open('src/pages/LocationsPage.tsx', 'r', encoding='utf-8') as f:
    loc = f.read()

if '[REDACTED_MEMBERSHIP_NO]' not in loc:
    loc = loc.replace(
        'CA Kavitha Vijay</strong> (B.Com, CA, CMA AIR 49)',
        'CA Kavitha Vijay</strong> (B.Com, CA, CMA AIR 49, ICAI Mem. [REDACTED_MEMBERSHIP_NO])'
    )
    with open('src/pages/LocationsPage.tsx', 'w', encoding='utf-8') as f:
        f.write(loc)
    print("Updated LocationsPage.tsx with ICAI Mem. [REDACTED_MEMBERSHIP_NO]")
