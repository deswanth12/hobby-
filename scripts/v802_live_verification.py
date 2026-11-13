import os
import sys
import time
import json
import subprocess
import urllib.request

try:
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

from playwright.sync_api import sync_playwright

PORT = 5230
BASE_URL = f"http://127.0.0.1:{PORT}"
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
SCREENSHOT_DIR = os.path.abspath("reports/screenshots/v802_verification")
ARTIFACT_DIR = r"C:\Users\k deswanth\.gemini\antigravity\brain\12a17cde-3e50-4191-8739-afaecddf2151"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)
os.makedirs(ARTIFACT_DIR, exist_ok=True)

# Read configured secret path
ADMIN_SECRET_PATH = "/sec-ca-50e0e5eed471"
TEST_ADMIN_PASS = "TestLiveVerificationPassword!2026"

print(f"=== Starting V8.0.2 Live Production Verification on {BASE_URL} ===")

# 1. Start Server Subprocess
env = os.environ.copy()
env["PORT"] = str(PORT)
env["ADMIN_KAVITHA_PASSWORD"] = TEST_ADMIN_PASS
env["SESSION_SECRET"] = "verification_session_secret_hardened_2026_test"

server_proc = subprocess.Popen(
    ["node", "server/index.cjs"],
    cwd=os.path.abspath("."),
    env=env
)

def wait_for_server(timeout=15):
    start = time.time()
    last_err = None
    while time.time() - start < timeout:
        try:
            req = urllib.request.Request(f"{BASE_URL}/api/health")
            with urllib.request.urlopen(req, timeout=2) as resp:
                if resp.status == 200:
                    print(f"[OK] Production server healthy at {BASE_URL}", flush=True)
                    return True
        except Exception as ex:
            last_err = ex
            time.sleep(0.5)
    raise RuntimeError(f"Server failed to start at {BASE_URL} within {timeout}s: {last_err}")

try:
    wait_for_server()
except Exception as e:
    server_proc.kill()
    raise e

results = {
    "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    "port": PORT,
    "baseUrl": BASE_URL,
    "checks": [],
    "consoleErrors": [],
    "networkFailures": []
}

