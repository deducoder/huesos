# Story e8.3: Plausible distractors — Progress

## T1 · `pickDistractors` — caso típico

`src/domain/distractors.ts` creado con `pickDistractors`/`DistractorOptions`;
4 tests en `distractors.test.ts` (2 huesos de la misma región, nunca el
propio hueso, nunca repetido, siempre con malla). Mutación forzada
(quitar la exclusión de `bone.id` del pool) confirmó que el test de "nunca
incluye el hueso preguntado" lo detecta — no es un test decorativo.

Gate: `./scripts/check` verde (239 tests, lint/format/types limpios).
Ninguna desviación del plan.
