const path = require('path');
const playwrightPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', '@playwright', 'test', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = 'http://localhost:5174';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Click continue to go to step 1
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(1000);
  
  // Check for selects
  const selects = await page.$$eval('select', els => els.map(el => ({
    id: el.id,
    name: el.name,
    bg: getComputedStyle(el).backgroundColor,
    color: getComputedStyle(el).color,
    outerHTML: el.outerHTML.slice(0, 200)
  })));
  
  console.log('Selects:', JSON.stringify(selects, null, 2));
  
  await browser.close();
})();
