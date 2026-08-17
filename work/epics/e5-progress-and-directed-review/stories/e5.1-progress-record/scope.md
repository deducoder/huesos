# Story e5.1: Progress record — Scope

## User story

As a estudiante de medicina que usa el modo test,
I want que la aplicación lleve la cuenta de en qué huesos acierto y en cuáles
fallo,
so that más adelante pueda insistirme con los que fallo en vez de repartir las
preguntas al azar.

Esta historia entrega **solo el dato y sus reglas**, en dominio puro. Que ese
dato sobreviva a una recarga es `e5.2`; que el motor de test lo alimente es
`e5.3`; que dirija las preguntas es `e5.4`.

## Acceptance criteria

```gherkin
Given un registro vacío                          # el estudiante nunca respondió
When se consulta cualquier hueso
Then devuelve cero aciertos y cero fallos, nunca `undefined`

Given un registro vacío                          # happy path
When se registra un acierto para "femur-right"
Then "femur-right" queda con 1 acierto y 0 fallos

Given un registro donde "scaphoid-left" tiene 2 fallos
When se registra un acierto para "scaphoid-left"
Then queda con 1 acierto y 2 fallos — un acierto no borra el historial de fallos

Given un registro cualquiera                     # pureza
When se registra un resultado
Then el registro recibido no se modifica: la función devuelve uno nuevo

Given un registro con datos                      # serializable
When se pasa por `JSON.stringify` y `JSON.parse`
Then el resultado es equivalente al original
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| registro vacío | consultar `"vomer"` | `{ aciertos: 0, fallos: 0 }` |
| registro vacío | registrar fallo en `"frontal"` | `{ frontal: { aciertos: 0, fallos: 1 } }` |
| `{ frontal: { aciertos: 0, fallos: 1 } }` | registrar fallo en `"frontal"` | `{ frontal: { aciertos: 0, fallos: 2 } }` |
| `{ frontal: { aciertos: 0, fallos: 2 } }` | registrar acierto en `"frontal"` | `{ frontal: { aciertos: 1, fallos: 2 } }` |
| `{ frontal: { aciertos: 1, fallos: 2 } }` | registrar acierto en `"sacrum"` | `{ frontal: {...}, sacrum: { aciertos: 1, fallos: 0 } }` — el resto intacto |

## In scope

- `src/domain/progress.ts`: el tipo del registro, el registro vacío, la lectura
  del estado de un hueso y la función pura que anota un veredicto.
- Sus pruebas unitarias, incluida la de ida y vuelta por JSON — porque `e5.2` va
  a serializarlo y el contrato de `design.md` exige que sobreviva sin pérdida.

## Out of scope

- **Persistir el registro** — es `e5.2`, y es donde entra `localStorage`
  (ADR-004). Este módulo no conoce el almacenamiento, por contrato del diseño.
- **Llamar a estas funciones desde el motor de test** — es `e5.3`.
- **Ponderar la selección con el registro** — es `e5.4`.
- **Cualquier campo temporal** (cuándo se acertó, decaimiento) — declarado fuera
  en el `scope.md` de la épica; entraría con la historia que lo use, no antes.
- **Distinguir la variante de test** (esqueleto completo vs hueso aislado) —
  fuera por la misma razón: plausible, sin requisito que la respalde.
- **Borrar o reiniciar el progreso** — aparcado en `records/parking-lot.md`.

## Done when

- Consultar un hueso que nunca se respondió devuelve el estado inicial, no
  `undefined` ni una excepción.
- Anotar un veredicto deja el registro anterior sin tocar y devuelve uno nuevo
  con ese único hueso cambiado.
- Un acierto no borra los fallos acumulados de ese hueso, ni al revés.
- El registro sobrevive a una ida y vuelta por JSON sin pérdida.
- `./scripts/check` en verde.

## Notes

- Contratos que vienen del diseño de la épica
  (`work/epics/e5-progress-and-directed-review/design.md`): el dominio no
  conoce el almacenamiento; el dato es plano y serializable; un `id` ausente
  significa "nunca preguntado", no cero explícito.
- El `id` es el slug estable en inglés de `Bone.id` — el mismo que ya usan
  `selection.ts` y `quiz.ts`.
- Riesgo de secuencia registrado en `plan.md`: esta es la primera historia y la
  forma del dato de la que cuelga todo, que es exactamente la posición desde la
  que se inventan campos que nadie pidió. Si aparece uno, tiene que venir con la
  historia que lo usa.
