from playwright.sync_api import sync_playwright
import time

URL = "https://calvocobos.github.io/Expo/referencias.html"

with sync_playwright() as p:
    # 1️⃣ Lanzar navegador visible
    browser = p.chromium.launch(headless=False)

    context = browser.new_context(
        viewport={"width": 1500, "height": 900}
    )

    page = context.new_page()

    # 2️⃣ Cargar página inicial
    page.goto(URL)
    print("🟢 Página de referencias cargando")

    # 3️⃣ Esperar carga completa (JS / CSS)
    page.wait_for_timeout(5000)
    print("🟢 Página de referencias cargada")

    # 4️⃣ Click en el enlace con id="ref-uac"
    page.wait_for_selector("#ref-uac", timeout=10000)
    page.click("#ref-uac")
    print("🟢 Click en enlace ref-uac ejecutado")

    # 5️⃣ Esperar que cargue la nueva página
    page.wait_for_timeout(5000)
    print("🟢 Página UAC cargada")

    # 6️⃣ Scroll vertical (similar a tu ejemplo)
    page.evaluate("""
        window.scrollTo({
            top: 600,
            behavior: 'smooth'
        });
    """)
    print("🟢 Scroll movido al centro")

    # 7️⃣ Esperar que termine el scroll
    page.wait_for_timeout(5000)

    # 8️⃣ Extraer contenido renderizado final
    texto = page.inner_text("body")

    with open("UAC_contenido2.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    print("✔  UAC_contenido2.txt creado")

    # 9️⃣ Esperar antes de cerrar
    page.wait_for_timeout(5000)

    # 🔴 Cerrar navegador
    browser.close()
    print("🔴 Navegador cerrado")
