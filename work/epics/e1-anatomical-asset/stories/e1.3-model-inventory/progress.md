# Story e1.3: Model inventory — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · Clasificador de nombres | done | `4dc00c1` | RED con 7 casos, GREEN con dos convenciones de lateralidad |
| T2 · Recuento contra el modelo | done | `ac8d29f` | **No fue RED**: pasó a la primera |
| T3 · Ejecutable de inventario | done | `b6cd4ed` | Carcasa sobre lógica ya probada |
| T4 · Prueba de integración manual | done | — | 12 costillas como hueso derecho, 10 cartílagos apartados |

## Desvíos respecto del plan

- **T2 no pasó por rojo.** El plan pedía RED con el recuento del modelo real, y
  los cuatro totales —118 óseas, 14 dientes, 10 cartílagos, 2 sesamoideos—
  coincidieron a la primera con lo medido en la investigación «skeleton asset».
  Se deja escrito en vez de fabricar un rojo artificial: el test confirmó una
  medición previa, no descubrió nada.
- **`scope.md` y `plan.md` cayeron en un solo commit**, cuando la convención
  pide uno por artefacto. Error de ejecución, sin consecuencia sobre el
  contenido; no se reescribió la historia para arreglarlo.
- El modelo trae **dos convenciones de lateralidad** —el sufijo `.r` y la
  palabra `left`/`right`— y una malla con un punto sobrante, `Scapula.r.`. El
  clasificador las cubre las tres; el scope solo anticipaba la primera.
