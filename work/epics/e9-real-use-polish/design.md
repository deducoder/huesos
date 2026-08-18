# Epic e9: Pulido de uso real — Design

## Gemba findings

- **No hay router, y por eso el «atrás» sale del sitio.** `App.tsx:234`
  navega con un `useState<Modo>` de seis destinos; la aplicación nunca
  empuja una entrada de historial. La hipótesis del reporte —«va por
  camino del router o del DOM»— no se sostiene: es la consecuencia directa
  de ADR-003. **Extender** con la History API, sin dependencia nueva
  (ADR-013).

- **`distanceToFit` solo conoce el FOV vertical** (`src/domain/framing.ts:10`).
  Encuadra `max(x, y, z)` como si fuera altura, y el lienzo del teléfono es
  alto y angosto: con `aspect < 1` el campo horizontal es **más estrecho**
  que el vertical, así que un hueso ancho —coxal, escápula, costilla— se
  sale por los lados aunque su altura quepa. **Extender** la función pura,
  que ya vive en dominio con sus pruebas, en vez de mover el cálculo a la
  escena.

- **La tarjeta tapa el encuadre, y es un segundo defecto.** `BoneDetailView.tsx:63`
  ocupa `inset-x-4 bottom-4 max-h-[45vh]` sobre un lienzo `absolute inset-0`.
  El encuadre centra el hueso en el lienzo entero, no en la zona que queda
  a la vista. Misma síntoma, causa distinta: se corrige aparte.

- **`IsolatedBoneScene` no monta controles.** `SkeletonScene.tsx:222` sí tiene
  `OrbitControls` con `enablePan enableZoom`, y además `FixTouchAction`, un
  `MutationObserver` que reafirma `touch-action: none` porque los controles
  lo reasignan tras el montaje. **Seguir ese patrón** al añadir controles a
  la escena aislada: el problema del gesto ya está resuelto ahí, y
  reinventarlo es repetir e7.2.

- **El color de selección es un token único leído en tres sitios.**
  `--color-acento` (`index.css`) lo consumen la píldora del navegador
  (`BoneNavigator.tsx:12`), el botón y el panel de identidad, las opciones
  del test, y `SkeletonScene.tsx:24`, que lo resuelve en tiempo de
  ejecución para el `emissive` del resaltado 3D. Cambiar el token alcanza
  los tres a la vez — pero el color que más resalta como píldora plana no
  es el mismo que más resalta como emisión sobre hueso beige, así que se
  elige **viendo los tres**, no de una paleta en abstracto.

- **El resultado del test sustituye las opciones en vez de calificarlas.**
  `TestQuestion.tsx:116` cambia el bloque entero por «Correcto/Incorrecto»
  más «Siguiente pregunta». Lo pedido —la elegida en rojo, la correcta en
  verde— conserva la grilla y cambia su apariencia. `@theme` no tiene
  tokens de acierto ni de error; solo `aviso`, que es naranja y significa
  otra cosa (lo que el modelo no representa).

- **El texto visible de un botón de hueso *es* su nombre accesible.**
  `accessibleName` (duplicada a propósito en `BoneNavigator.tsx:7` y
  `FichasAccordion.tsx:17` por ADR-011) produce el `textContent` que oye un
  lector, y `e2e/mobile-shell.spec.ts:45` localiza por
  `name: 'fémur derecho', exact: true`. Acortar el visible sin más
  acortaría los tres. ADR-014 los separa.

- **`toNavigatorRows` ya resuelve el nombre común de un par** y `fila.name`
  sale de `hueso.es` (`navigator-rows.ts:51`). El acortado tiene que pasar
  por ahí también, o las filas pareadas quedarían largas mientras las
  simples se acortan.

- **`src/data/ATTRIBUTION.md` existe y no lo importa nadie.** El modelo es
  CC BY-SA 4.0 y BodyParts3D exige su atribución en forma literal; hoy solo
  está en el repositorio. El menú del punto 9 no agrega una función: cierra
  un incumplimiento. El archivo trae además la advertencia de exactitud que
  sus autores declaran, y el texto del aviso de privacidad ya es verdadero
  y está vigilado por `must-privacy-006`.

- **El hamburguesa es deliberadamente inerte.** `IconoCuadrado`
  (`App.tsx:90`) es un `<div aria-hidden="true">`, y el comentario dice
  por qué: no fingir función. Habilitarlo es convertirlo en `<button>` con
  su panel, no destapar algo que ya estuviera ahí.

- **La cabecera sin esquinas es solo la de la ficha.** `App.tsx:248` usa
  `border-b-2` sobre una barra sólida; la cabecera normal (`App.tsx:265`)
  ya son tres cajas `rounded-suave` flotantes con `shadow-dura`.

