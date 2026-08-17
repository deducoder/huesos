---
name: model-mesh-names-are-irregular
description: Los nombres de malla del modelo anatómico mezclan convenciones, así que ninguna herramienta puede derivarlos por regla.
metadata:
  type: project
---

`src/data/skeleton.glb` nombra sus 144 mallas de forma irregular, y no es
casual: es un modelo compuesto a lo largo de años por BodyParts3D, Z-Anatomy y
AnatomyTOOL.

- **Lateralidad:** sufijo `.r` en casi todo el hemicuerpo derecho, pero palabra
  suelta en `Parietal bone left` / `Parietal bone right`.
- **Numeración inconsistente dentro de una misma familia:** `Distal phalanx of
  3d finger` junto a `Middle phalanx of 3rd finger`; `1st metacarpal bone` junto
  a `First metatarsal bone`.
- **Restos de edición:** `Scapula.r.` con un punto sobrante.
- **Solo el hemicuerpo derecho:** los huesos pares existen una vez; la
  lateralidad la aporta el catálogo y el render tendrá que espejar.

**Why:** cualquier herramienta que intente construir un nombre de malla a partir
de una regla —concatenar hueso + lado, derivar el ordinal— fallará en algún
caso. El catálogo ancla por nombre literal justamente por esto.

**How to apply:** leer siempre la lista real con
`node scripts/inventory-model.mjs --kind=bone` en vez de generar nombres. Si
AnatomyTOOL publica una versión nueva, ese mismo comando permite compararla
contra el catálogo, y el test de anclaje dirá qué entradas se rompieron.

Relacionado: [[skeleton-model-missing-bones]].
