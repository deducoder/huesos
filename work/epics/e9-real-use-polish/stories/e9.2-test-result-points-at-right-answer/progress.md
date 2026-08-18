# Story e9.2: The test result points at the right answer — Progress

## T1 · La grilla se queda y se califica; el botón muta

**Done.** `estadoOpcion` califica cada opción (`neutra | seleccionada |
acierto | error`), el glifo (`✓`/`✗`) va en el texto visible —así el nombre
accesible del botón lo incluye sin `aria-label` aparte—, y un único botón
alterna entre «Responder»/«Siguiente pregunta» según `resultado`.

- **RED, primera versión — un falso verde encontrado a tiempo.** Los cuatro
  tests nuevos capturaban `grupo` (el `role="group"`) **antes** de responder
  y volvían a consultarlo **después** con la misma referencia. Con el
  código viejo, el bloque entero se desmonta al responder — pero un nodo
  desmontado sigue teniendo sus hijos en memoria, así que
  `within(grupo).getAllByRole('button')` seguía encontrando los 3 botones
  **viejos**, dando un verde que no probaba nada. Reescritos para volver a
  consultar `screen.getByRole('group', …)` después de cada interacción: si
  el grupo se hubiera desmontado, la consulta fallaría en vez de leer un
  nodo huérfano. Con esa corrección, **3 de 4 en rojo** — el cuarto
  («nunca hay dos botones de acción a la vez») ya se cumplía con el código
  viejo por construcción (ramas mutuamente excluyentes), así que queda como
  guardia de regresión y no como comportamiento nuevo.
- **GREEN — un error de sintaxis a mitad de camino.** El primer reemplazo
  dejó el ternario `answerFormat === 'open' ? … : …` incompleto porque
  fusionó por error la rama `resultado === 'pendiente'` con la de opción
  múltiple, rompiendo también el formato `'open'` — que el scope exige
  dejar intacto. Se reescribió separando primero por `answerFormat` y
  después, solo dentro de la rama `'choice'`, por `resultado`.
- **Una regresión propia, encontrada por el propio test suite.** El primer
  intento de la rama calificada colapsó «Correcto»/«Incorrecto» y el
  revelado de `bone.es`/`bone.la` en un solo `<p>` con un guion largo —
  rompió `getByText(/^incorrecto$/i)`, que exige coincidencia exacta de
  nodo. Restaurada la forma original de dos párrafos dentro de
  `role="status"`, la misma que ya usaba (y sigue usando, sin tocar) el
  formato `'open'`.
- **Mutación forzada:** quitar los dos glifos (`✓ `/`✗ `) del texto visible
  pone en rojo las 3 pruebas que dependen de ellos — confirma que el
  indicador de acierto/error no depende solo del color (`must-a11y-005`).
- **Gate:** `./scripts/check` verde — 320 tests.

**Lo que el plan no anticipó:** el propio plan había previsto que un test
podía dar un falso verde por depender de una referencia stale — el riesgo
está documentado en la memoria del proyecto desde e9.1 (test-doubles y
test-can-defend-the-bug) — pero no anticipó que **el propio T1** lo
produciría al escribir sus RED. Se detectó al revisar por qué solo 2 de 4
tests fallaban cuando el diseño predecía 4, no por sospecha previa.
