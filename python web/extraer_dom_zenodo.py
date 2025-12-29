import webview
import time

URL = "https://zenodo.org/records/18047949"

def extraer_dom():
    # Maximizar ventana
    window.maximize()

    # esperar a que cargue React/Vue
    time.sleep(15)

    html = window.evaluate_js("document.documentElement.outerHTML")
    texto = window.evaluate_js("document.body.innerText")

    with open("extraido_dom_zenodo.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("extraido_txt_zenodo.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    window.destroy()

    print("✔ extraido_dom_zenodo.html creado")
    print("✔ extraido_txt_zenodo.txt creado")

window = webview.create_window(
    title="Repositorio UAC",
    url=URL
)

webview.start(extraer_dom)
