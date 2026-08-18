# Story e9.5: Short names that stay distinguishable — Plan

> Size: L

## Tasks

### T1 · El catálogo declara el género gramatical de cada nombre

- **Files:** modify `src/data/bone.ts` (`gender: 'm' | 'f'` en `BoneCore`),
  `src/data/catalog.ts` (206 valores), `src/data/catalog.test.ts`.
- **TDD:** RED — dos afirmaciones en la prueba de integridad: (a) todas las
  entradas que comparten `es` declaran el mismo género; (b) una muestra de
  casos conocidos —`clavicle-right` femenino, `femur-right` masculino,
  `proximal-phalanx-2-hand-right` femenino, `inferior-nasal-concha-right`
  masculino— tiene el género que le corresponde. Falla porque el campo no
  existe. → GREEN — añadir el campo y rellenarlo. → REFACTOR.
- **Satisfies:** ADR-015; el criterio del scope sobre la concordancia.
- **Verify:** la propiedad es que el género declarado es coherente por nombre
  **y** correcto en casos que el test nombra desde fuera del catálogo —
  mutación forzada: poner `gender: 'm'` en `clavicle-left` viola (a), y
  ponerlo en **las dos** clavículas viola (b), que es lo que impide que una
  equivocación sistemática pase por coherente; luego `./scripts/check`.
- **Commit:** `feat(catalog): declare each bone name's grammatical gender`

### T2 · La derivación del nombre corto, con su gate sobre el catálogo real

- **Files:** create `src/components/bone-name.ts`,
  `src/components/bone-name.test.ts`.
- **TDD:** RED — los cuatro casos canónicos de la derivación (falange,
  vértebra, metatarsiano, y un nombre sin ordinal que solo se capitaliza) más
  el gate sobre los 206 huesos: ningún corto pasa de `TECHO_NOMBRE_CORTO`
  (26), dos nombres `es` distintos nunca producen el mismo corto, y **la
  derivación se aplicó** — al menos los 28 nombres de falange salen distintos
  de su original. → GREEN — la tabla de 17 ordinales, la elisión de la familia
  falange y la capitalización. → REFACTOR.
- **Satisfies:** «los 206 huesos … ninguno pasa del techo … dos huesos
  distintos nunca producen el mismo nombre corto … la comprobación falla si la
  derivación deja de aplicarse» (scope).
- **Verify:** la propiedad es que la derivación es total, acotada y biyectiva
  sobre los nombres del catálogo — mutación forzada: quitar `duodécima` de la
  tabla deja «duodécima vértebra torácica» en 27 y viola el techo; hacer que
  `shortName` devuelva su argumento viola la afirmación de que se aplicó, que
  es lo que impide que un andamiaje roto dé verde; borrar `mano`/`pie` de la
  elisión colapsa falanges y viola la unicidad; luego `./scripts/check`.
- **Commit:** `feat(bone-name): derive the short, capitalised bone name`

### T3 · El lado concuerda en género, y los dos nombres que consume la vista

- **Files:** modify `src/components/bone-name.ts`, `bone-name.test.ts`.
- **TDD:** RED — `sideLabel('right', 'f') === 'derecha'` y sus tres simétricos;
  `visibleName` da «Clavícula derecha» y `fullName` da «clavícula derecha»;
  un hueso impar no recibe lado por ninguna de las dos. → GREEN. → REFACTOR.
- **Satisfies:** «ningún hueso par muestra ni pronuncia el lado en el género
  equivocado»; el delta del design sobre el nombre accesible.
- **Verify:** la propiedad es que el lado concuerda en las cuatro
  combinaciones y que solo el visible se acorta — mutación forzada: devolver
  siempre `'derecho'` viola dos de las cuatro; hacer que `fullName` llame a
  `shortName` viola la separación que ADR-014 exige; luego `./scripts/check`.
- **Commit:** `feat(bone-name): agree the side label with the bone's gender`

### T4 · El navegador de Explorar muestra corto y anuncia completo

- **Files:** modify `src/components/BoneNavigator.tsx`,
  `src/components/BoneNavigator.test.tsx`.
- **TDD:** RED — el botón de una fila simple muestra el corto y expone el
  completo como nombre accesible; **la píldora de lado de una fila pareada**
  expone el nombre completo del catálogo más su lado, no el corto. → GREEN —
  texto visible corto y `aria-label` explícito; las píldoras dejan de componer
  su nombre con `aria-labelledby`, que lee el texto visible. → REFACTOR.
- **Satisfies:** el escenario añadido en el design sobre las píldoras pareadas.
- **Verify:** la propiedad es que el texto visible y el nombre accesible
  divergen a propósito y cada uno lleva su forma — mutación forzada: volver a
  `aria-labelledby` en las píldoras hace que el nombre accesible se acorte con
  el visible y viola la afirmación del lector; luego `./scripts/check`.
- **Commit:** `feat(navigator): show the short name and announce the full one`

### T5 · La grilla de Fichas, sus subgrupos capitalizados y el guardia e2e

- **Files:** modify `src/components/FichasAccordion.tsx`,
  `FichasAccordion.test.tsx`, `e2e/mobile-shell.spec.ts`.
- **TDD:** RED — el botón de la grilla muestra el corto con el lado
  concordado y expone el completo como nombre accesible; `subLabel` devuelve
  «Neurocráneo» y «Cara». → GREEN. → REFACTOR.
- **Satisfies:** «cada uno cabe en su botón sin envolver a tres líneas» y «su
  texto empieza en mayúscula» (scope).
