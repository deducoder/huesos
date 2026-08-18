import { expect, test } from '@playwright/test'

/**
 * Mide `should-perf-007`: la respuesta a la selección en un móvil de gama
 * media. Sin dispositivo de referencia declarado en el proyecto, se usa el
 * preset de Lighthouse (CPU 4x) vía Chrome DevTools Protocol.
 *
 * Se mide vía `BoneNavigator`, no clicando la malla en el lienzo: un clic
 * real sobre la escena tarda ~2s bajo el renderizado por software de este
 * entorno (ver el comentario de `pulsarRejilla` en `explore.spec.ts`) — eso
 * mediría el costo del raycasting de three.js en *este* entorno, no la
 * respuesta de la aplicación a una selección. El navegador y la escena
 * comparten el mismo `onSelect` y el mismo commit de React que resalta la
 * malla y marca `aria-pressed` (ADR-002), así que medir uno mide el mismo
 * costo de aplicación sin el ruido del raycasting.
 */

const CANTIDAD_DE_MUESTRAS = 20
const TASA_DE_THROTTLING = 4

test.use({ viewport: { width: 390, height: 844 } })

test('mide la latencia de selección con CPU limitada 4x (should-perf-007)', async ({ page }) => {
  await page.goto('/')
  const lienzo = page.locator('canvas').first()
  await expect(lienzo).toBeVisible()
  await expect
    .poll(async () => (await lienzo.boundingBox())?.height ?? 0, {
      timeout: 30_000,
      intervals: [200],
    })
    .toBeGreaterThan(100)

  // El throttling se activa después de que la escena cargó: cargar el
  // modelo bajo CPU limitada añade ruido de decodificación que no es parte
  // de lo que este guardrail mide.
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: TASA_DE_THROTTLING })

  const tiempos = await page.evaluate(async (n) => {
    const botones = Array.from(
      document.querySelectorAll<HTMLButtonElement>('nav[aria-label="Huesos del esqueleto"] button'),
    ).slice(0, n)
    const resultados: number[] = []
    for (const boton of botones) {
      const t0 = performance.now()
      await new Promise<void>((resolve) => {
        const obs = new MutationObserver(() => {
          if (boton.getAttribute('aria-pressed') === 'true') {
            obs.disconnect()
            resolve()
          }
        })
        obs.observe(boton, { attributes: true, attributeFilter: ['aria-pressed'] })
        boton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      })
      resultados.push(performance.now() - t0)
    }
    return resultados
  }, CANTIDAD_DE_MUESTRAS)

  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 })

  expect(tiempos, 'cantidad de muestras').toHaveLength(CANTIDAD_DE_MUESTRAS)
  for (const t of tiempos) {
    expect(t, 'cada muestra es un tiempo positivo').toBeGreaterThan(0)
  }

  const ordenados = [...tiempos].sort((a, b) => a - b)
  const mediana = ordenados[Math.floor(ordenados.length / 2)] ?? 0
  const maximo = Math.max(...tiempos)

  console.log(`should-perf-007 · CPU ${TASA_DE_THROTTLING}x · 390×844`)
  console.log(`  muestras: ${tiempos.map((t) => t.toFixed(1)).join(', ')} ms`)
  console.log(`  mediana: ${mediana.toFixed(1)} ms · máximo: ${maximo.toFixed(1)} ms`)
})
