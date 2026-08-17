# Story e3.2: Ficha completa desde la selección de E2 — Retrospective

Estimated: S (2-3 tareas) · Actual: 3 tareas, sin desviación de tamaño

## Summary

Desde cualquier hueso seleccionado en `ExploreView`, "Ver ficha completa"
abre `BoneDetailView` — el hueso aislado (e3.1) junto a su identidad
completa, con "impar" dicho explícitamente para huesos sin lado. "Volver"
regresa sin perder la selección. Sin router (ADR-003): un estado de modo en
`App.tsx`.

## What went well

- El plan anticipó correctamente qué era testeable en jsdom y qué no: T1 y
  T3 se probaron de punta a punta con DOM real; T2 mockeó `IsolatedBoneScene`
  con el mismo patrón que `ExploreView.test.tsx` ya usaba para `SkeletonScene`
  — la convención de e2 se aplicó sin inventar una nueva.
- La verificación manual (T4) encontró exactamente lo esperado en los cuatro
  casos, sin iterar — la segunda vez seguida que pasa así en esta épica
  (e3.1 también). El patrón de verificar con capturas Playwright reales
  contra `vite preview`, no contra el servidor de desarrollo, sigue pagando.

## What to improve

- El plan **no anticipó** que elevar el estado de selección de `ExploreView`
  a `App` sería necesario — lo asumió implícitamente como "ExploreView sigue
  dueña de su estado". Se descubrió recién al escribir el test de T3
  ("Volver" con la selección intacta), no al planificar. Para la próxima
  historia que cambia "quién es dueño de un estado ya existente", vale la
  pena preguntarlo explícitamente en el plan, no solo en el código: ¿qué
  pasa con este estado si el componente que lo posee se desmonta?
- El chequeo de huérfanos volvió a ganar su lugar: cambiar el contrato
  público de `ExploreView` (de sin props a controlada) habría dejado su test
  roto en silencio si `story-implement` no lo hubiera atrapado en el mismo
  paso.

## Learned

1. **About the system:** un componente "dueño de su propio estado" (como
   `ExploreView` lo era desde e2) deja de serlo en cuanto otra vista
   necesita sobrevivir a su desmontaje. La señal para elevarlo no es "se ve
   más limpio arriba", es un caso de aceptación concreto ("Volver conserva
   la selección") que el estado local no puede cumplir.
2. **About the process:** escribir el test de integración (T3) *antes* de
   decidir dónde vive el estado obligó la decisión correcta — si se hubiera
   escrito la implementación primero y el test después, es fácil que el
   test se hubiera adaptado a un diseño que pierde la selección, en vez de
   al revés.
3. **Capability gained:** el patrón de "vista controlada + arnés de estado
   en el test" (`ExploreViewConSuEstado`) es reusable para cualquier
   componente que un padre eleve a controlado sin perder su cobertura de
   interacción existente.
