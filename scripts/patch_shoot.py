path = r'.agent/skills/motionsites-web-builder/scripts/shoot.py'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

old = '''        try:
            browser, engine = p.chromium.launch(channel="chrome"), "chrome"
        except Exception:
            browser, engine = p.chromium.launch(), "chromium (no H.264: MP4 videos will not play)"'''

new = '''        try:
            browser, engine = p.chromium.launch(channel="chrome"), "chrome"
        except Exception:
            try:
                browser, engine = p.chromium.launch(channel="msedge"), "msedge"
            except Exception:
                edge_bin = r"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
                if os.path.exists(edge_bin):
                    browser, engine = p.chromium.launch(executable_path=edge_bin), "msedge"
                else:
                    browser, engine = p.chromium.launch(), "chromium (no H.264: MP4 videos will not play)"'''

text_norm = text.replace('\r\n', '\n')
old_norm = old.replace('\r\n', '\n')
new_norm = new.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_norm)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text_norm)
    print("shoot.py updated to support msedge successfully!")
else:
    print("Pattern not found in shoot.py")
