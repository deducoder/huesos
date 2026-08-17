# Story e2.6: Explore view — Plan

> Size: S

### T1 · Probar el contrato entre el estado y la escena

- **Files:** modify `src/features/explore/ExploreView.test.tsx`
- **TDD:** RED — la escena debe recibir la malla del hueso elegido, `null` cuando
  no la tiene, y debe haber siempre exactamente un hueso marcado → GREEN — ajustar
  la composición si algo no se cumple.
- **Satisfies:** los cuatro escenarios.
- **Verify:** `npx vitest run src/features/`
- **Commit:** `test(ui): pin the contract between selection state and the scene`

### T2 · Manual integration test

- Construir y servir; comprobar que la aplicación arranca con las tres piezas.
- **Verify:** build correcto y la vista responde.

## Order & risks

- **Execution order:** una tarea; el resto ya está montado.
- **Risks:** *el doble de la escena puede ocultar un fallo real de integración* →
  se prueba el contrato observando **qué props recibe**, que es exactamente la
  costura que el doble no falsea.
