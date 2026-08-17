---
name: reused-components-arent-risk-free
description: Un componente construido en una épica anterior y reutilizado "sin tocar" en una nueva no es sinónimo de "sin riesgo" — el nuevo caso de uso puede someterlo a un rango (tamaño, contexto) que ninguna verificación previa cubrió.
metadata:
  type: pitfall
---

`IsolatedBoneScene` se construyó en e3.1 y se verificó con fémur, sacro,
esternón. e3.2 lo reutilizó sin encontrar nada. e4.4 (una épica después) lo
reutilizó para el modo test y encontró dos defectos reales el mismo día:
una fuga de nombre por `aria-label` y huesos diminutos invisibles por
recorte de cámara — ninguno relacionado con el cambio que e4.4 hacía, los
dos preexistentes desde e3.1.

**Por qué importa:** "reutilizar sin modificar" se lee como bajo riesgo
porque no hay código nuevo que revise. Pero el *contexto* de uso sí es
nuevo, y un componente solo se prueba tan bien como los casos que sus
consumidores anteriores necesitaron — no como el rango completo de lo que
podría recibir.

**How to apply:** al reutilizar un componente de una épica anterior sin
modificarlo, la verificación manual de la nueva historia igual debe
ejercitarlo con datos que sus consumidores previos no probaron —
especialmente si el nuevo contexto tiene requisitos que los anteriores no
tenían (acá: no revelar el nombre, algo que e3.2 nunca necesitó porque ahí
revelarlo era el punto).

Relacionado: [[verify-extreme-sizes-not-just-typical-ones]],
[[manual-verification-keeps-finding-real-things]].
