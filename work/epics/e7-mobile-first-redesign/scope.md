# Epic E7: Mobile-first redesign — Scope

## Objective

Que un estudiante pueda estudiar anatomía desde su teléfono —que es su primer y
muchas veces único punto de contacto— con una interfaz construida desde la
pantalla chica hacia arriba y con una dirección visual propia, en vez de con lo
que sobra de una interfaz de escritorio.

**Value:** hoy la aplicación es inutilizable en un móvil de forma medible: el
lienzo 3D se dibuja a 390×150 px y los 209 botones interactivos están por debajo
del mínimo táctil. Al terminar, el producto es accesible en el dispositivo desde
el que va a llegar la mayoría, tiene un único sistema de tokens donde antes
había colores repetidos a mano, y `should-perf-007` deja de ser un guardrail
que nadie midió.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e7.1 | Tokens y shell | M | `@theme` con la paleta clara, borde, sombra dura, radios y mínimo táctil; header y pestañas rediseñados; `dvh` en lugar de `100vh`. La primera prueba de la dirección sobre la pieza más simple. |
| e7.2 | El lienzo en pantalla chica | M | Que el `<canvas>` deje de medir su altura intrínseca y ocupe una porción útil; decidir cómo se lee el esqueleto beige sobre fondo claro. Es la métrica de arranque de la épica. |
| e7.3 | Tipografía empaquetada | S | Elegir una display libre, revisar licencia, subsetear a latín y servirla del propio bundle. ADR con la elegida y las descartadas. |
| e7.4 | Navegador de huesos en móvil | L | Los 206 en una pantalla de 390 px, con objetivos de 44 px y sin que el tratamiento de tarjeta se vuelva ruido. Decisión de arquitectura de información con ADR. |
| e7.5 | Panel de identidad | S | `BoneIdentity` con los tokens nuevos. Se usa en dos vistas, así que una historia cubre ambas. |
| e7.6 | Vista Explorar en móvil | M | Cómo conviven lienzo, navegador e identidad en 390 px, ahora que las tres piezas existen. |
| e7.7 | Ficha del hueso | S | `BoneDetailView` y su estado de ausencia en el modelo, con los tokens nuevos. |
| e7.8 | Modo test | M | `TestQuestion` —que las dos vistas de test comparten— y la elección de variante. El campo de respuesta y su botón, hoy en una fila, no caben cómodos en 390 px. |
| e7.9 | Escritorio como ampliación | M | Los breakpoints hacia arriba desde el móvil, siguiendo la referencia de escritorio. Hoy hay exactamente dos `md:` en toda la aplicación. |
| e7.10 | Medir `should-perf-007` | S | La respuesta a la selección en un móvil de gama media, que el guardrail exige desde E2 y nadie comprobó. Cierra el hallazgo del parking lot. |

## In scope

- **MUST:** un único sistema de tokens en `@theme`; las seis vistas bajo la
  dirección de ADR-007; el lienzo utilizable en 390×844; todo objetivo
  interactivo a 44×44 px o más; tipografía servida del propio bundle;
  `should-perf-007` medido.
- **SHOULD:** que el escritorio gane con el rediseño y no solo lo sobreviva;
  que el navegador de 206 huesos sea más rápido de recorrer que hoy, no solo
  más bonito.

## Out of scope

- **Búsqueda y filtros en el navegador de huesos** — el problema de los 206 se
  resuelve con la jerarquía que ya existe (10 regiones), no con una función
  nueva. **Not now**: candidata a épica propia si recorrer por región resulta
  insuficiente con la aplicación en la mano. Al parking lot.
- **Animación y micro-interacción** — el brief la nombra como rabbit hole. Una
  transición sobre un canvas WebGL cuesta en el mismo móvil que
  `should-perf-007` vigila. **Not now**: se reconsidera cuando exista la
  medición que hoy no hay, que es justamente lo que e7.10 produce.
- **Modo oscuro** — ADR-007 lo rechaza para esta épica y explica por qué
  abarata hacerlo después: los tokens serán la única fuente. **Not now**.
- **Mostrar el progreso al estudiante** — sigue aparcada desde E5, y el
  rediseño no la vuelve más urgente. **Not now**.
- **Reemplazar el modelo de vistas por un router** — es un no-go del brief y
  ADR-003 sigue vigente.

## Done when

- En 390×844 medido con la suite de navegador: el lienzo ocupa una porción útil
  de la pantalla —no los 150 px de hoy— y **ningún** objetivo interactivo queda
  por debajo de 44×44 px, contra los 209 de 209 de hoy.
- `src/index.css` declara los tokens en `@theme` y **ningún componente escribe
  un color a mano** — verificable con una búsqueda de utilidades de color
  literales en `src/components` y `src/features`.
- Ninguna petición de red en tiempo de ejecución: la prueba de navegador que
  vigila `must-privacy-006` sigue verde con la tipografía ya empaquetada.
- Los tests de accesibilidad existentes siguen verdes **sin reescribirse**:
  consultan roles y nombres accesibles, así que su verde es la prueba de que el
  rediseño no degradó `must-a11y-005`.
- `should-perf-007` tiene una medición registrada, o queda marcado
  explícitamente como no verificado con la razón.
- Todas las historias completas · documentación actualizada · retrospectiva
  hecha.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| El esqueleto beige se pierde sobre fondo claro y hay que tocar el material del activo, que es un no-go | M | H | e7.2 decide con la escena delante y prueba primero la salida reversible —lienzo sobre superficie oscura con borde— antes de considerar cualquier cosa que toque el activo |
| El tratamiento de tarjeta convierte los 206 huesos en ruido ilegible | H | M | e7.4 es L a propósito y lleva ADR; las 10 regiones ya existen en el dominio (`groupByRegion`) y son la jerarquía sobre la que apoyarse |
| La display empaquetada empeora el arranque en el móvil de gama media que la épica quiere servir | M | M | subsetear a latín, `woff2`, `font-display: swap`, y e7.10 mide después; si el coste no compensa, la salida es system-ui y está a un token de distancia |
| Ninguna prueba automática cubre "se usa bien con el pulgar": la emulación no es una mano | H | M | verificación humana en dispositivo real por historia, igual que en b2.3, donde el usuario encontró lo que dos gates verdes no vieron |
