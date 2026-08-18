# Story e8.3: Plausible distractors — Scope

## User story

Como estudiante que responde el test por opción múltiple (e8.4),
quiero que las dos opciones incorrectas se parezcan al hueso preguntado,
para que reconocerlo requiera saber anatomía y no solo descartar lo obviamente distinto.

## Acceptance criteria

```gherkin
Given un hueso preguntado cuya región tiene 3 o más huesos preguntables (con malla)
When se piden sus distractores
Then el resultado son 2 huesos distintos entre sí, distintos del preguntado,
  ambos de la misma región, y ambos preguntables (meshName no nulo)

Given un hueso preguntado cuya región tiene menos de 3 huesos preguntables en total
  (hoy: solo "pelvic-girdle", 2 huesos preguntables — el coxal derecho e izquierdo)
When se piden sus distractores
Then el hueco se completa con huesos preguntables de cualquier otra región,
  nunca repetidos, nunca el hueso preguntado

Given el mismo hueso preguntado y el mismo `sorteo` inyectado
When se piden sus distractores dos veces
Then el resultado es idéntico ambas veces (determinismo, mismo patrón que `pickTestableBone`)
```

## Example

| Input (hueso preguntado) | Región | Acción | Distractores esperados |
|---|---|---|---|
| fémur derecho | `lower-limb` (60 preguntables) | `pickDistractors` | 2 huesos de `lower-limb`, p. ej. tibia derecha y peroné derecho — nunca fémur izquierdo repetido dos veces ni el fémur mismo |
| hueso coxal derecho | `pelvic-girdle` (2 preguntables en total: coxal derecho e izquierdo) | `pickDistractors` | hueso coxal izquierdo (el único compañero de región) + 1 hueso preguntable de cualquier otra región, elegido por el mismo `sorteo` |

## In scope

- `pickDistractors(bone, catalog, opciones?)` en `src/domain/`: función pura,
  sin JSX, sin `Math.random` directo — sorteo inyectable (`sorteo?: () =>
  number`), mismo patrón que `pickTestableBone` (`src/domain/quiz.ts`).
- Solo huesos con `meshName !== null` son candidatos a distractor —
  un hueso sin geometría nunca puede ser la respuesta correcta de una
  pregunta (`pickTestableBone` ya lo excluye), así que tampoco tiene
  sentido ofrecerlo como opción incorrecta.
- El caso límite de región con menos de 3 huesos preguntables (hoy:
  `pelvic-girdle`) resuelto y testeado — no es un caso abierto para e8.4.
- Tests unitarios con casos correctos, límite y determinismo, siguiendo el
  criterio de `must-test-001` (aunque ese guardrail deriva de `RF-06`, no
  de esta historia — el hábito de probar límite y determinismo aplica
  igual).

## Out of scope

- Cualquier componente de React o botón — eso es e8.4, que consume esta
  función.
- El guardrail nuevo (`must-data-010`, ADR-012) y su entrada en
  `governance/guardrails.md` — los agrega e8.4, que es quien construye lo
  que ese guardrail protege.
- Ampliar el criterio de plausibilidad más allá de "misma región, con
  relleno desde todo el catálogo preguntable si hace falta" — por ejemplo,
  agrupar por categoría (nivel que e8.2 introduce para Fichas) en vez de
  región. Se descartó en el diseño de esta historia: la categoría es un
  concepto de presentación de Fichas (ADR-011), no un criterio de
  plausibilidad anatómica ya validado — mezclar los dos conceptos es una
  decisión que esta historia no necesita tomar.

## Done when

- `pickDistractors` existe, exportada desde `src/domain/`, con tests que
  cubren el caso típico (`lower-limb`), el caso límite
  (`pelvic-girdle`) y el determinismo con `sorteo` inyectado.
- `./scripts/check` en verde.
- Ningún componente de UI la usa todavía (eso llega con e8.4) — el "done"
  de esta historia es la función en sí, no su integración.

## Notes

Diseño y contratos completos en
`work/epics/e8-redesign-mockup-follow-ups/design.md` (sección "Target
components" y "Key contracts"). El caso límite de `pelvic-girdle` es un
riesgo nombrado explícitamente en `scope.md` de la épica — esta historia
es donde se cierra, no donde se descubre.
