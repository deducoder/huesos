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
