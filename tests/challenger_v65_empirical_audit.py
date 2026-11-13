"""
Challenger 2 Empirical Verification Harness for Milestone V65.
Adversarial stress-testing of all V65 deliverables for completeness,
accuracy, and negative constraint conformance.
"""

import os
import re
import json
import datetime
from typing import Dict, List, Any

WORKSPACE = r"c:\kavatha ca"

DELIVERABLES = {
    "audit": os.path.join(WORKSPACE, "V65_CA_WEBSITE_REFERENCE_AUDIT.md"),
    "matrix": os.path.join(WORKSPACE, "V65_COMPETITOR_COMPARISON_MATRIX.md"),
    "colours": os.path.join(WORKSPACE, "V65_COLOUR_DIRECTION_PROPOSALS.md"),
    "recommendation": os.path.join(WORKSPACE, "V65_DESIGN_RECOMMENDATION.md"),
}

SCREENSHOT_DIR = os.path.join(WORKSPACE, "V65_REFERENCE_SCREENSHOTS")

RESULTS = {
    "timestamp": datetime.datetime.now().isoformat(),
    "suite_1_completeness": {},
    "suite_2_negative_constraints": {},
    "overall_verdict": "PENDING",
    "critical_failures": [],
    "warnings": [],
}

def log_failure(suite: str, check: str, message: str):
    RESULTS["critical_failures"].append(f"[{suite}] {check}: {message}")

def log_warning(suite: str, check: str, message: str):
    RESULTS["warnings"].append(f"[{suite}] {check}: {message}")

# ==========================================
# SUITE 1: DELIVERABLES COMPLETENESS AUDIT
# ==========================================

def audit_deliverable_files_existence():
    suite = "1.0 File Existence & Size"
    passed = True
    for name, path in DELIVERABLES.items():
        if not os.path.exists(path):
            log_failure(suite, name, f"File does not exist: {path}")
            passed = False
        else:
            size = os.path.getsize(path)
            if size < 5000:
                log_failure(suite, name, f"File too small ({size} bytes): {path}")
                passed = False
    RESULTS["suite_1_completeness"]["files_exist"] = passed

def audit_reference_audit_completeness():
    suite = "1.1 Reference Audit Completeness"
    path = DELIVERABLES["audit"]
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Required firms: 6 benchmarks + CARVI
    required_firms = [
        ("ASA", r"ASA & Associates|Baker Tilly ASA"),
        ("S.R. Batliboi", r"S\.R\.\s*Batliboi|Batliboi"),
        ("KKC", r"KKC & Associates|KKC"),
        ("Singhi & Co", r"Singhi & Co"),
        ("Walker Chandiok", r"Walker Chandiok|Grant Thornton"),
        ("BDO", r"BDO India|BDO"),
        ("CARVI", r"CARVI Associates|CARVI"),
    ]

    firm_checks = {}
    for firm_label, pattern in required_firms:
        found = bool(re.search(pattern, content, re.IGNORECASE))
        firm_checks[firm_label] = found
        if not found:
            log_failure(suite, f"Firm Present: {firm_label}", f"Missing firm in audit: {firm_label}")

    # Check 12 dimensions
    expected_dimensions = [
        ("Dimension 1: Brand Colours", r"Dimension 1[:\s].*Brand Colours"),
        ("Dimension 2: Header and Navigation", r"Dimension 2[:\s].*Header"),
        ("Dimension 3: Hero Layout & Typography", r"Dimension 3[:\s].*Hero"),
        ("Dimension 4: Backgrounds/Gradients/Textures", r"Dimension 4[:\s].*Background"),
        ("Dimension 5: Service Presentation", r"Dimension 5[:\s].*Service"),
        ("Dimension 6: About & Leadership", r"Dimension 6[:\s].*About|Leadership"),
        ("Dimension 7: Trust & Credibility", r"Dimension 7[:\s].*Trust|Credibility"),
        ("Dimension 8: Photography & Image Usage", r"Dimension 8[:\s].*Photography|Image"),
        ("Dimension 9: Animation & Interaction", r"Dimension 9[:\s].*Animation|Interaction"),
        ("Dimension 10: Contact & Enquiry", r"Dimension 10[:\s].*Contact|Enquiry"),
        ("Dimension 11: Mobile Responsiveness", r"Dimension 11[:\s].*Mobile"),
        ("Dimension 12: Visual Strengths & Weaknesses", r"Dimension 12[:\s].*Strengths|Weaknesses"),
    ]

    dimension_counts = {}
    for dim_label, pattern in expected_dimensions:
        matches = list(re.finditer(pattern, content, re.IGNORECASE))
        dimension_counts[dim_label] = len(matches)
        if len(matches) < 7:
            # We expect 7 occurrences (one for each of the 7 audited firms)
            log_failure(suite, dim_label, f"Expected 7 occurrences across all firms, found {len(matches)}")

    # Check HEX colors presence in each dimension 1
    hex_codes = re.findall(r"#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}", content)
    RESULTS["suite_1_completeness"]["audit_hex_codes_count"] = len(hex_codes)
    if len(hex_codes) < 30:
        log_failure(suite, "HEX Values Recorded", f"Insufficient HEX colour values recorded from rendered inspection: found {len(hex_codes)}")

    # Check screenshot evidence references
    screenshot_refs = re.findall(r"V65_REFERENCE_SCREENSHOTS[/\\]([a-zA-Z0-9_\-\.]+)", content)
    missing_screenshots = []
    for s in set(screenshot_refs):
        sp = os.path.join(SCREENSHOT_DIR, s)
        if not os.path.exists(sp):
            missing_screenshots.append(s)

    RESULTS["suite_1_completeness"]["reference_audit"] = {
        "firms": firm_checks,
        "dimension_counts": dimension_counts,
        "total_hex_codes": len(hex_codes),
        "total_screenshot_refs": len(screenshot_refs),
        "missing_screenshot_files": missing_screenshots,
    }

    if missing_screenshots:
        log_failure(suite, "Screenshot Files on Disk", f"Referenced screenshot files missing from disk: {missing_screenshots}")

