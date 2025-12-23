import json
import re
from datetime import date
from pathlib import Path

# Archivos
TXT_FILE = "contenido_visible.txt"
JSON_FILE = "visitas_descargas.json"

# Fecha de hoy
hoy = date.today().isoformat()

# Leer contenido del txt
with open(TXT_FILE, "r", encoding="utf-8") as f:
    contenido = f.read()

# Extraer números
visitas_match = re.search(r"(\d+)\s*Visitas en los últimos 30 días", contenido)
descargas_match = re.search(r"(\d+)\s*Descargas en los últimos 30 días", contenido)

if not visitas_match or not descargas_match:
    raise ValueError("No se pudieron extraer visitas o descargas")

visitas = int(visitas_match.group(1))
descargas = int(descargas_match.group(1))

# Cargar o crear JSON
if Path(JSON_FILE).exists():
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
else:
    data = {"registros": {}}

# Guardar solo si la fecha no existe
if hoy not in data["registros"]:
    data["registros"][hoy] = {
        "visitas_30d": visitas,
        "descargas_30d": descargas
    }

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Registro guardado para {hoy}")
else:
    print(f"Ya existe registro para {hoy}, no se modificó nada")
