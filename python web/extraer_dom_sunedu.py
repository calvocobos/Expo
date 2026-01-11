import webview
import time

URL = "https://renati.sunedu.gob.pe/handle/renati/4844187"

def extraer_dom():
    # 1️⃣ Maximizar ventana
    window.maximize()
    print("🟢 Ventana maximizada")

    # 2️⃣ Esperar carga inicial (RENATI usa JS pesado)
    time.sleep(8)
    print("🟢 Página principal cargada")

    # 3️⃣ Scroll hasta el final de la página
    window.evaluate_js("""
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    """)
    print("🟢 Scroll al final ejecutado")

    # 4️⃣ Esperar que termine el scroll
    time.sleep(3)

    # 5️⃣ Click en el botón de estadísticas
    window.evaluate_js("""
        const btn = document.querySelector(
            'a.statisticsLink.btn.btn-primary'
        );
        if (btn) {
            btn.click();
            true;
        } else {
            false;
        }
    """)
    print("🟢 Click en botón de estadísticas")

    # 6️⃣ Esperar carga de la página /statistics
    time.sleep(5)
    print("🟢 Página de estadísticas cargada")

    # 7️⃣ Extraer DOM y texto
    html = window.evaluate_js("document.documentElement.outerHTML")
    texto = window.evaluate_js("document.body.innerText")

    with open("extraido_dom_sunedu.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("extraido_txt_sunedu.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    print("✔ extraido_dom_sunedu.html creado")
    print("✔ extraido_txt_sunedu.txt creado")

    # 8️⃣ Esperar un momento y cerrar
    time.sleep(5)
    window.destroy()
    print("🔴 Navegador cerrado")

# Crear ventana
window = webview.create_window(
    title="RENATI SUNEDU",
    url=URL,
    width=1200,
    height=800
)

# Iniciar
webview.start(extraer_dom)
