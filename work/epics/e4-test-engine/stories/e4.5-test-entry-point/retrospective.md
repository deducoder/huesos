# Story e4.5: Acceso al modo test y guardrail de fuga — Retrospective

Estimated: S (2-3 tareas) · Actual: 3 tareas, sin desviación de tamaño

## Summary

Cuarto modo en `App.tsx`: la pestaña "Test" ofrece elegir entre `RF-04`
(esqueleto completo) y `RF-05` (hueso aislado) antes de empezar a
preguntar. `must-data-003` ya vivía en el gate desde e4.2/e4.4 — esta
historia lo confirmó, no lo escribió. Última historia de la épica; con
ella, `RF-04` a `RF-07` quedan completos y alcanzables desde el arranque.

## What went well

- El scope de la épica había previsto `must-data-003` como trabajo
  pendiente de esta historia ("nunca implementada hasta ahora"). El gemba
  de e4.2 y e4.4 ya lo había resuelto sin saberlo — T2 fue confirmar, no
  construir. Un ejemplo más de que el diseño de una épica es una
  hipótesis, no una lista fija de tareas (memoria: `epic-design-is-a-
  hypothesis`).
- La refactorización de `Pestanas` de tres botones repetidos a una lista
  (`PESTANIAS.map(...)`) salió natural al agregar el cuarto modo — la
  duplicación se volvió visible recién con el tercer caso, momento
  correcto para generalizarla (ni antes, por especulación, ni después).

## What to improve

- Ninguna desviación real que registrar — la historia más lineal de las
  cinco de e4, después de dos historias (e4.3, e4.4) con hallazgos reales.

## Learned

1. **About the system:** con cuatro modos y tres orígenes de "volver"
   posibles, `App.tsx` sigue siendo una única unión discriminada legible —
   la señal de que el patrón (estado elevado, sin router, con `origen`
   donde hace falta) escala al menos hasta este tamaño sin necesitar una
   abstracción nueva.
2. **About the process:** cerrar una épica de 5 historias sin que la
   última tuviera que "limpiar" nada de las anteriores —cada hallazgo se
   resolvió en su propia historia, no se acumuló— confirma que el
   principio de "parar en el primer defecto" sostenido historia tras
   historia evita la deuda que normalmente aparece recién al final de una
   épica.
3. **Capability gained:** el patrón de pestañas como lista de datos
   (`PESTANIAS.map`) en vez de JSX repetido es reusable para cualquier
   selector de modo futuro que crezca más allá de dos o tres opciones fijas.
