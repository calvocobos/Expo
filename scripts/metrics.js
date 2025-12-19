const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  try {
    // Abre navegador headless
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Navega a la URL final
    const url = 'https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a';
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Espera que los elementos estén visibles
    await page.waitForSelector('span.MuiTypography-root.MuiTypography-h2');

    // Extrae las métricas
    const metrics = await page.evaluate(() => {
      const spans = document.querySelectorAll('span.MuiTypography-root.MuiTypography-h2');
      const visits = spans[0]?.innerText || '0';
      const downloads = spans[1]?.innerText || '0';
      return { visits, downloads, date: new Date().toISOString() };
    });

    // Guarda en JSON
    fs.writeFileSync('metrics.json', JSON.stringify(metrics, null, 2));
    console.log('✅ Metrics guardadas:', metrics);

    await browser.close();
  } catch (error) {
    console.error('❌ Error scraping metrics:', error);
    process.exit(1);
  }
})();
