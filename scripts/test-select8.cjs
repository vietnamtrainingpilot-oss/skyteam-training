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
  console.log('Page URL:', page.url());
  console.log('Has "Welcome back":', content.includes('Welcome back'));
  console.log('Has "Sign in":', content.includes('Sign in'));
  console.log('Content length:', content.length);
  
  // Check for form elements
  const inputs = await page.$$eval('input', els => els.map(el => ({
    name: el.name,
    id: el.id,
    type: el.type,
    outerHTML: el.outerHTML.slice(0, 100)
  })));
  console.log('Inputs:', JSON.stringify(inputs, null, 2));
  
  await browser.close();
})();
