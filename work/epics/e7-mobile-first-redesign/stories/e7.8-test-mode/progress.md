# Story e7.8: Modo test — Progress

## T1 · Elección de variante al mínimo táctil

- **RED:** los dos botones fallaban con 42 px de alto.
- **GREEN:** `min-h-tactil rounded-suave border-2`, mismo patrón del resto
  del rediseño.
- **Gates:** `./scripts/check` verde.

## T2 · El campo y sus dos botones al mínimo táctil

- **RED:** campo y «Responder» fallaban con 38 px; «Siguiente pregunta» con
  34.
- **GREEN:** las tres clases del design. El campo y «Responder» **no se
  desbordaron** al crecer a 44 px de alto — el ancho no cambia con la
  altura, tal como el scope había anotado, y esta tarea lo verificó en vez
  de darlo por sentado.
- **Gates:** `./scripts/check` verde · suite de navegador entera verde
  (16/16). Verificado con captura.

Nada que el plan no anticipara.

## T3 · Verificación manual — no realizada

El usuario pidió cerrar directamente. Gates automáticos verdes; nadie probó
los cinco controles con el dedo en un teléfono real para esta historia.
Riesgo aceptado por decisión explícita, mismo patrón que e7.6 y e7.7.

## Cierre

**Chequeo de tests huérfanos:** `TestQuestion.test.tsx`,
`SkeletonTestView.test.tsx`, `BoneTestView.test.tsx` y `App.test.tsx` no
fueron tocados y siguen verdes.

**Criterios de aceptación:**

| Criterio | Estado |
|---|---|
| Must 1 · los cinco controles ≥ 44 px | cumplido |
| Must 2 · campo+«Responder» sin desbordar | cumplido — verificado, no asumido |
| Must NOT 1 · sin tocar escenas/dominio del test | respetado |
| Must NOT 2 · sin tipografía display | respetado |

**Gates finales:** `./scripts/check` verde (233 tests) ·
`npx playwright test` verde (16/16).
