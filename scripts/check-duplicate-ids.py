import re
import collections

with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Match id="..." or id='...'
ids = re.findall(r'id=["\']([^"\']+)["\']', text)
print("All IDs found:", ids)

counts = collections.Counter(ids)
duplicates = {k: v for k, v in counts.items() if v > 1}
print("Duplicate IDs:", duplicates)
