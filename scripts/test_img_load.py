import asyncio
from playwright.async_api import async_playwright

async def check():
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
            headless=True
        )
        page = await browser.new_page()
        
        for fname in ['statutory-audit-guidelines-2026.webp', 'gst-annual-return-compliance.webp', 'corporate-tax-planning-2026.webp']:
            url = f'http://localhost:5173/uploads/blog/{fname}'
            resp = await page.goto(url)
            print(f'{fname}: status={resp.status}')
            
        await page.goto('http://localhost:5173')
        await page.wait_for_timeout(1000)
        
        imgs_before = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('img'))
                .filter(img => img.src.includes('uploads/blog'))
                .map(img => ({ src: img.src, naturalWidth: img.naturalWidth, complete: img.complete }));
        }""")
        print('Before scroll:', imgs_before)
        
        insights = page.locator('#insights-overview')
        await insights.scroll_into_view_if_needed()
        await page.wait_for_timeout(1000)
        
        imgs_after = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('img'))
                .filter(img => img.src.includes('uploads/blog'))
                .map(img => ({ src: img.src, naturalWidth: img.naturalWidth, complete: img.complete }));
        }""")
        print('After scroll:', imgs_after)
        
        await browser.close()

asyncio.run(check())
