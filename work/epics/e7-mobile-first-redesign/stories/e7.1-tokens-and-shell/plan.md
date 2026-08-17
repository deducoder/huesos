# Story e7.1: Tokens y shell — Plan

> Size: M

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · Los tokens en `@theme` y el shell táctil

- **Files:** create `e2e/mobile-shell.spec.ts`; modify `src/index.css`,
  `src/App.tsx` (cabecera y pestañas).
- **TDD:** RED `e2e/mobile-shell.spec.ts` mide las tres pestañas en 390×844 y
  falla con `alto de "Explorar": 30` → GREEN el bloque `@theme` con los nueve
  colores, los dos radios, la sombra dura, `--spacing-tactil` y `--text-titulo`,
  más cabecera y pestañas reescritas sobre esos tokens → REFACTOR ninguno
  previsto; el shell son dos elementos.
- **Satisfies:** Must 2 y Must 5 del design; el primer criterio Gherkin del
  scope (las tres pestañas ≥ 44×44 px).
- **Verify:** `./scripts/check` y
  `npx playwright test e2e/mobile-shell.spec.ts` — solo ese archivo: la suite
  entera son ~4 min y aquí no aporta.
- **Commit:** `feat(shell): design tokens and thumb-sized tabs`

### T2 · El alto con la unidad dinámica

- **Files:** create `tests/shell.test.ts`; modify `src/App.tsx` (una clase).
- **TDD:** RED un test que lee el fuente de `App.tsx` y exige `h-dvh` sin
  `h-screen` — falla hoy; incluye la aserción de control de que el archivo se
  leyó y no está vacío, porque un recorrido roto daría verde por ausencia →
  GREEN cambiar la clase → REFACTOR ninguno.
- **Satisfies:** Must 3 del design; el segundo criterio Gherkin del scope.
- **Verify:** `./scripts/check`.
- **Commit:** `fix(shell): size the viewport with the dynamic unit`
- **Nota:** va en un test de fuente y no en la suite de navegador a propósito —
  el viewport de Playwright no simula la barra de URL de un móvil, así que el
  navegador **no puede observar** este defecto. Es el mismo patrón que
  `SkeletonScene.test.tsx` ya usa para lo que el runtime no expone.

### T3 · Las 35 utilidades de color literal, sustituidas por tokens

- **Files:** create `tests/sources.ts`, `tests/design-tokens.test.ts`; modify
  `tests/privacy.test.ts` (importa el helper), `src/App.tsx`,
  `src/components/BoneNavigator.tsx`, `src/components/BoneIdentity.tsx`,
  `src/features/explore/ExploreView.tsx`,
  `src/features/bone-detail/BoneDetailView.tsx`,
  `src/features/test/TestQuestion.tsx`.
- **TDD:** RED el gate falla listando las 35 líneas reales, y trae dos
  aserciones de control —el recorrido devuelve más de un archivo, y el patrón
  reconoce `bg-sky-700` en una cadena de prueba— porque el caso feliz es una
  lista vacía y un instrumento roto pasaría en verde → GREEN sustituir las 35
  conservando forma, distribución y jerarquía → REFACTOR conservar la opacidad
  del `sticky top-0` en los encabezados de región del navegador.
- **Satisfies:** Must 1 y Must 4 del design; Should 1; el tercer y cuarto
  criterio Gherkin del scope.
- **Verify:** `./scripts/check` — los 201 tests unitarios siguen verdes **sin
  reescribirse**; si uno cae, la lectura por defecto es accesibilidad
  degradada, no test frágil (ADR-007).
- **Commit:** `refactor(ui): consume design tokens instead of literal colors`

### T4 · Manual integration test

- Con la aplicación corriendo (`npm run dev`), en un viewport de 390×844 y
  después en escritorio, recorrer: explorar → seleccionar un hueso → ficha
  completa → volver → pestaña Fichas → pestaña Test → elegir variante →
  responder una pregunta bien y una mal.
- **Verify:** ninguna pantalla queda con texto claro sobre fondo claro; los
  encabezados de región no dejan ver el texto por debajo al desplazar; las
  pestañas se pulsan con el pulgar sin apuntar; el veredicto del test sigue
  escrito con palabras y no solo con color. Antes de cerrar, la suite entera:
  `./scripts/check-integration`.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T1 primera **por dependencia dura, no
  por riesgo**: sin los tokens declarados no hay nada que consumir en T3, que es
  la tarea con más superficie. Invertirlas por riesgo dejaría a T3 sin RED
  posible, que es justo la señal de un corte mal hecho.
- **Dependencies:** secuencial. T2 es independiente de T1 y T3 y podría ir en
  cualquier posición; se deja segunda por ser trivial y dejar `App.tsx` ya
  estabilizado antes de la sustitución masiva.
- **Risks:**
  - *El gate anti-literales da falsos negativos y pasa en verde sin mirar* →
    las dos aserciones de control de T3; el aprendizaje
    `a-check-needs-a-check-that-it-looked` viene exactamente de esto.
  - *Sustituir 35 líneas degrada la accesibilidad sin que nadie lo note* → los
    201 tests consultan roles y nombres accesibles y no se reescriben; un rojo
    ahí es la señal.
  - *Algo queda ilegible en una vista que ningún test mira* → T4 recorre las
    seis vistas a mano. Es el mismo hueco por el que b2.3 se escapó con dos
    gates en verde.
  - *La suite de navegador entera tarda ~4 min y tienta a saltarla* → T1 corre
    solo el archivo nuevo; la suite completa se paga una vez, en T4.
