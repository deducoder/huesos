# Story e6.1: Absences shown honestly — Progress

## T1 · La ficha de un hueso sin geometría explica la ausencia

**El defecto era real y se reprodujo antes de tocarlo.** Para un hueso sin
malla, `IsolatedGroup` no encuentra ninguna visible, llama `onFramed(null)`, no
se monta `PerspectiveCamera`, y el lienzo queda con luces y nada más: **un panel
negro**. Y su `aria-label`, calculado del nombre del hueso, seguía afirmando
"martillo, aislado en 3D" — una vista tridimensional que no existía. Misma clase
de defecto que E4 arregló dos veces: texto fijo que asume el contexto donde el
componente nació.

`BoneDetailView` ahora monta `IsolatedBoneScene` **solo** si el hueso tiene
malla; si no, un panel que dice que ese hueso no está en el modelo 3D. Al no
montarse el lienzo, la etiqueta mentirosa desaparece por construcción, no por
un texto corregido.

RED: dos tests fallando —el panel vacío y la etiqueta— antes del cambio.
Gate: `./scripts/check` verde — 190 tests.

**Dos desviaciones, ambas de las que mejoran el resultado:**

1. **El primer arreglo repetía la razón dos veces en la misma pantalla**: el
   panel nuevo mostraba `missingReason` y la ficha de identidad también. Lo
   destapó el propio test, que falló con "Found multiple elements". El panel de
   la escena pasó a decir **qué** pasa —"Este hueso no está en el modelo 3D"— y
   a remitir al motivo, que sigue apareciendo una sola vez al lado. El test
   ahora afirma esa unicidad (`getAllByText(...).toHaveLength(1)`), así que la
   duplicación no puede volver en silencio.
2. **El doble de `IsolatedBoneScene` no reproducía el `aria-label` real**, así
   que el defecto de la etiqueta habría sido invisible para las pruebas. Se le
   añadió, calculado como en el componente real. Un doble que no reproduce lo
   que el original hace mal no puede probar que se arregló.

## T2 · Verificar las otras vías

Las cinco superficies que renderizan un hueso, revisadas una por una:

| Superficie | Qué hace con un hueso sin geometría | Veredicto |
|---|---|---|
| `BoneNavigator` | Lo marca con `·` (aria-hidden) y expone `missingReason` en un `<span class="sr-only">` enlazado por `aria-describedby` | **Honesto** — y además accesible, no solo visual |
| `BoneIdentity` | Panel ámbar: "No se puede señalar en el esqueleto." + la razón | **Honesto** |
| `ExploreView` | Compone las dos anteriores; al seleccionar un ausente la escena no resalta nada, y el panel de identidad explica por qué, en pantalla al mismo tiempo | **Honesto** |
| `BoneDetailView` | Panel negro sin explicación, con etiqueta mintiendo | **Defecto — arreglado en T1** |
| Modo test (`TestQuestion`) | No los pregunta: `pickTestableBone` filtra por `meshName !== null`, con comentario que lo explica | **Honesto por construcción** |

No apareció una sexta superficie. La búsqueda fue por archivos que renderizan
huesos (`grep` de `catalog`/`bones` sobre `src/features` y `src/components`),
no por memoria de dónde miré antes.

## Finalize

- Full gate set: `./scripts/check` verde — **190 tests** (187 al empezar, 3
  nuevos).
- Orphaned-test check: limpio — `BoneDetailView.test.tsx` es el único que
  importa lo que cambió, y se actualizó en la misma tarea.
- Acceptance criteria: los cuatro escenarios del `scope.md`, cumplidos.
