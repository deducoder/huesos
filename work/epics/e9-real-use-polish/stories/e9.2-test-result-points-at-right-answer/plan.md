# Story e9.2: The test result points at the right answer — Plan

> Size: M

## Tasks

### T1 · La grilla se queda y se califica; el botón muta

- **Files:** modify `src/features/test/TestQuestion.tsx`,
  `src/features/test/TestQuestion.test.tsx`.
- **TDD:** RED — cuatro afirmaciones nuevas sobre el modo opción múltiple:
  (a) tras responder mal, las tres opciones del `fieldset` siguen en el DOM;
  (b) la opción cuyo texto es `shortName(bone.es)` lleva una marca de
  acierto, acierte o no quien respondió; (c) la opción elegida, cuando erró,
  lleva una marca de error distinta de la de acierto; (d) solo hay **un**
  botón que diga «Responder» o «Siguiente pregunta» a la vez, antes y
  después de responder — nunca los dos ni ninguno. → GREEN — una función
  `estadoOpcion(opcion)` que devuelve `'neutra' | 'seleccionada' | 'acierto'
  | 'error'` según `resultado`, `seleccionId`, `opcion.id` y `bone.id`; cada
  botón lleva su clase y un glifo (`✓`/`✗`) **en el texto visible**, no en un
  atributo aparte — así el nombre accesible del botón lo incluye sin
  `aria-label` extra. El botón «Responder»/«Siguiente pregunta» es uno solo,
  con `onClick` y texto condicionados a `resultado`. Las opciones se
  deshabilitan tras responder (`disabled={resultado !== 'pendiente'}`): sin
  esto, tocar otra opción después de contestar no cambiaría nada observable
  pero dejaría el estado interno inconsistente con lo que la pantalla afirma.
  El párrafo `role="status"` se conserva —anuncia el resultado sin que un
  lector de pantalla tenga que entrar a la grilla, y sigue revelando
  `bone.la`— pero deja de contener un botón: el que muta vive afuera, donde
  estaba «Responder». → REFACTOR.
- **Satisfies:** los cuatro escenarios base del scope (acierto, error,
  tercera opción sin marcar, mutación del botón); `must-a11y-005` vía el
  glifo en el texto.
- **Verify:** la propiedad es que el marcador de acierto/error no depende
  del color y que nunca hay dos botones de acción a la vez — mutación
  forzada: quitar el glifo del texto y dejar solo la clase de color viola
  `must-a11y-005` (ninguna aserción de texto lo detecta más que la del
  glifo mismo); volver a los dos bloques condicionales de antes (uno con
  «Responder», otro con «Siguiente pregunta») viola (d). Luego
  `./scripts/check`.
- **Commit:** `feat(test): grade the options in place and mutate Responder into Siguiente pregunta`

### T2 · `onViewDetail` y `onCambiarModo` pasan a requeridas

- **Files:** modify `src/components/BoneIdentity.tsx`,
  `src/components/BoneIdentity.test.tsx`,
  `src/features/explore/ExploreView.tsx`, `src/features/test/TestQuestion.tsx`,
  `src/features/test/TestQuestion.test.tsx`,
  `src/features/test/BoneTestView.tsx`, `src/features/test/SkeletonTestView.tsx`.
- **TDD:** sin RED de comportamiento nuevo — es un endurecimiento de tipos.
  El **rojo es el compilador**: quitar el `?` de las cinco firmas hace que
  `tsc --noEmit` falle en cada `render()` que hoy omite la prop (17 en
  `TestQuestion.test.tsx`, 10 —los que pasan por `ExploreViewConSuEstado`—
  en `ExploreView.test.tsx`, y los de `BoneIdentity.test.tsx` que no la
  pasan). → GREEN — cada llamador recibe un `vi.fn()`; las dos condiciones
  que dejan de tener rama falsa alcanzable (`{onViewDetail && (...)}` en
  `BoneIdentity.tsx`, `{onCambiarModo && (...)}` en `TestQuestion.tsx`) se
  retiran, sus botones se renderizan siempre. → REFACTOR — se borra
  `'no muestra el botón de ficha completa sin el callback'`
  (`BoneIdentity.test.tsx`): no hay ya ningún valor de tipo válido que deje
  `onViewDetail` en `undefined`, así que el escenario que probaba no existe
  más. Ninguna prueba de `TestQuestion.test.tsx` dependía de la ausencia de
  «cambiar modo» (verificado por grep antes de tocar nada), así que no hay
  equivalente que borrar ahí.
