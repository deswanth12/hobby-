import asyncio
from playwright.async_api import async_playwright

async def snap_about_leadership():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
            headless=True
        )
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('http://localhost:5173/about', wait_until='networkidle')
        
        img = page.locator('img[alt="CA Kavitha Vijay - Managing Partner"]')
        count = await img.count()
        print(f'Image element count: {count}')
        if count > 0:
            is_vis = await img.is_visible()
            box = await img.bounding_box()
            print(f'Image visible: {is_vis}, Bounding box: {box}')
        await browser.close()

asyncio.run(snap_about_leadership())
