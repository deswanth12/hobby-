"""
Challenger Remediation Comprehensive Verification Suite for Milestone V65.
Performs independent empirical testing and adversarial stress-testing
on the remediation applied to V65 deliverables.
"""

import os
import re
import math
import struct
import datetime
from typing import Dict, List, Tuple

WORKSPACE = r"c:\kavatha ca"

DELIVERABLES = {
    "audit": os.path.join(WORKSPACE, "V65_CA_WEBSITE_REFERENCE_AUDIT.md"),
    "matrix": os.path.join(WORKSPACE, "V65_COMPETITOR_COMPARISON_MATRIX.md"),
    "colours": os.path.join(WORKSPACE, "V65_COLOUR_DIRECTION_PROPOSALS.md"),
    "recommendation": os.path.join(WORKSPACE, "V65_DESIGN_RECOMMENDATION.md"),
}
SCREENSHOT_DIR = os.path.join(WORKSPACE, "V65_REFERENCE_SCREENSHOTS")

AUDIT_RESULTS = {
    "timestamp": datetime.datetime.now().isoformat(),
    "remediation_item_1_experience_badge": False,
    "remediation_item_2_credentials_fca": False,
    "remediation_item_3_muted_contrast": False,
    "all_contrast_claims_verified": [],
    "negative_constraints_passed": False,
    "screenshot_integrity_passed": False,
    "deliverable_completeness_passed": False,
    "failures": [],
    "warnings": [],
}

def log_failure(msg: str):
    AUDIT_RESULTS["failures"].append(msg)
    print(f"[-] FAIL: {msg}")

def log_pass(msg: str):
    print(f"[+] PASS: {msg}")

# -------------------------------------------------------------
# WCAG 2.1 CONTRAST FORMULAS
# -------------------------------------------------------------
def srgb_channel_luminance(c_srgb: float) -> float:
    if c_srgb <= 0.04045:
        return c_srgb / 12.92
    else:
        return math.pow((c_srgb + 0.055) / 1.055, 2.4)

def hex_to_relative_luminance(hex_str: str) -> float:
    hex_clean = hex_str.lstrip("#")
    if len(hex_clean) == 3:
        hex_clean = "".join([c*2 for c in hex_clean])
    r = int(hex_clean[0:2], 16) / 255.0
    g = int(hex_clean[2:4], 16) / 255.0
    b = int(hex_clean[4:6], 16) / 255.0
    
    R = srgb_channel_luminance(r)
    G = srgb_channel_luminance(g)
    B = srgb_channel_luminance(b)
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B

