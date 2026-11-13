import asyncio
import os
import shutil
from playwright.async_api import async_playwright

async def snap():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless=True
        )
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('http://localhost:5173/about', wait_until='networkidle')
        await page.wait_for_timeout(1000)
        
        # Locate the card
        heading = await page.query_selector("h2:has-text('CA Kavitha Vijay')")
        if heading:
            await heading.scroll_into_view_if_needed()
            await page.wait_for_timeout(600)
            os.makedirs('reports/screenshots', exist_ok=True)
            shot_path = 'reports/screenshots/leadership_profile_with_photo.png'
            await page.screenshot(path=shot_path)
            print('Captured leadership profile with photo')
            
            art_dir = r'C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151'
            shutil.copy(shot_path, os.path.join(art_dir, 'leadership_profile_with_photo.png'))
            print('Mirrored to artifact dir')
        else:
            print('Heading not found')
        await browser.close()

asyncio.run(snap())
