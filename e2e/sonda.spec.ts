import { test } from '@playwright/test'
test.use({ viewport: { width: 390, height: 844 } })
test('sonda: qué botones hay', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^fichas$/i }).click()
  const cats = await page.getByRole('button', { expanded: false }).allInnerTexts()
  console.log('CATEGORIAS:', JSON.stringify(cats))
  await page.getByRole('button', { name: /^cintura escapular/i }).click()
  await page.waitForTimeout(300)
  const todos = await page.getByRole('button').allInnerTexts()
  console.log('TRAS EXPANDIR:', JSON.stringify(todos.slice(0, 20)))
})
