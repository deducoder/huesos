# Story e4.1: Dominio del modo test — Progress

## T1 · `domain/answer-check.ts`: normalización y validación tolerante

`normalizeAnswer` (minúsculas, sin tildes vía NFD, recorte y colapso de
espacios, artículo inicial fuera) e `isCorrectAnswer` (compara contra
`es`/`la`/`synonyms`, todos normalizados igual; cadena vacía siempre
incorrecta). 13 tests, incluido el caso real del catálogo con mayúscula
(`C1` del atlas, `id: 'cervical-1'`). Gate: verde tras un
`biome format --write` (línea larga, mismo patrón de e3.3). Ninguna otra
desviación del plan.

## T2 · `domain/quiz.ts`: elegir un hueso preguntable

`pickTestableBone(bones, excluirId?)` — filtra por `meshName !== null`,
excluye el id dado si se pasó, con reserva (si excluir dejara la lista
vacía, cae de nuevo a todos los preguntables — caso que no ocurre con el
catálogo real, 199 preguntables, pero deja la función sin un caso borde sin
cubrir). 2 tests corridos 500 veces cada uno contra el catálogo real, no
una muestra. Gate: verde tras el mismo ajuste de formato. Ninguna otra
desviación.

## T3 · Verificación manual contra el catálogo completo

Script ad-hoc (`vite-node`, borrado después de correrlo) que corrió
`isCorrectAnswer` sobre las 206 entradas reales, sus 206 `es`, 206 `la` y
todos los `synonyms` — 0 fallos. Confirma que los 13 tests de T1, acotados
a un puñado de huesos de ejemplo, no dejaron pasar un carácter especial sin
cubrir en el resto del catálogo.

## Finalize

- Full gate set: verde (`./scripts/check`, 122 tests, lint, format, types).
- Orphaned-test check: `answer-check.ts` y `quiz.ts` son módulos nuevos,
  sin consumidores previos que pudieran quedar huérfanos.
- Acceptance criteria: cumplidos de punta a punta — los cinco escenarios
  Gherkin del scope, verificados por test (T1, T2) y por la corrida
  completa contra los 206 datos reales (T3).
