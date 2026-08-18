# Story e9.7: Homogeneous header, and a menu that opens — Retrospective

Estimated: M · Actual: L — 4 tareas planeadas más 2 tareas nuevas (T6, T7)
descubiertas en la verificación manual, más 2 hallazgos propios de
quality-review; 15 commits.

## Summary

La cabecera de la ficha pasa a la misma esquina redondeada/borde/sombra
que el resto de la interfaz; el botón de menú deja de ser un `<div
aria-hidden>` decorativo y abre `AboutPanel`, un overlay propio
(`role="dialog"`, no `<dialog>` nativo — ADR-016) con la atribución
literal de BodyParts3D, su licencia, el aviso de privacidad y la
advertencia de exactitud. Cierra el incumplimiento de licencia que
motivó parte de E9: hoy la atribución vive legible desde la interfaz, no
solo en el repositorio.

La verificación manual encontró dos cosas reales que ninguna prueba
unitaria hubiera atrapado: el "atrás" del sistema dejaba el panel
montado encima de una vista distinta a la que estaba cuando se abrió
(T6), y un pedido de contenido —crédito de desarrollo, leyenda de
no-rastreo/sin fines de lucro (T7)—. Las dos entraron al plan como
tareas nuevas, con su propio RED-GREEN-mutación, en vez de parchearse
sueltas.

`./scripts/check` verde — 346 tests. `./scripts/check-integration` no se
corrió aparte: el checkpoint E2E completo de la épica ya se hizo antes de
esta historia (milestone del `plan.md`), y esta no toca ningún mecanismo
que ese checkpoint no haya cubierto (History API, `popstate`) salvo el
cierre del panel en "atrás", verificado a mano.

## What went well

- **Encontrar el bug ajeno de e9.2 durante el gate de T2 no contaminó la
  rama de la historia.** El fix (`TestQuestion.test.tsx`, regex sin
  anclar) se apartó a `main` con `git stash`/switch/commit directo, y se
  trajo de vuelta con `git merge main` — mismo precedente que e9.1. El
  commit de e9.7 quedó limpio de un defecto que no era su alcance.
- **Los dos hallazgos de la verificación manual (T6, T7) se trataron como
  tareas de pleno derecho**, no como parches al margen del plan: cada uno
  con su origen documentado, su RED reproducido antes del fix, su
  mutación forzada después. El "Done when" del scope ("atrás sigue
  comportándose como antes") es lo que hizo evidente que T6 no era un
  capricho sino un criterio de cierre incumplido.
- **`AboutPanel` se pudo probar con comportamiento real** (foco, teclado,
  clic), no con lectura de código fuente — a diferencia de las escenas
  3D, esto es DOM plano, y las 10 pruebas lo aprovechan.

## What to improve

- **`git checkout -- archivo` no es un `revert` seguro sobre trabajo sin
  commitear.** Durante la mutación forzada de T3, un primer intento
  reseteó `App.tsx` al estado del último commit — que en ese momento era
  el merge de T2, sin el GREEN de T3 todavía commiteado — y lo borró
  entero. Detectado de inmediato (`grep` antes de seguir), rehecho sin
  pérdida real, pero el patrón correcto para el resto de la historia fue:
  **commitear el GREEN antes de mutar, y usar `git restore` (que opera
  sobre el índice/commit, igual que `checkout`, pero con el hábito
  explícito de verificar qué hay commiteado antes)**. T4, T6 y T7 ya
  siguieron ese orden sin incidente.
- **El design no anticipó la interacción entre el panel y una navegación
  real del sistema.** Ningún Must del design cubría "qué pasa si estando
  el panel abierto, el usuario presiona 'atrás'" — el panel es
  deliberadamente ajeno al historial (por diseño, para no ser un `Modo`
  más), pero eso mismo lo dejó sin ningún dueño que lo cerrara ante una
  navegación externa. Ninguna prueba lo hubiera exigido sin la
  verificación manual: el escenario requiere una entrada de historial
  real y un `popstate` real, y `App.test.tsx` no ejercitaba esa
  combinación específica hasta T6.
- **Un ADR se escribió al cierre, no al diseño.** La decisión de overlay
  propio vs. `<dialog>` nativo (con una razón concreta y verificada
  empíricamente: jsdom 30.0.1 sin `showModal`) vivía solo como comentario
  en `AboutPanel.tsx` hasta el `quality-review` de esta review — a pesar
  de cumplir con claridad el criterio del método ("varias opciones
  válidas", "otro trabajo futuro va a depender de esto"). Mejora de
  proceso: **cuando el design.md ya nombra explícitamente una decisión
  con alternativas rechazadas, escribir el ADR en la fase de diseño, no
  esperar a que quality-review lo note en la revisión final.**

## Learned

1. **About the system:** el panel de menú es la primera pieza de
   `App.tsx` que vive fuera del par `Modo`/`navegar` a propósito — y esa
   misma independencia (no es una entrada de historial) es lo que lo deja
   sin dueño ante un `popstate` si nadie lo cierra explícitamente. Un
   componente en capas por encima del enrutamiento sigue necesitando que
   *alguien* lo sincronice con los eventos que sí pertenecen al
   enrutamiento.
2. **About the process:** mutar código para verificar una propiedad es
   más seguro cuando ya está commiteado — `git restore`/`checkout` no
   distinguen intención, solo devuelven al último commit. El hábito
   correcto es invertir el orden cuando hace falta: commit primero,
   mutación después, nunca al revés cuando la mutación va a revertirse
   con un comando de git.
3. **Capability gained:** un patrón reutilizable para overlays modales en
   este proyecto —`role="dialog"` propio, foco por `useEffect` +
   `useRef`, `Escape` por `keydown`, backdrop por `onClick`— documentado
   en ADR-016, disponible para el próximo modal sin reabrir la pregunta
   de `<dialog>` nativo.
