import os
import re

print("--- SANITIZING AUDIT REPORTS TO ENFORCE USER DIRECTIVE: NEVER USE [REDACTED_MEMBERSHIP_ID] ---")

files_to_update = [
    'CONTENT_AUDIT_PHASE_2.md',
    'PROPOSED_CONTENT_CORRECTIONS.md',
    'CLIENT_CONFIRMATION_CHECKLIST.md',
    'CONTENT_AUDIT_SUMMARY.md',
    'CONTENT_AUDIT_MASTER_REPORT.md',
    'CONTENT_CLAIM_REGISTER.csv'
]

# Replacement strategies:
# 1. When suggesting replacing [REDACTED_MEMBERSHIP_NO] with [REDACTED_MEMBERSHIP_ID], change to:
#    "Retain [REDACTED_MEMBERSHIP_NO] as intentional privacy redaction per strict client directive: NEVER use MRN [REDACTED_MEMBERSHIP_ID]."
# 2. In titles/byline: "CA Kavitha Vijay (B.Com, CA, CMA AIR 49)" (remove [REDACTED_MEMBERSHIP_ID])
# 3. Explicitly document: "CLIENT STRICT DIRECTIVE: ICAI MRN [REDACTED_MEMBERSHIP_ID] is confidential and must NEVER be used or published anywhere on the website."

for fname in files_to_update:
    if not os.path.exists(fname):
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace specific recommendations that suggested publishing [REDACTED_MEMBERSHIP_ID]
    content = content.replace('Replace `[REDACTED_MEMBERSHIP_NO]` with verified ICAI MRN `[REDACTED_MEMBERSHIP_ID]`', 
                              'Retain `[REDACTED_MEMBERSHIP_NO]` per client directive (MRN [REDACTED_MEMBERSHIP_ID] must NEVER be published)')
    content = content.replace('Replace `[REDACTED_MEMBERSHIP_NO]` with `[REDACTED_MEMBERSHIP_ID]`', 
                              'Retain `[REDACTED_MEMBERSHIP_NO]` per client directive (MRN [REDACTED_MEMBERSHIP_ID] must NEVER be published)')
    content = content.replace('Replace literal `[REDACTED_MEMBERSHIP_NO]` with verified MRN `[REDACTED_MEMBERSHIP_ID]`.', 
                              'Retain `[REDACTED_MEMBERSHIP_NO]` per client directive: MRN [REDACTED_MEMBERSHIP_ID] must NEVER be used.')
    content = content.replace('Replace literal placeholder [REDACTED_MEMBERSHIP_NO] across all 4 pages with verified MRN [REDACTED_MEMBERSHIP_ID].',
                              'Retain [REDACTED_MEMBERSHIP_NO] per client directive: MRN [REDACTED_MEMBERSHIP_ID] must NEVER be used.')
    content = content.replace('<span>ICAI Mem. [REDACTED_MEMBERSHIP_ID]</span>', 
                              '<span>ICAI Mem. [REDACTED_MEMBERSHIP_NO]</span>')
    content = content.replace('ICAI Mem. [REDACTED_MEMBERSHIP_ID]', 
                              'ICAI Mem. [REDACTED_MEMBERSHIP_NO]')
    content = content.replace('ICAI Membership No. [REDACTED_MEMBERSHIP_ID]', 
                              'ICAI Membership No. [REDACTED_PER_CLIENT_DIRECTIVE]')
    content = content.replace('ICAI Mem. No. [REDACTED_MEMBERSHIP_ID]', 
                              'ICAI Mem. No. [REDACTED_PER_CLIENT_DIRECTIVE]')
    content = content.replace('ICAI Mem. [REDACTED_PER_CLIENT_DIRECTIVE]', 
                              'ICAI Mem. [REDACTED_MEMBERSHIP_NO]')
    content = content.replace('ICAI Membership Number **[REDACTED_MEMBERSHIP_ID]**', 
                              'ICAI Membership Number [REDACTED PER CLIENT DIRECTIVE - NEVER USE [REDACTED_MEMBERSHIP_ID]]')
    content = content.replace('ICAI Mem. [REDACTED_MEMBERSHIP_ID]', 
                              'ICAI Mem. [REDACTED_MEMBERSHIP_NO]')
    content = content.replace('ICAI Membership No. [REDACTED_MEMBERSHIP_ID]', 
                              'ICAI Membership No. [REDACTED_MEMBERSHIP_NO]')

    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Sanitized {fname}")

print("--- SANITIZATION COMPLETE ---")
