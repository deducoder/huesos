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

test('en Fichas, la fila de un par no se estira a lo ancho del viewport', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Fichas', exact: true }).click()

  const fila = page.getByRole('button', { name: /^hueso parietal derecho$/i })
  await expect(fila).toBeVisible()

  // El nombre y las píldoras comparten una `<li>`: el ancho de esa fila es lo
  // que la falta de un `max-width` en el contenedor estira a lo ancho del
  // viewport (el `flex-1` del nombre crece hasta llenarla, empujando las
  // píldoras al borde — un `boundingBox()` del propio `<span>` del nombre no
  // lo vería, porque el texto queda alineado a la izquierda de esa misma
  // caja ya crecida).
  const filaAncestro = fila.locator('xpath=ancestor::li[1]')
  const cajaFila = await filaAncestro.boundingBox()
  expect(cajaFila, 'la fila del par no está en la página').not.toBeNull()
  expect(cajaFila?.width ?? 0, 'ancho de la fila').toBeLessThan(700)
})

test('en el modo test de hueso aislado, la barra de respuesta no se estira a lo ancho del viewport', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Test', exact: true }).click()
  await page.getByRole('button', { name: 'Hueso aislado', exact: true }).click()

  const barra = page.locator('form').first()
  await expect(barra).toBeVisible()
  const caja = await barra.boundingBox()
  expect(caja, 'la barra de respuesta no está en la página').not.toBeNull()
  expect(caja?.width ?? 0, 'ancho de la barra de respuesta').toBeLessThan(800)
})
