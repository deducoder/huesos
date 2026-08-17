# Story e4.5: Acceso al modo test y guardrail de fuga — Progress

## T1 · `App.tsx`: pestaña "Test" con elección de variante

`Modo` ganó tres casos (`'test-elegir'`, `'test-esqueleto'`,
`'test-hueso'`); `Pestanas` se generalizó a una lista (`PESTANIAS`) en vez
de botones repetidos a mano, con la pestaña "Test" marcada activa para
cualquiera de los tres. `ElegirVarianteDeTest` es la pantalla intermedia
entre elegir la pestaña y empezar a preguntar. 4 tests nuevos + los 4 de
regresión existentes, 8/8 en `App.test.tsx`. Gate: verde tras
`biome format --write`. Ninguna otra desviación del plan.

## T2 · Confirmar `must-data-003` en el gate — sin reescribirlo

Confirmado: `TestQuestion.test.tsx` (1 caso) y `BoneTestView.test.tsx` (2
casos, texto + `aria-label`) corren dentro de `./scripts/check` desde
e4.2/e4.4 — nada que agregar. El scope de la épica había previsto esta
prueba como pendiente; el gemba de e4.2/e4.4 ya la había cubierto sin que
esta historia lo supiera de antemano.

## T3 · Prueba manual de integración

`vite build` + `vite preview`, Playwright real: pestaña "Test" muestra la
elección; "Esqueleto completo" resalta un hueso en la escena completa (el
fémur derecho, en la captura); "Hueso aislado" aísla otro hueso sin
esqueleto alrededor; "Explorar" y "Fichas" siguen intactos tras pasar por
"Test". Los cuatro casos correctos a simple vista. Mismo 404 de consola
aislado ya visto en historias anteriores, no reproducible.

## Finalize

- Full gate set: verde (`./scripts/check`, 141 tests, lint, format, types).
- Orphaned-test check: `App.test.tsx` es el único test que importa `App`,
  y se actualizó dentro de T1 — nada huérfano.
- Acceptance criteria: cumplidos de punta a punta — los cuatro escenarios
  Gherkin del scope, verificados por test (T1) e inspección visual real
  (T3), con `must-data-003` confirmado en el gate (T2).
