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
  
  // Check for form elements
  const inputs = await page.$$eval('input', els => els.map(el => ({
    name: el.name,
    id: el.id,
    type: el.type,
    outerHTML: el.outerHTML.slice(0, 100)
  })));
  console.log('Inputs:', JSON.stringify(inputs, null, 2));
  
  const buttons = await page.$$eval('button', els => els.map(el => ({
    text: el.textContent?.slice(0, 30),
    type: el.type,
    outerHTML: el.outerHTML.slice(0, 100)
  })));
  console.log('Buttons:', JSON.stringify(buttons, null, 2));
  
  const forms = await page.$$eval('form', els => els.map(el => ({
    outerHTML: el.outerHTML.slice(0, 500)
  })));
  console.log('Forms:', JSON.stringify(forms, null, 2));
  
  await browser.close();
})();
