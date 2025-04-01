import { expect, test } from '@playwright/test'

test('Login page has title', async ({ page }) => {
  await page.goto('/')

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').innerText()).toContain('Login')
})

test('Login page loads', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Web Object Renderer') // Provjera title-a stranice
  await expect(page.getByText('WOR')).toBeVisible() // Provjera teksta na stranici
})
