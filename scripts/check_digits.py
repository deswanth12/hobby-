import glob, re

for f in glob.glob('V67_CLIENT_CONCEPT_STUDIO/*.html'):
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
        # Find 6 digit numbers
        six_digits = re.findall(r'\b\d{6}\b', c)
        print(f, "6-digit numbers found:", set(six_digits))
