# Parking lot

Hallazgos nombrados que no se resolvieron donde aparecieron. Append-only.

## 2026-08-16 · El bundle conserva la URL del CDN de Draco (e2.4)

`three` trae `https://www.gstatic.com/draco/...` como ruta por defecto del
decodificador, y esa cadena queda dentro del bundle aunque la escena configure
`/draco/` y sirva el decodificador desde el propio origen (verificado: HTTP 200
en `/draco/draco_decoder.wasm`, 192 420 bytes).

**Por qué importa:** `must-privacy-006` exige que no haya ninguna petición de red
en tiempo de ejecución. Hoy no la hay, pero la ruta por defecto sigue en el
código: un descuido futuro —quitar el segundo argumento de `useGLTF`— la
activaría en silencio, y el test actual no lo vería porque inspecciona el fuente
de la escena, no el bundle.

**Qué haría falta:** una prueba que intercepte la red con la aplicación
realmente ejecutándose. Eso es una suite de integración con navegador, que el
proyecto no tiene y que sería `./scripts/check-integration`.

**Destino:** aparcado. No bloquea e2 y no hay incumplimiento hoy.

## 2026-08-16 · El recorrido de tabulación es largo (e2.2)

206 botones en un solo orden de tabulación. Un lector de pantalla salta por
encabezados de región, pero quien navegue solo con `Tab` tarda en llegar al
miembro inferior. Se notará en cuanto alguien lo use en serio.

**Destino:** aparcado; candidato a historia propia si aparece una vista de
búsqueda o un salto por regiones.

## 2026-08-16 · Sin verificación con lector de pantalla real (e2.2, e2.3)

Las pruebas usan roles y nombres accesibles, y `userEvent` emite eventos de
teclado auténticos, pero **nadie ha oído la aplicación**. Entre «tiene los
atributos correctos» y «se entiende al oírla» hay una distancia que el epic no
cubre.

**Destino:** aparcado, pendiente de una sesión de prueba manual con lector.

## 2026-08-16 · La lista no se desplaza al hueso elegido en la escena (e2.6)

Con 206 entradas, seleccionar un hueso en la escena lo marca en la lista pero no
la desplaza: el hueso marcado puede quedar fuera de la vista. Pulido de UX real,
no requisito del epic.

**Destino:** aparcado.

## 2026-08-16 · La documentación de e2 describe el contrato anterior a b2.1

`work/epics/e2-explore-skeleton/docs.md` documenta que la escena recibe
`selectedMesh`. Tras b2.1 recibe `selected` (el `id`), porque una malla son dos
huesos y solo la escena conoce la mitad pulsada. Afecta al ejemplo trazado, al
diagrama de flujo y a la invariante I2.

**Destino:** aparcado. `docs.md` es artefacto de `epic-close` y un cierre de bug
no lo edita.

## 2026-08-16 · No hay forma de probar el modelo tal como lo carga la aplicación

b2.1 existió porque las pruebas comparaban el catálogo contra el **archivo**, y
entre el archivo y la escena hay un cargador que transforma los nombres. La
prueba que lo habría atrapado exige ejecutar `GLTFLoader` con Draco en un
navegador: una suite `./scripts/check-integration` que el proyecto no tiene.

**Destino:** aparcado — es la carencia estructural más seria que el proyecto
tiene hoy.

## 2026-08-17 · `governance/architecture/system-design.md` describe módulos que no existen (e3-design)

El documento nombra `features/bone`, `features/quiz`, `domain/answer-check`,
`domain/quiz`, `domain/progress`, `state/session`, `components/Skeleton`,
`components/BoneShape`, `components/AnswerInput` y `data/skeleton.svg` —
ninguno existe en el código real. Quedó escrito antes de ADR-001 (que cambió
el SVG por el modelo glTF) y nunca se actualizó durante E1 ni E2.

**Por qué importa:** un gemba walk que confíe en este documento en vez de leer
el código real parte de una foto equivocada de la arquitectura.

**Destino:** aparcado. No bloquea E3 — el gemba walk de e3-design leyó el
código real, no el documento. Candidato a una tarea de documentación corta
antes de empezar E4, cuando probablemente vuelva a tocarse.

## 2026-08-17 · La prueba de alcance de selección de s1 está pausada (`test.fixme`)

