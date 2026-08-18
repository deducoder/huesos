# Story e7.8: Modo test — Plan

> Size: S

## Tasks

### T1 · Elección de variante al mínimo táctil

- **Files:** modify `src/App.tsx`; modify `e2e/mobile-shell.spec.ts`.
- **TDD:** RED los dos botones de `ElegirVarianteDeTest` miden ≥44 px —
  falla con 42 → GREEN `min-h-tactil rounded-suave border-2` → REFACTOR
  ninguno.
- **Satisfies:** Must 1 del design (mitad).
- **Verify:** `npx vite build && npx playwright test e2e/mobile-shell.spec.ts`.
- **Commit:** `feat(test): thumb-sized variant choice buttons`

### T2 · El campo y sus dos botones al mínimo táctil

- **Files:** modify `src/features/test/TestQuestion.tsx`; modify
  `e2e/mobile-shell.spec.ts`.
- **TDD:** RED el campo, «Responder» y «Siguiente pregunta» miden ≥44 px, y
  el campo+botón siguen en la misma fila sin desbordar 390 — falla con 38/34
  → GREEN las tres clases del design → REFACTOR ninguno.
- **Satisfies:** Must 1 (resto), Must 2.
- **Verify:** `npx vite build && npx playwright test e2e/mobile-shell.spec.ts`.
- **Commit:** `feat(test): thumb-sized answer field and buttons`

### T3 · Manual integration test

- Con la aplicación por el túnel: elegir cada variante, responder bien y
  mal, pasar a «Siguiente pregunta» — confirmar que los cinco controles se
  tocan sin apuntar y que nada se desborda.
- **Verify:** `./scripts/check-integration` antes de cerrar.

## Order & risks

- **Execution order:** T1 → T2 → T3. Independientes entre sí; van en el
  orden en que aparecen en el flujo (elegir variante, después responder).
- **Dependencies:** ninguna real.
- **Risks:**
  - *Crecer el campo y el botón a 44 px desborda la fila en 390 px* → el
    ancho no cambia con la altura, pero T2 lo mide en vez de asumirlo —
    la corrección que el scope ya dejó anotada.
