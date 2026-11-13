import os, glob

pages_dir = 'src/pages'
components_dir = 'src/components'

findings = []

for base in [pages_dir, components_dir]:
    for root, dirs, files in os.walk(base):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                p = os.path.join(root, f)
                with open(p, encoding='utf-8', errors='ignore') as fp:
                    c = fp.read()
                    if 'REDACTED' in c:
                        findings.append((p, 'Contains REDACTED token'))
                    if 'FCA' in c:
                        findings.append((p, 'Contains FCA reference'))
                    if 'href="#"' in c:
                        findings.append((p, 'Contains empty href="#"'))

print(f"Total findings: {len(findings)}")
for p, f in findings:
    print(f"  {p}: {f}")
