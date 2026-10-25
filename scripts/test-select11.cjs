const path = require('path');
const playwrightPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', '@playwright', 'test', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = 'http://localhost:5174';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(10000);
  
  // Wait for React to render - wait for a specific element
  try {
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    console.log('Found input[name="name"]');
  } catch (e) {
    console.log('Timeout waiting for input[name="name"]');
  }
  
  const content = await page.content();
  console.log('--- Find body ---');
  const bodyStart = content.indexOf('<body');
  if (bodyStart >= 0) {
    console.log(content.slice(bodyStart, bodyStart + 5000));
  }
  
  await browser.close();
})();
