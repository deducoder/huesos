# Story e7.9: Escritorio como ampliación — Progress

## T1 · Explorar: navegador visible + tarjeta acotada

- **RED:** navegador con `boundingBox().width === 1` (invisible por
  `sr-only`); tarjeta de identidad con 1248 px de ancho (>50% del lienzo).
- **GREEN:** grid `md:grid-cols-[22rem_1fr]`, `sr-only md:not-sr-only` en el
  navegador, escena+tarjeta movidas a su propio `relative` para que sus
  `absolute` no salten a las dos columnas, tarjeta con `md:max-w-sm
  md:inset-x-auto md:left-4 md:right-auto`.
- **Gates:** `./scripts/check` verde · `explore.spec.ts` (4/4) y
  `mobile-shell.spec.ts` (11/11) verdes — confirma que ADR-010 sigue
  intacto: el navegador sigue siendo la misma vía de teclado, solo cambia
  su visibilidad por breakpoint.

## T2 · Fichas: contenedor acotado

- **RED:** medido el ancho de la `<li>` de un par (no del `<span>` del
  nombre — ese span crece por `flex-1` y su propio `boundingBox()` no
  delata el vacío visual, aunque el vacío exista): 1264 px.
- **GREEN:** `md:mx-auto md:max-w-2xl` en el contenedor de `App.tsx`; cero
  cambios en `BoneNavigator` — mismo componente, contenedor distinto.
- **Gates:** `./scripts/check` verde · spec nuevo + `mobile-shell.spec.ts`
  verdes (15/15).

## T3 · Vistas de test: barra de respuesta acotada

- **RED:** barra de respuesta en "Hueso aislado" con 1248 px de ancho.
- **GREEN:** `md:mx-auto md:max-w-3xl` en el `div` raíz de `TestQuestion` —
  acota escena y barra juntas, sin reordenar el layout vertical existente.
  Cubre las dos vistas de test (`SkeletonTestView` y `BoneTestView`
  comparten `TestQuestion`, sin duplicar el fix.
- **Gates:** `./scripts/check` verde · spec nuevo + `explore.spec.ts` +
  `mobile-shell.spec.ts` verdes (20/20 en conjunto).

Nada que el plan no anticipara — los tres GREEN fueron exactamente la clase
`md:` que el diseño había previsto. El único ajuste sobre el plan fue en el
propio RED de la Task 2: medir el `<span>` del nombre en vez de la `<li>`
daba un falso verde (ver nota arriba) — se corrigió antes de escribir el
GREEN, así que el plan no quedó desalineado con lo implementado.

## T4 · Verificación manual — no realizada

Gates automáticos y Playwright a 1400×900 verdes. Nadie abrió la aplicación
en un monitor real ni comparó 390×844 a ojo tras el cambio. Riesgo aceptado
pendiente de decisión explícita del usuario — mismo patrón que e7.6, e7.7 y
e7.8, con la diferencia de que esta historia sí quedó cubierta por
Playwright real (no solo por tests unitarios) en el ancho que cambia.

## Cierre

**Chequeo de tests huérfanos:** `ExploreView.test.tsx`, `App.test.tsx`,
`TestQuestion.test.tsx`, `BoneDetailView.test.tsx` y
`tests/privacy-runtime.test.tsx` importan los tres módulos tocados y no
fueron editados — los 234 tests unitarios siguen verdes sin cambios, lo
esperable: jsdom no computa `md:`, así que estos tests nunca podían ver ni
romperse por este cambio. La cobertura real de esta historia vive en
Playwright (`e2e/desktop-scale-up.spec.ts`, nuevo).

**Criterios de aceptación:**

| Criterio | Estado |
|---|---|
| Must 1 · navegador visible + medible en Explorar a 1400×900 | cumplido |
| Must 2 · tarjeta de identidad acotada | cumplido |
| Must 3 · fila de Fichas acotada | cumplido |
| Must 4 · barra de respuesta acotada en ambas vistas de test | cumplido |
| Must NOT · 390×844 sin cambios | cumplido — 11/11 de `mobile-shell.spec.ts` verdes sin tocar el spec |
| Should · navegador sigue accesible por teclado en ambos anchos | cumplido — mismo componente, mismo `aria-pressed`, sin duplicar |

**Gates finales:** `./scripts/check` verde (234 tests unitarios) ·
`npx playwright test e2e/desktop-scale-up.spec.ts e2e/explore.spec.ts
e2e/mobile-shell.spec.ts` verde (20/20).