`e2e/explore.spec.ts` — la prueba que pulsa una rejilla de 121 puntos para
verificar que se alcanzan huesos distintos (regresión de b2.1/b2.2) quedó
intermitente en el sandbox remoto de esta sesión (renderizado por software sin
GPU: entre 20s y más de 2 minutos en corridas idénticas, sin cambios de código
entre ellas). Verificada a mano en navegador real por el usuario: se alcanzan
bastantes más de los 6 que el umbral automático pedía.

**Destino:** aparcado con `test.fixme` explícito (no borrado, no debilitado
más) en `story/s1/browser-integration-suite`, commit `62badce`. Se retoma
cuando el usuario pueda correr la suite en su propia máquina con GPU real, para
confirmar si la intermitencia es del entorno o de la prueba misma.

## 2026-08-17 · `SkeletonScene` e `IsolatedBoneScene` repiten la forma clonar+recorrer (epic-close e3)

Las dos cargan `skeleton.glb`, clonan la escena y la recorren con
`traverse` decidiendo una acción por malla (`SkeletonScene`: resaltar por
material y manejar el clic; `IsolatedBoneScene`: mostrar/ocultar y calcular
el encuadre). Es la misma forma estructural, con una acción distinta en
cada caso.

**Por qué no se extrajo ahora:** dos ocurrencias con responsabilidades que
todavía difieren en detalle real (interacción de clic vs. cálculo de caja
delimitadora) no justifican una abstracción compartida — regla de tres,
YAGNI. Forzarla ahora sería adivinar la forma correcta con un solo caso de
comparación real.

**Destino:** aparcado. Si E4 (modo test) necesita una tercera variante de
"cargar el modelo y recorrerlo por malla", ahí sí hay tres puntos de datos
reales para decidir qué parte compartir — antes no.

## 2026-08-17 · `SkeletonScene` y `IsolatedBoneScene` describen su lienzo de dos formas distintas (epic-review e4)

`SkeletonScene.accessibleHint` agrega un `<p className="sr-only">`
separado, sin vincularlo al `Canvas` (ADR-002, luego extendido en e4.2).
`IsolatedBoneScene.accessibleLabel` fija el `aria-label` del contenedor
directamente (e3.2, extendido en e4.4). Mismo propósito —describir el
lienzo para un lector de pantalla, configurable por consumidor—, dos
mecanismos.

**Por qué no se unificó ahora:** la inconsistencia es anterior a e4 — cada
componente ya tenía su propio patrón antes de que esta épica agregara la
prop configurable siguiéndolo. Unificar el mecanismo es un cambio a dos
componentes de epics anteriores (E2, E3), fuera del objetivo de e4.

**Destino:** aparcado. Candidato a una historia corta de consolidación si
aparece un tercer consumidor con la misma necesidad, o si algún epic futuro
ya va a tocar ambos componentes por otro motivo.

## 2026-08-17 · Borrar o reiniciar el progreso (epic-design e5)

E5 crea un registro persistente de aciertos y fallos por hueso, y no da
ninguna forma de borrarlo. Nadie lo ha pedido: ni `RF-09`, ni el outcome
del que cuelga, ni los guardrails.

**Por qué no se hizo ahora:** no bloquea el objetivo de la épica — el
fallo dirige el estudio igual, se pueda reiniciar o no — y agregarlo sin
pedido es construir para un usuario imaginado.

**Destino:** aparcado. Es una historia corta (una función pura que ya
existirá en `progress.ts`, más un botón) el día que alguien estudie de
verdad y quiera empezar de cero.

## 2026-08-17 · Mostrar el progreso al estudiante (epic-design e5)

`RF-09` pide que el sistema **recuerde** y **priorice**, no que exhiba.
El brief de E5 nombra el panel de estadísticas como rabbit hole y el
scope lo declara fuera.

**Por qué no se hizo ahora:** el requisito no lo pide y la épica cumple su
objetivo sin ello. Además cambiaría la naturaleza del trabajo: pasa de
dominio y almacenamiento a diseño de interfaz.

**Destino:** aparcado como épica propia. El dato ya estará ahí —completo y
por hueso—, así que el día que se quiera mostrar, lo que falta es solo la
vista.

## 2026-08-17 · `should-perf-007` declara una medición de la que no hay rastro (epic-review e5)

La tabla de `governance/guardrails.md` dice que `should-perf-007` se verifica
con "medición manual con throttling en DevTools antes de cerrar el epic de
visualización". E2 (Explorar el esqueleto) está cerrada y ninguno de sus
artefactos menciona esa medición.

