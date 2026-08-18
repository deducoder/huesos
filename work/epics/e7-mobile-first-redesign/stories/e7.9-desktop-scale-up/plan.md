# Story e7.9: Escritorio como ampliación — Plan

Tamaño: S (3 tareas). El diseño ya identificó los tres archivos y el patrón
único a aplicar tres veces; no hace falta más decomposición.

Las tres tareas son de layout puro (Tailwind), invisibles para Testing
Library/jsdom (no computa media queries ni layout real) — el criterio
observable es Playwright contra el build real a 1400×900, siguiendo el mismo
patrón que `explore.spec.ts` ya usa (que corre con el viewport por defecto del
proyecto, 1400×900). Cada tarea es RED (una aserción Playwright que falla
contra el layout actual) → GREEN (las clases `md:` que la satisfacen).

## Task 1 — Explorar: navegador visible + tarjeta acotada (riesgo más alto)

**Por qué primero:** es el único cambio estructural (grid, no solo un
max-width) y el único que toca el mecanismo `sr-only`/ADR-010; si algo se
rompe en la vía de teclado, mejor descubrirlo temprano.

- **Archivos:** `src/features/explore/ExploreView.tsx`,
  `e2e/desktop-scale-up.spec.ts` (nuevo).
- **RED:** en el nuevo spec, a 1400×900: elegir "fémur derecho", medir
  `page.getByRole('navigation', { name: /huesos del esqueleto/i })`
  (`boundingBox()`) — debe tener ancho > 0 y estar dentro del viewport (hoy
  falla: `sr-only` lo deja con tamaño ~1px). Medir
  `[data-testid="tarjeta-identidad"]` — su ancho debe ser menor al 50% del
  ancho del lienzo (hoy falla: ocupa casi todo).
- **GREEN:** aplicar el grid `md:grid-cols-[22rem_1fr]`, sacar `sr-only` en
  `md:` (`sr-only md:not-sr-only`), envolver escena+tarjeta en su propio
  `relative`, acotar la tarjeta (`md:max-w-sm md:inset-x-auto md:left-4
  md:right-auto`).
- **Acceptance:** MUST navegador visible + ancho medible; MUST tarjeta
  acotada (design.md, ejemplo Explorar).
- **Verificación:** `./scripts/check` + `npx playwright test
  e2e/desktop-scale-up.spec.ts e2e/explore.spec.ts e2e/mobile-shell.spec.ts`
  (los dos últimos para confirmar que nada de 390×844 ni la ruta accesible
  existente se rompió).
- **Commit:** `feat(explore): scale up desktop layout with visible navigator`

## Task 2 — Fichas: contenedor acotado

- **Archivos:** `src/App.tsx`, `e2e/desktop-scale-up.spec.ts`.
- **RED:** en el spec, a 1400×900: ir a la pestaña Fichas, ubicar la fila de
  un par conocido (p.ej. "hueso parietal"), medir la distancia horizontal
  entre el `<span>` del nombre y la primera píldora de lado — debe ser menor
  a un umbral concreto (p.ej. 200px). Hoy falla: el vacío mide varios
  cientos de píxeles.
- **GREEN:** `md:mx-auto md:max-w-2xl` en el contenedor de `App.tsx`.
- **Acceptance:** MUST distancia nombre↔píldoras menor que hoy (design.md,
  ejemplo Fichas).
- **Verificación:** `./scripts/check` + el spec nuevo.
- **Commit:** `feat(shell): cap fichas list width on desktop`

## Task 3 — Vistas de test: barra de respuesta acotada

- **Archivos:** `src/features/test/TestQuestion.tsx`, `e2e/desktop-scale-up.spec.ts`.
- **RED:** en el spec, a 1400×900: entrar a "Hueso aislado" (o "Esqueleto
  completo"), medir el ancho del `<form>` de respuesta — debe ser menor a un
  umbral concreto (p.ej. 800px). Hoy falla: mide casi el ancho del viewport.
- **GREEN:** `md:mx-auto md:max-w-3xl` en el `div` raíz de `TestQuestion`.
- **Acceptance:** MUST barra de respuesta acotada en ambas vistas de test
  (design.md, ejemplo Test).
- **Verificación:** `./scripts/check` + el spec nuevo +
  `e2e/mobile-shell.spec.ts` (confirma que la vista de test en 390×844 sigue
  sin desbordar, ya cubierto por una prueba existente).
- **Commit:** `feat(test): cap answer bar width on desktop`

## Manual integration test (final)

Con `npm run build && npm run preview`, abrir `http://localhost:4173` en un
navegador real a ~1400×900 (ventana maximizada en un monitor, o el
`cloudflared` ya usado en historias previas si se verifica desde el celular
en modo escritorio): confirmar a ojo que Explorar muestra la lista al
costado, que Fichas y las vistas de test ya no se ven estiradas de punta a
punta, y que 390×844 (DevTools, modo responsive) se ve exactamente igual que
antes de esta historia.

## Risks

- El grid de Explorar es el único cambio con superficie de riesgo real
  (toca el mismo `div` que ADR-010 fijó como la vía accesible) — mitigado
  corriendo `explore.spec.ts` completo tras la Task 1, no solo el spec nuevo.
- Los umbrales de "distancia" y "ancho máximo" en los RED son elegidos a
  ojo sobre las capturas ya tomadas en el gemba; si el número exacto no
  reproduce el fallo esperado, se ajusta el umbral antes de escribir el
  GREEN — el punto es que el RED falle contra el código de hoy, no que el
  número sea mágico.
