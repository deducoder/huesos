# Story e1.2: Catalog schema — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Tipos y catálogo semilla | done | `a4a58a0` | RED con 7 aserciones de integridad, GREEN con los tipos y 4 entradas |
| T2 · Prueba de integración manual | done | `c6c8cca` | Destapó un estado imposible representable; el REFACTOR lo cerró |

## Desvíos respecto del plan

- **T2 no era una formalidad.** Inyectar una entrada inválida confirmó que el
  tipo atrapaba la región inexistente, pero **no** una entrada con `meshName` y
  `missingReason` a la vez. La invariante vivía solo en el test.
- El REFACTOR previsto en T1 acabó siendo otro: en lugar de extraer un
  predicado, convirtió `Bone` en unión discriminada de `MappedBone` y
  `UnmappedBone`. El estado incoherente ya no se puede escribir.
- **`isUnpaired` trata la columna entera como impar**, que es lo correcto —cada
  vértebra es pieza única en la línea media— pero no estaba previsto en el
  scope y se descubrió al modelar.
- **Ambos fémures apuntan a `Femur.r`.** El modelo trae solo el hemicuerpo
  derecho, así que la lateralidad la lleva el catálogo y el espejo será trabajo
  de render. El test de unicidad usa la clave `meshName::side` justamente por eso.
