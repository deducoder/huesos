# Story e7.7: Ficha del hueso — Scope

## User story

As a estudiante que abre la ficha completa de un hueso,
I want volver atrás con un toque cómodo, sin apuntar,
so that el último rincón de la app que quedaba con controles chicos deje de
tenerlos.

## Acceptance criteria

```gherkin
Given la ficha completa de un hueso en 390×844
When se mide el botón «← Volver»
Then mide 44×44 px o más — contra los 34×83 px de hoy

Given un hueso con geometría
When se abre su ficha
Then la escena aislada, el título con tipografía display y las pills de
     Región/Lado se ven igual que en cualquier otro lugar donde se monta
     BoneIdentity — son el mismo componente, ya actualizado en e7.5/e7.6

Given un hueso sin geometría en el modelo
When se abre su ficha
Then el aviso de ausencia se sigue viendo con los tokens del rediseño, sin
     lienzo vacío
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Ficha de «fémur», botón «← Volver» | medir | ≥ 44×44 px (hoy: 34×83) |
| Ficha de «martillo» (sin malla) | abrir | aviso de ausencia, sin cambios de contenido |

## In scope

- **El botón «← Volver»** al mínimo táctil, con el mismo tratamiento de borde
  y radio que el resto del rediseño (`border-2`, `rounded-suave`).
- **Verificar, no rehacer**, que `BoneIdentity` y `IsolatedBoneScene` ya
  entregan lo que esta vista necesita — los dos se actualizaron en historias
  anteriores (e7.2, e7.5, e7.6) y `BoneDetailView` los consume sin
  modificarlos.

## Out of scope

- **Tocar `BoneIdentity.tsx` o `IsolatedBoneScene.tsx`** — no hay nada que
  cambiar en ellos para esta vista; si algo no se ve bien ahí, es un hallazgo
  para aparcar, no un cambio de esta historia.
- **El reparto de filas en móvil** — e7.2 ya midió que esta vista no lo
  necesita: el espacio sobrante del grid ya le da al lienzo el 61.8% del
  alto sin ningún CSS adicional.
- **`AusenciaEnElModelo`** — ya usa los tokens del rediseño desde el barrido
  de e7.1; no hay texto que corregir.

## Done when

- En 390×844, el botón «← Volver» mide 44×44 px o más.
- `./scripts/check` en verde; `BoneDetailView.test.tsx` sigue verde.

## Notes

- Gemba del 2026-08-17 al arrancar: medido en navegador, el botón mide
  34×83 px. El resto de la vista —escena, título, pills, aviso de
  ausencia— ya está al día porque `BoneIdentity` es el mismo componente que
  e7.5 y e7.6 ya actualizaron; verificado con captura, no a ojo.
- Es la historia más chica de lo que queda: la mayor parte del trabajo de
  esta vista ya lo hicieron otras historias por compartir componentes.