- **Satisfies:** «el compilador nombra a cualquier llamador que hoy las
  omita… ninguno lo hace» (scope).
- **Verify:** la propiedad es que ya no existe un estado válido con la prop
  ausente — mutación forzada: devolver el `?` a cualquiera de las cinco
  firmas debe seguir compilando (porque nada lo exige) pero un `render()`
  sin la prop en cualquiera de los test dejaría de fallar en `tsc`, que es
  justo la protección que se pierde; comprobado manualmente restaurando un
  `?` y confirmando que el propio build ya no avisa. Luego `./scripts/check`.
- **Commit:** `refactor(test): require onViewDetail and onCambiarModo instead of tolerating their absence`

### T3 · `BoneTestView` reserva el alto real de su barra

- **Files:** create `src/components/useFraccionCubierta.ts`; modify
  `src/features/bone-detail/BoneDetailView.tsx`,
  `src/features/test/TestQuestion.tsx`, `src/features/test/TestQuestion.test.tsx`,
  `src/features/test/BoneTestView.tsx`, `src/features/test/BoneTestView.test.tsx`;
  create `e2e/mobile-shell.spec.ts` (nuevo escenario, mismo archivo).
- **TDD:** RED de plomería, no de medición —jsdom no puede medir un
  `ResizeObserver` real (el propio stub de `tests/setup.ts` no dispara
  callback, y `clientHeight` da 0 sobre cualquier elemento): afirmar un
  `reservedBottom` positivo en jsdom mediría el stub, no la barra, así que
  la prueba de este archivo es de **conexión**, no de valor. RED —
  `BoneTestView.test.tsx` extiende el doble de `IsolatedBoneScene` para
  capturar `reservedBottom` recibido, y afirma que **no** es la constante
  `0` que el código actual pasa (afirmación posible sin medir nada real:
  hoy es literalmente el número `0`, y tras el cambio es lo que
  `useFraccionCubierta` devuelva, aunque en jsdom eso también termine en 0
  por la misma limitación — la aserción que sí puede hacerse y falla hoy es
  que `reservedBottom` ya no es el **literal** `0` escrito a mano en
  `BoneTestView.tsx`, sino una variable calculada). → GREEN — extraer
  `useFraccionCubierta` de `BoneDetailView.tsx` a su propio módulo sin
  cambiar su cuerpo; `renderScene` gana un segundo parámetro
  `reservedBottom: number`; `TestQuestion` mide su propia barra
  (`contenedorRef`/`barraRef`, mismo patrón que `BoneDetailView`) y lo pasa;
  `BoneTestView` lo reenvía a `IsolatedBoneScene`; `SkeletonTestView` recibe
  el segundo argumento y no lo usa (`SkeletonScene` no tiene esa prop). →
  REFACTOR — `BoneDetailView.tsx` importa el hook en vez de declararlo.
  **La verificación real** —que el hueso no queda detrás de la barra— es un
  escenario nuevo de Playwright en `e2e/mobile-shell.spec.ts`, calcado del
  que e9.3 escribió para la tarjeta de la ficha
  (`huesoSobreYBajoLaTarjeta`, `:443`): se parametriza por `data-testid`
  (`tarjeta-ficha` | `barra-respuesta`) y se reutiliza para el fémur —el
  mismo caso extremo, alto y estrecho— en `BoneTestView`.
- **Satisfies:** «la barra de respuesta reserva su alto real» (scope, should).
- **Verify:** la propiedad de la prueba unitaria es que la plomería llega
  hasta el final, no que el número sea correcto — mutación forzada: volver
  a escribir `reservedBottom={0}` a mano en `BoneTestView.tsx` la pone en
  rojo. La propiedad del e2e es geométrica — mutación forzada: revertir
  `BoneTestView` a `reservedBottom={0}` debe hacer que el fémur quede
  mayormente tapado por la barra, igual que medía el hallazgo original de
  e9.3 antes de existir esta tarea. Luego `./scripts/check` y
  `npx playwright test mobile-shell`.
