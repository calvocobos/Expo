from playwright.sync_api import sync_playwright, TimeoutError
import time
import urllib.parse


BUSQUEDAS = [
    '10.5281/zenodo.18047949',
    'Lalysdent Cusco',
    '"sistema de información web" "consultorio odontológico"',
    '"Cobos Vargas" sistema información web',
    '"Calvo Arteaga" sistema información web',
    '20.500.12557/8558'
]

ANIO_MINIMO = 2025


def construir_url(consulta):
    query = urllib.parse.quote_plus(consulta)
    return (
        f"https://scholar.google.com/scholar"
        f"?as_ylo={ANIO_MINIMO}&q={query}&hl=es&as_sdt=0,5"
    )


def buscar_en_scholar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            viewport={"width": 1400, "height": 900}
        )
        page = context.new_page()

        for i, consulta in enumerate(BUSQUEDAS, start=1):
            print(f"\n🔎 Búsqueda {i}: {consulta}")

            url = construir_url(consulta)
            print(f"🌐 URL: {url}")

            try:
                page.goto(url, timeout=60000)

                # Espera simple y segura: que cargue el body
                page.wait_for_selector("body", timeout=20000)

                print("✅ Página cargada")
                time.sleep(8)

            except TimeoutError:
                print("⚠️ Timeout (Scholar lento o bloqueo leve)")
                time.sleep(5)

        print("\n🎯 Proceso finalizado")
        browser.close()


if __name__ == "__main__":
    buscar_en_scholar()
