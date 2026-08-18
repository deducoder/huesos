---
name: text-color-doesnt-follow-its-container
description: Mover un componente sobre una superficie de otro tema lo deja ilegible sin que ningún test lo vea.
metadata:
  type: feedback
---

Un texto en `text-tinta` (casi negro, del tema claro) dibujado sobre
`--color-lienzo` (#20242b, oscuro) es prácticamente invisible. Vivió así desde
e7.2 y solo apareció al capturar la ficha de un hueso sin geometría en e8.5.

**Why:** el contenedor cambia de superficie pero las clases de color del
contenido siguen escritas contra el tema original. Ni los tipos, ni el lint,
ni el gate de tokens miran contraste; los tests unitarios comprueban que el
texto está en el DOM, que es exactamente lo que seguía siendo cierto.

**How to apply:** cada vez que un componente se mueva sobre otra superficie —o
que una superficie cambie de color bajo un componente— capturar ese caso
concreto en un navegador. Y al planear la verificación visual, listar los casos
por adelantado: el que faltaba acá era el estado excepcional (hueso sin malla),
no el camino feliz. Relacionado con
[[manual-verification-keeps-finding-real-things]] y
[[pick-fixtures-that-stress-the-rule]].
