"""
UAC	✅ ventana móvil 30 días (igual que tu código)
Zenodo	✅ delta simple día a día
SUNEDU	✅ delta simple (solo visitas)
Estructura	✅ visitas / descargas
Negativos	✅ se corrigen a 0
Aparición tardía	✅ desde 2025-12-23
"""

import json
from datetime import datetime, timedelta
from pathlib import Path

ARCHIVO_ENTRADA = "extraido_json_visitas.json"
ARCHIVO_SALIDA = "incrementos_por_dia.json"
VENTANA_DIAS = 30


def cargar_json(path, default):
    if Path(path).exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return default


def guardar_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def parsear_fecha_segura(fecha_str):
    y, m, d = fecha_str.split("-")
    return datetime.strptime(f"{y}-{m.zfill(2)}-{d.zfill(2)}", "%Y-%m-%d")


def main():
    data = cargar_json(ARCHIVO_ENTRADA, {"registros": {}})
    registros = data.get("registros", {})

    if not registros:
        print("No hay registros para procesar.")
        return

    fechas = sorted(registros.keys())
    fechas_dt = [parsear_fecha_segura(f) for f in fechas]

    incrementos = {}

    for i, fecha in enumerate(fechas):
        incremento_dia = {}

        # ========= UAC y ZENODO =========
        for fuente in ["uac", "zenodo"]:
            if fuente not in registros[fecha]:
                continue

            visitas_hoy = registros[fecha][fuente]["visitas"]
            descargas_hoy = registros[fecha][fuente]["descargas"]

            if i == 0 or fuente not in registros[fechas[i - 1]]:
                inc_visitas = visitas_hoy
                inc_descargas = descargas_hoy
            else:
                ayer = registros[fechas[i - 1]][fuente]
                delta_visitas = visitas_hoy - ayer["visitas"]
                delta_descargas = descargas_hoy - ayer["descargas"]

                # 🔹 ZENODO → delta simple
                if fuente == "zenodo":
                    inc_visitas = delta_visitas
                    inc_descargas = delta_descargas

                # 🔹 UAC → ventana móvil 30 días (MISMA LÓGICA TUYA)
                else:
                    fecha_actual_dt = fechas_dt[i]
                    fecha_30_dt = fecha_actual_dt - timedelta(days=VENTANA_DIAS)
                    fecha_30_str = fecha_30_dt.strftime("%Y-%m-%d")

                    if fecha_30_str in incrementos:
                        inc_visitas = delta_visitas + incrementos[fecha_30_str]["uac"]["visitas_dia"]
                        inc_descargas = delta_descargas + incrementos[fecha_30_str]["uac"]["descargas_dia"]
                    else:
                        inc_visitas = delta_visitas
                        inc_descargas = delta_descargas

            incremento_dia[fuente] = {
                "visitas_dia": max(int(inc_visitas), 0),
                "descargas_dia": max(int(inc_descargas), 0)
            }

        # ========= SUNEDU =========
        if "sunedu" in registros[fecha]:
            visitas_hoy = registros[fecha]["sunedu"]["visitas"]

            if i == 0 or "sunedu" not in registros[fechas[i - 1]]:
                inc_visitas = visitas_hoy
            else:
                visitas_ayer = registros[fechas[i - 1]]["sunedu"]["visitas"]
                inc_visitas = visitas_hoy - visitas_ayer

            incremento_dia["sunedu"] = {
                "visitas_dia": max(int(inc_visitas), 0)
            }

        incrementos[fecha] = incremento_dia

    guardar_json(ARCHIVO_SALIDA, {"incrementos_por_dia": incrementos})
    print("incrementos_por_dia.json generado correctamente.")


if __name__ == "__main__":
    main()
