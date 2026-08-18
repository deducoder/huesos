import { expect, type Page, test } from '@playwright/test'

/**
 * Lo que solo se ve en un monitor: e7.9 acota el ancho de contenido que
 * hasta ahora se estiraba a lo ancho del viewport, y devuelve el navegador
 * de huesos a la vista en Explorar (sigue siendo la misma vía de teclado de
 * ADR-002/ADR-010, solo deja de ser `sr-only`). El viewport del proyecto ya
 * es 1400×900 — no hace falta `test.use`.
 */

/** Espera a que el modelo esté cargado y sea pulsable, no a que pase un tiempo fijo. */
async function esperarLienzoDimensionado(page: Page) {
  const lienzo = page.locator('canvas').first()
  await expect
    .poll(
      async () => {
        const c = await lienzo.boundingBox()
        return c && c.width > 300 && c.height > 150
      },
      { timeout: 30_000, intervals: [100] },
    )
    .toBe(true)
  const caja = await lienzo.boundingBox()
  if (!caja) throw new Error('no hay lienzo')
  return caja
}

test('en Explorar, el navegador de huesos es visible a 1400×900', async ({ page }) => {
  await page.goto('/')
  await esperarLienzoDimensionado(page)

  const navegador = page.getByRole('navigation', { name: /huesos del esqueleto/i })
  const caja = await navegador.boundingBox()
  expect(caja, 'el navegador no está en la página').not.toBeNull()
  expect(caja?.width ?? 0, 'ancho del navegador').toBeGreaterThan(100)
})

test('en Explorar, la tarjeta de identidad no se estira a lo ancho del lienzo', async ({
  page,
}) => {
  await page.goto('/')
  const caja = await esperarLienzoDimensionado(page)

  await page.getByRole('button', { name: 'fémur derecho', exact: true }).dispatchEvent('click')

  const tarjeta = page.getByTestId('tarjeta-identidad')
  await expect(tarjeta).toBeVisible()
  const cajaTarjeta = await tarjeta.boundingBox()
  expect(cajaTarjeta, 'la tarjeta de identidad no está en la página').not.toBeNull()
  expect(cajaTarjeta?.width ?? 0, 'ancho de la tarjeta').toBeLessThan(caja.width * 0.5)
})

test('en Fichas, el acordeón de categorías no se estira a lo ancho del viewport', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Fichas', exact: true }).click()

  // El botón de categoría es `w-full` dentro del contenedor `md:max-w-2xl`
  // de `App.tsx` — mide directo el ancho que ese contenedor le da, sin
  // necesitar el rodeo por un ancestro que el acordeón (e8.2) ya no tiene.
  const categoria = page.getByRole('button', { name: /^cráneo/i })
  await expect(categoria).toBeVisible()
  const caja = await categoria.boundingBox()
  expect(caja, 'el botón de categoría no está en la página').not.toBeNull()
  expect(caja?.width ?? 0, 'ancho del botón de categoría').toBeLessThan(700)
})

test('en el modo test de hueso aislado, la barra de respuesta no se estira a lo ancho del viewport', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Test', exact: true }).click()
  await page.getByRole('button', { name: 'Hueso aislado', exact: true }).click()

  const barra = page.getByTestId('barra-respuesta')
  await expect(barra).toBeVisible()
  const caja = await barra.boundingBox()
  expect(caja, 'la barra de respuesta no está en la página').not.toBeNull()
  expect(caja?.width ?? 0, 'ancho de la barra de respuesta').toBeLessThan(800)
})
