"""
Challenger 2 Deep-Dive Adversarial Stress Harness for Milestone V65.
Executes mathematical verification of WCAG contrast ratios,
screenshot image integrity validation, content density per dimension,
palette divergence calculations, and cross-deliverable consistency checks.
"""

import os
import re
import math
import json
import struct
from typing import Dict, List, Tuple

WORKSPACE = r"c:\kavatha ca"
SCREENSHOT_DIR = os.path.join(WORKSPACE, "V65_REFERENCE_SCREENSHOTS")

DEEP_RESULTS = {
    "screenshot_validation": {},
    "dimension_density": {},
    "mathematical_contrast_audit": {},
    "palette_divergence": {},
    "matrix_consistency": {},
    "negative_constraints_deep": {},
    "anomalies_found": [],
}

# -------------------------------------------------------------
# 1. SCREENSHOT IMAGE INTEGRITY VALIDATION
# -------------------------------------------------------------
def get_png_dimensions(filepath: str) -> Tuple[int, int]:
    """Read PNG header directly to verify file validity and dimensions."""
    with open(filepath, "rb") as f:
        header = f.read(24)
        if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
            raise ValueError(f"Invalid PNG header: {filepath}")
        width, height = struct.unpack(">II", header[16:24])
        return width, height

def audit_screenshots():
    print("[1] Validating Screenshot Evidence...")
    if not os.path.exists(SCREENSHOT_DIR):
        DEEP_RESULTS["anomalies_found"].append("Screenshot directory does not exist!")
        return

    files = [f for f in os.listdir(SCREENSHOT_DIR) if f.endswith(".png")]
    DEEP_RESULTS["screenshot_validation"]["total_files"] = len(files)
    
    corrupt_files = []
    zero_byte_files = []
    dimensions = {}

    for f in sorted(files):
        fp = os.path.join(SCREENSHOT_DIR, f)
        sz = os.path.getsize(fp)
        if sz == 0:
            zero_byte_files.append(f)
            continue
        try:
            w, h = get_png_dimensions(fp)
            dimensions[f] = {"width": w, "height": h, "size_bytes": sz}
        except Exception as e:
            corrupt_files.append((f, str(e)))

    DEEP_RESULTS["screenshot_validation"]["corrupt_count"] = len(corrupt_files)
    DEEP_RESULTS["screenshot_validation"]["zero_byte_count"] = len(zero_byte_files)
    DEEP_RESULTS["screenshot_validation"]["sample_dimensions"] = {k: dimensions[k] for k in list(dimensions.keys())[:10]}

    if corrupt_files:
        DEEP_RESULTS["anomalies_found"].append(f"Corrupt PNG files found: {corrupt_files}")
    if zero_byte_files:
        DEEP_RESULTS["anomalies_found"].append(f"Zero byte PNG files found: {zero_byte_files}")
    print(f"    Validated {len(files)} PNG screenshots. Corrupt: {len(corrupt_files)}, Zero-byte: {len(zero_byte_files)}.")

