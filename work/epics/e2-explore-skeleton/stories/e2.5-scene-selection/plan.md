# Story e2.5: Scene selection — Plan

> Size: M

### T1 · Resolver malla y mitad al hueso

- **Files:** create `src/domain/mesh-lookup.ts`, `src/domain/mesh-lookup.test.ts`
- **TDD:** RED — par en mitad original, par en mitad espejada, impar en ambas,
  malla desconocida → GREEN → REFACTOR.
- **Satisfies:** escenarios 2 y 4.
- **Verify:** `npx vitest run src/domain/mesh-lookup.test.ts`
- **Commit:** `feat(domain): resolve a mesh and scene half to a bone id`

### T2 · Clic y resaltado en la escena

- **Files:** modify `src/components/SkeletonScene.tsx`,
  `src/features/explore/ExploreView.tsx`
- **TDD:** parcial — el raycasting no es verificable en jsdom. Se prueba el
  mapeo (T1) y que la escena reciba y comunique la selección por su interfaz.
- **Satisfies:** escenarios 1 y 3.
- **Verify:** `./scripts/check`, build, y la prueba manual de T3.
- **Commit:** `feat(scene): select and highlight a bone on click`

### T3 · Manual integration test

- Servir la aplicación y comprobar que al pulsar un hueso el panel lo nombra, y
  que al elegirlo en la lista se resalta en la escena.
- **Verify:** declarar honestamente qué se pudo comprobar y qué no, igual que en
  e2.4.

## Order & risks

- **Execution order:** el mapeo primero: es lo único de esta historia que se
  puede probar de verdad, y es donde está el error probable.
- **Risks:** *confundir el lado al espejar* → es exactamente lo que T1 prueba con
  las dos mitades.
