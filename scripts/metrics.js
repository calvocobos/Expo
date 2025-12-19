// scripts/metrics.js
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const url = 'https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a';

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // sin interfaz gráfica
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Navega a la página y espera que la SPA termine de cargar
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Espera extra para que el contenido de métricas aparezca
    await page.waitForTimeout(5000);

    // Extrae visitas y descargas usando el texto cercano
    const metrics = await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      
      const visitasLabel = spans.find(s => s.textContent.includes('Visitas en los últimos 30 días'));
      const descargasLabel = spans.find(s => s.textContent.includes('Descargas en los últimos 30 días'));

      const visits = visitasLabel?.previousElementSibling?.innerText || '0';
      const downloads = descargasLabel?.previousElementSibling?.innerText || '0';

      return {
        visits,
        downloads,
        date: new Date().toISOString()
      };
    });

    // Guarda el JSON
    fs.writeFileSync('metrics.json', JSON.stringify(metrics, null, 2));

    console.log('✅ Métricas actualizadas:', metrics);

  } catch (err) {
    console.error('❌ Error scraping metrics:', err);
    process.exit(1); // marca error para GitHub Actions
  } finally {
    if (browser) await browser.close();
  }
})();