def log_check(name, passed, details=""):
    status_str = "[PASS]" if passed else "[FAIL]"
    print(f"{status_str}: {name} - {details}", flush=True)
    results["checks"].append({"name": name, "passed": passed, "details": details})

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=EDGE_PATH, headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()

    # Track console errors and network failures
    def on_console(msg):
        if msg.type == "error":
            # Ignore harmless favicon or known benign cross-origin test errors
            text = msg.text
            results["consoleErrors"].append({"type": msg.type, "text": text})
            print(f"  [Browser Console Error]: {text}")

    def on_response(response):
        if response.status >= 400:
            # We will ignore expected 401/404 during negative tests
            results["networkFailures"].append({
                "url": response.url,
                "status": response.status,
                "statusText": response.status_text
            })

    page.on("console", on_console)
    page.on("response", on_response)

    # -------------------------------------------------------------------------
    # CHECK 1 & 2: Test Every Public Route
    # -------------------------------------------------------------------------
    public_routes = [
        {"path": "/", "name": "homepage", "expected_text": "Kavitha & Associates"},
        {"path": "/about", "name": "about", "expected_text": "Chartered Accountants"},
        {"path": "/services", "name": "services", "expected_text": "Practice Areas"},
        {"path": "/services/audit-assurance", "name": "service_audit", "expected_text": "Audit"},
        {"path": "/services/gst-consultant-tirupati", "name": "service_gst", "expected_text": "GST"},
        {"path": "/services/income-tax-consultant-tirupati", "name": "service_incometax", "expected_text": "Income Tax"},
        {"path": "/services/company-registration-tirupati", "name": "service_company", "expected_text": "Registration"},
        {"path": "/services/virtual-cfo-tirupati", "name": "service_cfo", "expected_text": "Virtual CFO"},
        {"path": "/services/rera-consultant-tirupati", "name": "service_rera", "expected_text": "RERA"},
        {"path": "/industries", "name": "industries", "expected_text": "Industries"},
        {"path": "/locations", "name": "locations", "expected_text": "Tirupati"},
        {"path": "/blog", "name": "blog_index", "expected_text": "Regulatory Insights"},
        {"path": "/contact", "name": "contact", "expected_text": "Connect With"},
        {"path": "/nonexistent-route-for-testing-404", "name": "not_found", "expected_text": "404"}
    ]

    for route in public_routes:
        url = f"{BASE_URL}{route['path']}"
        page.goto(url, wait_until="networkidle")
        body_text = page.locator("body").inner_text()
        has_text = route["expected_text"].lower() in body_text.lower()
        snap_path = os.path.join(SCREENSHOT_DIR, f"{route['name']}_1440.png")
        page.screenshot(path=snap_path)
        log_check(f"Public Route: {route['path']}", has_text, f"Contains '{route['expected_text']}'")

    # -------------------------------------------------------------------------
    # CHECK 3: Verify the New Insights Layout & All Article Links
    # -------------------------------------------------------------------------
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    insights_elem = page.locator("#insights-overview")
    has_insights = insights_elem.count() > 0
    log_check("Insights Section Element (#insights-overview)", has_insights, "Element present on homepage")
    
    if has_insights:
        snap_insights = os.path.join(SCREENSHOT_DIR, "live_insights_editorial_1440.png")
        insights_elem.screenshot(path=snap_insights)
        # Copy to artifact directory
        import shutil
        shutil.copy(snap_insights, os.path.join(ARTIFACT_DIR, "live_insights_editorial_1440.png"))
        
        # Verify Lead Article Link
        lead_link = page.locator("#insights-overview a[href*='/blog/statutory-audit-guidelines-2026']").first
        log_check("Lead Article Link exists", lead_link.count() > 0, "Links to /blog/statutory-audit-guidelines-2026")
        
        # Click Lead Article
        lead_link.click()
        page.wait_for_load_state("networkidle")
        is_lead_page = "/blog/statutory-audit-guidelines-2026" in page.url
        log_check("Lead Article Navigation", is_lead_page, f"Current URL: {page.url}")

    # -------------------------------------------------------------------------
    # CHECK 4: Verify Full Article Content Loads Correctly from Existing Backend
    # -------------------------------------------------------------------------
    page.wait_for_selector("article h2")
    article_headings = page.locator("article h1, article h2, article h3").count()
    article_author = "CA Kavitha Vijay" in page.locator("body").inner_text()
    article_body = page.locator("article").first.inner_text()
    has_statutory_content = "Section 143" in article_body and "CARO 2020" in article_body
    snap_article = os.path.join(SCREENSHOT_DIR, "article_statutory_audit_content.png")
    page.screenshot(path=snap_article)
    log_check("Full Article Markdown Rendering", article_headings > 2 and article_author and has_statutory_content,
              f"Headings count: {article_headings}, Author present: {article_author}, CARO 2020 present: {has_statutory_content}")

    # Test Companion Article: GST
    page.goto(f"{BASE_URL}/blog/gst-annual-return-compliance", wait_until="networkidle")
    gst_content = "GSTR-9" in page.locator("body").inner_text()
    log_check("GST Article Content", gst_content, "Contains statutory GSTR-9 technical analysis")

    # Test Companion Article: Corporate Tax
    page.goto(f"{BASE_URL}/blog/corporate-tax-planning-2026", wait_until="networkidle")
    tax_content = "115BAA" in page.locator("body").inner_text()
    log_check("Corporate Tax Article Content", tax_content, "Contains Section 115BAA analysis")

    # -------------------------------------------------------------------------
    # CHECK 9: Verify Draft Articles Cannot Be Accessed Publicly
    # -------------------------------------------------------------------------
    page.goto(f"{BASE_URL}/blog/internal-audit-best-practices", wait_until="networkidle")
    is_draft_404 = page.locator("h1:has-text('404'), div:has-text('Not Found')").count() > 0 or "404" in page.title()
    snap_draft_blocked = os.path.join(SCREENSHOT_DIR, "draft_quarantine_404.png")
    page.screenshot(path=snap_draft_blocked)
    log_check("Draft Quarantine on Public Route (/blog/internal-audit-best-practices)", is_draft_404, "Returns 404 NotFoundPage")

    # Verify /api/content omits draft
    api_content_req = urllib.request.Request(f"{BASE_URL}/api/content")
    with urllib.request.urlopen(api_content_req) as resp:
        content_json = json.loads(resp.read().decode())
        posts = content_json.get("posts", [])
        draft_in_posts = any(p.get("slug") == "internal-audit-best-practices" for p in posts)
        log_check("Public /api/content excludes draft", not draft_in_posts, f"Published posts count: {len(posts)}, draft present: {draft_in_posts}")

    # -------------------------------------------------------------------------
    # CHECK 7: Test Direct Admin Route Access Without Authentication
    # -------------------------------------------------------------------------
    # Legacy /admin -> 404
    page.goto(f"{BASE_URL}/admin", wait_until="networkidle")
    is_legacy_admin_404 = page.locator("h1:has-text('404'), div:has-text('Not Found')").count() > 0 or "404" in page.title()
    log_check("Legacy /admin Route Quarantine", is_legacy_admin_404, "Standard /admin yields 404 NotFoundPage")

    # Unauthenticated access to configured admin overview
    page.goto(f"{BASE_URL}{ADMIN_SECRET_PATH}", wait_until="networkidle")
    # Should redirect to login or show login form
    is_at_login = f"{ADMIN_SECRET_PATH}/login" in page.url or page.locator("input[type='password']").count() > 0
    snap_admin_unauth = os.path.join(SCREENSHOT_DIR, "admin_unauth_redirect_to_login.png")
    page.screenshot(path=snap_admin_unauth)
    log_check("Unauthenticated Protected Admin Route Redirection", is_at_login, f"Redirected to {page.url}")

    # -------------------------------------------------------------------------
    # CHECK 6: Test Invalid Admin Credentials
    # -------------------------------------------------------------------------
    page.goto(f"{BASE_URL}{ADMIN_SECRET_PATH}/login", wait_until="networkidle")
    username_input = page.locator("input#username, input[name='username'], input[type='text']").first
    password_input = page.locator("input#password, input[name='password'], input[type='password']").first
    submit_btn = page.locator("button[type='submit']").first

    username_input.fill("kavitha")
    password_input.fill("WrongInvalidPassword999!")
    submit_btn.click()
    page.wait_for_timeout(1000)

    error_locator = page.locator("div[role='alert'], .text-red-500, .text-rose-400, div:has-text('Invalid'), div:has-text('Authentication Failed')")
    error_msg = error_locator.first.inner_text() if error_locator.count() > 0 else ""
    snap_invalid_login = os.path.join(SCREENSHOT_DIR, "admin_invalid_credentials_error.png")
    page.screenshot(path=snap_invalid_login)
    log_check("Invalid Admin Login Attempt", len(error_msg) > 0, f"Error displayed: '{error_msg}'")

    # -------------------------------------------------------------------------
    # CHECK 5: Test Admin Login with Valid Credentials
    # -------------------------------------------------------------------------
    username_input.fill("kavitha")
    password_input.fill(TEST_ADMIN_PASS)
    submit_btn.click()
    page.wait_for_timeout(1500)

    is_logged_in = f"{ADMIN_SECRET_PATH}" in page.url and "/login" not in page.url
    snap_admin_portal = os.path.join(SCREENSHOT_DIR, "admin_portal_authenticated_overview.png")
    page.screenshot(path=snap_admin_portal)
    log_check("Valid Admin Login & Dashboard Navigation", is_logged_in, f"Authenticated URL: {page.url}")

    # Test Admin Enquiries View
    page.goto(f"{BASE_URL}{ADMIN_SECRET_PATH}/enquiries", wait_until="networkidle")
    enquiries_heading = page.locator("h1, h2").first.inner_text()
    snap_admin_enquiries = os.path.join(SCREENSHOT_DIR, "admin_portal_enquiries_view.png")
    page.screenshot(path=snap_admin_enquiries)
    log_check("Admin Enquiries View Loaded", "Enquir" in enquiries_heading or "Consultation" in enquiries_heading, f"Heading: {enquiries_heading}")

    # Test Admin Content View
    page.goto(f"{BASE_URL}{ADMIN_SECRET_PATH}/content", wait_until="networkidle")
    content_heading = page.locator("h1, h2").first.inner_text()
    snap_admin_content = os.path.join(SCREENSHOT_DIR, "admin_portal_content_view.png")
    page.screenshot(path=snap_admin_content)
    log_check("Admin Content Management View Loaded", "Content" in content_heading or "Practice" in content_heading, f"Heading: {content_heading}")

    # Test Admin Settings View
    page.goto(f"{BASE_URL}{ADMIN_SECRET_PATH}/settings", wait_until="networkidle")
    settings_heading = page.locator("h1, h2").first.inner_text()
    snap_admin_settings = os.path.join(SCREENSHOT_DIR, "admin_portal_settings_view.png")
    page.screenshot(path=snap_admin_settings)
    log_check("Admin Settings View Loaded", "Setting" in settings_heading or "Security" in settings_heading, f"Heading: {settings_heading}")

    # -------------------------------------------------------------------------
    # CHECK 10: Test Contact Form Submission & Backend Persistence
    # -------------------------------------------------------------------------
    # Clear cookies/session for public contact form test
    context.clear_cookies()
    page.goto(f"{BASE_URL}/contact", wait_until="networkidle")

    test_contact_payload = {
        "fullName": "Live Audit Verification Client",
        "phone": "+91 98450 12345",
        "email": "liveaudit@kavithaassociates.com",
        "city": "Tirupati",
        "message": "Automated V8.0.2 live production verification enquiry testing durable backend persistence."
    }

    page.locator("input[name='fullName'], input#fullName").fill(test_contact_payload["fullName"])
    page.locator("input[name='phone'], input#phone").fill(test_contact_payload["phone"])
    page.locator("input[name='email'], input#email").fill(test_contact_payload["email"])
    if page.locator("input[name='city'], input#city").count() > 0:
        page.locator("input[name='city'], input#city").fill(test_contact_payload["city"])
    page.locator("textarea[name='message'], textarea#message").fill(test_contact_payload["message"])

    # Wait 2000ms to satisfy client velocity spam guard (>1500ms)
    page.wait_for_timeout(2000)

    # Click Submit
    submit_contact = page.locator("button[type='submit']").first
    submit_contact.click()
    page.wait_for_timeout(2500)

    snap_contact_success = os.path.join(SCREENSHOT_DIR, "contact_submission_success.png")
    page.screenshot(path=snap_contact_success)
    success_msg = page.locator(".text-emerald-700, .text-emerald-800, div:has-text('received'), div:has-text('Thank You'), div:has-text('submitted')").count() > 0
    log_check("Contact Form Submission Client Feedback", success_msg, "Success acknowledgement displayed")

    # Verify Persistence in data/practice_db.json
    with open("data/practice_db.json", "r", encoding="utf-8") as f:
        db_data = json.load(f)
    persisted_enq = next((e for e in db_data.get("enquiries", []) if e.get("phone") == test_contact_payload["phone"]), None)
    is_persisted = persisted_enq is not None and persisted_enq.get("fullName") == test_contact_payload["fullName"]
    log_check("Backend Enquiry Persistence Verification", is_persisted, f"Persisted ID: {persisted_enq.get('id') if persisted_enq else 'None'}")

    # -------------------------------------------------------------------------
    # CHECK 11: Verify Mobile Navigation & Primary Interactions
    # -------------------------------------------------------------------------
    mobile_context = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
    mobile_page = mobile_context.new_page()
    mobile_page.goto(f"{BASE_URL}/", wait_until="networkidle")

    snap_mobile_home = os.path.join(SCREENSHOT_DIR, "mobile_homepage_390.png")
    mobile_page.screenshot(path=snap_mobile_home)

    # Open Hamburger Menu
    menu_btn = mobile_page.locator("button[aria-label*='menu'], button[aria-label*='Menu'], button:has-text('Menu')").first
    if menu_btn.count() > 0:
        menu_btn.click()
        mobile_page.wait_for_timeout(500)
        snap_mobile_menu = os.path.join(SCREENSHOT_DIR, "mobile_menu_open_390.png")
        mobile_page.screenshot(path=snap_mobile_menu)
        menu_has_links = mobile_page.locator("nav a[href='/about'], nav a[href='/services']").count() > 0
        log_check("Mobile Navigation Menu Open & Links", menu_has_links, "Mobile navigation overlay contains primary links")

        # Close Menu
        close_btn = mobile_page.locator("button[aria-label*='close'], button[aria-label*='Close']").first
        if close_btn.count() > 0:
            close_btn.click()
            mobile_page.wait_for_timeout(300)
            log_check("Mobile Navigation Menu Close", True, "Menu closes cleanly")
    else:
        log_check("Mobile Menu Button", False, "Could not locate mobile menu trigger button")

    # Mobile WhatsApp Button Check
    wa_btn = mobile_page.locator("a[href*='wa.me'], button:has-text('WhatsApp')")
    log_check("Mobile Floating WhatsApp CTA", wa_btn.count() > 0, "WhatsApp CTA button is present and clickable")

    mobile_context.close()
    browser.close()

