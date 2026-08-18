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

test('las etiquetas del acordeón de Fichas alcanzan el mínimo táctil', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^fichas$/i }).click()

  // Un par: la etiqueta "fémur derecho", dentro de "Miembro inferior".
  await page.getByRole('button', { name: /^miembro inferior/i }).click()
  const etiquetaPar = page.getByRole('button', { name: /^fémur derecho$/i })
  await expect(etiquetaPar).toBeVisible()
  const cajaPar = await etiquetaPar.boundingBox()
  expect(cajaPar?.height ?? 0, 'alto de la etiqueta "fémur derecho"').toBeGreaterThanOrEqual(44)
  expect(cajaPar?.width ?? 0, 'ancho de la etiqueta "fémur derecho"').toBeGreaterThanOrEqual(44)

  // Un impar: esfenoides, dentro de "Cráneo", sin lado.
  await page.getByRole('button', { name: /^cráneo/i }).click()
  const impar = page.getByRole('button', { name: /^esfenoides$/i })
  await expect(impar).toBeVisible()
  const cajaImpar = await impar.boundingBox()
  expect(cajaImpar?.height ?? 0, 'alto de "esfenoides"').toBeGreaterThanOrEqual(44)
})

test('el nombre más largo del catálogo se lee completo, sin recortar', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^fichas$/i }).click()
  await page.getByRole('button', { name: /^miembro superior/i }).click()

  // El nombre de 44 caracteres del catálogo. No se recorta: el texto
  // completo tiene que estar en el DOM, sin ellipsis — el acordeón (e8.2)
  // agrega el lado al texto del botón (`accessibleName`), así que ya no
  // aparece como nodo de texto suelto: se busca por substring, no exacto.
  //
  // e8.2 retira acá el guardia de regresión que e7.4 dejó sobre el alto
  // total del navegador (≤ 6.208 px, medido contra la lista plana de
  // antes de esa historia): con categorías colapsadas por defecto, el
  // alto inicial del acordeón es trivialmente chico sin que eso proteja
  // nada — comparar contra una arquitectura de información que ya no
  // existe deja de ser una guardia real. Ver progress.md de e8.2.
  const nombreLargo = page.getByText('falange proximal del segundo dedo de la mano')
  await expect(nombreLargo.first()).toBeVisible()
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

  // El alto disponible bajo la cabecera **con su margen** — no el viewport
  // entero, que también incluye ese encabezado, y no el borde inferior de las
  // pestañas: desde e8.5 la navbar lleva aire simétrico arriba y abajo (pedido
  // explícito), así que medir desde el `<nav>` contaría ese margen como espacio
  // desperdiciado. Lo que esto sigue prohibiendo es un hueco muerto **extra**
  // entre la cabecera y el lienzo.
  const altoDisponible = await page.evaluate(() => {
    const cabecera = document.querySelector('[data-testid="cabecera"]')
    if (!cabecera) return 0
    const margen = Number.parseFloat(getComputedStyle(cabecera).marginBottom)
    return window.innerHeight - (cabecera.getBoundingClientRect().bottom + margen)
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
    const patron = new RegExp(`^${nombre}`, 'i')
    const caja = await page.getByRole('button', { name: patron }).boundingBox()
    expect(caja?.height ?? 0, `alto de "${nombre}"`).toBeGreaterThanOrEqual(44)
    expect(caja?.width ?? 0, `ancho de "${nombre}"`).toBeGreaterThanOrEqual(44)
  }
})

test('las opciones y sus botones usan el mínimo táctil, sin desbordar', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /^test$/i }).click()
  await page.getByRole('button', { name: /^esqueleto completo/i }).click()
  await page.waitForTimeout(2500)

  const grupo = page.getByRole('group', { name: /qué hueso es/i })
  const opciones = await grupo.getByRole('button').all()
  const responder = page.getByRole('button', { name: /^responder$/i })

  for (const opcion of opciones) {
    const caja = await opcion.boundingBox()
    expect(caja?.height ?? 0, 'alto de una opción').toBeGreaterThanOrEqual(44)
  }
  const cajaResponder = await responder.boundingBox()
  expect(cajaResponder?.height ?? 0, 'alto de "Responder"').toBeGreaterThanOrEqual(44)
  expect(
    (cajaResponder?.x ?? 0) + (cajaResponder?.width ?? 0),
    'el botón "Responder" no se desborda del viewport',
  ).toBeLessThanOrEqual(390)

  const [primeraOpcion] = opciones
  await primeraOpcion?.click()
  await responder.click()
  await page.waitForTimeout(300)

  const siguiente = page.getByRole('button', { name: /siguiente pregunta/i })
  const cajaSiguiente = await siguiente.boundingBox()
  expect(cajaSiguiente?.height ?? 0, 'alto de "Siguiente pregunta"').toBeGreaterThanOrEqual(44)
  expect(cajaSiguiente?.width ?? 0, 'ancho de "Siguiente pregunta"').toBeGreaterThanOrEqual(44)
})

test('el «atrás» del sistema recorre la aplicación en vez de abandonarla', async ({ page }) => {
  // La razón de ser de esta prueba: `popstate` en jsdom no reproduce el gesto
  // de un teléfono, así que el verde de la suite unitaria no dice nada sobre
  // el comportamiento real. Acá el retroceso lo ejecuta el navegador.
  await esperarExplorar(page)
  await elegirFemurDerecho(page)
  await page.getByRole('button', { name: /ver ficha completa/i }).click()
  await expect(page.getByRole('button', { name: /volver/i })).toBeVisible()

  await page.goBack()

  // De vuelta en Explorar, dentro del sitio y con la selección viva: vive en
  // `App` y no en la entrada del historial, justamente para sobrevivir a esto.
  await expect(page.getByRole('button', { name: /^test$/i })).toBeVisible()
  await expect(page.getByRole('button', { name: 'fémur derecho', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )

  // Y desde una variante de test, el gesto devuelve a la elección de variante.
  await page.getByRole('button', { name: /^test$/i }).click()
  await page.getByRole('button', { name: /esqueleto completo/i }).click()
  await expect(page.getByRole('button', { name: /responder/i })).toBeVisible()

  await page.goBack()
  await expect(page.getByRole('button', { name: /esqueleto completo/i })).toBeVisible()
})