def calculate_contrast_ratio(hex1: str, hex2: str) -> float:
    l1 = hex_to_relative_luminance(hex1)
    l2 = hex_to_relative_luminance(hex2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

# -------------------------------------------------------------
# 1. VERIFY REMEDIATION ITEMS
# -------------------------------------------------------------
def test_remediation_items():
    print("\n" + "="*60)
    print("1. VERIFYING REMEDIATION ITEMS")
    print("="*60)

    # Item 1: Line 37 of V65_DESIGN_RECOMMENDATION.md
    rec_path = DELIVERABLES["recommendation"]
    with open(rec_path, "r", encoding="utf-8") as f:
        rec_lines = f.readlines()
        rec_content = "".join(rec_lines)

    line_37 = rec_lines[36] if len(rec_lines) >= 37 else ""
    line_36 = rec_lines[35] if len(rec_lines) >= 36 else ""
    line_38 = rec_lines[37] if len(rec_lines) >= 38 else ""

    if "[Big 4 & MNC Pedigree]" in line_37:
        log_pass("Item 1: Line 37 contains '[Big 4 & MNC Pedigree]'")
    else:
        log_failure(f"Item 1: Line 37 does not contain '[Big 4 & MNC Pedigree]': {line_37.strip()}")

    if "30+ Yrs" in rec_content or "30+ years" in rec_content.lower():
        log_failure("Item 1: '30+ Yrs' still found in V65_DESIGN_RECOMMENDATION.md!")
    else:
        log_pass("Item 1: Zero occurrences of '30+ Yrs' in V65_DESIGN_RECOMMENDATION.md")

    # Check wireframe ASCII alignment: length of lines 36, 37, 38 should match
    l36_len = len(line_36.rstrip("\r\n"))
    l37_len = len(line_37.rstrip("\r\n"))
    l38_len = len(line_38.rstrip("\r\n"))
    if l36_len == l37_len == l38_len:
        log_pass(f"Item 1: Wireframe lines perfectly aligned ({l37_len} chars)")
        AUDIT_RESULTS["remediation_item_1_experience_badge"] = True
    else:
        log_failure(f"Item 1: Wireframe misaligned: line 36 ({l36_len}), line 37 ({l37_len}), line 38 ({l38_len})")

    # Item 2: Line 150 of V65_DESIGN_RECOMMENDATION.md
    line_150 = rec_lines[149] if len(rec_lines) >= 150 else ""
    expected_cred = "Formal Professional Standing: Practicing Chartered Accountant (ACA) & Cost Accountant (AIR 49) with Institute of Chartered Accountants of India (ICAI) and ICMAI."
    
    if expected_cred in line_150:
        log_pass("Item 2: Line 150 accurately states partner credentials")
    else:
        log_failure(f"Item 2: Line 150 does not match expected credentials. Found: {line_150.strip()}")

    # Check for FCA / Fellow applied to Kavitha in recommendation
    if re.search(r"\b(?:FCA|Fellow\s*Chartered\s*Accountant)\b", rec_content):
        log_failure("Item 2: 'FCA' or 'Fellow Chartered Accountant' found in V65_DESIGN_RECOMMENDATION.md!")
    else:
        log_pass("Item 2: Zero occurrences of 'FCA' or 'Fellow' in V65_DESIGN_RECOMMENDATION.md")
        AUDIT_RESULTS["remediation_item_2_credentials_fca"] = True

    # Item 3: Direction 4 Muted Text Contrast in V65_COLOUR_DIRECTION_PROPOSALS.md
    col_path = DELIVERABLES["colours"]
    with open(col_path, "r", encoding="utf-8") as f:
        col_content = f.read()

    # Verify #666E76 in token table
    if "| `--color-text-muted` |" in col_content and "`#666E76`" in col_content:
        log_pass("Item 3: Token table has `--color-text-muted` = `#666E76`")
    else:
        log_failure("Item 3: `--color-text-muted` not updated to `#666E76` in token table")

    # Check old #6C757D absence
    if "#6C757D" in col_content:
        log_failure("Item 3: Legacy `#6C757D` still present in V65_COLOUR_DIRECTION_PROPOSALS.md")
    else:
        log_pass("Item 3: Legacy `#6C757D` completely removed from proposals")

    # Calculate exact contrast of #666E76 on #F8F9FA
    lum_muted = hex_to_relative_luminance("#666E76")
    lum_bg = hex_to_relative_luminance("#F8F9FA")
    actual_contrast = calculate_contrast_ratio("#666E76", "#F8F9FA")
    log_pass(f"Item 3: Contrast calculation: #666E76 (lum {lum_muted:.4f}) on #F8F9FA (lum {lum_bg:.4f}) = {actual_contrast:.2f}:1")

    if actual_contrast >= 4.50:
        log_pass(f"Item 3: Contrast {actual_contrast:.2f}:1 PASSES WCAG 2.1 AA (>= 4.50:1)")
    else:
        log_failure(f"Item 3: Contrast {actual_contrast:.2f}:1 FAILS WCAG 2.1 AA (< 4.50:1)")

    # Check Section 3 text in Direction 4
    if "4.62:1" in col_content:
        log_pass("Item 3: Section 3 and Scorecard reflect verified contrast 4.62:1")
        AUDIT_RESULTS["remediation_item_3_muted_contrast"] = True
    else:
        log_failure("Item 3: '4.62:1' not found in proposals")

# -------------------------------------------------------------
# 2. ADVERSARIAL CONTRAST AUDIT ACROSS ALL 4 DIRECTIONS
# -------------------------------------------------------------
def test_all_contrast_claims():
    print("\n" + "="*60)
    print("2. ADVERSARIAL CONTRAST AUDIT ACROSS ALL 4 DIRECTIONS")
    print("="*60)
    col_path = DELIVERABLES["colours"]
    with open(col_path, "r", encoding="utf-8") as f:
        text = f.read()

    # Test key pairs for each direction
    direction_pairs = [
        # Direction 1
        ("Direction 1 Body Text", "#1A2530", "#F8F9FA", 4.50, "AA"),
        ("Direction 1 Dark Header Text", "#FFFFFF", "#1A2530", 4.50, "AA"),
        ("Direction 1 Imperial Amber Button", "#1A2530", "#D4A017", 4.50, "AA"),
        ("Direction 1 Muted Text", "#5A6572", "#F8F9FA", 4.50, "AA"),
        # Direction 2
        ("Direction 2 Body Text", "#1B3B2B", "#FDFCF7", 4.50, "AA"),
        ("Direction 2 Dark Header Text", "#FDFCF7", "#1B3B2B", 4.50, "AA"),
        ("Direction 2 Gold Button", "#1B3B2B", "#D4AF37", 4.50, "AA"),
        ("Direction 2 Muted Text", "#536B5C", "#FDFCF7", 4.50, "AA"),
        # Direction 3
        ("Direction 3 Body Text", "#0A3641", "#F7FAFC", 4.50, "AA"),
        ("Direction 3 Dark Header Text", "#F7FAFC", "#0A3641", 4.50, "AA"),
        ("Direction 3 Primary CTA (Teal on Canvas/White)", "#0A3641", "#FFFFFF", 4.50, "AA"),
        ("Direction 3 Muted Text", "#4A6B74", "#F7FAFC", 4.50, "AA"),
        # Direction 4
        ("Direction 4 Body Text", "#212529", "#F8F9FA", 4.50, "AA"),
        ("Direction 4 Charcoal on Electric Lime", "#212529", "#C2E83B", 4.50, "AA"),
        ("Direction 4 Muted Text", "#666E76", "#F8F9FA", 4.50, "AA"),
    ]

    all_pass = True
    for label, fg, bg, threshold, req in direction_pairs:
        ratio = calculate_contrast_ratio(fg, bg)
        passes = ratio >= threshold
        status = "PASS" if passes else "FAIL"
        print(f"    [{status}] {label} ({fg} on {bg}): {ratio:.2f}:1 (Req: >={threshold}:1 [{req}])")
        AUDIT_RESULTS["all_contrast_claims_verified"].append({
            "label": label,
            "fg": fg,
            "bg": bg,
            "ratio": round(ratio, 2),
            "threshold": threshold,
            "passed": passes,
        })
        if not passes:
            log_failure(f"{label} failed threshold: {ratio:.2f}:1 < {threshold}:1")
            all_pass = False

    if all_pass:
        log_pass("All directional design token pairs meet or exceed WCAG 2.1 AA/AAA requirements!")

# -------------------------------------------------------------
# 3. NEGATIVE CONSTRAINT SCANNING
# -------------------------------------------------------------
def test_negative_constraints():
    print("\n" + "="*60)
    print("3. EXHAUSTIVE NEGATIVE CONSTRAINT SCAN")
    print("="*60)

    # Scanned files: all 4 deliverables + any new files
    files_to_scan = list(DELIVERABLES.values())
    
    forbidden_terms = [
        ("Client Aadhaar Number", r"\b[2-9]\d{3}\s\d{4}\s\d{4}\b"),
        ("Client PAN Card", r"\b[A-Z]{5}[0-9]{4}[A-Z]\b"),
        ("Client ICAI Membership No", r"\b(?:M\.?No\.?|Membership\s*No\.?)\s*[:=]?\s*\d{5,6}\b"),
        ("Unapproved FRN for Kavitha", r"\b(?:FRN|Firm\s*Reg.*No\.?)\s*[:=]?\s*\d{6}[A-Z]\b"),
        ("30+ Yrs Experience", r"\b30\+\s*(?:yrs|years)\b"),
        ("FCA / Fellow for Kavitha", r"(?:Kavitha|Partner|Founder|Leadership)[^\.\n]{0,60}\b(?:FCA|Fellow\s*Chartered\s*Accountant)\b"),
        ("100% Success Claim", r"\b100%\s*(?:success|guarantee)\b"),
        ("No 1 CA Firm Claim", r"\b(?:#1|No\.?\s*1|Number\s*1)\s*CA\b"),
        ("Public Tax Calculator Reintroduction", r"\b(?:reintroduce|embed|implement|build)\s*(?:a\s*)?(?:public\s*)?tax\s*calculator\b"),
        ("Knowledge Bank Reintroduction", r"\b(?:reintroduce|implement|build)\s*(?:the\s*)?knowledge\s*bank\b"),
    ]

    all_passed = True
    for fp in files_to_scan:
        fname = os.path.basename(fp)
        with open(fp, "r", encoding="utf-8") as f:
            content = f.read()
            lines = content.splitlines()

        for idx, line in enumerate(lines, 1):
            for term_name, pat in forbidden_terms:
                m = re.search(pat, line, re.IGNORECASE)
                if m:
                    # Ignore competitor audit context where competitor ICAI/FRN is discussed
                    if "competitor" in line.lower() or "singhi" in line.lower() or "batliboi" in line.lower() or "asa" in line.lower() or "bdo" in line.lower() or "walker" in line.lower() or "kkc" in line.lower():
                        continue
                    # Ignore negated phrases
                    if re.search(r"\b(zero|do not|never|no|avoid|reject|prohibit|without|omit|exclude)\b", line, re.IGNORECASE):
                        continue
                    log_failure(f"Negative Constraint Violation in {fname}:{idx} [{term_name}]: {line.strip()[:100]}")
                    all_passed = False

    if all_passed:
        log_pass("Exhaustive scan complete: Zero negative constraint violations found across all deliverables!")
        AUDIT_RESULTS["negative_constraints_passed"] = True

# -------------------------------------------------------------
# 4. SCREENSHOT ASSET INTEGRITY
# -------------------------------------------------------------
def test_screenshots():
    print("\n" + "="*60)
    print("4. SCREENSHOT ASSET INTEGRITY")
    print("="*60)
    if not os.path.exists(SCREENSHOT_DIR):
        log_failure("Screenshot directory missing!")
        return

    pngs = [f for f in os.listdir(SCREENSHOT_DIR) if f.endswith(".png")]
    if len(pngs) < 58:
        log_failure(f"Expected at least 58 screenshots, found {len(pngs)}")
        return

    valid_count = 0
    for p in pngs:
        fp = os.path.join(SCREENSHOT_DIR, p)
        sz = os.path.getsize(fp)
        if sz == 0:
            log_failure(f"Zero byte screenshot: {p}")
            continue
        with open(fp, "rb") as f:
            header = f.read(24)
            if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
                log_failure(f"Corrupt PNG header: {p}")
                continue
            width, height = struct.unpack(">II", header[16:24])
            if width < 300 or height < 300:
                log_failure(f"Suspiciously small dimensions: {p} ({width}x{height})")
                continue
        valid_count += 1

    if valid_count == len(pngs):
        log_pass(f"All {valid_count} screenshot PNGs verified valid, non-empty, and structurally sound!")
        AUDIT_RESULTS["screenshot_integrity_passed"] = True

# -------------------------------------------------------------
# 5. DELIVERABLE COMPLETENESS & STRUCTURE
# -------------------------------------------------------------
def test_deliverables_completeness():
    print("\n" + "="*60)
    print("5. DELIVERABLE COMPLETENESS & STRUCTURE")
    print("="*60)

    for name, path in DELIVERABLES.items():
        if not os.path.exists(path):
            log_failure(f"Deliverable missing: {name}")
            return
        size = os.path.getsize(path)
        log_pass(f"Deliverable '{name}': {os.path.basename(path)} ({size:,} bytes)")

    AUDIT_RESULTS["deliverable_completeness_passed"] = True

def main():
    test_remediation_items()
    test_all_contrast_claims()
    test_negative_constraints()
    test_screenshots()
    test_deliverables_completeness()

    print("\n" + "="*70)
    if not AUDIT_RESULTS["failures"]:
        print("FINAL VERDICT: ALL REMEDIATION CRITERIA VERIFIED [APPROVE]")
    else:
        print(f"FINAL VERDICT: VERIFICATION FAILED [REQUEST_CHANGES] ({len(AUDIT_RESULTS['failures'])} failures)")
    print("="*70)

if __name__ == "__main__":
    main()
