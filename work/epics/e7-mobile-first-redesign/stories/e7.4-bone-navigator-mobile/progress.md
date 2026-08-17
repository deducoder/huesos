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

## T3 · El nombre más largo no se recorta, y el desplazamiento total baja

- **RED → verde a la primera**, sobre la implementación de T2. Las dos
  aserciones pasaron sin cambios en el componente: el nombre de 44 caracteres
  aparece completo en el DOM, y el alto total —**6.176 px**— ya quedaba por
  debajo del límite de 6.208.

**El número real no confirmó la proyección del design, y valía la pena
mirarlo antes de darlo por bueno.** `design.md` proyectó 5.720 px (−8%) con un
prototipo sin relleno vertical alguno; el componente real llevaba
`py-0.5` en la fila emparejada —para dar un poco de aire entre filas— que el
prototipo no tenía. Esos 2 px por lado en 86 filas explican buena parte de la
diferencia entre 5.720 y 6.176.

**Se quitó el `py-0.5`** para acercar el componente real al prototipo que
sustentaba la decisión, y se remidió: **5.832 px, un 6% menos que hoy** —
verificado con captura, sigue leyéndose bien sin ese aire extra; los bordes de
las píldoras ya marcan la separación entre filas. Sigue sin igualar el 8%
proyectado —el prototipo no tenía en cuenta el `gap-y-1` que sí hace falta
para separar el nombre de las píldoras cuando envuelven a dos líneas—, pero es
la cifra real, medida sobre el componente que se está cerrando, no sobre un
archivo HTML aislado.

- **Gates:** `./scripts/check` verde · suite de navegador entera verde (11/11).