- **`subLabel` devuelve el texto tras el «—»** (`FichasAccordion.tsx:22`),
  que da `neurocráneo` y `cara` en minúscula. Las otras ocho regiones
  devuelven la etiqueta completa, ya capitalizada. La normalización pedida
  toca exactamente esos dos.

## Target components

| Component | Change | Purpose |
|-----------|--------|---------|
| `src/index.css` (`@theme`) | modify | Valor nuevo de `--color-acento`; tokens de acierto y error para el resultado del test |
| `src/domain/framing.ts` | modify | `distanceToFit` pasa a conocer el aspect ratio del lienzo y la zona útil |
| `src/components/IsolatedBoneScene.tsx` | modify | Encuadre corregido, `OrbitControls` y el patrón `FixTouchAction` |
| `src/features/bone-detail/BoneDetailView.tsx` | modify | Declara qué parte del lienzo tapa la tarjeta, para que el encuadre la descuente |
| `src/components/SkeletonScene.tsx` | modify | La cámara se acerca a la zona del hueso señalado cuando cambia `selected` |
| `src/features/test/TestQuestion.tsx` | modify | Estado posterior a la respuesta: la grilla se queda y se califica; props opcionales a requeridas |
| `src/components/short-name.ts` | create | La derivación del nombre corto y su capitalización (capa de vista, ADR-014) |
| `src/components/BoneNavigator.tsx`, `FichasAccordion.tsx` | modify | Texto visible corto, `aria-label` completo |
| `src/features/bone-detail/BoneSheet.tsx` | modify | Título corto y el nombre completo como dato de la ficha |
| `src/components/labels.ts` | modify | Capitalización de los dos subgrupos que hoy quedan en minúscula |
| `src/App.tsx` | modify | Historial (ADR-013), cabecera de ficha redondeada, hamburguesa funcional |
| `src/components/AboutPanel.tsx` (o similar) | create | Privacidad, licencia, atribución literal y advertencia de exactitud |

## Key contracts

- **El nombre accesible no se acorta ni se capitaliza.** El `aria-label` de
  todo botón de hueso lleva el `es` del catálogo tal cual, con su lado si
  lo tiene. Solo cambia el texto visible (ADR-014).
- **Dos huesos de la misma región nunca producen el mismo nombre corto.**
  Afirmado por un gate sobre los 206 huesos reales, no por revisión.
- **El catálogo no se toca.** `es`, `synonyms` y `la` quedan intactos;
  `isCorrectAnswer` sigue validando contra el nombre completo (`RF-06`).
- **`must-data-003` sigue vigente bajo el nuevo resultado del test.** Ningún
  nombre —corto o largo— llega al DOM antes de responder; el veredicto se
  decide por `id`, nunca comparando el texto del botón.
- **La selección de hueso no viaja en el historial** (ADR-013): vive en
  `App` desde e3.2 para sobrevivir al ir y volver de la ficha.
- **El activo 3D no se modifica.** Encuadre, zoom y rotación son cámara y
  controles; `skeleton.glb` y sus materiales quedan como están.
- **El lienzo conserva `touch-action: none`** aunque se añadan controles —
  el `MutationObserver` de `SkeletonScene` es el patrón, no el CSS.

## Decisions (ADRs)

- **ADR-013**: El «atrás» del sistema recorre el selector de modo mediante
  la History API, sin adoptar un router — extiende ADR-003 bajo una
  exigencia que aquel no conocía: en un teléfono, «atrás» es el gesto de
  salida principal. `records/decisions/adr-013-system-back-button-walks-the-mode-selector.md`
- **ADR-014**: El nombre corto es una derivación de vista con gate de
  unicidad; el nombre accesible conserva el completo — acortar sin borrar
  el discriminante, y sin negociar con la accesibilidad ni con la suite.
  `records/decisions/adr-014-short-names-are-a-view-derivation.md`

Sin ADR a propósito: el color de selección y los tokens de estado son un
valor dentro de ADR-007, que ya declara `@theme` como fuente única del
aspecto — no una decisión de arquitectura. El encuadre es la corrección de
un cálculo, con una sola respuesta correcta.

## Legacy sweep

Casi nada queda huérfano: la épica corrige y extiende lo construido.

- El bloque de resultado de `TestQuestion.tsx:170` —el panel
  «Correcto/Incorrecto» que sustituye la grilla— desaparece como forma; su
  contenido (nombre y término latino del hueso tras errar) se reubica.
- `IconoCuadrado` deja de servir al menú cuando este pasa a ser un
  `<button>`; sigue siendo el envoltorio del logo.
- La firma de `distanceToFit` se hace más estricta. Es exactamente el caso
  que el aprendizaje sobre objetos de opciones opcionales señala: aflojar
  una firma no avisa a nadie, endurecerla sí — el compilador nombrará a los
  dos llamadores.