**Por qué no se hizo ahora:** es un `should`, no bloquea nada, y no es trabajo
de E5 — su épica dueña ya cerró. Corregirlo desde aquí sería trabajo fuera de
alcance sobre una épica ajena.

**Por qué importa igual:** es el mismo patrón que e5.5 encontró en
`must-privacy-006` — una columna "cómo se verifica" rellena hace parecer
verificado lo que nadie comprobó. La diferencia es que aquel era un `must` y
tenía épica dueña viva.

**Destino:** aparcado. O se mide (es media hora con la aplicación ya
construida), o se marca explícitamente el guardrail como no verificado hasta
que alguien lo haga. Lo que no sirve es dejar la tabla afirmando lo que no es.

## 2026-08-17 · El validador del almacén re-codifica la forma de `BoneProgress` (architecture-review e5)

`esProgresoDeHueso` en `src/storage/progress-store.ts` comprueba a mano que
existan `correct` e `incorrect` y que sean enteros no negativos. Esa forma
también está declarada en el tipo `BoneProgress` de `src/domain/progress.ts`.
**Son dos codificaciones de la misma verdad**: si el tipo ganara un campo, el
validador seguiría aceptando registros sin él, y ningún test lo notaría.

**Por qué no se hizo ahora:** el tipo tiene dos campos y su propio comentario
lo declara plano y serializable a propósito, así que la probabilidad de que
crezca es baja. La solución que elimina la duplicación —un esquema declarativo
del que se derive el tipo— es una dependencia nueva y toda una forma de
trabajar, desproporcionada para dos enteros.

**Destino:** aparcado, con un disparador claro. Si `BoneProgress` llega a tener
un tercer campo, la duplicación deja de ser teórica y ahí sí toca resolverla —
esquema declarativo, o un test que compare las claves del tipo contra las que
el validador exige.

## 2026-08-17 · La suite de integración puede medir un build viejo (b2.3)

`playwright.config.ts` declara `reuseExistingServer: !process.env.CI`. Si un
`vite preview` quedó vivo de una corrida anterior, Playwright lo reutiliza y no
reconstruye: la suite mide el bundle que ese servidor sirva, no el árbol de
trabajo. Ocurrió en b2.3 — `check-integration` dio rojo con los números exactos
de antes del arreglo porque medía un bundle de una hora antes. También quedaron
servidores huérfanos escuchando en 4173, 4174 y 4175, que deja la suite cuando
una corrida se interrumpe.

**Por qué importa:** es un gate que puede mentir en las dos direcciones. En
b2.3 dio un rojo falso, que solo cuesta tiempo; el caso peligroso es el verde
falso, donde un arreglo que no funciona pasa porque se midió el build anterior.
Cuarto precedente de gates que afirman lo que no comprueban (b2.1, b2.2, s1).

**Qué haría falta:** que la suite construya siempre —unos 20 s por corrida— o
que compare el servidor reusado contra el árbol antes de aceptarlo.

**Destino:** aparcado. No bloquea nada hoy y arreglarlo desde b2.3 era trabajo
fuera de alcance.

## 2026-08-17 · b2.1 y b2.2 no tienen `triage.md` (b2.3)

El paso de clasificación se saltó en los dos bugs anteriores del proyecto y
nadie lo notó hasta que b2.3 lo ejecutó. No se corrige retroactivamente:
clasificar hoy dos bugs cerrados produciría dos etiquetas inventadas, peor que
la ausencia.

**Destino:** aparcado como constancia. El valor de Origin es alimentar la
prevención, y para bugs ya cerrados y con retrospectiva escrita esa función ya
la cumplió otro artefacto.

## 2026-08-17 · El `session-start` de este repositorio afirma algo falso sobre la caché (b2.3)

Su sección «Executing cache vs repo» dice que en este repositorio no aplica
porque las skills se ejecutan desde `.claude/skills/`. No es cierto: todas las
skills de b2.3 se cargaron desde `~/.claude/plugins/cache/gemba/gemba/`, y el
snapshot cambió a mitad del ciclo (`7fa676679abc` → `7f598d7f7a88`). La
afirmación hizo saltar en la orientación de sesión una comprobación que sí
correspondía.

**Destino:** aparcado — es un defecto de la skill, no del producto.

## 2026-08-17 · Búsqueda y filtros en el navegador de huesos (epic-design e7)

E7 resuelve los 206 huesos en pantalla chica apoyándose en la jerarquía que ya
existe —las 10 regiones de `groupByRegion`—, no añadiendo una función nueva.
Buscar por nombre, filtrar por región o navegar por facetas queda fuera.

