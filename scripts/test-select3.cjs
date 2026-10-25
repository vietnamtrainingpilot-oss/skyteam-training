const path = require('path');
const playwrightPath = path.join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules', '@playwright', 'test', 'node_modules', 'playwright');
const { chromium } = require(playwrightPath);

const BASE = 'http://localhost:5174';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Fill in name, email, password, confirm
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirmPassword"]', 'password123');
  
  // Click continue
  const continueBtn = await page.$('button[type="submit"]');
  if (continueBtn) {
    await continueBtn.click();
    await page.waitForTimeout(1000);
  }
  
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
