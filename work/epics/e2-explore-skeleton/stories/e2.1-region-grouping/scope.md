# Story e2.1: Region grouping — Scope

## User story

As a medical student,
I want the bones presented grouped by anatomical region and in a sensible order,
so that I can find a bone by where it belongs instead of scanning 206 entries.

## Acceptance criteria

```gherkin
Given el catálogo de 206 huesos
When se agrupa por región
Then hay un grupo por cada región con huesos, y ninguno vacío

Given un grupo de región
When se lee su orden
Then las regiones salen de cabeza a pies, no en orden alfabético

Given un grupo con huesos pares
When se lee su contenido
Then el derecho y el izquierdo van juntos, no separados por el resto de la región

Given una región cuyos huesos no tienen geometría
When se agrupa
Then aparece igualmente, marcada como no representable
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| catálogo completo | Agrupar | 10 grupos, empezando por `cranium` y acabando por `lower-limb` |
| grupo `ear` | Leer | 6 huesos, marcado como sin geometría |

## In scope

- Agrupar el catálogo por región, en orden anatómico de cabeza a pies.
- Ordenar dentro del grupo de forma estable y previsible.
- Marcar el grupo cuyos huesos carecen de geometría.

## Out of scope

- **Presentarlo** — es e2.2; esto es dominio puro, sin DOM.
- **Buscar por nombre** — fuera del epic.
- **Traducir el nombre de la región** — lo hace la vista, no el dominio.

## Done when

- `groupByRegion(catalog)` devuelve los grupos en orden anatómico.
- Los pares salen contiguos dentro de su grupo.
- `./scripts/check` en verde.
