---
name: a-mid-epic-e2e-checkpoint-earns-its-cost-even-at-zero-findings
description: "correr check-integration completo a mitad de épica, tras las historias de mayor riesgo de regresión cruzada, confirma la ausencia de defectos en vez de asumirla"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 28d8bc13-d3f7-4426-8731-0c5c99d0c8bd
  modified: 2026-08-18T21:08:51.934Z
---

Un checkpoint de `./scripts/check-integration` completo (build real, no
servidor reutilizado) a mitad de una épica —después de las historias que
introducen mecanismos nuevos y antes de la que vuelve sobre el archivo
que todas comparten— vale su costo incluso cuando no encuentra nada. Un
resultado limpio ahí es evidencia de que la costura entre historias no
tiene defectos, no una suposición sin verificar.

**Why:** en E9 (huesos-mono), el `plan.md` de la épica programó
explícitamente este checkpoint entre e9.4 y e9.7, con la razón declarada
por escrito: e9.6 y e9.3 producen comportamiento que ninguna prueba
unitaria observa (History API, aspect ratio del lienzo), y e9.5 cruza
cuatro componentes que ninguna historia toca a la vez. Dio 32 de 32 sin
hallazgos nuevos. Ese negativo tiene valor real: confirmó que seis
historias mergeadas juntas por primera vez no rompían nada entre sí,
en vez de descubrirlo (o no) recién en `epic-review`, con mucho más
contexto ya perdido si algo hubiera fallado.

**How to apply:** al planificar una épica de varias historias que tocan
mecanismos nuevos o un archivo compartido, nombrar explícitamente en
`plan.md` un punto medio donde correr el checkpoint E2E completo —no
esperar al cierre—, y no tratar un resultado en verde como "no hacía
falta correrlo": es la evidencia de que no hacía falta, que es distinto.
Ver [[a-hand-started-server-poisons-the-suite]] para el motivo por el que
el build tiene que ser real y no un servidor reutilizado.
