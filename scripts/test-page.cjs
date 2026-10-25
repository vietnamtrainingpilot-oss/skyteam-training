const path = require('path');
const playwrightPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', '@playwright', 'test', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
  
  // Wait a bit for React to render
  await page.waitForTimeout(2000);
  
  // Check page content
  const bodyHTML = await page.content();
  console.log('Page HTML length:', bodyHTML.length);
  console.log('Has input[name="name"]:', bodyHTML.includes('name="name"'));
  
  // Check for inputs
  const inputs = await page.$$('input');
  console.log('Input count:', inputs.length);
  
  for (const input of inputs) {
    const name = await input.getAttribute('name');
    const type = await input.getAttribute('type');
    const computedStyle = await input.evaluate(el => getComputedStyle(el).fontSize);
    console.log(`Input name=${name}, type=${type}, fontSize=${computedStyle}`);
  }
  
  await browser.close();
})();
