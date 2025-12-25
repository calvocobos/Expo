import fs from "fs";

// ======================
// Identificadores
// ======================
const OAI_ID = "oai:repositorio.uandina.edu.pe:20.500.12557/8558";
const HANDLE = "20.500.12557/8558";
const DOI_ZENODO = "10.5281/zenodo.18047949";

const TITLE =
  "Desarrollo de un sistema de información web para la administración de los procesos de registro, atención, inventario y finanzas del consultorio odontológico Lalysdent del distrito de Cusco";

// ======================
// Función de normalización
// ======================
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ======================
// Verificar existencia URL
// ======================
async function exists(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

// ======================
// Google Scholar (indicador)
// ======================
async function checkGoogleScholar(title) {
  try {
    const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (!res.ok) return false;

    const html = await res.text();
    return normalizeText(html).includes(normalizeText(title));
  } catch {
    return false;
  }
}

// ======================
// Proceso principal
// ======================
async function run() {
  const result = {
    fecha: new Date().toISOString(),

    repositorio_origen: {
      identificador: HANDLE,
      oai_id: OAI_ID,
      indexacion: {
        alicia: false,
        renati: false,
        la_referencia: false
      }
    },

    zenodo: {
      doi: DOI_ZENODO,
      publicado: false,
      openaire: false,
      base: false,
      la_referencia_indirecto: false
    },

    motores_busqueda: {
      google_academico: false
    }
  };

  // ======================
  // Repositorio UAndina
  // ======================
  result.repositorio_origen.indexacion.alicia = await exists(
    `https://alicia.concytec.gob.pe/oai/request?verb=GetRecord&metadataPrefix=oai_dc&identifier=${OAI_ID}`
  );

  result.repositorio_origen.indexacion.renati = await exists(
    `https://renati.sunedu.gob.pe/oai/request?verb=GetRecord&metadataPrefix=oai_dc&identifier=${OAI_ID}`
  );

  result.repositorio_origen.indexacion.la_referencia = await exists(
    `https://api.lareferencia.info/v1/search?q=${HANDLE}`
  );

  // ======================
  // Zenodo (publicación)
  // ======================
  result.zenodo.publicado = await exists(
    `https://doi.org/${DOI_ZENODO}`
  );

  result.zenodo.openaire = await exists(
    `https://api.openaire.eu/search/publications?doi=${DOI_ZENODO}`
  );

  result.zenodo.base = await exists(
    `https://www.base-search.net/Search/Results?lookfor=${DOI_ZENODO}&type=all`
  );

  result.zenodo.la_referencia_indirecto = await exists(
    `https://api.lareferencia.info/v1/search?q=${DOI_ZENODO}`
  );

  // ======================
  // Google Scholar
  // ======================
  result.motores_busqueda.google_academico =
    await checkGoogleScholar(TITLE);

  // ======================
  // Guardar métricas
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
