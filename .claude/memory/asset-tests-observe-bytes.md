---
name: asset-tests-observe-bytes
description: Cuando lo que se prueba es un archivo y no código, el criterio de aceptación debe declarar a qué nivel se observa, o el test medirá el más cómodo.
metadata:
  type: project
---

En e1.1 el criterio decía «el archivo no contiene ninguna textura». El test que
salió de ahí comprobaba que no hubiera entradas `images` en el JSON del GLB —
el nivel más cómodo de observar. Pasaba en verde, y sin embargo **los bytes de
las texturas podían seguir dentro del chunk binario**: borrar la referencia no
borra el dato. Lo destapó el `quality-review`, no el ciclo TDD, porque TDD
escribe el test contra el criterio tal como está redactado.

**Why:** un criterio de aceptación ambiguo sobre el nivel de observación no
produce un test ambiguo — produce un test que mide lo barato y da falsa
seguridad. Aquí el fallo silencioso habría sido legal, no funcional: distribuir
material CC BY-NC-SA dentro de un producto que no puede honrar esa cláusula.

**How to apply:** al escribir el criterio de una historia cuyo entregable es un
archivo o un activo binario, decir explícitamente si se observa la
**estructura** (índices, referencias, metadatos) o los **bytes**. Y verificar el
resultado con un lector distinto del que lo produjo: el mismo parser que escribe
un archivo no prueba nada al leerlo.

Relacionado: [[skeleton-model-missing-bones]].
