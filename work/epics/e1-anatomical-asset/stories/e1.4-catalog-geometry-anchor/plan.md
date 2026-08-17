# Story e1.4: Catalog-geometry anchor — Plan

> Size: S

## Tasks

### T1 · Anclar el catálogo a la geometría

- **Files:** modify `tests/skeleton-asset.test.ts` o create
  `tests/catalog-geometry.test.ts`
- **TDD:** RED — la prueba exige que toda malla nombrada exista, contra un
  catálogo al que se le inyecta un nombre roto → GREEN — el cruce real →
  REFACTOR — reutilizar el lector de GLB de e1.1 en vez de duplicarlo.
- **Satisfies:** los tres escenarios del scope.
- **Verify:** `npx vitest run tests/catalog-geometry.test.ts`, luego `./scripts/check`.
- **Commit:** `test(data): anchor every catalog entry to a real mesh`

### T2 · Manual integration test

- Romper a mano un `meshName` del catálogo, comprobar que el gate se pone rojo
  nombrando la entrada, y restaurarlo.
- **Verify:** el mensaje de fallo identifica la entrada culpable.

## Order & risks

- **Execution order:** T1, y T2 lo valida desde fuera.
- **Risks:** *la prueba podría pasar por vacuidad si el catálogo estuviera
  vacío* → se afirma también que hay entradas ancladas, no solo que ninguna falla.
