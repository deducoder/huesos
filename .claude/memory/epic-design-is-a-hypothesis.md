---
name: epic-design-is-a-hypothesis
description: El diseño de una épica (`design.md`) es una hipótesis sobre qué componentes hacen falta, no una receta — el gemba de cada historia individual sigue siendo la autoridad, incluso sobre el propio diseño que la contiene.
metadata:
  type: process
---

`epic-design` de e3 propuso `BoneListEntry` como componente nuevo para el
punto de entrada sin escena (e3.3). Al llegar `story-start` de e3.3 y leer
`BoneNavigator.tsx` de verdad —no de memoria—, resultó que ya servía tal
cual (`selected={null}`, `onSelect` navega en vez de alternar). La épica
terminó con un componente nuevo menos de los que su propio diseño
anticipaba.

**Por qué importa:** un diseño de épica se escribe con el gemba walk que
hubo tiempo de hacer en ese momento, sobre código que puede no haberse leído
línea por línea todavía. Tratarlo como receta fija en vez de hipótesis
revisable arriesga construir algo redundante solo porque "el diseño lo
dijo".

**How to apply:** al planificar (`story-plan`) o implementar una historia
cuyo diseño de épica propone un componente nuevo, releer el componente
existente más cercano antes de crearlo — la pregunta no es "¿el diseño dice
que hace falta uno nuevo?" sino "¿el código real todavía no cubre esto?".
Si el gemba de la historia contradice el diseño de la épica, el hallazgo se
anota en el `scope.md` de la historia (no se reedita `design.md`, que no
cambia de opinión a mitad de la épica) y se sigue con la versión más simple.

Relacionado: [[untestable-layers-go-last]], [[state-ownership-follows-survival-not-cleanliness]].
