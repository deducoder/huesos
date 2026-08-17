# Story e7.2: El lienzo en pantalla chica — Scope

## User story

As a estudiante que abre la aplicación en su teléfono para mirar el esqueleto,
I want ver el modelo 3D a un tamaño en el que se distingan los huesos, sin
tener que desplazar media pantalla para encontrarlo,
so that pueda girarlo y tocar el hueso que busco, que es la razón por la que la
aplicación tiene un modelo 3D.

## Acceptance criteria

```gherkin
Given la aplicación abierta en un viewport de 390x844
When se mide el lienzo del esqueleto
Then su alto es una porción útil de la pantalla, no los 150 px intrínsecos de
     un `<canvas>` sin dimensionar

Given ese mismo viewport
When se carga la vista Explorar sin desplazar nada
Then el lienzo está visible en la primera pantalla, no por debajo del pliegue

Given el esqueleto sobre el fondo claro del rediseño
When se mira el modelo cargado
Then se distingue de su fondo — el hueso no se pierde sobre la superficie clara

Given la ficha completa de un hueso, que monta la escena aislada
When se abre en 390x844
Then su lienzo se dimensiona con el mismo criterio, no con la altura intrínseca

Given el escritorio en 1400x900
When se mira la vista Explorar
Then el lienzo no empeora respecto de hoy
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Viewport 390×844, vista Explorar | medir el lienzo | hoy: `390×150`, empezando en `y=574` · después: alto que ocupe una porción útil, visible sin desplazar |
| Viewport 390×844 | mirar el esqueleto | hoy: se dibuja a ~60 px de ancho dentro de una franja de 150 px |
| Viewport 390×844, ficha de `femur-right` | medir su lienzo | mismo criterio de dimensionado que el grande |

## In scope

- **Que el contenedor del lienzo tenga altura propia** en pantalla chica. La
  causa está medida: `grid-cols-1` apila las tres zonas y nadie le da altura al
  `<div>` que envuelve la escena, así que el `h-full` de `SkeletonScene`
  resuelve contra un contenedor de altura automática.
- **Que el lienzo entre en la primera pantalla.** Hoy empieza en `y=574` de 844
  porque el navegador de 206 huesos va antes y se lleva el alto. Se acota lo
  mínimo para que el lienzo sea visible al cargar — **un reparto provisional,
  no el layout definitivo**.
- **Decidir cómo se lee el esqueleto sobre el fondo claro.** Medido al arrancar:
  se distingue, con contraste bajo. La salida reversible que el brief prefiere
  —superficie propia para el lienzo, con borde— se prueba antes que cualquier
  cosa que toque el activo.
- **`IsolatedBoneScene` recibe el mismo criterio de dimensionado**, porque su
  lienzo tiene el mismo defecto por la misma causa.

## Out of scope

- **El layout definitivo de la vista Explorar en móvil** — cómo conviven
  lienzo, navegador e identidad en 390 px es **e7.6**, y necesita que las tres
  piezas estén rediseñadas. Acá el reparto vertical es el mínimo que hace
  visible el lienzo, y e7.6 puede cambiarlo entero.
- **La forma del navegador de 206 huesos** — es **e7.4**, con ADR propio. Si
  acá se acota su alto, es como contenedor, sin tocar cómo presenta la lista.
- **Tocar el material o la geometría del activo** — no-go del brief. Si el
  contraste no alcanzara con la superficie del lienzo, es un hallazgo para el
  parking lot, no un cambio en `skeleton.glb`.
- **Los breakpoints hacia escritorio** — es **e7.9**. Acá el escritorio solo
  tiene que no empeorar.
- **Medir el rendimiento de la escena** — es **e7.10**, y necesita el producto
  terminado.

## Done when

- En 390×844, medido por la suite de navegador: el lienzo ocupa una porción
  útil del alto del viewport, contra el 17.8% de hoy, y su borde superior está
  dentro de la primera pantalla.
- El lienzo de la ficha completa se dimensiona con el mismo criterio.
- El esqueleto se distingue de su fondo en el tema claro, verificado a ojo
  sobre la aplicación corriendo.
- En 1400×900 el lienzo no es más chico que hoy.
- Los tests existentes siguen verdes **sin reescribirse**, incluida la suite de
  navegador que mide el resaltado por mitades en píxeles.
- `./scripts/check` en verde.

## Notes

- Medido el 2026-08-17 con una sonda de Playwright en 390×844, sobre `main` con
  e7.1 ya integrada: `canvas` de `390×150` en `y=574`; el `<div>` que lo
  envuelve mide también 150 px de alto, que es el intrínseco del elemento.
- El riesgo más caro declarado en la épica —«el esqueleto beige se pierde sobre
  fondo claro y hay que tocar el material del activo, que es un no-go»— quedó
  **descargado antes de empezar**: la captura del lienzo muestra el esqueleto
  legible sobre blanco. Queda trabajo de contraste, no un replanteo de la
  dirección visual.
- `SkeletonScene` normaliza el modelo a `TARGET_HEIGHT` y deja la cámara como
  constante, a propósito (b2.2): `<Canvas camera={...}>` solo lee esos valores
  al montar. Cualquier cambio de encuadre acá debe respetar esa decisión, o
  aparentará ajustarse sin hacerlo.
- Referencias: `records/decisions/adr-007-visual-direction-and-tokens.md`,
  el `design.md` de la épica (Gemba findings: «Solo dos breakpoints en toda la
  aplicación… la causa medida del canvas de 150 px»), y la retrospectiva de
  e7.1, que deja dos frases para el plan de esta historia.
