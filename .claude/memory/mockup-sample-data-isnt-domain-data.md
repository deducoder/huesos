---
name: mockup-sample-data-isnt-domain-data
description: Los campos de un mockup pueden ser ejemplos escritos a mano para cuatro casos, no estructura que el dominio tenga.
metadata:
  type: feedback
---

Un mockup muestra campos que parecen del modelo y son contenido inventado para
sus pocos casos de demostración. En e8.5, «Articula con» y «Dato clínico»
existían para 4 huesos del mockup y para ninguno de los 206 del catálogo: el
tipo `Bone` no los tenía.

**Why:** copiar la estructura visual es barato; copiar el contenido significa
escribirlo para el resto del dominio, y ahí es donde se cuela la invención —
anatomía, precios, textos legales — presentada como dato real.

**How to apply:** antes de implementar una pantalla de mockup, buscar cada
campo en el tipo de dominio. Si falta, es una decisión de contenido del
usuario, no una tarea de vista: preguntarla. La salida honesta suele ser un
campo opcional que se rellena donde alguien lo verificó y cuya fila no se
renderiza donde no existe. Relacionado con
[[a-check-needs-a-check-that-it-looked]] y
[[manual-verification-keeps-finding-real-things]].
