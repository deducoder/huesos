---
name: bone-es-name-omits-side
description: "El campo `es` del catálogo de huesos (huesos-mono) no incluye el lado — cualquier vista o función que muestre `es` a solas para un hueso par puede mostrar el mismo texto que su opuesto; el lado se agrega aparte (ver `accessibleName` en BoneNavigator)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 90c83924-1bba-49eb-a990-063ca3a7789f
  modified: 2026-08-18T01:35:37.050Z
---

`clavicle-right` y `clavicle-left` comparten `es: 'clavícula'`;
`rib-12-right`/`rib-12-left` comparten `'duodécima costilla'` — y así para
los 172 huesos pares del catálogo de huesos-mono. El lado vive en un campo
separado (`side`) y se agrega solo donde alguien lo pidió explícitamente
(`accessibleName` en `src/components/BoneNavigator.tsx`).

**Por qué importa:** cualquier código nuevo que tome `bone.es` como texto
único para mostrar u ofrecer como opción —sin pasar por un helper que
agregue el lado— puede terminar mostrando el mismo texto dos veces para
dos huesos distintos. Pasó en `pickDistractors` (e8.3): dos distractores
sin relación con el hueso preguntado, pero hermanos entre sí, mostraban la
misma etiqueta.

**How to apply:** antes de renderizar o comparar `bone.es` a solas en una
vista o función nueva, preguntar si dos huesos pares pueden aparecer juntos
en esa superficie (dos opciones de un mismo selector, dos filas de una
misma lista). Si sí, o se agrega el lado al texto, o se excluye
explícitamente al hermano anatómico (`siblingId`,
`src/domain/side-pairing.ts`) del conjunto que se muestra junto. Relacionado:
[[pick-fixtures-that-stress-the-rule]] (cómo se encontró) y
[[pairing-doesnt-imply-distinguishing]] (cuándo sí vale la pena mostrar el
lado).
