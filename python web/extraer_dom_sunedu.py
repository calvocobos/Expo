import webview
import time

URL = "https://renati.sunedu.gob.pe/handle/renati/4844187/statistics"

def extraer_dom():
    # esperar a que cargue React/Vue
    time.sleep(15)

    # DOM real (como F12)
    html = window.evaluate_js("document.documentElement.outerHTML")
    texto = window.evaluate_js("document.body.innerText")

    with open("extraido_dom_sunedu.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("extraido_txt_sunedu.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    # 🔴 CERRAR EL NAVEGADOR
    window.destroy()

    print("✔ extraido_dom_sunedu.html creado")
    print("✔ extraido_txt_sunedu.txt creado")

window = webview.create_window(
    "Repositorio UAC",
    URL,
    width=1200,
    height=800
)

webview.start(extraer_dom)
