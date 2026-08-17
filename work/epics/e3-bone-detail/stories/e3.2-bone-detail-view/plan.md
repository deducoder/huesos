# Story e3.2: Ficha completa desde la selección de E2 — Plan

> Size: S

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · `BoneIdentity`: "impar" explícito + botón "Ver ficha completa"

- **Files:** modify `src/components/BoneIdentity.tsx`; test
  `src/components/BoneIdentity.test.tsx`
- **TDD:** RED — un hueso impar (`sacrum`) muestra el texto "impar" en la
  lista de definiciones (no solo omite "Lado"); con la prop `onViewDetail`
  presente y un hueso elegido, aparece un botón "Ver ficha completa" que al
  pulsarlo llama `onViewDetail(bone.id)`; sin `onViewDetail`, o sin hueso
  elegido, el botón no aparece → GREEN: usar `isUnpaired` ya existente de
  `data/bone.ts`; agregar la prop opcional y el botón condicional → REFACTOR
- **Satisfies:** escenarios 2 y 3 del scope ("impar" explícito, lado
  visible en par)
- **Verify:** `npx vitest run src/components/BoneIdentity.test.tsx && ./scripts/check`
- **Commit:** `feat(identity): say "impar" explicitly and offer the full detail view`

### T2 · `BoneDetailView`: compone escena aislada + identidad + "Volver"

- **Files:** create `src/features/bone-detail/BoneDetailView.tsx`; test
  `src/features/bone-detail/BoneDetailView.test.tsx`
- **TDD:** RED — con `IsolatedBoneScene` sustituida por un doble (mismo
  patrón que `ExploreView.test.tsx` usa para `SkeletonScene`: WebGL no
  existe en jsdom), `BoneDetailView` muestra la identidad del `boneId`
  recibido (nombre, región) y un botón "Volver" que llama `onBack` →
  GREEN: composición directa de `IsolatedBoneScene` + `BoneIdentity` (sin
  `onViewDetail`, de solo lectura) → REFACTOR
- **Satisfies:** escenario 1 del scope (ficha completa desde la selección)
- **Verify:** `npx vitest run src/features/bone-detail/BoneDetailView.test.tsx && ./scripts/check`
- **Commit:** `feat(bone-detail): compose the isolated scene with the full identity panel`

### T3 · `App.tsx`: selector de modo, extremo a extremo

- **Files:** modify `src/App.tsx`, `src/features/explore/ExploreView.tsx`;
  test `src/App.test.tsx`
- **TDD:** RED — con `SkeletonScene` e `IsolatedBoneScene` sustituidas por
  dobles, seleccionar un hueso en `ExploreView`, pulsar "Ver ficha completa"
  y confirmar que se muestra `BoneDetailView` con ese hueso; pulsar "Volver"
  y confirmar que se regresa a `ExploreView` con la selección anterior
  intacta (ADR-003: sin router, estado `'explorar' | 'ficha'` en `App.tsx`)
  → GREEN: `ExploreView` recibe `onViewDetail` y lo pasa a `BoneIdentity`;
  `App` mantiene el estado de modo y decide qué vista montar → REFACTOR
- **Satisfies:** escenario 1 y 4 del scope (ida y vuelta completa)
- **Verify:** `npx vitest run src/App.test.tsx && ./scripts/check`
- **Commit:** `feat(app): wire the bone detail view behind a mode switch`

### T4 · Prueba manual de integración

- Levantar `npm run dev`: seleccionar varios huesos (par en ambos lados,
  impar) en `ExploreView`, abrir su ficha completa, confirmar a ojo que la
  escena aislada se ve bien encuadrada (reutilizando la verificación visual
  de e3.1) y que "Volver" regresa sin perder la selección.
- **Verify:** confirmado a ojo, sin errores en consola del navegador.

## Order & risks

- **Execution order:** T1 (aislado, testable en jsdom) → T2 (compone T1 con
  la escena de e3.1, mockeada en test) → T3 (wiring de punta a punta,
  depende de T1 y T2) → T4 (confirma en navegador real).
- **Dependencies:** secuencial — T2 depende de que `BoneIdentity` de T1
  tenga la prop `onViewDetail`; T3 depende de que `BoneDetailView` de T2
  exista.
- **Risks:**
  - El estado de modo en `App.tsx` podría filtrarse a `ExploreView` o
    `BoneDetailView` si no se resiste la tentación de que una vista conozca
    a la otra → mitigación: ninguna vista importa a la otra, ambas reciben
    solo callbacks del padre común (mismo patrón que `domain/selection.ts`
    ya usa dentro de `ExploreView`).
