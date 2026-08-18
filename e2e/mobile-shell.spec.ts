import { expect, type Page, test } from '@playwright/test'

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

/**
 * Espera a que Explorar esté lista, sin usar el navegador de huesos como
 * señal — desde e7.6 sigue montado ahí, pero `sr-only` (ADR-010): sigue
 * siendo la vía de teclado, pero Playwright lo trata como invisible. El
 * lienzo es la señal visible correcta.
 */
async function esperarExplorar(page: Page) {
  await page.goto('/')
  const lienzo = page.locator('canvas').first()
  await expect(lienzo).toBeVisible()
  await expect
    .poll(async () => (await lienzo.boundingBox())?.height ?? 0, {
      timeout: 15_000,
      intervals: [200],
    })
    .toBeGreaterThan(100)
}

/**
 * Elige «fémur derecho» desde el navegador `sr-only` de Explorar.
 *
 * `dispatchEvent('click')`, no `.click()`: el contenedor `sr-only` recorta
 * visualmente pero no comprime el layout interno — cada botón conserva su
 * posición real, a menudo a miles de píxeles de alto. Un `.click()` con
 * `force: true` igual clickea esa coordenada real, fuera del viewport, y no
 * dispara nada. `dispatchEvent` activa el handler sin depender de dónde
 * quedó el elemento en la página.
 */
async function elegirFemurDerecho(page: Page) {
  await page.getByRole('button', { name: 'fémur derecho', exact: true }).dispatchEvent('click')
}

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
  await esperarExplorar(page)

  const alto = page.viewportSize()?.height ?? 0
  const lienzo = page.locator('canvas').first()

  // Se espera al dimensionado en vez de medir de una: un <canvas> mide 300x150
  // hasta que react-three-fiber lo ajusta al contenedor. Es la misma carrera
  // que `explore.spec.ts` documenta, y la pierde la máquina rápida.
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
  await esperarExplorar(page)
  await elegirFemurDerecho(page)
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

test('el lienzo se queda con sus propios gestos táctiles', async ({ page }) => {
  await esperarExplorar(page)

  // Regresión de e7.2, encontrada en un teléfono real: con `touch-action: auto`
  // el navegador reclama el arrastre vertical para hacer scroll, la rotación no
  // llega a OrbitControls y el gesto cancelado dispara un tap que selecciona un
  // hueso que nadie eligió. La emulación táctil no reproduce el síntoma —sus
  // eventos sintéticos no disputan el scroll— pero la causa sí es observable, y
  // es lo que esta prueba vigila para que el defecto no vuelva en silencio.
  // No era una carrera de tiempo: `OrbitControls` de three-stdlib desconecta
  // y reconecta una vez al asentarse, y esa reconexión nunca volvía a fijar
  // `touch-action: none` sobre el lienzo — verificado con un
  // `MutationObserver` que solo veía una mutación, siempre a `auto`. Lo
  // corrige `FixTouchAction` en `SkeletonScene.tsx`, no esta prueba.
  const enExplorar = await page
    .locator('canvas')
    .first()
    .evaluate((c) => getComputedStyle(c).touchAction)
  expect(enExplorar, 'touch-action del lienzo en Explorar').toBe('none')

  await elegirFemurDerecho(page)
  await page.getByRole('button', { name: /ver ficha completa/i }).click()

  const enLaFicha = await page
    .locator('canvas')
    .first()
    .evaluate((c) => getComputedStyle(c).touchAction)
  expect(enLaFicha, 'touch-action del lienzo en la ficha').toBe('none')
})

test('el título usa la familia display empaquetada', async ({ page }) => {
  await page.goto('/')
  const titulo = page.getByRole('heading', { name: 'huesos-mono' })
  await expect(titulo).toBeVisible()

  // Se comprueba la familia computada y no el aspecto: si el `@font-face`
  // apuntara a un archivo inexistente, la familia declarada seguiría siendo
  // Fredoka pero el navegador dibujaría con la de reserva. Por eso además se
  // pregunta al documento si la cargó de verdad.
  const familia = await titulo.evaluate((h) => getComputedStyle(h).fontFamily)
  expect(familia, 'familia del título').toContain('Fredoka')

  const cargada = await page.evaluate(async () => {
    await document.fonts.ready
    return document.fonts.check('600 28px Fredoka')
  })
  expect(cargada, 'la fuente empaquetada llegó a cargarse').toBe(true)

  // El cuerpo no la usa: la display es solo para títulos.
  const cuerpo = await page
    .getByRole('button', { name: 'fémur derecho', exact: true })
    .evaluate((b) => getComputedStyle(b).fontFamily)
  expect(cuerpo, 'el cuerpo conserva la pila del sistema').not.toContain('Fredoka')
})

