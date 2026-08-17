# Story e2.2: Accessible navigator — Plan

> Size: M

### T1 · Estado de selección en dominio

- **Files:** create `src/domain/selection.ts`, `src/domain/selection.test.ts`
- **TDD:** RED — seleccionar, deseleccionar al repetir, y rechazar un id que no
  existe → GREEN → REFACTOR.
- **Verify:** `npx vitest run src/domain/selection.test.ts`
- **Commit:** `feat(domain): add bone selection state`

### T2 · El navegador accesible

- **Files:** create `src/components/BoneNavigator.tsx`,
  `src/components/BoneNavigator.test.tsx`
- **TDD:** RED — con Testing Library: encontrar el botón por su **nombre
  accesible**, activarlo con teclado, comprobar `aria-pressed`, y que un hueso
  sin geometría se anuncie como tal → GREEN → REFACTOR.
- **Verify:** `npx vitest run src/components/BoneNavigator.test.tsx`
- **Commit:** `feat(ui): add keyboard-navigable bone navigator`

### T3 · Manual integration test

- Montar la lista en la aplicación y recorrerla **sin tocar el ratón**:
  `Tab` para entrar, flechas o `Tab` para moverse, `Enter` para activar.
- **Verify:** se llega a un hueso de cada región y se activa; el foco es visible
  en todo momento.

## Order & risks

- **Execution order:** el estado primero, la vista después: la vista no debe
  inventar lógica de selección.
- **Risks:**
  - *206 botones en una lista es mucho recorrido de teclado* → se agrupan por
    región con encabezados, para que un lector de pantalla pueda saltar por
    grupos.
  - *La tentación de marcar la selección solo con color* → el test exige
    `aria-pressed`, así que el color no puede ser el único canal.
