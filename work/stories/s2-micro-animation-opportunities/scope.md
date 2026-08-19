# Story s2: Micro-animation opportunities — Scope

## User story

Como persona que usa la app para estudiar huesos,
quiero que los cambios de estado de la interfaz (selección, navegación,
apertura/cierre de paneles, retroalimentación del test) se perciban con
transiciones cuidadas en vez de saltos instantáneos,
para que la app se sienta más pulida y los cambios de estado sean más
fáciles de seguir.

## Acceptance criteria

```gherkin
Given una interacción de la interfaz que cambia de estado visible
  (selección de hueso, navegación entre vistas, apertura/cierre de un
  panel, respuesta correcta/incorrecta del test)
When el usuario dispara ese cambio
Then el cambio se comunica con una micro-animación intencional en vez de
  un salto instantáneo, salvo que el gemba de la historia concluya que
  esa interacción concreta no lo necesita

Given un usuario con `prefers-reduced-motion` activado en el sistema
When interactúa con cualquier parte animada de la app
Then las animaciones se reducen o eliminan según esa preferencia
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `ExploreView` con un hueso ya seleccionado | El usuario selecciona otro hueso en el esqueleto 3D | El resaltado y el panel de identidad transicionan al nuevo hueso en vez de reemplazarse de golpe |

## In scope

- Auditar la app completa (`ExploreView`, `BoneDetailView`/`BoneSheet`,
  `BoneNavigator`, `AboutPanel`, `FichasAccordion`, retroalimentación del
  motor de test) con las skills de animación disponibles
  (`find-animation-opportunities`, `animate`, `animation-vocabulary`,
  `improve-animations`) para levantar un inventario de oportunidades.
- Implementar las oportunidades que el gemba de diseño de esta historia
  juzgue que valen la pena, con su propio criterio de qué mejora
  observable justifica el costo.
- Respetar `prefers-reduced-motion` en toda animación nueva o tocada.

## Out of scope

- Cambios al modelo 3D, la geometría de las mallas o el motor de
  renderizado en sí (`SkeletonScene`, `IsolatedBoneScene`) más allá de
  las transiciones de cámara/encuadre que ya son parte de la interfaz.
- Funcionalidad nueva no relacionada con animación.
- Rediseño visual (color, tipografía, layout) que no sea consecuencia
  directa de introducir una transición.

## Done when

- Cada pantalla/interacción relevante tiene un veredicto registrado:
  mejorada, o explícitamente descartada con el porqué.
- Las animaciones introducidas respetan `prefers-reduced-motion` en toda
  la app, no solo en el componente tocado primero.
- El gate rápido (`./scripts/check`) sigue en verde.

## Notes

Historia standalone, sin épica contenedora. El inventario de
oportunidades concretas (qué componente, qué transición, qué prioridad)
es trabajo de `story-design`, no de este scope — este documento fija el
límite, no la lista.
