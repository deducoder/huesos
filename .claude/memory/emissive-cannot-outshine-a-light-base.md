---
name: emissive-cannot-outshine-a-light-base
description: emissive suma luz sobre el albedo; sobre un material claro ni el tope teórico (blanco al máximo) iguala lo que teñir el color consigue.
metadata:
  type: project
---

Resaltar un objeto 3D sobre un material claro con `emissive` tiene un techo
bajo: la emisión **suma** luz al albedo existente, así que sobre un beige ya
claro (`rgb(168,161,154)`) el resultado nunca se aleja mucho del original. En
e9.1 (2026-08-18) se midió el tope teórico —blanco puro al máximo de
intensidad— y dio una suma de canales de 152; teñir el `color` del material
con el mismo azul que ya se usaba dio **282**, casi el doble, y sin tocar el
token de color.

**Why:** la intuición «si no resalta, prueba otro color» lleva a explorar la
paleta cuando el problema real es la propiedad del material que recibe el
color. Medir el tope teórico de un mecanismo antes de aceptarlo como techo es
lo que lo revela.

**How to apply:** ante un resaltado que "no se nota" sobre un material claro,
probar primero teñir `color` en vez de sumar `emissive`, y verificar con el
tope teórico (blanco al máximo) si el mecanismo tiene margen para mejorar.
Relacionado: [[prototype-numbers-need-reproducing-in-the-real-component]].
