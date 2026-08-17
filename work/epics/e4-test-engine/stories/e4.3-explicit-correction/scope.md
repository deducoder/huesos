# Story e4.3: Corrección explícita del error — Scope

## User story

As an estudiante que responde mal una pregunta del modo test,
I want que el sistema me diga el nombre correcto en ambas nomenclaturas y
mantenga el hueso resaltado en su posición,
so that pueda corregir el error ahí mismo, sin tener que ir a buscarlo en
otra vista (`RF-07`).

## Acceptance criteria

```gherkin
Given una respuesta incorrecta enviada
When se observa el resultado
Then aparece el nombre correcto en español y en latín, sin ninguna acción
  adicional del usuario

Given una respuesta incorrecta enviada
When se observa la escena
Then el hueso preguntado sigue resaltado en su posición — no desaparece ni
  cambia al mostrar la corrección

Given una respuesta correcta enviada
When se observa el resultado
Then dice "Correcto", sin mostrar el nombre en ambas nomenclaturas — eso ya
  lo sabía quien respondió bien
```

## Example

| Input | Hueso preguntado | Resultado |
|-------|-------------------|-----------|
| "tibia" | fémur | "Incorrecto" + "fémur / os femoris" + fémur sigue resaltado |
| "FEMUR" | fémur | "Correcto" (sin nomenclaturas — ya se sabía) |

## In scope

- Extiende `TestQuestion` (e4.2): cuando `resultado === 'incorrecto'`,
  muestra `bone.es` y `bone.la` junto al texto "Incorrecto".
- No toca la escena: el hueso preguntado ya queda resaltado en su posición
  porque `renderScene(bone.id)` no cambia hasta "Siguiente pregunta" — es
  comportamiento heredado de e4.2, no una construcción nueva.

## Out of scope

- Mostrar sinónimos o región en la corrección — `RF-07` solo pide "el
  nombre correcto en ambas nomenclaturas", no toda la ficha (`RF-03`).
- El modo test sobre hueso aislado — es e4.4, pero reutiliza esta
  corrección sin cambios porque vive en `TestQuestion`, compartido.

## Done when

- Toda respuesta incorrecta muestra `es` y `la` del hueso preguntado, sin
  acción adicional.
- Toda respuesta correcta sigue mostrando solo "Correcto", sin nomenclatura
  de más.
- El hueso preguntado permanece resaltado en la escena tras responder mal —
  verificado explícitamente, no asumido por herencia de e4.2.

## Notes

Diseño completo en `work/epics/e4-test-engine/design.md`. Ahora que el
nombre del hueso **sí** aparece en el DOM tras una respuesta incorrecta,
`must-data-003` (ningún nombre **antes** de responder) sigue intacto: el
test de e4.2 verificaba el estado previo a responder, no el posterior — la
distinción temporal ya estaba en el propio guardrail
("antes de que el usuario responda").
