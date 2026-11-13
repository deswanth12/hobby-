import sys

checklist_additions = """
---

### Item 11: Authorization to Replace Raw Placeholder [REDACTED_MEMBERSHIP_NO]
- [ ] **Current Website Finding**: Lines across `AboutPage.tsx:449`, `AuditAssurancePage.tsx:117, 284`, and `LocationsPage.tsx:118` display the literal text token `[REDACTED_MEMBERSHIP_NO]`.
- [ ] **Regulatory Context**: Legitimate practicing CAs are required by ICAI to clearly state their verified Membership Number on public stationery and digital profiles.
- [ ] **Client Action Required**:
  - ( ) **APPROVED**: Replace `[REDACTED_MEMBERSHIP_NO]` with my verified ICAI Membership Number **[REDACTED_MEMBERSHIP_ID]** across all pages.

---

### Item 12: Authorization to Expunge Absolute Commercial Guarantees
- [ ] **Current Website Finding**:
  1. `CompanyRegistrationPage.tsx:235` states: *"Guaranteed ROC Compliance"*.
  2. `GSTServicesPage.tsx:236` states: *"Zero Late Fee Guarantee"*.
- [ ] **Regulatory Context**: Under ICAI professional standards and general commercial law, offering unconditional compliance guarantees or zero penalty warranties creates civil liability and violates professional independence.
- [ ] **Client Action Required**:
  - ( ) **APPROVED**: Replace *"Guaranteed ROC Compliance"* with *"Diligent Annual ROC Secretarial Compliance"*, and replace *"Zero Late Fee Guarantee"* with *"Scheduled GST Compliance & Penalty Mitigation"*.

---

### Item 13: Confirmation of Standard Chambers Operating Hours
- [ ] **Current Website Finding**: Three files list divergent operating hours:
  - `ContactPage.tsx`: Monday – Saturday: 9:30 AM – 6:30 PM IST
  - `contact.json`: Mon-Fri: 9:30 AM – 6:30 PM, Sat: 10:00 AM – 2:00 PM
  - `practice_db.json`: Mon - Sat: 9:30 AM - 7:30 PM
- [ ] **Client Action Required**: Please confirm official chambers hours for harmonization:
  - ( ) **Option A (Recommended)**: Monday – Saturday: 9:30 AM – 6:30 PM IST | Sunday: Closed
  - ( ) **Option B**: Monday – Friday: 9:30 AM – 6:30 PM | Saturday: 10:00 AM – 2:00 PM | Sunday: Closed
  - ( ) **Option C**: Other: __________________________________________________
"""

with open('CLIENT_CONFIRMATION_CHECKLIST.md', 'r', encoding='utf-8') as f:
    text = f.read()

if 'Item 11' not in text:
    with open('CLIENT_CONFIRMATION_CHECKLIST.md', 'a', encoding='utf-8') as f:
        f.write(checklist_additions)
    print("Appended Items 11-13 to CLIENT_CONFIRMATION_CHECKLIST.md")
else:
    print("CLIENT_CONFIRMATION_CHECKLIST.md already contains Item 11")
