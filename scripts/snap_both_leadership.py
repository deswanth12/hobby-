import asyncio
import shutil
import os
from playwright.async_api import async_playwright

async def snap():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless=True
        )
        art_dir = r'C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151'
        os.makedirs('reports/screenshots', exist_ok=True)
        
        # 1. Snap About page at leadership card
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('http://localhost:5173/about', wait_until='networkidle')
        await page.wait_for_timeout(800)
        h2 = await page.query_selector("h2")
        if h2:
            await h2.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            p1 = 'reports/screenshots/about_leadership_verified_photo.png'
            await page.screenshot(path=p1)
            shutil.copy(p1, os.path.join(art_dir, 'about_leadership_verified_photo.png'))
            print('Captured About leadership photo')
        await page.close()

        # 2. Snap Leadership page
        page2 = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page2.goto('http://localhost:5173/leadership', wait_until='networkidle')
        await page2.wait_for_timeout(800)
        h2_l = await page2.query_selector("h2")
        if h2_l:
            await h2_l.scroll_into_view_if_needed()
            await page2.wait_for_timeout(500)
            p2 = 'reports/screenshots/leadership_page_verified_photo.png'
            await page2.screenshot(path=p2)
            shutil.copy(p2, os.path.join(art_dir, 'leadership_page_verified_photo.png'))
            print('Captured Leadership page photo')
        await page2.close()

        await browser.close()

asyncio.run(snap())
