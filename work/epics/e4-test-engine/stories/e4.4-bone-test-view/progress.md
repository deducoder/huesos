# Story e4.4: Modo test sobre hueso individual — Progress

## T1 · `BoneTestView`: compone `TestQuestion` + `IsolatedBoneScene`

Composición directa, sin lógica propia — confirma que `TestQuestion`
(e4.2/e4.3) quedó correctamente desacoplado de qué escena muestra. 3 tests,
incluido `must-data-003` sobre las 206 entradas. Gate: verde tras
`biome format --write`. Ninguna desviación del plan.

## T2 · Prueba manual de integración

Montaje temporal en `App.tsx`, `vite build` + `vite preview`, Playwright
real. Encontró **dos defectos reales**, ninguno anticipado por el plan:

**1. `must-data-003` roto por `aria-label`, no por texto.** El `<div>` que
envuelve el `<canvas>` de `IsolatedBoneScene` traía
`aria-label="{nombre del hueso}, aislado en 3D"` — heredado de e3.2, donde
es correcto (la ficha ya reveló el hueso). En modo test, un lector de
pantalla habría anunciado el nombre antes de responder. El test de
`must-data-003` de T1 no lo vio porque comprueba `textContent`, y
`aria-label` no forma parte de él. Se agregó una segunda prueba
específica para atributos `aria-label`, con un doble que reproduce el
cálculo real (no uno inventado) para que fuera un RED genuino. Fix:
`accessibleLabel` opcional en `IsolatedBoneScene` (mismo patrón que
`accessibleHint` de `SkeletonScene`, e4.2), con el texto de e3.2 como valor
por defecto — retrocompatible. Commit `0327f42`.

**2. Huesos diminutos (falanges) no se veían — lienzo en blanco, sin
error.** Investigado con capturas de control: el plano cercano (`near`)
por defecto de three.js (0.1) recorta la cámara calculada por
`distanceToFit` para un hueso muy pequeño, cuya distancia de encuadre da
por debajo de 0.1 unidades. Fix: `near={0.001}` en el `PerspectiveCamera`.
Verificado con 5 huesos al azar tras el fix, incluidas falanges y una
vértebra pequeña — los 5 se ven correctamente. Commit `47ce296`.

Tras ambos fixes, reverificado de punta a punta: `aria-label` genérico
antes de responder, corrección completa (ambas nomenclaturas) tras
responder mal, huesos de cualquier tamaño visibles.

## Finalize

- Full gate set: verde (`./scripts/check`, 138 tests, lint, format, types).
- Orphaned-test check: `BoneTestView.test.tsx` es el único test que importa
  `BoneTestView`. `IsolatedBoneScene` ganó una prop opcional retrocompatible
  — su único consumidor previo (`BoneDetailView`, e3.2) no cambia de
  comportamiento ni necesita actualizarse; confirmado que sus tests siguen
  en verde sin tocarlos.
- Acceptance criteria: cumplidos de punta a punta — los tres escenarios
  Gherkin del scope, verificados por test (T1) e inspección visual real
  (T2), con dos defectos reales encontrados y corregidos en el camino.
