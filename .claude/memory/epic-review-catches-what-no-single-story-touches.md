---
name: epic-review-catches-what-no-single-story-touches
description: "Un hallazgo puede sobrevivir intacto a través de todas las historias de un epic porque ninguna tocó a la vez las dos partes que lo delatan — solo epic-review, releyendo el scope contra el código real (no contra \"todas las historias cerradas\"), lo atrapa."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 341330ec-28f7-4560-b20e-7f103b32b38a
  modified: 2026-08-18T01:01:16.752Z
---

En el epic E7 (huesos-mono, mobile-first redesign), un color de resaltado 3D
(`#38bdf8`, hardcodeado desde antes del epic) quedó fuera del sistema de
tokens (`--color-acento`, introducido en la primera historia del epic)
durante las nueve historias siguientes, sin que ninguna lo detectara.

**Por qué:** ninguna historia individual tocó a la vez `SkeletonScene.tsx`
(la escena 3D) y el sistema de tokens (`index.css`/ADR-007) — cada una
revisó su propio diff, y el diff de cada una por separado no mostraba nada
raro. Solo al releer el criterio "ningún componente escribe un color a
mano" **contra el código real**, con una búsqueda de hex literales (no solo
de nombres de clase Tailwind), apareció.

**Cómo aplicar:** al hacer epic-review (o cualquier revisión agregada al
cierre de un conjunto de trabajo), no basta con confirmar que cada
historia cerró verde — hay que releer cada criterio del scope contra el
estado real del código, con búsquedas que cubran más de un lenguaje o
capa si el criterio lo permite (acá, "color a mano" tenía una instancia en
Tailwind y otra en `three.js`, y solo la segunda búsqueda la encontró). El
paso "finish it or explicitly re-scope" de `epic-review` es la salida
correcta cuando el hallazgo es chico: se resuelve ahí mismo con TDD normal,
sin abrir una historia nueva para dos líneas de cambio.
