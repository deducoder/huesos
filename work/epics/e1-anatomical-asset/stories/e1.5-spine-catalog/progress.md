# Story e1.5: Spine catalog — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Exigir la columna completa | done | (con T2) | RED con 4 fallos sobre 6 aserciones |
| T2 · Poblar la columna | done | `8e73b1e` | 26 entradas transcritas del inventario |
| T3 · Prueba de integración manual | done | — | Las 26 mallas de columna del modelo tienen entrada; ninguna quedó fuera |

## Desvíos respecto del plan

- **T1 y T2 acabaron en un commit.** El plan pedía uno por tarea; el RED del
  test y el GREEN de los datos se commitearon juntos. Anotado, no reescrito.
- **Un commit vacío se coló al planificar y se eliminó** con `reset --hard`
  antes de que hubiera nada que perder.
- **Criterio de terminología fijado aquí, para que e1.6 lo herede:**
  - Español ordinal y en minúscula: `séptima vértebra torácica`.
  - Latín en Terminologia Anatomica con numeral romano: `vertebra thoracica VII`.
  - Atlas y axis conservan su nombre propio en ambos idiomas.
  - Sinónimos: la sigla del nivel (`T7`), la forma `vértebra T7`, y las
    variantes de uso corriente —`vértebra dorsal` para las torácicas, `coxis` y
    `rabadilla` para el cóccix.
