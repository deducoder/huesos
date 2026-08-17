# Story e3.1: Escena de hueso aislado — Scope

## User story

As an estudiante de medicina,
I want ver un hueso solo, sin el resto del esqueleto alrededor,
so that pueda memorizar su forma sin que otros 205 huesos compitan
visualmente por mi atención.

## Acceptance criteria

```gherkin
Given el catálogo y el modelo `skeleton.glb` cargados
When se pide la escena aislada para un `id` de hueso par (p. ej. "femur-left")
Then solo las mallas cuyo hueso corresponda a ese `id` son visibles

Given el catálogo y el modelo cargados
When se pide la escena aislada para un `id` de hueso impar (p. ej. "sacrum")
Then solo esa malla es visible, sin depender de mitad (`original`/`mirrored`)

Given el modelo trae mallas sin entrada en el catálogo (dientes, cartílagos,
  sesamoideos — confirmado con `node scripts/inventory-model.mjs`: 26 de 144)
When se aísla cualquier hueso
Then esas mallas quedan ocultas igual que cualquier hueso que no sea el
  elegido — mismo criterio, sin caso especial

Given un `id` que no existe en el catálogo
When se pide la escena aislada
Then no revienta: no se muestra ninguna malla
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `id = "femur-left"` | render `IsolatedBoneScene` | solo la malla `Femur.r` (copia espejada) visible; el resto del modelo, oculto |
| `id = "sacrum"` | render `IsolatedBoneScene` | solo `Sacrum` visible |
| `id = "no-existe"` | render `IsolatedBoneScene` | ninguna malla visible, sin error |

## In scope

- `IsolatedBoneScene`: componente que carga `skeleton.glb` (mismo activo,
  mismo decodificador Draco que `SkeletonScene`) y oculta toda malla cuyo
  `boneIdForMesh` no coincida con el `id` recibido.
- Reutiliza `boneIdForMesh` y `sceneMeshName` de `domain/mesh-lookup.ts` sin
  reimplementarlos.
- Encuadre de cámara centrado en el hueso visible, no en el esqueleto
  completo — reutiliza el patrón de `Box3` de `domain/framing.ts` si aplica
  a una única malla, o lo extiende si el caso no está cubierto.

## Out of scope

- Componer la ficha completa (identidad + escena aislada) — es e3.2.
- Cualquier punto de entrada o navegación hacia esta escena — es e3.2/e3.3.
- Animación de transición al aislar (fade, zoom) — pulido no pedido por
  `RF-03`.

## Done when

- `IsolatedBoneScene` existe, recibe un `id` de hueso y solo muestra sus
  mallas — verificado con test unitario sobre la lógica de filtrado (qué
  mallas quedan visibles dado un `id`), sin depender de renderizar WebGL
  real en el test.
- Los 26 casos de malla sin catálogo (dientes, cartílagos, sesamoideos)
  quedan ocultos en cualquier hueso aislado, sin código especial para
  ellos — la prueba lo verifica explícitamente para al menos un caso de
  cada tipo.

## Notes

Diseño completo en `work/epics/e3-bone-detail/design.md`. La lógica de
filtrado (qué mallas son visibles dado un `id`) debe vivir en una función
pura de dominio o componente, testeable sin un canvas real — mismo criterio
que ADR-002 ya estableció para `SkeletonScene`: el grueso de la lógica
verificable en jsdom, el canvas WebGL fuera de la cobertura automática y
verificado a mano.
