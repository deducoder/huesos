# Story e2.4: Skeleton scene — Plan

> Size: M

### T1 · Decodificador Draco servido localmente

- **Files:** create `public/draco/*`, `src/components/SkeletonScene.test.tsx`
- **TDD:** RED — el test exige que el código de la escena no contenga ninguna URL
  externa y que el decodificador exista en `public/draco/` → GREEN — copiar el
  decodificador de `three` y apuntar a él.
- **Satisfies:** escenario 3, y `must-privacy-006`.
- **Verify:** `npx vitest run src/components/SkeletonScene.test.tsx`
- **Commit:** `feat(scene): serve the Draco decoder locally`

### T2 · La escena con el modelo

- **Files:** create `src/components/SkeletonScene.tsx`
- **TDD:** parcial — lo que vive dentro del canvas no se puede probar en jsdom.
  Se prueba lo que sí es observable: que el componente monta, que expone un
  estado de carga accesible y que el espejo se aplica al hemicuerpo.
- **Satisfies:** escenarios 1, 2 y 4.
- **Verify:** `./scripts/check` y la prueba manual de T3.
- **Commit:** `feat(scene): render the skeleton with orbit controls`

### T3 · Manual integration test

- Construir y servir la aplicación, abrirla y comprobar que **se ve el
  esqueleto**, que gira al arrastrar y que la red no pide nada a un tercero.
- **Verify:** el `.glb` y el decodificador se sirven desde el propio origen; el
  bundle no referencia ningún dominio externo.

## Order & risks

- **Execution order:** T1 antes que T2 — sin decodificador local no hay escena
  que cumpla el guardrail, y es lo que puede obligar a replantear.
- **Risks:**
  - *Draco no decodifica en el navegador* → la aplicación sigue usable sin
    escena; se reportaría y se decidiría si merece un activo sin comprimir.
  - *El canvas no es verificable en el gate* → se declara explícitamente qué
    quedó sin cubrir, en vez de aparentar cobertura.
