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
