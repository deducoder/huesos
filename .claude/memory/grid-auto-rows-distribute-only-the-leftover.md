---
name: grid-auto-rows-distribute-only-the-leftover
description: Un grid con altura y filas automáticas reparte solo el sobrante — una fila con contenido enorme lo absorbe todo y las demás caen a su tamaño intrínseco, que en un `<canvas>` son 150 px.
metadata:
  type: process
---

En e7.2, la vista Explorar dibujaba su lienzo 3D a `390×150` en un teléfono y la
ficha completa —mismo patrón de código, mismo `grid h-full grid-cols-1`, mismo
`<canvas>` con `h-full w-full`— lo dibujaba a `390×521`. La diferencia no estaba
en el lienzo:

- La **ficha** tiene dos zonas y la segunda es corta. Sobra espacio, y
  `align-content: stretch` —el valor inicial— lo reparte. El lienzo se lo queda.
- **Explorar** tiene tres, y una es la lista de 206 huesos. Esa fila reclama más
  alto del disponible: **no sobra nada que repartir**, y el lienzo cae a los
  150 px intrínsecos de un `<canvas>` sin dimensionar.

El arreglo fue `grid-rows-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]`. El
`minmax(0,…)` es lo que importa: sin el mínimo en 0, una fila no baja del tamaño
de su contenido y el reparto no ocurre.

**Por qué importa:** el diagnóstico obvio —«el lienzo no tiene altura»— es falso
y lleva a tocar el componente de la escena, que era correcto. El defecto no es
del elemento que se ve mal, es **de la fila vecina que se come el reparto**. Y
como el mismo código funciona en una vista y falla en otra, invita a buscar la
diferencia donde no está.

**How to apply:** ante un hijo de grid que aparece con su tamaño intrínseco,
mirar primero **el contenido de sus hermanas**, no sus propias clases. Y al
rediseñar un layout que ya se arregló así, recordar que quitar el `minmax(0,…)`
sin quitar también el contenido largo devuelve el defecto entero.
