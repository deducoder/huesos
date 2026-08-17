---
name: state-ownership-follows-survival-not-cleanliness
description: Un componente deja de poder ser dueño de su propio estado en cuanto otra vista necesita que ese estado sobreviva a su desmontaje — la señal es un caso de aceptación concreto, no una preferencia de diseño.
metadata:
  type: capability
---

En e3.2, `ExploreView` era dueña de su propio `useState` de selección desde
e2 — limpio, autocontenido. Al agregar `BoneDetailView` como una vista
hermana que reemplaza a `ExploreView` en el DOM (sin router, ADR-003), el
criterio de aceptación "Volver conserva la selección anterior" reventó esa
propiedad: si `ExploreView` se desmonta al cambiar de modo, su estado local
se pierde con ella.

**Por qué importa:** el plan de la historia no anticipó este cambio —
asumió implícitamente que `ExploreView` seguía dueña de su estado. Se
descubrió recién al escribir el test de integración de extremo a extremo
(clic en "Ver ficha completa" → "Volver" → selección intacta), no al
diseñar. Escribir ese test *antes* de decidir dónde vive el estado forzó la
decisión correcta.

**How to apply:** cuando una historia agrega una vista hermana que puede
desmontar a otra (con o sin router), preguntar explícitamente para cada
estado local existente: "¿qué pasa con esto si el componente que lo posee
se desmonta?". Si la respuesta importa para algún criterio de aceptación,
el estado sube al padre común **antes** de escribir la implementación, no
después de que el test de integración lo revele. El patrón resultante —
vista controlada (props `selected`/`onSelect`) + un arnés con `useState` en
el propio test que reproduce lo que el padre real hace — mantiene la
cobertura de interacción existente sin que el test conozca al padre real.
