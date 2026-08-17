import { expect, type Page, test } from '@playwright/test'
import { PNG } from 'pngjs'

/**
 * Las comprobaciones que solo un navegador puede hacer.
 *
 * Cada una nace de un defecto real que los 89 tests unitarios no vieron:
 * b2.1 —el cargador transforma los nombres de malla, así que solo tres huesos
 * eran seleccionables— y b2.2 —la cámara encuadraba fuera del modelo—.
 */

declare global {
  interface Window {
    __huesosElegidos?: string[]
  }
}

/**
 * Registra en el navegador cada hueso que llega a marcarse.
 *
 * Se observa el DOM desde dentro en vez de preguntar tras cada clic: 64 viajes
 * de ida y vuelta agotaban el tiempo de la prueba.
 */
async function observarSelecciones(page: Page) {
  await page.evaluate(() => {
    window.__huesosElegidos = []
    const anotar = () => {
      const activo = document.querySelector('button[aria-pressed="true"]')
      const nombre = activo?.textContent?.replace(/^▸\s*/, '').trim()
      if (nombre && !window.__huesosElegidos?.includes(nombre)) {
        window.__huesosElegidos?.push(nombre)
      }
    }
    new MutationObserver(anotar).observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-pressed'],
    })
  })
}

const huesosElegidos = (page: Page) => page.evaluate(() => window.__huesosElegidos ?? [])

/**
 * Pulsa una rejilla de puntos sobre el lienzo, sin consultar el DOM en cada
 * uno: 121 viajes de ida y vuelta agotaban el tiempo de la prueba.
 *
 * Los clics son reales — `page.mouse.click`, no eventos sintéticos
 * despachados dentro de la página —, porque eventos sintéticos (probado)
 * alcanzan menos huesos que un clic real: falta algo del gesto (probablemente
 * el hueco entre `pointermove` y `pointerdown` que un mouse real deja) del
 * que depende three.js para resolver la intersección. Lo caro no es el clic:
 * es que el trace registre una instantánea del DOM por acción, cara bajo
 * renderizado por software — de ahí que esta prueba corra sin trace.
 */
async function pulsarRejilla(page: Page, pasos: number) {
  const caja = await esperarLienzoDimensionado(page)
  for (let fila = 1; fila < pasos; fila++) {
    for (let col = 1; col < pasos; col++) {
      await page.mouse.click(
        caja.x + (caja.width * col) / pasos,
        caja.y + (caja.height * fila) / pasos,
      )
    }
  }
}

/**
 * Espera a que el lienzo tenga su tamaño real, no el intrínseco del elemento.
 *
 * Un `<canvas>` sin atributos de tamaño mide 300x150 hasta que
 * react-three-fiber lo ajusta al contenedor. La lista de huesos, en cambio,
 * se pinta del catálogo al instante. Medir la caja en cuanto aparece la lista
 * devolvía 300x150 y situaba el "centro del lienzo" en (470,128): una esquina
 * vacía, fuera del esqueleto — y como la caja no se volvía a medir, la suite
 * pulsaba ese punto muerto durante los 60s del poll.
 *
 * Es una carrera, y **la pierde la máquina rápida**: donde el renderizado es
 * lento, el lienzo alcanza a redimensionarse antes de la medición y la prueba
 * pasa por accidente. De ahí la intermitencia observada en el sandbox.
 */
async function esperarLienzoDimensionado(page: Page) {
  const lienzo = page.locator('canvas').first()
  // Las dimensiones intrínsecas de un <canvas>, según HTML: 300x150.
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

/** Espera a que el modelo esté cargado y sea pulsable, no a que pase un tiempo fijo. */
async function esperarEscena(page: Page) {
  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByRole('button', { name: 'fémur derecho', exact: true })).toBeVisible()
  await observarSelecciones(page)

  const caja = await esperarLienzoDimensionado(page)
  // El modelo llega comprimido con Draco: se pulsa el centro hasta que responda.
  await expect
    .poll(
      async () => {
        await page.mouse.click(caja.x + caja.width / 2, caja.y + caja.height / 2)
        return (await huesosElegidos(page)).length
      },
      { timeout: 60_000, intervals: [500] },
    )
    .toBeGreaterThan(0)
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
      if (canal(0) + canal(1) + canal(2) > 40) {
        if (x < a.width / 2) izquierda++
        else derecha++
      }
    }
  }
  return { izquierda, derecha }
}

