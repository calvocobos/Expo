import json
from pathlib import Path

ARCHIVO_MAESTRO = "incrementos_por_dia.json"
ARCHIVO_OSF = "Osf_revisames.json"


def cargar_json(path):
    if not Path(path).exists():
        return {}
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def guardar_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# 1️⃣ Cargar maestro
maestro = cargar_json(ARCHIVO_MAESTRO)
incrementos = maestro.setdefault("incrementos_por_dia", {})

# 2️⃣ Cargar OSF
osf = cargar_json(ARCHIVO_OSF)


# 3️⃣ Integración incremental (relleno de huecos)
for item in osf.get("datos", []):
    fecha = item.get("date")
    count = item.get("count")

    # 👉 fecha debe existir
    if fecha not in incrementos:
        continue

    # 👉 si ya existe osf → NO TOCAR
    if "osf" in incrementos[fecha]:
        continue

    # 👉 crear solo la rama faltante
    incrementos[fecha]["osf"] = {
        "visitas_dia": int(count)
    }


# 4️⃣ Guardar (reescribe archivo, pero SIN modificar datos existentes)
guardar_json(ARCHIVO_MAESTRO, maestro)

print("✔ OSF integrado rellenando huecos (sin modificar nada existente)")
