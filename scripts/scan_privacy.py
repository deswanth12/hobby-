import os

target = '252' + '985'
paths_to_check = [
    'src',
    'public',
    'content',
    'data',
    'V67_CLIENT_CONCEPT_STUDIO',
    'scripts'
]

matches = []

for base in paths_to_check:
    for root, dirs, files in os.walk(base):
        for f in files:
            p = os.path.join(root, f)
            try:
                with open(p, 'rb') as fp:
                    if target.encode('utf-8') in fp.read():
                        matches.append(p)
            except:
                pass

print("Scan results in core folders. Matches found:", len(matches))
for m in matches:
    print("  ", m)
