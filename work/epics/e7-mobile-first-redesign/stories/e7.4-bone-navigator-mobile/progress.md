# Story e7.4: Navegador de huesos en móvil — Progress

## T1 · `toNavigatorRows`, la función de emparejamiento

- **RED:** `src/domain/navigator-rows.test.ts` no compilaba —el módulo no
  existía— antes que cualquier assert corriera.
- **GREEN:** la función tal como la fija el design. 6/6 en verde, incluido un
  caso que el plan no tenía: **un derecho seguido de un izquierdo real pero
  equivocado tampoco se empareja**. La comparación por id necesitaba probarse
  contra un izquierdo *presente pero incorrecto*, no solo contra su ausencia —
  sin ese caso, un bug que emparejara por posición en vez de por id habría
  pasado igual.
- **Gates:** `./scripts/check` verde. Sobre el catálogo real: 120 filas, 86
  pares, 34 simples, los 206 huesos cubiertos.

## T2 · El navegador consume las filas, en 44 px verificados

- **RED:** `e2e/mobile-shell.spec.ts` — `alto de la píldora "fémur derecho":
  Expected >= 44, Received 28`.
- **GREEN:** `BoneNavigator.tsx` reescrito sobre `toNavigatorRows`. Fila
  `paired`: nombre común + dos píldoras (`min-h-tactil`, `rounded-tarjeta`,
  `border-2 border-tinta`), con `aria-labelledby` componiendo el nombre
  accesible desde el nombre común y la etiqueta de lado. Fila `single`: igual
  que antes, con `min-h-tactil` añadido.
- **Gates:** `./scripts/check` verde ·
  `src/components/BoneNavigator.test.tsx` verde **sin tocarse** —el contrato
  de accesibilidad se sostuvo con el cambio de estructura· suite de navegador
  en 390×844 verde (6/6, `npx vite build` corrido antes).

**Verificación visual, no solo numérica:** capturé el navegador rediseñado con
la aplicación real. Confirma lo que el prototipo predijo: filas cortas con
nombre y dos píldoras en una línea, filas de nombre largo —«falange proximal
del segundo dedo de la mano»— con el nombre envuelto a dos líneas **sin**
agrandar la fila ni desbordar. `esfenoides` y los demás impares siguen como
filas simples sin píldoras.
