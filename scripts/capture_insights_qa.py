import asyncio, os
from playwright.async_api import async_playwright

artifact_dir = r"C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151"
qa_dir = "V70_REFERENCE_AND_QA_SCREENSHOTS"
os.makedirs(qa_dir, exist_ok=True)

viewports = [
    {"name": "desktop_1440", "width": 1440, "height": 900},
    {"name": "laptop_1024", "width": 1024, "height": 768},
    {"name": "tablet_768", "width": 768, "height": 1024},
    {"name": "mobile_390", "width": 390, "height": 844}
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            headless=True
        )
        for vp in viewports:
            page = await browser.new_page(viewport={"width": vp["width"], "height": vp["height"]})
            await page.goto("http://localhost:5173", wait_until="networkidle")
            
            section = await page.query_selector("#insights-overview")
            if section:
                await section.scroll_into_view_if_needed()
                await page.wait_for_timeout(800)
                
                # Check overflow in section
                overflow = await page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
                filename = f"v70_2_insights_{vp['name']}.png"
                local_path = os.path.join(qa_dir, filename)
                artifact_path = os.path.join(artifact_dir, filename)
                
                # Capture element screenshot
                await section.screenshot(path=local_path)
                await section.screenshot(path=artifact_path)
                print(f"[OK] {vp['name']}: Overflow={overflow}, Saved={filename}")
            else:
                print(f"[ERROR] #insights-overview not found at {vp['name']}")
                
            await page.close()
            
        await browser.close()

asyncio.run(main())
