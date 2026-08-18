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
  consultar `screen.getByRole('group', …)` después de cada interacción.
  Con esa corrección, **3 de 4 en rojo** — el cuarto («nunca hay dos
  botones de acción a la vez») ya se cumplía con el código viejo por
  construcción, así que queda como guardia de regresión.
- **GREEN — un error de sintaxis a mitad de camino.** El primer reemplazo
  dejó el ternario `answerFormat === 'open' ? … : …` incompleto y rompió
  también el formato `'open'`, que el scope exige dejar intacto. Se
  reescribió separando primero por `answerFormat` y después, solo dentro de
  la rama `'choice'`, por `resultado`.
- **Una regresión propia, encontrada por el propio test suite.** El primer
  intento colapsó «Correcto»/«Incorrecto» y el revelado en un solo `<p>`
  con un guion largo — rompió `getByText(/^incorrecto$/i)`, que exige
  coincidencia exacta de nodo. Restaurada la forma original de dos
  párrafos dentro de `role="status"`.
- **Mutación forzada:** quitar los dos glifos pone en rojo las 3 pruebas
  que dependen de ellos — confirma que el indicador no depende solo del
  color (`must-a11y-005`).
- **Gate:** `./scripts/check` verde — 320 tests.

## T2 · `onViewDetail` y `onCambiarModo` pasan a requeridas

**Done.** Las cinco firmas perdieron el `?`; las dos condiciones muertas se
retiraron, sus botones se renderizan siempre.

- **El rojo fue el compilador**: 14 errores en `BoneIdentity.test.tsx`, y
  30 más repartidos en `TestQuestion.test.tsx` (21), `BoneTestView.test.tsx`
  (5) y `SkeletonTestView.test.tsx` (4) — más de lo estimado porque
  `TestQuestion.test.tsx` había crecido con los 4 tests de T1.
- **Un test se borró** —`'no muestra el botón de ficha completa sin el
  callback'`— porque ya no hay ningún valor de tipo válido que deje
  `onViewDetail` en `undefined`.
- **Mutación forzada:** devolver el `?` a `onCambiarModo` **no produce
  ningún error de tipos** — confirmado con `tsc --noEmit` antes y después,
  sin diferencia. Es la protección exacta que esta tarea instala.
- **Gate:** `./scripts/check` verde — 319 tests (320 − 1).

## T3 · `BoneTestView` reserva el alto real de su barra

**Done.** `useFraccionCubierta` extraído a `src/components/`, sin cambiar su
cuerpo; `renderScene` gana un segundo parámetro `reservedBottom: number`;
`TestQuestion` mide su propia barra y lo pasa; `BoneTestView` lo reenvía a
`IsolatedBoneScene`; `SkeletonTestView` lo ignora sin cambio de código —una
función tipada con 2 parámetros admite un callback que solo usa el primero.

- **RED de plomería, dos partes.** (a) `BoneTestView.test.tsx`: un test
  source-level (mismo patrón que `SkeletonScene.test.tsx`) que afirma que
  `reservedBottom={0}` ya no aparece en el archivo. **El primer intento de
  este test era decorativo**: afirmaba `dataset.reservedBottom !== ''`,
  que es verdad incluso con el `0` viejo (`"0"` no es `''`) — se detectó
  corriéndolo contra el código sin tocar y viendo que pasaba cuando debía
  fallar. (b) `TestQuestion.test.tsx`: un `renderScene` espía que afirma
  que recibe un segundo argumento de tipo `number` — jsdom no puede medir
  un `ResizeObserver` real (`tests/setup.ts` ya lo documenta), así que la
  propiedad verificable ahí es que la plomería llega, no que el número sea
  distinto de cero.
- **Un defecto real, no intermitencia, encontrado al correr el gate
  completo.** `TestQuestion.test.tsx:322` (`'elegir una opción
  incorrecta...'`) empezó a fallar ~25 % de las veces. Investigado en vez
  de descartado: la causa es que T1 deja la grilla montada tras responder,
  así que el botón de la opción correcta también muestra el nombre del
  hueso (capitalizado). Para los huesos cuyo nombre corto es solo una
  capitalización del completo —«peroné» → «Peroné», 45 de 120— buscar
  `bone.es` en todo el documento encuentra **dos** coincidencias
  (case-insensitive) y `getByText` revienta con «multiple elements found».
  Depende de qué hueso sortea `pickTestableBone`, por eso parecía
  intermitente. Arreglado acotando la búsqueda a `within(screen.getByRole(
  'status'))`. Verificado con 20 corridas en verde tras el fix.
