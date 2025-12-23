import json
from pathlib import Path

INPUT_JSON = "visitas_descargas.json"
OUTPUT_JSON = "totales.json"

# Cargar datos
if not Path(INPUT_JSON).exists():
    raise FileNotFoundError("No existe visitas_descargas.json")

with open(INPUT_JSON, "r", encoding="utf-8") as f:
    data = json.load(f)

registros = data.get("registros", {})

if not registros:
    raise ValueError("No hay registros para procesar")

# Ordenar fechas
fechas = sorted(registros.keys())

# Inicializar
total_visitas = 0
total_descargas = 0

prev_visitas = None
prev_descargas = None

for fecha in fechas:
    visitas = registros[fecha]["visitas_30d"]
    descargas = registros[fecha]["descargas_30d"]

    if prev_visitas is None:
        total_visitas = visitas
        total_descargas = descargas
    else:
        if visitas > prev_visitas:
            total_visitas += visitas - prev_visitas
        if descargas > prev_descargas:
            total_descargas += descargas - prev_descargas

    prev_visitas = visitas
    prev_descargas = descargas

# Guardar totales
resultado = {
    "total_visitas": total_visitas,
    "total_descargas": total_descargas,
    "desde": fechas[0],
    "hasta": fechas[-1]
}

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(resultado, f, indent=2, ensure_ascii=False)

print("Totales calculados correctamente")
