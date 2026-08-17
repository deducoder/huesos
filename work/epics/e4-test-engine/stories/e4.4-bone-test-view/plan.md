# Story e4.4: Modo test sobre hueso individual — Plan

> Size: XS

## Tasks

### T1 · `BoneTestView`: compone `TestQuestion` + `IsolatedBoneScene`

- **Files:** create `src/features/test/BoneTestView.tsx`; test
  `src/features/test/BoneTestView.test.tsx`
- **TDD:** RED — con `IsolatedBoneScene` sustituida por un doble (mismo
  patrón que `BoneDetailView.test.tsx` de e3.2): `must-data-003` sobre las
  206 entradas del catálogo, igual que `SkeletonTestView.test.tsx`; el
  doble de la escena recibe el `boneId` de la pregunta activa → GREEN:
  composición directa, sin lógica propia → REFACTOR
- **Satisfies:** los tres escenarios Gherkin del scope
- **Verify:** `npx vitest run src/features/test/BoneTestView.test.tsx && ./scripts/check`
- **Commit:** `feat(test): wire the isolated-bone test view`

### T2 · Prueba manual de integración

- Levantar `npm run dev`, montar `BoneTestView` temporalmente: confirmar a
  ojo que el hueso se ve realmente aislado (sin el resto del esqueleto,
  reutilizando el encuadre de e3.1), sin ningún nombre visible antes de
  responder, y que responder mal muestra ambas nomenclaturas igual que en
  `SkeletonTestView`.
- **Verify:** confirmado a ojo, sin errores en consola del navegador.

## Order & risks

- **Execution order:** T1 único cambio de código → T2 confirma en
  navegador real.
- **Dependencies:** ninguna nueva — compone `TestQuestion` (e4.2/e4.3) e
  `IsolatedBoneScene` (e3.1) sin tocar ninguno de los dos.
- **Risks:**
  - Que `TestQuestion` resulte no ser tan agnóstico de la escena como e4.2
    asumía, y haga falta modificarlo → mitigación: si pasa, es un hallazgo
    sobre e4.2, se reporta y se decide ahí, no se fuerza un parche en esta
    historia para que "encaje".
