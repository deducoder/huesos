# Session 2026-08-18 — micro-animations (s2)

## Done

- Historia `s2` (micro-animaciones, standalone) completa: start → design →
  plan → implement → review → close, y embarcada a `main`
  (`f2517c7`, empujado a `origin/main`).
- 6 micro-animaciones CSS puras en producción, sobre un vocabulario nuevo de
  tokens en `@theme` (`--duration-*`, `--ease-salida`) y una regla global de
  `prefers-reduced-motion`: acordeón de fichas, panel de menú, tarjeta de
  identidad, retroalimentación del test, píldora de pestaña activa. Sin
  librería nueva, sin tocar la escena 3D.
- Regresión real encontrada y corregida durante la integración: el cambio
  estructural del acordeón (contenido siempre montado, para poder animar)
  rompió un locator de `e2e/mobile-shell.spec.ts` por colisión de nombre
  accesible ("Hioides", categoría de un solo hueso). Corregido, suite
  completa (32/32) reconfirmada verde.
- Desplegado a producción: `npm run build` + `npx wrangler deploy`,
  verificado con `curl` (200 en `bones.deducoder.com`).

## Decided

- **`prefers-reduced-motion` es una regla global a cero, no "más suave"
  por transición** — **por qué:** más simple de afirmar con un solo test, y
  ninguna de las 6 transiciones es tan larga como para que la diferencia se
  note.
- **El resaltado de color del hueso y el encuadre de cámara en las escenas
  3D quedan fuera de esta historia, no dentro** — **por qué:** interpolarlos
  exige un lazo de frames de WebGL y toca directamente el código que
  `should-perf-007` ya mide; el riesgo no se justificaba para el tamaño de
  esta historia. Aparcado como historia/spike futuro, no descartado.
- **La duplicación preexistente de `role="status"` en `TestQuestion.tsx`
  no se arregló acá** — **por qué:** esta historia solo la tocó (agregó la
  misma clase en los dos bloques), no la introdujo; extraerla excede el
  alcance de una historia sobre animaciones. Parqueada en
  `records/parking-lot.md`.

## Open

Ninguna.

## Next

Nada programado — igual que al abrir la sesión: E9 fue la última épica
planificada, s2 fue una historia standalone que la sesión decidió sobre la
marcha, y el deploy ya está en producción con el cambio. Si se retoma,
`session-start` debería confirmar contra el repo si aparece una idea nueva
de alcance o un bug de uso real, en vez de asumir que hay una épica
esperando.

## State

Branch `main` · work item en flight: ninguno · tree: clean
