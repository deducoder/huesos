# Story e8.4: Multiple choice as primary test format — Scope

## User story

Como estudiante que responde el test en el celular,
quiero elegir entre 3 opciones en vez de escribir el nombre,
para responder más rápido y sin fricción de tipeo.

## Acceptance criteria

```gherkin
Given una pregunta de test recién montada
When se renderiza sin ningún formato explícito
Then se muestran 3 botones (el hueso correcto y 2 distractores de
  pickDistractors), ninguno marcado como correcto, y no hay ningún campo
  de texto ni botón para cambiar de formato

Given los 3 botones de opción múltiple visibles
When se elige uno y se confirma con "Responder"
Then se muestra "Correcto" o "Incorrecto" igual que hoy con el formato
  escrito, y se registra el veredicto en el store de progreso igual que
  hoy

Given el formato escrito (invocado explícitamente, no desde la interfaz)
When se responde como hoy
Then el comportamiento no cambia — mismo `isCorrectAnswer`, mismos tests
  existentes de `TestQuestion.test.tsx`, todos en verde sin reescribirse
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Pregunta: fémur derecho | Render sin `answerFormat` | 3 botones: "fémur", "tibia", "peroné" (u otro par de distractores de `pickDistractors`), ninguno marcado |
| Los 3 botones de arriba | Clic en "fémur" → clic en "Responder" | "Correcto" en pantalla, veredicto `{correct: 1, incorrect: 0}` para `femur-right` |
| Los 3 botones de arriba | Clic en "tibia" → clic en "Responder" | "Incorrecto" en pantalla, `bone.es`/`bone.la` mostrados, veredicto `{correct: 0, incorrect: 1}` |

## In scope

- `TestQuestion` muestra opción múltiple (3 botones) como formato por
  defecto, usando `pickDistractors` (e8.3) para las 2 opciones incorrectas.
- El formato escrito (texto libre, `isCorrectAnswer`) sigue existiendo en
  el componente, alcanzable solo explícitamente (no desde ningún botón de
  la interfaz) — cubierto por los tests que ya existen en
  `TestQuestion.test.tsx`, que deben seguir pasando.
- `governance/guardrails.md` gana `must-data-010` (ver ADR-012): en modo
  opción múltiple, ninguna opción marcada como correcta antes de
  responder, y las opciones incorrectas siempre de la misma región que la
  correcta — con su propio test de verificación.
- `SkeletonTestView`/`BoneTestView` (los dos montajes reales de
  `TestQuestion`) no cambian su forma de invocarlo salvo lo estrictamente
  necesario para que el formato por defecto sea opción múltiple.

## Out of scope

- El toggle Escribir/Opciones del mockup — **no ahora**: decisión ya
  tomada en ADR-012, no se ofrece desde la interfaz.
- Cualquier cambio a `isCorrectAnswer`, `normalizeAnswer` o al criterio de
  tolerancia del formato escrito — sigue exactamente igual, solo deja de
  ser alcanzable desde un botón.
- Cualquier cambio a `pickTestableBone` o a la ponderación por fallos
  (`RF-09`, ADR-005) — la opción múltiple decide *cómo* se responde, no
  *qué* se pregunta.
- El parámetro `count` de `pickDistractors` con un valor distinto de 2 —
  fuera de esta historia salvo que el propio diseño lo necesite; si se
  usa, cierra también el hallazgo aparcado de `architecture-review` en
  e8.3.

## Done when

- Con la aplicación corriendo, entrar al modo test (esqueleto o hueso
  aislado) muestra 3 botones, ninguno de texto libre, y responder
  registra el veredicto igual que antes.
- `TestQuestion.test.tsx` (incluido el test de `must-data-003`) sigue en
  verde.
- El guardrail `must-data-010` existe en `governance/guardrails.md` con su
  test.
- `./scripts/check` en verde.

## Notes

Diseño completo (contratos, interfaz, ADR-012) en
`work/epics/e8-redesign-mockup-follow-ups/design.md`. La tensión real con
`must-data-003` —que la opción múltiple no puede cumplir literalmente
porque el nombre correcto está entre las 3 opciones visibles— ya está
resuelta ahí: ese guardrail no se edita, gobierna el formato escrito que
sigue existiendo; `must-data-010` es la garantía nueva para este formato.
