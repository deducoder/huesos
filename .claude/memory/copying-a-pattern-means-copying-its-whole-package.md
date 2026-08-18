---
name: copying-a-pattern-means-copying-its-whole-package
description: Reutilizar un componente de referencia por su mecanismo principal puede dejar fuera las piezas que resuelven casos límite documentados en ese mismo componente.
metadata:
  type: feedback
---

En e9.4 (2026-08-18), la cámara dinámica de `SkeletonScene.tsx` copió el
mecanismo de `<PerspectiveCamera>` controlado de `IsolatedBoneScene.tsx`,
pero no copió `near={0.001}` — el ajuste del plano cercano, documentado en
ese mismo archivo con el motivo exacto: el plano por defecto de three.js
(0.1) recorta huesos diminutos (hallazgo original de e4.4). Sin él, un hueso
del tarso encuadrado midió `distance: 0.0588` — detrás del plano, invisible.
Apareció recién en la verificación manual del teléfono.

**Why:** al leer un componente de referencia se tiende a extraer el
mecanismo que motivó la lectura (acá, la cámara reactiva) y a pasar por alto
las líneas vecinas que resuelven problemas menos vistosos pero igual de
reales — sobre todo si el nuevo contexto comparte el mismo rango de
tamaños de objeto.

**How to apply:** al reutilizar un componente como referencia, listar
explícitamente **todo** lo que resuelve —no solo el mecanismo buscado— y
verificar cada pieza contra el nuevo contexto antes de darla por
innecesaria. Relacionado: [[reused-components-arent-risk-free]].
