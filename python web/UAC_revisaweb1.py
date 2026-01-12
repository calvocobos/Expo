import webview
import time

URL = "https://calvocobos.github.io/Expo/referencias.html"

def extraer_dom():
    # 1️⃣ Maximizar ventana
    window.maximize()
    print("🟢 Ventana maximizada")

    # 2️⃣ Esperar carga completa de la página inicial
    time.sleep(5)
    print("🟢 Página de referencias cargada")

    # 3️⃣ Click en el enlace con id="ref-uac"
    window.evaluate_js("""
        const enlace = document.getElementById("ref-uac");
        if (enlace) {
            enlace.click();
        }
    """)
    print("🟢 Click en enlace ref-uac ejecutado")

    # 4️⃣ Esperar que cargue la nueva página
    time.sleep(5)
    print("🟢 Página UAC cargada")

    # 5️⃣ Scroll vertical (similar a tu ejemplo)
    window.evaluate_js("""
        window.scrollTo({
            top: 600,
            behavior: 'smooth'
        });
    """)
    print("🟢 Scroll movido al centro")

    # 6️⃣ Esperar que termine el scroll
    time.sleep(5)

    # 7️⃣ Extraer contenido renderizado final
    texto = window.evaluate_js("document.body.innerText")

    with open("UAC_contenido1.txt", "w", encoding="utf-8") as f:
        f.write(texto)

    print("✔  UAC_contenido1.txt creado")

    # 8️⃣ Esperar antes de cerrar
    time.sleep(5)

    # 🔴 Cerrar navegador
    window.destroy()
    print("🔴 Navegador cerrado")

# Crear ventana
window = webview.create_window(
    title="Referencias - UAC",
    url=URL,
    width=1200,
    height=800
)

# Iniciar aplicación
webview.start(extraer_dom)
