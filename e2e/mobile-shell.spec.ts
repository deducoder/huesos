import { expect, type Locator, type Page, test } from '@playwright/test'
import { PNG } from 'pngjs'

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

test('desde Explorar recién cargada, el «atrás» del sistema abandona el sitio', async ({
  page,
}) => {
  // El MUST NOT de e9.6: la corrección es no perder la aplicación *desde una
  // ficha*, no secuestrar el gesto para siempre. Sin esta prueba, cambiar el
  // `replaceState` de arranque por un `pushState` dejaría al usuario atrapado
  // y ninguna otra prueba lo vería — el resto solo mira que el retroceso
  // funcione, nunca que siga pudiendo salir.
  await esperarExplorar(page)
  expect(page.url(), 'la aplicación está cargada').toContain('localhost:4173')

  await page.goBack()

  expect(page.url(), 'el historial propio estaba agotado').not.toContain('localhost:4173')
})

/**
 * Cuántos píxeles de **hueso** hay en cada banda del lienzo.
 *
 * El fondo es `--color-lienzo` (#20242b, luminancia ~35) y el hueso un beige
 * muy claro: medido sobre capturas reales, el histograma es bimodal con
 * cúmulos en 32 y en 224, así que 90 separa los dos sin zona gris. La banda
 * lateral es del 2 % del ancho — 8 px de 390 —, dentro del `inset-x-4` (16 px)
 * de la tarjeta flotante, así que mide hueso y nunca tarjeta.
 */
function huesoPorBanda(captura: Buffer) {
  const { width: w, height: h, data } = PNG.sync.read(captura)
  const banda = Math.max(2, Math.round(w * 0.02))
  let izquierda = 0
  let derecha = 0
  let total = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (w * y + x) << 2
      const luminancia =
        0.2126 * (data[i] ?? 0) + 0.7152 * (data[i + 1] ?? 0) + 0.0722 * (data[i + 2] ?? 0)
      if (luminancia <= 90) continue
      total++
      if (x < banda) izquierda++
      else if (x >= w - banda) derecha++
    }
  }
  return { izquierda, derecha, total }
}

/** Abre la ficha completa de un hueso desde el acordeón de Fichas. */
async function abrirFicha(page: Page, categoria: string, hueso: string) {
  await page.goto('/')
  await page.getByRole('button', { name: /^fichas$/i }).click()
  await page.getByRole('button', { name: new RegExp(`^${categoria}`, 'i') }).click()
  await page.getByRole('button', { name: hueso, exact: true }).click()
  const lienzo = page.locator('canvas').first()
  await expect(lienzo).toBeVisible()
  await page.waitForTimeout(1800)
  return lienzo
}

test('un hueso ancho entra entero en el lienzo de la ficha', async ({ page }) => {
  // La clavícula y el atlas son los dos huesos más anchos respecto de su alto
  // de las 144 mallas del modelo (ratios 4,26 y 4,34). El fémur —el hueso con
  // el que uno probaría por instinto— es alto y estrecho (0,26) y no expone
  // nada: medido antes del arreglo, daba 0 píxeles en los bordes mientras la
  // clavícula daba 475/717 y el atlas 1236/1232.
  for (const [categoria, hueso] of [
    ['cintura escapular', 'clavícula derecho'],
    ['columna vertebral', 'atlas'],
  ] as const) {
    const lienzo = await abrirFicha(page, categoria, hueso)
    const { izquierda, derecha } = huesoPorBanda(await lienzo.screenshot())
    expect(izquierda, `${hueso}: hueso pegado al borde izquierdo`).toBeLessThan(50)
    expect(derecha, `${hueso}: hueso pegado al borde derecho`).toBeLessThan(50)
  }
})

test('el hueso alto y estrecho sigue viéndose como antes', async ({ page }) => {
  // No-regresión: arreglar el caso ancho no puede encoger ni recortar el que
  // ya funcionaba.
  const lienzo = await abrirFicha(page, 'miembro inferior', 'fémur derecho')
  const { izquierda, derecha, total } = huesoPorBanda(await lienzo.screenshot())
  expect(izquierda + derecha, 'el fémur nunca tocó los bordes').toBeLessThan(50)
  expect(total, 'y sigue ocupando una parte sustancial del lienzo').toBeGreaterThan(20_000)
})

test('el hueso más chico del modelo se sigue viendo, y el que no tiene geometría no monta lienzo', async ({
  page,
}) => {
  // Dos no-regresiones que el encuadre nuevo podría romper sin que nada más
  // avise. La falange media del quinto dedo del pie mide 0,0084 unidades: es
  // la más chica de las 144 mallas, y la que obliga a la cámara a acercarse
  // por debajo del plano cercano por defecto de three.js. Sin el `near`
  // de e4.4, el lienzo queda en blanco sin ningún error.
  const lienzo = await abrirFicha(
    page,
    'miembro inferior',
    'falange media del quinto dedo del pie derecho',
  )
  const { total } = huesoPorBanda(await lienzo.screenshot())
  expect(total, 'la falange más chica se ve').toBeGreaterThan(1_000)

  // Y el hioides es uno de los siete huesos que el modelo no representa
  // (ADR-006): su ficha explica la ausencia y no monta ninguna escena.
  await page.goto('/')
  await page.getByRole('button', { name: /^fichas$/i }).click()
  await page.getByRole('button', { name: /^hioides/i }).click()
  await page.getByRole('button', { name: 'hioides', exact: true }).click()
  await expect(page.getByText(/no está en el modelo 3D/i)).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
})

