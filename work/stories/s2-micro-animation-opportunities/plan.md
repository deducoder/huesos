# Story s2: Micro-animation opportunities — Plan

> Size: L (6 tareas de código + integración manual) — se consideró partir la
> historia en dos, pero las 6 dependen del mismo T1 (tokens) y cada una es de
> pocas líneas; separar habría sido proceso desproporcionado al tamaño real
> del cambio (Simple first).

## Tasks

### T1 · Tokens de motion y regla global de `prefers-reduced-motion`

- **Files:** modify `src/index.css` (bloque `@theme` + regla `@media
  (prefers-reduced-motion: reduce)`); create `tests/motion-tokens.test.ts`
  (mismo patrón de lectura de fuente que `tests/design-tokens.test.ts`).
- **TDD:** RED — test que lee `src/index.css` y afirma que existen
  `--duration-rapida`, `--duration-base`, `--duration-panel`, `--ease-salida`
  y el bloque `@media (prefers-reduced-motion: reduce)` con
  `transition-duration: 0.01ms !important` → falla porque nada de esto
  existe todavía. GREEN — agregar los tokens y la regla al `@theme`.
  REFACTOR — ninguno esperado, es la base.
- **Satisfies:** design.md, Must "usan los tokens nuevos de `@theme`" y
  "con `prefers-reduced-motion` activo, ninguna transición se percibe".
- **Verify:** la propiedad es que los 4 tokens y la regla global existen en
  `src/index.css` — mutación forzada: borrar `--ease-salida` (o cualquiera
  de los otros tres) del archivo debe volver rojo el test nuevo.
  `npx vitest run tests/motion-tokens.test.ts && npm run --silent lint &&
  npm run --silent typecheck`.
- **Commit:** `feat(motion): add motion tokens and reduced-motion override`

### T2 · Acordeón de fichas: apertura/cierre animados, sin fuga de foco

La más riesgosa: cambia un contrato de test existente a propósito
(`FichasAccordion.test.tsx:12` hoy afirma que el contenido colapsado **no**
está en el DOM; con el truco `grid-template-rows` pasa a estar siempre
montado, oculto por altura cero + `inert`) y es la única tarea que toca
accesibilidad de foco.

- **Files:** modify `src/components/FichasAccordion.tsx`,
  `src/components/FichasAccordion.test.tsx`.
- **TDD:** RED — reescribir el test de la línea 12: en vez de
  `not.toBeInTheDocument()`, afirmar que el botón sigue en el documento pero
  su contenedor tiene el atributo `inert`; agregar un test nuevo que
  verifica que expandir quita `inert` del contenedor y que la flecha lleva
  `transition-transform`. Ambos fallan contra el código actual (el botón
  hoy no existe en el DOM colapsado; no hay ninguna clase de transición).
  GREEN — quitar el `{expandida && (...)}` condicional, envolver en el
  contenedor `grid-rows-[0fr]/[1fr]` con `inert={!expandida}`, agregar
  `transition-transform` a la flecha. REFACTOR — confirmar que el resto de
  los 9 tests de este archivo siguen pasando sin tocarlos.
- **Satisfies:** design.md, Must "el contenido colapsado no es alcanzable
  por teclado"; scope.md, escenario de acordeón.
- **Verify:** la propiedad es que un contenedor colapsado lleva `inert` y
  uno expandido no — mutación forzada: fijar `inert={true}` sin condición
  (o quitar el atributo del todo) debe volver rojo el test nuevo de
  `inert`. `npx vitest run src/components/FichasAccordion.test.tsx && npm
  run --silent lint && npm run --silent typecheck`.
- **Commit:** `feat(fichas): animate accordion expand/collapse with inert content`

### T3 · Panel de menú (`AboutPanel`): entrada animada

- **Files:** modify `src/components/AboutPanel.tsx`,
  `src/components/AboutPanel.test.tsx`.
- **TDD:** RED — test que afirma que el overlay y el diálogo llevan las
  clases `duration-panel`/`ease-salida` (mismo patrón que
  `App.test.tsx:64` ya usa con `toHaveClass` para tokens de estilo) → falla,
  las clases no existen hoy. GREEN — agregar las clases de transición y
  `@starting-style` según design.md. REFACTOR — ninguno esperado.
- **Satisfies:** design.md, Must "usan los tokens nuevos"; Must NOT "no
  anima su salida" (documentado en el propio código con un comentario corto
  si el porqué no es obvio desde el diff).
- **Verify:** la propiedad es que el overlay y el diálogo llevan las clases
  de transición nuevas — mutación forzada: quitar `duration-panel` de la
  clase del diálogo debe volver rojo el test. `npx vitest run
  src/components/AboutPanel.test.tsx && npm run --silent lint && npm run
  --silent typecheck`.
- **Commit:** `feat(about-panel): animate entrance`

### T4 · Retroalimentación del test: panel de resultado y prensado de opciones

- **Files:** modify `src/features/test/TestQuestion.tsx`,
  `src/features/test/TestQuestion.test.tsx`.
- **TDD:** RED — dos afirmaciones nuevas: el `role="status"` del resultado
  lleva `duration-base`/`ease-salida`; un botón de opción lleva
  `active:scale-[0.97]`. Ambas fallan hoy. GREEN — agregar las clases al
  panel de resultado (ambos formatos, `open` y `choice`) y a los botones de
  opción del formato `choice`. REFACTOR — confirmar que `estadoOpcion` y
  `CLASE_POR_ESTADO` no necesitan tocarse — la clase de prensado es
  independiente del estado calificado.
