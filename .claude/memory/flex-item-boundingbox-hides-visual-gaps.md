---
name: flex-item-boundingbox-hides-visual-gaps
description: Medir con Playwright el boundingBox de un <span> con flex-1 y texto alineado a la izquierda puede dar un falso verde sobre un vacío visual real.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 341330ec-28f7-4560-b20e-7f103b32b38a
  modified: 2026-08-18T00:41:37.372Z
---

Un `<span>` de texto dentro de un contenedor flex con `flex-1` crece su caja
hasta llenar el espacio disponible, pero el texto queda alineado a la
izquierda de esa caja ya crecida. Medir el `boundingBox()` del propio span
para calcular la distancia hasta el siguiente elemento da un resultado
engañosamente pequeño (el borde derecho de la caja, no el borde derecho del
texto visible) — un vacío real de más de 1000px puede medir 8px si se mide
así.

**Por qué:** ocurrió en huesos-mono, historia e7.9, verificando que el
nombre de un hueso par y sus píldoras de lado no quedaran separadas por un
vacío grande a 1400×900. El primer test midió el `<span className="flex-1">`
del nombre y dio un falso verde.

**Cómo aplicar:** cuando se mide geometría real (Playwright, no jsdom) para
verificar que algo NO se estira o NO deja un vacío, medir el contenedor
padre real que sufre el estiramiento (la fila, la `<li>`, el ancestro con el
`flex-1` real) en vez del elemento hijo con texto. Si el hijo tiene
`flex-1`/`flex-grow` y contenido alineado a un extremo, su propia caja no
es una señal confiable del vacío visual.
