# Story e9.4: The skeleton test zooms to what it asks — Plan

> Size: M

## Tasks

### T1 · `SkeletonHalf` reporta la caja del hueso seleccionado

- **Files:** modify `src/components/SkeletonScene.tsx`,
  `src/components/SkeletonScene.test.tsx`.
- **TDD:** jsdom no ejecuta WebGL, así que —mismo patrón que el resto de
  este archivo— el RED es sobre el código fuente, no sobre render. RED —
  dos afirmaciones: (a) `SkeletonHalf` recibe un `onSelectedBox` y lo llama
  dentro del mismo recorrido que ya calcula `esteHueso`, reutilizando esa
  variable —no una segunda comparación—; (b) cuando `esteHueso !==
  selected` para toda la mitad, se reporta `null` (no queda un valor
  viejo de una selección anterior). → GREEN — dentro del `traverse` que ya
  existe, si `esteHueso === selected` expandir una `Box3` local con
  `expandByObject(malla)`; después del recorrido, llamar
  `onSelectedBox?.(encontrada ? caja : null)`. → REFACTOR.
- **Satisfies:** «la malla del hueso señalado se ubica … reutilizando ese
  recorrido» (design, aprobado 3).
- **Verify:** la propiedad es que el reporte usa la resolución por mitad ya
  existente, no una nueva — mutación forzada: hacer que `onSelectedBox`
  compare por `malla.name === selected` en vez de por `esteHueso` viola (a)
  y además reintroduce el bug de b2.1 (mallas compartidas entre pares).
  Luego `./scripts/check`.
- **Commit:** `feat(skeleton-scene): report the selected bone's world box per half`

### T2 · `CenteredSkeleton` combina, encuadra, y la cámara pasa a controlada

- **Files:** modify `src/components/SkeletonScene.tsx`,
  `src/components/SkeletonScene.test.tsx`.
- **TDD:** RED — tres afirmaciones de código fuente: (a) `Canvas` ya no
  recibe la prop `camera` (`<Canvas camera={{`, que leía la posición solo
  al montar, desaparece); (b) aparece un `<PerspectiveCamera` controlado,
  mismo componente que `IsolatedBoneScene.tsx` ya usa; (c) `frameObject` se
  importa y se llama con `reservedBottom: zoom?.reservedBottom ?? 0` —así
  el caso sin `zoom` sigue pasando `0`, no un valor inventado. → GREEN —
  `CenteredSkeleton` guarda `cajaOriginal`/`cajaMirrored` en refs (una por
  mitad, pobladas por el `onSelectedBox` de T1), calcula el encuadre en un
  `useLayoutEffect` propio con `frameObject`, y expone un estado `framing`
  que `SkeletonScene` consume en un `<PerspectiveCamera>`
  (`position`/`setViewOffset`, calcado de `CamaraEncuadrada` en
  `IsolatedBoneScene.tsx`). Sin `zoom` o sin caja encontrada, el encuadre
  por defecto es exactamente `distanceToFit(TARGET_HEIGHT, FOV)` con
  `viewOffsetY: 0` — la llamada que ya existía, sin tocar. → REFACTOR.
- **Satisfies:** «con `zoom` presente… la cámara encuadra la caja mundial…
  sin `zoom`… el encuadre es exactamente el de hoy» (design, Must 1-2).
- **Verify:** la propiedad es que la cámara es dinámica y que el caso sin
  zoom no cambió — mutación forzada: volver a `<Canvas camera={{...}}>`
  estático debe hacer que (a) y (b) fallen; llamar `frameObject` con
  `reservedBottom` sin el `?? 0` (undefined cuando no hay `zoom`) violaría
  (c) y produciría un encuadre roto para `ExploreView`. Luego
  `./scripts/check`.
- **Commit:** `feat(skeleton-scene): frame the selected bone's zone via a controlled camera`

### T3 · `SkeletonTestView` conecta `reservedBottom` al zoom

