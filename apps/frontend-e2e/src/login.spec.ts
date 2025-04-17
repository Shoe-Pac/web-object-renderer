import { expect, test } from '@playwright/test'

test('Landing page loads', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Web Object Renderer') //Page title check
  await expect(page.getByText('WOR')).toBeVisible() //Page text check
})

test('Login page has title', async ({ page }) => {
  await page.goto('/login')

  // Expect h1 to contain a substring.
  await expect(page.locator('h1')).toContainText('Login')
})
