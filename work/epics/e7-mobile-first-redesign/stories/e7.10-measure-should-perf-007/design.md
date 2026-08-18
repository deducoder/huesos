# Story e7.10: Medir `should-perf-007` — Design

Historia simple (spec del `should-perf-007` sigue a scope.md; delta abajo).

## Gemba walk

- `playwright.config.ts` corre un único proyecto `chromium`, viewport por
  defecto 1400×900 (desktop) contra el build de producción. Ningún test
  existente usa CPU throttling — no hay patrón previo que seguir, primera
  vez que se necesita.
- El propio comentario de `explore.spec.ts` sobre `pulsarRejilla` documenta
  que un clic real sobre el lienzo tarda **~2s bajo renderizado por
  software** en este entorno de ejecución. Eso es determinante: medir la
  latencia clicando directo sobre la malla mediría el costo del *raycasting
  de three.js bajo software rendering de este entorno*, no la respuesta de
  la aplicación a una selección — confundiría dos cosas distintas.
- `ExploreView.tsx` (e7.9) recibe la selección por dos vías equivalentes
  (ADR-002): clic en la escena y clic en `BoneNavigator`. Las dos llaman al
  mismo `onSelect`, que actualiza el mismo estado en `App`, que dispara el
  mismo commit de React — el que resalta la malla (`SkeletonHalf`,
  `useLayoutEffect`) y el que marca `aria-pressed` en el botón del
  navegador (mismo render, misma pasada). Medir vía el navegador evita el
  costo de raycasting sin perder lo que `should-perf-007` quiere saber: si
  la aplicación responde rápido a una selección.
- `e2e/mobile-shell.spec.ts` ya resuelve el problema de clicar un botón
  `sr-only`: `dispatchEvent('click')`, no `.click()` (el contenedor recorta
  visualmente pero no comprime el layout interno). Mismo mecanismo acá.
- Ningún artefacto nombra un dispositivo de referencia para "gama media".
  Se adopta el preset de Lighthouse (CPU 4x) vía el Chrome DevTools
  Protocol (`Emulation.setCPUThrottlingRate`), disponible en Playwright a
  través de una sesión CDP — solo en `chromium`, que es el único proyecto
  configurado.

## Approach

Un test de Playwright nuevo (`e2e/perf-selection.spec.ts`) que:

1. Abre la app en viewport 390×844 (el mismo que usa `mobile-shell.spec.ts`
   para "gama media" en tamaño de pantalla).
2. Activa CPU throttling 4x vía CDP, **después** de que la escena cargó
   (cargar el modelo bajo throttling añade ruido de red/decodificación que
   no es parte de lo que se mide).
3. Mide, **enteramente dentro del navegador** (un único `page.evaluate`,
   para no sumar la latencia de ida y vuelta de Playwright a la medición):
   por cada uno de 20 botones del navegador, `performance.now()` antes de
   `dispatchEvent('click')`, un `MutationObserver` esperando
   `aria-pressed="true"` en ese botón, y la diferencia.
4. Devuelve la mediana y el máximo de las 20 muestras; el test los
   registra (no los usa como assert de aprobar/reprobar — es un `should`,
   optimizar si no cumple es explícitamente fuera de alcance) y el
   `progress.md` de esta historia deja el veredicto por escrito.

La corrección de `governance/guardrails.md` es un cambio de texto aparte,
sin TDD (no es código): reemplaza "el SVG se sirve por debajo de 500 KB"
por una referencia al activo real y a ADR-001.

## Components affected

| Archivo | Cambio |
|---|---|
| `e2e/perf-selection.spec.ts` | create — mide y registra la latencia |
| `governance/guardrails.md` | modify — corrige la cláusula del SVG |

## Example

```ts
const cdp = await page.context().newCDPSession(page)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })

const tiempos = await page.evaluate(() => {
  const botones = Array.from(
    document.querySelectorAll('nav[aria-label="Huesos del esqueleto"] button'),
  ).slice(0, 20)
  return Promise.all(
    botones.map(
      (boton) =>
        new Promise<number>((resolve) => {
          const t0 = performance.now()
          const obs = new MutationObserver(() => {
            if (boton.getAttribute('aria-pressed') === 'true') {
              obs.disconnect()
              resolve(performance.now() - t0)
            }
          })
          obs.observe(boton, { attributes: true, attributeFilter: ['aria-pressed'] })
          boton.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        }),
    ),
  )
})
// tiempos: number[20], en milisegundos
```

Nota: los 20 `Promise` corren en paralelo dentro del `evaluate` de arriba,
pero los clics son síncronos uno detrás de otro en el mismo microtask, así
que en la práctica se resuelven en el orden en que se disparan — cada clic
cambia el estado antes de que el siguiente se dispare. Si el muestreo
resultara no-secuencial en la práctica, la implementación pasa a un `for`
con `await` explícito por muestra (más simple de razonar, un poco más
lento de correr).

## Acceptance criteria (delta sobre `scope.md`)

- **MUST** la medición corre con CPU throttling real (CDP), no una
  estimación de tiempos de React sin carga simulada.
- **MUST** la medición evita el costo de raycasting de WebGL bajo software
  rendering — mide vía el navegador de huesos, documentado el porqué.
- **MUST** el resultado (mediana, máximo) queda escrito en `progress.md`
  con veredicto explícito.
- **MUST NOT** esta historia no intenta bajar la latencia si el resultado
  supera 100ms — eso es un hallazgo aparcado, no una tarea de e7.10.
