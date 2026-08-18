# Story e8.1: Merged navbar — Progress

## T1 · Fundir cabecera y pestañas en una sola fila

`<header>` y `Pestanas` fundidos: `<h1>` baja de `text-titulo` (1.75rem)
a `text-lg`; el `<nav>` pierde su propio borde/fondo/padding vertical
(ahora los provee el `<header>`, `items-stretch` + `py-2` en el `nav`
para que su borde inferior siga coincidiendo con el de la fila —
resuelto en el diseño, no descubierto acá). 2 tests nuevos: título y
pestañas dentro del mismo `banner`; en modo ficha, el `banner` muestra
el título sin pestañas. Mutación forzada (volver a poner `Pestanas`
como hermano del `header`) confirmó que el primer test lo detecta.

Gate: `./scripts/check` verde (268 tests, lint/format/types limpios).
Ninguna desviación del plan — el ajuste de `items-stretch`/`py-2` que el
diseño anticipó como riesgo se implementó directo, sin necesitar un ciclo
de prueba-error.

## T2 · Medir en un navegador real, ajustar y barrer el token huérfano

**Hallazgo real, no anticipado por el plan:** al medir con Playwright,
`page.getByRole('banner')` no encontraba nada — 0 resultados. Un
`<header>` anidado dentro de `<main>` pierde el landmark `banner` según
la especificación de accesibilidad (solo lo tiene si NO es descendiente
de `article`/`aside`/`main`/`nav`/`section`), y Chromium lo respeta.
**`vitest`/jsdom no**: los dos tests de T1 que usaban
`screen.getByRole('banner')` pasaban en verde sin que eso significara
nada sobre un navegador real — el mismo patrón que ya está en memoria
("`sr-only` se comporta distinto según la capa de prueba"), ahora para un
rol de landmark en vez de una clase CSS. Corregido: `<header
data-testid="cabecera">` en `App.tsx`, los dos tests de T1 usan
`getByTestId('cabecera')` en vez de `getByRole('banner')`.

Medido con Playwright real a 390×844 tras el fix: sin desborde horizontal
(`scrollWidth` = 390, exacto), las tres pestañas conservan 44px de alto,
`nav.bottom` (60px) a solo 2px de `header.bottom` (62px) — exactamente el
`border-b-2` del header, ya cubierto por la tolerancia de 2px que
`e2e/mobile-shell.spec.ts` ya tenía. El ajuste de `items-stretch`/`py-2`
del diseño funcionó al primer intento, sin necesitar iterar.

`--text-titulo` (`src/index.css`) quedó sin consumidores tras bajar el
título a `text-lg` — barrido, borrado en el mismo commit.

Suite de integración completa: 21/21 en verde
(`./scripts/check-integration`). Gate rápido verde (268 tests).

## Finalize

- Full gate set: verde (`./scripts/check` — 268 tests;
  `./scripts/check-integration` — 21/21).
- Orphaned-test check: `--text-titulo` fue el único huérfano real,
  barrido en T2. Ningún otro archivo referenciaba `Pestanas` fuera de
  `App.tsx`/`App.test.tsx`.
- Acceptance criteria: cumplidas de punta a punta, incluida la que el
  gemba de T2 encontró (el landmark `banner` no existe en un navegador
  real) — corregida dentro de la misma historia.
