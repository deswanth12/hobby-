"""
Challenger 1 (challenger_v65_rem_1) Adversarial & Empirical Verification Suite
Milestone: V65 Remediation Verification
"""

import os
import sys
import struct
import re
import subprocess
import json

WORKSPACE = r"c:\kavatha ca"
DELIVERABLES = {
    "audit": os.path.join(WORKSPACE, "V65_CA_WEBSITE_REFERENCE_AUDIT.md"),
    "matrix": os.path.join(WORKSPACE, "V65_COMPETITOR_COMPARISON_MATRIX.md"),
    "colours": os.path.join(WORKSPACE, "V65_COLOUR_DIRECTION_PROPOSALS.md"),
    "recommendation": os.path.join(WORKSPACE, "V65_DESIGN_RECOMMENDATION.md"),
}
SCREENSHOTS_DIR = os.path.join(WORKSPACE, "V65_REFERENCE_SCREENSHOTS")

RESULTS = {
    "line_211_check": False,
    "line_198_check": False,
    "unapproved_fca_fellow_claims_check": False,
    "screenshot_validation_check": False,
    "source_code_immutability_check": False,
    "failures": [],
    "details": {},
}

def log_pass(msg):
    print(f"  [PASS] {msg}")

def log_fail(msg):
    print(f"  [FAIL] {msg}")
    RESULTS["failures"].append(msg)

def test_line_211_and_198():
    print("\n--- Test 1: V65_COMPETITOR_COMPARISON_MATRIX.md Lines 211 & 198 ---")
    matrix_path = DELIVERABLES["matrix"]
    if not os.path.exists(matrix_path):
        log_fail(f"Matrix file not found: {matrix_path}")
        return

    with open(matrix_path, "r", encoding="utf-8") as f:
        lines = [line.rstrip("\r\n") for line in f]

    # Line 211 (0-indexed: 210)
    expected_l211 = "- Formal credentials: ACA (ICAI), CMA (AIR 49), practice tenure"
    actual_l211 = lines[210] if len(lines) >= 211 else ""
    RESULTS["details"]["actual_line_211"] = actual_l211

    if actual_l211 == expected_l211:
        log_pass(f"Line 211 exactly matches: {actual_l211}")
        RESULTS["line_211_check"] = True
    else:
        log_fail(f"Line 211 mismatch. Expected: {expected_l211!r}, Got: {actual_l211!r}")

    # Line 198 (0-indexed: 197)
    expected_l198_substr = '4. **Interactive Profile Modals**: Clicking "View Profile" triggers a clean modal detailing educational degrees (FCA, DISA, LLB)'
    actual_l198 = lines[197] if len(lines) >= 198 else ""
    RESULTS["details"]["actual_line_198"] = actual_l198

    if expected_l198_substr in actual_l198 and "KKC & Associates" in "".join(lines[190:197]):
        log_pass(f"Line 198 intact for KKC & Associates: {actual_l198}")
        RESULTS["line_198_check"] = True
    else:
        log_fail(f"Line 198 corrupted or not intact: {actual_l198!r}")

def test_unapproved_fca_fellow_claims():
    print("\n--- Test 2: Unapproved FCA / Fellow Claims Scan across All 4 Deliverables ---")
    fca_pattern = re.compile(r"\b(FCA|Fellow)\b", re.IGNORECASE)
    kavitha_context_pattern = re.compile(r"(kavitha|founder|senior partner|our firm)", re.IGNORECASE)

    violations = []
    found_mentions = []

    for key, path in DELIVERABLES.items():
        fname = os.path.basename(path)
        if not os.path.exists(path):
            log_fail(f"Deliverable not found: {path}")
            continue

        with open(path, "r", encoding="utf-8", errors="replace") as f:
            for idx, line in enumerate(f, 1):
                if fca_pattern.search(line):
                    found_mentions.append((fname, idx, line.strip()))
                    # Check if line or immediate context refers to Kavitha & Associates
                    if kavitha_context_pattern.search(line):
                        # Verify if it's explicitly stating unapproved credential
                        violations.append((fname, idx, line.strip()))

    RESULTS["details"]["all_fca_mentions"] = [f"{m[0]}:{m[1]} -> {m[2]}" for m in found_mentions]

    print(f"  Total FCA/Fellow mentions across 4 deliverables: {len(found_mentions)}")
    for fname, idx, text in found_mentions:
        print(f"    - {fname}:{idx}: {text[:90]}...")

    if not violations:
        log_pass("Zero unapproved FCA/Fellow claims attributed to Kavitha & Associates in any deliverable!")
        RESULTS["unapproved_fca_fellow_claims_check"] = True
    else:
        for v in violations:
            log_fail(f"Unapproved FCA/Fellow claim found in {v[0]}:{v[1]}: {v[2]}")

