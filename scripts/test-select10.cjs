const path = require('path');
const playwrightPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', '@playwright', 'test', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = 'http://localhost:5174';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  const content = await page.content();
  console.log('--- Find body ---');
  const bodyStart = content.indexOf('<body');
  if (bodyStart >= 0) {
    console.log(content.slice(bodyStart, bodyStart + 3000));
  }
  
  await browser.close();
})();
