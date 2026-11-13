import asyncio, time, statistics
from playwright.async_api import async_playwright

async def measure_run(p, run_index):
    browser = await p.chromium.launch(
        executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        headless=True
    )
    context = await browser.new_context(
        viewport={'width': 1440, 'height': 900},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0"
    )
    page = await context.new_page()
    
    start_time = time.time()
    response = await page.goto('http://localhost:5173', wait_until='networkidle')
    end_time = time.time()
    
    # Extract navigation timing metrics
    timings = await page.evaluate("""() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(p => p.name === 'first-contentful-paint');
        
        return {
            ttfb: nav ? nav.responseStart - nav.requestStart : 0,
            domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
            load: nav ? nav.loadEventEnd - nav.startTime : 0,
            fcp: fcp ? fcp.startTime : 0
        };
    }""")
    
    await browser.close()
    return timings

async def main():
    print("=== PERFORMANCE BENCHMARK (5 TEST RUNS) ===")
    async with async_playwright() as p:
        runs = []
        for i in range(5):
            t = await measure_run(p, i + 1)
            runs.append(t)
            print(f"Run {i+1}: TTFB={t['ttfb']:.1f}ms, FCP={t['fcp']:.1f}ms, DCL={t['domContentLoaded']:.1f}ms, Load={t['load']:.1f}ms")
            
        ttfb_vals = [r['ttfb'] for r in runs]
        fcp_vals = [r['fcp'] for r in runs]
        dcl_vals = [r['domContentLoaded'] for r in runs]
        load_vals = [r['load'] for r in runs]
        
        print("\n--- BENCHMARK SUMMARY ---")
        print(f"TTFB: Median = {statistics.median(ttfb_vals):.1f}ms (Min: {min(ttfb_vals):.1f}ms, Max: {max(ttfb_vals):.1f}ms)")
        print(f"FCP:  Median = {statistics.median(fcp_vals):.1f}ms (Min: {min(fcp_vals):.1f}ms, Max: {max(fcp_vals):.1f}ms)")
        print(f"DCL:  Median = {statistics.median(dcl_vals):.1f}ms (Min: {min(dcl_vals):.1f}ms, Max: {max(dcl_vals):.1f}ms)")
        print(f"Load: Median = {statistics.median(load_vals):.1f}ms (Min: {min(load_vals):.1f}ms, Max: {max(load_vals):.1f}ms)")

asyncio.run(main())
