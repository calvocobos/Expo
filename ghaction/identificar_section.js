const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(INDEX_PATH, 'utf-8');
const $ = cheerio.load(html);

// Palabras cortas que no se capitalizan
const LOWERCASE_WORDS = ['de', 'a', 'la', 'y', 'en'];

// Mapa de palabras frecuentes a su forma con acento
const ACCENTS_MAP = {
  'Informacion': 'Información',
  'Presentacion': 'Presentación',
  'Sustemtacion': 'Sustemtación',
  'Colacion': 'Colación',
  'Abstrac': 'Abstract',
  'Metodos': 'Métodos',
  'Estadisticas': 'Estadísticas',
  'Graficas': 'Gráficas',
  'Normas': 'Normas',
  'Internacional': 'Internacional',
  'Licencia': 'Licencia',
  'Iso': 'ISO',
  'Iec': 'IEC'
};

// Función para formatear nombre desde id
function formatName(id) {
  const words = id.split('-').map(word => {
    word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    if (LOWERCASE_WORDS.includes(word.toLowerCase())) return word.toLowerCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  let nombre = words.join(' ');

  // Reemplazar palabras por su versión con acento
  for (const key in ACCENTS_MAP) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    nombre = nombre.replace(regex, ACCENTS_MAP[key]);
  }

  return nombre;
}

// Extraer secciones con id
const sections = [];
$('section[id]').each((i, el) => {
  const id = $(el).attr('id');
  const nombre = formatName(id);

  let titulo = $(el).find('h1').first().text().trim();
  if (!titulo) titulo = $(el).find('h2').first().text().trim();

  sections.push({ id, nombre, titulo });
});

// Guardar JSON
const OUTPUT_PATH = path.join(__dirname, 'sections.json');
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sections, null, 2), 'utf-8');

console.log(`✅ sections.json actualizado con ${sections.length} secciones`);
