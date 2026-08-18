# Story e9.4: The skeleton test zooms to what it asks — Progress

## T1 · `SkeletonHalf` reporta la caja del hueso seleccionado

**Done.** El `traverse` que ya calculaba `esteHueso` para el resaltado de
color ahora también expande una `Box3` cuando `resaltado` es verdadero, y
reporta el resultado por `onSelectedBox` tras el recorrido completo —
`null` si esta mitad no tiene la malla.

- **RED:** 1 en rojo — la aserción de que no compara por
  `malla.name === selected` pasaba (nunca lo hizo), la de `onSelectedBox?.(`
  fallaba porque el código no existía.
- **GREEN:** se reutiliza `esteHueso`/`resaltado`, ya calculados; no hay una
  segunda comparación. `copia.updateMatrixWorld(true)` antes de expandir la
  caja — mismo motivo que `IsolatedGroup` ya documenta: `expandByObject` lee
  `matrixWorld`, y react-three-fiber la recalcula en su propio ciclo, no
  necesariamente antes de que este efecto corra.
- **Mutación forzada:** cambiar el reporte a comparar por
  `malla.name === selected` puso en rojo **dos** pruebas, no una — también
  la que ya vigilaba el resaltado de color, porque la reescritura tocó la
  misma línea que ese guardia protege. Confirma que las dos protecciones
  siguen atadas al mismo mecanismo, como el diseño pretendía.
- **Gate:** `./scripts/check` verde — 322 tests.

## T2 · `CenteredSkeleton` combina, encuadra, y la cámara pasa a controlada

**Done.** `Canvas` deja de recibir `camera` como prop estática; una
`<PerspectiveCamera>` propia (`CamaraDelEsqueleto`, calcada de
`CamaraEncuadrada` en `IsolatedBoneScene.tsx`) reacciona a un estado
`framing` que `CenteredSkeleton` calcula combinando las dos cajas que T1
reporta. Sin `zoom` o sin caja encontrada, el encuadre es
`encuadrePorDefecto()` — la misma llamada a `distanceToFit(TARGET_HEIGHT,
FOV)` que existía, ahora nombrada.

- **RED:** 2 en rojo — la ausencia de `<PerspectiveCamera` (y la presencia
  de `<Canvas camera={{`), y la ausencia de `frameObject`/`?? 0`.
- **GREEN:** los refs `cajaOriginal`/`cajaMirrored` se combinan en un
  `useLayoutEffect` del padre que corre después de los de las dos mitades
  hijas, en el mismo commit — la propiedad de orden que el plan marcaba
  como riesgo sin test posible.
- **Un ajuste no anticipado por el plan: `OrbitControls` también necesita
  seguir `framing.center`.** Sin esto, la cámara quedaría posicionada sobre
  la zona señalada pero mirando hacia el origen del esqueleto —el mismo
  error que `IsolatedBoneScene` corrigió con `setViewOffset` en vez de
  mover la cámara, pero del lado del `target` de los controles, no de la
  proyección. Se agregó `target={[framing.center.x, framing.center.y,
  framing.center.z]}`, reemplazando el `[0, 0, 0]` fijo.
- **Fricción con el linter, no con el diseño.** `useExhaustiveDependencies`
  marcaba `selected` como dependencia innecesaria del efecto combinador,
  porque no se lee dentro del cuerpo —solo las refs que dos efectos hijos
  ya escribieron—. Es exactamente el caso que el comentario de la regla
  advierte («mutar una ref no dispara este efecto»): `selected` sigue
  siendo la señal correcta para recalcular, así que se documentó con
  `biome-ignore` en vez de quitarlo. Biome exige el comentario de
  supresión en una sola línea, pegado al nodo — el primer intento con la
  explicación repartida en varias líneas no lo reconoció.
- **Tres mutaciones forzadas, las tres confirmadas:** volver a `Canvas
  camera={{...}}` estático rompe la propiedad (a); quitar `?? 0` de
  `reservedBottom` rompe (c) — dejaría `ExploreView` con un
  `reservedBottom` `undefined` si algún día pasa `selected` sin `zoom`.
