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

## T3 · Verificación manual — huesos reales de punta a punta

Corrida contra el catálogo real (script `vitest` no commiteado,
`src/domain/_manual-check.test.ts`, borrado al cerrar la tarea): un hueso
de cada una de las 8 regiones con huesos preguntables, más `ear`/`hyoid`
para confirmar que nunca son preguntables (0 preguntables cada una,
confirmado).

**Encontró un defecto real, no cosmético:** `es` no lleva el lado
(`clavicle-right`/`clavicle-left` comparten `es: 'clavícula'`;
`rib-12-right`/`rib-12-left` comparten `'duodécima costilla'`). La primera
corrida mostró pares de opciones con el **mismo texto** — p. ej. pregunta
"clavícula" con distractores "escápula" y "clavícula" — que en una opción
múltiple es un test roto: acertar o fallar dependería de en cuál de los
dos botones idénticos se hace clic, no de saber anatomía.

Corregido en dos capas, ambas con su propio RED → GREEN (ver **T2b** en
`plan.md`, agregada fuera del plan original):
1. El hermano del hueso *preguntado* nunca es distractor.
2. Dos distractores nunca son hermanos *entre sí* — el primer intento de
   la corrección (1) sola no alcanzaba: en `shoulder-girdle` (solo 4
   preguntables) los dos únicos candidatos que quedaban tras excluir la
   clavícula y su hermano eran `scapula-right`/`scapula-left`, hermanos
   entre sí — la segunda corrida manual los mostró como "escápula" /
   "escápula" y expuso que la corrección (1) no bastaba.

Tres corridas más del script manual, post-corrección, sobre las 8 regiones
cada vez: ningún par de opciones repite `es`, todos los nombres son huesos
reales y legibles. Script borrado (`_manual-check.test.ts` no se commitea,
era una verificación puntual — el checkpoint que queda commiteado es la
suite de tests, no el script ad hoc).

Gate: `./scripts/check` verde (246 tests, lint/format/types limpios).

## Finalize

- Full gate set: verde (`./scripts/check`, 246 tests, 34 archivos).
- Orphaned-test check: `src/domain/distractors.ts` es net-new — ningún test
  preexistente lo importaba antes de esta historia, nada que revisar.
  `src/domain/side-pairing.ts` (`siblingId`) gana un consumidor nuevo, pero
  su propio test (`side-pairing.test.ts`) no cambió de comportamiento —
  sigue verde sin tocarse.
- Acceptance criteria: cumplidas de punta a punta, incluida la que el
  diseño no anticipó (exclusión de hermanos) — el hallazgo de T3 se cerró
  dentro de esta misma historia, no se aparcó.