def audit_comparison_matrix_completeness():
    suite = "1.2 Comparison Matrix Completeness"
    path = DELIVERABLES["matrix"]
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 8 required categories
    required_categories = [
        ("Strongest Corporate Identity", r"Strongest Corporate Identity"),
        ("Best Colour System", r"Best Colou?r System"),
        ("Best Typography", r"Best Typography"),
        ("Best Hero Section", r"Best Hero Section"),
        ("Best Service Layout", r"Best Service Layout"),
        ("Best Leadership Presentation", r"Best Leadership Presentation"),
        ("Best Mobile Experience", r"Best Mobile Experience"),
        ("Best Navigation & User Experience", r"Best Navigation"),
    ]

    cat_checks = {}
    for cat_label, pattern in required_categories:
        match = re.search(pattern, content, re.IGNORECASE)
        cat_checks[cat_label] = bool(match)
        if not match:
            log_failure(suite, f"Category Present: {cat_label}", f"Category missing from comparison matrix: {cat_label}")

    # Check for winners and ratings in each category
    # Each category section should designate a winner and explain what works & why
    winner_matches = re.findall(r"(\*\*Winner\*\*|\*\*Designated Winner\*\*|Winner:|\*\*Top Pick\*\*)[:\s]+([^\n\r]+)", content, re.IGNORECASE)
    
    # Check for numeric or qualitative ratings (e.g., 9.5/10, Tier 1, or table ratings)
    rating_patterns = re.findall(r"(\d+(\.\d+)?\s*/\s*10|\b[1-5]\s*/\s*5\b|Tier\s*[1-3]|★+|\bRank\b)", content)

    RESULTS["suite_1_completeness"]["comparison_matrix"] = {
        "categories_found": cat_checks,
        "winners_declared": [w[1].strip() for w in winner_matches],
        "ratings_count": len(rating_patterns),
    }

    if len(winner_matches) < 8:
        log_failure(suite, "Explicit Winners", f"Expected explicit winner declared for all 8 categories, found {len(winner_matches)}")

