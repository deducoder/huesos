# Story e3.2: Ficha completa desde la selección de E2 — Scope

## User story

As an estudiante de medicina que ya seleccionó un hueso en la escena o el
navegador de `ExploreView`,
I want abrir su ficha completa,
so that vea ese hueso aislado, con su nombre en ambas nomenclaturas, su
región y si es par o impar — sin que el resto del esqueleto compita por mi
atención.

## Acceptance criteria

```gherkin
Given un hueso seleccionado en `ExploreView` (escena o navegador)
When se activa "Ver ficha completa" desde el panel de identidad
Then se muestra `BoneDetailView`: ese hueso aislado en 3D, junto a su
  identidad completa

Given `BoneDetailView` abierta para un hueso impar
When se lee su ficha
Then dice "impar" con todas las letras, no solo omite el lado

Given `BoneDetailView` abierta para un hueso par
When se lee su ficha
Then muestra el lado (izquierdo/derecho), como ya hace `BoneIdentity`

Given `BoneDetailView` abierta
When se activa "Volver"
Then se regresa a `ExploreView`, con la selección anterior intacta
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `femur-left` seleccionado en `ExploreView` | clic en "Ver ficha completa" | `BoneDetailView` con solo el fémur izquierdo visible, "Fémur", "os femoris", "Miembro inferior", "izquierdo" |
| `sacrum` seleccionado | clic en "Ver ficha completa" | `BoneDetailView` con solo el sacro visible, "Sacro", "os sacrum", "impar" (no "Lado") |

## In scope

- `BoneDetailView`: compone `IsolatedBoneScene` (e3.1) + `BoneIdentity`
  para un `boneId` dado, con un botón "Volver".
- `BoneIdentity` dice "impar" explícitamente para huesos sin lado — hoy
  solo omite la fila "Lado" (`isUnpaired` de `data/bone.ts` ya calcula esto,
  falta consumirlo desde la vista).
- El selector de modo mínimo en `App.tsx` (`'explorar' | 'ficha'`, ADR-003)
  que esta historia necesita para navegar de uno a otro — nace acá porque
  es su primer consumidor real, no en e3.3. e3.3 reutiliza el mismo estado
  para su propio punto de entrada, no lo reconstruye.
- El botón "Ver ficha completa" en `BoneIdentity`, visible solo cuando hay
  un hueso seleccionado.

## Out of scope

- El punto de entrada sin pasar por la escena completa (lista de 206
  huesos) — es e3.3.
- Persistir el modo o el hueso de la ficha entre recargas — no lo pide
  `RF-03`.

## Done when

- Desde cualquier hueso seleccionado en `ExploreView`, "Ver ficha completa"
  lleva a `BoneDetailView` con ese hueso aislado y su identidad completa.
- Todo hueso impar dice "impar" en su ficha.
- "Volver" regresa a `ExploreView` sin perder la selección previa.

## Notes

Diseño completo en `work/epics/e3-bone-detail/design.md` y ADR-003
(`records/decisions/adr-003-bone-detail-access.md`). El estado de modo vive
en `App.tsx`, no en `ExploreView` ni en `BoneDetailView` — ninguna de las dos
vistas conoce a la otra, solo al padre común, mismo patrón que ya usa
`ExploreView` para su propio estado de selección (`domain/selection.ts`).
