const path = require('path');
const playwrightPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', '@playwright', 'test', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = 'http://localhost:5174';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`${BASE}/auth/signin`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  const content = await page.content();
  console.log('--- First 3000 chars ---');
  console.log(content.slice(0, 3000));
  
  await browser.close();
})();
