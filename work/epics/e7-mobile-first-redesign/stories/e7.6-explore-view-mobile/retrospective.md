# Story e7.6: Vista Explorar en móvil — Retrospective

Estimated: M, 3-5 tareas · Actual: M, 8 commits de código sobre 2 tareas
implementadas (T1, T2) + 1 retirada (T3) + 1 explícitamente no realizada (T4).
La talla acertó en tamaño; el contenido fue muy distinto de lo estimado — un
cambio de arquitectura a mitad de camino y un bug de producción no relacionado
encontrado por accidente.

## Summary

El lienzo de Explorar ocupa el 100% de su contenedor; la identidad flota
sobre él con tratamiento de pills y botón de cerrar explícito, adoptando el
lenguaje visual de un mockup de Claude Design que el usuario trajo a mitad de
la historia. El navegador de huesos sigue montado, `sr-only` —decisión de
ADR-010, que supersede a ADR-009, escrita minutos antes con una premisa que
no se sostuvo—. Un bug real de `OrbitControls`/`touch-action`, presente desde
e7.2 y nunca funcionando de forma confiable, se encontró y arregló en el
camino. 233 tests unitarios y 13 de navegador en verde, dos corridas seguidas.

## What went well

- **Verificar con un `MutationObserver` en vivo en vez de seguir adivinando.**
  Tres hipótesis sucesivas sobre el fallo de `touch-action` —carrera de
  tiempo, orden de archivos, relleno de CSS— se descartaron con evidencia
  antes de llegar a la causa real. Ninguna se dio por buena sin confirmarla.
- **Corregir el propio ADR en vez de defender la primera decisión.** ADR-009
  se escribió, se implementó parcialmente, y se abandonó al descubrir su
  costo real sobre las pruebas de b2.1/b2.2/b2.3 — sin resistencia a admitir
  que la premisa estaba mal.
- **Separar lo que el mockup pedía de lo que la historia podía absorber.**
  De cuatro cambios propuestos, se adoptó uno (la tarjeta) con criterio
  explícito —usa tokens existentes, no la paleta de 10 colores del mockup, no
  agrega campos al catálogo— y los otros tres se aparcaron con destino, en
  vez de intentar todo de una vez o rechazar todo por exceso de alcance.

## What to improve

- **T4 no se hizo, y esta historia lo dice en voz alta en vez de omitirlo.**
  Es la primera de la épica que cierra sin verificación manual en
  dispositivo — decisión explícita del usuario, no un descuido, pero el
  patrón repetido en esta épica (b2.3, e7.1, e7.2, e7.4 encontraron defectos
  reales solo con las manos en un teléfono) hace que valga la pena
  registrarlo como riesgo aceptado, no como "listo".
- **El diseño de esta historia se corrigió dos veces** (ADR-009→010, y
  después el delta del mockup). Cada corrección se documentó bien, pero dos
  reescrituras de la misma sección de `design.md` en una sola historia es una
  señal de que el gemba inicial —antes de escribir el primer `design.md`—
  podría haber incluido una revisión más a fondo de qué pruebas dependían del
  navegador antes de proponer quitarlo del todo.

## Learned

1. **About the system:** un arreglo de CSS nunca le gana a un estilo en
   línea que una librería de terceros reafirma después del montaje. La
   solución robusta ante ese patrón no es adivinar el momento exacto de la
   reafirmación —varía, y depende de cuándo carga el modelo—, sino vigilar el
   atributo con un `MutationObserver` propio y corregirlo cada vez que
   cambie, sin importar cuándo ni cuántas veces ocurra.
2. **About the process:** un elemento `sr-only` sigue siendo consultable por
   Testing Library (jsdom no computa layout) pero **no** por las
   comprobaciones de visibilidad de Playwright (que sí miden posición y
   tamaño reales) — la misma técnica de ocultamiento se comporta distinto
   según qué capa de prueba la mire, y hay que tratarlas por separado en vez
   de asumir que "no se ve" significa lo mismo en las dos.
3. **Capability gained:** el proyecto ahora sabe traer un mockup externo
   (Claude Design) y escanearlo contra el alcance ya cerrado de la épica
   antes de implementar nada — separar "esto encaja en la tarea activa" de
   "esto reabre trabajo cerrado" de "esto es alcance nuevo" es un patrón
   reutilizable la próxima vez que aparezca una referencia visual a mitad de
   una historia.

## Para el plan de la épica

- **Tres hallazgos del mockup quedan aparcados con destino, no implementados:**
  el navbar flotante (reabre e7.1), el acordeón de Fichas (reabre e7.4,
  cruzando a propósito el rabbit hole que el brief declaró), y el modo de
  test con opciones múltiples (alcance nuevo). Cada uno necesita su propio
  scope/design/plan — no encajan como tarea suelta de ninguna historia
  existente. Candidatos: `e7.11` (navbar), `e7.12` (acordeón, con ADR propio
  que supersede la arquitectura de e7.4), `e7.13` (opciones múltiples).
- **Antes de reabrir e7.4**, releer su retrospectiva y la de e7.5: la función
  `isSideIrrelevant`/`side-pairing.ts` y el aprendizaje sobre pares
  indistinguibles siguen aplicando a cualquier arquitectura de información
  nueva para el navegador.
