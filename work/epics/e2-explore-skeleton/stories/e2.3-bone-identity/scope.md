# Story e2.3: Bone identity — Scope

## User story

As a medical student,
I want the selected bone's Spanish name and its Terminologia Anatomica term shown
together,
so that I learn both nomenclatures at once instead of studying them twice.

## Acceptance criteria

```gherkin
Given un hueso seleccionado
When se lee el panel
Then muestra su nombre en español, su término latino, su región y su lado

Given ningún hueso seleccionado
When se lee el panel
Then invita a elegir uno en vez de quedarse en blanco

Given un hueso con sinónimos aceptados
When se lee el panel
Then los muestra, porque son las otras formas válidas de nombrarlo

Given un hueso sin geometría
When se lee el panel
Then explica por qué no se puede mostrar en el esqueleto

Given un cambio de selección
When se anuncia
Then una región en vivo lo comunica sin que haya que buscar el panel
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `femur-right` | Mostrar | «fémur» · `os femoris` · Miembro superior→inferior · derecho |
| `null` | Mostrar | «Elegí un hueso para ver su nombre» |
| `malleus-left` | Mostrar | Nombre + aviso de que no es representable |

## In scope

- Panel con nomenclatura bilingüe, región, lado y sinónimos.
- Estado vacío que orienta.
- Anuncio en región viva al cambiar la selección.

## Out of scope

- **La ficha aislada del hueso** — es E3 (`RF-03`).
- **Preguntar el nombre** — es E4.
- **Resaltar en la escena** — es e2.5.

## Done when

- El panel muestra ambas nomenclaturas del hueso seleccionado.
- El cambio de selección se anuncia en una región viva (`aria-live`).
- `./scripts/check` en verde.
