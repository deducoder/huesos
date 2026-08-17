---
name: backlog-rows-age-like-plans
description: Una fila del backlog es una hipótesis escrita antes del trabajo y envejece igual que un plan — hay que releerla contra el código antes de arrancar la épica, no solo para elegirla.
metadata:
  type: process
---

El backlog describía E6 como "completar las 206 entradas región por región
hasta la condición de lanzamiento". Medirlo tardó cinco minutos: el catálogo
tenía **206 entradas desde E1**, con el reparto por región correcto y 200 de
206 con sinónimos. El trabajo que la fila describía estaba terminado hacía
cuatro épicas, y la fila sobrevivió intacta a E2, E3, E4 y E5.

Arrancar E6 leyendo su fila habría producido tres historias completando un
catálogo completo. Lo que quedaba de verdad era otra cosa —una decisión de
gobernanza: `RF-08` exigía geometría para siete huesos que el proyecto ya había
decidido no cubrir, así que la condición de lanzamiento era imposible por
construcción— y solo apareció mirando el código.

**Por qué importa:** el backlog se lee para **elegir** la siguiente épica, no
para comprobar si sigue siendo verdad. Esa asimetría hace que una fila
desactualizada no tenga a nadie que la contradiga: cada vez que se lee, se lee
para decidir el orden, no el contenido. Ver
[[epic-design-is-a-hypothesis]] — mismo principio un nivel más abajo.

**How to apply:** antes de `epic-start`, medir contra el código lo que la fila
del backlog afirma que falta. Si ya está hecho, decirlo y **preguntar qué es la
épica** en vez de inventarle contenido: la respuesta cambia el trabajo entero, y
no la puede tomar quien la descubre. Y al cerrar una épica, comprobar si dejó
alguna fila del backlog desactualizada.
