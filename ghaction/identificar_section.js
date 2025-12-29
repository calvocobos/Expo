const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Ruta del index.html
const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(INDEX_PATH, 'utf-8');
const $ = cheerio.load(html);

// Palabras cortas que no deben capitalizarse
const LOWERCASE_WORDS = ['de', 'a', 'la', 'y', 'en'];

// Palabras comunes con acento para reemplazar
const ACCENTS_MAP = {
  'Informacion': 'Información',
  'Metodos': 'Métodos',
  'Estudio': 'Estudio'
};

// Función para formatear id a nombre
function formatName(id) {
  const words = id.split('-').map(word => {
    // Normalizar y eliminar acentos temporales
    word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
    // Capitalizar si no es palabra corta
    if (LOWERCASE_WORDS.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  let nombre = words.join(' ');

  // Aplicar acentos a palabras comunes
  for (const key in ACCENTS_MAP) {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    nombre = nombre.replace(regex, ACCENTS_MAP[key]);
  }

  return nombre;
}

// Extraer todas las secciones con id
const sections = [];
$('section[id]').each((i, el) => {
  const id = $(el).attr('id');
  const nombre = formatName(id);

  // Buscar primer h1 dentro de la sección
  let titulo = $(el).find('h1').first().text().trim();
  // Si no hay h1, usar primer h2
  if (!titulo) {
    titulo = $(el).find('h2').first().text().trim();
  }

  sections.push({ id, nombre, titulo });
});

// Guardar JSON
const OUTPUT_PATH = path.join(__dirname, 'sections.json');
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sections, null, 2), 'utf-8');

console.log(`✅ sections.json creado con ${sections.length} secciones`);
