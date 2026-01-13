import requests
import json

NODE = "rqzdx"
RANGO = "week"

url = f"https://api.osf.io/_/metrics/query/node_analytics/{NODE}/{RANGO}/"

resultado = {
    "fuente": "osf",
    "node": NODE,
    "rango": "past_week",
    "datos": [],
    "estado": "ok"
}

try:
    r = requests.get(url, timeout=15)
    r.raise_for_status()

    data = r.json()
    resultado["datos"] = data["data"]["attributes"]["unique_visits"]

    print(f"✔ past_week: {len(resultado['datos'])} registros")

except Exception as e:
    resultado["estado"] = "error"
    resultado["error"] = str(e)
    print("❌ Error al obtener past_week")

with open("Osf_revisasemana.json", "w", encoding="utf-8") as f:
    json.dump(resultado, f, indent=2, ensure_ascii=False)

print("\n📁 Osf_revisasemana.json generado correctamente")
