# Story e2.3: Bone identity — Progress

| Task | Status | Commit | Nota |
|------|:------:|--------|------|
| T1 · El panel de identidad | done | `9a2c4e1` | 6 aserciones; REFACTOR extrajo `labels.ts` compartido con el navegador |
| T2 · Prueba de integración manual | done | `d5f8b30` | `ExploreView` monta navegador y panel sobre un estado; 3 pruebas de integración |

## Desvíos respecto del plan

- **El REFACTOR previsto ocurrió tal cual.** `REGION_LABEL` y `SIDE_LABEL`
  estaban duplicándose entre navegador y panel; se extrajeron a
  `src/components/labels.ts`. El plan lo anticipó y se cumplió.
- **`ExploreView` se creó aquí, no en e2.6.** Era la única forma de probar la
  integración entre navegador y panel. e2.6 le añadirá la escena; el estado ya
  está donde tiene que estar.
- **Dos aserciones eran ambiguas y se precisaron:**
  - `derecho` aparece en la lista de datos **y** en el anuncio en vivo, a
    propósito. La prueba pasó a mirar la lista de definiciones.
  - `tibia` se escribe igual en español y en Terminologia Anatomica, así que
    aparece dos veces en el panel. La prueba pasó a mirar el encabezado.

  Ninguna de las dos era un fallo del componente: eran pruebas imprecisas sobre
  contenido correcto.
