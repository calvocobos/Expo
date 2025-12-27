import json
from pathlib import Path

ARCHIVO_ENTRADA = "incrementos_por_dia.json"
ARCHIVO_SALIDA = "totales_acumulados.json"


def cargar_json(path, default):
    if Path(path).exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return default


def guardar_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def main():
    data = cargar_json(ARCHIVO_ENTRADA, {"incrementos_por_dia": {}})
    registros = data.get("incrementos_por_dia", {})

    if not registros:
        print("No hay incrementos para procesar.")
        return

    totales = {
        "uac": {"visitas": 0, "descargas": 0},
        "zenodo": {"visitas": 0, "descargas": 0},
        "global": {"visitas": 0, "descargas": 0}
    }

    for fecha, fuentes in registros.items():
        for fuente in ["uac", "zenodo"]:
            v = fuentes[fuente]["visitas_dia"]
            d = fuentes[fuente]["descargas_dia"]

            totales[fuente]["visitas"] += v
            totales[fuente]["descargas"] += d

            totales["global"]["visitas"] += v
            totales["global"]["descargas"] += d

    guardar_json(ARCHIVO_SALIDA, {"totales": totales})
    print("totales_acumulados.json generado correctamente.")


if __name__ == "__main__":
    main()