**Por qué no se hizo ahora:** el objetivo de la épica es que la aplicación se
pueda usar en un teléfono, y eso lo cumple la jerarquía existente. Añadir
búsqueda sería construir una capacidad nueva bajo el disfraz de un rediseño,
y tiene su propio diseño —¿busca por nombre en español, en latín, por sinónimo?
`isCorrectAnswer` ya resuelve algo parecido en el dominio del test y habría que
decidir si se reutiliza.

**Destino:** aparcado, con un disparador claro. Si al usar la aplicación en la
mano recorrer por región resulta lento, es una épica propia y el dominio ya
tiene la mitad hecha.

## 2026-08-17 · Animación y micro-interacción (epic-design e7)

El brief de E7 la nombra como rabbit hole y el scope la deja fuera. El kit de
skills de diseño instalado en esta sesión invita a ello.

**Por qué no se hizo ahora:** una transición sobre un canvas WebGL cuesta
rendimiento en el mismo móvil de gama media que `should-perf-007` vigila, y hoy
**no hay ninguna medición** con la que juzgar ese coste.

**Destino:** aparcado, con el disparador puesto en e7.10 — la historia que
produce esa medición. Después de ella la conversación se puede tener con datos.

## 2026-08-17 · La vista Explorar en móvil sin lista superior, con ficha flotante (e7.2, verificación en teléfono)

Probando e7.2 en un teléfono real, el usuario propone quitar el navegador de
huesos de la parte superior en móvil y que, al seleccionar, la identidad
aparezca abajo en una **tarjeta flotante**. Referencia aportada:
`~/refs/cards.jpg` — píldoras de esquina muy redondeada con borde negro grueso,
sombra dura desplazada y relleno pastel plano sobre fondo crema.

**Por qué no se hizo ahora:** e7.2 dimensiona el lienzo y decide su superficie;
su reparto vertical está declarado provisional en su propio `scope.md`. Cambiar
qué piezas se ven y cuándo es una decisión de arquitectura de información, no de
dimensionado, y afecta a dos historias que aún no existen: **e7.4** decide la
forma del navegador de 206 huesos —si desaparece de la vista Explorar, ese
diseño cambia— y **e7.6** decide cómo conviven las tres zonas en 390 px.
Hacerlo dentro de e7.2 sería resolver e7.6 sin sus piezas rediseñadas.

**Destino:** entra en **e7.6** como entrada de diseño, con `~/refs/cards.jpg`
como referencia y esta propuesta como punto de partida. e7.4 debe conocerla
antes de cortar su propio diseño: si el navegador deja de vivir en Explorar,
su historia cambia de forma.

## 2026-08-17 · Bloquear la orientación vertical en móvil (e7.2, verificación en teléfono)

El usuario no quiere que la aplicación gire a apaisado en el teléfono: la
prefiere fija en vertical.

**Por qué no se hizo ahora:** además de estar fuera del alcance de e7.2, **una
web normal no puede bloquear la orientación.** `screen.orientation.lock()` exige
contexto de pantalla completa en los navegadores que lo implementan, y Safari en
iOS no lo implementa. Las tres salidas reales son distintas entre sí y ninguna
es gratis: (a) declarar `orientation: portrait` en un manifiesto de PWA, que
solo obedece Android y solo si la aplicación se instala; (b) diseñar el layout
apaisado para que no moleste, que es trabajo de e7.9; (c) mostrar en apaisado un
aviso pidiendo girar el teléfono, que es una decisión de producto discutible
porque bloquea a quien usa el teléfono fijado en un soporte.

**Destino:** decisión pendiente, con dueño en **e7.9** (los breakpoints y el
comportamiento fuera del móvil vertical). La afirmación sobre
`screen.orientation.lock()` se verifica en esa historia antes de decidir, no
se da por buena desde acá.

## 2026-08-17 · Pulido visual fino, diferido al cierre de la épica (verificación de e7.4)

Probando e7.4 en el teléfono, el usuario decide que el pulido visual fino
—ajustes de detalle sobre lo que cada historia entrega— se revisa una vez, al
cerrar E7, en vez de historia por historia.

**Por qué no se hizo ahora:** cada historia de E7 ya verifica en dispositivo
real y corrige lo que encuentra —b2.3, e7.1, e7.2 y e7.4 lo hicieron—, pero un
repaso historia por historia no ve el conjunto: cómo se sienten las seis
vistas una detrás de otra, no cada una aislada.

