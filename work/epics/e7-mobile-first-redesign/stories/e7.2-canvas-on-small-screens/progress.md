# Story e7.2: El lienzo en pantalla chica — Progress

## T1 · El lienzo ocupa una porción útil en la vista Explorar

- **RED:** `e2e/mobile-shell.spec.ts` en 390×844 —
  `alto del lienzo: Expected > 253.2, Received 150`.
- **GREEN:** `ExploreView` reparte el alto en móvil con
  `grid-rows-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]`, anulado con
  `md:grid-rows-none`. Ni una línea de `SkeletonScene`: su `h-full w-full` ya
  era correcto y el defecto estaba en el padre, como preveía el design.
- **Gates:** `./scripts/check` verde (206 tests) y la suite de navegador
  **entera** verde (6/6), que es lo que la retrospectiva de e7.1 pedía correr en
  cada tarea de esta historia y no al final.

**Lo que el plan no anticipó:**

- **El primer GREEN falló por una carrera, no por el CSS.** Con el arreglo ya
  puesto, el test seguía midiendo 150: medía en cuanto aparecía la lista de
  huesos —que se pinta del catálogo al instante— mientras react-three-fiber
  todavía no había ajustado el `<canvas>` al contenedor. Es exactamente la
  carrera que `explore.spec.ts` documenta desde b2.1 y que el aprendizaje
  `measure-the-element-after-layout` registra. Arreglado reutilizando su patrón:
  `expect.poll` sobre `boundingBox()`.
- **El verde se verificó contra un no-op.** Cambiar el test y el código a la vez
  deja la duda de cuál produjo el verde, así que se revirtió el `grid-rows`
  dejando el poll puesto: el test volvió a rojo con `Received: 150` tras 15
  segundos de espera. El verde viene del CSS, no de esperar más
  (`a-reintroduced-defect-must-actually-break`).
