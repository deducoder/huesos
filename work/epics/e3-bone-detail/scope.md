# Epic e3: Ficha del hueso — Scope

## Objective

Un estudiante puede aislar cualquiera de los 206 huesos del resto del
esqueleto y ver su ficha —nombre en ambas nomenclaturas, región y si es par
o impar— sin necesitar la escena 3D completa como paso previo (`RF-03`).

**Value:** desbloquea el modo test aislado (E4, `RF-06`), que pregunta sobre
un hueso "sin contexto posicional que ayude a deducir la respuesta" — eso
exige que el hueso ya pueda mostrarse solo, que es justo lo que esta épica
construye.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e3.1 | Escena de hueso aislado | M | `IsolatedBoneScene`: dado un `id`, oculta toda malla del modelo que no pertenezca a ese hueso |
| e3.2 | Ficha completa desde la selección de E2 | S | `BoneDetailView` compone la escena aislada + `BoneIdentity` (con par/impar explícito); accesible desde el hueso ya seleccionado en `ExploreView` |
| e3.3 | Acceso a la ficha sin el esqueleto completo | S | Selector de modo en `App.tsx` (ADR-003) + `BoneListEntry`, la lista de 206 huesos que entra directo a `BoneDetailView` |

## In scope

- **MUST:** aislar visualmente un hueso del modelo compartido (e3.1).
- **MUST:** nombre bilingüe, región y par/impar en la ficha (e3.2 — ya casi
  todo existe en `BoneIdentity`, falta decir "impar" con todas las letras).
- **MUST:** un camino a la ficha que no pase por la escena completa (e3.3).
- **SHOULD:** navegación por teclado entre fichas dentro de `BoneListEntry`,
  reutilizando el patrón ya accesible de `BoneNavigator` — no es una
  historia aparte, es el mismo componente aplicado al modo nuevo.

## Out of scope

- **Router con URL por hueso** — diferido por ADR-003, no rechazado. Vuelve
  si un requisito futuro (E5, enlaces a huesos fallados) lo pide.
- **Modo test sobre la ficha** — es `RF-06`/E4, no esta épica. E3 solo deja
  el hueso mostrable en aislamiento; preguntar sobre él es trabajo futuro.
- **Actualizar `governance/architecture/system-design.md`** — hallazgo real
  (está desactualizado desde ADR-001) pero no bloquea el objetivo de esta
  épica. Registrado en `records/parking-lot.md`.

## Done when

- Las tres historias completas, con sus gates en verde.
- Desde cualquier hueso seleccionado en E2, se llega a su ficha aislada.
- Desde `BoneListEntry`, se llega a la ficha de cualquiera de los 206 huesos
  sin haber tocado la escena 3D de `ExploreView`.
- Todo hueso impar dice "impar" explícitamente en su ficha, no solo omite
  el lado.
- Docs actualizadas (`docs.md` de la épica) · retrospectiva hecha.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| Ocultar mallas por hueso en el modelo compartido resulta más costoso de lo previsto (mallas que no anclan a ningún hueso del catálogo — dientes, cartílagos) | M | M | e3.1 empieza por un spike corto de lectura: confirmar contra el modelo real qué mallas quedan fuera del catálogo antes de decidir la regla de ocultamiento |
| El selector de modo (ADR-003) resulta insuficiente si aparece pronto una necesidad real de enlace profundo | L | M | Diferido explícitamente en el ADR, no rechazado; el costo de introducir un router después es bajo porque el estado ya vive fuera de la vista |
| La suite de integración de s1 sigue pausada durante E3 | M | L | e3 no depende de s1; se retoma cuando el usuario la verifique en su propia máquina, sin bloquear este trabajo |
