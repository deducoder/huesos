# Story e4.5: Acceso al modo test y guardrail de fuga — Scope

## User story

As an estudiante que quiere comprobar lo que recuerda,
I want llegar al modo test desde el arranque de la aplicación, eligiendo si
quiero que me pregunte sobre el esqueleto completo o sobre un hueso
aislado,
so that pueda practicar sin depender de otro flujo previo (`RF-04`,
`RF-05`).

## Acceptance criteria

```gherkin
Given la aplicación recién abierta
When se activa la pestaña "Test"
Then se ofrece elegir entre "Esqueleto completo" y "Hueso aislado"

Given la elección "Esqueleto completo"
When se confirma
Then se monta `SkeletonTestView` (e4.2/e4.3)

Given la elección "Hueso aislado"
When se confirma
Then se monta `BoneTestView` (e4.4)

Given el gate rápido del proyecto
When corre `./scripts/check`
Then la prueba de `must-data-003` (ya escrita en e4.2 y e4.4) forma parte
  de la corrida — no hace falta agregarla, se confirma que ya corre
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| App recién abierta | clic "Test" → "Esqueleto completo" | `SkeletonTestView` montada |
| App recién abierta | clic "Test" → "Hueso aislado" | `BoneTestView` montada |

## In scope

- Cuarto modo en `App.tsx` (`'test'`, con una elección previa entre las dos
  variantes) — mismo patrón que `'fichas'` de e3.3: pestaña de nivel
  superior, sin router.
- Confirmar (no reescribir) que `must-data-003` ya está en el gate rápido:
  `TestQuestion.test.tsx` (e4.2) y el test de `aria-label` de
  `BoneTestView.test.tsx` (e4.4) ya corren en `./scripts/check`. El scope
  de la épica lo daba por hacer acá; el gemba de esta historia encuentra
  que ya existe.

## Out of scope

- Cualquier cambio a `TestQuestion`, `SkeletonTestView` o `BoneTestView` —
  se montan tal cual.
- Recordar la última variante elegida entre sesiones.

## Done when

- Desde el arranque, "Test" ofrece las dos variantes y cada una monta la
  vista correcta.
- `must-data-003` corre en `./scripts/check` — confirmado, no reescrito.
- Los tres modos existentes (`explorar`, `fichas`, `ficha`) siguen
  funcionando sin regresión.

## Notes

Diseño completo en `work/epics/e4-test-engine/design.md`. Esta es la última
historia de e4 — al cerrarla, la épica queda con `RF-04` a `RF-07`
completos y verificados.
