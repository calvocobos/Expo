import json
import re
from datetime import date
from pathlib import Path

# ======================
# Configuración
# ======================
JSON_FILE = "UAC_lectura.json"
HOY = date.today().isoformat()

TXT_UAC = [
    "UAC_contenido1.txt",
    "UAC_contenido2.txt"
]

PATRON_VISITAS = r"(\d+)\s*Visitas en los últimos 30 días"
PATRON_DESCARGAS = r"(\d+)\s*Descargas en los últimos 30 días"

# ======================
# Funciones
# ======================
def leer_txt(ruta):
    try:
        with open(ruta, "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return None


def extraer_metricas(texto):
    if not texto:
        return None

    visitas = re.search(PATRON_VISITAS, texto, re.IGNORECASE)
    descargas = re.search(PATRON_DESCARGAS, texto, re.IGNORECASE)

    if not visitas or not descargas:
        return None

    return {
        "visitas": int(visitas.group(1)),
        "descargas": int(descargas.group(1)),
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

# Crear rama del día siempre
if HOY not in data["registros"]:
    data["registros"][HOY] = {}

resultados_validos = []

for archivo in TXT_UAC:
    texto = leer_txt(archivo)
    metricas = extraer_metricas(texto)

    if metricas:
        metricas["fuente"] = archivo
        resultados_validos.append(metricas)
        print(f"✔ Datos válidos en {archivo}")
    else:
        print(f"⚠ Sin datos válidos en {archivo}")

# Resolver resultado final
if resultados_validos:
    visitas_final = max(r["visitas"] for r in resultados_validos)
    descargas_final = max(r["descargas"] for r in resultados_validos)
    estado = "ok"
    fuentes = [r["fuente"] for r in resultados_validos]
else:
    visitas_final = 0
    descargas_final = 0
    estado = "sin_datos"
    fuentes = []

# Guardar en JSON
data["registros"][HOY]["uac"] = {
    "visitas": visitas_final,
    "descargas": descargas_final,
    "estado": estado,
    "fuentes_validas": fuentes
}

guardar_json(JSON_FILE, data)

print("===================================")
print(f"✔ Registro UAC guardado para {HOY}")
print(f"✔ Visitas: {visitas_final}")
print(f"✔ Descargas: {descargas_final}")
print(f"✔ Estado: {estado}")
print("===================================")