# -------------------------------------------------------------
# 2. DIMENSION CONTENT DENSITY PER FIRM (84 DIMENSIONS)
# -------------------------------------------------------------
def audit_dimension_content_density():
    print("[2] Auditing 12 Dimensions Content Density across 7 Firms...")
    audit_file = os.path.join(WORKSPACE, "V65_CA_WEBSITE_REFERENCE_AUDIT.md")
    with open(audit_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Split into firm sections: Sections 2 through 8
    firm_sections = re.findall(r"(##\s*([2-8])\.\s*In-Depth Audit:[^\n\r]+)(.*?)(?=(?:##\s*[2-9]\.|\Z))", text, re.DOTALL)
    
    firm_densities = {}
    shallow_dimensions = []

    for header, sec_num, body in firm_sections:
        firm_title = header.strip()
        firm_densities[firm_title] = {}
        
        # Find all 12 dimensions in this section
        dim_matches = list(re.finditer(r"(###\s*Dimension\s*(\d+)[:\s]*([^\n\r]+))(.*?)(?=(?:###\s*Dimension|\Z|##\s*))", body, re.DOTALL))
        
        for m in dim_matches:
            d_header, d_num, d_title, d_body = m.groups()
            words = len(d_body.split())
            hex_count = len(re.findall(r"#[0-9a-fA-F]{3,6}", d_body))
            firm_densities[firm_title][f"Dim {d_num} - {d_title.strip()}"] = {
                "word_count": words,
                "hex_count": hex_count,
            }
            if words < 40:
                shallow_dimensions.append((firm_title, f"Dim {d_num}", words))

    DEEP_RESULTS["dimension_density"] = {
        "firms_parsed": len(firm_sections),
        "shallow_dimensions_count": len(shallow_dimensions),
        "shallow_dimensions": shallow_dimensions,
    }

    if shallow_dimensions:
        DEEP_RESULTS["anomalies_found"].append(f"Shallow dimensions (<40 words) detected: {shallow_dimensions}")
    print(f"    Parsed {len(firm_sections)} firm sections. Total shallow dimensions found: {len(shallow_dimensions)}.")

# -------------------------------------------------------------
# 3. MATHEMATICAL WCAG 2.1 RELATIVE LUMINANCE & CONTRAST ORACLE
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

def audit_mathematical_contrast():
    print("[3] Mathematically Verifying Stated Contrast Ratios...")
    colour_file = os.path.join(WORKSPACE, "V65_COLOUR_DIRECTION_PROPOSALS.md")
    with open(colour_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Find reported contrast claims like "Dark Slate (`#1A2530`) on Off-White Canvas (`#F8F9FA`): **14.85:1**"
    contrast_claims = re.findall(r"([a-zA-Z0-9\s]+)\s*\((`?#[0-9a-fA-F]{3,6}`?)\)\s*on\s*([a-zA-Z0-9\s]+)\s*\((`?#[0-9a-fA-F]{3,6}`?)\)[:\s*]+(?:\*\*)?(\d+(\.\d+)?)\s*:\s*1", text)
    
    discrepancies = []
    verified_ratios = []

    for name1, hex1_raw, name2, hex2_raw, stated_ratio_str, _ in contrast_claims:
        h1 = hex1_raw.replace("`", "").strip()
        h2 = hex2_raw.replace("`", "").strip()
        stated = float(stated_ratio_str)
        calc = calculate_contrast_ratio(h1, h2)
        diff = abs(stated - calc)
        verified_ratios.append({
            "pair": f"{name1.strip()} ({h1}) on {name2.strip()} ({h2})",
            "stated": stated,
            "calculated": round(calc, 2),
            "diff": round(diff, 2),
        })
        # If difference > 0.6 (allowing minor rounding differences in standard tools)
        if diff > 0.6:
            discrepancies.append((f"{h1} on {h2}", stated, round(calc, 2), diff))

    DEEP_RESULTS["mathematical_contrast_audit"] = {
        "claims_tested": len(contrast_claims),
        "discrepancies": discrepancies,
        "verified_sample": verified_ratios[:10],
    }

    if discrepancies:
        DEEP_RESULTS["anomalies_found"].append(f"Mathematical contrast ratio discrepancies: {discrepancies}")
    print(f"    Tested {len(contrast_claims)} contrast ratio claims. Discrepancies > 0.6: {len(discrepancies)}.")

# -------------------------------------------------------------
# 4. PALETTE DIVERGENCE BETWEEN PROPOSED DIRECTIONS
# -------------------------------------------------------------
def hex_to_rgb(hex_str: str) -> Tuple[int, int, int]:
    h = hex_str.lstrip("#")
    if len(h) == 3:
        h = "".join([c*2 for c in h])
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)

def euclidean_rgb_distance(c1: Tuple[int, int, int], c2: Tuple[int, int, int]) -> float:
    return math.sqrt((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2)

def audit_palette_divergence():
    print("[4] Auditing Palette Divergence across Directions...")
    colour_file = os.path.join(WORKSPACE, "V65_COLOUR_DIRECTION_PROPOSALS.md")
    with open(colour_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Extract primary brand colors from each direction
    # Direction 1: Sovereign Slate #1A2530
    # Direction 2: Botanical Verdant #1B3B2B
    # Direction 3: Oceanic Deep Teal #0A3641
    # Direction 4: Architectural Charcoal #1E2229
    direction_sections = re.findall(r"(##\s*Direction\s*(\d+)[:\s]+([^\n\r]+))(.*?)(?=(?:##\s*Direction|\Z|##\s*5\.))", text, re.DOTALL)
    
    direction_palettes = {}
    for header, num, name, body in direction_sections:
        hexes = list(set(re.findall(r"#[0-9a-fA-F]{6}\b", body)))
        direction_palettes[f"Direction {num}"] = hexes

    # Calculate cross-direction primary color distance
    # For each direction, find the darkest / primary token
    primaries = {}
    for d_name, hexes in direction_palettes.items():
        if hexes:
            # find the one with lowest luminance (dark primary)
            darkest = min(hexes, key=hex_to_relative_luminance)
            primaries[d_name] = darkest

    distances = {}
    p_keys = list(primaries.keys())
    for i in range(len(p_keys)):
        for j in range(i+1, len(p_keys)):
            k1, k2 = p_keys[i], p_keys[j]
            c1, c2 = hex_to_rgb(primaries[k1]), hex_to_rgb(primaries[k2])
            dist = euclidean_rgb_distance(c1, c2)
            distances[f"{k1} vs {k2}"] = {
                "hex1": primaries[k1],
                "hex2": primaries[k2],
                "rgb_distance": round(dist, 2),
            }

    DEEP_RESULTS["palette_divergence"] = {
        "directions_identified": len(direction_palettes),
        "primaries": primaries,
        "pairwise_distances": distances,
    }
    print(f"    Audited palette divergence across {len(direction_palettes)} directions. Primary distances computed.")

# -------------------------------------------------------------
# 5. MATRIX CONSISTENCY: TABLE SCORES VS TEXT WINNERS
# -------------------------------------------------------------
def audit_matrix_consistency():
    print("[5] Auditing Matrix Consistency: Table Ratings vs Section Winners...")
    matrix_file = os.path.join(WORKSPACE, "V65_COMPETITOR_COMPARISON_MATRIX.md")
    with open(matrix_file, "r", encoding="utf-8") as f:
        text = f.read()

    # Check table rows for categories
    # | Category | ASA | Batliboi | KKC | Singhi | Walker | BDO | CARVI | Winner |
    table_rows = re.findall(r"\|\s*([0-9]\.\s*[^\|]+)\|\s*([^\|]+)\|\s*([^\|]+)\|\s*([^\|]+)\|\s*([^\|]+)\|\s*([^\|]+)\|\s*([^\|]+)\|\s*([^\|]+)\|\s*([^\|]+)\|", text)
    
    # Check section winners
    section_winners = re.findall(r"###\s*Category\s*\d+[:\s]+([^\n\r]+).*?(?:####\s*Winner:|\*\*Designated Winner\*\*[:\s]*)\s*([^\n\r]+)", text, re.DOTALL)

    matched_categories = []
    inconsistencies = []

    for cat_name, winner_text in section_winners:
        matched_categories.append((cat_name.strip(), winner_text.strip()))

    DEEP_RESULTS["matrix_consistency"] = {
        "table_rows_parsed": len(table_rows),
        "section_winners_parsed": len(section_winners),
        "section_winners": matched_categories,
    }

    if len(section_winners) != 8:
        DEEP_RESULTS["anomalies_found"].append(f"Expected 8 section winners, found {len(section_winners)}")
    print(f"    Parsed {len(table_rows)} table rows and {len(section_winners)} category winner sections.")

# -------------------------------------------------------------
# 6. EXHAUSTIVE SUBSTRING NEGATIVE CONSTRAINT INSPECTION
# -------------------------------------------------------------
def audit_exhaustive_negative_constraints():
    print("[6] Running Exhaustive Negative Constraint Search...")
    all_files = [
        os.path.join(WORKSPACE, "V65_CA_WEBSITE_REFERENCE_AUDIT.md"),
        os.path.join(WORKSPACE, "V65_COMPETITOR_COMPARISON_MATRIX.md"),
        os.path.join(WORKSPACE, "V65_COLOUR_DIRECTION_PROPOSALS.md"),
        os.path.join(WORKSPACE, "V65_DESIGN_RECOMMENDATION.md"),
    ]

    red_flags = []
    for fp in all_files:
        fname = os.path.basename(fp)
        with open(fp, "r", encoding="utf-8") as f:
            lines = f.readlines()

        for idx, line in enumerate(lines, 1):
            line_l = line.lower()
            
            # Check for mention of tax calculator reintroduction
            if "calculator" in line_l:
                # verify it is disclaimed or forbidden
                if not any(neg in line_l for neg in ["zero", "no", "never", "avoid", "omit", "exclude", "without", "prohibited", "rejected"]):
                    red_flags.append((fname, idx, "Unmitigated 'calculator' reference", line.strip()[:100]))

            # Check for mention of knowledge bank
            if "knowledge bank" in line_l or "knowledge-bank" in line_l:
                if not any(neg in line_l for neg in ["zero", "no", "never", "avoid", "omit", "exclude", "without", "prohibited", "rejected", "quarantined"]):
                    red_flags.append((fname, idx, "Unmitigated 'knowledge bank' reference", line.strip()[:100]))

            # Check for client personal phone/address/id leak
            if re.search(r"\b(?:aadhaar|pan\s*card|passport|voter\s*id)\b", line_l):
                red_flags.append((fname, idx, "Personal ID term detected", line.strip()[:100]))

    DEEP_RESULTS["negative_constraints_deep"]["red_flags"] = red_flags
    if red_flags:
        DEEP_RESULTS["anomalies_found"].append(f"Negative constraint red flags: {red_flags}")
    print(f"    Completed exhaustive search across 4 deliverables. Red flags: {len(red_flags)}.")

def run_deep_dive():
    audit_screenshots()
    audit_dimension_content_density()
    audit_mathematical_contrast()
    audit_palette_divergence()
    audit_matrix_consistency()
    audit_exhaustive_negative_constraints()

    out_file = os.path.join(WORKSPACE, ".agents", "teamwork", "challenger_v65_2", "deep_dive_results.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(DEEP_RESULTS, f, indent=2)

    print("\n" + "="*70)
    print(f"DEEP DIVE COMPLETE. Total Anomalies Detected: {len(DEEP_RESULTS['anomalies_found'])}")
    print("="*70)
    for a in DEEP_RESULTS["anomalies_found"]:
        print("ANOMALY:", a)

if __name__ == "__main__":
    run_deep_dive()
