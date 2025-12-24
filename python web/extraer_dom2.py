from playwright.sync_api import sync_playwright

URL = "https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # headless=False abre la ventana
    page = browser.new_page()
    page.goto(URL)

    # Espera a que se cargue la página (puedes ajustar el selector o el tiempo)
    page.wait_for_timeout(15000)  # 15 segundos

    # Guardar el DOM completo y el texto visible
    html = page.content()
    text = page.inner_text("body")

    with open("dom_completo.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("contenido_visible.txt", "w", encoding="utf-8") as f:
        f.write(text)

    print("✔ dom_completo.html creado")
    print("✔ contenido_visible.txt creado")

    browser.close()
