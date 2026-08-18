# Story e7.7: Ficha del hueso — Progress

## T1 · El botón «← Volver» al mínimo táctil

- **RED:** `alto del botón "Volver": Expected >= 44, Received 34`.
- **GREEN:** `min-h-tactil rounded-suave border-2`, el mismo patrón que
  e7.5/e7.6 ya usaron para los otros botones de la app.
- **Gates:** `./scripts/check` verde · suite de navegador entera verde
  (14/14).

Nada que el plan no anticipara — historia de una clase.

## T2 · Verificación manual — no realizada

Igual que e7.6: el usuario pidió cerrar directamente. Gates automáticos
verdes; nadie probó "Volver" con el dedo en un teléfono real para esta
historia. Riesgo aceptado por decisión explícita.

## Cierre

**Chequeo de tests huérfanos:** `BoneDetailView.test.tsx` sigue verde sin
tocarse. `BoneIdentity.test.tsx` e `IsolatedBoneScene` no se tocaron —
coherente con el Must NOT del design.

**Criterios de aceptación:**

| Criterio | Estado |
|---|---|
| Must 1 · botón ≥ 44×44 px | cumplido |
| Must NOT 1 · sin tocar BoneIdentity/IsolatedBoneScene | respetado |

**Gates finales:** `./scripts/check` verde (233 tests) ·
`npx playwright test` verde (14/14).
