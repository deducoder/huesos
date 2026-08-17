# Story e1.4: Catalog-geometry anchor — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Anclar el catálogo a la geometría | done | `f9032f8` | RED inyectando `Femur.right`; falló nombrando la entrada, como pedía el criterio |
| T2 · Prueba de integración manual | done | — | Cubierta por el propio RED: romper el nombre puso el gate en rojo con el id dentro del mensaje |

## Desvíos respecto del plan

- **T2 se fundió con el RED.** El plan las separaba, pero la forma honesta de
  poner esta prueba en rojo era exactamente la comprobación manual prevista:
  romper un `meshName` y mirar el mensaje. Separarlas habría sido repetir el
  mismo gesto dos veces para llenar una casilla.
- El REFACTOR previsto —reutilizar el lector de GLB— no hizo falta: se importó
  `readGlb` de e1.1 desde el principio, sin duplicar nada.
