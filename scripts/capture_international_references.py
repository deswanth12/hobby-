import os
import sys
import time
from playwright.sync_api import sync_playwright

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
OUT_DIR = r"c:\kavatha ca\V70_REFERENCE_AND_QA_SCREENSHOTS"

TARGETS = [
    {
        "name": "07_grant_thornton",
        "url": "https://www.grantthornton.global/en/",
    },
    {
        "name": "08_crowe_global",
        "url": "https://www.crowe.com/global/",
    },
    {
        "name": "09_rsm_global",
        "url": "https://www.rsmus.com/",
    }
]

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=EDGE_PATH, headless=True)
        print("Launched Edge for International References capture...")
        
        for t in TARGETS:
            name = t["name"]
            url = t["url"]
            print(f"--- Fetching {name}: {url} ---")
            
            # Desktop 1440x900
            try:
                ctx_d = browser.new_context(
                    viewport={"width": 1440, "height": 900},
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                )
                page_d = ctx_d.new_page()
                page_d.goto(url, wait_until="domcontentloaded", timeout=45000)
                time.sleep(3)
                d_path = os.path.join(OUT_DIR, f"{name}_desktop_1440px.png")
                page_d.screenshot(path=d_path)
                print(f"Saved: {d_path}")
                ctx_d.close()
            except Exception as e:
                print(f"Error desktop for {name}: {e}")
                
            # Mobile 390x844
            try:
                ctx_m = browser.new_context(
                    viewport={"width": 390, "height": 844},
                    is_mobile=True,
                    user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1"
                )
                page_m = ctx_m.new_page()
                page_m.goto(url, wait_until="domcontentloaded", timeout=45000)
                time.sleep(3)
                m_path = os.path.join(OUT_DIR, f"{name}_mobile_390px.png")
                page_m.screenshot(path=m_path)
                print(f"Saved: {m_path}")
                ctx_m.close()
            except Exception as e:
                print(f"Error mobile for {name}: {e}")
                
        browser.close()
    print("Done international reference captures.")

if __name__ == "__main__":
    main()
