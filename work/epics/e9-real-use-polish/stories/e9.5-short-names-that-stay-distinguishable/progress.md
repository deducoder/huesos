# Story e9.5: Short names that stay distinguishable — Progress

## T1 · El catálogo declara el género gramatical de cada nombre

**Done.** `gender: 'm' | 'f'` obligatorio en `BoneCore`, y los 206 valores en
`catalog.ts`. Tres afirmaciones nuevas en la prueba de integridad: existencia,
coherencia por nombre, y cuatro casos conocidos traídos desde fuera del
catálogo.

- **RED:** 2 de 9 fallaron — el de existencia (`toContain(hueso.gender)`) y el
  de los casos conocidos. El de coherencia **pasó en rojo**, y era previsible:
  con el campo ausente, todas las entradas son `undefined` y por tanto
  coherentes entre sí. Es justamente por qué no puede ser la única afirmación.
- **GREEN:** campo añadido al tipo y valores generados por regla
  (falange/costilla/cuña/vértebra + cinco nombres sueltos → femenino; el resto
  masculino), sobre las 206 entradas.
- **Gate:** `./scripts/check` verde — 37 archivos, 289 tests.

**Lo que el plan no anticipó:** nada en el mecanismo, pero sí una tarea de
lectura que el plan daba por implícita. La regla generadora no se puede dar por
buena porque los tests pasen: cubren 4 casos de 120. Se leyeron **los 120
nombres únicos con su género asignado**, uno a uno, antes de commitear — 70
femeninos y 50 masculinos, todos correctos. El reparto por lado es 47 de los 86
nombres con lado, más 23 impares (22 vértebras y la mandíbula).

## T2 · La derivación del nombre corto, con su gate sobre el catálogo real

**Done.** `src/components/bone-name.ts` con `shortName` y
`TECHO_NOMBRE_CORTO = 26`; seis pruebas, tres de derivación y tres de gate.

- **RED:** el primer rojo fue el `import` de un módulo inexistente —«no
  tests»—, que **no prueba nada**: ninguna aserción llegó a evaluarse. Se
  escribió un stub que devuelve su argumento y se volvió a mirar: **5 de 6 en
  rojo, y la de unicidad en verde**. Es la demostración empírica de por qué el
  plan exigía la tercera afirmación: con la derivación desactivada, el techo y
  la unicidad se cumplen solos —los nombres del catálogo ya son únicos— y solo
  «se aplica de verdad a la familia que la motiva» lo atrapa.
- **GREEN:** tabla de 17 ordinales, elisión de «del … dedo de la mano/del pie»
  y capitalización.
- **Gate:** `./scripts/check` verde — 38 archivos, 295 tests.

**Lo que el plan no anticipó:** que el propio RED necesitaba un andamiaje para
ser observable. Un módulo que no existe da rojo por razones que no dicen nada
del comportamiento; el stub identidad convierte ese rojo en información.

## T3 · El lado concuerda en género, y los dos nombres que consume la vista

**Done.** `sideLabel(side, gender)`, `visibleName` y `fullName` en
`bone-name.ts`, con fixtures tomados del catálogo real, no construidos a mano.

- **RED:** 4 pruebas nuevas en rojo, las cuatro evaluando de verdad
  (`TypeError: sideLabel is not a function`). Las cuatro combinaciones de
  lado × género se afirman por separado: una función simétrica probada de un
  solo lado promete la mitad.
- **GREEN:** `sideLabel` con los dos argumentos requeridos —es lo que hará que
  el compilador nombre a cada llamador cuando `SIDE_LABEL` se vaya en T8—,
  `visibleName` sobre `shortName` y `fullName` sobre el `es` íntegro.
- **Gate:** `./scripts/check` verde — 299 tests.

**Decisión menor, registrada:** el género llega también a `fullName`, no solo
al visible. La asimetría de ADR-014 es sobre el **acortado**, que es una
concesión al ancho de una pantalla; escribir mal el género no lo pedía ninguna
pantalla, así que un lector de pantalla oye «clavícula derecha».

## T4 · El navegador de Explorar muestra corto y anuncia completo

**Done.** Texto visible corto en las filas simples, en el nombre de las filas
pareadas y en el par colapsado; `aria-label` explícito con el nombre íntegro
en los tres. `accessibleName` y los ids `nombreId`/`ladoId` se fueron con
`aria-labelledby`.

- **RED:** 3 en rojo — fila simple (la duodécima torácica, impar y de las que
  el acortado toca), píldora pareada (la falange, con el nombre accesible
  completo) y concordancia de género.
- **GREEN:** las píldoras pasan de `aria-labelledby={nombre lado}` a
  `aria-label={fullName(bone)}`. El riesgo que el plan marcaba como el
  desconocido de la historia no se materializó: el fallback del span `sr-only`
  no hizo falta.
