---
name: verify-extreme-sizes-not-just-typical-ones
description: Un componente que encuadra automáticamente algo de tamaño variable (cámara dinámica, layout responsivo) necesita verificarse contra el extremo más chico y el más grande del rango real, no solo un caso "típico" cómodo de elegir.
metadata:
  type: pitfall
---

`IsolatedBoneScene` (e3.1) se verificó con fémur, sacro, esternón — huesos
grandes o medianos, ejemplos "cómodos" de elegir para una captura de
pantalla. Nadie lo probó con una falange hasta e4.4, tres historias
después. El plano cercano (`near`) por defecto de three.js recortaba la
cámara para cualquier hueso por debajo de cierto tamaño: el lienzo quedaba
en blanco, sin ningún error en consola, para el ~15% de huesos más
pequeños del catálogo.

**Por qué importa:** un caso de ejemplo elegido por conveniencia ("un hueso
grande se ve bien en una captura") no representa el rango real de lo que
el componente tiene que manejar. El bug existió desde la primera historia
que construyó el componente, invisible durante tres historias porque
ninguna verificación tocó el extremo del rango.

**How to apply:** al verificar a mano un componente que opera sobre un
rango de valores (tamaño, cantidad, longitud), incluir explícitamente el
extremo más pequeño y el más grande conocido — no solo un valor de en
medio. Para un catálogo o dataset real, eso significa consultarlo
("¿cuál es el elemento más chico?") en vez de adivinar un ejemplo.

Relacionado: [[manual-verification-keeps-finding-real-things]].
