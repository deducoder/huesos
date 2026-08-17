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

## T3.5 · Los pares sin geometría en ningún lado colapsan a una fila

Hallazgo del usuario en la verificación manual de T4: los osículos del oído
—martillo, yunque, estribo, los 6 sin malla en ningún lado— mostraban dos
píldoras de lado que no distinguen nada observable: mismo motivo de ausencia,
nunca aparecen en la escena, y `pickTestableBone` ya los excluye del modo
test. Decisión del usuario: colapsar a una sola fila, seleccionando el lado
derecho por convención al tocarla.

- **RED:** `src/components/BoneNavigator.test.tsx` — se reescribió el ejemplo
  de "martillo izquierdo" a "martillo" y se añadieron dos pruebas nuevas: un
  par totalmente ausente no ofrece elegir lado; un par con geometría en ambos
  —fémur— sigue ofreciéndolo. **Esto rompe deliberadamente el Must 4 del
  scope** («`BoneNavigator.test.tsx` sigue verde sin reescribirse»): el
  comportamiento cambió a propósito, no por descuido, y se reescribió el test
  para que siga protegiendo lo que ahora es cierto.
- **GREEN:** en `BoneNavigator.tsx`, la fila `paired` comprueba si
  `right.meshName === null && left.meshName === null`; si es así, renderiza
  una fila simple con el nombre común, seleccionando `fila.right.id`.
- **Dos consumidores huérfanos encontrados y corregidos** —el chequeo que
  `story-implement` exige antes de cerrar—: `ExploreView.test.tsx` también
  usaba "martillo izquierdo" como su ejemplo de "hueso sin geometría
  seleccionado desde la lista", y esperaba `data-hueso="malleus-left"`.
  Actualizado a "martillo" / `malleus-right`, conservando la aserción de fondo
  —la escena recibe el id igual, el panel explica la ausencia—. Verificados y
  descartados como no afectados: `selection.test.ts` y `BoneIdentity.test.tsx`
  usan `malleus-left` operando sobre el dato directamente (`findBone`, prop
  directa), no a través del navegador — el id sigue existiendo en el
  catálogo, solo cambió cómo se alcanza desde la lista.
- **Gates:** `./scripts/check` verde, **219 tests** (217 + 2 nuevos) ·
  suite de navegador entera verde (11/11). Verificado con captura: martillo,
  yunque y estribo se ven como filas simples, igual que hioides.

## T4 · Verificación manual

Hecha por el usuario en el teléfono, por el túnel. Veredicto: **funciona** —
recorrido de la lista, píldoras de lado distinto, impares sin píldoras, aviso
de «no representable» intacto. Encontró en el camino el caso de los pares
totalmente ausentes (T3.5), arreglado antes de este cierre.

**Decisión del usuario, registrada:** el pulido visual fino del navegador —y
de la interfaz en general— se deja para el cierre de la épica, no historia por
historia.

## Cierre

**Chequeo de tests huérfanos:** ampliado por lo que encontró T3.5. Todos los
consumidores de `BoneNavigator`, `martillo`/`malleus-*` y `toNavigatorRows`
fueron revisados: `BoneNavigator.test.tsx` y `ExploreView.test.tsx` se
actualizaron a propósito (T3.5); `selection.test.ts` y `BoneIdentity.test.tsx`
se verificaron como no afectados y no se tocaron.

**Criterios de aceptación:**

| Criterio | Estado |
|---|---|
| Must 1 · toda píldora y fila simple ≥ 44×44 px | cumplido |
| Must 2 · nombre más largo sin truncar | cumplido |
| Must 3 · desplazamiento total no crece | cumplido — 5.832 px, −6% (no el −8% proyectado; ver T3) |
| Must 4 · `BoneNavigator.test.tsx` verde sin editar | **roto a propósito en T3.5** — reescrito para un cambio de comportamiento real, no accidental |
| Must 5 · ningún hueso se pierde sin fila | cumplido |
| Should 1 · sombra solo en la seleccionada | cumplido |
| Must NOT 1 · dominio intacto | respetado |
| Must NOT 2 · lado desde `SIDE_LABEL` | respetado |
| Must NOT 3 · nombre común siempre visible | respetado |

**Gates finales:** `./scripts/check` verde (219 tests) ·
`npx playwright test` verde (11/11).
