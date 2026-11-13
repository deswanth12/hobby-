import asyncio
import json
import os
import sys
from playwright.async_api import async_playwright

EDGE_PATH = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
BASE_URL = 'http://localhost:5173'

VIEWPORTS_MOBILE = [
    {'name': 'compact_mobile_320', 'width': 320, 'height': 640},
    {'name': 'android_std_360', 'width': 360, 'height': 800},
    {'name': 'iphone_std_390', 'width': 390, 'height': 844},
    {'name': 'iphone_max_430', 'width': 430, 'height': 932},
]

VIEWPORT_DESKTOP = {'name': 'desktop_std_1440', 'width': 1440, 'height': 900}

ROUTES_TO_TEST = ['/about', '/leadership']

results = {
    'network_leaks': [],
    'dom_leaks': [],
    'seal_medallion_visibility': [],
    'hidden_facades': [],
    'horizontal_overflows': [],
    'deep_scroll_evaluations': [],
    'all_passed': True
}

async def run_adversarial_suite():
    print("================================================================================")
    print("     CHALLENGER 1: ADVERSARIAL REGRESSION & VISUAL SUITE (ITERATION 2)")
    print("================================================================================")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            executable_path=EDGE_PATH,
            headless=True
        )

        for route in ROUTES_TO_TEST:
            print(f"\n[+] Testing Route: {route} on Desktop (1440x900) across deep scroll...")
            page = await browser.new_page(viewport=VIEWPORT_DESKTOP)
            
            intercepted_requests = []
            page.on("request", lambda req: intercepted_requests.append(req.url))
            
            await page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
            await page.wait_for_timeout(600)
            
            # Check intercepted network requests
            for url in intercepted_requests:
                if "ca-kavitha-vijay" in url or "/images/partner/" in url:
                    err = f"Network leak detected on {route}: requested URL {url}"
                    print(f"[-] FAIL: {err}")
                    results['network_leaks'].append(err)
                    results['all_passed'] = False

            # Deep scroll evaluation from y = 0 to 5000 px in steps
            scroll_positions = [0, 1000, 2000, 2500, 3000, 3500, 4000, 4500, 5000]
            max_scroll_height = await page.evaluate("() => document.documentElement.scrollHeight")
            print(f"    Page scrollHeight: {max_scroll_height}px")

            for y_pos in scroll_positions:
                actual_y = min(y_pos, max_scroll_height - 900) if max_scroll_height > 900 else 0
                await page.evaluate(f"window.scrollTo(0, {actual_y})")
                await page.wait_for_timeout(250)

                # Adversarially probe DOM at this scroll position
                eval_data = await page.evaluate("""() => {
                    // Check for any unapproved partner portrait elements
                    const forbiddenPattern = /ca-kavitha-vijay|\\/images\\/partner\\//i;
                    const allImages = Array.from(document.querySelectorAll('img, picture source, image, [style*="background"]'));
                    const leakedImages = allImages.filter(el => {
                        const src = el.src || el.srcset || el.getAttribute('href') || el.style.backgroundImage || '';
                        return forbiddenPattern.test(src);
                    }).map(el => el.src || el.srcset || el.getAttribute('href') || el.style.backgroundImage);

                    // Check practice seal medallion
                    const sealImgs = Array.from(document.querySelectorAll('img[src*="ka-seal-medallion.webp"], img[alt*="Practice Credential Seal"], img[alt*="ICAI Practice"]'));
                    const sealData = sealImgs.map(img => {
                        const rect = img.getBoundingClientRect();
                        const style = window.getComputedStyle(img);
                        let parent = img.parentElement;
                        let parentHidden = false;
                        while (parent && parent !== document.body) {
                            const pStyle = window.getComputedStyle(parent);
                            if (pStyle.display === 'none' || pStyle.visibility === 'hidden' || pStyle.opacity === '0') {
                                parentHidden = true;
                                break;
                            }
                            parent = parent.parentElement;
                        }
                        return {
                            src: img.src,
                            alt: img.alt,
                            naturalWidth: img.naturalWidth,
                            naturalHeight: img.naturalHeight,
                            offsetWidth: img.offsetWidth,
                            offsetHeight: img.offsetHeight,
                            rectWidth: rect.width,
                            rectHeight: rect.height,
                            rectTop: rect.top,
                            rectBottom: rect.bottom,
                            display: style.display,
                            visibility: style.visibility,
                            opacity: style.opacity,
                            parentHidden: parentHidden,
                            isGenuinelyVisible: (
                                img.naturalWidth > 0 &&
                                img.naturalHeight > 0 &&
                                img.offsetWidth > 0 &&
                                img.offsetHeight > 0 &&
                                style.display !== 'none' &&
                                style.visibility !== 'hidden' &&
                                parseFloat(style.opacity || '1') > 0 &&
                                !parentHidden
                            )
                        };
                    });

                    // Check for hidden facade elements on CrestMonogram or practice seal containers
                    // Specifically looking for elements where CrestMonogram or seal is deliberately hidden via display:none or visibility:hidden or hidden class
                    const suspectedFacades = Array.from(document.querySelectorAll(
                        '[class*="hidden"][aria-hidden="true"], .hidden, [style*="display: none"], [style*="visibility: hidden"]'
                    )).filter(el => {
                        const html = el.outerHTML || '';
                        // Facade must be directly associated with CrestMonogram or seal medallion, excluding standard sr-only text
                        return /CrestMonogram|medallion|ka-seal-medallion/i.test(html) && !html.includes('sr-only');
                    }).map(el => ({
                        tagName: el.tagName,
                        className: el.className,
                        ariaHidden: el.getAttribute('aria-hidden'),
                        outerHTML: el.outerHTML.substring(0, 150)
                    }));

                    return {
                        leakedImages,
                        sealCount: sealImgs.length,
                        sealData,
                        suspectedFacades
                    };
                }""")

                if eval_data['leakedImages']:
                    err = f"DOM leak at y={actual_y} on {route}: {eval_data['leakedImages']}"
                    print(f"[-] FAIL: {err}")
                    results['dom_leaks'].append(err)
                    results['all_passed'] = False

                results['deep_scroll_evaluations'].append({
                    'route': route,
                    'scrollY': actual_y,
                    'eval': eval_data
                })

            # Check that seal medallion was rendered and genuinely visible
            last_eval = results['deep_scroll_evaluations'][-1]['eval']
            if last_eval['sealCount'] == 0:
                err = f"No seal medallion found on {route}"
                print(f"[-] FAIL: {err}")
                results['seal_medallion_visibility'].append({'route': route, 'error': err, 'passed': False})
                results['all_passed'] = False
            else:
                all_visible = all(s['isGenuinelyVisible'] for s in last_eval['sealData'])
                if not all_visible:
                    err = f"Seal medallion not genuinely visible on {route}: {last_eval['sealData']}"
                    print(f"[-] FAIL: {err}")
                    results['seal_medallion_visibility'].append({'route': route, 'error': err, 'passed': False})
                    results['all_passed'] = False
                else:
                    print(f"[+] PASS: Seal medallion visibly rendered on {route}: {last_eval['sealData']}")
                    results['seal_medallion_visibility'].append({'route': route, 'passed': True, 'data': last_eval['sealData']})

            # Check hidden facades
            if last_eval['suspectedFacades']:
                for f in last_eval['suspectedFacades']:
                    err = f"Hidden facade detected on {route}: {f}"
                    print(f"[-] FAIL: {err}")
                    results['hidden_facades'].append(err)
                    results['all_passed'] = False
            else:
                print(f"[+] PASS: Zero hidden facades on {route}")

            await page.close()

        # Multi-viewport mobile horizontal overflow tests
        print("\n================================================================================")
        print("     ADVERSARIAL MOBILE OVERFLOW TESTING (320px, 360px, 390px, 430px)")
        print("================================================================================")
        
        for vp in VIEWPORTS_MOBILE:
            for route in ROUTES_TO_TEST:
                page = await browser.new_page(viewport={'width': vp['width'], 'height': vp['height']})
                await page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
                await page.wait_for_timeout(400)

                overflow_data = await page.evaluate("""() => {
                    const docScrollWidth = document.documentElement.scrollWidth;
                    const docClientWidth = document.documentElement.clientWidth;
                    const bodyScrollWidth = document.body.scrollWidth;
                    const bodyClientWidth = document.body.clientWidth;
                    const innerWidth = window.innerWidth;
                    const hasDocOverflow = (docScrollWidth > docClientWidth + 1) || (bodyScrollWidth > bodyClientWidth + 1);

                    // Scan elements to find uncontained overflow (elements extending beyond innerWidth WITHOUT an overflow-x clip container)
                    const uncontainedOverflowingElements = [];
                    const allEls = document.querySelectorAll('*');
                    for (const el of allEls) {
                        const rect = el.getBoundingClientRect();
                        if (rect.right > innerWidth + 1) { // 1px threshold for subpixel rounding
                            // Check if enclosed in an overflow container
                            let p = el.parentElement;
                            let enclosedInScrollContainer = false;
                            while (p && p !== document.body) {
                                const style = window.getComputedStyle(p);
                                if (style.overflowX === 'auto' || style.overflowX === 'scroll' || style.overflowX === 'hidden') {
                                    enclosedInScrollContainer = true;
                                    break;
                                }
                                p = p.parentElement;
                            }
                            if (!enclosedInScrollContainer) {
                                uncontainedOverflowingElements.push({
                                    tagName: el.tagName,
                                    className: typeof el.className === 'string' ? el.className.substring(0, 80) : '',
                                    right: rect.right,
                                    width: rect.width,
                                    innerWidth: innerWidth
                                });
                                if (uncontainedOverflowingElements.length >= 5) break;
                            }
                        }
                    }

                    return {
                        docScrollWidth,
                        docClientWidth,
                        bodyScrollWidth,
                        bodyClientWidth,
                        innerWidth,
                        hasDocOverflow,
                        uncontainedOverflowingElements
                    };
                }""")

                if overflow_data['hasDocOverflow'] or len(overflow_data['uncontainedOverflowingElements']) > 0:
                    err = (f"Horizontal overflow at {vp['name']} ({vp['width']}px) on {route}: "
                           f"docScrollWidth={overflow_data['docScrollWidth']}, docClientWidth={overflow_data['docClientWidth']}, "
                           f"uncontained={overflow_data['uncontainedOverflowingElements']}")
                    print(f"[-] FAIL: {err}")
                    results['horizontal_overflows'].append({'viewport': vp, 'route': route, 'error': err, 'passed': False})
                    results['all_passed'] = False
                else:
                    print(f"[+] PASS: No horizontal overflow on {route} @ {vp['name']} ({vp['width']}px) [docScrollWidth={overflow_data['docScrollWidth']}, clientWidth={overflow_data['docClientWidth']}, uncontained=0]")
                    results['horizontal_overflows'].append({'viewport': vp, 'route': route, 'passed': True, 'metrics': overflow_data})

                await page.close()

        await browser.close()

    # Save results to tests/challenger_v82_it2_results.json
    results_path = os.path.abspath('tests/challenger_v82_it2_results.json')
    with open(results_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    print(f"\n[+] Results recorded at {results_path}")

    if results['all_passed']:
        print("\n>>> ALL ADVERSARIAL CHECKS PASSED SUCCESSFULLY! <<<")
    else:
        print("\n>>> ONE OR MORE ADVERSARIAL CHECKS FAILED! <<<")
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(run_adversarial_suite())
