---
name: offset-the-projection-not-the-camera
description: "Para descentrar un objeto 3D en pantalla sin romper la órbita, usar camera.setViewOffset — mover la cámara desplaza también el punto de giro."
metadata: 
  node_type: memory
  type: reference
  originSessionId: eca5a72a-259b-4a26-b397-29b6dd9a1e97
  modified: 2026-08-18T06:32:13.257Z
---

Cuando hay que dibujar un objeto 3D fuera del centro del lienzo —porque algo
flota encima y lo taparía— se descentra la **proyección** con
`camera.setViewOffset(W, H, 0, offsetY, W, H)`, no la cámara.

**Why:** en e9.3 bajé la cámara y su `target` juntos para subir el hueso por
encima de la tarjeta. El objeto quedaba donde quería, pero el centro de
órbita de `OrbitControls` quedaba por debajo del hueso: girar en horizontal
apenas se notaba —el eje pasa cerca— y girar en **vertical** lo expulsaba
del encuadre describiendo un arco grande. Con `setViewOffset` la subventana
del frustum se corre (un lens shift), la cámara sigue apuntando al centro
real del objeto y la órbita es correcta en los dos ejes.

**How to apply:** el precedente es `CamaraEncuadrada` en
`src/components/IsolatedBoneScene.tsx`, y `frameObject`
(`src/domain/framing.ts`) devuelve el desplazamiento como **fracción del
alto del lienzo** —media reserva— precisamente porque describe una
proyección y no una posición. Aviso adicional: memoizar el array `position`
que se pasa a `<PerspectiveCamera>`; con una referencia nueva por render,
react-three-fiber lo reaplica y deshace lo que los controles acaban de
mover.
