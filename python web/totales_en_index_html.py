import json
from pathlib import Path
from bs4 import BeautifulSoup

# ======================
# Rutas
# ======================
BASE_DIR = Path(__file__).resolve().parent        # python web/
JSON_FILE = BASE_DIR / "totales_acumulados.json"
HTML_FILE = BASE_DIR.parent / "index.html"       # HTML fuera de la carpeta

# ======================
# Leer JSON
# ======================
with open(JSON_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)["totales"]

# ======================
# Leer HTML
# ======================
html = HTML_FILE.read_text(encoding="utf-8")
soup = BeautifulSoup(html, "html.parser")

# ======================
# Función segura
# ======================
def actualizar(id_html, valor):
    tag = soup.find(id=id_html)
    if tag:
        tag.string = str(valor)

# ======================
# UAC
# ======================
actualizar("uac-visitas", data["uac"]["visitas"])
actualizar("uac-descargas", data["uac"]["descargas"])

# ======================
# ZENODO
# ======================
actualizar("zenodo-visitas", data["zenodo"]["visitas"])
actualizar("zenodo-descargas", data["zenodo"]["descargas"])

# ======================
# Guardar HTML
# ======================
HTML_FILE.write_text(str(soup), encoding="utf-8")

print("✔ Totales actualizados correctamente en index.html")
