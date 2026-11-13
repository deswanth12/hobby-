import asyncio
import os
import shutil
from playwright.async_api import async_playwright

ARTIFACT_DIR = r"C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151"

async def main():
    os.makedirs('artifacts', exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel="msedge")

        # 1. Desktop Viewport (1440x900)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('http://localhost:5173/', wait_until='networkidle')
        await page.wait_for_timeout(1000)

        # Capture Desktop with Launcher closed
        await page.screenshot(path='artifacts/rag_desktop_launcher_closed.png')

        # Click Launcher to open Assistant Panel
        launcher = page.locator('button[aria-label*="Ask about our firm"], button:has-text("Ask about our firm")')
        if await launcher.count() > 0:
            await launcher.first.click()
            await page.wait_for_timeout(700)
            await page.screenshot(path='artifacts/rag_desktop_panel_opened.png')

            # Click a suggested question: "Explore Our Services"
            suggested = page.locator('button:has-text("Explore Our Services")')
            if await suggested.count() > 0:
                await suggested.first.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path='artifacts/rag_desktop_conversation_active.png')

        # 2. Mobile Viewport (390x844 - iPhone 14)
        m_page = await browser.new_page(viewport={'width': 390, 'height': 844})
        await m_page.goto('http://localhost:5173/', wait_until='networkidle')
        await m_page.wait_for_timeout(1000)

        # Capture Mobile with Launcher
        await m_page.screenshot(path='artifacts/rag_mobile_launcher_closed.png')

        # Open Assistant on Mobile
        m_launcher = m_page.locator('button[aria-label*="Ask about our firm"], button:has-text("Ask about our firm")')
        if await m_launcher.count() > 0:
            await m_launcher.first.click()
            await m_page.wait_for_timeout(700)
            await m_page.screenshot(path='artifacts/rag_mobile_panel_opened.png')

        await browser.close()

        # Mirror all captures to artifact directory
        captures = [
            'rag_desktop_launcher_closed.png',
            'rag_desktop_panel_opened.png',
            'rag_desktop_conversation_active.png',
            'rag_mobile_launcher_closed.png',
            'rag_mobile_panel_opened.png'
        ]

        for f in captures:
            src = os.path.join('artifacts', f)
            if os.path.exists(src):
                dst = os.path.join(ARTIFACT_DIR, f)
                shutil.copyfile(src, dst)
                print(f'Captured & mirrored: {f}')

if __name__ == '__main__':
    asyncio.run(main())
