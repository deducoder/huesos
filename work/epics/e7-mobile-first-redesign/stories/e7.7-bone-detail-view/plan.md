# Story e7.7: Ficha del hueso — Plan

> Size: XS

## Tasks

### T1 · El botón «← Volver» al mínimo táctil

- **Files:** modify `src/features/bone-detail/BoneDetailView.tsx`;
  modify `e2e/mobile-shell.spec.ts`.
- **TDD:** RED una prueba de navegador — el botón «Volver» mide ≥44×44 px —
  falla con 34×83 → GREEN `min-h-tactil border-2 rounded-suave` → REFACTOR
  ninguno.
- **Satisfies:** Must 1 del design.
- **Verify:** `npx vite build` y luego `npx playwright test e2e/mobile-shell.spec.ts`.
- **Commit:** `feat(bone-detail): thumb-sized back button`

### T2 · Manual integration test

- Con la aplicación por el túnel: abrir la ficha de un hueso con geometría y
  de uno sin ella, confirmar que «Volver» se pulsa sin apuntar en las dos.
- **Verify:** `./scripts/check-integration` antes de cerrar.

## Order & risks

- **Execution order:** T1 → T2. Una sola tarea de código.
- **Dependencies:** ninguna.
- **Risks:** ninguno de fondo — es un cambio de una clase sobre un botón ya
  probado.
