# Story e7.5: Panel de identidad — Progress

## T1 · `siblingId` compartido, y `navigator-rows.ts` lo consume

- **RED:** `src/domain/side-pairing.test.ts` fallaba al importar un módulo
  inexistente.
- **GREEN:** `siblingId` (bidireccional) e `isSideIrrelevant` tal como los
  fija el design. 9/9 en verde, incluidos los tres casos contra el catálogo
  real (martillo → `true`, fémur → `false`) y el caso de "opuesto inexistente
  → no oculta ante la duda".
- **REFACTOR:** `navigator-rows.ts` reemplaza su regex propia
  (`hueso.id.replace(/-right$/, '-left')`) por `siblingId(hueso)`.
- **Gates:** `./scripts/check` verde. `navigator-rows.test.ts` sigue verde
  **sin tocarse** — la prueba de que el refactor no cambió el comportamiento
  que e7.4 ya cerró.

## T2 · El campo «Lado» respeta `isSideIrrelevant`

- **RED:** dos pruebas nuevas en `BoneIdentity.test.tsx` — «martillo» no
  muestra "Lado" ni lo anuncia en el estado vivo — fallaban con
  `martillo derecho, malleus` en el `role="status"`.
- **GREEN:** `ocultarLado = bone.side !== null && isSideIrrelevant(bone,
  catalog)`, aplicado en el campo visible y en el anuncio vivo — la misma
  condición en los dos lugares, como pedía el Must 4.
- **Gates:** `./scripts/check` verde. Los 11 tests originales de
  `BoneIdentity.test.tsx` **no se tocaron**: `femur-right` sigue mostrando
  "Lado" sin cambios, porque `isSideIrrelevant` da `false`.

## T3 · Botón, tipografía y bordes al contrato del rediseño

- **RED:** `e2e/mobile-shell.spec.ts` — `alto del botón "ver ficha completa":
  Expected >= 44, Received 34`.
- **GREEN:** `min-h-tactil border-2 rounded-suave` en el botón,
  `font-display` en el `h2`, `border-2 rounded-suave` en el aviso de
  ausencia.
- **Gates:** `./scripts/check` verde · suite de navegador entera verde
  (12/12).

**Nada que el plan no anticipara.** Los tres cambios fueron mecánicos, tal
como el design los dejó escritos con clases concretas de antes/después.
