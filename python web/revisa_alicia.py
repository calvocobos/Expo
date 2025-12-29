from playwright.sync_api import sync_playwright
import time

URL = (
    "https://alicia.concytec.gob.pe/vufind/Search/Results?"
    "filter[]=~instname_str:%22Universidad+Andina+del+Cusco%22"
    "&daterange[]=publishDate"
    "&publishDatefrom=2025"
    "&publishDateto=2026"
)

def slow_scroll(page, step=300, delay=0.3):
    height = page.evaluate("document.body.scrollHeight")
    current = 0
    while current < height:
        page.evaluate(f"window.scrollTo(0, {current})")
        time.sleep(delay)
        current += step
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        args=["--start-maximized"]
    )

    page = browser.new_page(no_viewport=True)
    page.goto(URL)
    page.wait_for_timeout(3000)

    slow_scroll(page)
    page.wait_for_timeout(2000)

    result_items = page.locator("li.result")
    total = result_items.count()

    if total == 0:
        print("❌ ALICIA aún NO ha cosechado 2025 (Universidad Andina del Cusco)")
    else:
        print(f"✅ ALICIA YA cosechó 2025 (UAC) — {total} resultados")

    page.wait_for_timeout(5000)
    browser.close()
