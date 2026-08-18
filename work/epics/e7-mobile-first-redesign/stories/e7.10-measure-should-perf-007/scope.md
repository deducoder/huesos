# Story e7.10: Medir `should-perf-007` — Scope

## User story

As a responsable del proyecto que necesita saber si `should-perf-007` se
cumple, quiero una medición real de la respuesta a la selección en un móvil
de gama media (con las seis vistas del rediseño ya cerradas), so that el
guardrail deje de ser una columna de verificación rellena sin evidencia
detrás — el mismo patrón que E5 encontró en `must-privacy-006` y que
`records/parking-lot.md` (2026-08-17) dejó aparcado para esta historia.

## Acceptance criteria

```gherkin
Given el esqueleto completo en Explorar, con CPU limitada 4x —la aproximación
      de Lighthouse a un móvil de gama media, ya que ningún artefacto del
      proyecto nombra un dispositivo concreto— y viewport 390×844
When se elige un hueso distinto repetidas veces
Then se registra el tiempo entre el clic y que la selección se refleje
     (mismo commit de React que resalta la malla en la escena y marca
     `aria-pressed` en el navegador), en una muestra de al menos 15 huesos

Given la muestra medida
When se calcula la mediana y el máximo
Then quedan escritos en el `progress.md` de esta historia, con veredicto
     explícito: cumple los <100ms de `should-perf-007`, o no cumple y
     queda como hallazgo con destino

Given el guardrail `should-perf-007` en `governance/guardrails.md`
When se lo compara con ADR-001 (aceptado, nunca superseded)
Then se confirma que la cláusula "el SVG se sirve por debajo de 500 KB" es
     un residuo de la comparación de opciones que ADR-001 documenta —el
     proyecto adoptó el modelo glTF (B), no el SVG (A), precisamente por
     cobertura— y no una condición vigente sobre el activo real
```

## Example

| Medición | Umbral | Resultado |
|---|---|---|
| Mediana de 15 selecciones, CPU 4x, 390×844 | < 100 ms | a registrar en `progress.md` |
| Máximo de la muestra | informativo, no bloquea el `should` | a registrar |
| Peso del activo servido (`skeleton-*.glb`) | informativo — la cláusula de 500 KB no aplica al activo aceptado | 1,9 MB, medido con `npm run build` |

## In scope

- Medir la latencia de selección con CPU throttling real (Chrome DevTools
  Protocol vía Playwright), no una estimación ni una medición manual con
  DevTools abierto a mano — sigue el patrón de esta épica: medir con
  Playwright cuando es posible, en vez de con una pasada humana cuando la
  medición es objetiva y repetible.
- Corregir la redacción de `should-perf-007` en `governance/guardrails.md`
  para que refleje la decisión ya aceptada en ADR-001 (activo glTF, no
  SVG) — es la misma clase de hallazgo que esta historia existe para
  cerrar, sobre el mismo guardrail.
- Registrar el resultado —cumple o no— con destino explícito si no cumple.

## Out of scope

- **Optimizar la latencia si no cumple** — esta historia mide; si el
  resultado es peor que 100ms, la corrección es hallazgo aparcado, no
  trabajo de esta historia (es un `should`, no bloquea el cierre de la
  épica per `governance/guardrails.md`).
- **Reducir el peso del `.glb`** — ADR-001 ya aceptó ese costo a cambio de
  cobertura; no se reabre esa decisión acá.
- **La pasada de pulido visual** ni **e7.11/e7.12/e7.13** — aparcados,
  fuera de esta historia.

## Done when

- Hay una medición real (Playwright + CPU throttling) de la latencia de
  selección, con mediana y máximo registrados.
- El guardrail en `governance/guardrails.md` refleja el activo real que el
  proyecto usa, con ADR-001 citado.
- Si la mediana no cumple el umbral, el hallazgo queda aparcado con razón y
  destino — nunca silenciado.
- `./scripts/check` en verde.

## Notes

- Guardrail completo: `should-perf-007 | should | La vista del esqueleto
  completo responde a la selección en menos de 100 ms en un móvil de gama
  media, y el SVG se sirve por debajo de 500 KB | Medición manual con
  throttling en DevTools antes de cerrar el epic de visualización | RF-01`.
- `records/parking-lot.md` (2026-08-17, hallazgo de `epic-review e5`): "O se
  mide (...) o se marca explícitamente el guardrail como no verificado hasta
  que alguien lo haga." Esta historia lo mide.
- `records/parking-lot.md` (2026-08-17, hallazgo de `epic-design e7`):
  animación/micro-interacción quedó fuera del scope de la épica con el
  disparador puesto en esta historia — "después de ella la conversación se
  puede tener con datos". Esta historia produce esos datos; la conversación
  sobre animación queda para quien retome ese hallazgo, no para acá.
- Ningún artefacto del proyecto nombra un dispositivo de referencia
  concreto para "gama media": se usa el preset de Lighthouse (CPU 4x) por
  ser el estándar de la industria más cercano a lo que el guardrail
  describe, documentado explícitamente en vez de asumido en silencio.
