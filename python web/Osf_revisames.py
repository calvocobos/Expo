import requests
import json

NODE = "rqzdx"
RANGO = "month"

url = f"https://api.osf.io/_/metrics/query/node_analytics/{NODE}/{RANGO}/"

resultado = {
    "fuente": "osf",
    "node": NODE,
    "rango": "past_month",
    "datos": [],
    "estado": "ok"
}

try:
    r = requests.get(url, timeout=15)
    r.raise_for_status()

    data = r.json()
    resultado["datos"] = data["data"]["attributes"]["unique_visits"]

    print(f"✔ past_month: {len(resultado['datos'])} registros")

except Exception as e:
    resultado["estado"] = "error"
    resultado["error"] = str(e)
    print("❌ Error al obtener past_month")

with open("Osf_revisames.json", "w", encoding="utf-8") as f:
    json.dump(resultado, f, indent=2, ensure_ascii=False)

print("\n📁 Osf_revisames.json generado correctamente")
