# Story e7.8: Modo test — Scope

## User story

As a estudiante respondiendo el modo test en su teléfono,
I want tocar «Responder», «Siguiente pregunta» y elegir la variante sin
apuntar,
so that las seis vistas de la aplicación terminen de compartir el mismo
mínimo táctil.

## Acceptance criteria

```gherkin
Given la elección de variante de test en 390×844
When se miden sus dos botones
Then miden 44×44 px o más — contra los 42×175 px de hoy

Given una pregunta pendiente de responder en 390×844
When se miden el campo de texto y el botón «Responder»
Then miden 44 px de alto o más — contra los 38 px de hoy — y siguen en la
     misma fila, sin desbordar el ancho del viewport

Given una respuesta ya evaluada
When se mide el botón «Siguiente pregunta»
Then mide 44×44 px o más — contra los 34×144 px de hoy

Given las dos vistas de test (esqueleto completo, hueso aislado)
When se abre cada una
Then comparten el mismo `TestQuestion` sin diferencias — es el mismo
     componente para las dos, como ya lo es hoy
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| «Esqueleto completo» | medir | ≥ 44×44 px (hoy: 42×175) |
| Input + «Responder», en fila | medir cada uno | ambos ≥ 44 px de alto, sin desbordar 390 px de ancho (hoy: 16+249.5+…+374, con margen) |
| «Siguiente pregunta» | medir | ≥ 44×44 px (hoy: 34×144) |

## In scope

- **Los tres controles interactivos de `TestQuestion` y `ElegirVarianteDeTest`**
  al mínimo táctil: el campo de respuesta, «Responder», «Siguiente
  pregunta», «Esqueleto completo», «Hueso aislado».
- **Verificar que el campo y el botón siguen en una fila** al crecer a 44 px
  de alto — el ancho no cambia, así que no debería romper, pero se mide, no
  se asume.

## Out of scope

- **Tocar `SkeletonScene`, `IsolatedBoneScene`, `pickTestableBone` o
  `isCorrectAnswer`** — el modo test ya funciona; esta historia es visual.
- **Agregar tipografía display** — ni `ElegirVarianteDeTest` ni
  `TestQuestion` tienen un título, solo texto de cuerpo; ADR-008 reserva la
  display para títulos.
- **Pulido visual más allá de los objetivos táctiles** (jerarquía del texto
  de resultado, etc.) — queda para el cierre de la épica, según ya se
  decidió en e7.4/e7.6.

## Done when

- En 390×844: los cinco controles listados miden 44 px o más en su
  dimensión menor.
- El campo de respuesta y «Responder» siguen en la misma fila, sin desbordar
  el viewport.
- `./scripts/check` en verde; `TestQuestion.test.tsx`,
  `SkeletonTestView.test.tsx` y `BoneTestView.test.tsx` siguen verdes.

## Notes

- Gemba del 2026-08-17 al arrancar, medido en navegador: «Esqueleto
  completo» 42×175, campo+«Responder» 38 px de alto cada uno (input
  x=16 ancho=249.5, botón x=273.5 ancho=100.5 — cabe en 390 con margen),
  «Siguiente pregunta» 34×144.
- **El diseño de la épica decía que el campo y el botón «no caben cómodos en
  390 px» — medido, sí caben.** El problema real es el mínimo táctil (38 px,
  no 44), no el ancho. Crecer la altura no debería afectar el ancho ya
  medido, pero la Tarea de implementación lo verifica en vez de asumirlo.
- `SkeletonTestView` y `BoneTestView` no tienen navegador ni panel de
  identidad — ninguna de las dos vías accesibles de otras vistas aplica
  acá; el texto ya lo explica (`accessibleHint`/`accessibleLabel` correctos,
  verificado, sin mención de listas).
