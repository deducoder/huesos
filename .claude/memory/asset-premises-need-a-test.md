---
name: asset-premises-need-a-test
description: Una afirmación sobre lo que contiene un activo, escrita en prosa dentro de un ADR o un comentario, no la ejecuta nadie — y el activo suele declarar la verdad por sí mismo si se mira su estructura antes de inferirla.
metadata:
  type: pitfall
---

ADR-001 anotó como consecuencia aceptada que el modelo «trae solo el
hemicuerpo derecho más las piezas impares». Era falso en 36 de sus 144 mallas:
las piezas de línea media están centradas **sobre** el eje del espejo —
espejarlas las copia sobre sí mismas — y los parietales son un par que el
activo ya trae completo. La escena espejaba el modelo entero durante dos épicas
sin que nada fallara.

Dos cosas lo hicieron posible. La premisa vivía en prosa, donde ningún test la
ejecuta. Y nadie miró la estructura del activo: sus tres raíces se llaman
`Bones`, `Bones_right` y `Cartilages_right`, y el grupo `Bones` coincide
**exactamente** con las 36 mallas que no admiten espejo. El dato correcto
estuvo ahí desde E1; el código no lo leía.

**Por qué importa:** una afirmación sobre datos es verificable por definición.
Dejarla como prosa la convierte en una suposición que envejece en silencio y
que el siguiente lector hereda como hecho. Es la misma forma de b2.1
—suposición sobre los nombres del activo, no verificada contra el activo—, y
que la lección de aquel bug se archivara como algo «sobre nombres» es por lo
que volvió a pasar.

**How to apply:** cuando una decisión o un comentario afirme algo sobre el
contenido de un activo o dato externo ("trae solo X", "siempre tiene Y", "son N
elementos"), escribir el test que lo compara contra el archivo real, en el
mismo cambio. Y antes de inferir una regla midiendo, revisar si el activo ya la
declara —nombres de grupos, jerarquía, metadatos—: la declaración del autor no
necesita tolerancias ni umbrales, y una regla inferida sí. Relacionado:
[[model-mesh-names-are-irregular]], [[self-consistent-checks-hide-systematic-bugs]].
