# Story e2.3: Bone identity — Plan

> Size: S

### T1 · El panel de identidad

- **Files:** create `src/components/BoneIdentity.tsx`,
  `src/components/BoneIdentity.test.tsx`
- **TDD:** RED — cinco escenarios del scope, buscando por texto accesible →
  GREEN → REFACTOR — compartir con el navegador el nombre de región y de lado si
  se duplican.
- **Verify:** `npx vitest run src/components/BoneIdentity.test.tsx`
- **Commit:** `feat(ui): show the selected bone identity in both nomenclatures`

### T2 · Manual integration test

- Con la aplicación servida, seleccionar un hueso del navegador y comprobar que
  el panel cambia y que el anuncio en vivo lo acompaña.
- **Verify:** compila, se sirve, y el test de integración entre navegador y panel
  pasa montando ambos juntos.

## Order & risks

- **Execution order:** una tarea de vista sobre estado ya probado.
- **Risks:** *duplicar las etiquetas de región entre navegador y panel* → si
  aparece la duplicación, el REFACTOR las extrae a un módulo compartido.
