# Story e3.1: Escena de hueso aislado — Plan

> Size: M

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · Función pura: qué malla es visible al aislar un hueso

- **Files:** create `src/domain/isolation.ts`; test `src/domain/isolation.test.ts`
- **TDD:** RED — `visibleForIsolation(bones, meshName, half, targetId)` para:
  un hueso par en su lado correcto (`true`), el mismo hueso en el lado
  contrario (`false`), un hueso impar (`true` en cualquier mitad), otro
  hueso cualquiera (`false`), una malla sin catálogo — diente, cartílago,
  sesamoideo (`false`, mismo camino que "otro hueso", sin caso especial) →
  GREEN: implementación mínima sobre `boneIdForMesh` ya existente → REFACTOR
- **Satisfies:** los cuatro escenarios Gherkin del scope
- **Verify:** `npx vitest run src/domain/isolation.test.ts && ./scripts/check`
- **Commit:** `feat(domain): decide mesh visibility when isolating a bone`

### T2 · `IsolatedBoneScene`: cargar el modelo y aplicar la visibilidad

- **Files:** create `src/components/IsolatedBoneScene.tsx`
- **TDD:** sin RED de componente (canvas WebGL fuera de cobertura automática,
  por ADR-002) — implementación directa, reutilizando el patrón de
  `SkeletonHalf` en `SkeletonScene.tsx`: carga `skeleton.glb` con Draco,
  recorre ambas mitades, usa `visibleForIsolation` de T1 para fijar
  `malla.visible` en vez de tocar el material. Encuadre de cámara con
  `Box3().setFromObject()` sobre las mallas visibles únicamente (no sobre la
  escena completa) y `distanceToFit` de `domain/framing.ts`, ya existente
- **Satisfies:** ejemplo del scope — dado un `id`, solo esa malla visible
- **Verify:** `./scripts/check` (types + lint; sin test de componente)
- **Commit:** `feat(scene): isolate a single bone from the shared model`

### T3 · Prueba manual de integración

- Levantar `npm run dev`, montar `IsolatedBoneScene` con un `id` de prueba
  (temporalmente desde `App.tsx` o una ruta de desarrollo) y verificar a ojo:
  - Un hueso par (`femur-left`): solo esa malla visible, encuadrada.
  - Un hueso impar (`sacrum`): solo esa malla visible.
  - Un `id` inexistente: nada visible, sin error en consola.
  - Alternar entre varios huesos no deja residuos de mallas de otro hueso
    visibles (b2.2 volvería a existir con otra forma si esto fallara).
- **Verify:** confirmado a ojo, sin errores en consola del navegador; se
  retira el montaje temporal de prueba antes del commit final de la
  historia (e3.2 lo monta de verdad desde `BoneDetailView`)

## Order & risks

- **Execution order:** T1 (dominio, testable, riesgo del cálculo de
  visibilidad) → T2 (integra con three.js/r3f, no testable en jsdom) → T3
  (confirma en navegador real).
- **Dependencies:** secuencial — T2 depende de la función de T1; T3 depende
  de que T2 exista para montarlo.
- **Risks:**
  - `Box3().setFromObject()` podría incluir mallas invisibles si three.js no
    respeta `visible` en el cálculo del bounding box → mitigación: filtrar
    explícitamente el árbol antes de pasar a `Box3`, no confiar en el flag.
  - El manubrio del esternón (malla sin entrada propia — ver ADR-001 y
    `work/epics/e1-anatomical-asset/`) podría quedar visible junto al cuerpo
    del esternón si el nombre de malla se agrupa distinto → verificar en T3
    con `id = "sternum"` explícitamente.
