# Epic e4: Motor de test — Scope

## Objective

Un estudiante puede responder, escribiendo el nombre, una pregunta sobre un
hueso señalado en el esqueleto completo o aislado — sin ver ninguna
etiqueta antes de responder — y recibe una corrección explícita que le
muestra el nombre correcto en ambas nomenclaturas y mantiene el hueso
resaltado (`RF-04` a `RF-07`).

**Value:** cierra el ciclo de estudio que E2/E3 abrieron (reconocer viendo
el nombre) con la comprobación real (producir el nombre de memoria) — la
pieza que E5 (progreso y repaso dirigido) necesita para tener algo que
registrar.

## Stories

| ID | Story | Size | Description |
|----|-------|:----:|-------------|
| e4.1 | Dominio del modo test | S | `answer-check.ts` (validación tolerante, `RF-06`) + `quiz.ts` (elegir hueso preguntable) |
| e4.2 | Modo test sobre el esqueleto completo | M | `RF-04`: pregunta señalada en `SkeletonScene`, respuesta escrita, sin corrección todavía (acierto/error mínimo) |
| e4.3 | Corrección explícita del error | S | `RF-07`: nombre correcto en ambas nomenclaturas + hueso resaltado, sobre el flujo de e4.2 |
| e4.4 | Modo test sobre hueso individual | S | `RF-05`: mismo flujo que e4.2/e4.3, con `IsolatedBoneScene` en vez de `SkeletonScene` — comparten `TestQuestion` |
| e4.5 | Acceso al modo test y guardrail de fuga | S | Cuarto modo en `App.tsx` + la prueba dedicada que exige `must-data-003`: ningún nombre de hueso en el DOM antes de responder |

## In scope

- **MUST:** validación tolerante completa de `RF-06` (mayúsculas, tildes,
  espacios, artículos iniciales, sinónimos, ambas nomenclaturas).
- **MUST:** pregunta sobre el esqueleto completo (`RF-04`) y sobre un hueso
  aislado (`RF-05`), sin ninguna etiqueta visible antes de responder.
- **MUST:** corrección explícita (`RF-07`) — nombre correcto en ambas
  nomenclaturas, hueso resaltado en su posición.
- **MUST:** la prueba dedicada de `must-data-003` (ya declarada en
  `governance/guardrails.md`, nunca implementada hasta ahora).

## Out of scope

- **Registrar aciertos/fallos** — es `RF-09`/E5. **Not now**: e4 deja el
  punto donde un resultado existe (la propia corrección lo sabe), pero no
  lo persiste ni lo expone a nada externo.
- **Elegir qué hueso preguntar priorizando fallos previos** — mismo motivo,
  es E5. `e4.1` elige al azar entre huesos preguntables, sin memoria de
  intentos anteriores.
- **Actualizar `governance/architecture/system-design.md`** — sigue
  aparcado desde e3; e4 no lo agrava (ver `design.md`).

## Done when

- Las cinco historias completas, con sus gates en verde.
- Un estudiante completa una pregunta sobre el esqueleto completo y otra
  sobre un hueso aislado, con corrección explícita en ambas.
- La prueba de `must-data-003` está en el gate y falla si un nombre de
  hueso llega al DOM antes de responder — verificado reintroduciendo el
  fallo a propósito y confirmando que la prueba lo atrapa.
- Docs actualizadas (`docs.md` de la épica) · retrospectiva hecha.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| La normalización de `RF-06` (tildes, artículos) tiene un caso límite no cubierto por el ejemplo del PRD (p. ej. sinónimos con mayúsculas mixtas, o un hueso cuyo `es` ya trae artículo) | M | M | e4.1 empieza leyendo el catálogo real en busca de casos límite (mismo criterio que e3.1 usó con `inventory-model.mjs`) antes de fijar las reglas de normalización |
| `TestQuestion` compartido entre e4.2 y e4.4 termina con una interfaz forzada porque las dos vistas divergen más de lo esperado | M | S | e4.2 se construye primero sola; la extracción a componente compartido se decide en e4.4 con dos casos reales delante, no antes (regla de tres aplicada a dos, con el segundo caso ya construido) |
| Un refactor futuro de `SkeletonScene`/`IsolatedBoneScene` rompe `must-data-003` en silencio si la prueba dedicada no corre en cada gate | L | A | La prueba de `must-data-003` va al gate rápido (`./scripts/check`), no a uno manual — corre en cada task, no solo al cerrar la épica |