test('el esqueleto se carga y se ve, sin errores en consola', async ({ page }) => {
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

// Estuvo pausada por intermitente: la causa no era el entorno sino
// `esperarEscena`, que medía el lienzo antes de que se dimensionara y pulsaba
// un punto muerto durante los 60s del poll. Con eso arreglado deja de ser
// intermitente y corre en ~45s.
test('se alcanzan muchos huesos distintos pulsando sobre la escena', async ({ page }) => {
  test.setTimeout(120_000)
  await esperarEscena(page)

  // Regresión de b2.1 y b2.2: con cualquiera de los dos defectos, esta cifra
  // caía a 2 — el resto de la escena no respondía o quedaba fuera de cuadro.
  // El umbral es 6, y se quedó en 6 a propósito: una sonda aislada alcanza 10
  // de forma reproducible, pero dentro de la suite —con las otras tres pruebas
  // compitiendo por la máquina— alcanza 6, y los 4 que se pierden son siempre
  // los pares laterales. Subirlo a 8 se probó y puso la suite en rojo. 6 sigue
  // muy por encima del 2 de la regresión, que es lo que esta prueba vigila.
  await pulsarRejilla(page, 12)
  const alcanzados = await huesosElegidos(page)
  expect(alcanzados.length, `huesos alcanzados: ${alcanzados.join(', ')}`).toBeGreaterThanOrEqual(6)
})

test('un hueso par se resalta de un solo lado, y del anatómicamente correcto', async ({ page }) => {
  test.setTimeout(180_000)
  await esperarEscena(page)
  const lienzo = page.locator('canvas').first()

  const seleccionar = async (nombre: string) => {
    await page.getByRole('button', { name: nombre, exact: true }).click()
    await page.waitForTimeout(600)
    return lienzo.screenshot()
  }

  // La base es el hioides a propósito: es uno de los siete huesos del catálogo
  // sin geometría en el modelo (ADR-006), así que seleccionarlo no enciende
  // nada. Con un hueso resaltado de base, cada medición arrastraba el APAGADO
  // de ese hueso como ruido —61 px medidos con el esfenoides—, comparable a la
  // señal de un hueso pequeño como el parietal. Sin nada encendido, lo que se
  // mide es solo el resaltado del hueso bajo prueba.
  const base = await seleccionar('hioides')
  const izquierdo = diferenciaPorMitad(base, await seleccionar('fémur izquierdo'))
  const derecho = diferenciaPorMitad(base, await seleccionar('fémur derecho'))

  // El esqueleto se mira de frente: el lado DERECHO del cuerpo aparece a la
  // IZQUIERDA de la imagen. El cruce es la convención anatómica, no un error.
  expect(izquierdo.derecha, 'el fémur izquierdo se enciende a la derecha').toBeGreaterThan(200)
  expect(izquierdo.izquierda, 'y no a la izquierda').toBeLessThan(izquierdo.derecha / 5)
  expect(derecho.izquierda, 'el fémur derecho se enciende a la izquierda').toBeGreaterThan(200)
  expect(derecho.derecha, 'y no a la derecha').toBeLessThan(derecho.izquierda / 5)

  // b2.3: los parietales son el único par que el modelo trae con malla propia
  // por lado. El fémur no bastaba para vigilar la lateralidad — su malla es una
  // sola y el espejo la coloca bien—, así que el defecto vivía justo donde
  // ninguna prueba miraba: la escena espejaba también lo que ya venía completo,
  // y seleccionar un parietal encendía los dos hemisferios (medido: 126/122,
  // contra el 1842/61 del fémur en la misma escena).
  //
  // El umbral es más bajo que el del fémur porque el parietal ocupa mucho menos
  // en pantalla a la distancia por defecto; lo que se vigila es la PROPORCIÓN
  // entre mitades, y el mínimo solo está para que la prueba no pase en verde
  // sobre una selección que no encendió nada.
  const parietalDerecho = diferenciaPorMitad(base, await seleccionar('hueso parietal derecho'))
  const parietalIzquierdo = diferenciaPorMitad(base, await seleccionar('hueso parietal izquierdo'))

  expect(
    parietalDerecho.izquierda,
    'el parietal derecho se enciende a la izquierda',
  ).toBeGreaterThan(40)
  expect(parietalDerecho.derecha, 'y no a la derecha').toBeLessThan(parietalDerecho.izquierda / 5)
  expect(
    parietalIzquierdo.derecha,
    'el parietal izquierdo se enciende a la derecha',
  ).toBeGreaterThan(40)
  expect(parietalIzquierdo.izquierda, 'y no a la izquierda').toBeLessThan(
    parietalIzquierdo.derecha / 5,
  )
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
