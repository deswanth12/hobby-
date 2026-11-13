import os, re

files = [
    'V65_CA_WEBSITE_REFERENCE_AUDIT.md',
    'V65_COMPETITOR_COMPARISON_MATRIX.md',
    'V65_COLOUR_DIRECTION_PROPOSALS.md',
    'V65_DESIGN_RECOMMENDATION.md'
]

patterns = [
    (r'\bFCA\b', 'FCA'),
    (r'\bACA\b', 'ACA'),
    (r'AIR\s*49', 'AIR 49'),
    (r'membership\s*(?:no|number)?', 'membership number'),
    (r'\bFRN\b', 'FRN'),
    (r'Kavitha\s+Vijay', 'Kavitha Vijay')
]

for fname in files:
    if not os.path.exists(fname): 
        print(f"Missing: {fname}")
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f"=== {fname} ===")
    for idx, line in enumerate(lines, 1):
        for pat, label in patterns:
            if re.search(pat, line, re.IGNORECASE):
                # Print matching line
                print(f"  Line {idx} [{label}]: {line.strip()[:100]}")
