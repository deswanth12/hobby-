import os, glob

target = '252' + '985'
artifact_dir = r"C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151"

search_patterns = [
    '*.md',
    '*.txt',
    'V67_CLIENT_CONCEPT_STUDIO/*.html',
    'scripts/*.py',
    os.path.join(artifact_dir, '*.md'),
    os.path.join(artifact_dir, '*.txt')
]

found_files = []

for pat in search_patterns:
    for f in glob.glob(pat):
        try:
            with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
                if target in content:
                    found_files.append(f)
        except Exception as e:
            pass

print("Files containing restricted identifier:", len(found_files))
for f in found_files:
    print("  ", f)

# Now redact the target from each found file (excluding binary PDFs which are raw user inputs)
for f in found_files:
    if f.endswith('.md') or f.endswith('.txt') or f.endswith('.html') or f.endswith('.py'):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            c = fp.read()
        c = c.replace(target, '[REDACTED_MEMBERSHIP_ID]')
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(c)
        print("  Redacted target from:", f)
