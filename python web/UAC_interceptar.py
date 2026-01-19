from playwright.sync_api import sync_playwright
from pathlib import Path
from datetime import datetime
import json
import time

URL = "https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a"

BASE_DIR = Path(__file__).resolve().parent
ACTUAL_DIR = BASE_DIR / "UAC_jsons" / "actual"
HIST_DIR = BASE_DIR / "UAC_jsons" / "historico" / datetime.now().strftime("%Y-%m-%d")

ACTUAL_DIR.mkdir(parents=True, exist_ok=True)
HIST_DIR.mkdir(parents=True, exist_ok=True)

capturados = 0
MAX_JSON = 4

def es_json_valido(data, url):
    try:
        query = data.get("query", {})
        if query.get("site_id") != "repositorio.uandina.edu.pe":
            return False

        if "/query" not in url:
            return False

        metrics = query.get("metrics", [])

        # visitas o descargas
        if "visits" in metrics:
            return True

        if "events" in metrics:
            for f in query.get("filters", []):
                if "File Download" in str(f):
                    return True

        return False
    except Exception:
        return False


def interceptar():
    global capturados

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        def on_response(response):
            global capturados

            if capturados >= MAX_JSON:
                return

            try:
                if "application/json" not in response.headers.get("content-type", ""):
                    return

                data = response.json()

                if not es_json_valido(data, response.url):
                    return

                sufijo = "" if capturados == 0 else f"_{capturados}"
                nombre = f"interceptado_query{sufijo}.json"

                # ACTUAL (se reemplaza)
                with open(ACTUAL_DIR / nombre, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)

                # HISTÓRICO (no se reemplaza)
                with open(HIST_DIR / nombre, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)

                print(f"✔ Guardado {nombre}")
                capturados += 1

            except Exception:
                pass

        page.on("response", on_response)

        print("🌐 Abriendo página…")
        page.goto(URL, wait_until="networkidle")
        time.sleep(15)

        browser.close()
        print("✅ Intercepción terminada")


if __name__ == "__main__":
    interceptar()
