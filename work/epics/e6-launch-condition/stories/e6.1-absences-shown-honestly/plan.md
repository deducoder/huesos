# Story e6.1: Absences shown honestly — Plan

> Size: S

## Tasks

### T1 · La ficha de un hueso sin geometría explica la ausencia

Una sola tarea: el arreglo es no montar la escena y poner la explicación en su
lugar, así que el panel vacío y la etiqueta mentirosa desaparecen del mismo
cambio. Separarlos daría un commit intermedio con el gate en rojo o con la
mitad del defecto vivo — lo que E5 aprendió dos veces.

- **Files:** modify `src/features/bone-detail/BoneDetailView.tsx`,
  `BoneDetailView.test.tsx`
- **TDD:** RED — abrir la ficha de `malleus-right` debe mostrar su razón de
  ausencia en el panel de la escena y **no** debe haber ningún elemento cuya
  etiqueta accesible diga "aislado en 3D"; hoy hay un lienzo con esa etiqueta y
  ninguna explicación → GREEN — `BoneDetailView` monta `IsolatedBoneScene` solo
  cuando el hueso tiene malla, y en caso contrario un panel con la razón →
  REFACTOR.
- **Satisfies:** los tres primeros escenarios del scope.
- **Verify:** `npx vitest run src/features/bone-detail/` · `./scripts/check`
- **Commit:** `fix(bone-detail): explain the absence instead of an empty canvas`

### T2 · Verificar las otras vías

- **Files:** ninguno esperado; modify solo si aparece un defecto
- Revisar las otras superficies donde un hueso sin geometría puede aparecer —la
  lista de "Fichas", el navegador de `ExploreView`, `BoneIdentity`— y comprobar
  que dicen la verdad. El gemba de la épica ya vio que muestran
  `missingReason`; esto confirma que no hay una cuarta que nadie miró.
- **Verify:** una comprobación explícita por superficie, registrada en
  `progress.md` — dijeran lo que dijeran.

### T3 · Prueba de integración manual

- En Chromium: abrir la ficha del martillo derecho y la del hioides, y
  comprobar que se entienden. Abrir la del fémur derecho y comprobar que no
  cambió nada.
- **Verify:** captura del texto de pantalla en los tres casos.

## Order & risks

- **Execution order:** T1 → T2 → T3.
- **Risks:**
  - *Que arreglar la ficha rompa la de un hueso normal.* → El tercer escenario
    del scope lo cubre con test, y T3 lo mira con los ojos.
  - *Que T2 encuentre una cuarta superficie y la historia crezca.* → Es
    información barata; si aparece, se arregla aquí, que para eso esta historia
    va primera en la épica.
