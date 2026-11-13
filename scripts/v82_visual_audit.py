import asyncio
import os
import json
from playwright.async_api import async_playwright

OUTPUT_DIR = "reports/screenshots/v82"
os.makedirs(OUTPUT_DIR, exist_ok=True)

ROUTES = [
    ('/', 'homepage'),
    ('/about', 'about'),
    ('/leadership', 'leadership'),
    ('/services', 'services'),
    ('/services/audit-assurance', 'service-audit'),
    ('/services/gst-consultant-tirupati', 'service-gst'),
    ('/services/income-tax-consultant-tirupati', 'service-income-tax'),
    ('/services/company-registration-tirupati', 'service-company-reg'),
    ('/services/virtual-cfo-tirupati', 'service-virtual-cfo'),
    ('/services/rera-consultant-tirupati', 'service-rera'),
    ('/industries', 'industries'),
    ('/locations', 'locations'),
    ('/blog', 'blog-listing'),
    ('/blog/statutory-audit-guidelines-2026', 'blog-article'),
    ('/contact', 'contact'),
]

VIEWPORTS = [
    ('390px', 390, 844),
    ('768px', 768, 1024),
    ('1024px', 1024, 768),
    ('1440px', 1440, 900),
]

async def run_audit():
    results = []
    console_errors = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path='C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            headless=True
        )

        for route, name in ROUTES:
            for vp_name, width, height in VIEWPORTS:
                page = await browser.new_page(viewport={'width': width, 'height': height})
                
                # Listen for console errors
                page.on('console', lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == 'error' else None)

                url = f"http://localhost:5173{route}"
                try:
                    await page.goto(url, wait_until='networkidle', timeout=15000)
                    await page.wait_for_timeout(600)

                    # Check horizontal overflow
                    overflow = await page.evaluate('''() => {
                        return {
                            scrollWidth: document.documentElement.scrollWidth,
                            innerWidth: window.innerWidth,
                            hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
                        };
                    }''')

                    # Check broken images
                    broken_images = await page.evaluate('''() => {
                        return Array.from(document.querySelectorAll('img'))
                            .filter(img => img.naturalWidth === 0 && img.src && !img.src.startsWith('data:'))
                            .map(img => img.src);
                    }''')

                    # Save key screenshots
                    # For all routes at 1440px & 390px, save screenshots
                    if vp_name in ['1440px', '390px']:
                        filename = f"{name}_{vp_name}.png"
                        filepath = os.path.join(OUTPUT_DIR, filename)
                        await page.screenshot(path=filepath, full_page=False)

                    audit_entry = {
                        'route': route,
                        'name': name,
                        'viewport': vp_name,
                        'width': width,
                        'overflow': overflow['hasOverflow'],
                        'scrollWidth': overflow['scrollWidth'],
                        'innerWidth': overflow['innerWidth'],
                        'brokenImages': broken_images,
                        'status': 'PASS' if not overflow['hasOverflow'] and len(broken_images) == 0 else 'FAIL'
                    }
                    results.append(audit_entry)
                    print(f"[{audit_entry['status']}] {route} @ {vp_name}: Overflow={overflow['hasOverflow']}, BrokenImgs={len(broken_images)}")

                except Exception as e:
                    print(f"[ERROR] {route} @ {vp_name}: {e}")
                    results.append({
                        'route': route,
                        'name': name,
                        'viewport': vp_name,
                        'status': 'ERROR',
                        'error': str(e)
                    })
                finally:
                    await page.close()

        await browser.close()

    summary_path = os.path.join(OUTPUT_DIR, 'summary.json')
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump({
            'totalChecks': len(results),
            'passedChecks': len([r for r in results if r['status'] == 'PASS']),
            'failedChecks': len([r for r in results if r['status'] != 'PASS']),
            'consoleErrors': console_errors,
            'details': results
        }, f, indent=2)

    print(f"\nAudit completed. Summary written to {summary_path}")

asyncio.run(run_audit())
