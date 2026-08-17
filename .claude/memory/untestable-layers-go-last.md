---
name: untestable-layers-go-last
description: Cuando una capa no es verificable automáticamente, lo que importa no es cómo probarla sino qué poner antes que ella.
metadata:
  type: feedback
---

En e2 la escena 3D no era verificable: WebGL no existe en jsdom, y en este
entorno no hay navegador para mirarla. La decisión que salvó el epic no fue
encontrar la forma de probarla, sino **ordenar las historias para que llegara la
última sobre algo que ya funcionaba**: la lista accesible y el panel de identidad
convirtieron la aplicación en usable antes de que existiera una línea de WebGL.

**Why:** cuando lo intestable va primero, cada tropiezo suyo es un tropiezo del
producto entero. Cuando va encima de algo probado, es enriquecimiento: si
fallara, lo anterior sigue en pie. En e2 la escena rompió las pruebas dos veces
—`ResizeObserver` ausente, canvas que no renderiza— y ninguna puso el epic en
riesgo.

**How to apply:** al planificar un epic con una capa no verificable (canvas,
render nativo, integración externa), preguntarse qué subconjunto entrega valor
**sin** ella y ponerlo en el walking skeleton. Y bajar cuanta decisión se pueda
desde la capa opaca a dominio puro: en e2, «qué hueso se ha pulsado» salió del
canvas y pasó a ser una función pura con seis aserciones.

Corolario aprendido a base de repetirlo: si tres historias seguidas cierran con
«compila y se sirve» en vez de «se ve», el epic **necesitaba un modo de
verificación que no tenía**, y eso hay que decidirlo al planificar, no descubrirlo
tres veces.

Relacionado: [[commit-discipline-inverts-with-volume]].
