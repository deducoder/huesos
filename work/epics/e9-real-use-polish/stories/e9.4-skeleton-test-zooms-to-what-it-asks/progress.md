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
