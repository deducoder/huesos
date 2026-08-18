---
name: red-from-a-missing-module-proves-nothing
description: El rojo de un import inexistente no evalúa ninguna aserción; un stub identidad convierte ese rojo en información.
metadata:
  type: feedback
---

Escribir el test antes que el módulo da un rojo que dice «no tests»: ninguna
aserción llegó a ejecutarse. En e9.5 (2026-08-18) ese rojo no distinguía un
gate bien escrito de uno inútil. Con un stub que devolvía su argumento, el
resultado fue **5 de 6 en rojo y el de unicidad en verde** — la prueba
empírica de que el gate necesitaba una tercera afirmación («la derivación se
aplicó»), porque techo y unicidad se cumplen solos con la derivación apagada.

**Why:** el RED tiene que decir algo sobre el comportamiento. Un módulo
ausente solo dice que falta un archivo.

**How to apply:** en TDD sobre un módulo nuevo, crear primero el stub más
tonto que compile —identidad, constante, lista vacía— y mirar **qué** falla y
qué no. Lo que pasa en verde con el stub es lo que el test no está probando.
Relacionado: [[a-check-needs-a-check-that-it-looked]],
[[something-changed-is-not-an-assertion]].
