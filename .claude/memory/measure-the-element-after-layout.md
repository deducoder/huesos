---
name: measure-the-element-after-layout
description: Un `<canvas>` mide 300x150 —su tamaño intrínseco— hasta que alguien lo dimensiona; medirlo "cuando la página ya se ve" da el tamaño equivocado, y la carrera la pierde la máquina rápida.
metadata:
  type: pitfall
---

En s1, `esperarEscena` medía la caja del `<canvas>` en cuanto aparecía el
botón `fémur derecho`. Ese botón se pinta del catálogo en 0,1 s; el lienzo lo
dimensiona react-three-fiber a los 0,14 s. En esa ventana el `<canvas>` mide
`300x150` —el tamaño intrínseco que HTML le da a un canvas sin atributos—, así
que el "centro del lienzo" salía en (470,128), una esquina vacía fuera del
esqueleto. Como la caja no se volvía a medir, la suite pulsaba ese punto muerto
durante los 60 s del poll y se rendía. El centro real era (684,477).

**Por qué importa:** la señal que se eligió para "la página está lista" —un
botón visible— no tenía nada que ver con lo que se iba a medir. Y el error es
**invisible en una máquina lenta**: donde el renderizado tarda, el lienzo
alcanza a dimensionarse antes de la medición y la prueba pasa por accidente.
Dos sesiones de gate rojo se atribuyeron al entorno por eso. Ver
[[intermittent-is-a-hypothesis]].

**How to apply:** al medir un elemento para calcular coordenadas, esperar por
una propiedad **del elemento que se va a medir**, no por otra cosa de la
página. Para un `<canvas>`, esperar a que supere `300x150`. Y sospechar de
cualquier prueba que empieza a fallar justo al cambiar de máquina: si el
hardware nuevo la rompe, casi nunca es el hardware.
