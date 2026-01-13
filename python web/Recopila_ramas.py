import json
from pathlib import Path
from datetime import datetime

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
def cargar_registros(ruta):
    if not Path(ruta).exists():
        return {}
    with open(ruta, "r", encoding="utf-8") as f:
        return json.load(f).get("registros", {})


# ---------------- CARGA ----------------
datos = {k: cargar_registros(v) for k, v in ARCHIVOS.items()}

# todas las fechas existentes
fechas = set()
for fuente in datos.values():
    fechas.update(fuente.keys())

fechas = sorted(fechas, key=lambda x: datetime.strptime(x, "%Y-%m-%d"))


# ---------------- PROCESO ----------------
resultado = {"registros": {}}

# memoria por fuente
ultimo_valor = {
    fuente: {campo: 0 for campo in CAMPOS[fuente]}
    for fuente in CAMPOS
}

for fecha in fechas:
    resultado["registros"][fecha] = {}

    for fuente in CAMPOS:
        entrada_fuente = datos.get(fuente, {}).get(fecha)
        salida = {}
        origen = "inicial"

        if entrada_fuente:
            origen = "directo"
            for campo in CAMPOS[fuente]:
                valor = entrada_fuente.get(fuente, {}).get(campo, 0)
                salida[campo] = valor
                ultimo_valor[fuente][campo] = valor
        else:
            origen = "copiado"
            for campo in CAMPOS[fuente]:
                salida[campo] = ultimo_valor[fuente][campo]

        salida["origen"] = origen
        resultado["registros"][fecha][fuente] = salida


# ---------------- GUARDAR ----------------
with open(SALIDA, "w", encoding="utf-8") as f:
    json.dump(resultado, f, indent=2, ensure_ascii=False)

print(f"✅ Archivo generado correctamente: {SALIDA}")
