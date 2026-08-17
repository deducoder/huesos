# Story e1.5: Spine catalog — Plan

> Size: M

### T1 · Exigir la columna completa

- **Files:** create `src/data/catalog.spine.test.ts`
- **TDD:** RED — 26 entradas de columna, todas impares, cada nivel con su sigla
  como sinónimo; falla porque el catálogo solo tiene las semillas.
- **Satisfies:** escenarios 1 a 3.
- **Verify:** `npx vitest run src/data/catalog.spine.test.ts`
- **Commit:** `test(data): require the 26 spine entries`

### T2 · Poblar la columna

- **Files:** modify `src/data/catalog.ts`
- **TDD:** GREEN — las 26 entradas transcritas del inventario → REFACTOR —
  agrupar por región si el archivo se vuelve ilegible.
- **Satisfies:** los cuatro escenarios.
- **Verify:** `./scripts/check`
- **Commit:** `feat(data): catalog the 26 vertebrae`

### T3 · Manual integration test

- Comprobar contra el inventario que las 26 mallas de columna del modelo tienen
  entrada, y que ninguna quedó fuera.
- **Verify:** la lista del inventario filtrada por columna coincide una a una con
  los `meshName` catalogados.

## Order & risks

- **Execution order:** T1 fija la exigencia antes de teclear los datos, para que
  el volumen se escriba contra una prueba y no al revés.
- **Risks:** *transcribir 26 entradas invita a la errata* → el anclaje de e1.4
  atrapa cualquier `meshName` mal escrito, y T3 comprueba que no falte ninguna.