/**
 * Cuánto hueso queda a la vista y cuánto detrás de la tarjeta flotante.
 *
 * La tarjeta se oculta **solo para la captura**, sin tocar el layout: es
 * blanca, así que contaría como hueso y taparía justo lo que hay que medir.
 * Mismo truco que `explore.spec.ts` usa para no contaminar su diferencia de
 * píxeles con el texto de la tarjeta de identidad.
 */
async function huesoSobreYBajoLaTarjeta(page: Page, lienzo: Locator) {
  const cajaLienzo = await lienzo.boundingBox()
  const cajaTarjeta = await page.getByTestId('tarjeta-ficha').boundingBox()
  expect(cajaLienzo, 'el lienzo está en la página').not.toBeNull()
  expect(cajaTarjeta, 'la tarjeta está en la página').not.toBeNull()

  await page.getByTestId('tarjeta-ficha').evaluate((t) => {
    t.style.visibility = 'hidden'
  })
  const captura = await lienzo.screenshot()
  await page.getByTestId('tarjeta-ficha').evaluate((t) => {
    t.style.visibility = ''
  })

  const { width: w, height: h, data } = PNG.sync.read(captura)
  // Dónde empieza la tarjeta, en píxeles de la captura del lienzo.
  const escala = h / (cajaLienzo?.height ?? h)
  const corte = ((cajaTarjeta?.y ?? 0) - (cajaLienzo?.y ?? 0)) * escala

  let visible = 0
  let tapado = 0
  let primeraFila = h
  let ultimaFila = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (w * y + x) << 2
      const luminancia =
        0.2126 * (data[i] ?? 0) + 0.7152 * (data[i + 1] ?? 0) + 0.0722 * (data[i + 2] ?? 0)
      if (luminancia <= 90) continue
      if (y < corte) visible++
      else tapado++
      if (y < primeraFila) primeraFila = y
      if (y > ultimaFila) ultimaFila = y
    }
  }
  // Qué fracción de la franja libre recorre el hueso de arriba abajo. Es una
  // medida más honesta que el área: dice si el hueso aprovecha el sitio que
  // tiene, y no cambia porque el hueso sea más o menos macizo.
  const recorrido = ultimaFila < 0 ? 0 : (ultimaFila - primeraFila) / Math.max(corte, 1)
  // Cuánta franja libre queda desaprovechada por debajo del hueso. Es lo que
  // distingue medir la tarjeta de suponerla: con una reserva fija, una ficha
  // corta deja un hueco que nadie usa.
  const huecoBajoElHueso =
    ultimaFila < 0 ? 1 : (Math.max(corte, 1) - ultimaFila) / Math.max(corte, 1)
  return { visible, tapado, recorrido, huecoBajoElHueso }
}

test('el hueso queda donde la tarjeta no lo tapa', async ({ page }) => {
  // El caso extremo aquí es el fémur, no la clavícula: es el hueso ALTO, el
  // que ocupa el lienzo de arriba abajo y por tanto el que más queda detrás
  // de la tarjeta. Medido antes del arreglo: 47,9 % visible, 52,1 % tapado.
  // La clavícula, en cambio, daba 100 % — los dos defectos de esta historia
  // tienen cada uno su propio caso extremo, y no son el mismo hueso.
  const lienzo = await abrirFicha(page, 'miembro inferior', 'fémur derecho')
  const { visible, tapado, recorrido } = await huesoSobreYBajoLaTarjeta(page, lienzo)

  const porcentaje = (100 * visible) / (visible + tapado)
  expect(porcentaje, 'porcentaje del fémur que se ve').toBeGreaterThan(90)
  // Y no vale «arreglarlo» encogiendo el hueso hasta que quepa en cualquier
  // parte. El fémur es el hueso más largo del cuerpo: tiene que seguir
  // recorriendo la mayor parte de la franja que la tarjeta le deja.
  expect(recorrido, 'fracción de la franja libre que recorre el fémur').toBeGreaterThan(0.7)
})

test('la reserva sale del alto real de la tarjeta, no de su máximo declarado', async ({ page }) => {
  // La tarjeta declara `max-h-[45vh]`, pero su alto real depende de cuánto
  // tenga escrito cada hueso. El fémur trae «Articula con» y «Dato clínico»
  // y llena la tarjeta; la tibia no trae ni eso ni sinónimos, y su ficha es
  // de las más cortas del catálogo. Los dos son huesos largos de la pierna,
  // de proporciones parecidas, así que lo que cambia entre ellos es la
  // tarjeta y no la geometría.
  //
  // Si la reserva fuera el 45 % fijo, la ficha corta desperdiciaría toda la
  // franja que su tarjeta no llega a ocupar. Medirla es lo que hace que el
  // hueso llegue hasta donde empieza la tarjeta en los dos casos.
  const conFichaLarga = await huesoSobreYBajoLaTarjeta(
    page,
    await abrirFicha(page, 'miembro inferior', 'fémur derecho'),
  )
  const conFichaCorta = await huesoSobreYBajoLaTarjeta(
    page,
    await abrirFicha(page, 'miembro inferior', 'tibia derecho'),
  )

  expect(conFichaLarga.huecoBajoElHueso, 'hueco bajo el fémur, de ficha larga').toBeLessThan(0.2)
  expect(conFichaCorta.huecoBajoElHueso, 'hueco bajo la tibia, de ficha corta').toBeLessThan(0.2)
})
