const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Ruta del index.html (fuera de la carpeta ghaction)
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

// Leer el HTML
const html = fs.readFileSync(INDEX_PATH, 'utf-8');

// Cargar con Cheerio
const $ = cheerio.load(html);

// Función para formatear id a nombre
function formatName(id) {
  return id
    .split('-')                // separar por guion
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalizar inicial
    .join(' ');                // unir con espacio
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

// Ruta del JSON de salida
const OUTPUT_PATH = path.join(__dirname, 'sections.json');

// Guardar JSON
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sections, null, 2), 'utf-8');

console.log(`✅ sections.json creado con ${sections.length} secciones`);
