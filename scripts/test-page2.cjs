const path = require('path');
const playwrightPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', '@playwright', 'test', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
  
  // Wait for React to render
  await page.waitForTimeout(3000);
  
  // Get all inputs with their attributes
  const inputs = await page.$$eval('input', els => els.map(el => ({
    name: el.name,
    id: el.id,
    type: el.type,
    fontSize: getComputedStyle(el).fontSize,
    outerHTML: el.outerHTML.slice(0, 200)
  })));
  
  console.log('All inputs:', JSON.stringify(inputs, null, 2));
  
  await browser.close();
})();