- **Verify:** la propiedad es que el nombre visible se muestra **entero**, sin
  recorte — el guardia de e8.2 (`:191`) cambia de sujeto, del nombre completo
  al corto, y gana la mitad que le faltaba: que el completo sigue estando en
  el nombre accesible. Mutación forzada: añadir `truncate` al botón viola la
  visibilidad del corto; quitar el `aria-label` viola la segunda mitad. Luego
  `./scripts/check` y `npx playwright test mobile-shell`.
- **Commit:** `feat(fichas): shorten the grid labels and capitalise subgroups`

### T6 · El título de la ficha y el panel de identidad

- **Files:** modify `src/features/bone-detail/BoneSheet.tsx`,
  `src/components/BoneIdentity.tsx`, y sus pruebas.
- **TDD:** RED — el título de la ficha es el corto capitalizado y el nombre
  completo del catálogo aparece como una fila más de la ficha; el panel de
  identidad muestra el corto con el lado concordado. → GREEN. → REFACTOR.
- **Satisfies:** «el nombre completo del catálogo sigue estando en la ficha»
  (scope).
- **Verify:** la propiedad es que acortar el título no pierde el dato —
  mutación forzada: quitar la fila del nombre completo deja la ficha sin
  ninguna aparición del `es` íntegro y viola el criterio; luego
  `./scripts/check`.
- **Commit:** `feat(bone-detail): title the sheet with the short name`

### T7 · Las tres opciones del test

- **Files:** modify `src/features/test/TestQuestion.tsx`,
  `TestQuestion.test.tsx`.
- **TDD:** RED — las tres opciones muestran el nombre corto, y el hueso
  revelado tras un fallo sigue mostrando el nombre completo con su latín. →
  GREEN — solo el texto; el estado posterior a la respuesta no se toca. →
  REFACTOR.
- **Satisfies:** «las tres son distinguibles entre sí» (scope).
- **Verify:** la propiedad es que el acortado no filtra la respuesta ni la
  destruye — mutación forzada: renderizar el nombre antes de responder viola
  `must-data-003`/`must-data-010`, que las pruebas de esos guardrails ya
  afirman y que esta tarea debe dejar en verde sin tocarlas; luego
  `./scripts/check`.
- **Commit:** `feat(test): shorten the multiple-choice option labels`

### T8 · Barrido: `SIDE_LABEL` y las dos copias de `accessibleName`

- **Files:** modify `src/components/labels.ts`; borrar `accessibleName` de
  `BoneNavigator.tsx` y `FichasAccordion.tsx`.
- **TDD:** sin RED propio — es supresión de código muerto, y el instrumento es
  el compilador. El chequeo explícito de huérfanos sustituye al test: un grep
  de `SIDE_LABEL` y de `accessibleName` sobre `src/` tiene que devolver
  **cero** ocurrencias fuera de `bone-name.ts`.
- **Satisfies:** el legacy sweep declarado en el design.
- **Verify:** la propiedad es que no queda ningún consumidor de la regla vieja
  — mutación forzada: dejar una llamada a `SIDE_LABEL` en cualquier componente
  hace que el grep devuelva una línea y que `tsc` falle al no existir el
  símbolo; el grep es lo que afirma que se miró, porque un `tsc` verde también
  lo estaría si nadie hubiera borrado nada. Luego `./scripts/check`.
- **Commit:** `refactor(labels): drop the side label superseded by bone-name`

### T9 · Verificación manual de integración

- Con la aplicación corriendo, en un teléfono real y en el navegador de
  escritorio: recorrer Fichas → miembro superior (las falanges, el caso
  extremo), abrir una ficha, entrar a las dos variantes de test, y pasar por
  Explorar con el navegador por teclado.
- **Verify:** ninguna etiqueta envuelve a tres líneas en la grilla; ningún
  «clavícula derecho» en ninguna vista; el nombre completo se lee en la ficha;
  y con el lector de pantalla —o con el inspector de accesibilidad— el botón
  de una falange anuncia el nombre íntegro del catálogo.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9. T1 primero
  porque es el volumen —206 valores— y porque T3 no existe sin él. T2 y T3
  antes que todo componente: son el contrato que los cinco consumen.
- **Dependencies:** secuencial hasta T3. De T4 a T7 no hay dependencia mutua
  —cuatro archivos distintos, ningún import compartido más allá de
  `bone-name.ts`— así que su orden es reordenable si alguna se atasca. T8
  depende de que las cuatro hayan migrado.
- **Risks:**
  - **T4 es el desconocido real y llega en cuarto lugar** → las píldoras
    pareadas componen su nombre accesible con `aria-labelledby`, que lee el
    texto visible; si `aria-label` explícito no diera el mismo resultado en la
    suite, el fallback es dejar el nombre de la fila en un span `sr-only` con
    el texto completo. No se puede adelantar: depende de T2 y T3.
  - **El gate de T2 puede dar verde con el instrumento roto** → la afirmación
    de que la derivación se aplicó es lo que lo impide, y su mutación forzada
    está escrita arriba. Es el mismo error que ya costó una historia.
  - **206 valores de género escritos de una vez** → el test de casos conocidos
    de T1 se elige entre los que la regla ingenua fallaría («falange»,
    «cornete»), no entre los cómodos.
  - **La suite e2e se rompe en T5 y no antes** → el arreglo del guardia va
    dentro de T5, no en una tarea de limpieza al final: dejar la suite roja
    entre dos tareas es acumular un defecto.
