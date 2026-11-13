import asyncio, os
from playwright.async_api import async_playwright

qa_dir = "V70_REFERENCE_AND_QA_SCREENSHOTS"
os.makedirs(qa_dir, exist_ok=True)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            headless=True
        )
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto("http://localhost:5173", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        # Take full page screenshot
        await page.screenshot(path=os.path.join(qa_dir, "full_homepage_live.png"), full_page=True)
        print("Full page screenshot saved.")
        
        # Take why-choose-us screenshot
        sec = await page.query_selector("#why-choose-us")
        if sec:
            await sec.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await sec.screenshot(path=os.path.join(qa_dir, "live_why_choose_us.png"))
            print("Why choose us screenshot saved.")

        # Take insights screenshot
        insights = await page.query_selector("#insights-overview")
        if insights:
            await insights.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await insights.screenshot(path=os.path.join(qa_dir, "live_insights.png"))
            print("Insights screenshot saved.")

        await browser.close()

asyncio.run(main())
