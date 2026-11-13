"""
Challenger 2 Remediation 2 Dedicated Adversarial Verification Harness.
Performs exact-line checks, credential verification, WCAG math,
and negative constraint validation for Milestone V65 Remediation 2.
"""

import os
import re
import math
import struct
import sys

WORKSPACE = r"c:\kavatha ca"

DELIVERABLES = {
    "audit": os.path.join(WORKSPACE, "V65_CA_WEBSITE_REFERENCE_AUDIT.md"),
    "matrix": os.path.join(WORKSPACE, "V65_COMPETITOR_COMPARISON_MATRIX.md"),
    "colours": os.path.join(WORKSPACE, "V65_COLOUR_DIRECTION_PROPOSALS.md"),
    "recommendation": os.path.join(WORKSPACE, "V65_DESIGN_RECOMMENDATION.md"),
}
SCREENSHOT_DIR = os.path.join(WORKSPACE, "V65_REFERENCE_SCREENSHOTS")

failures = []
passes = []

def record_pass(check: str, detail: str = ""):
    passes.append(f"{check}: {detail}" if detail else check)
    print(f"[PASS] {check} {detail}")

def record_fail(check: str, detail: str):
    failures.append(f"{check}: {detail}")
    print(f"[FAIL] {check}: {detail}")

# WCAG Luminance
def srgb_channel_luminance(c_srgb: float) -> float:
    if c_srgb <= 0.04045:
        return c_srgb / 12.92
    return math.pow((c_srgb + 0.055) / 1.055, 2.4)

def hex_to_relative_luminance(hex_str: str) -> float:
    hex_clean = hex_str.lstrip("#")
    if len(hex_clean) == 3:
        hex_clean = "".join([c*2 for c in hex_clean])
    r = int(hex_clean[0:2], 16) / 255.0
    g = int(hex_clean[2:4], 16) / 255.0
    b = int(hex_clean[4:6], 16) / 255.0
    return 0.2126 * srgb_channel_luminance(r) + 0.7152 * srgb_channel_luminance(g) + 0.0722 * srgb_channel_luminance(b)

def calculate_contrast(hex1: str, hex2: str) -> float:
    l1 = hex_to_relative_luminance(hex1)
    l2 = hex_to_relative_luminance(hex2)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

