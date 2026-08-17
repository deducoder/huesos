# Story e6.3: The PRD says what the project decided — Scope

## User story

As a cualquiera que lea la gobernanza de huesos-mono para saber si se puede
publicar,
I want que `RF-08` describa el observable que realmente se ejecuta,
so that no haya que leer las pruebas para descubrir que el requisito escrito
dice otra cosa.

## Acceptance criteria

```gherkin
Given `RF-08` en `governance/prd.md`
When se lee su observable junto a la prueba que lo verifica
Then dicen lo mismo

Given `RF-08`
When se lee qué significa "catálogo completo"
Then el matiz está en el propio requisito, no solo en el ADR

Given la fila de E6 en `governance/backlog.md`
When se lee
Then describe la épica que se hizo, no un trabajo de contenido ya terminado
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `RF-08` hoy | leerlo | "verifica que toda entrada tiene una región gráfica existente" — imposible, 7 no la tienen |
| `RF-08` después | leerlo | "toda entrada tiene geometría **o** una razón documentada" — lo que la prueba afirma |

## In scope

- Reescribir el observable de `RF-08` en `governance/prd.md` según ADR-006,
  con el matiz de qué significa "completo" dentro del propio requisito.
- Actualizar la fila de E6 y la nota de secuencia de `governance/backlog.md`,
  que describen un trabajo de contenido ya hecho.
- Citar ADR-006 desde `RF-08`, para que el porqué sea alcanzable desde el qué.

## Out of scope

- **Tocar cualquier otro requisito o guardrail** — rabbit hole del brief;
  `should-perf-007` tiene el mismo síntoma y está aparcado esperando turno.
- **Cambiar la condición de lanzamiento en sí** — sigue siendo `RF-08` y sigue
  siendo bloqueante; lo que cambia es qué exige, no su rango.
- **Reescribir la visión ni los outcomes** — no los afecta.

## Done when

- El observable escrito en `RF-08` y la aserción de
  `catalog.coverage.test.ts` dicen lo mismo, leídos uno al lado del otro.
- `RF-08` explica qué significa "completo" y enlaza ADR-006.
- El backlog no describe E6 como contenido pendiente.
- `./scripts/check` en verde (no debería tocarse código, pero se comprueba).

## Notes

- Es la historia con más riesgo de leerse mal: **cambiar un requisito para
  poder cumplirlo** parece hacer trampa. Por eso ADR-006 escribe las cuatro
  opciones y por qué se rechazan las otras tres, incluida "no hacer nada", y
  por eso `RF-08` va a citarlo.
