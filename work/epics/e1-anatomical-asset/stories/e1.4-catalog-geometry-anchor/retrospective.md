# Story e1.4: Catalog-geometry anchor — Retrospective

Estimated: S (2 tareas) · Actual: S, 1 commit — T2 resultó ser el mismo gesto
que el RED

## Summary

`tests/catalog-geometry.test.ts` cruza cada entrada del catálogo con las mallas
reales del `.glb`. Un nombre mal escrito pone el gate en rojo nombrando la
entrada culpable, y las ausencias declaradas se saltan sin exigirles geometría.
Con esto el walking skeleton está cerrado: dato, tipo y geometría verificados de
extremo a extremo.

## What went well

- **La apuesta de ADR-001 quedó probada, no supuesta.** El nombre de malla
  funciona como clave de anclaje: se comprobó rompiéndolo a propósito y viendo
  el gate reaccionar con el id dentro del mensaje.
- **La prueba no puede pasar por vacuidad.** Además de exigir que ninguna
  entrada apunte a una malla inexistente, afirma que hay al menos una anclada.
  Sin eso, un catálogo vacío pasaría en verde y no probaría nada — el mismo
  fallo de nivel que e1.1 dejó escrito en memoria.
- **`readGlb` de e1.1 se reutilizó tal cual.** La capacidad ganada en la
  historia anterior se cobró en esta sin escribir una línea de parseo.

## What to improve

- **El plan separó T1 y T2 sin que fueran distintas.** Cuando el criterio de
  aceptación de un test dice «falla nombrando al culpable», ponerlo en rojo *es*
  la prueba de integración: no hay dos actos, hay uno. Conviene detectarlo al
  planificar en vez de descubrirlo al ejecutar.

## Learned

1. **About the system:** el anclaje por nombre de malla aguanta, y el riesgo
   principal del epic queda cerrado con cuatro entradas en vez de con 199. La
   secuenciación por riesgo del plan se pagó sola.
2. **About the process:** una prueba con mensaje de fallo diseñado —el id de la
   entrada, no un booleano— convierte el gate en un diagnóstico. Cuesta una
   línea al escribirla y ahorra la búsqueda entera cuando falla con 199 entradas
   dentro.
3. **Capability gained:** poblar el catálogo es ahora seguro: cualquier errata
   en un nombre de malla se detiene en el gate, así que e1.5 y e1.6 pueden ser
   volumen mecánico sin miedo.
