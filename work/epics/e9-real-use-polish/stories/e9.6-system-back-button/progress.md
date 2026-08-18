# Story e9.6: The system back button walks the app — Progress

## T1 · El historial transporta el modo, y `popstate` lo restituye

**Hecho.** `navegar` es el único punto de transición (`pushState` sin tercer
argumento + `setModo`), un `useEffect` escucha `popstate`, y `esModo` valida
lo que llega. Las siete transiciones que usaban `setModo` suelto pasan por
`navegar`; los dos únicos `setModo` que quedan están dentro de `navegar` y
del escucha.

**RED:** 3 pruebas nuevas en `App.test.tsx` — retroceso desde la ficha con
la selección intacta, retroceso desde el test de esqueleto, y un `state`
ajeno que cae a Explorar. Fallaban las 3; las 10 existentes pasaban.

**Verificación — mutaciones forzadas:**

| Mutación | Resultado |
|---|---|
| Quitar el `pushState` de `navegar` | 2 rojos: los dos tests de retroceso |
| `esModo` devuelve `true` siempre | 1 rojo: el del `state` inválido |

Las dos matan exactamente lo que debían y nada más, así que las pruebas
miden el mecanismo y no otra cosa.

**Verificación — orden:** `vitest run src/App.test.tsx --sequence.shuffle`,
dos corridas, 13/13 en ambas. jsdom comparte `window.history` entre casos
del mismo archivo y el riesgo era un verde de orden.

**Gate:** `./scripts/check` verde — 37 archivos, 275 pruebas.

**Lo que el plan no anticipó, y salió mejor:** el aislamiento entre pruebas
no necesitó andamiaje de test. `App` siembra la entrada de arranque con
`history.replaceState(modoInicial(), '')` al montar, y eso resuelve las dos
cosas a la vez: en producción, retroceder hasta la entrada inicial restituye
Explorar explícitamente en vez de llegar al `popstate` con `state: null` y
caer al respaldo; en jsdom, cada montaje reemplaza la entrada actual, así
que ningún caso retrocede a la pila que dejó el anterior. Es corrección de
diseño, no un truco de prueba.

**Decisión de implementación:** `MODOS_SIN_DATOS` es un
`Record<ModoSinDatos, true>` y no una lista de cadenas. Sobre una unión, el
`Record` exige exhaustividad: si `Modo` gana una variante sin dato y nadie
la agrega, falta una clave y el compilador lo dice. Una lista la aceptaría
en silencio — que es exactamente el hallazgo aparcado sobre
`esProgresoDeHueso`, cerrado por construcción en vez de repetido.

## T2 · Los botones que ya decían «atrás» retroceden, y `origen` se barre

**Hecho.** «← Volver» y las dos salidas de `onCambiarModo` pasan por
`window.history.back()`. El campo `origen` desapareció del tipo `Modo`, de
sus dos sitios de escritura y de su único lector; las dos apariciones que
quedan de la palabra son prosa de comentario.

**RED:** una prueba nueva abre la ficha del fémur desde Fichas, pulsa
«← Volver» y luego `history.back()`, esperando llegar a Explorar y no
reentrar a la ficha. Fallaba: tras T1, «Volver» empujaba una entrada nueva
y el gesto del sistema volvía a entrar donde se acababa de salir.

**Un RED falso, corregido antes de seguir.** El primer intento navegaba por
la categoría «Cráneo» hasta «frontal» y fallaba con *Unable to find an
accessible element* — el selector, no el comportamiento. Un rojo por
andamiaje roto no prueba nada, así que se reescribió siguiendo el camino
que los tests vecinos ya usan (Miembro inferior → fémur derecho) y ahí sí
falló por la reentrada.

**Verificación — mutación forzada:** devolver el empuje en «Volver»
(`navegar({ tipo: 'fichas' })`) da 2 rojos: el de no-reentrada y, además,
*lleva a la ficha completa y vuelve conservando la selección*. El segundo
es la red de seguridad del barrido — el comportamiento que `origen`
sostenía sigue vigilado sin el campo.

**Gate:** `./scripts/check` rojo en `format:check` a la primera —
biome colapsa a una línea el `&&` de `BoneTestView` ahora que el callback
es más corto. Corregido con `npm run format`, no bypaseado. Verde después:
37 archivos, 276 pruebas.

## T3 · La prueba de navegador, que es la que de verdad observa esto

**Hecho.** Un caso nuevo en `e2e/mobile-shell.spec.ts` (viewport 390×844,
que es donde vive el gesto): abre la ficha del fémur desde Explorar,
`page.goBack()`, comprueba que sigue en el sitio y que el fémur conserva
`aria-pressed="true"`; luego entra al test de esqueleto y retrocede a la
elección de variante.

**Precondición del plan, revisada:** no hizo falta matar nada. Playwright
usa 4173 y estaba libre; los dos `vite preview --port 4180` huérfanos y el
`cloudflared` viejo apuntando a 4173 no ocupan ese puerto. El dev server de
5173 y su túnel siguen vivos e intactos.

**Verificación — mutación forzada:** con el `pushState` de `navegar`
comentado, el caso se pone rojo (*element(s) not found*, 15,5 s). Se
comprobó antes que 4173 estaba libre, para que Playwright reconstruyera en
vez de reutilizar un servidor con el bundle anterior — el rojo mide el
código mutado, no un build viejo.

**Gates:** `./scripts/check-integration` verde, 22 de 22 en 2,3 min, con la
prueba nueva en 484 ms. `should-perf-007` sigue dentro de presupuesto
(mediana 4,6 ms; el máximo de 34,8 ms es la primera muestra, el
calentamiento de siempre). `./scripts/check` verde.

## Finalización

**Un criterio del scope estaba sin cubrir.** Al repasar la aceptación de
punta a punta apareció que el **primer** escenario —«abrí la ficha desde
Fichas · atrás · vuelvo a Fichas», sin pasar por «← Volver»— no tenía
prueba: los casos de T1 y T2 cubrían el retroceso desde Explorar, desde el
test, el `state` inválido y la no-reentrada, pero no ese. Se agregó.

Se comprobó que **puede** fallar antes de darlo por bueno: con la mutación
«todo retroceso cae a Explorar» (`setModo(modoInicial())` incondicional) se
pone rojo, junto con otros dos. Una prueba escrita después del código y
nunca vista fallar no es una red.

**Chequeo de tests huérfanos:** los importadores de `App` que esta historia
no tocó son `tests/privacy-runtime.test.tsx` y `src/main.tsx`; los de
`TestQuestion`, sus tres suites de test. Leídos y ejecutados dirigidamente:
4 archivos, 31 pruebas, verde. `privacy-runtime` monta `<App />` y navega,
así que ahora empuja entradas de historial — y sigue sin registrar una sola
petición de red, que es la confirmación de que la History API no toca
`must-privacy-006`.

**Estado:** `./scripts/check` verde (37 archivos, 277 pruebas) y
`./scripts/check-integration` verde (22 de 22). Pendiente T4, la prueba
manual en el teléfono, que es la única que puede cerrar la historia.
