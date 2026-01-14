import json

ARCHIVO_MAESTRO = "incrementos_por_dia.json"
ARCHIVO_OSF = "Osf_revisames.json"

# 1️⃣ Cargar JSON maestro
with open(ARCHIVO_MAESTRO, "r", encoding="utf-8") as f:
    maestro = json.load(f)

incrementos = maestro.get("incrementos_por_dia", {})

# 2️⃣ Cargar OSF
with open(ARCHIVO_OSF, "r", encoding="utf-8") as f:
    osf = json.load(f)

# 3️⃣ Integración estricta
for item in osf.get("datos", []):
    fecha = item["date"]
    count = item["count"]

    # 👉 Si la fecha NO existe → ignorar
    if fecha not in incrementos:
        continue

    # 👉 Si ya existe osf → NO sobrescribir
    if "osf" in incrementos[fecha]:
        continue

    # 👉 Fecha existe y osf NO existe → crear rama
    incrementos[fecha]["osf"] = {
        "visitas_dia": count
    }

# 4️⃣ Guardar
with open(ARCHIVO_MAESTRO, "w", encoding="utf-8") as f:
    json.dump(maestro, f, indent=2, ensure_ascii=False)

print("✔ OSF integrado sin sobrescribir ni crear fechas nuevas")
