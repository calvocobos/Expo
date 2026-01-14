import json
from pathlib import Path

# ---------------- CONFIG ----------------
ARCHIVOS = {
    "uac": "UAC_lectura.json",
    "zenodo": "Zenodo_lectura.json",
    "sunedu": "Sunedu_lectura.json"
}

CAMPOS = {
    "uac": ["visitas", "descargas"],
    "zenodo": ["visitas", "descargas"],
    "sunedu": ["visitas"]
}

SALIDA = "Recopila_ramas.json"


# ---------------- UTILS ----------------
def cargar_json(ruta, default):
    if not Path(ruta).exists():
        return default
    with open(ruta, "r", encoding="utf-8") as f:
        return json.load(f)


def cargar_registros_fuente(ruta):
    if not Path(ruta).exists():
        return {}
    with open(ruta, "r", encoding="utf-8") as f:
        return json.load(f).get("registros", {})


# ---------------- CARGA ----------------
resultado = cargar_json(SALIDA, {"registros": {}})
datos_fuente = {
    fuente: cargar_registros_fuente(ruta)
    for fuente, ruta in ARCHIVOS.items()
}


# ---------------- FUSIÓN INCREMENTAL ----------------
for fuente, registros in datos_fuente.items():
    for fecha, contenido in registros.items():

        # Crear fecha si no existe
        if fecha not in resultado["registros"]:
            resultado["registros"][fecha] = {}

        # Si la fuente ya existe → NO TOCAR
        if fuente in resultado["registros"][fecha]:
            continue

        # Si la fuente NO existe pero hay datos → agregar
        salida = {}
        for campo in CAMPOS[fuente]:
            salida[campo] = contenido.get(fuente, {}).get(campo, 0)

        salida["origen"] = "directo"
        resultado["registros"][fecha][fuente] = salida


# ---------------- GUARDAR ----------------
with open(SALIDA, "w", encoding="utf-8") as f:
    json.dump(resultado, f, indent=2, ensure_ascii=False)

print("✅ Fusión incremental completada sin sobrescritura")
