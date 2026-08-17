# Story e6.1: Absences shown honestly — Scope

## User story

As a estudiante de medicina que busca el martillo o el hioides,
I want entender que ese hueso existe pero el modelo no lo dibuja,
so that no crea que la aplicación está rota ni que el hueso no existe.

## Acceptance criteria

```gherkin
Given un hueso sin geometría en el modelo (martillo, yunque, estribo, hioides)
When se abre su ficha completa
Then se explica por qué no se puede mostrar, en vez de un panel vacío

Given ese mismo hueso
When un lector de pantalla lee la zona donde iría la escena 3D
Then no se le anuncia una vista tridimensional que no existe

Given un hueso con geometría
When se abre su ficha completa
Then se muestra en 3D exactamente igual que antes — nada cambia

Given la lista de huesos y la ficha de identidad
When se mira un hueso sin geometría
Then siguen mostrando su razón de ausencia, como ya hacían
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `malleus-right` | abrir su ficha | El panel dice que el modelo no incluye ese hueso, con su razón; sin lienzo 3D vacío |
| `malleus-right` | leer con lector de pantalla | Ninguna etiqueta dice "aislado en 3D" |
| `femur-right` | abrir su ficha | Escena 3D del fémur, sin cambios |

## In scope

- Que la ficha completa de un hueso sin geometría explique la ausencia en el
  lugar donde iría la escena, en vez de dejar un panel negro.
- Que ninguna etiqueta accesible afirme una vista 3D inexistente.
- Verificar las otras vías por donde puede aparecer un hueso sin geometría —la
  lista de "Fichas", el navegador de `ExploreView`, la ficha de identidad— y
  arreglarlas si mienten igual.

## Out of scope

- **Dibujar los siete huesos** — no-go del brief y alternativa (A) diferida en
  ADR-006.
- **Cambiar `IsolatedBoneScene` para que dibuje algo distinto** — el arreglo es
  no montarla cuando no hay nada que mostrar, no inventarle un estado vacío.
- **El modo test** — `pickTestableBone` ya excluye los huesos sin malla y su
  comentario explica por qué. Verificado en el gemba de la épica; nada que
  hacer.

## Done when

- Abrir la ficha de un hueso sin geometría muestra una explicación, no un
  panel vacío.
- Ninguna etiqueta accesible de esa ficha menciona una vista 3D.
- La ficha de un hueso con geometría no cambia en nada.
- `./scripts/check` en verde.

## Notes

- Reproducido en el gemba de la épica leyendo `IsolatedBoneScene.tsx`: sin
  mallas visibles, `IsolatedGroup` llama `onFramed(null)`, no se monta
  `PerspectiveCamera`, y el lienzo queda con luces y nada más. El `aria-label`,
  en cambio, se calcula del nombre del hueso y afirma "aislado en 3D".
- Es la misma clase de defecto que E4 arregló dos veces (aprendizaje
  `manual-verification-keeps-finding-real-things`): texto fijo que asumía el
  contexto donde el componente nació.
