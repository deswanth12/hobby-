import http.server
import socketserver
import threading
import time
import os
import json
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

PORT = 5185
DIST_DIR = os.path.abspath('dist')
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT_DIR = os.path.abspath('reports/screenshots/v68_motionsites')
ART_DIR = r"C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151"

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(ART_DIR, exist_ok=True)

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

print(f"Local SPA server running on http://localhost:{PORT}")

VIEWPORTS = [
    {"name": "mobile", "width": 390, "height": 844, "is_mobile": True},
    {"name": "tablet", "width": 768, "height": 1024, "is_mobile": False},
    {"name": "laptop", "width": 1024, "height": 768, "is_mobile": False},
    {"name": "desktop", "width": 1440, "height": 900, "is_mobile": False}
]

PAGES = [
    {"route": "/blog", "slug": "blog_listing"},
    {"route": "/blog/statutory-audit-guidelines-2026", "slug": "blog_article_statutory"},
    {"route": "/", "slug": "homepage"}
]

QA_JS = """() => {
  const vw = document.documentElement.clientWidth;
  const wide = [...document.querySelectorAll('body *')].filter(e => {
    const r = e.getBoundingClientRect(); return r.right > vw + 1 && getComputedStyle(e).position !== 'fixed';
  }).slice(0, 5).map(e => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''));
  const vids = [...document.querySelectorAll('video')].map(v => ({src: (v.currentSrc || v.src || '').slice(0, 90), ready: v.readyState, paused: v.paused, error: v.error ? v.error.code : null}));
  const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(0, 90));
  const fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replace(/"/g, ''));
  const h1 = document.querySelector('h1');
  return {
    title: document.title,
    scrollWidth: document.documentElement.scrollWidth, viewport: vw,
    horizontalOverflow: document.documentElement.scrollWidth > vw + 1, overflowingElements: wide,
    pageHeight: document.documentElement.scrollHeight,
    videos: vids, brokenImages: imgs, fontsLoaded: [...new Set(fonts)],
    h1: h1 ? {text: h1.innerText.slice(0, 80), fontSize: getComputedStyle(h1).fontSize, font: getComputedStyle(h1).fontFamily.slice(0, 40)} : null,
  };
}"""

full_qa_results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=EDGE_PATH)
    print("Launched Edge via Playwright.")

    for page_info in PAGES:
        page_slug = page_info["slug"]
        full_qa_results[page_slug] = {}
        target_url = f"http://localhost:{PORT}{page_info['route']}"

        for vp in VIEWPORTS:
            vp_name = vp["name"]
            shot_name = f"{page_slug}_{vp_name}_{vp['width']}px"
            out_file = os.path.join(OUT_DIR, f"{shot_name}.png")
            art_file = os.path.join(ART_DIR, f"{shot_name}.png")

            ctx = browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                device_scale_factor=1,
                is_mobile=vp["is_mobile"],
                has_touch=vp["is_mobile"]
            )
            page = ctx.new_page()

            errors, failed = [], []
            page.on("console", lambda m: errors.append(m.text[:200]) if m.type == "error" else None)
            page.on("pageerror", lambda e: errors.append(str(e)[:200]))
            page.on("requestfailed", lambda r: failed.append(f"{r.url[:100]} ({r.failure})"))
            page.on("response", lambda r: failed.append(f"{r.url[:100]} (HTTP {r.status})") if r.status >= 400 else None)

            page.goto(target_url, wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(1000)

            # Capture viewport screenshot
            page.screenshot(path=out_file)
            shutil.copy2(out_file, art_file)

            qa_data = page.evaluate(QA_JS)
            qa_data["consoleErrors"] = errors[:5]
            qa_data["failedRequests"] = [f for f in failed if "ERR_ABORTED" not in f][:5]
            full_qa_results[page_slug][vp_name] = qa_data

            print(f"Captured {shot_name}.png ({os.path.getsize(out_file)} bytes) | Overflow: {qa_data['horizontalOverflow']} | Broken Imgs: {len(qa_data['brokenImages'])}")
            ctx.close()

    browser.close()

# Save QA report json
report_path = os.path.join(OUT_DIR, "motionsites_qa_report.json")
with open(report_path, "w", encoding="utf-8") as f:
    json.dump(full_qa_results, f, indent=2)

print("\nAll 12 multi-device screenshots captured and QA analyzed successfully.")
