import re

with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Simplify Hero lead narrative
old_hero_lead = re.search(r'<p className="font-editorial-body text-brand-charcoal/90 max-w-xl font-normal leading-\[1\.65\] sm:leading-\[1\.7\]">.*?</p>', content, re.DOTALL)
if old_hero_lead:
    new_hero_lead = """<p className="font-editorial-body text-brand-charcoal/90 max-w-xl font-normal leading-[1.65] sm:leading-[1.7]">
                Led by <strong className="text-brand-forest font-semibold">CA Kavitha Vijay (B.Com, CA, CMA AIR 49)</strong>, Kavitha & Associates provides statutory audit, tax counsel, and corporate financial advisory services. We deliver direct partner-level guidance to emerging ventures, MSMEs, and established enterprises across India.
              </p>"""
    content = content.replace(old_hero_lead.group(0), new_hero_lead)
    print("Simplified hero lead narrative")

# 2. Simplify Audit Spotlight left column description
old_audit_desc = re.search(r'<p className="mt-3 font-editorial-body text-sm text-brand-muted leading-relaxed">\s*Independent, thorough, and compliant audits that foster trust with lenders.*?CA Kavitha Vijay\.\s*</p>', content, re.DOTALL)
if old_audit_desc:
    new_audit_desc = """<p className="mt-3 font-editorial-body text-sm text-brand-muted leading-relaxed">
                  Independent, thorough audits that establish institutional trust with lenders, investors, and regulatory authorities. All assurance engagements are executed under the direct personal supervision of CA Kavitha Vijay.
                </p>"""
    content = content.replace(old_audit_desc.group(0), new_audit_desc)
    print("Simplified audit spotlight description")

# 3. Simplify Locations Section description
old_loc_head = re.search(r'<div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal">\s*<span className="text-xs font-semibold text-gold-dark block mb-2">\s*Geographic Presence\s*</span>\s*<h2 className="font-editorial-h2 text-brand-forest">\s*Service Locations & Reach\s*</h2>\s*<p className="font-editorial-body text-sm text-brand-muted mt-2">.*?</p>\s*</div>', content, re.DOTALL)
if old_loc_head:
    new_loc_head = """<div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
            <span className="text-xs font-semibold text-gold-dark block mb-2">
              Pan-India Service Reach
            </span>
            <h2 className="font-editorial-h2 text-brand-forest">
              Principal Chambers & Pan-India Practice
            </h2>
            <p className="font-editorial-body text-sm text-brand-muted mt-2">
              Headquartered at our registered chambers in Tirupati, Andhra Pradesh, with active virtual and on-site client engagement across India.
            </p>
          </div>"""
    content = content.replace(old_loc_head.group(0), new_loc_head)
    print("Simplified locations heading")

# 4. Simplify operational note at bottom of Locations section
old_op_note = re.search(r'<div className="mt-8 text-center font-editorial-body text-xs text-brand-muted max-w-2xl mx-auto">\s*<p>\s*\* Operational Note:.*?</p>\s*</div>', content, re.DOTALL)
if old_op_note:
    new_op_note = """<div className="mt-8 text-center font-editorial-body text-xs text-brand-muted max-w-2xl mx-auto">
            <p className="font-editorial-meta text-[11px] text-brand-muted">
              * Regulatory Notice: Principal operating chambers are located in Tirupati, AP. Regional client engagements in Chennai, Bengaluru, Hyderabad, and Coimbatore are managed via on-site visits and digital consultation under ICAI regulations.
            </p>
          </div>"""
    content = content.replace(old_op_note.group(0), new_op_note)
    print("Simplified operational note")

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("HomePage content simplification complete.")
