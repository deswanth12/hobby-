import http.server
import socketserver
import threading
import subprocess
import time
import os
import shutil

PORT = 5183
DIST_DIR = os.path.abspath('dist')
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT_DIR = os.path.abspath('reports/screenshots/v68')
os.makedirs(OUT_DIR, exist_ok=True)

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        req_path = self.path.split('?')[0].split('#')[0]
        local_path = os.path.join(DIST_DIR, req_path.lstrip('/'))
        if not os.path.exists(local_path) or os.path.isdir(local_path):
            self.path = '/index.html'
        return super().do_GET()

def run_server():
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        httpd.serve_forever()

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()
time.sleep(1)

print(f"SPA Server running on port {PORT} from {DIST_DIR}")

targets = [
    {
        "url": f"http://localhost:{PORT}/blog",
        "name": "v68_blog_listing_desktop",
        "width": 1440,
        "height": 1800,
        "device": "desktop"
    },
    {
        "url": f"http://localhost:{PORT}/blog",
        "name": "v68_blog_listing_mobile",
        "width": 390,
        "height": 2200,
        "device": "mobile"
    },
    {
        "url": f"http://localhost:{PORT}/blog/statutory-audit-guidelines-2026",
        "name": "v68_blog_article_statutory_desktop",
        "width": 1440,
        "height": 2400,
        "device": "desktop"
    },
    {
        "url": f"http://localhost:{PORT}/blog/statutory-audit-guidelines-2026",
        "name": "v68_blog_article_statutory_mobile",
        "width": 390,
        "height": 3000,
        "device": "mobile"
    },
    {
        "url": f"http://localhost:{PORT}/blog/corporate-tax-planning-2026",
        "name": "v68_blog_article_tax_desktop",
        "width": 1440,
        "height": 2400,
        "device": "desktop"
    },
    {
        "url": f"http://localhost:{PORT}/blog/corporate-tax-planning-2026",
        "name": "v68_blog_article_tax_mobile",
        "width": 390,
        "height": 3000,
        "device": "mobile"
    }
]

for t in targets:
    out_file = os.path.join(OUT_DIR, f"{t['name']}.png")
    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size={t['width']},{t['height']}",
        f"--screenshot={out_file}",
        t["url"]
    ]
    print(f"Capturing {t['name']} ({t['width']}x{t['height']})...")
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=30)
    if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
        print(f"  [SUCCESS] {t['name']}.png saved ({os.path.getsize(out_file)} bytes)")
    else:
        print(f"  [FAILED] {t['name']}.png failed to generate")

print("\nScreenshot generation complete.")
