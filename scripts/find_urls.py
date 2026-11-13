import os, re

files = [
    'Kavitha_Associates_Client_Meeting_Notes.docx',
    'Kavitha_Associates_Website_Proposal_Client.docx',
    'firm_profile_text.txt',
    'cv_text.txt',
    'V65_CA_WEBSITE_REFERENCE_AUDIT.md'
]

for f in files:
    if os.path.exists(f):
        with open(f, 'rb') as fp:
            cnt = fp.read().decode('utf-8', errors='ignore')
            urls = re.findall(r'https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s<>"\']*', cnt)
            print(f, 'URLs found:', len(set(urls)))
            for u in sorted(set(urls))[:10]:
                print('  ', u)