- **Gate:** `./scripts/check` verde — 324 tests.

## T3 · `SkeletonTestView` conecta `reservedBottom` al zoom

**Done.** `renderScene` consume el segundo argumento (`reservedBottom`, que
e9.2 ya calcula y este componente ignoraba) y lo pasa como
`zoom={{ reservedBottom }}`.

- **RED:** 1 en rojo, con el mock extendido para capturar `zoom` en un
  objeto module-level (`capturado.zoom`), no en un atributo de texto del
  DOM — el mismo error que casi se comete en e9.2 T3 (`!== ''` pasa con
  cualquier valor serializado) no se repitió esta vez porque el plan ya lo
  nombraba explícitamente.
- **Un obstáculo real de TypeScript, no del diseño.** La primera versión
  del test —`capturado.zoom = undefined` seguido de `render(...)` y después
  `capturado.zoom?.reservedBottom`— daba `error TS2339: Property
  'reservedBottom' does not exist on type 'never'`. Reproducido en
  aislamiento fuera del proyecto: TypeScript estrecha una propiedad de
  objeto al tipo de su última asignación **visible en el mismo flujo**, y
  no la ensancha de vuelta al pasar por una función externa que la
  reasigna (el mock, un closure distinto) — el estrechamiento a `undefined`
  sobrevive a través de `render()`, y el chequeo opcional `?.` termina
  evaluándose contra `never` porque no queda ninguna rama con forma de
  objeto. Solución: envolver el reinicio en una función (`resetearZoom()`)
  en vez de una asignación directa — a través de una llamada, TypeScript no
  arrastra el estrechamiento. Confirmado con una reproducción mínima antes
  de aplicar el cambio al archivo real.
- **GREEN:** una línea en `SkeletonTestView.tsx`.
- **Mutación forzada:** quitar `zoom={{ reservedBottom }}` deja
  `capturado.zoom` en `undefined` y pone el test en rojo.
- **Gate:** `./scripts/check` verde — 325 tests.

## T4a · Hallazgo de la verificación manual: el plano cercano recortaba huesos chicos

**Reportado por el humano:** «hace zoom aleatorio, a veces ni se ve el
esqueleto en la primer pregunta … hace demasiado y colisiona, ocultando el
hueso en la cámara».

**Reproducido antes de tocar nada.** Diez preguntas seguidas, midiendo qué
fracción del lienzo queda clara (el hueso) en cada una: la primera dio
16,0 % — pero la captura mostraba el lienzo **completamente vacío**, no un
encuadre ajustado. No era "la primera pregunta": `pickTestableBone` sortea
al azar, y cualquier hueso chico habría dado lo mismo.

