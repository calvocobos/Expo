import json
import re
from datetime import date
from pathlib import Path

# ======================
# Configuración
# ======================
TXT_FILE = "Sunedu_contenido2.txt"
JSON_FILE = "Sunedu_lectura.json"
HOY = date.today().isoformat()

PATRON_VISITAS = r"(\d+)\s*Total de visitas por mes"

# ======================
# Utilidades
# ======================
def cargar_json(path):
    if Path(path).exists():
        return json.loads(Path(path).read_text(encoding="utf-8"))
    return {"registros": {}}

def guardar_json(path, data):
    Path(path).write_text(
        json.dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )

def leer_txt(path):
    return Path(path).read_text(encoding="utf-8")

def obtener_valor_anterior(registros, fecha_actual):
    fechas = sorted(registros.keys())
    if fecha_actual in fechas:
        fechas.remove(fecha_actual)
    if fechas:
        ultima = fechas[-1]
        return registros[ultima]["sunedu"]["visitas"]
    return 0

# ======================
# Proceso principal
# ======================
data = cargar_json(JSON_FILE)
data.setdefault("registros", {})
data["registros"].setdefault(HOY, {})

try:
    texto = leer_txt(TXT_FILE)
    match = re.search(PATRON_VISITAS, texto, re.IGNORECASE)

    if not match:
        raise ValueError("No se encontró el total de visitas")

    visitas = int(match.group(1))
    estado = "ok"

except Exception as e:
    visitas = obtener_valor_anterior(data["registros"], HOY)
    estado = "error"

# ======================
# Guardar resultado
# ======================
data["registros"][HOY]["sunedu"] = {
    "visitas": visitas,
    "estado": estado
}

guardar_json(JSON_FILE, data)

print("✔ Sunedu procesado")
print(f"   fecha   : {HOY}")
print(f"   visitas : {visitas}")
print(f"   estado  : {estado}")
