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

## T2 · La misma causa en la ficha completa — no existía

**La tarea no tenía RED, y eso resultó ser el dato.** El test escrito para
provocarlo pasó a la primera. Medido: el lienzo de la ficha completa mide
**390×521 en 390×844 — el 61.8% del alto, empezando en `y=68`**. No hay defecto
que arreglar ahí, así que no se cambió `BoneDetailView`.

**La causa real no era la que el design escribió.** El design decía «ninguna
fila tiene altura declarada»; la ficha tampoco la declara y funciona igual. Lo
que de verdad ocurre:

- Un grid con `h-full` y filas automáticas **reparte el espacio sobrante** entre
  ellas (`align-content: stretch`, el valor inicial).
- En `BoneDetailView` hay dos zonas y la identidad es corta, así que sobra
  espacio y el lienzo se lo queda.
- En `ExploreView` la fila del navegador reclama el alto de sus 206 huesos, que
  supera al disponible. **No sobra nada que repartir**, y el lienzo cae a los
  150 px intrínsecos del `<canvas>`.

O sea: el defecto no era «el lienzo no tiene altura» sino **«una fila con
contenido enorme absorbe el reparto»**. La distinción importa para e7.6, que va
a rehacer ese mismo layout: quitar el `minmax(0,…)` sin quitar la lista larga
devuelve el defecto.

**El test se conserva pese a no haber estado rojo**, por dos razones: es la
única cobertura del lienzo de la ficha en móvil, y **e7.7 va a rediseñar esa
vista**. Se comprobó que discrimina en vez de pasar siempre — con el umbral
subido al 95% del viewport falla con `Expected > 801.8, Received 521.98`.

- **Gates:** `./scripts/check` verde · suite de navegador entera verde (7/7).

## T3 · La superficie que separa el hueso de su fondo

- **Sin RED automático, como el plan declaraba.** Lo decidieron cinco capturas
  del mismo lienzo con la superficie cambiada en vivo, más tres con el fémur
  derecho ya seleccionado.
- **GREEN:** `--color-lienzo: #4a4640` en `@theme`, consumido por `ExploreView`
  y `BoneDetailView` con `border-tinta border-y-2` en móvil (`md:border-y-0`,
  porque en escritorio los bordes laterales de las columnas vecinas ya
  enmarcan).
- **Gates:** `./scripts/check` verde · suite de navegador entera verde (7/7).

**Lo que decidió la elección, y no fue el gusto:**

| Superficie | Contorno del hueso | Hueso resaltado |
|---|---|---|
| `#ffffff` blanco (la de antes) | se difumina, la pelvis y las costillas pierden borde | visible |
| `#bfb6a4` gris cálido medio | **peor**: mismo tono que el hueso, compite en vez de separar | visible |
| `#8f9bb3` azul grisáceo | bueno | **se funde con el fondo** |
| `#4a4640` gris oscuro cálido | todos los contornos definidos | **salta a la vista** |

El criterio que descartó el azul grisáceo es funcional, no estético: el
resaltado del hueso elegido es `#38bdf8`, un celeste, y sobre cualquier fondo
azulado deja de leerse. El resaltado es **cómo se ve qué hueso elegiste**, así
que un fondo que lo apaga rompe la vista aunque se vea bonito.

**No hace falta tocar el activo, que era el no-go.** La superficie oscura es
exactamente la salida reversible que el brief prefería, y basta: un token, un
valor, y el material del modelo intacto.

**Nota de alcance:** con el reparto 1/2/1 la lista de huesos queda con unos
190 px de alto y su propio scroll. Es usable y es **provisional** — e7.6 decide
el reparto definitivo con las tres piezas ya rediseñadas.

## T4 · El gesto vertical, encontrado en un teléfono real

La verificación manual del usuario produjo una tarea que el plan no tenía.
Reportado: en horizontal el esqueleto gira bien; **al arrastrar en vertical se
selecciona un hueso junto con el desplazamiento de la lista superior.**

- **Reproducción: no se logró en emulación, y eso quedó dicho.** Los eventos
  táctiles sintéticos de Playwright no disputan el scroll como un dedo — el
  propio `explore.spec.ts` ya documenta que alcanzan menos que un gesto real.
  Lo que sí se observó es la causa mecánica: **el `<canvas>` tenía
  `touch-action: auto`**, así que el navegador reclamaba el arrastre vertical
  para hacer scroll, la rotación no llegaba a OrbitControls, y el gesto
  cancelado terminaba disparando un tap. En horizontal no ocurría porque ahí no
  hay scroll que disputar.
- **GREEN:** `@layer base { canvas { touch-action: none } }` en `src/index.css`.
  En esta aplicación todo `<canvas>` es una escena 3D, así que la regla es
  exacta, no una red amplia.
- **Gates:** `./scripts/check` verde · suite de navegador entera verde (7/7).

**Dos errores propios que conviene dejar escritos:**

- **Medí tres veces contra un build viejo.** El `vite preview` levantado a mano
  para exponer la aplicación por túnel se quedó ocupando el puerto 4173, y
  `playwright.config.ts` trae `reuseExistingServer: !process.env.CI`: la suite
  reutilizó ese servidor en vez de construir, así que mis sondas midieron el
  `dist` de antes del arreglo. Concluí «la regla CSS no se aplica» cuando la
  regla ni siquiera estaba en el bundle que se estaba sirviendo. **Se descubrió
  al buscar la regla en `dist/assets/*.css` y encontrarla ahí**, contradiciendo
  lo que el navegador decía.
- **Afirmé sin evidencia válida que `<Canvas className>` no llega al canvas.**
  Era cierto, pero lo había «comprobado» contra ese mismo build viejo. Se
  reprobó en limpio —quitando la regla CSS, poniendo la clase, reconstruyendo—
  y el canvas sigue con `class=""` y `touch-action: auto`. La conclusión se
  sostiene; la primera evidencia no valía.
