import json
from datetime import datetime, timedelta
from pathlib import Path

ARCHIVO_ENTRADA = "visitas_descargas.json"
ARCHIVO_SALIDA = "incrementos_diarios.json"
VENTANA_DIAS = 30


def cargar_json(path, default):
    if Path(path).exists():
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return default


def guardar_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def main():
    data_cruda = cargar_json(ARCHIVO_ENTRADA, {"registros": {}})
    registros = data_cruda.get("registros", {})

    if not registros:
        print("No hay registros para procesar.")
        return

    # Ordenar fechas
    fechas = sorted(registros.keys())
    fechas_dt = [datetime.strptime(f, "%Y-%m-%d") for f in fechas]

    incrementos = {}

    for i, fecha in enumerate(fechas):
        visitas_hoy = registros[fecha]["visitas_30d"]
        descargas_hoy = registros[fecha]["descargas_30d"]

        if i == 0:
            # Primer día: todo se considera incremento
            inc_visitas = visitas_hoy
            inc_descargas = descargas_hoy
        else:
            fecha_ayer = fechas[i - 1]
            visitas_ayer = registros[fecha_ayer]["visitas_30d"]
            descargas_ayer = registros[fecha_ayer]["descargas_30d"]

            delta_visitas = visitas_hoy - visitas_ayer
            delta_descargas = descargas_hoy - descargas_ayer

            fecha_actual_dt = fechas_dt[i]
            fecha_30_dt = fecha_actual_dt - timedelta(days=VENTANA_DIAS)
            fecha_30_str = fecha_30_dt.strftime("%Y-%m-%d")

            if fecha_30_str in incrementos:
                # Corrección por ventana móvil
                inc_visitas = delta_visitas + incrementos[fecha_30_str]["visitas_dia"]
                inc_descargas = delta_descargas + incrementos[fecha_30_str]["descargas_dia"]
            else:
                # Aún no hay 30 días de historial
                inc_visitas = max(delta_visitas, 0)
                inc_descargas = max(delta_descargas, 0)

        # Nunca negativos
        inc_visitas = max(int(inc_visitas), 0)
        inc_descargas = max(int(inc_descargas), 0)

        incrementos[fecha] = {
            "visitas_dia": inc_visitas,
            "descargas_dia": inc_descargas
        }

    guardar_json(ARCHIVO_SALIDA, {"incrementos_diarios": incrementos})
    print("incrementos_diarios.json generado correctamente.")


if __name__ == "__main__":
    main()
