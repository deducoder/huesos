# Story e1.2: Catalog schema — Plan

> Size: S

## Tasks

### T1 · Tipos y catálogo semilla

- **Files:** create `src/data/bone.ts`, `src/data/catalog.ts`,
  `src/data/catalog.test.ts`
- **TDD:** RED — la prueba de integridad exige ids únicos, nomenclatura
  completa y coherencia de lateralidad sobre un catálogo que aún no existe →
  GREEN — los tipos y dos entradas semilla → REFACTOR — extraer el predicado de
  validación si el test lo repite.
- **Satisfies:** los cuatro escenarios del scope.
- **Verify:** `npx vitest run src/data/catalog.test.ts`, luego `./scripts/check`.
- **Commit:** `feat(data): add bone catalog schema and integrity test`

### T2 · Manual integration test

- Importar el catálogo desde un módulo suelto y comprobar que TypeScript rechaza
  una entrada mal formada en tiempo de compilación, no solo en tiempo de test.
- **Verify:** `tsc --noEmit` falla al añadir una entrada con región inexistente,
  y vuelve a pasar al quitarla.

## Order & risks

- **Execution order:** T1 concentra todo; T2 confirma que el tipo protege de
  verdad.
- **Risks:** *el esquema se queda corto al poblar las regiones reales* → e1.5 es
  precisamente la región piloto que lo somete a datos de verdad antes de las 199.
