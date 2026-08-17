# Story e1.6: Complete catalog — Scope

## User story

As a medical student using huesos-mono,
I want every bone the model contains to be in the catalog with its bilingual
nomenclature,
so that studying is not cut short by a bone the application simply does not know.

## Acceptance criteria

```gherkin
Given el catálogo completo
When se cuentan sus entradas
Then hay 199 con geometría y 7 declaradas como ausentes, 206 en total

Given cualquier región anatómica
When se cuentan sus entradas
Then coinciden con el desglose canónico del esqueleto adulto

Given las 199 entradas con geometría
When se ejecuta el anclaje
Then todas apuntan a mallas existentes del modelo

Given los siete huesos que el modelo no trae
When se leen sus entradas
Then cada una explica por qué no tiene geometría
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `Scaphoid.r` | Catalogar | `escafoides` / `os scaphoideum`, mano derecha, región `upper-limb` |
| `Rib (7th).r` | Catalogar | `séptima costilla` / `costa VII`, dos entradas, una por lado |
| martillo | Catalogar | Sin malla, con razón: está dentro del temporal |

## In scope

- Las 173 entradas que faltan: cráneo, cara, tórax, cinturas y ambos miembros.
- Las 7 ausencias declaradas: seis huesecillos del oído y el hioides.
- Reordenar el catálogo por regiones para que siga siendo legible con 206
  entradas.

## Out of scope

- **Resolver las 7 ausencias** — riesgo asumido por decisión del 2026-08-16;
  cubrirlas exige vistas propias y sería un epic aparte.
- **El identificador FMA** — declarado SHOULD en el epic, no MUST. Se deja fuera
  porque derivarlo exige cruzar una ontología externa y ninguna historia
  posterior depende de él todavía.

## Decisión: el esternón cuenta como un hueso

El modelo lo parte en `Manubrium of sternum` y `Body of sternum`, y no trae
apéndice xifoides. El desglose canónico de los 206 cuenta el esternón **como un
solo hueso**, así que el catálogo lleva **una entrada**, anclada a
`Body of sternum`. El manubrio queda como malla sin entrada propia: el anclaje va
del catálogo al modelo, no al revés, y ninguna prueba exige lo contrario.

Consecuencia aceptada: quien quiera preguntar por el manubrio como pieza
independiente —que es materia de examen— necesitará que el catálogo admita
partes de un hueso. Eso es un cambio de esquema, y no toca en este epic.

## Done when

- 206 entradas: 199 ancladas, 7 con razón de ausencia.
- El recuento por región coincide con el desglose canónico, verificado en test.
- `./scripts/check` en verde.
