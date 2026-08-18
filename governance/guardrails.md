# Guardrails: huesos-mono

Quality bars the work must respect. `Level` is `must` or `should`. `ID` =
`{level}-{category}-{NNN}`. Each guardrail says how it's verified and, where it
applies, which requirement it derives from.

| ID | Level | Guardrail | Verification | Derived from |
|----|-------|-----------|--------------|--------------|
| must-test-001 | must | Toda regla de validación de respuestas tiene test unitario con casos correctos, incorrectos y límite (tildes, mayúsculas, sinónimos, cadena vacía) | `./scripts/check` — vitest | RF-06 |
| must-data-002 | must | El catálogo de huesos se valida automáticamente: 206 entradas, sin ids ni nombres duplicados, toda entrada con región gráfica existente en el SVG | `./scripts/check` — test de integridad del catálogo | RF-08 |
| must-data-003 | must | Ningún nombre de hueso llega al DOM en modo test antes de que el usuario responda | `./scripts/check` — test de render sobre el modo test | RF-04, RF-05 |
| must-type-004 | must | TypeScript en modo `strict` con `noUncheckedIndexedAccess`; prohibido `any` y `as` para silenciar el compilador | `./scripts/check` — `tsc --noEmit` y lint | — |
| must-a11y-005 | must | Toda región de hueso es alcanzable y activable por teclado, y expone su nombre accesible; el color nunca es el único indicador de acierto o error | `./scripts/check` — test con Testing Library por roles y nombres accesibles | RF-01, RF-07 |
| must-privacy-006 | must | El progreso del estudiante no sale del navegador: sin backend, sin telemetría, sin peticiones de red en tiempo de ejecución | `./scripts/check` — test que falla ante cualquier `fetch`/`XMLHttpRequest` en el bundle de la app | RF-09 |
| should-perf-007 | should | La vista del esqueleto completo responde a la selección en menos de 100 ms en un móvil de gama media | Playwright con CPU throttling (Chrome DevTools Protocol) — medido en e7.10, mediana 4,8 ms / máximo 15,2 ms a 4x. La cláusula original también exigía un SVG por debajo de 500 KB; ADR-001 (aceptado) descartó el SVG por cobertura y adoptó el modelo glTF, 1,9 MB — no hay presupuesto de peso vigente sobre ese activo | RF-01 |
| should-style-008 | should | Lint y formato pasan sin excepciones anotadas; una supresión de regla exige comentario con el motivo | `./scripts/check` — biome | — |
| should-i18n-009 | should | Los nombres anatómicos viven en el catálogo de datos, nunca incrustados en componentes | Revisión en quality-review; grep de literales anatómicos en `src/components` | RF-08 |
