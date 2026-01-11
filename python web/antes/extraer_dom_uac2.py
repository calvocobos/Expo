from playwright.sync_api import sync_playwright

URL = "https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)

    context = browser.new_context(
        viewport={"width": 1500, "height": 900}
    )

    page = context.new_page()
    page.goto(URL)

    page.wait_for_timeout(15000)

    html = page.content()
    text = page.inner_text("body")

    with open("extraido_dom_uac.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("extraido_txt_uac.txt", "w", encoding="utf-8") as f:
        f.write(text)

    print("✔  extraido_dom_uac.html creado")
    print("✔  extraido_txt_uac.txt creado")

    browser.close()
