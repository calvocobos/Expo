import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DESCARGAS_FILE = os.path.join(
    BASE_DIR, "UAC_jsons", "actual", "interceptado_query_2.json"
)
VISITAS_FILE = os.path.join(
    BASE_DIR, "UAC_jsons", "actual", "interceptado_query_3.json"
)
LECTURA_REAL_FILE = os.path.join(
    BASE_DIR, "UAC_lectura_real.json"
)
OUTPUT_FILE = os.path.join(
    BASE_DIR, "UAC_totales.json"
)


def cargar_json(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"No existe el archivo: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def sumar_fuente(data):
    total = 0
    for r in data.get("results", []):
        total += r["metrics"][0]
    return total


def sumar_lectura_real(data):
    total_visitas = 0
    total_descargas = 0

    for _, info in data.get("registros", {}).items():
        uac = info.get("uac", {})
        total_visitas += uac.get("visitas", 0)
        total_descargas += uac.get("descargas", 0)

    return total_visitas, total_descargas


# 1️⃣ Cargar datos
descargas_raw = cargar_json(DESCARGAS_FILE)
visitas_raw   = cargar_json(VISITAS_FILE)
lectura_real  = cargar_json(LECTURA_REAL_FILE)

# 2️⃣ Calcular totales
totales_fuente = {
    "visitas": sumar_fuente(visitas_raw),
    "descargas": sumar_fuente(descargas_raw)
}

vis_hist, desc_hist = sumar_lectura_real(lectura_real)

totales_historico = {
    "visitas": vis_hist,
    "descargas": desc_hist
}

# 3️⃣ Construir JSON final
salida = {
    "uac": {
        "fuentes_ultimos_30_dias": totales_fuente,
        "historico_desde_2025_12_18": totales_historico
    }
}

# 4️⃣ Guardar
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(salida, f, ensure_ascii=False, indent=2)

print("✅ UAC_totales.json generado correctamente")
