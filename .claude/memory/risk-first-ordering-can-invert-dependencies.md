---
name: risk-first-ordering-can-invert-dependencies
description: Ordenar tareas por riesgo puede poner primero un caso de borde que no puede existir sin la operación que lo tiene — y entonces la primera tarea arrastra a la segunda y el plan miente sobre dónde está el trabajo.
metadata:
  type: process
---

En e5.2 el plan puso primero la degradación a memoria (`localStorage` que
lanza) por ser el riesgo de mayor impacto, y segunda la lectura/escritura
normal. Pero **no se puede probar que algo degrada al guardar sin que guardar
exista**: T1 arrastró la serialización JSON entera, y T2 se quedó sin RED —
sus cuatro tests pasaron sin escribir una línea.

Los tests seguían valiendo y se quedaron, pero commiteados como `test(...)` y
no `feat(...)`, porque eso es lo que eran.

**Por qué importa:** el orden por riesgo es el buen default y no está en
discusión. Lo que falla es aplicarlo entre una operación y su propio caso de
borde, que no son independientes aunque se enuncien como dos tareas. El
síntoma es una tarea posterior que no tiene RED: si al escribir los tests de
una tarea pasan todos a la primera, el corte estaba mal, no los tests.

**How to apply:** antes de ordenar por riesgo, separar las tareas en
independientes y dependientes. El riesgo ordena a las primeras; entre una
operación y su caso de borde, manda la dependencia — o se funden en una sola
tarea que entrega las dos. Y tratar "esta tarea no tuvo RED" como una señal de
que el plan se equivocó, no como un trámite superado.
