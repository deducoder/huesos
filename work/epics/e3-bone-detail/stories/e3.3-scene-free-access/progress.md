# Story e3.3: Acceso a la ficha sin el esqueleto completo — Progress

## T1 · `App.tsx`: pestañas, modo "Fichas" y origen de "Volver"

Sin componente nuevo, confirmando el hallazgo de `story-start`:
`BoneNavigator` se reutiliza tal cual (`selected={null}`, `onSelect`
navega en vez de alternar). `Modo` ganó `{ tipo: 'fichas' }` y el campo
`origen` en `{ tipo: 'ficha' }`, para que "Volver" sepa si regresar a la
lista o a `ExploreView`. Pestañas de nivel superior (`Pestanas`), ocultas en
modo `'ficha'`. 5/5 tests en `App.test.tsx` (2 nuevos escenarios + 1
regresión explícita del camino de e3.2, que sigue intacta sin reescribirse).
Gate: verde tras un `biome format --write` (una coma final rompió el
formato, corregida antes de comitear). Ninguna otra desviación del plan.

## T2 · Prueba manual de integración

`vite build` + `vite preview`, Playwright real: desde el arranque, "Fichas"
muestra la lista de 206 huesos sin la escena de `ExploreView`; elegir
"sacro" abre su ficha aislada con "Lateralidad: impar"; "Volver" regresa a
la lista, no a Explorar; y el camino de e3.2 (Explorar → seleccionar fémur
derecho → ficha → Volver) sigue conservando la selección. Los cuatro casos
correctos a simple vista, con capturas. Mismo 404 de consola aislado ya
visto en e3.1 y e3.2, no reproducible.

Una comprobación de red que escribí para T2 estaba mal planteada (pedía
confirmar que el modelo 3D *nunca* se pidiera "antes de tocar Fichas", pero
la app arranca en modo Explorar, que sí monta la escena por defecto —
correcto y esperado, no una regresión). Se descartó esa aserción; lo que
importa —que el modo `'fichas'` en sí no monte la escena— ya estaba
confirmado por el test unitario de T1 y por la captura de pantalla.

## Finalize

- Full gate set: verde (`./scripts/check`, 107 tests, lint, format, types).
- Orphaned-test check: `App.test.tsx` es el único archivo que importa `App`,
  y se actualizó dentro de T1 — nada huérfano.
- Acceptance criteria: cumplidos de punta a punta — los cuatro escenarios
  Gherkin del scope, verificados por test (T1) e inspección visual real
  (T2), incluida la regresión explícita sobre el camino de e3.2.
