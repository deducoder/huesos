# Story e9.6: The system back button walks the app — Retrospective

Estimated: M, 4 tareas · Actual: M, 6 commits de código y prueba — las 4
planeadas más dos que aparecieron al verificar la cobertura contra los
criterios.

## Summary

El «atrás» del sistema recorre la aplicación en vez de abandonarla. El
historial transporta el `Modo` en el `state` de cada entrada, `popstate` lo
restituye validado por un predicado, y los dos botones que ya significaban
«atrás» retroceden en vez de empujar. Sin router y sin URLs, como ADR-013
decidió. El campo `origen` del modo `ficha` quedó barrido: el historial ya
sabe de dónde se vino.

## What went well

- **El walking skeleton hizo su trabajo.** Poner primero la historia con el
  mecanismo desconocido —y no la más grande— sirvió: se descubrió en la
  primera tarea que la verificación real de esta épica es Playwright más
  dispositivo, no vitest. Eso ya está aprendido para las seis restantes.
- **Las mutaciones forzadas encontraron un RED falso a tiempo.** El primer
  test de T2 fallaba por un selector inexistente (`/^frontal$/i`), no por
  el comportamiento. Un rojo con el andamiaje roto no prueba nada, y se
  detectó porque el plan exigía nombrar *qué* mutación debía matar la
  prueba, no solo que estuviera roja.
- **El `./scripts/check` rojo en `format:check` se arregló, no se
  bypaseó.** Biome colapsó a una línea el `&&` de `BoneTestView` al
  acortarse el callback. Treinta segundos, y la disciplina intacta.
- **La suite de integración no exigió tocar nada vivo.** El dev server y su
  túnel siguieron en pie toda la historia.

## What to improve

- **Dos criterios llegaron al final sin prueba, y ninguno de los dos era
  oscuro.** El primer escenario del `scope.md` —«desde Fichas · atrás ·
  Fichas»— apareció en la finalización de `story-implement`; el MUST NOT
  del diseño —«no se secuestra la primera entrada»— apareció en
  `quality-review`. Los dos se cerraron, pero el patrón es que las tareas
  del plan se escribieron por *mecanismo* (empujar, retroceder, probar en
  navegador) y no por *criterio*, así que la cobertura salió de lo que cada
  tarea necesitaba demostrar, no de la lista de lo prometido.
- **La precondición de T3 sobraba.** El plan reservaba trabajo para matar
  servidores huérfanos antes de la suite de integración; Playwright usa
  4173 y estaba libre, mientras los huérfanos escuchan en 4180. Se
  heredó el aviso del parking lot sin comprobar los puertos reales — la
  precaución era correcta, la premisa concreta no se midió.
- **La memoria se coló en un commit de otra cosa.** `5e15eb5`, que corregía
  una referencia de línea, arrastró también el archivo de memoria nuevo.
  No rompe nada, pero mezcla dos propósitos en un commit que decía uno.

## Learned

1. **About the system:** el andamiaje que un test necesita para aislar
   estado global a veces es código de producción que faltaba. jsdom
   comparte `window.history` entre casos del mismo archivo, y la salida no
   fue un `beforeEach` que limpiara la pila sino que `App` siembre su
   entrada de arranque con `replaceState` — que además arregla un caso
   real: sin ello, retroceder hasta la primera entrada llega al `popstate`
   con `state: null` y cae al respaldo en vez de restituir Explorar
   explícitamente.
2. **About the process:** las tareas cortadas por mecanismo dejan huecos
   que las cortadas por criterio no dejarían. Los dos que faltaron eran
   ambos "de salida": el retorno al segundo origen posible, y el
   comportamiento que **no** debe cambiar. Enumerar los escenarios del
   scope contra los tests antes de declarar hecha una tarea es más barato
   que descubrirlo en la revisión.
3. **Capability gained:** un `Record<Union, true>` valida un discriminante
   con exhaustividad que una lista de cadenas no da — añadir una variante
   al tipo sin registrarla es error de compilación. Es la salida a la clase
   de problema que el parking lot tiene abierta desde e5 con
   `esProgresoDeHueso`, y ahora hay precedente en el repositorio de cómo
   resolverla cuando esa entrada se retome.
