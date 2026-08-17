# Story e4.4: Modo test sobre hueso individual — Scope

## User story

As an estudiante que quiere repasar un hueso sin la posición del cuerpo
como pista,
I want que el sistema me lo muestre aislado, sin etiqueta, y me pida su
nombre,
so that responda de memoria pura, sin que la ubicación en el esqueleto me
ayude a deducirlo (`RF-05`).

## Acceptance criteria

```gherkin
Given el modo test sobre un hueso aislado recién montado
When se inspecciona el DOM antes de responder
Then ningún nombre de hueso está presente — mismo criterio de
  `must-data-003` que e4.2, sobre `IsolatedBoneScene` en vez de
  `SkeletonScene`

Given una pregunta activa
When se observa la escena
Then el hueso se ve aislado del resto del esqueleto (reutilizando e3.1),
  sin contexto posicional

Given una respuesta incorrecta
When se observa el resultado
Then aparece el nombre correcto en ambas nomenclaturas — mismo
  comportamiento que `RF-07` (e4.3), heredado de `TestQuestion` sin
  cambios
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| pregunta sobre un hueso al azar | responder mal | mismo hueso aislado en pantalla, "Incorrecto" + ambas nomenclaturas |

## In scope

- `features/test/BoneTestView.tsx`: `TestQuestion` (e4.2/e4.3, sin
  cambios) + `IsolatedBoneScene` (e3.1) en vez de `SkeletonScene`.

## Out of scope

- Cualquier cambio a `TestQuestion` o a `IsolatedBoneScene` — ambos se
  reutilizan tal cual. Si algo no encaja, es un hallazgo, no una historia
  para reescribirlos.
- Punto de entrada desde `App.tsx` — es e4.5.

## Done when

- `BoneTestView` existe, compone `TestQuestion` + `IsolatedBoneScene`, y
  pasa la misma prueba de `must-data-003` que `SkeletonTestView` — no una
  copia relajada de ella.
- Verificado a mano que el hueso se ve realmente aislado, no el esqueleto
  completo con zoom.

## Notes

Diseño completo en `work/epics/e4-test-engine/design.md`. Esta historia es
la prueba real de que `TestQuestion` se diseñó bien en e4.2: si compone sin
fricción con una segunda escena, el flujo estaba correctamente separado de
la presentación. Si no, es un hallazgo sobre e4.2, no algo a resolver acá
con un parche.
