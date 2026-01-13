from playwright.sync_api import sync_playwright, TimeoutError
import time

# ======================================================
# CONFIGURACIÓN
# ======================================================
URL_REFERENCIAS = "https://calvocobos.github.io/Expo/referencias.html"
TXT_SALIDA = "OSF_contenido.txt"

VIEWPORT_WIDTH = 1600
VIEWPORT_HEIGHT = 900

# ======================================================
# INICIO
# ======================================================
with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        slow_mo=80,
        args=[f"--window-size={VIEWPORT_WIDTH},{VIEWPORT_HEIGHT}"]
    )

    context = browser.new_context(
        viewport={
            "width": VIEWPORT_WIDTH,
            "height": VIEWPORT_HEIGHT
        }
    )

    page = context.new_page()

    try:
        # ==================================================
        # 1️⃣ ENTRAR A PÁGINA DE REFERENCIAS
        # ==================================================
        page.goto(URL_REFERENCIAS, wait_until="domcontentloaded", timeout=30000)
        time.sleep(5)
        print("✔ Paso 1: Página de referencias cargada")

        # ==================================================
        # 2️⃣ CLICK EN ENLACE OSF
        # ==================================================
        page.wait_for_selector("#ref-osf", timeout=15000)
        page.click("#ref-osf")
        time.sleep(5)
        print("✔ Paso 2: Click en ref-osf")

        # ==================================================
        # 3️⃣ ESPERA NAVEGACIÓN OSF
        # ==================================================
        page.wait_for_load_state("domcontentloaded", timeout=30000)
        time.sleep(10)
        print("✔ Paso 3: OSF cargado")

        # ==================================================
        # 4️⃣ CLICK EN ANALYTICS
        # ==================================================
        page.wait_for_selector("a[href*='/analytics']", timeout=20000)
        page.locator("a[href*='/analytics']").first.click()
        time.sleep(5)
        print("✔ Paso 4: Click en Analytics")

        # ==================================================
        # 5️⃣ ESPERA ANALYTICS
        # ==================================================
        page.wait_for_load_state("networkidle", timeout=30000)
        time.sleep(5)
        print("✔ Paso 5: Analytics cargado")


        # ==================================================
        # 6️⃣ 1 ESPERAR DIV PADRE SCROLLEABLE
        # ==================================================
        page.wait_for_selector("div.content-wrapper", timeout=30000)
        time.sleep(5)
        print("✔ Paso 6: content-wrapper listo")

        # ==================================================
        # 6️⃣ 2 SCROLL PROGRESIVO content-wrapper
        # ==================================================
        for i in range(12):
            page.evaluate("""
                const cont = document.querySelector('div.content-wrapper');
                cont.scrollBy(0, 100);
            """)
            time.sleep(2)

        # ==================================================
        # 6️⃣ 3 SCROLL FINAL
        # ==================================================
        page.evaluate("""
            const cont = document.querySelector('div.content-wrapper');
            cont.scrollTop = cont.scrollHeight;
        """)
        time.sleep(5)
        print("✔ Paso 7: Scroll final realizado")

        # ==================================================
        # 7️⃣ EXTRAER CONTENIDO ANALYTICS
        # ==================================================
        contenido_total = "===== ANALYTICS =====\n\n"
        contenido_total += page.inner_text("body")

        # ==================================================
        # 8️⃣ IR AL ENLACE DEL ARCHIVO PDF
        # ==================================================
        page.goto("https://osf.io/qmzbp/files/", wait_until="domcontentloaded")
        time.sleep(20)
        print("✔ Paso 8: Página del archivo cargada")

        # ==================================================
        # 9️⃣ ACEPTAR COOKIES (SI APARECE)
        # ==================================================
        try:
            page.locator("button:has-text('Accept cookies')").click(timeout=5000)
            time.sleep(3)
            print("✔ Paso 9: Cookies aceptadas")
        except:
            print("ℹ Paso 9: Sin cookies")

        # ==================================================
        # 🔟 ESPERAR DIV PADRE SCROLLEABLE
        # ==================================================
        page.wait_for_selector("div.content-wrapper", timeout=30000)
        time.sleep(5)
        print("✔ Paso 10: content-wrapper listo")

        # ==================================================
        # 1️⃣1️⃣ SCROLL PROGRESIVO content-wrapper
        # ==================================================
        for i in range(12):
            page.evaluate("""
                const cont = document.querySelector('div.content-wrapper');
                cont.scrollBy(0, 100);
            """)
            time.sleep(2)

        # ==================================================
        # 1️⃣2️⃣ SCROLL FINAL
        # ==================================================
        page.evaluate("""
            const cont = document.querySelector('div.content-wrapper');
            cont.scrollTop = cont.scrollHeight;
        """)
        time.sleep(5)
        print("✔ Paso 12: Scroll final realizado")

        # ==================================================
        # 1️⃣3️⃣ EXTRAER CONTENIDO FINAL
        # ==================================================
        contenido_total += "\n\n===== ARCHIVO OSF =====\n\n"
        contenido_total += page.inner_text("body")

        # ==================================================
        # 1️⃣4️⃣ GUARDAR TODO EN UN SOLO TXT
        # ==================================================
        with open(TXT_SALIDA, "w", encoding="utf-8") as f:
            f.write(contenido_total)

        print(f"✔ Paso 14: TXT generado → {TXT_SALIDA}")

    except Exception as e:
        with open(TXT_SALIDA, "w", encoding="utf-8") as f:
            f.write(f"ERROR DURANTE EL PROCESO:\n{str(e)}")

        print("❌ Error capturado y guardado en el TXT")

    finally:
        time.sleep(5)
        browser.close()
        print("🔴 Proceso finalizado")
