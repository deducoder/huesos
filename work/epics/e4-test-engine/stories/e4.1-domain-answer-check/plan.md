# Story e4.1: Dominio del modo test — Plan

> Size: S

## Tasks

### T1 · `domain/answer-check.ts`: normalización y validación tolerante

- **Files:** create `src/domain/answer-check.ts`; test
  `src/domain/answer-check.test.ts`
- **TDD:** RED — los siete casos de la tabla de ejemplo del scope, con
  datos reales del catálogo (`fémur`/`os femoris`/`hueso del muslo`,
  `primera vértebra cervical`/`C1`), más cadena vacía y solo-espacios →
  GREEN: `normalizeAnswer` (minúsculas vía `toLocaleLowerCase('es')`, sin
  tildes vía `normalize('NFD')` + strip de diacríticos, `trim`, colapsar
  espacios, quitar un artículo inicial `el|la|los|las`) e
  `isCorrectAnswer` comparando contra `[es, la, ...synonyms]` normalizados
  → REFACTOR
- **Satisfies:** los cinco escenarios Gherkin del scope
- **Verify:** `npx vitest run src/domain/answer-check.test.ts && ./scripts/check`
- **Commit:** `feat(domain): validate written answers tolerantly`

### T2 · `domain/quiz.ts`: elegir un hueso preguntable

- **Files:** create `src/domain/quiz.ts`; test `src/domain/quiz.test.ts`
- **TDD:** RED — `pickTestableBone(catalog)` nunca devuelve un hueso con
  `meshName === null`, corrido muchas veces contra el catálogo real (no
  una muestra) para no depender de qué posición cayó al azar; con
  `excluirId`, nunca devuelve ese id (salvo que sea el único preguntable,
  caso trivial) → GREEN: filtrar por `meshName !== null`, excluir
  `excluirId` si se pasó, elegir al azar del resto → REFACTOR
- **Satisfies:** el escenario Gherkin de selección del scope
- **Verify:** `npx vitest run src/domain/quiz.test.ts && ./scripts/check`
- **Commit:** `feat(domain): pick a testable bone at random`

### T3 · Verificación manual contra el catálogo completo

- Sin UI todavía (es e4.2+): la verificación "de punta a punta" acá es un
  script ad-hoc de Node que recorre las 206 entradas reales y confirma que
  `isCorrectAnswer(bone.es, bone)` y `isCorrectAnswer(bone.la, bone)` dan
  `true` para **cada una** — no solo los siete casos de ejemplo. Atrapa
  cualquier entrada real del catálogo con un carácter o forma que las
  pruebas unitarias, acotadas a unos pocos huesos, no cubrieron.
- **Verify:** el script imprime 0 fallos sobre las 206 entradas; se borra
  después de confirmarlo, no se commitea (es verificación, no producto).

## Order & risks

- **Execution order:** T1 (más riesgo: la normalización es donde vive toda
  la incertidumbre real del epic) → T2 (más simple, sin dependencia de T1
  más allá de compartir el catálogo) → T3 (confirma T1 contra los 206
  datos reales, no solo los de ejemplo).
- **Dependencies:** T1 y T2 son independientes entre sí; T3 depende de T1.
- **Risks:**
  - Que `normalize('NFD')` más strip de diacríticos no cubra algún
    carácter especial real del catálogo (p. ej. "ñ", que NFD no
    descompone igual que una tilde) → mitigación: T3 corre contra las 206
    entradas reales, no una muestra, así que cualquier caso así aparece
    antes de cerrar la historia.
