# Story e8.1: Merged navbar — Retrospective

Estimated: S (2-3 tareas) · Actual: S (2 tareas, sin agregados)

## Summary

`<header>` y `Pestanas` fundidos en una sola fila (`items-stretch`, título
`text-lg` en vez de `text-titulo`). Sin menú (sin destino, cortado en
`scope.md`) y sin `position: absolute`/flotante (el mockup lo aplicaba a
las tres vistas, no solo a Explorar — cambio mayor al que esta historia
declaró "contenido"). Medido en un navegador real a 390px: sin desborde,
44px de mínimo táctil, alineación correcta. `--text-titulo` barrido.
268 tests en el gate rápido, 21/21 en la suite de integración completa.

## What went well

- **Los dos recortes de alcance (menú, flotante) se decidieron en
  `story-start`, con su razón escrita, no se descubrieron a mitad de
  implementación.** Evitó construir una interfaz sin función (el botón
  de menú) y evitó una redistribución mucho más grande de lo que "el
  cambio más contenido de las cuatro" (plan.md de la épica) prometía.
- **El riesgo de `items-center` vs `items-stretch` se identificó en
  `story-design`, se implementó ya resuelto, y la medición real solo
  tuvo que confirmarlo** — no hizo falta un ciclo de prueba-error como en
  historias anteriores de esta épica. Pensar el problema de CSS box model
  por adelantado, en vez de implementar y descubrir, funcionó esta vez.

## What to improve

- **El hallazgo real de la historia no estaba en ningún plan: `jsdom`
  deja pasar `getByRole('banner')` para un `<header>` que un navegador
  real no expone como landmark.** Dos tests de T1 pasaron en verde
  midiendo algo que no correspondía a la realidad, y solo se supo al
  correr Playwright en T2. Es la tercera vez en esta épica que aparece
  esta clase de discrepancia jsdom/navegador real (antes: `sr-only`;
  ahora: un landmark de accesibilidad) — sugiere que cualquier query por
  `role` que dependa de la posición estructural del elemento (no de un
  atributo `aria-*` explícito) merece la misma sospecha por defecto.

## Learned

1. **Sobre el sistema:** un `<header>` anidado dentro de `<main>` no es
   `banner` según la spec — la excepción no es un detalle exótico, es la
   regla para exactamente esta estructura, y el proyecto la tiene desde
   e7.1 sin que nadie la hubiera puesto a prueba con un navegador real
   hasta ahora.
2. **Sobre el proceso:** `jsdom` calcula roles ARIA con una fidelidad
   menor a la que un test "en verde" sugiere — cualquier `getByRole` que
   dependa de reglas de posición estructural (no de un atributo
   explícito como `aria-label`) necesita, en algún punto de la historia,
   una confirmación con un navegador real antes de confiar en él. No hay
   que esperar a que falle en producción para descubrirlo.
3. **Capability gained:** el patrón `items-stretch` en el contenedor +
   `items-center` en el hijo que necesita mantenerse centrado (acá:
   `<h1>`) es la forma correcta de que un elemento mida el alto completo
   de una fila flex (para que un test de layout mida su borde real)
   mientras otro se ve centrado — reutilizable la próxima vez que un
   test necesite medir el borde de un elemento que comparte fila con
   otro de altura distinta.