- **El e2e no puede ser determinista, y se documentó por qué.** A
  diferencia de `abrirFicha` (hueso elegido a mano), `must-data-003`
  prohíbe que Playwright sepa qué hueso salió sorteado en el modo test —
  ni por texto, ni por `aria-label`, ni por `data-hueso` (que solo existe
  en el doble de los tests unitarios). El nuevo escenario de
  `mobile-shell.spec.ts` mide píxeles ciego al nombre, y se repite 12
  veces para compensar: medido revirtiendo a mano `reservedBottom={0}`,
  solo ~1 de cada 8 sorteos expone el defecto lo bastante para cruzar el
  umbral, así que un solo intento habría dado falso verde la mayoría de
  las veces. Con 12, la chance de que ninguno lo exponga baja a ~20 %. No
  es la certeza de un fixture elegido a mano; es la que el secreto del
  modo test permite.
- **Gate:** `./scripts/check` verde — 321 tests. `npx playwright test
  mobile-shell` **23 de 23**, con los puertos 4173-4175 comprobados
  libres antes de correr.

**Lo que el plan no anticipó:** que la propia RED de la plomería podía ser
decorativa (mismo patrón de error que en e9.1 con el gate de contraste), y
que el defecto de «peroné» no era intermitencia de entorno sino una
interacción real y determinista con el hueso sorteado.

## T4 · `metacarpiano`/`metatarsiano` no desbordan su botón

**El código ya estaba.** Al escribir T1 agregué `[hyphens:auto]` a la clase
del botón de opción en el mismo reemplazo que introdujo `estadoOpcion` —sin
notarlo como una tarea aparte en el momento—, así que no hay un commit nuevo
que hacer acá: la línea vive en `5526f5a`. Lo que faltaba de T4 era la
**verificación**, que el plan pedía contra el navegador real, y eso sí se
hizo ahora, no antes.

- **Sin RED de vitest**, como el plan preveía: jsdom no calcula ancho de
  texto real.
- **Medido contra el dev server**, mismo método que el design: `metacarpiano`
  y `metatarsiano` dan `scrollWidth === clientWidth === 98` — sin
  desbordamiento, contra los 99/98 (1 px) que medía el design antes del
  cambio.
- **Gate:** `./scripts/check` ya estaba verde desde T1; no vuelve a correr
  acá porque no hay cambio de código.

**Lo que el plan no anticipó:** que una tarea sin dependencias de las
anteriores igual podía colarse dentro de otra, por estar en el mismo bloque
JSX que T1 reescribía. El plan la había ordenado así a propósito
("independientes… pero van después porque son de menor riesgo"), y el
resultado real fue que el orden en el archivo, no el orden del plan, decidió
cuándo se escribió cada línea.

## T5 · Verificación manual de integración

**Done.** Confirmado por el humano en su teléfono: acertar y errar en las
dos variantes de test (esqueleto completo y hueso aislado), «Siguiente
pregunta» en el lugar de «Responder», y en hueso aislado el hueso ya no
queda detrás de la barra.

**Chequeo de tests huérfanos:** `App.test.tsx` y `BoneDetailView.test.tsx`
importan componentes que esta historia tocó (`ExploreView`/`TestQuestion` vía
`App`; `useFraccionCubierta` extraído vía `BoneDetailView`) sin haber sido
tocados ellos mismos. Los dos corridos — **20 de 20**, sin regresión: el
comportamiento público de ninguno de los dos cambió.

**Gates finales:** `./scripts/check` verde (321 tests) ·
`./scripts/check-integration` **32 de 32**, con los puertos 4173-4175
comprobados libres antes de correr · `should-perf-007` mediana 4,7 ms
(máximo 20,4 ms), sin regresión respecto de e9.1.
