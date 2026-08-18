# Story e7.10: Medir `should-perf-007` — Progress

## T1 · Medir la latencia de selección con CPU throttling

- **Harness:** CDP `Emulation.setCPUThrottlingRate` a 4x, viewport
  390×844, 20 clics sobre `BoneNavigator` (mismo commit de React que
  resalta la malla, sin el costo de raycasting bajo software rendering).
- **Resultado real:** mediana **4,8 ms**, máximo **15,2 ms** — muy por
  debajo del umbral de 100 ms. Veredicto: **cumple**, con margen amplio
  (~20x).
- **Gates:** `./scripts/check` verde · `perf-selection.spec.ts` verde.

## T2 · Corregir `should-perf-007` en `governance/guardrails.md`

- **Cambio:** se quitó la cláusula "el SVG se sirve por debajo de 500 KB"
  (residuo de la comparación de opciones de ADR-001, nunca una condición
  vigente — ADR-001 adoptó el glTF por cobertura) y se dejó la columna de
  verificación apuntando al mecanismo real (Playwright + CDP) con el
  resultado medido.
- **Gates:** `./scripts/check` verde.

Nada que el plan no anticipara. La Task 1 no tuvo ciclo RED-GREEN
tradicional —medía infraestructura, no corregía una regla de negocio— tal
como el plan lo había anotado de antemano.

## Cierre

**Chequeo de tests huérfanos:** ningún test existente importa
`perf-selection.spec.ts` (es nuevo) ni depende del texto de
`governance/guardrails.md` (es documentación, sin test que la lea). Los 234
tests unitarios y las suites de Playwright ya verificadas en e7.9 siguen
verdes sin tocarse.

**Criterios de aceptación:**

| Criterio | Estado |
|---|---|
| Must 1 · medición con CPU throttling real | cumplido |
| Must 2 · evita el costo de raycasting bajo software rendering | cumplido — medido vía navegador, documentado el porqué |
| Must 3 · resultado escrito con veredicto explícito | cumplido — mediana 4,8 ms, máximo 15,2 ms, cumple |
| Must NOT · sin intentar optimizar | respetado — no hace falta, cumple con margen amplio |

**Gates finales:** `./scripts/check` verde (234 tests) ·
`npx playwright test e2e/perf-selection.spec.ts` verde (1/1).
