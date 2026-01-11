import webview
import time

URL = "https://osf.io/rqzdx/analytics"

def extraer_dom():
    # Maximizar ventana
    window.maximize()

    # esperar a que cargue React/Vue
    time.sleep(15)

    html = window.evaluate_js("document.documentElement.outerHTML")
    texto = window.evaluate_js("document.body.innerText")

    with open("extraido_dom_osf.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("extraido_txt_osf.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    window.destroy()

    print("✔  extraido_dom_osf.html creado")
    print("✔  extraido_txt_osf.txt creado")

window = webview.create_window(
    title="Cosechador analytics",
    url=URL
)

webview.start(extraer_dom)
