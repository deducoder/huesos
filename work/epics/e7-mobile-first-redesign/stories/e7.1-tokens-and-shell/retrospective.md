# Story e7.1: Tokens y shell — Retrospective

Estimated: M, 4 tareas · Actual: M, 5 commits de código (4 tareas + una
corrección salida de la revisión). La talla acertó; el reparto interno no.

## Summary

`src/index.css` pasa de una línea a la única fuente del aspecto: diez colores,
dos radios, una sombra dura, el mínimo táctil y la escala tipográfica en
`@theme`. El shell consume esos tokens y sus pestañas miden 44 px en 390×844,
contra los 32 medidos al arrancar. Las 46 utilidades de color literal que había
repartidas por seis archivos desaparecieron, y dos gates nuevos impiden que
vuelvan: `tests/design-tokens.test.ts` y `e2e/mobile-shell.spec.ts`. La
aplicación quedó invertida a tema claro y legible de punta a punta, verificado a
mano. 206 tests unitarios y 5 de navegador en verde.

## What went well

- **El `it` de control encontró un defecto en su propio gate, en la primera
  ejecución.** El patrón llevaba la bandera `g` y usaba `RegExp.test`, que
  avanza `lastIndex` entre llamadas: la segunda comprobación devolvía `false`
  sobre un texto que sí contenía un color. Sin esa aserción, el gate habría dado
  falsos negativos —verde dejando pasar literales— y nadie lo habría sabido
  hasta encontrar un `bg-slate-800` vivo tres historias después.
- **Verificar los tokens contra el compilador real, antes de escribir el
  design.** Compilar un `@theme` de prueba con el Tailwind del propio proyecto
  confirmó que `--spacing-tactil` emite `min-h-tactil` y `min-w-tactil`. De ahí
  salió que el mínimo táctil pudiera ser un token en vez de un valor repetido
  por componente, que es lo que ADR-007 pedía sin saber si era posible.
- **Calcular el contraste en vez de opinarlo.** Nueve pares medidos; uno se
  descartó por dar 4.38 contra el 4.5 que exige WCAG. La decisión tardó un
  minuto y no dependió del gusto de nadie.
- **Correr la suite de navegador en T3 y no en T4, contra el plan.** Cambiar
  `bg-slate-900` → `bg-panel` tocaba justo el panel que `explore.spec.ts` mide
  en píxeles. Salió verde —el fondo del canvas lo pinta three.js—, pero
  descubrirlo en T4 habría significado depurar con tres commits encima.

## What to improve

- **Mis dos inventarios manuales se quedaron cortos, y el automático no.** El
  scope dijo 23 líneas en 5 archivos; el design corrigió a 35 en 6; el gate
  encontró **46 utilidades**, incluida una (`text-white` en
  `BoneIdentity.tsx:34`) que ningún grep mío había listado porque los dos
  buscaban `slate|sky|amber`. La lección no es «contá mejor»: es que el
  inventario debía haber sido el gate desde el principio, escrito en la primera
  tarea en vez de en la tercera.
- **El primer grep del scope tenía un bug silencioso.** `grep -v ".test."` trata
  el punto como comodín, así que `/test/` en la ruta hacía desaparecer el
  directorio entero `src/features/test/`. Un filtro de exclusión que se come
  archivos de verdad no avisa: devuelve menos resultados, que es justo lo que
  uno espera de un filtro.
- **La jerarquía de color colapsó donde había dos niveles** (`slate-400` y
  `slate-500` → `tinta-suave` en `BoneIdentity`), contra el Must NOT que decía
  que la jerarquía no cambiaba. Hallazgo de la revisión de calidad, sin fijar a
  propósito: **e7.5 rehace ese panel entero** y decidirá con él delante si hace
  falta un tercer nivel de atenuación.

## Learned

1. **About the system:** Tailwind 4 permite que el mínimo táctil sea un token de
   `@theme` (`--spacing-tactil` → `min-h-tactil`), así que 44 px deja de ser una
   decisión repetida en cada componente. Y Biome no parsea `@theme` sin
   `css.parser.tailwindDirectives`: `@import "tailwindcss"` no lo activa porque
   `@import` es CSS estándar. Ninguna historia posterior de E7 volverá a chocar
   con eso.
2. **About the process:** un contrato de épica —«ningún componente escribe un
   color a mano»— se escribe como gate en la primera historia que lo declara, no
   se cuenta a mano en cada una. El gate encontró un 30% más de infracciones que
   mi mejor inventario manual, y siguió mirando después.
3. **Capability gained:** este repositorio ya tenía el patrón de «test que lee el
   fuente» para lo que el runtime no expone (`SkeletonScene.test.tsx`,
   `privacy.test.ts`). e7.1 lo usó dos veces más y extrajo su recorrido a
   `tests/sources.ts`, así que el siguiente guardrail de esta clase se escribe
   importando una función en vez de copiando un `readdirSync`.

## Para el plan de e7.2

Dos frases que tienen que aparecer en su `plan.md` al cortarlo, en vez de
volver a descubrirse — el aprendizaje solo sirve si viaja al artefacto de
planificación, no si se queda en este:

1. **Si e7.2 enuncia un contrato negativo** —«el lienzo nunca se dibuja a su
   altura intrínseca»— **ese gate es su tarea uno**, y su rojo inicial es el
   inventario. En e7.1 el gate llegó en la tercera tarea y encontró un 30% más
   de infracciones que el mejor conteo a mano.
2. **e7.2 corre `explore.spec.ts` en cada tarea, no al final.** Toca el lienzo,
   que es exactamente lo que esa suite mide en píxeles. En e7.1 bastó adelantarla
   una tarea para no depurar con tres commits encima; en e7.2 el solapamiento es
   total, así que no es una precaución sino el gate de la historia.
