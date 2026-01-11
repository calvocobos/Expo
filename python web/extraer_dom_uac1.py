import webview
import time

URL = "https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a"

def extraer_dom():
    # 1️⃣ Maximizar ventana
    window.maximize()
    print("🟢 Ventana maximizada")

    # 2️⃣ Esperar carga completa (React / Vue / JS)
    time.sleep(5)
    print("🟢 Página cargada")

    # 3️⃣ Scroll vertical al centro de la página
    window.evaluate_js("""
        const altura = document.body.scrollHeight;
        window.scrollTo({
            top: 600,
            behavior: 'smooth'
        });
    """)
    print("🟢 Scroll movido al centro")

    # 4️⃣ Esperar a que termine el scroll
    time.sleep(5)

    # 5️⃣ Extraer DOM real (como F12)
    html = window.evaluate_js("document.documentElement.outerHTML")
    texto = window.evaluate_js("document.body.innerText")

    with open("extraido_dom_uac.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("extraido_txt_uac.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    print("✔ extraido_dom_uac.html creado")
    print("✔ extraido_txt_uac.txt creado")

    # 6️⃣ Esperar unos segundos antes de cerrar
    time.sleep(5)

    # 🔴 Cerrar navegador
    window.destroy()
    print("🔴 Navegador cerrado")

# Crear ventana
window = webview.create_window(
    title="Repositorio UAC",
    url=URL,
    width=1200,
    height=800
)

# Iniciar aplicación
webview.start(extraer_dom)
