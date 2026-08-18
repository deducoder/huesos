# Session 2026-08-18 — Apertura de E9, «atrás» del sistema y encuadre 3D

## Done

- **E9 abierta entera**: brief, scope (7 historias), design, plan y dos ADRs
  nuevos — **ADR-013** (History API sobre el selector de modo, extiende
  ADR-003) y **ADR-014** (nombre corto como derivación de vista, con gate de
  unicidad, y el nombre accesible sin acortar).
- **e9.6 cerrada** — el «atrás» del sistema recorre la aplicación. El
  historial transporta el `Modo`, `popstate` lo restituye validado, y los
  botones que ya significaban «atrás» retroceden en vez de empujar. El campo
  `origen` del modo `ficha` quedó barrido: el historial ya sabe de dónde se
  vino.
- **e9.3 cerrada** — el hueso aislado entra entero, deja aire por los cuatro
  lados y se puede girar. `frameObject` encuadra por ancho, aspecto y la
  franja que la tarjeta tapa; `FixTouchAction` salió a su propio archivo y lo
  comparten las dos escenas.
- **31 commits sin pushear en `main`** — correcto: la integración de E9 es
  una sola, en `epic-close`.
- Gates: `./scripts/check` verde (37 archivos) y `./scripts/check-integration`
  **31 de 31**. `should-perf-007` en mediana 4,0 ms.

## Decided

- **E9 es una épica, no nueve historias standalone** — **por qué:** los nueve
  puntos comparten `@theme` (1 y 2), `IsolatedBoneScene` (3 y 6), `App.tsx`
  (4, 8 y 9) y el catálogo (7, que además afecta al 2). Nueve ramas
  independientes significan nueve integraciones al remoto y tocar los mismos
  archivos varias veces.
- **El «atrás» va por History API, sin router** (ADR-013) — **por qué:**
  ADR-003 rechazó el router porque ningún requisito pide enlaces profundos,
  y eso sigue siendo cierto; lo que ADR-003 no evaluó es que en un teléfono
  «atrás» es el gesto de salida principal. El historial transporta estado, no
  direcciones.
- **El nombre corto no borra el discriminante** (ADR-014) — **por qué:**
  «falange distal del primer dedo de la mano» → «falange distal de la mano»
  colapsa las 28 falanges de la mano en 3 etiquetas, y como `pickDistractors`
  elige de la misma región, el test podría mostrar tres botones idénticos.
  Ordinal en cifra, y el `aria-label` conserva el nombre completo.
- **`frameObject` se apoya en `distanceToFit`, no la sustituye** — **por
  qué:** el scope proponía endurecer la firma «para que el compilador nombre
  a sus dos llamadores», pero uno es `SkeletonScene`, declarado fuera de
  alcance y sin el defecto. Corrección registrada en el design de e9.3.
- **Descentrar la proyección, no mover la cámara** (`setViewOffset`) — **por
  qué:** bajar la cámara y su punto de mira juntos coloca bien el hueso pero
  deja el centro de giro por debajo de él; girar en vertical lo expulsaba del
  encuadre. Lo encontró el usuario en el teléfono, no la suite.
- **Un fixture crítico por defecto, no por historia** — **por qué:** en e9.3
  el encuadre por ancho lo expone la clavícula (el fémur da 0) y el tapado
  por la tarjeta lo expone el fémur (la clavícula da 100 % visible). Un solo
  fixture habría dejado uno de los dos sin cubrir.

## Open

- **Tres hallazgos aparcados esperan su historia**, los tres con destino
  escrito en `records/parking-lot.md`: la concordancia de género del lado
  («clavícula derecho») → **e9.5**; la barra de respuesta del modo test que
  no reserva sitio sobre el lienzo → **e9.2**; y la tipografía display →
  épica de consolidación visual.
- **El entorno cambia.** Esta sesión trabajó contra un `vite` de desarrollo
  en 5173 con un túnel de Cloudflare, que se dejaron vivos a propósito para
  que el usuario probara en su teléfono. En el entorno remoto eso no existe:
  hay que decidir cómo se hace la verificación manual, que en E9 **no es
  opcional** — e9.6 y e9.3 se cerraron gracias a ella, y en e9.3 encontró un
  bug que la suite no podía ver.

## Next

Arrancar **e9.5** (`story-start`), la siguiente del plan: nombres cortos y
capitalización, con ADR-014 ya escrito y el hallazgo de la concordancia de
género incorporado a su alcance.

## State

Branch `main` · work item in flight: none · tree: clean · 31 commits por
delante de `origin/main`, sin pushear a propósito hasta `epic-close` · E9 con
2 de 7 historias cerradas (e9.6, e9.3).
