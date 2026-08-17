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

## T4 · Verificación manual

Hecha por el usuario en el teléfono, por el túnel. Veredicto: **funciona** —
botón, tipografía y campo «Lado» en fémur; sin lado en martillo; el panel se
ve igual desde `ExploreView` y desde `BoneDetailView`.

## Cierre

**Chequeo de tests huérfanos:** `ExploreView.test.tsx` y `BoneDetailView.test.tsx`
—los dos consumidores de `BoneIdentity`— no fueron tocados por esta historia
y siguen verdes.

**Criterios de aceptación:**

| Criterio | Estado |
|---|---|
| Must 1 · botón ≥ 44×44 px | cumplido |
| Must 2 · `h2` con `--font-display` | cumplido |
| Must 3 · `isSideIrrelevant` correcto contra el catálogo real | cumplido |
| Must 4 · campo visible y anuncio vivo con la misma condición | cumplido |
| Must 5 · `navigator-rows.test.ts` verde sin reescribirse | cumplido |
| Should 1 · borde/radio del aviso coherente | cumplido |
| Must NOT 1 · `isUnpaired`/catálogo intactos | respetado |
| Must NOT 2 · `missingReason` sin cambios | respetado |
| Must NOT 3 · nunca oculta ante la duda | respetado — probado explícitamente |

**Gates finales:** `./scripts/check` verde (231 tests) ·
`npx playwright test` verde (12/12).
