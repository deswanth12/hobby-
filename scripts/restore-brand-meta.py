with open('C:/kavatha ca/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace favicon tag with full suite
old_favicon = '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />'
new_favicon = '''<!-- Favicon / Brand Identity for Google Search & Browsers -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />'''

if old_favicon in content:
    content = content.replace(old_favicon, new_favicon)

# Add og:image and twitter:image if missing
og_desc = '<meta property="og:description" content="Trusted financial, tax, and compliance support across Audit, Income Tax, GST, and Corporate Advisory." />'
og_img = '''<meta property="og:description" content="Trusted financial, tax, and compliance support across Audit, Income Tax, GST, and Corporate Advisory." />
    <meta property="og:image" content="https://kavithaassociates.com/favicon-512x512.png" />
    <meta property="og:image:width" content="512" />
    <meta property="og:image:height" content="512" />
    <meta property="og:image:alt" content="Kavitha &amp; Associates Official Logo" />'''
if og_desc in content and 'og:image' not in content:
    content = content.replace(og_desc, og_img)

tw_desc = '<meta name="twitter:description" content="Trusted financial, tax, and compliance support across Audit, Income Tax, GST, and Corporate Advisory." />'
tw_img = '''<meta name="twitter:description" content="Trusted financial, tax, and compliance support across Audit, Income Tax, GST, and Corporate Advisory." />
    <meta name="twitter:image" content="https://kavithaassociates.com/favicon-512x512.png" />'''
if tw_desc in content and 'twitter:image' not in content:
    content = content.replace(tw_desc, tw_img)

# Schema.org logo
schema_target = '"legalName": "Kavitha & Associates Chartered Accountants",'
schema_replace = '''"legalName": "Kavitha & Associates Chartered Accountants",
      "url": "https://kavithaassociates.com",
      "logo": "https://kavithaassociates.com/favicon-512x512.png",
      "image": "https://kavithaassociates.com/favicon-512x512.png",'''
if schema_target in content and '"logo": "https://kavithaassociates.com/favicon-512x512.png"' not in content:
    content = content.replace(schema_target, schema_replace)

with open('C:/kavatha ca/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated index.html successfully')
