# Epic e8: Redesign mockup follow-ups — Plan

## Sequence

| Order | Story | Strategy | Depends on | Enables |
|:-----:|-------|----------|------------|---------|
| 1 | e8.3 Distractores plausibles | risk-first | — | e8.4 — resuelve barato (dominio puro, sin UI) el riesgo de mayor incertidumbre de la épica: qué hace "plausible" cuando la región del hueso preguntado tiene menos de 2 huesos preguntables. |
| 2 | e8.4 Opción múltiple como formato primario | risk-first | e8.3 | El resto de la épica — es donde vive ADR-012 (la tensión con `must-data-003` y el guardrail nuevo). Es la historia de mayor impacto: cambia el formato por defecto del test. |
| 3 | e8.2 Acordeón de Fichas | quick-win (dentro de un riesgo ya bajo) | — | Nada aguas abajo; cierra la segunda superficie del mockup. Va antes que e8.1 porque toca más superficie (componente nuevo, ADR-011) aunque el riesgo real ya se descartó en el gemba de diseño (`REGION_LABEL` ya codifica el nivel de categoría). |
| 4 | e8.1 Navbar flotante | quick-win | — | Nada aguas abajo; el cambio más contenido de las cuatro (reordenar piezas que e7.1 ya construyó), se deja al final a propósito para cerrar con la historia de menor riesgo. |

**Rationale:** riesgo primero. Las dos historias del formato de test
(e8.3 → e8.4) cargan la única incertidumbre real de la épica —la que
generó ADR-012— y van primero para aprender de ella con tiempo de
reaccionar. e8.2 y e8.1 son extensiones directas de patrones que e7 ya
probó en producción (tokens, `groupByRegion`, `toNavigatorRows`); van al
final no porque no importen, sino porque no enseñan nada nuevo.

## Milestones

- [ ] **Core MVP** — e8.3 + e8.4 — un test respondido por opción múltiple
      en un dispositivo real, `TestQuestion.test.tsx` (`must-data-003`) en
      verde sin editarse, y el guardrail nuevo (`must-data-010`) con su
      propia prueba en verde.
- [ ] **Feature complete** — + e8.2 — Fichas navegable por acordeón
      (categoría → subgrupo → grilla) en un dispositivo real.
- [ ] **Epic complete** — + e8.1 — recorrido continuo en celular real
      (Explorar con la navbar nueva → Fichas por acordeón → test por
      opción múltiple) sin regresión de accesibilidad ni de
      `should-perf-007`; `epic-review` re-verifica el scope completo.

No hay checkpoint de integración E2E multi-componente: la épica es de un
solo componente (la SPA), y cada milestone ya es, en sí, una pasada manual
end-to-end.

## Parallel streams

- **Stream test** (e8.3 → e8.4) y **stream navegación** (e8.2, e8.1) no
  comparten archivos ni dependencias — podrían intercalarse sin romper el
  orden de riesgo si conviniera alternar por variedad. El orden de arriba
  asume desarrollo en serie (un solo desarrollador); no hay necesidad
  técnica de terminar un stream antes de tocar el otro.

## Progress

| Story | Status | Est. | Actual |
|-------|:------:|:----:|:------:|
| e8.3 | done | XS | 4 tareas (T1, T2, T2b, T3) — T2b se agregó tras un hallazgo real de T3 |
| e8.4 | done | M | 5 tareas (T1-T4 + fix de quality-review) — encontró y corrigió 2 specs e2e rotos, no anticipados en el plan |
| e8.2 | done | M | 4 tareas, sin agregados — corrigió una capa mal ubicada en el design.md de la épica antes de implementar |
| e8.1 | done | S | 2 tareas, sin agregados — cortó menú y flotante de scope (sin destino / cambio mayor no justificado), encontró que jsdom sobrecomputa el landmark `banner` |

## Sequencing risks

- e8.4 depende de que e8.3 resuelva bien el caso límite de región
  pequeña — si esa resolución cambia después (por ejemplo, ampliar a
  categoría en vez de región), e8.4 hereda el cambio a mitad de
  implementación → mitigación: e8.3 deja el caso límite decidido y
  testeado, no pendiente, antes de darse por cerrada (ya está en su
  propio scope como riesgo de `scope.md`).
- Nada bloquea a e8.1/e8.2 salir antes que e8.3/e8.4 si el usuario prefiere
  un cierre visible más rápido — el orden es una hipótesis de riesgo, no
  una dependencia dura salvo e8.3→e8.4.