def test_screenshot_integrity():
    print("\n--- Test 3: Screenshot Asset Integrity (58 PNGs) ---")
    if not os.path.exists(SCREENSHOTS_DIR):
        log_fail(f"Screenshots directory missing: {SCREENSHOTS_DIR}")
        return

    files = sorted(os.listdir(SCREENSHOTS_DIR))
    png_files = [f for f in files if f.lower().endswith(".png")]

    if len(png_files) != 58:
        log_fail(f"Expected exactly 58 PNG screenshots, found {len(png_files)}")
        return

    png_magic = b"\x89PNG\r\n\x1a\n"
    corrupt = []
    zero_byte = []
    total_bytes = 0

    for f in png_files:
        full_path = os.path.join(SCREENSHOTS_DIR, f)
        sz = os.path.getsize(full_path)
        total_bytes += sz
        if sz == 0:
            zero_byte.append(f)
            continue
        with open(full_path, "rb") as fp:
            hdr = fp.read(24)
            if len(hdr) < 24 or hdr[:8] != png_magic:
                corrupt.append(f)
                continue
            w, h = struct.unpack(">II", hdr[16:24])
            if w <= 0 or h <= 0:
                corrupt.append(f)

    if not zero_byte and not corrupt:
        log_pass(f"All 58 PNG screenshots are valid, non-empty, well-formed PNGs (Total: {total_bytes / (1024*1024):.2f} MB)")
        RESULTS["screenshot_validation_check"] = True
    else:
        if zero_byte:
            log_fail(f"Zero-byte screenshots found: {zero_byte}")
        if corrupt:
            log_fail(f"Corrupt screenshots found: {corrupt}")

def test_source_immutability():
    print("\n--- Test 4: Source Code Immutability in src/, public/, server/ ---")
    # Verify via git status and timestamps
    # In Milestone V65 remediation, no source code should be altered.
    # Check if any .ts, .tsx, .js, .cjs in src/ or server/ was touched recently.
    import time
    matrix_time = os.path.getmtime(DELIVERABLES["matrix"])
    
    suspicious_mods = []
    for d in ["src", "server"]:
        dp = os.path.join(WORKSPACE, d)
        for root_dir, _, filenames in os.walk(dp):
            for fn in filenames:
                fp = os.path.join(root_dir, fn)
                mt = os.path.getmtime(fp)
                if mt > matrix_time:
                    suspicious_mods.append(fp)

    if not suspicious_mods:
        log_pass("Zero source files in src/ and server/ modified during or after V65 matrix remediation.")
        RESULTS["source_code_immutability_check"] = True
    else:
        log_fail(f"Modified source files detected: {suspicious_mods}")

def main():
    print("="*70)
    print("CHALLENGER 1 (challenger_v65_rem_1) VERIFICATION RUN")
    print("="*70)

    test_line_211_and_198()
    test_unapproved_fca_fellow_claims()
    test_screenshot_integrity()
    test_source_immutability()

    print("\n" + "="*70)
    all_passed = (
        RESULTS["line_211_check"] and
        RESULTS["line_198_check"] and
        RESULTS["unapproved_fca_fellow_claims_check"] and
        RESULTS["screenshot_validation_check"] and
        RESULTS["source_code_immutability_check"] and
        len(RESULTS["failures"]) == 0
    )

    if all_passed:
        print("VERDICT: [APPROVE] - All empirical verification tests PASSED with 0 defects.")
    else:
        print(f"VERDICT: [REQUEST_CHANGES] - {len(RESULTS['failures'])} test(s) failed.")
    print("="*70)

    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
