---
name: pick-fixtures-that-stress-the-rule
description: "Al elegir el ejemplo para un test de una función de dominio, elegir el que más estresa la regla (el caso pequeño/restringido), no el más cómodo de escribir — o el bug solo aparece en la verificación manual, tres tareas después de donde debería haberse visto."
metadata: 
  node_type: memory
  type: pitfall
  originSessionId: 90c83924-1bba-49eb-a990-063ca3a7789f
  modified: 2026-08-18T01:35:18.829Z
---

`pickDistractors` (e8.3, huesos-mono): los tests de T1/T2 usaron
`femur-right` (región `lower-limb`, 60 huesos) e `hip-bone-right` (el caso
límite de *conteo* ya identificado, `pelvic-girdle`). Ninguno de los dos
tocaba el problema real: dos huesos con el mismo nombre en español porque
el catálogo no distingue lado en `es` (`clavicle-right`/`clavicle-left` →
ambos "clavícula"). El bug —dos distractores con la misma etiqueta— no
apareció hasta la verificación manual (T3), corriendo la función contra
una región chica y pareada (`shoulder-girdle`, 4 huesos = 2 pares).

**Por qué importa:** las mismas 200 iteraciones que ya corrían por test
habrían atrapado el bug si el fixture elegido hubiera sido una región
chica y pareada desde el principio — no hacía falta esperar a T3 para
descubrirlo, solo elegir mejor el ejemplo. El caso "cómodo" (una región
grande, con mucho margen) sistemáticamente no ejercita las restricciones
que solo aparecen cuando el pool de candidatos es chico.

**How to apply:** al escribir el primer test de una función que opera
sobre un subconjunto de un catálogo/dataset real, preguntar "¿cuál es el
caso que menos margen le da a la regla?" (la región/categoría más chica,
el grupo con más elementos indistinguibles entre sí, el conteo más bajo)
y usar **ese** como fixture principal, no el más grande o más fácil de
razonar a mano. Relacionado: [[verify-extreme-sizes-not-just-typical-ones]]
(mismo patrón, aplicado ahí a rangos de tamaño de UI en vez de a la
elección de fixtures de dominio) y
[[manual-verification-keeps-finding-real-things]].
