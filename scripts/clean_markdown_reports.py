#!/usr/bin/env python3
"""
Clean all V6.7 markdown reports to align with final quality gate requirements:
1. Replace FCA with verified Chartered Accountant (CA, ICAI).
2. Attribute CMA AIR 49 strictly to CMA Intermediate (ICMAI).
3. Remove GPS coordinates and GPS verification claims.
4. Replace Partner Assurance, Preemptive Filing, and Big 4 Heritage with accurate descriptions.
5. Clarify partner portrait consent status.
"""

import glob

def clean_file(path):
    with open(path, encoding='utf-8') as f:
        t = f.read()

    # Replacements
    t = t.replace('CA Kavitha Vijay, B.Com, FCA, CMA (AIR 49)', 'CA Kavitha Vijay, B.Com, CA, CMA (AIR 49 in CMA Intermediate, ICMAI)')
    t = t.replace('CA Kavitha Vijay, B.Com, FCA, CMA', 'CA Kavitha Vijay, B.Com, CA, CMA (ICAI, ICMAI)')
    t = t.replace('CA Kavitha Vijay, FCA, CMA', 'CA Kavitha Vijay, CA, CMA')
    t = t.replace('CA Kavitha Vijay (FCA, CMA, AIR 49)', 'CA Kavitha Vijay (CA, CMA, AIR 49 in CMA Intermediate, ICMAI)')
    t = t.replace('Dual FCA & CMA', 'Dual CA & CMA')
    t = t.replace('dual FCA & CMA', 'dual CA & CMA')
    t = t.replace('dual FCA/CMA', 'dual CA/CMA')
    t = t.replace('FCA & CMA', 'CA & CMA')
    t = t.replace('FCA/ACA', 'CA (ICAI)')
    t = t.replace('Fellow Chartered Accountant (FCA, ICAI)', 'Chartered Accountant (CA, ICAI)')
    t = t.replace('Fellow Chartered Accountant (FCA)', 'Chartered Accountant (CA, ICAI)')
    t = t.replace('Fellow Chartered Accountant', 'Chartered Accountant')
    t = t.replace('FCA', 'CA')
    
    # GPS replacements
    t = t.replace('(GPS: 13°37\'09.3"N 79°25\'04.9"E — Verified via Client Coordinates)', '(Bairagi Patteda, Tirupati — Central Operating Chambers)')
    t = t.replace('GPS: 13°37\'09.3"N 79°25\'04.9"E', 'Bairagi Patteda, Tirupati — Central Chambers')
    t = t.replace('with verified GPS coordinates', 'with verified postal address')
    t = t.replace('GPS coordinates', 'postal chambers address')
    
    # Partner Assurance & Preemptive
    t = t.replace('Partner Assurance & Delivery', 'Partner Review & Technical Delivery')
    t = t.replace('Partner Assurance', 'Partner Review & Technical Delivery')
    t = t.replace('Pre-emptive compliance filing', 'Proactive regulatory compliance tracking')
    t = t.replace('Preemptive compliance filing', 'Proactive regulatory compliance tracking')
    t = t.replace('pre-emptive compliance filing', 'proactive regulatory compliance tracking')
    t = t.replace('Big 4 & Multinational Heritage', 'Big 4 & MNC Corporate Audit Experience')
    t = t.replace('Big 4 Heritage', 'Big 4 & MNC Experience')
    
    # Portrait Consent note
    t = t.replace('authentic portrait ca-kavitha-vijay.webp', 'authoritative partner credential frame (photo held pending client consent)')
    t = t.replace('`ca-kavitha-vijay.webp`', 'editorial partner crest placeholder (portrait held pending client consent)')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'Cleaned {path}')

if __name__ == '__main__':
    for r in glob.glob('V67_*.md'):
        clean_file(r)
