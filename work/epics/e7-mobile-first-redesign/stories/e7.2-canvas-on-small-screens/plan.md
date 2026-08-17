# Story e7.2: El lienzo en pantalla chica — Plan

> Size: M

Las dos frases que la retrospectiva de e7.1 dejó para este plan, aplicadas:

1. **El gate es la tarea uno.** Esta historia enuncia un contrato negativo —«el
   lienzo nunca se dibuja a su altura intrínseca»— así que la medición se
   escribe primero y su rojo es el inventario. En e7.1 el gate llegó tercero y
   encontró un 30% más de infracciones que el mejor conteo a mano.
2. **`explore.spec.ts` corre en cada tarea, no al final.** Esta historia toca el
   contenedor del lienzo, que es exactamente lo que esa suite mide en píxeles.
   No es precaución: es el gate de la historia.

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · El lienzo ocupa una porción útil en la vista Explorar

- **Files:** modify `e2e/mobile-shell.spec.ts`,
  `src/features/explore/ExploreView.tsx`.
- **TDD:** RED una prueba en 390×844 que exige `canvas.height > 30%` del
  viewport y su borde superior dentro de la primera pantalla — falla con
  `Received: 150` → GREEN `grid-rows-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]`
  con `md:grid-rows-none` → REFACTOR ninguno previsto.
- **Satisfies:** Must 1, Must 2; los dos primeros criterios Gherkin del scope.
- **Verify:** `./scripts/check`, `npx playwright test` **entera** — el cambio
  toca el contenedor que `explore.spec.ts` mide.
- **Commit:** `fix(explore): give the canvas row a height on small screens`

### T2 · La misma causa en la ficha completa

- **Files:** modify `e2e/mobile-shell.spec.ts`,
  `src/features/bone-detail/BoneDetailView.tsx`.
- **TDD:** RED la misma medición sobre la ficha de un hueso con geometría
  (`fémur derecho`), que falla igual → GREEN
  `grid-rows-[minmax(0,3fr)_minmax(0,2fr)]` con `md:grid-rows-none` → REFACTOR
  ninguno.
- **Satisfies:** Must 3; el cuarto criterio Gherkin del scope.
- **Verify:** `./scripts/check`, `npx playwright test` entera.
- **Commit:** `fix(bone-detail): give the canvas row a height on small screens`

### T3 · La superficie que separa el hueso de su fondo

- **Files:** modify `src/index.css`, `src/features/explore/ExploreView.tsx`,
  `src/features/bone-detail/BoneDetailView.tsx`.
- **TDD:** esta tarea **no tiene RED automático y es deliberado**: lo que decide
  es si un beige claro se distingue de un gris cálido, un juicio sobre dos
  superficies que WCAG no arbitra —su fórmula es para texto sobre fondo— y que
  ninguna aserción puede sustituir. Su verificación es una captura del lienzo
  antes y después, comparadas a ojo. El gate anti-literales de e7.1 sigue
  cubriendo lo que sí es automatizable: que el color salga de `@theme`.
- **Satisfies:** Must 5; el tercer criterio Gherkin del scope.
- **Verify:** `./scripts/check` (el gate de tokens vigila que no entre un color
  a mano) más las dos capturas adjuntas al `progress.md`.
- **Commit:** `feat(explore): give the canvas its own surface`

### T4 · Manual integration test

- Con la aplicación corriendo, en 390×844 y en 1400×900: abrir Explorar, girar
  el esqueleto, tocar un hueso en la escena, abrir su ficha completa, volver.
- **Verify:** el esqueleto se ve al cargar sin desplazar y a un tamaño en el
  que se distinguen los huesos; se puede girar con el dedo sin pelearse con el
  scroll de la página; la lista de huesos sigue teniendo su propio scroll y no
  queda cortada; el escritorio no perdió nada. Antes de cerrar,
  `./scripts/check-integration`.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T1 y T2 antes que T3 **por
  dependencia, no por riesgo**: el contraste de la superficie no se puede juzgar
  sobre un lienzo de 150 px. T3 es la tarea con la decisión más difícil de
  deshacer y aun así va tercera, por la misma razón que en e7.1 los tokens
  fueron antes que su consumo.
- **Dependencies:** secuencial. T2 es independiente de T1 en código —son dos
  archivos distintos— pero comparte el archivo de prueba, así que ir en orden
  evita un conflicto tonto.
- **Risks:**
  - *El reparto de filas rompe el scroll del navegador de 206 huesos* →
    `minmax(0,1fr)` es justo lo que permite que la fila baje del alto de su
    contenido; T4 lo comprueba a mano, porque ninguna prueba mira si una lista
    quedó cortada.
  - *Un lienzo 2,4 veces más grande empeora `should-perf-007`* → no se mide acá
    (es e7.10), pero queda escrito en el design que este es el primer
    sospechoso si esa medición sale mal.
  - *La superficie elegida a ojo no convence en un teléfono real* → es
    reversible: un token, un valor. La alternativa que el brief prohíbe —tocar
    el material del activo— no se considera en ningún caso.
  - *Tocar el contenedor del lienzo rompe la medición por mitades de
    `explore.spec.ts`* → la suite entera corre en T1 y T2, no al final.
