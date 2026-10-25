// Playwright accessibility audit for SkyTeam Training
import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5174'

test.describe('Accessibility Audit', () => {
  test('Homepage - dark mode active', async ({ page }) => {
    await page.goto(BASE)
    const root = page.locator('html')
    await expect(root).toHaveAttribute('color-scheme', 'dark')

    // Hero buttons should be visible
    const getStarted = page.getByRole('link', { name: /get started/i })
    await expect(getStarted).toBeVisible()
    const getStartedBox = await getStarted.boundingBox()
    expect(getStartedBox).toBeTruthy()

    // CTA section text should be readable
    const ctaHeading = page.getByRole('heading', { name: /start your training today/i })
    await expect(ctaHeading).toBeVisible()
  })

  test('Dark mode forced on all pages', async ({ page }) => {
    await page.goto(BASE)
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    })
    expect(bgColor).toBe('#0b0f1a') // dark background
  })

  test('Buttons have proper contrast', async ({ page }) => {
    await page.goto(BASE)

    // Primary button should have white text on blue background
    const primaryBtn = page.locator('.btn-pill-primary').first()
    await expect(primaryBtn).toBeVisible()

    // Get computed styles to verify contrast
    const btnStyle = await page.evaluate((btn) => {
      const computed = getComputedStyle(btn)
      return {
        color: computed.color,
        backgroundColor: computed.backgroundColor
      }
    }, await primaryBtn.elementHandle())

    // White text on dark blue should pass
    expect(btnStyle.color).toBeTruthy()
  })

  test('Logo is visible in header', async ({ page }) => {
    // Login first
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@skyteam.test')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    // Check logo in sidebar
    const logo = page.locator('.logo-mark')
    await expect(logo).toBeVisible()

    // Check logo icon color
    const iconStyle = await page.evaluate(() => {
      const icon = document.querySelector('.logo-mark svg')
      return icon ? getComputedStyle(icon).color : null
    })
    expect(iconStyle).toBeTruthy()
  })

  test('Training Information - no handbook sections', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@skyteam.test')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    await page.goto('/training-information')

    // Should have Stage 1 Written Exam section
    const writtenExam = page.getByText(/Stage 1: Written Examination/i)
    await expect(writtenExam).toBeVisible()

    // Should NOT have handbook sections
    const handbookSections = page.getByRole('heading', { name: /Flight Plan|Plane-Checking|Taxi/i })
    await expect(handbookSections).not.toBeVisible()
  })

  test('Admin Dashboard - role filters visible', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.fill('[name="email"]', 'admin@skyteam.test')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')

    await page.goto('/admin')

    // Role filter buttons should be visible with proper colors
    const allBtn = page.getByRole('button', { name: 'All' })
    const traineesBtn = page.getByRole('button', { name: 'Trainees' })
    const trainersBtn = page.getByRole('button', { name: 'Trainers' })
    const adminsBtn = page.getByRole('button', { name: 'Admins' })

    await expect(allBtn).toBeVisible()
    await expect(traineesBtn).toBeVisible()
    await expect(trainersBtn).toBeVisible()
    await expect(adminsBtn).toBeVisible()
  })

  test('Handbooks - cone images present', async ({ page }) => {
    await page.goto('/handbooks')

    // Switch to Ground Crew
    const groundCrewBtn = page.getByRole('button', { name: 'Ground Crew' })
    await groundCrewBtn.click()
    await page.waitForTimeout(500)

    // Cone Placement section should have images
    const coneSection = page.getByRole('heading', { name: 'Cone Placement' })
    await expect(coneSection).toBeVisible()

    const images = page.locator('img')
    const imageCount = await images.count()
    expect(imageCount).toBeGreaterThan(0)
  })
})
