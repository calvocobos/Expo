const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const url = 'https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a';

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle0' });

    // Espera extra compatible
    await new Promise(resolve => setTimeout(resolve, 5000));

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

    fs.writeFileSync('metrics.json', JSON.stringify(metrics, null, 2));

    console.log('✅ Métricas actualizadas:', metrics);

  } catch (err) {
    console.error('❌ Error scraping metrics:', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
