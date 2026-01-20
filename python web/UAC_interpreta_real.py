import json
import os
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DESCARGAS_FILE = os.path.join(
    BASE_DIR, "UAC_jsons", "actual", "interceptado_query_2.json"
)
VISITAS_FILE = os.path.join(
    BASE_DIR, "UAC_jsons", "actual", "interceptado_query_3.json"
)
OUTPUT_FILE = os.path.join(BASE_DIR, "UAC_lectura_real.json")

FECHA_INICIO = "2025-12-18"


def cargar_json(path, default):
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return default


def extraer_por_fecha(data):
    salida = {}
    for r in data.get("results", []):
        fecha = r["dimensions"][0]
        valor = r["metrics"][0]
        salida[fecha] = valor
    return salida


def rango_fechas(inicio, fin):
    fechas = []
    actual = inicio
    while actual <= fin:
        fechas.append(actual.strftime("%Y-%m-%d"))
        actual += timedelta(days=1)
    return fechas


# 1️⃣ Cargar fuentes
descargas_raw = cargar_json(DESCARGAS_FILE, {})
visitas_raw   = cargar_json(VISITAS_FILE, {})

descargas = extraer_por_fecha(descargas_raw)
visitas   = extraer_por_fecha(visitas_raw)

# 2️⃣ Determinar rango completo de fechas
fecha_inicio = datetime.strptime(FECHA_INICIO, "%Y-%m-%d")

fechas_fuente = list(descargas.keys()) + list(visitas.keys())
fecha_fin = datetime.strptime(max(fechas_fuente), "%Y-%m-%d")

todas_las_fechas = rango_fechas(fecha_inicio, fecha_fin)

# 3️⃣ Cargar archivo destino
salida = cargar_json(OUTPUT_FILE, {"registros": {}})
registros = salida.setdefault("registros", {})

# 4️⃣ Construir / actualizar registros diarios
for fecha in todas_las_fechas:
    registros.setdefault(fecha, {})
    registros[fecha].setdefault("uac", {})

    # --- VISITAS ---
    valor_fuente_visitas = visitas.get(fecha, 0)
    valor_actual_visitas = registros[fecha]["uac"].get("visitas")

    if valor_actual_visitas is None:
        registros[fecha]["uac"]["visitas"] = valor_fuente_visitas
    elif valor_fuente_visitas > valor_actual_visitas:
        registros[fecha]["uac"]["visitas"] = valor_fuente_visitas

    # --- DESCARGAS ---
    valor_fuente_descargas = descargas.get(fecha, 0)
    valor_actual_descargas = registros[fecha]["uac"].get("descargas")

    if valor_actual_descargas is None:
        registros[fecha]["uac"]["descargas"] = valor_fuente_descargas
    elif valor_fuente_descargas > valor_actual_descargas:
        registros[fecha]["uac"]["descargas"] = valor_fuente_descargas

# 5️⃣ Guardar
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(salida, f, ensure_ascii=False, indent=2)

print("✅ UAC_lectura_real.json actualizado aplicando regla de valor máximo")
