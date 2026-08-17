# Story e1.6: Complete catalog — Plan

> Size: L

### T1 · Exigir el catálogo completo por regiones

- **Files:** create `src/data/catalog.coverage.test.ts`
- **TDD:** RED — el recuento por región contra el desglose canónico, 199
  ancladas y 7 ausentes.
- **Verify:** `npx vitest run src/data/catalog.coverage.test.ts`
- **Commit:** `test(data): require full canonical bone coverage`

### T2 · Cráneo, cara y tórax

- **Files:** modify `src/data/catalog.ts`
- **TDD:** GREEN parcial — 47 entradas (8 + 14 + 25).
- **Commit:** `feat(data): catalog skull, face and thorax`

### T3 · Cinturas y miembros

- **Files:** modify `src/data/catalog.ts`
- **TDD:** GREEN — 126 entradas (4 + 60 + 2 + 60).
- **Commit:** `feat(data): catalog girdles and limbs`

### T4 · Las siete ausencias declaradas

- **Files:** modify `src/data/catalog.ts`
- **TDD:** GREEN final — osículos e hioides con su razón.
- **Commit:** `feat(data): declare the seven bones the model lacks`

### T5 · Manual integration test

- Cruzar el catálogo contra el inventario: ninguna malla ósea del modelo debe
  quedar sin entrada, salvo el manubrio por la decisión declarada en el scope.
- **Verify:** la diferencia entre mallas óseas y `meshName` catalogados es
  exactamente `Manubrium of sternum`.

## Order & risks

- **Execution order:** T1 fija la exigencia; T2-T4 la satisfacen por bloques, de
  modo que cada commit deje el gate en un estado conocido.
- **Risks:**
  - *173 entradas transcritas a mano invitan a la errata* → el anclaje de e1.4
    atrapa cualquier `meshName` inexistente, y T5 comprueba lo que sobra.
  - *El recuento canónico puede discrepar según cómo se cuenten los fusionados*
    → el criterio queda fijado en el test y explicado en el scope.
