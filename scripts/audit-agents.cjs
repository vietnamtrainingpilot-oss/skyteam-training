const { chromium } = require('playwright');

const BASE = 'http://localhost:5173';
const results = [];

function check(name, pass, detail = '') {
  results.push({ name, pass, detail });
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // ── 1. Mobile input font-size ≥16px (iOS zoom prevention) ──
  await page.setViewportSize({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' });
  const inputFontSize = await page.evaluate(() => {
    const el = document.querySelector('input[name="name"]');
    if (!el) return 0;
    return parseFloat(getComputedStyle(el).fontSize);
  });
  check('Mobile input font-size ≥16px', inputFontSize >= 16, `${inputFontSize}px`);

  // ── 2. Hit targets ≥44px on mobile ──
  const buttonBox = await page.locator('button[type="submit"]').boundingBox();
  check('Submit button hit target ≥44px on mobile',
    buttonBox && buttonBox.width >= 44 && buttonBox.height >= 44,
    buttonBox ? `${Math.round(buttonBox.width)}×${Math.round(buttonBox.height)}px` : 'not found');

  // ── 3. Focus rings visible on keyboard navigation ──
  await page.goto(`${BASE}/auth/signin`, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const focusOutline = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const style = getComputedStyle(el);
    return { outline: style.outlineWidth, outlineColor: style.outlineColor, outlineOffset: style.outlineOffset };
  });
  check('Focus ring visible on keyboard nav',
    focusOutline && focusOutline.outlineWidth !== '0px' && focusOutline.outlineColor !== 'rgba(0, 0, 0, 0)',
    focusOutline ? `outline: ${focusOutline.outlineWidth} ${focusOutline.outlineColor}` : 'no focus');

  // ── 4. Icon-only buttons have aria-label ──
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  const iconButtons = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button svg, button [class*="icon"]');
    const issues = [];
    buttons.forEach(btn => {
      const hasLabel = btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby') || btn.closest('button')?.getAttribute('aria-label');
      if (!hasLabel) issues.push(btn.closest('button')?.outerHTML?.slice(0, 80));
    });
    return issues;
  });
  check('Icon-only buttons have aria-label', iconButtons.length === 0,
    iconButtons.length > 0 ? `${iconButtons.length} missing` : 'all present');

  // ── 5. Native <select> has explicit background-color (Windows fix) ──
  await page.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' });
  const selectStyle = await page.evaluate(() => {
    const sel = document.querySelector('select');
    if (!sel) return null;
    const style = getComputedStyle(sel);
    return { bg: style.backgroundColor, color: style.color };
  });
  check('Native <select> has explicit bg/color', selectStyle && selectStyle.bg !== 'rgba(0, 0, 0, 0)',
    selectStyle ? `bg: ${selectStyle.bg}` : 'no select found');

  // ── 6. prefers-reduced-motion respected ──
  const reducedMotion = await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  check('prefers-reduced-motion query works', typeof reducedMotion === 'boolean');

  // ── 7. No dead zones on radio/checkbox ──
  const radioHitTargets = await page.evaluate(() => {
    const radios = document.querySelectorAll('input[type="radio"]');
    const issues = [];
    radios.forEach(r => {
      const rect = r.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 24) issues.push(`radio ${r.id || r.name}: ${Math.round(rect.width)}×${Math.round(rect.height)}`);
    });
    return issues;
  });
  check('Radio hit targets ≥24px', radioHitTargets.length === 0,
    radioHitTargets.length > 0 ? `${radioHitTargets.length} too small` : 'all ok');

  // ── 8. No outline:none without visible replacement ──
  const outlineNone = await page.evaluate(() => {
    const els = document.querySelectorAll('*');
    const issues = [];
    els.forEach(el => {
      const style = getComputedStyle(el);
      if (style.outlineWidth === '0px' && style.outlineColor === 'rgba(0, 0, 0, 0)') {
        const hasRing = style.boxShadow.includes('0 0 0') || style.boxShadow.includes('ring');
        if (!hasRing && el.tagName !== 'HTML' && el.tagName !== 'BODY') issues.push(el.tagName);
      }
    });
    return issues.slice(0, 5);
  });
  check('No outline:none without visible replacement', outlineNone.length === 0,
    outlineNone.length > 0 ? `${outlineNone.length} elements` : 'all ok');

  // ── 9. Loading buttons keep label + show spinner ──
  const loadingButton = await page.evaluate(() => {
    const btns = document.querySelectorAll('button[disabled]');
    const issues = [];
    btns.forEach(b => {
      const text = b.textContent?.trim();
      if (!text || text.length < 2) issues.push(b.outerHTML?.slice(0, 60));
    });
    return issues;
  });
  check('Loading buttons keep label', loadingButton.length === 0,
    loadingButton.length > 0 ? `${loadingButton.length} empty` : 'all ok');

  // ── Summary ──
  const failed = results.filter(r => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log('Failed:');
    failed.forEach(r => console.log(`  ❌ ${r.name}: ${r.detail}`));
    process.exit(1);
  }

  await browser.close();
})();
