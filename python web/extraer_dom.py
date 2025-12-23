import webview
import time

URL = "https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a"

def extraer_dom():
    # esperar a que cargue React/Vue
    time.sleep(15)

    # DOM real (como F12)
    html = window.evaluate_js("document.documentElement.outerHTML")
    texto = window.evaluate_js("document.body.innerText")

    with open("dom_completo.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("contenido_visible.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    print("✔ dom_completo.html creado")
    print("✔ contenido_visible.txt creado")

window = webview.create_window(
    "Repositorio UAC",
    URL,
    width=1200,
    height=800
)

webview.start(extraer_dom)
