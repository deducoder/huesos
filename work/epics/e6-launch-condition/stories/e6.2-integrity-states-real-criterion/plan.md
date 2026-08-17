# Story e6.2: Integrity test states the real criterion — Plan

> Size: S

**Nota sobre el ciclo TDD.** Una prueba que afirma el estado actual —válido—
pasa en cuanto se escribe, así que aquí no hay un RED natural. El RED honesto
es **romper el dato a propósito** y ver la prueba fallar, igual que en e5.5:
un gate que nadie vio ponerse rojo no es un gate, es una intención
(`a-reintroduced-defect-must-actually-break`).

## Tasks

### T1 · La aserción del criterio de ADR-006

- **Files:** modify `src/data/catalog.coverage.test.ts`
- **TDD:** RED — quitarle la malla a una entrada sin darle razón y ver la prueba
  fallar nombrándola → GREEN — revertir el dato; la prueba pasa → REFACTOR.
- **Satisfies:** los tres escenarios del scope.
- **Verify:** `npx vitest run src/data/` · `./scripts/check`
- **Commit:** `test(catalog): assert the launch condition as ADR-006 defines it`

### T2 · Resolver la redundancia con las pruebas existentes

- **Files:** modify `src/data/catalog.coverage.test.ts`
- Con las tres delante —la nueva, `ancla 199 entradas` y `declara exactamente 7
  ausencias`—, decidir cuál dice algo que las otras no. El `design.md` de la
  épica ya adelanta el criterio: el 199 y el 7 documentan el estado real del
  activo y sirven de detector de cambios silenciosos en el modelo, así que
  probablemente no sobren; lo que no puede quedar es la **misma** afirmación en
  dos sitios.
- **Verify:** `./scripts/check` verde, y la decisión escrita en `progress.md`
  con su razón — se quiten o se queden.
- **Commit:** `test(catalog): keep each coverage assertion saying something distinct`

## Order & risks

- **Execution order:** T1 → T2.
- **Risks:**
  - *Escribir una prueba que no puede fallar nunca* — el tipo `Bone` ya impide
    el estado incoherente, así que la aserción podría ser decorativa. → T1 la
    rompe a propósito. Si resultara imposible romperla sin pelearse con el
    compilador, eso mismo es el hallazgo y va al `progress.md`.