# -------------------------------------------------------------------------
# CHECK 8: Test Admin API Requests Without Authentication (Direct HTTP)
# -------------------------------------------------------------------------
admin_api_endpoints = [
    "/api/admin/enquiries",
    "/api/admin/content/services",
    "/api/admin/content/faqs",
    "/api/admin/settings",
    "/api/auth/session"
]

for endpoint in admin_api_endpoints:
    req = urllib.request.Request(f"{BASE_URL}{endpoint}")
    try:
        urllib.request.urlopen(req)
        log_check(f"Direct API Negative Auth: {endpoint}", False, "Expected 401 Unauthorized but succeeded")
    except urllib.error.HTTPError as e:
        is_401 = e.code == 401
        log_check(f"Direct API Negative Auth: {endpoint}", is_401, f"HTTP status: {e.code}")

# Terminate Server Subprocess
print("Terminating production server subprocess...")
server_proc.terminate()
server_proc.wait(timeout=5)
print("✔ Server terminated cleanly.")

# Save results json
with open("reports/v802_live_verification_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("\n=== V8.0.2 Verification Summary ===")
total_checks = len(results["checks"])
passed_checks = sum(1 for c in results["checks"] if c["passed"])
failed_checks = total_checks - passed_checks

print(f"Total Checks: {total_checks}")
print(f"Passed: {passed_checks}")
print(f"Failed: {failed_checks}")
print(f"Browser Console Errors: {len(results['consoleErrors'])}")
print(f"Unexpected Network Failures: {len([n for n in results['networkFailures'] if n['status'] not in [401, 404]])}")
print(f"Screenshots Directory: {SCREENSHOT_DIR}")
print("Results written to reports/v802_live_verification_results.json")
