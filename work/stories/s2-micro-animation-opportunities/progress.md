# Story s2: Micro-animation opportunities — Progress

## T1 · Tokens de motion y regla global de `prefers-reduced-motion`

Agregados `--duration-rapida`/`--duration-base`/`--duration-panel`/
`--ease-salida` a `@theme` en `src/index.css`, más la regla global
`@media (prefers-reduced-motion: reduce)` a cero. `tests/motion-tokens.test.ts`
nuevo, RED confirmado antes del cambio (5/5 fallando), GREEN después.
Desviación del plan: el lint (`lint/complexity/noImportantStyles`) marcó los
dos `!important` de la regla de reduced-motion como advertencia — no
anticipado en el plan. Resuelto con dos comentarios `biome-ignore` puntuales
(uno por propiedad, biome no los agrupa) explicando el motivo, en vez de
quitar el `!important` — quitarlo habría dejado la garantía dependiente del
orden de cascada de Tailwind, que es justo lo que esta regla existe para
evitar. Gate: verde, sin advertencias.

## T2 · Acordeón de fichas: apertura/cierre animados, sin fuga de foco

Reescrito `FichasAccordion.test.tsx:12` (RED confirmado antes del cambio: 3
tests fallando) para afirmar `inert` en vez de ausencia del DOM, más un test
nuevo para la transición de la flecha. `FichasAccordion.tsx`: el contenido de
cada categoría deja de desmontarse condicionalmente, queda siempre montado
dentro de un contenedor `grid-rows-[0fr]/[1fr]` con `inert={!expandida}` y
`data-testid="fichas-contenido-{categoría}"`; la flecha gana
`transition-transform`. Gate: verde, 353/353 (los 9 tests previos del
archivo siguen pasando sin tocarlos, más 1 nuevo). Sin desviaciones del plan.

## T3 · Panel de menú (`AboutPanel`): entrada animada

RED confirmado aislando el cambio del componente con `git stash` (el test
nuevo falló solo, los 11 existentes en verde). GREEN: overlay y diálogo
usan el variante nativo `starting:` de Tailwind 4 (confirmado en
`node_modules/tailwindcss/dist/lib.js` que reconoce `@starting-style`) en
vez de la sintaxis arbitraria `[@starting-style]:` que sugería `design.md`
— mismo resultado, más corta. Solo entrada, tal como decidió el diseño; la
salida sigue instantánea (comentario en el código explica el porqué). Gate:
verde, 354/354. Sin otras desviaciones.

## T4 · Retroalimentación del test: panel de resultado y prensado de opciones

RED confirmado: los 2 tests nuevos fallaron (28/28 con los previos en verde).
GREEN: las opciones ganan `active:scale-[0.97]` con `transition-transform
duration-rapida ease-salida`; el `role="status"` del resultado gana
`transition-opacity duration-base ease-salida starting:opacity-0` en **ambos**
formatos (`open` y `choice` — el plan solo mencionaba uno explícitamente, el
gemba walk de T1-T3 ya había dejado claro que el componente sirve los dos).
Desviación menor: `npm run format` reformateó el `div` de resultado a
multilínea tras el cambio — atrapado por `format:check` en el gate, corregido
antes del commit. Gate: verde, 356/356.

## T5 · Tarjeta de identidad flotante (`ExploreView`): entrada animada

RED confirmado (10/11, el test nuevo falló solo). GREEN: `tarjeta-identidad`
gana `transition-[opacity,transform] duration-panel ease-salida
starting:translate-y-3 starting:opacity-0`, mismo patrón que T3. Solo la
primera aparición anima — cambiar de hueso con la tarjeta ya montada sigue
instantáneo, tal como decidió el diseño (Part 2 del reporte de
oportunidades). Gate: verde, 357/357. Sin desviaciones.

## T6 · Píldora de pestaña activa: transición de color

RED confirmado (21/22, el test nuevo falló solo). GREEN: `transition-colors
duration-base ease-salida` agregado siempre (no condicional) a cada botón de
`Pestanas`, para que ambas direcciones (activar/desactivar) interpolen. Gate:
verde, 358/358. Sin desviaciones. Con esto terminan las 6 tareas de código
del plan — queda T7, la integración manual.

## T7 · Integración manual

`./scripts/check-integration` (32 tests, build de producción + navegador
real) encontró una regresión real de T2: "Hioides" es una categoría de un
solo hueso, y con el contenido siempre montado, el botón de categoría y el
botón del hueso propio ahora comparten el mismo nombre accesible —
`e2e/mobile-shell.spec.ts:429` (`getByRole('button', {name: /^hioides/i})`)
dejó de ser unívoco. Corregido acotando con `expanded: false` (solo el botón
de categoría declara `aria-expanded`) — commit separado
(`fix(e2e): disambiguate hioides category from its own bone button`), no
anticipado en el plan. Suite completa reconfirmada verde después: 32/32,
incluido `should-perf-007` (mediana 4,1 ms, máximo 21,6 ms — comparable a la
línea base de e7.10, sin degradación).

Para lo que ni jsdom ni la suite existente prueban, un script Playwright ad
hoc (no committeado, borrado al terminar) contra el build de producción
confirmó, con Chromium real:
- El acordeón: el contenido colapsado tiene un ancestro `inert` de verdad
  (no solo el atributo reflejado en jsdom); expandir lo quita.
- Las 4 transiciones de entrada/color (acordeón, `AboutPanel`, tarjeta de
  identidad, píldora de pestaña) tienen `transition-duration` real, distinta
  de `0s`, en el navegador.
- Con `prefers-reduced-motion: reduce` emulado, esa misma duración cae a
  `0.01ms` y el acordeón queda expandido a los 50ms de tocarlo (sin
  transición perceptible).
- Capturas de pantalla del acordeón expandido, el panel de menú y la
  tarjeta de identidad con un hueso seleccionado: sin defectos visuales.

## Finalize

- Full gate set: verde — `./scripts/check` (358/358) y
  `./scripts/check-integration` (32/32).
- Orphaned-test check: se encontró y corrigió `e2e/mobile-shell.spec.ts`
  (ver T7). `BoneTestView.test.tsx` y `SkeletonTestView.test.tsx` —envuelven
  `TestQuestion`, no tocados por esta historia— se corrieron aparte: 11/11
  en verde, sin impacto.
- Acceptance criteria: cumplidos de punta a punta — los 6 Must/Should de
  `design.md` verificados arriba; los 3 Must NOT se sostienen (sin librería
  externa, sin animación de la escena 3D, `AboutPanel` sin animar su
  salida, ninguna transición supera 300ms).
