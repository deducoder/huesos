# Epic e4: Motor de test — Plan

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | e4.1 | risk-first + dependency | — | Todo lo demás: sin validación ni selección de hueso no hay flujo que construir |
| 2 | e4.2 | skeleton | e4.1 | Prueba el flujo pregunta→respuesta de punta a punta, sobre el esqueleto completo |
| 3 | e4.3 | dependency | e4.2 | Cierra `RF-07` sobre el flujo que e4.2 ya probó |
| 4 | e4.4 | dependency | e4.2, e4.3 | Segundo caso real de uso de `TestQuestion` — decide qué se comparte con datos, no con suposiciones |
| 5 | e4.5 | dependency | e4.1, e4.2, e4.3, e4.4 | Cierra el epic: entrada real + el guardrail `must-data-003` en el gate |

**Rationale:** riesgo primero (e4.1 concentra la única incertidumbre real —
casos límite de normalización— y bloquea a las demás), después el camino
más corto a un extremo a extremo demostrable (e4.2), y desde ahí cada
historia depende estrictamente de la anterior: no hay orden alternativo que
tenga sentido, `RF-07` no existe sin `RF-04` para corregir, y la extracción
compartida de e4.4 necesita que e4.2/e4.3 ya existan como segundo caso real.

## Milestones

- [ ] **Walking skeleton** — e4.1, e4.2 — una pregunta sobre el esqueleto
  completo se puede responder de punta a punta (sin corrección elaborada
  todavía), con la validación tolerante real detrás.
- [ ] **Core MVP** — + e4.3 — `RF-04` y `RF-07` completos: preguntar,
  responder, corregir con ambas nomenclaturas y el hueso resaltado.
- [ ] **Feature complete** — + e4.4 — `RF-05` también completo, mismo flujo
  sobre un hueso aislado.
- [ ] **Epic complete** — + e4.5 — punto de entrada real desde `App.tsx` y
  la prueba de `must-data-003` corriendo en el gate rápido.

Sin checkpoint de integración E2E dedicado: es una épica de un solo
componente (frontend, sin servicios externos), y cada historia ya cierra
con su propia prueba manual en navegador real (mismo patrón que E2/E3).

## Parallel streams

Ninguno — la cadena de dependencias es estrictamente secuencial (ver
Sequence). No hay dos historias sin dependencia mutua que valga la pena
paralelizar en esta épica.

## Progress

Updated by `story-close` as each story lands — the only cross-artifact write.

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| e4.1 | done | S | S (3 tareas + 1 corrección de calidad) |
| e4.2 | done | M | M (3 tareas + 1 corrección de calidad) |
| e4.3 | done | S | S (2 tareas) |
| e4.4 | done | S | XS (1 tarea + 2 correcciones de calidad) |
| e4.5 | todo | S | — |

## Sequencing risks

- Si e4.1 subestima los casos límite de normalización y algo se descubre
  recién en e4.2 (al escribir la primera pregunta real), el costo de
  volver atrás es bajo — `answer-check.ts` es una función pura sin
  consumidores todavía en ese punto → mitigación: aceptado, no bloquea el
  orden.
- Si `TestQuestion` (extracción compartida en e4.4) resulta forzada, la
  alternativa es dejar `SkeletonTestView` y `BoneTestView` con su propio
  flujo, algo duplicado — no es una desviación grave del plan, es la
  opción B que la propia historia ya contempla.
