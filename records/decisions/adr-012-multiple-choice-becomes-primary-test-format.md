---
type: adr
id: ADR-012
title: "La opción múltiple pasa a ser el formato primario del test; el formato escrito queda oculto, no eliminado"
status: accepted
date: 2026-08-17
epic: e8
---

# ADR-012: La opción múltiple pasa a ser el formato primario del test; el formato escrito queda oculto, no eliminado

## Status

Accepted

## Context

El mockup importado (`refs/huesos-mono-ui.html`) muestra el modo test con
un selector "Escribir / Opciones" y, bajo "Opciones", una grilla de 3
botones de respuesta múltiple. `TestQuestion` (e4.1) hoy solo acepta
respuesta escrita, validada de forma tolerante por `isCorrectAnswer`
(`RF-06`).

El usuario decidió, al arrancar esta épica: la opción múltiple (3
alternativas) es el formato que se usa — no un formato alternativo tras un
toggle — y el formato escrito **no se borra**, se oculta. Esto simplifica
el alcance frente al mockup (no hace falta el toggle Escribir/Opciones) y
cambia lo que e8.4 construye: no una alternativa más, sino un reemplazo del
formato por defecto que conserva el código anterior alcanzable solo desde
las pruebas, no desde la interfaz.

**Tensión real con `must-data-003`:** el guardrail dice, literal, "Ningún
nombre de hueso llega al DOM en modo test antes de que el usuario
responda" (`RF-04`, `RF-05`), y su test (`TestQuestion.test.tsx`, "ningún
nombre del catálogo aparece en el DOM antes de responder") lo verifica
sobre el flujo escrito, donde `renderScene` solo recibe el `id` — nunca el
`Bone` — precisamente para que ningún nombre escape antes de responder.

La opción múltiple **no puede cumplir esa misma redacción por
construcción**: mostrar 3 botones con nombres de hueso, uno de ellos el
correcto, es el mecanismo mismo de la pregunta. El nombre correcto está en
el DOM antes de responder, sí — pero indistinguible entre 3 candidatos
plausibles, que es la garantía real que un test de opción múltiple puede
dar (nunca revela *cuál* es la correcta, sí revela *cuáles compiten*).

Options:

- **(A) Reinterpretar `must-data-003` para que cubra ambos formatos** —
  reescribir su enunciado a algo como "nunca se marca cuál opción es la
  correcta antes de responder" perdería lo que el guardrail actual
  protege *hoy* para el formato escrito (que ni siquiera aparezca en el
  DOM), y mezclaría dos garantías distintas bajo un mismo id.
- **(B) Eliminar `must-data-003`** — no: el flujo escrito sigue en el
  código (decisión de este mismo ADR) y su test sigue corriendo; el
  guardrail sigue siendo verdad sobre lo que gobierna.
- **(C) `must-data-003` sigue exactamente como está, acotado al formato
  escrito (hoy oculto); un guardrail nuevo gobierna la garantía real de la
  opción múltiple.**

## Decision

**Opción (C):**

1. `TestQuestion` gana un formato de opción múltiple: 3 botones (el hueso
   correcto + 2 distractores) construidos por una función de dominio nueva
   (e8.3, `pickDistractors` o equivalente) que elige distractores
   **plausibles** — mismo criterio que el mockup insinúa con "Fémur / Tibia
   / Peroné": mismo `region` que el hueso preguntado, sorteo inyectable
   igual que `pickTestableBone` (determinismo en tests).
2. La opción múltiple es el formato que `TestQuestion` usa por defecto —
   sin toggle en la interfaz. El código del formato escrito (el `<form>`
   con `<input>`, `isCorrectAnswer`, su rama de estado) **permanece en el
   componente**, cubierto por su test existente, simplemente sin ningún
   botón que lo active. No es dead code en el sentido de "nunca se
   ejecuta": su test lo ejecuta en cada corrida de `./scripts/check`.
3. `must-data-003` **no se edita**. Sigue describiendo, con exactitud, el
   flujo escrito que sigue existiendo.
4. Guardrail nuevo — `must-data-010` en `governance/guardrails.md` — para
   la opción múltiple: *"En modo opción múltiple, ninguna opción queda
   marcada como correcta en el DOM antes de responder, y las opciones
   incorrectas son siempre del mismo `region` que la correcta"* — deriva de
   `RF-04`, `RF-05` y de la nueva función de distractores.
5. Si en una épica futura el toggle Escribir/Opciones del mockup se
   construye, retoma este mismo camino oculto — no hay que revivir código
   borrado.

## Consequences

**Positive:**
- Cero pérdida de cobertura: el test que protege el flujo escrito sigue
  verde, sin tocarse.
- La distinción entre "qué garantiza `must-data-003`" y "qué garantiza el
  guardrail de opción múltiple" queda escrita, no inferida — evita que una
  futura lectura de `must-data-003` asuma (incorrectamente) que también
  cubre el nuevo formato.
- Revivir el formato escrito en una épica futura es reactivar un botón, no
  reescribir código.

**Negative / costs:**
- `TestQuestion` (o quien lo reemplace) carga dos ramas de UI donde solo
  una es alcanzable — más superficie que mantener sincronizada con
  `isCorrectAnswer` si ese dominio cambia, aunque nadie la vea.
- `governance/prd.md` (`RF-06`, "Respuesta escrita con validación
  tolerante") sigue describiendo el comportamiento por defecto actual de
  la aplicación de forma inexacta una vez que e8.4 cierre — el PRD no se
  edita en este ADR (no es su artefacto), pero queda como hallazgo para
  `epic-review`/`epic-close` de esta épica: RF-06 necesita una nota que
  diga que sigue construido pero ya no es el formato por defecto.

## Alternatives considered

- **(A) Reinterpretar `must-data-003`:** rechazada por mezclar dos
  garantías distintas bajo un mismo id y perder precisión sobre el formato
  escrito.
- **(B) Eliminar `must-data-003`:** rechazada — el código que gobierna
  sigue existiendo por decisión explícita del usuario.