test('las filas del navegador de huesos alcanzan el mínimo táctil', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^fichas$/i }).click()

  // Un par: la píldora "Derecho" de fémur.
  const pildoraDerecha = page.getByRole('button', { name: /fémur.*derecho/i })
  await expect(pildoraDerecha).toBeVisible()
  const cajaPildora = await pildoraDerecha.boundingBox()
  expect(cajaPildora?.height ?? 0, 'alto de la píldora "fémur derecho"').toBeGreaterThanOrEqual(44)
  expect(cajaPildora?.width ?? 0, 'ancho de la píldora "fémur derecho"').toBeGreaterThanOrEqual(44)

  // Un impar: esfenoides, sin píldoras de lado.
  const impar = page.getByRole('button', { name: /^esfenoides$/i })
  await expect(impar).toBeVisible()
  const cajaImpar = await impar.boundingBox()
  expect(cajaImpar?.height ?? 0, 'alto de "esfenoides"').toBeGreaterThanOrEqual(44)
})

test('el nombre más largo se lee completo, y el navegador entero recorre más corto que antes de e7.4', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^fichas$/i }).click()

  // El nombre de 44 caracteres del catálogo, en su fila `paired`. No se
  // recorta: el texto completo tiene que estar en el DOM, sin ellipsis.
  const nombreLargo = page.getByText('falange proximal del segundo dedo de la mano', {
    exact: true,
  })
  await expect(nombreLargo.first()).toBeVisible()

  // El alto total del navegador con los 206 huesos. 6.208 px es la cifra
  // medida en `main` antes de esta historia (ver scope.md e7.4). El
  // prototipo de design.md proyectó 5.720 sin relleno vertical alguno; el
  // componente real mide 5.832 con un poco de aire entre filas — sigue por
  // debajo de la base, la proyección exacta no se sostuvo al pixel.
  const nav = page.locator('nav[aria-label="Huesos del esqueleto"]')
  const alto = await nav.evaluate((n) => n.scrollHeight)
  expect(alto, 'alto total del navegador con los 206 huesos').toBeLessThanOrEqual(6208)
})

test('el panel de identidad usa el mínimo táctil y la tipografía display', async ({ page }) => {
  await esperarExplorar(page)
  await elegirFemurDerecho(page)

  const boton = page.getByRole('button', { name: /ver ficha completa/i })
  const caja = await boton.boundingBox()
  expect(caja?.height ?? 0, 'alto del botón "ver ficha completa"').toBeGreaterThanOrEqual(44)
  expect(caja?.width ?? 0, 'ancho del botón "ver ficha completa"').toBeGreaterThanOrEqual(44)

  const familia = await page
    .getByRole('heading', { name: /^fémur$/i })
    .evaluate((h) => getComputedStyle(h).fontFamily)
  expect(familia, 'familia del título del hueso').toContain('Fredoka')
})

test('el lienzo de Explorar ocupa toda la pantalla disponible', async ({ page }) => {
  await esperarExplorar(page)
  const lienzo = page.locator('canvas').first()
  await expect
    .poll(async () => (await lienzo.boundingBox())?.height ?? 0, {
      timeout: 15_000,
      intervals: [200],
    })
    .toBeGreaterThan(250)

  // El alto disponible bajo la cabecera y las pestañas — no el viewport
  // entero, que también incluye ese encabezado.
  const altoDisponible = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Modo de estudio"]')
    return nav ? window.innerHeight - nav.getBoundingClientRect().bottom : 0
  })
  const caja = await lienzo.boundingBox()
  expect(caja?.height ?? 0, 'alto del lienzo en Explorar').toBeGreaterThanOrEqual(
    altoDisponible - 2,
  )
})

test('el botón «Volver» de la ficha usa el mínimo táctil', async ({ page }) => {
  await esperarExplorar(page)
  await elegirFemurDerecho(page)
  await page.getByRole('button', { name: /ver ficha completa/i }).click()

  const boton = page.getByRole('button', { name: /volver/i })
  const caja = await boton.boundingBox()
  expect(caja?.height ?? 0, 'alto del botón "Volver"').toBeGreaterThanOrEqual(44)
  expect(caja?.width ?? 0, 'ancho del botón "Volver"').toBeGreaterThanOrEqual(44)
})

test('la elección de variante de test usa el mínimo táctil', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^test$/i }).click()

  for (const nombre of ['Esqueleto completo', 'Hueso aislado']) {
    const caja = await page.getByRole('button', { name: nombre, exact: true }).boundingBox()
    expect(caja?.height ?? 0, `alto de "${nombre}"`).toBeGreaterThanOrEqual(44)
    expect(caja?.width ?? 0, `ancho de "${nombre}"`).toBeGreaterThanOrEqual(44)
  }
})
