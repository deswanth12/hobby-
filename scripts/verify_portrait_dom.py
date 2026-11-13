import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless=True
        )
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('http://localhost:5173/about', wait_until='networkidle')
        await page.wait_for_timeout(500)
        
        info = await page.evaluate("""() => {
            const img = document.querySelector('img[alt="CA Kavitha Vijay - Managing Partner"]');
            if (!img) return { found: false };
            return {
                found: true,
                src: img.src,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                width: img.offsetWidth,
                height: img.offsetHeight
            };
        }""")
        print("DOM Image status:", info)
        await browser.close()

asyncio.run(verify())
