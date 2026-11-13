import http.server
import socketserver
import threading
import time
import os
import json
from playwright.sync_api import sync_playwright

PORT = 5187
DIST_DIR = os.path.abspath('dist')
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT_DIR = os.path.abspath('V70_REFERENCE_AND_QA_SCREENSHOTS')
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
    {"name": "compact_mobile_320", "width": 320, "height": 640, "is_mobile": True},
    {"name": "mobile_390", "width": 390, "height": 844, "is_mobile": True},
    {"name": "tablet_768", "width": 768, "height": 1024, "is_mobile": False},
    {"name": "laptop_1024", "width": 1024, "height": 768, "is_mobile": False},
    {"name": "desktop_1440", "width": 1440, "height": 900, "is_mobile": False},
    {"name": "wide_1920", "width": 1920, "height": 1080, "is_mobile": False}
]

PAGES = [
    {"route": "/", "name": "homepage"},
    {"route": "/about", "name": "about"},
    {"route": "/services", "name": "services"},
    {"route": "/blog", "name": "insights"},
    {"route": "/blog/statutory-audit-guidelines-2026", "name": "article"},
    {"route": "/contact", "name": "contact"}
]

QA_JS = """() => {
  const vw = document.documentElement.clientWidth;
  const wide = [...document.querySelectorAll('body *')].filter(e => {
    const r = e.getBoundingClientRect(); return r.right > vw + 1 && getComputedStyle(e).position !== 'fixed';
  }).slice(0, 5).map(e => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''));
  const imgs = [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(0, 90));
  return {
    title: document.title,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: vw,
    horizontalOverflow: document.documentElement.scrollWidth > vw + 1,
    overflowingElements: wide,
    pageHeight: document.documentElement.scrollHeight,
    brokenImages: imgs
  };
}"""

full_qa_results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=EDGE_PATH, headless=True)
    print("Launched Edge via Playwright for V70 QA.")

    for page_info in PAGES:
        p_name = page_info["name"]
        route = page_info["route"]
        full_qa_results[p_name] = {}

        for vp in VIEWPORTS:
            vp_name = vp["name"]
            w = vp["width"]
            h = vp["height"]
            is_mob = vp["is_mobile"]

            ctx = browser.new_context(
                viewport={"width": w, "height": h},
                is_mobile=is_mob,
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" if not is_mob else "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
            )
            page = ctx.new_page()
            url = f"http://localhost:{PORT}{route}"

            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

            try:
                page.goto(url, wait_until="networkidle", timeout=30000)
                time.sleep(1.5)

                metrics = page.evaluate(QA_JS)
                metrics["consoleErrors"] = console_errors

                filename = f"v70_{p_name}_{vp_name}.png"
                out_path = os.path.join(OUT_DIR, filename)
                page.screenshot(path=out_path)
                
                # Also copy to artifact dir
                art_path = os.path.join(ART_DIR, filename)
                import shutil
                shutil.copy2(out_path, art_path)

                full_qa_results[p_name][vp_name] = {
                    "width": w,
                    "height": h,
                    "scrollWidth": metrics["scrollWidth"],
                    "horizontalOverflow": metrics["horizontalOverflow"],
                    "brokenImagesCount": len(metrics["brokenImages"]),
                    "consoleErrorsCount": len(console_errors),
                    "file": filename
                }

                print(f"[{p_name} @ {vp_name}] Overflow: {metrics['horizontalOverflow']}, Errors: {len(console_errors)}, Saved: {filename}")

            except Exception as e:
                print(f"Error on {p_name} @ {vp_name}: {e}")
                full_qa_results[p_name][vp_name] = {"error": str(e)}

            finally:
                ctx.close()

    browser.close()

qa_json_path = os.path.join(OUT_DIR, "v70_qa_report.json")
with open(qa_json_path, "w", encoding="utf-8") as f:
    json.dump(full_qa_results, f, indent=2)

print(f"Full QA results written to {qa_json_path}")
