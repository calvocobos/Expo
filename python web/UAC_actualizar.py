import json

INCREMENTOS_FILE = "incrementos_por_dia.json"
UAC_REAL_FILE = "UAC_lectura_real.json"

# Cargar incrementos_por_dia.json
with open(INCREMENTOS_FILE, "r", encoding="utf-8") as f:
    incrementos = json.load(f)

# Cargar UAC_lectura_real.json
with open(UAC_REAL_FILE, "r", encoding="utf-8") as f:
    uac_real = json.load(f)

incrementos_por_dia = incrementos.get("incrementos_por_dia", {})
registros_uac = uac_real.get("registros", {})

actualizados = 0
no_encontrados = 0

for fecha, datos_real in registros_uac.items():
    if fecha in incrementos_por_dia:
        # Asegurar rama uac
        incrementos_por_dia[fecha].setdefault("uac", {})

        incrementos_por_dia[fecha]["uac"]["visitas_dia"] = datos_real["uac"]["visitas"]
        incrementos_por_dia[fecha]["uac"]["descargas_dia"] = datos_real["uac"]["descargas"]

        actualizados += 1
    else:
        no_encontrados += 1

# Guardar SOBRE el mismo archivo
with open(INCREMENTOS_FILE, "w", encoding="utf-8") as f:
    json.dump(incrementos, f, indent=2, ensure_ascii=False)

print(f"✅ Fechas UAC actualizadas: {actualizados}")
print(f"⚠️ Fechas UAC no encontradas en incrementos: {no_encontrados}")
print("📁 incrementos_por_dia.json fue actualizado correctamente")
