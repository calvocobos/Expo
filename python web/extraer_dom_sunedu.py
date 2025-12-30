import webview
import time

URL = "https://renati.sunedu.gob.pe/handle/renati/4844187/statistics"

def extraer_dom():
    # Maximizar ventana
    window.maximize()

    # esperar a que cargue React/Vue
    time.sleep(15)

    html = window.evaluate_js("document.documentElement.outerHTML")
    texto = window.evaluate_js("document.body.innerText")

    with open("extraido_dom_sunedu.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("extraido_txt_sunedu.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    window.destroy()

    print("✔ extraido_dom_sunedu.html creado")
    print("✔ extraido_txt_sunedu.txt creado")

window = webview.create_window(
    title="Repositorio UAC",
    url=URL
)

webview.start(extraer_dom)