**Causa, confirmada con un número real, no con sospecha.** Se instrumentó
`CenteredSkeleton` con un `console.log` temporal del encuadre calculado.
Para «cuña intermedia» (un hueso del tarso, diminuto): `distance:
0.0588`. El plano cercano por defecto de three.js es `0.1` — la cámara
quedaba **detrás** del hueso, que es justo lo que `IsolatedBoneScene.tsx`
ya había resuelto con `near={0.001}` desde e4.4 (documentado ahí mismo:
"la falange proximal del quinto dedo de la mano … el lienzo queda en
blanco sin ningún error"). `CamaraDelEsqueleto`, el componente nuevo de
esta historia, no lo tenía: un `IsolatedBoneScene.tsx` bien leído durante
el diseño debería haber hecho evidente el paralelo, y no lo hizo hasta que
apareció en el teléfono.

- **RED:** una afirmación de código fuente —`near={0.001}` presente—, en
  rojo antes del fix.
- **GREEN:** el mismo valor, en el mismo lugar, con el mismo comentario que
  ya cita `IsolatedBoneScene.tsx`.
- **Verificado con volumen, no con una corrida:** 10 preguntas seguidas
  tras el fix, ninguna por debajo de 16 % —y la de 16 % ahora **sí** muestra
  hueso real, verificado visualmente, no solo por el número de píxeles
  claros—. Tres capturas a mano confirmaron el rango completo: una falange
  diminuta, una costilla, una vértebra — las tres visibles y con margen.
- **Gate:** `./scripts/check` verde — 326 tests.

**Lo que el diseño no anticipó:** el patrón que `IsolatedBoneScene.tsx`
establece no es solo el mecanismo de la cámara controlada —eso sí se
copió— sino también sus **compañeros de viaje**: el `near` ajustado es
parte del mismo paquete, no un detalle aparte, y esta historia zoomea
sobre huesos individuales exactamente igual que aquella aísla huesos
individuales. El mismo rango de tamaños, el mismo riesgo.

## T4b · Hallazgo de la verificación manual: la primera pregunta encuadraba en el espacio sin normalizar

**Reportado por el humano tras el fix del plano cercano:** «el primero
sigue fallando, el zoom aparece con vista superior y el esqueleto queda
fuera de cámara, solo en el primer caso, el resto está excelente».

**Reproducido en carga fresca, no solo en la primera pregunta de una
sesión ya iniciada** —distinción importante: el defecto es del **montaje**,
no del **orden**—. Cuatro cargas nuevas de la página, siempre igual:
lienzo vacío en la primera pregunta, con huesos grandes («radio») y
chicos por igual — descartando que fuera el mismo bug del plano cercano
(T4a), que era específico de huesos diminutos.

**Causa, confirmada con la matriz real, no con sospecha.** Instrumentado
`copia.parent?.matrixWorld` justo antes de `updateMatrixWorld`: su
traslación medía `[0, 0, 0]` —identidad— en el primer commit, aunque el
`<group position={offset} scale={scale}>` de `CenteredSkeleton` declara un
`offset` con `Y` bien distinto de cero. `Object3D.updateMatrixWorld`
propaga **hacia abajo**, nunca hacia arriba: llamarlo sobre `copia` (T1)
recomputa la subrama de `copia` a partir de la matriz que su padre tenga
**en ese momento**, y en el primer commit ese padre —el grupo con el
offset— todavía no había corrido su propio cálculo. La caja mundial del
hueso seleccionado salía calculada en el espacio del activo sin
normalizar, con un centro que no correspondía a dónde el hueso se ve
realmente en pantalla.

**Por qué solo la primera pregunta:** de la segunda en adelante, la matriz
del grupo ya quedó resuelta por el ciclo de render de react-three-fiber en
el frame anterior, así que el mismo código —sin cambiar— ya lee un padre
correcto. El defecto nunca fue "la primera pregunta" como concepto: es "el
primer commit desde que el grupo con offset existe", que normalmente
coincide con la primera pregunta de una carga fresca.

- **GREEN:** `copia.parent?.updateMatrixWorld(true)` en vez de
  `copia.updateMatrixWorld(true)` — un nivel más arriba, que es
  exactamente el nivel donde vive el offset que faltaba aplicar.
- **Verificado con 8 cargas frescas**, ninguna en blanco (24,3 %–65,3 % de
  píxeles claros, contra 0 huesos visibles antes del fix). Tres capturas a
  mano confirman encuadre correcto, sin vista superior ni hueso fuera de
  cámara: una falange, un cóccix, y una tercera revisada también en
  regla.
- **Gate:** `./scripts/check` verde — 326 tests (sin tests nuevos: es una
  corrección de una línea sobre un mecanismo que T1 ya cubría con su
  propia prueba fuente, que sigue en verde porque el patrón de llamada
  —`updateMatrixWorld(true)`— no cambió de forma, solo de sobre qué
  objeto se invoca).

**Lo que ni el diseño ni T1 anticiparon:** `IsolatedGroup`
(`IsolatedBoneScene.tsx`) no tiene este problema porque no existe un grupo
exterior con `offset`/`scale` por encima del que mide su propia caja —su
`groupRef` **es** la cima de la jerarquía relevante. `CenteredSkeleton`
introdujo, sin que el diseño lo notara, un nivel de anidamiento que
`IsolatedGroup` nunca tuvo, y el patrón copiado —correcto en su origen— no
alcanzaba un nivel más arriba en el nuevo contexto.
