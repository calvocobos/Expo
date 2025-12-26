import json
import re
from datetime import date
from pathlib import Path

# ======================
# Configuración
# ======================
JSON_FILE = "extraido_json_visitas.json"
HOY = date.today().isoformat()

FUENTES = {
    "uac": {
        "archivo": "extraido_txt_uac.txt",
        "visitas": r"(\d+)\s*Visitas en los últimos 30 días",
        "descargas": r"(\d+)\s*Descargas en los últimos 30 días",
    },
    "zenodo": {
        "archivo": "extraido_txt_zenodo.txt",
        "visitas": r"(\d+)\s*VIEWS",
        "descargas": r"(\d+)\s*DOWNLOADS",
    },
}

# ======================
# Funciones
# ======================
def leer_txt(ruta):
    with open(ruta, "r", encoding="utf-8") as f:
        return f.read()


def extraer_metricas(texto, patron_visitas, patron_descargas):
    visitas_match = re.search(patron_visitas, texto, re.IGNORECASE)
    descargas_match = re.search(patron_descargas, texto, re.IGNORECASE)

    if not visitas_match or not descargas_match:
        raise ValueError("No se pudieron extraer visitas o descargas")

    return {
        "visitas_30d": int(visitas_match.group(1)),
        "descargas_30d": int(descargas_match.group(1)),
    }


def cargar_json(ruta):
    if Path(ruta).exists():
        with open(ruta, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"registros": {}}


def guardar_json(ruta, data):
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# ======================
# Ejecución principal
# ======================
data = cargar_json(JSON_FILE)

if HOY not in data["registros"]:
    data["registros"][HOY] = {}

for fuente, cfg in FUENTES.items():
    texto = leer_txt(cfg["archivo"])
    metricas = extraer_metricas(
        texto,
        cfg["visitas"],
        cfg["descargas"]
    )

    data["registros"][HOY][fuente] = metricas

guardar_json(JSON_FILE, data)
print(f"Registro actualizado para {HOY}")
