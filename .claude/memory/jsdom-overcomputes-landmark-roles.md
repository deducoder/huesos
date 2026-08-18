---
name: jsdom-overcomputes-landmark-roles
description: "getByRole('banner') pasa en jsdom para un <header> anidado dentro de <main>, aunque la spec de accesibilidad le niega ese landmark ahí — jsdom no implementa la exclusión, un navegador real (Playwright) sí. Cualquier rol derivado de la posición estructural del elemento (no de un atributo aria-* explícito) merece la misma sospecha."
metadata: 
  node_type: memory
  type: pitfall
  originSessionId: 90c83924-1bba-49eb-a990-063ca3a7789f
  modified: 2026-08-18T02:42:36.291Z
---

En e8.1, dos tests nuevos de `App.test.tsx` usaban
`screen.getByRole('banner')` para ubicar el `<header>` fusionado — pasaron
en verde en `vitest`. Al medir con Playwright (T2, navegador real),
`page.getByRole('banner')` devolvía **0 resultados**: un `<header>` que es
descendiente de `<main>` pierde el landmark `banner` según la
especificación WAI-ARIA (la excepción aplica a `article`/`aside`/`main`/
`nav`/`section` como ancestro) — y en este proyecto, `<header>` vive
dentro de `<main>` desde e7.1. Chromium lo respeta; `jsdom`/Testing
Library no implementan esa exclusión y devuelven el rol igual.

**Por qué importa:** los tests pasaron sin decir nada falso sobre lo que
hacían (`getByRole('banner')` sí encuentra el `<header>` en jsdom), pero
la afirmación implícita —"esto es lo que un navegador real vería"— era
falsa. Es la misma familia de problema que
[[sr-only-behaves-differently-per-test-layer]] (jsdom no computa layout
real), aplicada acá a la computación del árbol de accesibilidad en vez
del layout visual: dos mecanismos distintos, el mismo patrón de fondo —
jsdom es una implementación aproximada, no una réplica fiel del navegador.

**How to apply:** cualquier `getByRole` cuyo rol dependa de la posición
estructural del elemento en el DOM (landmarks implícitos como `banner`,
`main`, `contentinfo`, `region`) — no de un atributo `aria-*` explícito
como `aria-label`/`role="..."` — merece verificarse con un navegador real
antes de confiar en que un test verde en jsdom significa algo fuera de
jsdom. Preferir `data-testid` para agrupar elementos por estructura
cuando el rol implícito depende del contexto, y reservar `getByRole` para
roles con un atributo explícito que no varíe según el DOM circundante.
