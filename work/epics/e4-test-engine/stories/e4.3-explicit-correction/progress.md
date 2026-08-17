# Story e4.3: Corrección explícita del error — Progress

## T1 · `TestQuestion` muestra ambas nomenclaturas al responder mal

En la rama `resultado === 'incorrecto'`, se agregó `{bone.es} / {bone.la}`
junto al texto "Incorrecto"; la rama "correcto" no cambió. 3 tests nuevos
(nomenclaturas al fallar, ausencia al acertar, el hueso sigue siendo el
mismo tras responder). Gate: verde (134 tests). Ninguna desviación del
plan.

## T2 · Prueba manual de integración

Montaje temporal en `App.tsx`, `vite build` + `vite preview`, Playwright
real: responder mal mostró "segunda cuña / os cuneiforme intermedium" y
después "falange distal del primer dedo de la mano / phalanx distalis
digiti I manus" — ambas nomenclaturas correctas en texto.

**Investigación que no encontró bug real:** a primera vista, el área
resaltada en la escena parecía ser siempre las costillas, sin relación con
el hueso diminuto (cuña, falange) que el texto nombraba — sospecha de
resaltado desincronizado del hueso real. Se verificó forzando
`Math.random = () => 0` para fijar la pregunta en "hueso frontal" (grande,
visible): el resaltado apareció exactamente sobre el cráneo, coincidiendo
con el texto. Conclusión: lo que parecía "costillas resaltadas" era
sombreado normal de la luz direccional, no el color de resaltado —
falsa alarma de la propia inspección visual a simple vista, no un defecto
de código. Huesos diminutos son genuinamente difíciles de distinguir
resaltados en la vista de cuerpo completo — límite inherente de `RF-04`,
no algo que corregir acá (`RF-05`/e4.4 lo resuelve por diseño, aislando el
hueso).

## Finalize

- Full gate set: verde (`./scripts/check`, 134 tests, lint, format, types).
- Orphaned-test check: `TestQuestion.test.tsx` es el único test que importa
  `TestQuestion`, y se actualizó dentro de T1 — nada huérfano.
  `SkeletonTestView.test.tsx` no cambió (no toca la corrección, solo la
  compone) y sigue en verde sin modificaciones.
- Acceptance criteria: cumplidos de punta a punta — los tres escenarios
  Gherkin del scope, verificados por test (T1) e inspección visual real
  (T2), con una investigación honesta de un falso positivo antes de darlo
  por bueno.