def audit_colour_direction_proposals():
    suite = "1.3 Colour Direction Proposals"
    path = DELIVERABLES["colours"]
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Count distinct directions
    direction_headings = re.findall(r"##\s*Direction\s*\d+[:\s]+[^\n\r]+", content, re.IGNORECASE)
    
    # Extract HEX codes
    hex_codes = list(set(re.findall(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b", content)))
    valid_hexes = [h for h in hex_codes if re.match(r"^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$", h)]

    # Dual-client visual reasoning
    corp_mentions = len(re.findall(r"\b(corporate|enterprise|institutional|audit|statutory|CFO|MNC|compliance)\b", content, re.IGNORECASE))
    indiv_mentions = len(re.findall(r"\b(individual|personal|HNI|taxpayer|families|HNIs|advisory)\b", content, re.IGNORECASE))

    # Contrast considerations
    contrast_mentions = len(re.findall(r"\b(WCAG|contrast|ratio|AAA|AA|accessible|readability)\b", content, re.IGNORECASE))

    # Non-navy assumption
    non_navy_evidence = bool(re.search(r"not assuming navy|beyond.*navy|navy.*alone|traditional accounting blue", content, re.IGNORECASE))

    RESULTS["suite_1_completeness"]["colour_proposals"] = {
        "directions_count": len(direction_headings),
        "direction_headings": direction_headings,
        "valid_hex_codes_count": len(valid_hexes),
        "corporate_mentions": corp_mentions,
        "individual_mentions": indiv_mentions,
        "contrast_mentions": contrast_mentions,
        "non_navy_addressed": non_navy_evidence,
    }

    if len(direction_headings) < 3:
        log_failure(suite, "Direction Count", f"Expected at least 3 distinct colour directions, found {len(direction_headings)}")
    if len(valid_hexes) < 12:
        log_failure(suite, "HEX Tokens", f"Expected comprehensive token set (>12 hex codes), found {len(valid_hexes)}")
    if corp_mentions < 5 or indiv_mentions < 5:
        log_failure(suite, "Dual-Client Reasoning", "Insufficient dual-client reasoning (corporate vs individual)")
    if contrast_mentions < 3:
        log_failure(suite, "Contrast & Accessibility", "Insufficient contrast/accessibility analysis")

def audit_design_recommendation():
    suite = "1.4 Design Recommendation"
    path = DELIVERABLES["recommendation"]
    if not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Check for single recommended direction
    rec_direction = re.search(r"(recommended direction|recommended design|we recommend|definitive recommendation)[:\s*]+([^\n\r]+)", content, re.IGNORECASE)

    # Check key criteria
    criteria_checks = {
        "distinctive": bool(re.search(r"distinctive", content, re.IGNORECASE)),
        "professional": bool(re.search(r"professional|authority|credib", content, re.IGNORECASE)),
        "clean_modern": bool(re.search(r"clean|modern", content, re.IGNORECASE)),
        "easy_to_navigate": bool(re.search(r"easy to navigate|intuitive|navigation", content, re.IGNORECASE)),
        "dual_client_appropriate": bool(re.search(r"corporate.*individual|individual.*corporate", content, re.IGNORECASE)),
        "minimal_photography_decoration": bool(re.search(r"minimal.*photography|unnecessary.*photo|decorat", content, re.IGNORECASE)),
    }

    RESULTS["suite_1_completeness"]["design_recommendation"] = {
        "recommended_direction_found": bool(rec_direction),
        "recommended_direction_text": rec_direction.group(0) if rec_direction else None,
        "criteria_checks": criteria_checks,
    }

    if not rec_direction:
        log_failure(suite, "Single Direction", "Failed to find explicit single recommended design direction")
    for crit, passed in criteria_checks.items():
        if not passed:
            log_failure(suite, f"Criterion: {crit}", f"Missing discussion of {crit}")

# ==========================================
# SUITE 2: NEGATIVE CONSTRAINT SCANNING
# ==========================================

def scan_negative_constraints():
    suite = "2.0 Negative Constraints"
    
    # 1. PII / Sensitive Identity patterns
    sensitive_patterns = [
        ("Aadhaar Number", r"\b[2-9]\d{3}\s\d{4}\s\d{4}\b"),
        ("PAN Card", r"\b[A-Z]{5}[0-9]{4}[A-Z]\b"),
        ("ICAI Membership Number", r"\b(?:ICAI\s*(?:M\.?No|Membership\s*No|MRN)|Membership\s*No\.?)[:\s]*(\d{5,6})\b"),
        ("Explicit Membership Number Value", r"\b(?:M\.?No\.?|Membership\s*#?)\s*[:=]?\s*\d{5,6}\b"),
        ("Unapproved FRN", r"\b(?:FRN|Firm\s*Registration\s*No\.?)[:\s]*(\d{6}[A-Z]|\d{5}[A-Z])\b"),
    ]

    # 2. Unapproved claims / Superlatives
    unapproved_claims = [
        ("100% Success Claim", r"\b100%\s*(?:success|guaranteed|pass|approval)\b"),
        ("Rank/Number 1 Claim", r"\b(?:#1|No\.?\s*1|Number\s*1)\s*(?:CA|Chartered Accountant|Accounting Firm)\b"),
        ("Best CA Claim", r"\b(?:Best|Leading|Top)\s*CA\s*firm\s*in\s*(?:Chennai|Tamil Nadu|India)\b"),
        ("Unapproved Client Metric", r"\b(?:5000\+|10000\+|500\+)\s*(?:happy\s*clients|satisfied\s*clients)\b"),
        ("Unapproved Staff Metric", r"\b(?:50\+|100\+|200\+)\s*(?:staff|employees|team members)\b"),
    ]

    # 3. Reintroduction of Tax Calculators or Knowledge Bank features
    forbidden_features = [
        ("Tax Calculator Tool", r"\b(?:interactive\s*tax\s*calculator|income\s*tax\s*calculator\s*tool|embed.*tax\s*calculator|public\s*tax\s*tools?)\b"),
        ("Knowledge Bank Reintroduction", r"\b(?:reintroduce\s*knowledge\s*bank|add\s*knowledge\s*bank|build\s*knowledge\s*bank|knowledge\s*bank\s*module)\b"),
    ]

    findings = []

    for name, path in DELIVERABLES.items():
        if not os.path.exists(path):
            continue
        with open(path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        for line_no, line in enumerate(lines, 1):
            # Check sensitive patterns
            for pat_name, pat in sensitive_patterns:
                m = re.search(pat, line, re.IGNORECASE)
                if m:
                    # Exclude benchmark firm registration details if explicitly noted as ASA/Batliboi's LLP/registration
                    # But verify if any relates to Kavitha & Associates
                    snippet = line.strip()[:100]
                    # Check if it mentions Kavitha
                    if "kavitha" in line.lower() or "partner" in line.lower() or "our firm" in line.lower() or "firmData" in line.lower():
                        findings.append((path, line_no, f"VIOLATION: {pat_name}", snippet))
                        log_failure(suite, pat_name, f"In {os.path.basename(path)}:{line_no}: {snippet}")
                    else:
                        # Log as warning to check context (e.g. competitor registration)
                        log_warning(suite, f"Potential {pat_name}", f"In {os.path.basename(path)}:{line_no}: {snippet}")

            # Check unapproved claims
            for claim_name, pat in unapproved_claims:
                m = re.search(pat, line, re.IGNORECASE)
                if m:
                    snippet = line.strip()[:100]
                    findings.append((path, line_no, f"VIOLATION: {claim_name}", snippet))
                    log_failure(suite, claim_name, f"In {os.path.basename(path)}:{line_no}: {snippet}")

            # Check forbidden features
            for feat_name, pat in forbidden_features:
                m = re.search(pat, line, re.IGNORECASE)
                if m:
                    # Check if it is a negative statement (e.g. "do not reintroduce tax calculator" or "zero tax calculators")
                    if re.search(r"\b(do not|zero|never|avoid|no|prohibited|rejected|omits?|exclude)\b", line, re.IGNORECASE):
                        continue # compliant mention
                    snippet = line.strip()[:100]
                    findings.append((path, line_no, f"VIOLATION: {feat_name}", snippet))
                    log_failure(suite, feat_name, f"In {os.path.basename(path)}:{line_no}: {snippet}")

    RESULTS["suite_2_negative_constraints"]["findings"] = findings

def scan_competitor_copied_assets():
    suite = "2.1 Competitor Copied Assets"
    # Check if any competitor logos or assets were copied into public/ or src/
    illicit_assets = []
    for target_dir in [os.path.join(WORKSPACE, "public"), os.path.join(WORKSPACE, "src")]:
        for root, _, files in os.walk(target_dir):
            for f in files:
                f_lower = f.lower()
                for comp in ["asa", "srbatliboi", "batliboi", "kkc", "singhico", "singhi", "walkerchandiok", "chandiok", "bdo", "carvi"]:
                    if comp in f_lower:
                        # Check if it's an old test file or competitor asset
                        full_path = os.path.join(root, f)
                        # We only flag if created/modified recently during V65
                        mtime = datetime.datetime.fromtimestamp(os.path.getmtime(full_path))
                        if mtime > datetime.datetime.fromisoformat("2026-11-06T18:15:11"):
                            illicit_assets.append((full_path, str(mtime)))
                            log_failure(suite, "Copied Competitor Asset", f"Found competitor asset in web directory: {full_path}")

    RESULTS["suite_2_negative_constraints"]["copied_assets"] = illicit_assets

def run_all_audits():
    audit_deliverable_files_existence()
    audit_reference_audit_completeness()
    audit_comparison_matrix_completeness()
    audit_colour_direction_proposals()
    audit_design_recommendation()
    scan_negative_constraints()
    scan_competitor_copied_assets()

    if not RESULTS["critical_failures"]:
        RESULTS["overall_verdict"] = "APPROVE"
    else:
        RESULTS["overall_verdict"] = "REQUEST_CHANGES"

    # Save results to challenger directory
    out_path = os.path.join(WORKSPACE, ".agents", "teamwork", "challenger_v65_2", "empirical_audit_results.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(RESULTS, f, indent=2)

    print("\n" + "="*70)
    print(f"CHALLENGER 2 EMPIRICAL AUDIT VERDICT: {RESULTS['overall_verdict']}")
    print(f"Critical Failures: {len(RESULTS['critical_failures'])}")
    print(f"Warnings: {len(RESULTS['warnings'])}")
    print("="*70)
    for cf in RESULTS["critical_failures"]:
        print("FAIL:", cf)
    for w in RESULTS["warnings"]:
        print("WARN:", w)

if __name__ == "__main__":
    run_all_audits()