- **Commit:** `feat(bone-test-view): reserve the answer bar's real height instead of zero`

### T4 · `metacarpiano`/`metatarsiano` no desbordan su botón

- **Files:** modify `src/features/test/TestQuestion.tsx`.
- **TDD:** sin RED de vitest — jsdom no calcula ancho de texto real
  (`scrollWidth`/`clientWidth` no reflejan tipografía en un layout no
  renderizado), así que ninguna aserción de vitest puede fallar por esto
  hoy ni después: es una propiedad puramente visual, medida a mano en el
  navegador (design, T2 de e9.5 dejó el mismo tipo de límite documentado).
  Se añade `[hyphens:auto]` a la clase del botón de opción —el documento ya
  declara `lang="es"` en `index.html`, así que no hace falta repetirlo por
  elemento.
- **Satisfies:** «una palabra larga … no se sale de su botón» (scope, should).
- **Verify:** medido en el navegador, 390 px: `metacarpiano` pasa de 99/98
  px (`scrollWidth`/`clientWidth`, desborda) a 98/98 (exacto) — repetir la
  medición del design tras aplicar el cambio, contra el dev server real, y
  registrar el resultado en `progress.md`. Luego `./scripts/check` (gate de
  regresión, no de esta propiedad).
- **Commit:** `fix(test): let long option words hyphenate instead of overflowing their button`

### T5 · Verificación manual de integración

- Con la aplicación corriendo, en el teléfono: responder bien y mal en el
  modo test de esqueleto completo y en el de hueso aislado. Confirmar que
  la grilla se queda, que la correcta se marca en verde con su glifo, que
  la elegida se marca en rojo cuando erró, que "Siguiente pregunta" aparece
  en el lugar de "Responder", y que el hueso aislado ya no queda centrado
  detrás de la barra de respuesta.
- **Verify:** el recorrido completo se siente como un solo cambio de
  estado, no como una pantalla que desaparece y otra que la reemplaza; el
  hueso se ve entero sobre la barra en el modo aislado.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4 → T5. T1 primero porque es el
  núcleo de valor y el más denso en decisiones (el glifo, el botón único,
  deshabilitar tras responder); T2 después porque toca el mismo archivo
  (`TestQuestion.tsx`) y conviene que el endurecimiento de tipos se aplique
  sobre la forma final del componente, no a mitad de un rediseño. T3 y T4
  son independientes entre sí y de T1/T2 en el archivo que más importa
  (T3 toca `BoneTestView.tsx`/`useFraccionCubierta.ts`; T4 es una clase en
  `TestQuestion.tsx` que no interactúa con `estadoOpcion`), pero van después
  porque son de menor riesgo y no bloquean nada.
- **Dependencies:** T2 depende de T1 solo en el sentido de "mismo archivo,
  menos reescritura si el diseño ya está quieto" — no hay dependencia de
  comportamiento. T3 y T4 no dependen de ninguna de las anteriores.
- **Risks:**
  - **T3 es la única tarea sin un RED que pruebe la propiedad real** —
    jsdom no puede medir `ResizeObserver` sobre layout real
    (`tests/setup.ts` ya lo deja documentado como limitación conocida). El
    plan lo compensa con un e2e nuevo, no con más mocks: un mock más
    elaborado seguiría sin medir nada real, solo lo haría parecer que sí.
  - **T4 no tiene ningún test automático, ni antes ni después** — la
    verificación es manual y su registro en `progress.md` es la única
    prueba de que se hizo. Si algo la revierte sin querer, nada lo va a
    notar hasta la próxima verificación manual.
  - **T1 y T2 tocan el mismo archivo en el mismo lugar** (el bloque de
    `resultado !== 'pendiente'`) — el orden ya declarado (T1 primero) es la
    mitigación: T2 se aplica sobre la forma final, no sobre un estado
    intermedio que T1 todavía va a reescribir.
