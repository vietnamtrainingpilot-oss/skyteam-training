const path = require('path');
const playwrightPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', '@playwright', 'test', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = 'http://localhost:5174';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);
  
  // Get page content
  const content = await page.content();
  console.log('Page URL:', page.url());
  console.log('Content length:', content.length);
  console.log('--- First 2000 chars ---');
  console.log(content.slice(0, 2000));
  
  await browser.close();
})();
