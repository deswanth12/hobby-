#!/usr/bin/env python3
import re

with open('V67_BROCHURE_CONTENT_MAPPING.md', encoding='utf-8') as f:
    text = f.read()

# Replace any GPS line in markdown tables
text = re.sub(r'\|\s*\*\*GPS Coordinates\*\*.*?\n', '| **Chambers Coordinates Status** | Quality Gate Inspection | **Excluded from Public Landing Pages** | Unverified raw coordinates omitted to maintain address accuracy |\n', text)
text = text.replace('Chambers GPS, Inquiry Form', 'Chambers Address, Inquiry Form')
text = text.replace('GPS', 'Postal Address')

with open('V67_BROCHURE_CONTENT_MAPPING.md', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated V67_BROCHURE_CONTENT_MAPPING.md successfully')
