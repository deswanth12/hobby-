with open('src/pages/IndustriesPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace header banner text with concise copy
old_header_p = """<p className="mt-4 font-editorial-body text-brand-muted leading-relaxed text-base sm:text-lg">
              Every industry operates under distinct tax incentive codes, regulatory scrutiny thresholds, and accounting standards. We configure custom audit procedures and compliance calendars tailored to your specific commercial vertical.
            </p>"""

new_header_p = """<p className="mt-4 font-editorial-body text-brand-muted leading-relaxed text-base sm:text-lg">
              We provide tailored statutory audit, tax planning, and regulatory compliance aligned with the specific operational demands of your sector.
            </p>"""

if old_header_p in content:
    content = content.replace(old_header_p, new_header_p)
    print("Updated Industries header")

with open('src/pages/IndustriesPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("IndustriesPage simplified.")
