import fs from "fs";

const OAI_ID = "oai:repositorio.uandina.edu.pe:20.500.12557/8558";
const HANDLE = "20.500.12557/8558";
const TITLE =
  "Desarrollo de un sistema de información web para la administración de los procesos de registro, atención, inventario y finanzas del consultorio odontológico Lalysdent del distrito de Cusco";

async function exists(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

// Verificar Google Académico buscando el título en los resultados
async function checkGoogleScholar(title) {
  try {
    const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (!res.ok) return false;

    const html = await res.text();
    // Verifica si el título exacto aparece en el HTML
    return html.includes(title);
  } catch {
    return false;
  }
}

async function run() {
  const result = {
    fecha: new Date().toISOString(),
    identificador: HANDLE,
    oai_id: OAI_ID,
    indexacion: {
      alicia: false,
      renati: false,
      la_referencia: false,
      google_academico: false
    }
  };

  // ======================
  // ALICIA (OAI-PMH)
  // ======================
  result.indexacion.alicia = await exists(
    `https://alicia.concytec.gob.pe/oai/request?verb=GetRecord&metadataPrefix=oai_dc&identifier=${OAI_ID}`
  );

  // ======================
  // RENATI (OAI-PMH)
  // ======================
  result.indexacion.renati = await exists(
    `https://renati.sunedu.gob.pe/oai/request?verb=GetRecord&metadataPrefix=oai_dc&identifier=${OAI_ID}`
  );

  // ======================
  // La Referencia (API)
  // ======================
  result.indexacion.la_referencia = await exists(
    `https://api.lareferencia.info/v1/search?q=${HANDLE}`
  );

  // ======================
  // Google Académico
  // ======================
  result.indexacion.google_academico = await checkGoogleScholar(TITLE);

  // ======================
  // Guardar resultado
  // ======================
  fs.mkdirSync("metrics", { recursive: true });
  fs.writeFileSync(
    "metrics/indexing.json",
    JSON.stringify(result, null, 2)
  );

  console.log("✔ Indexación verificada correctamente");
  console.log(result);
}

run();
