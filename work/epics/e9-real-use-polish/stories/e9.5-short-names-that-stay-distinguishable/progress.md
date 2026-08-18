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
