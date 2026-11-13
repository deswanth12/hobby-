import os, re, glob

print("=== CATEGORICAL PRIVACY AUDIT ===")

patterns = {
    "Personal Tax Identifiers (PAN)": re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'),
    "National Identity Numbers (Aadhaar)": re.compile(r'\b\d{4}[\s-]\d{4}[\s-]\d{4}\b'),
    "Individual ICAI Membership Numbers": re.compile(r'(?:MRN|Membership\s*No|ICAI\s*No)[.:\s]*(\d{5,6})', re.IGNORECASE),
    "Unapproved Firm Registration Numbers": re.compile(r'\b01614' + r'7S\b', re.IGNORECASE),
    "Unapproved Branch Office Claims": re.compile(r'Bangalore\s*chambers|Vasanthnagar', re.IGNORECASE)
}

scan_targets = []
# 1. Client-facing Markdown reports
scan_targets.extend(glob.glob("V70_*.md"))
scan_targets.extend(glob.glob("V69_*.md"))

# 2. Public application routes and components
for root, _, files in os.walk("src"):
    for f in files:
        if f.endswith((".tsx", ".ts")):
            scan_targets.append(os.path.join(root, f))

# 3. Public metadata
scan_targets.extend(["index.html", "public/sitemap.xml", "public/robots.txt"])

category_counts = {cat: 0 for cat in patterns}

for file_path in scan_targets:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8", errors="ignore") as fh:
            text = fh.read()
            for cat, regex in patterns.items():
                matches = regex.findall(text)
                if matches:
                    category_counts[cat] += len(matches)

print("\nAUDIT RESULTS (CATEGORIES & COUNTS ONLY):")
all_passed = True
for cat, count in category_counts.items():
    status = "PASS (0 occurrences)" if count == 0 else f"FLAGGED ({count} occurrences)"
    print(f" • {cat}: {status}")
    if count > 0:
        all_passed = False

print(f"\nFinal Privacy Integrity Verdict: {'PASSED (Zero Restricted Disclosures)' if all_passed else 'ACTION REQUIRED'}")
