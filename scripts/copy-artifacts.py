import shutil, os

art_dir = r"C:\Users\k deswanth\.gemini\antigravity\brain\441eee2e-7fd3-42ce-bd96-eec34be60162"
src_dir = r"C:\kavatha ca\reports\final_visual_qa"

files = [
    "homepage_1440px.png",
    "homepage_390px.png",
    "working_process_1440px.png",
    "working_process_390px.png",
    "about_1440px.png",
    "about_390px.png",
    "services_1440px.png",
    "services_390px.png",
    "industries_1440px.png",
    "industries_390px.png",
    "locations_1440px.png",
    "locations_390px.png",
    "contact_1440px.png",
    "contact_390px.png",
]

for f in files:
    src = os.path.join(src_dir, f)
    dst = os.path.join(art_dir, f)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Copied {f} to artifacts ({os.path.getsize(dst)} bytes)")
    else:
        print(f"Not found: {src}")