- **Gate:** verde a la segunda — 302 tests. La primera pasada fue **roja de
  verdad, en un test que esta historia no había tocado**.

**Lo que el plan no anticipó — un test huérfano que codificaba el defecto:**
`ExploreView.test.tsx:139` afirmaba `/^tibia izquierdo$/i`. No es una prueba
que se rompiera por el cambio: es una prueba que **exigía el bug**. Su vecina
de la línea 93 era peor —`/^tibia izquierda$|^tibia izquierdo$/i`, un
localizador que aceptaba las dos formas y por tanto no podía fallar con
ninguna—. Las dos endurecidas a la forma correcta. Un doble que no puede
fallar como el original no vigila nada.

**Pendiente conocido:** seis localizadores de `e2e/mobile-shell.spec.ts` traen
el género viejo («clavícula derecho», «tibia derecho», «falange media del
quinto dedo del pie derecho»). Todavía pasan porque miran la grilla de Fichas,
que es T5 — donde el plan ya los tiene asignados.

## T5 · La grilla de Fichas, sus subgrupos capitalizados y el guardia e2e

**Done.** Etiquetas cortas con el lado concordado y `aria-label` completo;
`subLabel` capitaliza; `accessibleName` fuera también de este archivo.

- **RED:** 3 en rojo — etiqueta corta con anuncio completo, concordancia de
  género, y «Neurocráneo»/«Cara».
- **GREEN:** `visibleName` / `fullName` en las tres ramas de la grilla (simple,
  par, y par sin geometría en ningún lado).
- **Gate:** `./scripts/check` verde — 305 tests. `npx playwright test
  mobile-shell` **22 de 22**, con los puertos 4173-4175 comprobados libres
  antes de arrancar: un servidor sobrante habría medido un build viejo.

**El guardia de e8.2 cambió de sujeto y ganó la mitad que le faltaba.** Antes
afirmaba que el nombre de 44 caracteres estaba visible sin recortar. Ahora
afirma las dos cosas que la separación de ADR-014 exige: que el texto visible
es «Falange proximal 2.º mano derecha» —entero, con `toHaveText`, no por
substring— y que el botón sigue localizándose por el nombre íntegro del
catálogo. Con una sola de las dos mitades, acortar de más o perder el nombre
accesible habría pasado en verde.

**Tres localizadores e2e traían el género equivocado** («clavícula derecho»,
«tibia derecho», «falange media del quinto dedo del pie derecho») y ahora
concuerdan. Un grep de las siete familias femeninas sobre `e2e/` y `src/`
confirma que no queda ninguno.

## T6 · El título de la ficha y el panel de identidad

**Done.** Título corto en `BoneSheet` y en `BoneIdentity`, lado concordado en
las dos filas «Lado», y el anuncio `role="status"` del panel de identidad con
el nombre íntegro.

- **RED:** 5 en rojo, tres de la ficha y dos del panel.
- **GREEN:** `shortName` en los dos títulos, `sideLabel` en los dos lados, y
  una fila «Nombre completo» nueva en la ficha.
- **Gate:** `./scripts/check` verde — 310 tests.

**La fila «Nombre completo» aparece solo cuando el acortado quitó algo.**
Comparar el corto con el `es` en minúsculas distingue los 75 nombres que la
derivación cambia de los 45 que solo capitaliza; en un fémur, una fila que
repitiera «fémur» debajo del título «Fémur» no informaría de nada. Es la única
decisión de esta tarea que el design no traía escrita.

## T7 · Las tres opciones del test

**Done.** `{opcion.es}` → `{shortName(opcion.es)}`. El estado posterior a la
respuesta no se tocó: eso es e9.2.

- **RED:** 1 de 2 en rojo. El otro —«revela el nombre completo del catálogo
  cuando se falla»— **pasó en verde desde el principio**, y se queda: es un
  guardia, no una funcionalidad. Afirma por igualdad exacta
  (`${bone.es} / ${bone.la}`), así que acortar el revelado lo rompe.
- **GREEN:** una línea. Las opciones no llevan lado, y no es un olvido:
  `pickDistractors` nunca elige al hermano del hueso preguntado ni deja dos
  hermanos entre sí **porque el lado no está en el nombre** — añadirlo aquí
  invalidaría esa garantía.
- **Gate:** `./scripts/check` verde — 312 tests.

**Dos tests existentes localizaban las opciones por `bone.es`** (`:208`,
`:237`) y rompieron. Actualizados a `shortName(bone.es)`: siguen afirmando lo
mismo —que una de las tres opciones es el hueso preguntado— sobre el texto que
ahora se muestra.

**Por qué el test nuevo es falsable para cualquier hueso sorteado:** compara
cada opción contra el conjunto de los 120 nombres cortos. Mostrar el `es` del
catálogo falla siempre, incluso en los 45 nombres que la derivación no acorta,
porque el corto va capitalizado y el `es` no.
