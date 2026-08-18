# Story e9.4: The skeleton test zooms to what it asks — Progress

## T1 · `SkeletonHalf` reporta la caja del hueso seleccionado

**Done.** El `traverse` que ya calculaba `esteHueso` para el resaltado de
color ahora también expande una `Box3` cuando `resaltado` es verdadero, y
reporta el resultado por `onSelectedBox` tras el recorrido completo —
`null` si esta mitad no tiene la malla.

- **RED:** 1 en rojo — la aserción de que no compara por
  `malla.name === selected` pasaba (nunca lo hizo), la de `onSelectedBox?.(`
  fallaba porque el código no existía.
- **GREEN:** se reutiliza `esteHueso`/`resaltado`, ya calculados; no hay una
  segunda comparación. `copia.updateMatrixWorld(true)` antes de expandir la
  caja — mismo motivo que `IsolatedGroup` ya documenta: `expandByObject` lee
  `matrixWorld`, y react-three-fiber la recalcula en su propio ciclo, no
  necesariamente antes de que este efecto corra.
- **Mutación forzada:** cambiar el reporte a comparar por
  `malla.name === selected` puso en rojo **dos** pruebas, no una — también
  la que ya vigilaba el resaltado de color, porque la reescritura tocó la
  misma línea que ese guardia protege. Confirma que las dos protecciones
  siguen atadas al mismo mecanismo, como el diseño pretendía.
- **Gate:** `./scripts/check` verde — 322 tests.

## T2 · `CenteredSkeleton` combina, encuadra, y la cámara pasa a controlada

**Done.** `Canvas` deja de recibir `camera` como prop estática; una
`<PerspectiveCamera>` propia (`CamaraDelEsqueleto`, calcada de
`CamaraEncuadrada` en `IsolatedBoneScene.tsx`) reacciona a un estado
`framing` que `CenteredSkeleton` calcula combinando las dos cajas que T1
reporta. Sin `zoom` o sin caja encontrada, el encuadre es
`encuadrePorDefecto()` — la misma llamada a `distanceToFit(TARGET_HEIGHT,
FOV)` que existía, ahora nombrada.

- **RED:** 2 en rojo — la ausencia de `<PerspectiveCamera` (y la presencia
  de `<Canvas camera={{`), y la ausencia de `frameObject`/`?? 0`.
- **GREEN:** los refs `cajaOriginal`/`cajaMirrored` se combinan en un
  `useLayoutEffect` del padre que corre después de los de las dos mitades
  hijas, en el mismo commit — la propiedad de orden que el plan marcaba
  como riesgo sin test posible.
- **Un ajuste no anticipado por el plan: `OrbitControls` también necesita
  seguir `framing.center`.** Sin esto, la cámara quedaría posicionada sobre
  la zona señalada pero mirando hacia el origen del esqueleto —el mismo
  error que `IsolatedBoneScene` corrigió con `setViewOffset` en vez de
  mover la cámara, pero del lado del `target` de los controles, no de la
  proyección. Se agregó `target={[framing.center.x, framing.center.y,
  framing.center.z]}`, reemplazando el `[0, 0, 0]` fijo.
- **Fricción con el linter, no con el diseño.** `useExhaustiveDependencies`
  marcaba `selected` como dependencia innecesaria del efecto combinador,
  porque no se lee dentro del cuerpo —solo las refs que dos efectos hijos
  ya escribieron—. Es exactamente el caso que el comentario de la regla
  advierte («mutar una ref no dispara este efecto»): `selected` sigue
  siendo la señal correcta para recalcular, así que se documentó con
  `biome-ignore` en vez de quitarlo. Biome exige el comentario de
  supresión en una sola línea, pegado al nodo — el primer intento con la
  explicación repartida en varias líneas no lo reconoció.
- **Tres mutaciones forzadas, las tres confirmadas:** volver a `Canvas
  camera={{...}}` estático rompe la propiedad (a); quitar `?? 0` de
  `reservedBottom` rompe (c) — dejaría `ExploreView` con un
  `reservedBottom` `undefined` si algún día pasa `selected` sin `zoom`.
- **Gate:** `./scripts/check` verde — 324 tests.
