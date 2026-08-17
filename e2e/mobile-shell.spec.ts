import { expect, test } from '@playwright/test'

/**
 * Lo que solo se ve en una pantalla de teléfono.
 *
 * El viewport del proyecto es 1400×900 —escritorio— y ahí todo cabe. Medido en
 * 390×844 el 2026-08-17, las tres pestañas del shell miden ~30 px de alto: por
 * debajo del mínimo táctil de 44 px que fija ADR-007, y la razón por la que
 * cambiar de modo de estudio con el pulgar exige apuntar.
 */
test.use({ viewport: { width: 390, height: 844 } })

/** El mínimo táctil de ADR-007, en píxeles. */
const TACTIL = 44

test('todo objetivo del shell se puede pulsar con el pulgar', async ({ page }) => {
  await page.goto('/')

  for (const nombre of ['Explorar', 'Fichas', 'Test']) {
    const caja = await page.getByRole('button', { name: nombre, exact: true }).boundingBox()
    expect(caja, `la pestaña "${nombre}" no está en la página`).not.toBeNull()
    expect(caja?.height ?? 0, `alto de "${nombre}"`).toBeGreaterThanOrEqual(TACTIL)
    expect(caja?.width ?? 0, `ancho de "${nombre}"`).toBeGreaterThanOrEqual(TACTIL)
  }
})

test('el lienzo del esqueleto ocupa una porción útil de la pantalla', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'fémur derecho', exact: true })).toBeVisible()

  const alto = page.viewportSize()?.height ?? 0
  const lienzo = page.locator('canvas').first()

  // Se espera al dimensionado en vez de medir de una: un <canvas> mide 300x150
  // hasta que react-three-fiber lo ajusta al contenedor, y la lista de huesos
  // —que se pinta del catálogo al instante— aparece mucho antes. Es la misma
  // carrera que `explore.spec.ts` documenta, y la pierde la máquina rápida.
  //
  // Medido el 2026-08-17 antes de esta historia: 150 px de 844, o sea 17.8%.
  // 150 no es una decisión de diseño — es la altura intrínseca de un <canvas>
  // que nadie dimensionó, y es la que se está corrigiendo.
  await expect
    .poll(async () => (await lienzo.boundingBox())?.height ?? 0, {
      timeout: 15_000,
      intervals: [100],
    })
    .toBeGreaterThan(alto * 0.3)

  const caja = await lienzo.boundingBox()
  expect(caja?.y ?? Number.MAX_SAFE_INTEGER, 'dónde empieza el lienzo').toBeLessThan(alto)
})

test('el lienzo de la ficha completa se dimensiona con el mismo criterio', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'fémur derecho', exact: true }).click()
  await page.getByRole('button', { name: /ver ficha completa/i }).click()

  const alto = page.viewportSize()?.height ?? 0
  const lienzo = page.locator('canvas').first()

  await expect
    .poll(async () => (await lienzo.boundingBox())?.height ?? 0, {
      timeout: 15_000,
      intervals: [100],
    })
    .toBeGreaterThan(alto * 0.3)
})
