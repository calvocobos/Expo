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
    partes = fecha_str.split("-")
    if len(partes) == 3:
        y, m, d = partes
        m = m.zfill(2)
        d = d.zfill(2)
        return datetime.strptime(f"{y}-{m}-{d}", "%Y-%m-%d")
    raise ValueError(f"Fecha inválida: {fecha_str}")

def main():
    data = cargar_json(ARCHIVO_ENTRADA, {"registros": {}})
    registros = data.get("registros", {})

    if not registros:
        print("No hay registros para procesar.")
        return

    # Ordenar fechas
    fechas = sorted(registros.keys())
    fechas_dt = [parsear_fecha_segura(f) for f in fechas]

    incrementos = {}

    for i, fecha in enumerate(fechas):
        incremento_dia = {}

        for fuente in ["uac", "zenodo"]:
            visitas_hoy = registros[fecha][fuente]["visitas_30d"]
            descargas_hoy = registros[fecha][fuente]["descargas_30d"]

            if i == 0:
                inc_visitas = visitas_hoy
                inc_descargas = descargas_hoy
            else:
                fecha_ayer = fechas[i - 1]
                visitas_ayer = registros[fecha_ayer][fuente]["visitas_30d"]
                descargas_ayer = registros[fecha_ayer][fuente]["descargas_30d"]

                delta_visitas = visitas_hoy - visitas_ayer
                delta_descargas = descargas_hoy - descargas_ayer

                # 🔹 ZENODO → acumulado total (sin corrección)
                if fuente == "zenodo":
                    inc_visitas = delta_visitas
                    inc_descargas = delta_descargas

                # 🔹 UAC → ventana móvil 30 días
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

        incrementos[fecha] = incremento_dia

    guardar_json(ARCHIVO_SALIDA, {"incrementos_por_dia": incrementos})
    print("incrementos_por_dia.json generado correctamente.")


if __name__ == "__main__":
    main()