- **Files:** modify `src/features/test/SkeletonTestView.tsx`,
  `src/features/test/SkeletonTestView.test.tsx`.
- **TDD:** RED — el doble de `SkeletonScene` captura el prop `zoom`
  completo (no solo `reservedBottom`, para poder afirmar que **existe**
  como objeto y no como `undefined`) y lo expone en un `data-zoom`
  serializado; un test nuevo afirma que no es `undefined` — mismo patrón
  fallido-y-corregido que e9.2 T3: una aserción tipo `!== ''` sobre el
  `dataset` pasaría con cualquier valor, así que se afirma sobre el
  **objeto** capturado por el mock (`expect(capturado.zoom).toBeDefined()`
  vía una variable module-level que el mock escribe, no vía atributo de
  texto). → GREEN — `renderScene={(boneId, reservedBottom) =>
  <SkeletonScene ... zoom={{ reservedBottom }} />}`. → REFACTOR.
- **Satisfies:** «`reservedBottom` de e9.2 … se conecta» (design, Must 5).
- **Verify:** la propiedad es que `zoom` llega con un `reservedBottom`
  numérico, no que su valor sea distinto de cero (jsdom no lo mide) —
  mutación forzada: no pasar `zoom` en absoluto deja `capturado.zoom`
  `undefined` y pone el test en rojo. Luego `./scripts/check`.
- **Commit:** `feat(skeleton-test-view): pass the answer bar's reserved height into the zoom`

### T4 · Verificación manual de integración

- Con la aplicación corriendo, en el teléfono: entrar al modo test de
  esqueleto completo, responder varias preguntas seguidas y confirmar que
  cada una encuadra la zona señalada —no el esqueleto entero— sin que la
  zona quede detrás de la barra de respuesta. Repetir con un hueso de
  malla compartida entre lados (una clavícula, verificable indirectamente:
  el modo test no revela cuál es antes de responder, así que alcanza con
  observar que **algún** intento cae en la zona del hombro y encuadra
  bien). Confirmar que `ExploreView` no cambió: seleccionar un hueso ahí
  sigue mostrando el esqueleto completo.
- **Verify:** el encuadre se siente distinto en Test y en Explorar; ninguna
  zona señalada queda oculta tras la barra; el salto entre preguntas no
  está animado, es instantáneo (por diseño).

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T2 depende de T1 (necesita el
  reporte de caja para combinar). T3 depende de T2 (necesita el prop
  `zoom` para pasarlo). Estrictamente secuencial, sin paralelismo posible.
- **Dependencies:** ninguna con historias fuera de esta — `frameObject` y
  `distanceToFit` (e9.3) y `reservedBottom` desde `renderScene` (e9.2) ya
  existen y no se modifican.
- **Risks:**
  - **T2 es la única tarea con lógica genuinamente nueva y sin test que la
    ejecute de verdad** — jsdom no renderiza WebGL, así que ningún test de
    esta historia prueba que el encuadre calculado sea el correcto en
    pantalla. Toda la confianza real descansa en T4, igual que ya ocurrió
    en e9.1 y e9.3 con el mismo tipo de cambio.
  - **El orden de efectos entre `SkeletonHalf` (hijo, dos instancias) y
    `CenteredSkeleton` (padre) es crítico y no lo prueba ningún test
    automático** — `useLayoutEffect` de los hijos corre antes que el del
    padre en el mismo commit, que es lo que permite leer los refs ya
    escritos; si algún cambio futuro moviera esta lógica a `useEffect`
    (asíncrono, sin ese orden garantizado), el combinador leería refs
    viejos sin que ningún test lo notara. Documentado en el código, no
    solo acá.
  - **Ningún fixture de malla compartida se puede verificar por selección
    manual** — a diferencia de `abrirFicha`, el modo test no deja elegir
    qué hueso sale. T4 se conforma con observar el caso si aparece, en vez
    de forzarlo; es la misma limitación que el e2e de e9.2 ya documentó y
    aceptó para el mismo modo test.
