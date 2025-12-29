const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Ruta del index.html (fuera de la carpeta ghaction)
const INDEX_PATH = path.join(__dirname, '..', 'index.html');

// Leer el HTML
const html = fs.readFileSync(INDEX_PATH, 'utf-8');

// Cargar con Cheerio
const $ = cheerio.load(html);

// Extraer todas las secciones con id
const sections = [];
$('section[id]').each((i, el) => {
  sections.push({
    id: $(el).attr('id'),
    title: $(el).attr('title') || '' // opcional, si quieres rescatar title
  });
});

// Ruta del JSON de salida
const OUTPUT_PATH = path.join(__dirname, 'sections.json');

// Guardar JSON
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sections, null, 2), 'utf-8');

console.log(`✅ sections.json creado con ${sections.length} secciones`);
