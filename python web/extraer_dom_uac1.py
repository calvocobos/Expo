import webview
import time

URL = "https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a"

def extraer_dom():
    # esperar a que cargue React/Vue
    time.sleep(15)

    # DOM real (como F12)
    html = window.evaluate_js("document.documentElement.outerHTML")
    texto = window.evaluate_js("document.body.innerText")

    with open("extraido_dom_uac.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("extraido_txt_uac.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    # 🔴 CERRAR EL NAVEGADOR
    window.destroy()

    print(" 1️⃣ extraido_dom_uac.html ✔ creado")
    print(" 1️⃣ extraido_txt_uac.txt ✔ creado")

window = webview.create_window(
    "Repositorio UAC",
    URL,
    width=1200,
    height=800
)

webview.start(extraer_dom)
