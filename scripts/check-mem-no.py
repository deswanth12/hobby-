with open('src/pages/AuditAssurancePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print("[REDACTED_MEMBERSHIP_NO] in AuditAssurancePage:", "[REDACTED_MEMBERSHIP_NO]" in text)

with open('src/pages/LocationsPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

print("[REDACTED_MEMBERSHIP_NO] in LocationsPage:", "[REDACTED_MEMBERSHIP_NO]" in text)
