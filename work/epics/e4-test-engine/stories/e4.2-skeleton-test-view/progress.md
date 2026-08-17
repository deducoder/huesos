# Story e4.2: Modo test sobre el esqueleto completo — Progress

## T1 · `TestQuestion`: el flujo pregunta → respuesta → siguiente

`renderScene: (boneId: string) => ReactNode` como única forma de mostrar la
escena — nunca el `Bone` completo, así que revelar el nombre por accidente
es un error de tipos. Estado propio (`bone`, `respuesta`, `resultado`)
sobre `pickTestableBone`/`isCorrectAnswer` de e4.1. 5 tests, incluido
`must-data-003` recorriendo el catálogo completo (206 huesos × 3 formas)
contra el DOM renderizado, y "Siguiente pregunta" corrido 50 veces sin
repetir. Gate: verde. Ninguna desviación del plan.

## T2 · `SkeletonTestView`: compone `TestQuestion` + `SkeletonScene`

Composición directa, `SkeletonScene` sustituida por doble en el test (WebGL
no existe en jsdom). Confirmado que ni `BoneNavigator` ni `BoneIdentity`
están presentes. Gate: verde. Ninguna desviación.

## T3 · Prueba manual de integración

Montaje temporal en `App.tsx`, `vite build` + `vite preview`, Playwright
real: un hueso resaltado (costillas, en la captura), sin ningún nombre
visible en pantalla ni en el `textContent` completo del documento;
responder mal muestra "Incorrecto" en texto; "Siguiente pregunta" avanza.

**Desviación real, no anticipada por el plan:** la verificación encontró
que `SkeletonScene` trae un texto fijo para lectores de pantalla ("usá la
lista de huesos por región") que **no aplica en modo test** — esa lista no
existe en esta vista, y decírselo a un usuario de lector de pantalla es
información falsa, no solo incompleta. Se arregló en el momento (`fix`, no
se aplazó): `accessibleHint` pasó a ser una prop opcional de
`SkeletonScene`, con el texto de `ExploreView` como valor por defecto
(retrocompatible, cero cambio para `ExploreView`) y un mensaje propio desde
`SkeletonTestView`. Commit `671fd72`, `git status --short` limpio tras
restaurar `App.tsx` al estado real de e3.3 (el montaje temporal, retirado
antes del commit).

## Finalize

- Full gate set: verde (`./scripts/check`, 131 tests, lint, format, types).
- Orphaned-test check: `accessibleHint` es opcional con valor por defecto —
  `ExploreView` (único consumidor previo de `SkeletonScene`) no cambia de
  comportamiento ni necesita actualizarse. `IsolatedBoneScene.tsx` solo
  *menciona* `SkeletonScene` en comentarios, no la importa.
- Acceptance criteria: cumplidos de punta a punta — los cuatro escenarios
  Gherkin del scope, verificados por test (T1, T2) e inspección visual real
  (T3), más la corrección de accesibilidad que la propia verificación
  encontró.
