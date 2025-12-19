import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.goto(
    "https://repositorio.uandina.edu.pe/item/a5a76dd6-ce00-47f1-8172-cde9c9661b1a",
    {
      waitUntil: "networkidle2",
      timeout: 60000
    }
  );

  // ⏳ Espera adicional para React / MUI
  await new Promise(resolve => setTimeout(resolve, 6000));

  // 🔍 DOM FINAL que ve Chromium en GitHub Actions
  const domFinal = await page.content();

  // 💾 Guardar DOM en archivo de texto (solo debug)
  fs.writeFileSync("doomleido.txt", domFinal, "utf8");

  // Mantener metrics.json mínimo para que el workflow siga funcionando
  const metrics = {
    visits: "DEBUG",
    downloads: "DEBUG",
    date: new Date().toISOString()
  };

  fs.writeFileSync(
    "metrics.json",
    JSON.stringify(metrics, null, 2),
    "utf8"
  );

  console.log("✅ DOM guardado en doomleido.txt");

  await browser.close();
})();
