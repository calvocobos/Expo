import json
import re
from datetime import date, timedelta
from pathlib import Path

# ======================
# Configuración
# ======================
TXT_FILE = "Zenodo_contenido2.txt"
JSON_FILE = "Zenodo_lectura.json"
HOY = date.today()
AYER = (HOY - timedelta(days=1)).isoformat()
HOY = HOY.isoformat()

# ======================
# Utilidades
# ======================
def leer_txt(ruta):
    with open(ruta, "r", encoding="utf-8") as f:
        return f.read()

def cargar_json(ruta):
    if Path(ruta).exists():
        with open(ruta, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"registros": {}}

def guardar_json(ruta, data):
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def obtener_valores_anteriores(data):
    if AYER in data["registros"] and "zenodo" in data["registros"][AYER]:
        return (
            data["registros"][AYER]["zenodo"]["visitas"],
            data["registros"][AYER]["zenodo"]["descargas"]
        )
    return 0, 0

# ======================
# Extraer Zenodo
# ======================
def extraer_zenodo(texto, data):
    visitas_match = re.search(r"(\d+)\s*VIEWS", texto, re.IGNORECASE)
    descargas_match = re.search(r"(\d+)\s*DOWNLOADS", texto, re.IGNORECASE)

    if visitas_match and descargas_match:
        return {
            "visitas": int(visitas_match.group(1)),
            "descargas": int(descargas_match.group(1)),
            "estado": "ok"
        }

    # 🔁 Fallback: copiar valores anteriores
    visitas_ant, descargas_ant = obtener_valores_anteriores(data)

    return {
        "visitas": visitas_ant,
        "descargas": descargas_ant,
        "estado": "error"
    }

# ======================
# Ejecución principal
# ======================
data = cargar_json(JSON_FILE)

if HOY not in data["registros"]:
    data["registros"][HOY] = {}

texto = leer_txt(TXT_FILE)
metricas = extraer_zenodo(texto, data)

data["registros"][HOY]["zenodo"] = metricas

guardar_json(JSON_FILE, data)

print("✔ Zenodo procesado")
print(f"   Fecha: {HOY}")
print(f"   Visitas: {metricas['visitas']}")
print(f"   Descargas: {metricas['descargas']}")
print(f"   Estado: {metricas['estado']}")
