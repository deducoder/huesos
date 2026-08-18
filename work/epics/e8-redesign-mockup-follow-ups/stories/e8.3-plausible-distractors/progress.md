# Story e8.3: Plausible distractors — Progress

## T1 · `pickDistractors` — caso típico

`src/domain/distractors.ts` creado con `pickDistractors`/`DistractorOptions`;
4 tests en `distractors.test.ts` (2 huesos de la misma región, nunca el
propio hueso, nunca repetido, siempre con malla). Mutación forzada
(quitar la exclusión de `bone.id` del pool) confirmó que el test de "nunca
incluye el hueso preguntado" lo detecta — no es un test decorativo.

Gate: `./scripts/check` verde (239 tests, lint/format/types limpios).
Ninguna desviación del plan.

## T2 · Caso límite, catálogo insuficiente y determinismo

**Desviación real del plan, dicha en voz alta:** el GREEN de T1 ya había
escrito la implementación completa (relleno desde el resto del catálogo,
guard de catálogo insuficiente, sorteo inyectable) en vez de la mínima para
el caso típico — no fue "mínimo para pasar el test", fue la función entera
de una sola vez. Consecuencia: los 5 tests nuevos de T2 pasaron en verde
**sin un RED real** — no fueron los que dirigieron esa parte del código,
solo la confirmaron después de escrita.

En vez de fingir un RED que no hubo, verifiqué cada propiedad con mutación
forzada (mismo criterio que T1):
- Quitar el relleno desde `resto` → los dos tests del caso `pelvic-girdle`
  fallan.
- Quitar el guard explícito de catálogo insuficiente → **primer intento no
  lo detectó** (el `throw` interno de `extraerAlAzar` seguía lanzando, con
  mensaje genérico) — el test original (`toThrow()` sin argumento) era
  decorativo respecto a esa línea. Lo endurecí para exigir el mensaje que
  nombra el hueso (`toThrow(/femur-right/)`); con eso, la mutación sí lo
  rompe.
- Ignorar el `sorteo` inyectado (usar `Math.random` siempre) → el test de
  determinismo falla.

Gate: `./scripts/check` verde (244 tests, lint/format/types limpios).
