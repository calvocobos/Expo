from playwright.sync_api import sync_playwright
import time

URL = "https://calvocobos.github.io/Expo/referencias.html"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    # 1️⃣ Entrar a la página de referencias
    page.goto(URL)
    time.sleep(5)
    print("🟢 Página de referencias cargada")

    # 2️⃣ Click en el enlace identificado por ID
    page.click("#ref-zenodo")
    time.sleep(5)
    print("🟢 Click en ref-zenodo")

    # 3️⃣ Carga la página de Zenodo
    page.wait_for_load_state("networkidle")
    time.sleep(5)
    print("🟢 Página Zenodo cargada")

    # 4️⃣ Scroll a 500
    page.evaluate("window.scrollTo(0, 500)")
    time.sleep(5)
    print("🟢 Scroll realizado")

    # 5️⃣ Guardar contenido de Zenodo en TXT
    texto_zenodo = page.inner_text("body")
    with open("Zenodo_contenido2.txt", "w", encoding="utf-8") as f:
        f.write(texto_zenodo)

    time.sleep(5)
    print("🟢 Contenido de Zenodo guardado")

    # 6️⃣ Click en enlace OpenAIRE (target=_blank)
    with context.expect_page() as popup_info:
        page.locator(
            "#external-resource a",
            has_text="OpenAIRE"
        ).click()

    time.sleep(5)
    print("🟢 Click en OpenAIRE")

    # 7️⃣ Carga la página OpenAIRE
    openaire_page = popup_info.value
    openaire_page.wait_for_load_state("networkidle")
    time.sleep(5)
    print("🟢 Página OpenAIRE cargada")

    # 8️⃣ Cerrar navegador y terminar
    browser.close()
    print("🔴 Proceso finalizado")
