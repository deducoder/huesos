import { expect, type Page, test } from '@playwright/test'
import { PNG } from 'pngjs'

/**
 * Las comprobaciones que solo un navegador puede hacer.
 *
 * Cada una nace de un defecto real que los 89 tests unitarios no vieron:
 * b2.1 —el cargador transforma los nombres de malla— y b2.2 —la cámara
 * encuadraba fuera del modelo—.
 */

/** Espera a que la escena esté dibujada, no a que pase un tiempo arbitrario. */
async function esperarEscena(page: Page) {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByRole('button', { name: 'fémur derecho', exact: true })).toBeVisible()
  // el modelo llega comprimido con Draco: se espera a que haya algo que pulsar
  await expect
    .poll(async () => cuantosHuesosAlcanza(page, 4), { timeout: 30_000, intervals: [1000] })
    .toBeGreaterThan(0)
}

/** Pulsa una rejilla de puntos sobre el lienzo y cuenta cuántos huesos distintos alcanza. */
async function cuantosHuesosAlcanza(page: Page, pasos: number): Promise<number> {
  const caja = await page.locator('canvas').first().boundingBox()
  if (!caja) return 0
  const elegidos = new Set<string>()
  for (let fila = 1; fila < pasos; fila++) {
    for (let col = 1; col < pasos; col++) {
      await page.mouse.click(
        caja.x + (caja.width * col) / pasos,
        caja.y + (caja.height * fila) / pasos,
      )
      const activo = await page.evaluate(() => {
        const b = document.querySelector('button[aria-pressed="true"]')
        return b?.textContent?.replace(/^▸\s*/, '').trim() ?? null
      })
      if (activo) elegidos.add(activo)
    }
  }
  return elegidos.size
}

/** Píxeles que cambian entre dos capturas del lienzo, contados por mitad. */
function diferenciaPorMitad(antes: Buffer, despues: Buffer) {
  const a = PNG.sync.read(antes)
  const b = PNG.sync.read(despues)
  let izquierda = 0
  let derecha = 0
  for (let y = 0; y < a.height; y++) {
    for (let x = 0; x < a.width; x++) {
      const i = (a.width * y + x) << 2
      const canal = (n: number) => Math.abs((a.data[i + n] ?? 0) - (b.data[i + n] ?? 0))
      const delta = canal(0) + canal(1) + canal(2)
      if (delta > 40) {
        if (x < a.width / 2) izquierda++
        else derecha++
      }
    }
  }
  return { izquierda, derecha }
}

test('el esqueleto se carga y se ve', async ({ page }) => {
  const errores: string[] = []
  page.on('pageerror', (e) => errores.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errores.push(m.text())
  })

  await esperarEscena(page)

  const lienzo = await page.locator('canvas').first().boundingBox()
  expect(lienzo?.width ?? 0).toBeGreaterThan(200)
  expect(errores, 'errores en la consola del navegador').toEqual([])
})

test('se alcanzan muchos huesos distintos pulsando sobre la escena', async ({ page }) => {
  test.setTimeout(150_000)
  await esperarEscena(page)

  // Regresión de b2.1 (solo 3 nombres sobrevivían al cargador) y de b2.2 (la
  // cámara encuadraba fuera del modelo). Con cualquiera de los dos defectos
  // presentes, esta cifra cae a 2.
  const alcanzados = await cuantosHuesosAlcanza(page, 9)
  expect(alcanzados, 'huesos distintos alcanzables en una rejilla de 8x8').toBeGreaterThanOrEqual(8)
})

test('un hueso par se resalta de un solo lado, y del anatómicamente correcto', async ({ page }) => {
  test.setTimeout(150_000)
  await esperarEscena(page)
  const lienzo = page.locator('canvas').first()

  const seleccionar = async (nombre: string) => {
    await page.getByRole('button', { name: nombre, exact: true }).click()
    await page.waitForTimeout(600)
    return lienzo.screenshot()
  }

  const base = await seleccionar('esfenoides')
  const izquierdo = diferenciaPorMitad(base, await seleccionar('fémur izquierdo'))
  const derecho = diferenciaPorMitad(base, await seleccionar('fémur derecho'))

  // El esqueleto se mira de frente: el lado DERECHO del cuerpo aparece a la
  // IZQUIERDA de la imagen. El cruce es la convención anatómica, no un error.
  expect(
    izquierdo.derecha,
    'fémur izquierdo debe encenderse a la derecha de la imagen',
  ).toBeGreaterThan(200)
  expect(izquierdo.izquierda, 'y no a la izquierda').toBeLessThan(izquierdo.derecha / 5)
  expect(
    derecho.izquierda,
    'fémur derecho debe encenderse a la izquierda de la imagen',
  ).toBeGreaterThan(200)
  expect(derecho.derecha, 'y no a la derecha').toBeLessThan(derecho.izquierda / 5)
})

test('no se pide nada a ningún tercero, como exige must-privacy-006', async ({ page }) => {
  const externas: string[] = []
  page.on('request', (r) => {
    const url = new URL(r.url())
    if (url.protocol === 'blob:' || url.protocol === 'data:') return
    if (url.host !== 'localhost:4173') externas.push(r.url())
  })

  await esperarEscena(page)
  await page.getByRole('button', { name: 'fémur derecho', exact: true }).click()

  expect(externas, 'peticiones a dominios de terceros').toEqual([])
})
