# Story e8.2: Fichas accordion — Retrospective

Estimated: M (3-5 tareas) · Actual: M (4 tareas, sin agregados)

## Summary

Fichas pasó de una lista plana de 10 regiones a categoría → subgrupo →
grilla de etiquetas. `groupByCategory` (nuevo, `src/components/`, no
`src/domain/`) agrupa por el prefijo de `REGION_LABEL`; `FichasAccordion`
reutiliza `toNavigatorRows` para el mismo criterio de pares que e7.4/e7.5
ya resolvieron. `BoneNavigator.tsx` no cambió ni una línea (confirmado
con `git diff`). 266 tests en el gate rápido, 21/21 en la suite de
integración completa, incluido `explore.spec.ts` intacto.

## What went well

- **La corrección de capa (`categories.ts` en `src/components/`, no
  `src/domain/`) se hizo en `story-design`, antes de escribir una sola
  línea de implementación.** El `design.md` de la épica había asumido la
  ubicación equivocada; releer `labels.ts`/`regions.ts` con el límite
  dominio/vista ya declarado en el propio comentario del archivo evitó
  escribir el código en el lugar equivocado y tener que moverlo después.
- **Aplicar el aprendizaje de `e8.4` de verdad, no solo citarlo.** El
  grep de `e2e/` se hizo en `story-plan`, antes de tocar código — los 3
  puntos de fallout ya estaban nombrados en el plan cuando llegó T3, no
  se descubrieron a mitad de la tarea como pasó la vez anterior.
- **Aun con el grep hecho de antemano, apareció un hallazgo que el grep
  no podía prever**: el test del nombre largo buscaba el nombre *sin*
  lado porque así lo mostraba `BoneNavigator`; `FichasAccordion` concatena
  el lado al nombre en cada etiqueta (mismo patrón de "el `es` no lleva
  el lado" que ya está en memoria desde e8.3, aplicado ahora del otro
  lado — no como bug, como cambio de qué texto exacto queda en el DOM).
  Un grep encuentra "qué se rompe", no "por qué se rompe distinto de lo
  esperado" — eso solo lo encuentra correr la prueba.
- **Retirar el guardia de regresión de `scrollHeight` en vez de forzarlo
  a pasar con un valor artificial.** Con categorías colapsadas, cualquier
  cifra pasaría trivialmente — mantenerlo habría sido un test verde que
  no protege nada, la clase de cosa que "una comprobación necesita
  comprobar que miró" ya advierte.

## What to improve

- **T2 se escribió sin una confirmación de RED intermedia** (tests +
  implementación completa en el mismo paso, verificado después con
  mutación forzada) — es la segunda vez en la épica que pasa (la primera,
  e8.4 T2, fue una consecuencia inevitable del componente; acá fue
  simplemente el orden en que escribí). Vale la pena, para una historia
  de UI nueva y no trivial como esta, escribir el primer test, confirmar
  que falla, y recién ahí escribir el resto — no por dogma, sino porque
  un RED real es más barato que reconstruirlo con mutaciones después.
- **El cálculo de categorías y filas no está memoizado** — barato hoy
  (206 huesos), pero es la clase de detalle que conviene decidir a
  propósito (`useMemo` sí/no) en vez de dejarlo implícito. Aparcado desde
  `architecture-review`, no bloqueó el cierre.

## Learned

1. **Sobre el sistema:** el límite dominio/vista de este proyecto
   (`labels.ts`: "el dominio guarda claves estables, la vista las
   traduce") no es solo un comentario — tiene consecuencias reales sobre
   dónde vive código nuevo. Cualquier función que derive algo de un
   `Record<Region, string>` en español pertenece a `src/components/`,
   nunca a `src/domain/`, sin importar cuán "de dominio" se sienta la
   operación (agrupar, categorizar).
2. **Sobre el proceso:** un grep hecho por adelantado (aprendizaje de
   e8.4) reduce el radio de sorpresa pero no lo elimina — encuentra
   *dónde* mirar, no necesariamente *qué* va a estar distinto ahí. Las
   dos cosas juntas (grep temprano + correr la suite real) son las que
   cierran el hallazgo, no una sola.
3. **Capability gained:** reutilizar `toNavigatorRows` fuera del
   componente que lo creó (`BoneNavigator`) sin tocar ese componente —
   duplicando solo el helper de 3 líneas que haría falta exportar —
   confirma que la función de dominio (no el componente) era la pieza
   reutilizable desde el principio, tal como e7.4 la diseñó.
