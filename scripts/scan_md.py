import os, glob

target = '252' + '985'
artifact_dir = r"C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151"

md_files = glob.glob("*.md") + glob.glob(os.path.join(artifact_dir, "*.md"))

matches = []
for f in md_files:
    try:
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            if target in fp.read():
                matches.append(f)
    except:
        pass

print("Markdown scan. Matches found:", len(matches))
for m in matches:
    print("  ", m)
