with open('CONTENT_AUDIT_MASTER_REPORT.md', 'r', encoding='utf-8') as f:
    text = f.read()

old_metrics = """### Key Audit Metrics
- **Total Specific Claims Audited**: 45 granular claims
- **Verified Factually & Statutorily**: 26 claims (57.8%)
- **Pending Direct Client Confirmation**: 11 claims (24.4%)
- **Inaccurate / Requiring Immediate Correction**: 5 claims (11.1%)
- **Misleading / High Regulatory Risk**: 3 claims (6.7%)
- **Critical Risk Violations (Immediate Expunction Required)**: 1 claim (2.2%) — *"Complete Legal Immunity & Clean Audit Reports"* on `AboutPage.tsx:601`."""

new_metrics = """### Key Audit Metrics
- **Total Specific Claims Audited**: 58 granular claims (across components, pages, JSON content stores, blog posts, and schemas)
- **Verified Factually & Statutorily**: 28 claims (48.3%)
- **Pending Direct Client Confirmation**: 12 claims (20.7%)
- **Inaccurate / Requiring Immediate Correction**: 11 claims (19.0%)
- **Misleading / High Regulatory Risk**: 4 claims (6.9%)
- **Critical Risk Violations (Immediate Expunction Required)**: 3 claims (5.2%) —
  1. *"Complete Legal Immunity & Clean Audit Reports"* (`AboutPage.tsx:601`)
  2. *"Guaranteed ROC Compliance"* (`CompanyRegistrationPage.tsx:235`)
  3. *"Zero Late Fee Guarantee"* (`GSTServicesPage.tsx:236`)"""

t_norm = text.replace('\r\n', '\n')
old_norm = old_metrics.replace('\r\n', '\n')
if old_norm in t_norm:
    t_norm = t_norm.replace(old_norm, new_metrics.replace('\r\n', '\n'))
    with open('CONTENT_AUDIT_MASTER_REPORT.md', 'w', encoding='utf-8') as f:
        f.write(t_norm)
    print('Updated normalized metrics in CONTENT_AUDIT_MASTER_REPORT.md')
else:
    print('Pattern not matched.')
