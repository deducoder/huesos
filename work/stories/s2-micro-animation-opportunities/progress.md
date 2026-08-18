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
