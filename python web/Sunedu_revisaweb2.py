from playwright.sync_api import sync_playwright, TimeoutError
import time

URL = "https://calvocobos.github.io/Expo/referencias.html"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    # 1️⃣ Referencias
    page.goto(URL)
    time.sleep(5)
    print("🟢 Referencias cargadas")

    try:
        # 2️⃣ Click Sunedu
        page.click("#ref-sunedu")
        print("🟡 Click en ref-sunedu")

        # 3️⃣ Esperar Sunedu (CRÍTICO)
        page.wait_for_load_state("domcontentloaded", timeout=15000)
        time.sleep(5)

        if "ERR_CONNECTION_TIMED_OUT" in page.content():
            raise Exception("Sunedu no respondió")

        print("🟢 Sunedu cargó correctamente")

    except Exception as e:
        # 🔴 ERROR CRÍTICO Sunedu
        texto_error = (
            "ERROR CRÍTICO Sunedu\n"
            "No se pudo cargar la página principal de Sunedu.\n"
            f"Detalle: {str(e)}"
        )

        with open("Sunedu_contenido2.txt", "w", encoding="utf-8") as f:
            f.write(texto_error)

        print("❌ Sunedu_contenido2.txt generado con ERROR CRÍTICO (Sunedu no cargó)")
        browser.close()
        exit()

    # =============================
    # Sunedu OK → intentar estadísticas
    # =============================

    estadisticas_ok = True

    try:
        # 4️⃣ Scroll final
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(5)

        # 5️⃣ Click estadísticas
        page.click("a.statisticsLink")
        page.wait_for_load_state("networkidle", timeout=15000)
        time.sleep(5)

        texto_sunedu = page.inner_text("body")
        print("🟢 Estadísticas Sunedu cargadas")

    except Exception:
        estadisticas_ok = False
        texto_sunedu = (
            "ERROR ESTADÍSTICAS Sunedu\n"
            "La página principal cargó, pero la sección de estadísticas no respondió."
        )
        print("🟠 Falló estadísticas Sunedu")

    # 6️⃣ Guardar TXT (SIEMPRE)
    with open("Sunedu_contenido2.txt", "w", encoding="utf-8") as f:
        f.write(texto_sunedu)

    if estadisticas_ok:
        print("✔ Sunedu_contenido2.txt generado con estadísticas válidas")
    else:
        print("⚠ Sunedu_contenido2.txt generado con MENSAJE DE ERROR (estadísticas no disponibles)")

    time.sleep(5)

    # =============================
    # Volver y Google Scholar
    # =============================

    page.go_back()
    page.wait_for_load_state("networkidle")
    time.sleep(5)

    try:
        with context.expect_page() as popup_info:
            page.locator('a[href*="scholar.google.com"]').first.click()

        scholar = popup_info.value
        scholar.wait_for_load_state("networkidle")
        time.sleep(5)
        print("🟢 Google Scholar abierto")

        scholar.locator('a[href*="as_ylo=2025"]').first.click(timeout=10000)
        scholar.wait_for_load_state("networkidle")
        time.sleep(5)
        print("🟢 Filtro Desde 2025 aplicado")

    except Exception:
        print("🟡 Google Scholar no pudo completarse")

    # 🔚 Final
    browser.close()
    print("🔴 Proceso finalizado correctamente")