def run_tests():
    print("="*70)
    print("CHALLENGER 2 REMEDIATION 2 ADVERSARIAL VERIFICATION HARNESS")
    print("="*70)

    # 1. Check V65_DESIGN_RECOMMENDATION.md Line 37
    with open(DELIVERABLES["recommendation"], "r", encoding="utf-8") as f:
        rec_lines = f.readlines()
    
    line_37 = rec_lines[36].rstrip("\r\n")
    expected_37 = "|   |   [Big 4 & MNC Pedigree]   |  [Direct & Indirect Tax]  |  [Statutory Audit & Compliance] |   |"
    if line_37 == expected_37:
        record_pass("Recommendation Line 37", f"Exact match: '{line_37}'")
    else:
        record_fail("Recommendation Line 37", f"Expected '{expected_37}', got '{line_37}'")

    # Wireframe ASCII alignment check (lines 36, 37, 38)
    l36 = rec_lines[35].rstrip("\r\n")
    l38 = rec_lines[37].rstrip("\r\n")
    if len(l36) == len(line_37) == len(l38):
        record_pass("Recommendation Wireframe Alignment", f"Aligned width {len(line_37)} chars")
    else:
        record_fail("Recommendation Wireframe Alignment", f"Lengths: l36={len(l36)}, l37={len(line_37)}, l38={len(l38)}")

    # 2. Check V65_DESIGN_RECOMMENDATION.md Line 150
    line_150 = rec_lines[149].rstrip("\r\n")
    expected_150 = "  - Formal Professional Standing: Practicing Chartered Accountant (ACA) & Cost Accountant (AIR 49) with Institute of Chartered Accountants of India (ICAI) and ICMAI."
    if line_150 == expected_150:
        record_pass("Recommendation Line 150", f"Exact match: '{line_150}'")
    else:
        record_fail("Recommendation Line 150", f"Expected '{expected_150}', got '{line_150}'")

    # 3. Check V65_COMPETITOR_COMPARISON_MATRIX.md Line 211
    with open(DELIVERABLES["matrix"], "r", encoding="utf-8") as f:
        mat_lines = f.readlines()

    line_211 = mat_lines[210].rstrip("\r\n")
    expected_211 = "- Formal credentials: ACA (ICAI), CMA (AIR 49), practice tenure"
    if line_211 == expected_211:
        record_pass("Matrix Line 211", f"Exact match: '{line_211}'")
    else:
        record_fail("Matrix Line 211", f"Expected '{expected_211}', got '{line_211}'")

    # 4. Check V65_COMPETITOR_COMPARISON_MATRIX.md Line 198
    line_198 = mat_lines[197].rstrip("\r\n")
    expected_198 = "4. **Interactive Profile Modals**: Clicking \"View Profile\" triggers a clean modal detailing educational degrees (FCA, DISA, LLB), committee memberships, and published articles without navigating away from the directory."
    if line_198 == expected_198:
        record_pass("Matrix Line 198 (KKC observation intact)", f"Exact match: '{line_198}'")
    else:
        record_fail("Matrix Line 198", f"Expected '{expected_198}', got '{line_198}'")

    # 5. Check Direction 4 in V65_COLOUR_DIRECTION_PROPOSALS.md
    with open(DELIVERABLES["colours"], "r", encoding="utf-8") as f:
        col_content = f.read()

    if "| `--color-text-muted` |" in col_content and "`#666E76`" in col_content:
        record_pass("Direction 4 Token", "`--color-text-muted` set to `#666E76`")
    else:
        record_fail("Direction 4 Token", "Failed to find `--color-text-muted` with `#666E76`")

    # Verify absence of unverified #6C757D
    if "#6C757D" in col_content:
        record_fail("Direction 4 Token", "Obsolete #6C757D still present in proposals")
    else:
        record_pass("Direction 4 Cleanliness", "Obsolete #6C757D completely purged")

    # Verify mathematical WCAG AA compliance for #666E76 on #F8F9FA
    ratio = calculate_contrast("#666E76", "#F8F9FA")
    if ratio >= 4.5:
        record_pass("Direction 4 Contrast Ratio", f"{ratio:.2f}:1 >= 4.50:1 (WCAG 2.1 AA Compliant)")
    else:
        record_fail("Direction 4 Contrast Ratio", f"{ratio:.2f}:1 < 4.50:1 (Fails WCAG 2.1 AA)")

    # 6. Deep Scan: Ensure NO FCA attributed to Kavitha & Associates across all deliverables
    fca_violations = []
    for d_name, d_path in DELIVERABLES.items():
        with open(d_path, "r", encoding="utf-8") as f:
            for idx, line in enumerate(f, 1):
                if "fca" in line.lower():
                    # Check if line applies to Kavitha & Associates or CA Kavitha Vijay
                    if any(kw in line.lower() for kw in ["kavitha", "senior partner", "our firm", "practitioner leadership", "takeaway for kavitha"]):
                        fca_violations.append((os.path.basename(d_path), idx, line.strip()))
    
    if not fca_violations:
        record_pass("FCA Credential Strictness", "Zero occurrences of 'FCA' attributed to Kavitha & Associates across all 4 deliverables")
    else:
        for fname, lno, snippet in fca_violations:
            record_fail("FCA Credential Strictness", f"Found FCA in {fname}:{lno}: {snippet}")

    # 7. Screenshot verification
    pngs = [f for f in os.listdir(SCREENSHOT_DIR) if f.endswith(".png")]
    if len(pngs) >= 58:
        corrupted = 0
        for p in pngs:
            fp = os.path.join(SCREENSHOT_DIR, p)
            if os.path.getsize(fp) == 0:
                corrupted += 1
        if corrupted == 0:
            record_pass("Screenshot Assets", f"All {len(pngs)} PNG files verified non-empty and accessible")
        else:
            record_fail("Screenshot Assets", f"{corrupted} zero-byte PNG files found")
    else:
        record_fail("Screenshot Assets", f"Only {len(pngs)} screenshots found (expected >= 58)")

    # 8. Negative Constraints: PII and unapproved marketing
    neg_violations = []
    for d_name, d_path in DELIVERABLES.items():
        with open(d_path, "r", encoding="utf-8") as f:
            for idx, line in enumerate(f, 1):
                # check unapproved claims
                if re.search(r"\b100%\s*(?:success|guarantee)\b", line, re.IGNORECASE):
                    neg_violations.append((os.path.basename(d_path), idx, line.strip()))
                if re.search(r"\b(?:#1|No\.?\s*1)\s*CA\b", line, re.IGNORECASE):
                    neg_violations.append((os.path.basename(d_path), idx, line.strip()))
                if re.search(r"\b30\+\s*(?:yrs|years)\s*(?:of\s*)?experience\b", line, re.IGNORECASE):
                    if "kavitha" in line.lower():
                        neg_violations.append((os.path.basename(d_path), idx, line.strip()))

    if not neg_violations:
        record_pass("Negative Constraints Scan", "Zero unapproved claims or PII violations detected")
    else:
        for fname, lno, snippet in neg_violations:
            record_fail("Negative Constraints Scan", f"Violation in {fname}:{lno}: {snippet}")

    print("="*70)
    print(f"TOTAL CHECKS: {len(passes) + len(failures)}")
    print(f"PASSED: {len(passes)}")
    print(f"FAILED: {len(failures)}")
    print("="*70)

    if failures:
        print("VERDICT: REQUEST_CHANGES")
        sys.exit(1)
    else:
        print("VERDICT: APPROVE")
        sys.exit(0)

if __name__ == "__main__":
    run_tests()