**Destino:** una pasada de pulido visual al cierre de la épica, después de
e7.9 (escritorio como ampliación) y antes de e7.10 (medición de
`should-perf-007`), con las seis vistas ya completas y el recorrido entero
disponible para juzgarlo junto.

## 2026-08-17 · El marcador "▸" no aparece en filas de par colapsado (quality-review e7.4)

Las filas `single` de verdad (huesos impares) muestran `▸ ` antes del nombre
cuando están seleccionadas. La fila colapsada de un par sin geometría en
ningún lado (martillo, yunque, estribo) no lo hace: `aria-pressed` es correcto,
solo falta el glifo visual.

**Por qué no se hizo ahora:** es cosmético, sin impacto de accesibilidad, y
cae directo en la categoría que el usuario decidió revisar junta al cierre de
la épica, no historia por historia.

**Destino:** el pulido visual de cierre de épica, mismo destino que la entrada
anterior de esta fecha.

## 2026-08-17 · Navbar flotante del mockup de Claude Design (e7.6)

El mockup importado ("Rediseño aplicación anatomía ósea",
`claude.ai/design`) muestra logo + pestañas + menú en una sola fila flotante
sobre el contenido, distinto de la cabecera sólida separada de las pestañas
que e7.1 ya cerró.

**Por qué no se hizo ahora:** reabre e7.1, ya cerrada con retrospectiva y
revisión de calidad. No es un ajuste dentro de e7.6, que solo toca
`ExploreView`.

**Destino:** historia propia, candidata `e7.11`, después de que termine el
resto del plan actual de la épica.

## 2026-08-17 · Acordeón de Fichas del mockup de Claude Design (e7.6)

El mismo mockup propone un acordeón de 2 niveles (categorías → subgrupos →
grilla de etiquetas) para el navegador de 206 huesos, en vez de la lista
plana de 10 regiones con filas de pares que e7.4 construyó.

**Por qué no se hizo ahora:** cruza a propósito el rabbit hole que el brief
de E7 declaró explícito — "rehacer el navegador como arquitectura de
información nueva es una épica distinta". Decisión del usuario: se cruza,
pero como historia propia, no como tarea suelta de e7.6.

**Destino:** historia propia, candidata `e7.12`, con su propio ADR que
supersede la arquitectura de pares/pills de e7.4 (ADR-010 y
`toNavigatorRows`). Antes de diseñarla, releer las retrospectivas de e7.4 y
e7.5 — el aprendizaje sobre pares indistinguibles (`isSideIrrelevant`) sigue
aplicando a cualquier arquitectura nueva.

## 2026-08-17 · Test con opciones múltiples del mockup de Claude Design (e7.6)

El mockup agrega un selector "Escribir / Opciones" en el modo test, con una
grilla de 3 botones de respuesta múltiple — hoy `TestQuestion` solo acepta
respuesta escrita.

**Por qué no se hizo ahora:** es alcance nuevo, no un rediseño visual — toca
la lógica de verificación de respuesta (`isCorrectAnswer` y el dominio del
motor de test), no solo su presentación. No estaba en ninguna historia
planificada de E7.

**Destino:** historia propia, candidata `e7.13`, con su propio scope —
incluye decidir cómo se generan las opciones incorrectas plausibles para 206
huesos, que es una pregunta de dominio, no de estilo.

## 2026-08-17 · Las tres entradas del mockup de Claude Design pasan a E8

Las tres entradas anteriores de esta fecha (navbar flotante `e7.11`,
acordeón de Fichas `e7.12`, test de opción múltiple `e7.13`) quedan
reclamadas por la épica **E8: Redesign mockup follow-ups**
(`work/epics/e8-redesign-mockup-follow-ups/`), como `e8.1`, `e8.2` y
`e8.3`+`e8.4` respectivamente — el test de opción múltiple se partió en dos
historias (distractores de dominio, luego la opción múltiple como formato
primario).

El gemba de `epic-design` corrigió una suposición: la entrada del acordeón
de Fichas decía que haría falta un ADR que "supersede... ADR-010". Releído
completo, ADR-010 no gobierna la lista visible de Fichas — ver ADR-011,
que documenta la corrección.

**Destino:** ya no aparcado — en curso bajo E8.

## 2026-08-17 · `count` de `pickDistractors` sin ejercitar (e8.3, architecture-review)

