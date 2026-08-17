# Story e5.1: Progress record — Progress

## T1 · El registro y la lectura de un hueso

`src/domain/progress.ts` con `BoneProgress` (dos contadores), `ProgressRecord`
(plano, indexado por `Bone.id`, `Readonly`), `EMPTY_PROGRESS` y
`boneProgress(record, boneId)`, que devuelve `{ correct: 0, incorrect: 0 }`
para un `id` ausente en vez de `undefined`.

RED: los tres tests fallaron por módulo inexistente antes de escribirlo.
Gate: `./scripts/check` verde — 144 tests (los 141 de `main` más 3 nuevos).
Desviación: los campos se nombraron en inglés (`correct`/`incorrect`) y no en
español como decía el ejemplo original del `scope.md`, para seguir el resto de
la superficie exportada del proyecto (`Bone` usa `id`, `side`, `meshName`). El
`scope.md` se corrigió antes de implementar, no después.

## T2 · Anotar un veredicto sin mutar

`recordAnswer(record, boneId, wasCorrect)` devuelve un registro nuevo con ese
único hueso incrementado. Seis tests: acierto y fallo sobre registro vacío,
acumulación de fallos sucesivos, un acierto que **no** borra los fallos
previos, el resto del registro intacto, y la pureza comprobada de las dos
formas (el recibido no cambia y el devuelto no es la misma referencia).

RED: los seis fallaron con `recordAnswer is not a function` antes de escribirla.
Gate: `./scripts/check` verde — 150 tests. Desviación: ninguna.

## T3 · Prueba de integración manual — el dato real, a escala real

Ejecutado con `vite-node` contra el catálogo real, no contra ids inventados:

- **206 huesos** registrados, los 206 con entrada.
- **Ida y vuelta por JSON equivalente para los 206.**
- **9.822 bytes (9,6 KB)** serializado — el **0,187 %** del límite práctico de
  5 MB de `localStorage`. Peor caso construido a mano (206 huesos con
  contadores de tres cifras): **10,4 KB**.
- Un `id` fuera del catálogo se sigue leyendo como `{correct:0,incorrect:0}`
  tras la ida y vuelta.

**La medición confirma la premisa de ADR-004** ("del orden de unos pocos
kilobytes contra el límite práctico de 5 MB"), así que el ADR queda como está:
no hay nada que superseder. Queda anotado el número medido para que la próxima
vez nadie tenga que volver a estimarlo.

**Desviación del plan:** el `scope.md` pedía la ida y vuelta por JSON como
prueba unitaria (está en su *In scope* y en su *Done when*), y T3 solo la
ejercitaba en una sonda desechable. Se agregó como test permanente —contra los
206 ids reales— antes de cerrar. La sonda se borró.

## Finalize

- Full gate set: `./scripts/check` verde — **151 tests** (141 al empezar la
  historia, 10 nuevos en `progress.test.ts`).
- Orphaned-test check: limpio — ningún test fuera de esta historia importa
  `src/domain/progress`; el módulo es nuevo y todavía no tiene consumidores
  (los tendrá en e5.2, e5.3 y e5.4).
- Acceptance criteria: los cinco escenarios del `scope.md` cumplidos y con
  test propio. Los cinco `Done when` cumplidos.
