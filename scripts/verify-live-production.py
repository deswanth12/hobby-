import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
req = urllib.request.Request('https://kavithaassociates.com/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx) as resp:
    html = resp.read().decode('utf-8')

# 1. Favicon Tags
tags = [
    '<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />',
    '<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />',
    '<link rel="icon" type="image/x-icon" href="/favicon.ico" />',
    '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
    'https://kavithaassociates.com/favicon-512x512.png'
]

print("=== LIVE PRODUCTION FAVICON TAG AUDIT ===")
for t in tags:
    present = t in html
    print(f"[{'PASS' if present else 'FAIL'}] {t}")

# 2. Schema.org JSON-LD
idx1 = html.find('<script type="application/ld+json">')
if idx1 != -1:
    idx2 = html.find('</script>', idx1)
    raw = html[idx1+35:idx2]
    data = json.loads(raw)
    print("\n=== LIVE PRODUCTION SCHEMA.ORG JSON-LD ===")
    print("Name:", data.get('name'))
    print("Type:", data.get('@type'))
    print("Logo:", data.get('logo'))
    print("Address:", data.get('address', {}).get('streetAddress'))
    print("Locality:", data.get('address', {}).get('addressLocality'))
    print("Geo:", data.get('geo'))
    print("Map:", data.get('hasMap'))
    print("Telephones:", data.get('telephone'))