- **Satisfies:** design.md, Should "las opciones dan retroalimentación de
  prensado"; Must "usan los tokens nuevos".
- **Verify:** la propiedad es que el panel de resultado y las opciones
  llevan las clases nuevas — mutación forzada: quitar
  `active:scale-[0.97]` de un botón de opción debe volver rojo el test.
  `npx vitest run src/features/test/TestQuestion.test.tsx && npm run
  --silent lint && npm run --silent typecheck`.
- **Commit:** `feat(test): animate result feedback and option press`

### T5 · Tarjeta de identidad flotante (`ExploreView`): entrada animada

- **Files:** modify `src/features/explore/ExploreView.tsx`,
  `src/features/explore/ExploreView.test.tsx`.
- **TDD:** RED — test que afirma que `tarjeta-identidad` lleva
  `duration-panel`/`ease-salida` → falla hoy. GREEN — agregar las clases al
  contenedor. REFACTOR — ninguno esperado.
- **Satisfies:** design.md, ejemplo de la sección 3; Must "usan los tokens
  nuevos".
- **Verify:** la propiedad es que `tarjeta-identidad` lleva las clases de
  transición nuevas — mutación forzada: quitar `duration-panel` de esa
  clase debe volver rojo el test. `npx vitest run
  src/features/explore/ExploreView.test.tsx && npm run --silent lint &&
  npm run --silent typecheck`.
- **Commit:** `feat(explore): animate identity card entrance`

### T6 · Píldora de pestaña activa: transición de color

- **Files:** modify `src/App.tsx`, `src/App.test.tsx`.
- **TDD:** RED — test que afirma que cada botón de `Pestanas` lleva
  `transition-colors`/`duration-base`/`ease-salida` sin condicionarlo a si
  está activo → falla hoy (la clase no existe). GREEN — agregar la clase
  siempre presente al botón. REFACTOR — ninguno esperado.
- **Satisfies:** design.md, Should "la píldora activa transiciona en vez de
  saltar".
- **Verify:** la propiedad es que las 3 pestañas llevan la clase de
  transición, activa o no — mutación forzada: condicionar
  `transition-colors` solo a `on === true` debe volver rojo el test (que
  comprueba también la pestaña inactiva). `npx vitest run
  src/App.test.tsx && npm run --silent lint && npm run --silent typecheck`.
- **Commit:** `feat(app): animate active tab pill color`

### T7 · Integración manual

- Levantar `npm run dev`, y en el navegador real (no solo jsdom):
  1. Abrir la pestaña Fichas, expandir y colapsar "Cráneo" — confirmar que
     el contenido crece/decrece con transición (no salto) y que, colapsado,
     `Tab` no entra a sus botones internos.
  2. Abrir el menú (ícono de hamburguesa) — confirmar que el panel entra
     con transición, no de golpe.
  3. En Explorar, tocar un hueso por primera vez — confirmar que la
     tarjeta de identidad entra con transición.
  4. Responder una pregunta del test (formato por defecto) — confirmar
     retroalimentación de prensado en la opción tocada y entrada del panel
     de resultado.
  5. Cambiar entre las pestañas Explorar/Fichas/Test — confirmar que la
     píldora activa transiciona de color.
  6. Repetir 1-5 con `prefers-reduced-motion: reduce` emulado (DevTools →
     Rendering → Emulate CSS media feature) — ninguna transición debe
     percibirse.
  7. Confirmar en el panel de rendimiento (o a ojo) que seleccionar un
     hueso en el esqueleto completo sigue sintiéndose instantáneo — nada de
     esta historia debería haber tocado esa ruta, pero es la comprobación
     directa de que `should-perf-007` sigue en pie.
- **Verify:** las 7 comprobaciones anteriores, todas a ojo en un navegador
  real — es lo que ningún test de jsdom puede probar (ni la transición
  real ni el bloqueo de foco de `inert`).

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4 → T5 → T6 → T7. T1 primero porque
  las otras cinco consumen sus tokens; T2 segundo porque es la única que
  cambia un contrato de test existente y toca accesibilidad de foco — mejor
  encontrar ahí cualquier sorpresa temprano. T3-T6 son independientes entre
  sí una vez que T1 existe (podrían reordenarse sin romper nada), se dejan
  en el orden del reporte de oportunidades por leverage.
- **Dependencies:** T2-T6 dependen de T1 (los tokens). T7 depende de las 6
  anteriores. Sin ciclos.
- **Risks:**
  - jsdom no ejecuta transiciones CSS reales ni respeta `inert` para foco
    → mitigado dejando esas dos comprobaciones para T7 (integración
    manual), consistente con cómo el proyecto ya trata otras limitaciones
    de jsdom (`AboutPanel.tsx`, comentario sobre `<dialog>`).
  - Cambiar el contrato de `FichasAccordion.test.tsx` (T2) podría
    esconder una regresión real si el nuevo test es más laxo que el
    viejo → mitigado porque el test nuevo sigue afirmando algo concreto
    (`inert` presente/ausente), no solo "no truena".