`DistractorOptions.count` (`src/domain/distractors.ts`) documenta cuántos
distractores devolver, pero ningún llamador ni ningún test lo usa con un
valor distinto del default (2) — solo el `sorteo` inyectado tiene
cobertura de opción no-default.

Se relaciona con un hallazgo de `quality-review` sobre la misma historia:
el guard `preguntables.length < count` no contempla que la exclusión de
hermanos dentro del bucle puede consumir el pool más rápido que `count` —
con `count=2` es inalcanzable, sin probarse con un `count` mayor queda sin
verificar.

**Destino:** aparcado. Si `e8.4` (o alguna historia futura) necesita un
`count` distinto de 2, agregar ahí el test que ejercite ese valor —
cierra los dos hallazgos a la vez. Si nunca se necesita, es candidato a
simplificar quitando el parámetro (YAGNI).

## 2026-08-17 · Duplicación menor en la construcción de opciones (e8.4, architecture-review)

`mezclar([bone, ...pickDistractors(bone, bones)])` se repite igual en el
inicializador de `opciones` y en `siguiente()`, dentro de
`src/features/test/TestQuestion.tsx`.

**Destino:** aparcado — 2 líneas de duplicación, no vale una tarea propia
ahora. Extraer `construirOpciones(bone, bones)` si el patrón se repite una
tercera vez o si el componente crece.

## 2026-08-17 · El color por región vive fuera de `@theme` (E8, epic-review)

`REGION_ACCENT` (`src/components/region-accent.ts`, 20 valores) y
`ACENTO_PESTANIA` (`src/App.tsx`, 3) son colores hexadecimales escritos a
mano en TypeScript y aplicados con `style={{}}`, consumidos por
`BoneIdentity`, `BoneSheet`, `FichasAccordion` y la navbar. ADR-007 declara
que los tokens de `@theme` son la única fuente del aspecto y que ningún
componente escribe un color a mano; `tests/design-tokens.test.ts` no lo ve
porque vigila la **paleta de fábrica de Tailwind**, no la regla completa.

Además, dos de los tres acentos de pestaña duplican valores literales de
`REGION_ACCENT` (`explorar` = `thorax.bg`, `test-elegir` =
`upper-limb.bg`) y el tercero (`fichas`, `#e4c64f`) no corresponde a
ninguna región: ajustar el naranja de `thorax` dejaría la pestaña con el
valor viejo sin que nada avise.

Es el mismo agujero que epic-review de E7 encontró con el color del 3D.

**Destino:** aparcado para una épica de consolidación visual. Dos caminos:
un ADR que acepte "color por región" como dato de vista legítimo y amplíe
el gate para exigir que *todo* color venga de una fuente declarada, o
migrar los 23 valores a `@theme`. La duplicación de los acentos de pestaña
se cierra con cualquiera de los dos.

## 2026-08-17 · Tres props opcionales cuya ausencia es silenciosa (E8, epic-review)

`onViewDetail?` (`BoneIdentity`, `ExploreView`), `answerFormat?` y
`onCambiarModo?` (`TestQuestion`) se acumularon una por historia. Todos los
llamadores actuales las pasan; un llamador futuro que olvide una se queda
sin la función y ningún test lo nota.

**Destino:** aparcado. Hacer requeridas las que todos los llamadores ya
pasan — un cambio de una línea por llamador, pero toca tres componentes y
sus pruebas, así que merece su propia tarea en la próxima historia que
entre a `src/features/test/`.

## 2026-08-17 · Dos presentaciones del mismo hueso, con cinco campos repetidos (E8, architecture-review)

`BoneIdentity` (105 líneas, panel de Explorar) y `BoneSheet` (83 líneas,
ficha completa) muestran los mismos cinco campos —`es`, `la`, región, lado,
sinónimos— con el mismo criterio de `ocultarLado` y el mismo `REGION_ACCENT`,
en dos formas visuales distintas: píldoras comprimidas junto a la escena
frente a filas etiqueta/valor en una pantalla propia.

La duplicación es deliberada y está documentada en el encabezado de
`BoneSheet`: unificarlas con una prop `variant` haría que cada ajuste visual
de Explorar tuviera que pensarse dos veces, y e8.5 fue una historia entera de
ajustes visuales de Explorar.

**Destino:** aparcado como umbral, no como deuda. Si aparece una **tercera**
presentación del mismo hueso, extraer el criterio compartido (`ocultarLado`,
la resolución de acento, el orden de los campos) a una función de vista y
dejar que cada presentación se quede solo con su marcado.
