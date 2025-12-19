import fetch from 'node-fetch';
import { writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';

const url = 'https://hdl.handle.net/20.500.12557/8558';

(async () => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const dom = new JSDOM(html);

    // Seleccionamos todos los spans con clase h2
    const spans = dom.window.document.querySelectorAll('span.MuiTypography-root.MuiTypography-h2.css-zwdolo');

    const visitas = spans[0]?.textContent || '0';
    const descargas = spans[1]?.textContent || '0';

    const data = { visitas, descargas, lastUpdated: new Date().toISOString() };

    // Guardar en metrics.json
    writeFileSync('metrics.json', JSON.stringify(data, null, 2));

    console.log('Datos actualizados:', data);
  } catch (err) {
    console.error('Error al obtener métricas:', err);
  }
})();
