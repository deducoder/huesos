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
