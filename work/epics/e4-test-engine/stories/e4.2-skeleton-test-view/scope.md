# Story e4.2: Modo test sobre el esqueleto completo — Scope

## User story

As an estudiante que ya reconoce los huesos explorando,
I want que el sistema me señale un hueso en el esqueleto completo, sin
decirme cuál es, y me pida su nombre,
so that pueda comprobar si lo recuerdo de memoria, no solo si lo reconozco
viéndolo (`RF-04`).

## Acceptance criteria

```gherkin
Given el modo test sobre el esqueleto recién montado
When se inspecciona el DOM antes de responder
Then ningún nombre de hueso (español, latín, ni sinónimo) está presente

Given una pregunta activa
When se observa la escena
Then hay exactamente un hueso resaltado

Given una pregunta activa
When se escribe una respuesta y se envía
Then se indica con texto explícito si fue correcta o incorrecta — nunca
  solo con color (`must-a11y-005`)

Given una respuesta ya enviada
When se activa "Siguiente pregunta"
Then se señala otro hueso, nunca el mismo que la pregunta anterior
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| pregunta sobre "fémur" | escribir "FEMUR", enviar | "Correcto" en texto |
| pregunta sobre "fémur" | escribir "tibia", enviar | "Incorrecto" en texto |
| tras responder | clic "Siguiente pregunta" | otro hueso resaltado, nunca el fémur otra vez seguido |

## In scope

- `features/test/TestQuestion.tsx`: el flujo pregunta → respuesta → texto
  de acierto/error → "Siguiente pregunta". Recibe qué escena mostrar como
  children/render prop, para que e4.4 lo reutilice con `IsolatedBoneScene`
  en vez de reimplementar el flujo.
- `features/test/SkeletonTestView.tsx`: `TestQuestion` + `SkeletonScene`
  (sin `BoneNavigator` ni `BoneIdentity` — ninguna vía con nombre visible).
- Corrección **mínima** en esta historia: texto "Correcto"/"Incorrecto".
  La corrección completa de `RF-07` (nombre en ambas nomenclaturas, hueso
  resaltado) es e4.3, sobre este mismo flujo.

## Out of scope

- La corrección completa de `RF-07` — es e4.3.
- El modo test sobre hueso aislado (`RF-05`) — es e4.4.
- Punto de entrada desde `App.tsx` — es e4.5.
- Registrar el resultado de cada pregunta — es `RF-09`/E5.

## Done when

- Una prueba de render confirma que ningún nombre de hueso (ni `es`, ni
  `la`, ni ningún `synonym` del catálogo completo) aparece en el DOM antes
  de responder — la primera pieza real de `must-data-003`, que
  `governance/guardrails.md` declara pero el proyecto nunca implementó.
- Responder correcta o incorrectamente muestra el resultado en texto, no
  solo color.
- "Siguiente pregunta" nunca repite el hueso inmediatamente anterior.

## Notes

Diseño completo en `work/epics/e4-test-engine/design.md`. **Tensión de
accesibilidad reconocida, no resuelta acá:** durante la pregunta, un
usuario de lector de pantalla no tiene forma de saber *qué* hueso está
señalado en el canvas —revelarlo rompería `RF-04` por definición—, y
`must-a11y-005` no aplica a esta fase (deriva de `RF-01`/`RF-07`, no de
`RF-04`/`RF-05`, según la propia tabla de `governance/guardrails.md`). Se
aparca como hallazgo, no se inventa una solución fuera de alcance.
