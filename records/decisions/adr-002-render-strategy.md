---
type: adr
id: ADR-002
title: "Escena 3D con react-three-fiber, y una lista accesible como vía de primera clase"
status: accepted
date: 2026-08-16
epic: e2
---

# ADR-002: Escena 3D con react-three-fiber, y una lista accesible como vía de primera clase

## Status

Accepted

## Context

ADR-001 adoptó el modelo glTF como activo y **difirió deliberadamente** la
elección de render hasta que hubiera una historia que la obligara. E2 es esa
historia: hay que mostrar el esqueleto y dejar seleccionar un hueso (`RF-01`,
`RF-02`).

La tensión es entre **fidelidad** y **accesibilidad**. El catálogo ancla cada
hueso a una malla del modelo por su nombre, así que renderizar el modelo es el
camino directo. Pero `must-a11y-005` exige que **toda región de hueso sea
alcanzable y activable por teclado y exponga su nombre accesible**, y un canvas
WebGL es, para un lector de pantalla, un rectángulo opaco: no hay roles, no hay
foco, no hay nombres. ADR-001 ya registró este coste al elegir el activo.

Options:

- **(A) Solo escena 3D con react-three-fiber** — fiel al modelo y directo desde
  el catálogo. **Falla `must-a11y-005`**: sin DOM no hay nada que enfocar ni que
  anunciar. Añadir accesibilidad después siempre produce un apaño.
- **(B) Solo lista de huesos en DOM** — accesible por construcción y trivial de
  probar, pero traiciona `RF-01`: sin esqueleto no hay forma ni posición, que es
  justo lo que se quiere memorizar.
- **(C) Proyectar siluetas SVG por hueso desde el modelo** — la vía híbrida que
  ADR-001 dejó viva. Daría forma, posición y accesibilidad nativa. Sigue sin
  verificarse que la proyección produzca siluetas legibles hueso a hueso, y
  averiguarlo cuesta un spike que no está hecho.
- **(D) Escena 3D + lista accesible sincronizada, ambas de primera clase** —
  dos vistas del mismo estado de selección.

## Decision

**Opción (D):**

1. La escena se renderiza con **react-three-fiber** sobre three.js, cargando
   `src/data/skeleton.glb` con el decodificador Draco.
2. **Un navegador de huesos en DOM real** —botones agrupados por región,
   alcanzables por teclado y con nombre accesible— es una vía de acceso
   equivalente, no un añadido. Se construye **antes** que la escena: las
   historias e2.2 y e2.3 entregan una aplicación con la que ya se puede estudiar
   sin que exista una sola línea de WebGL.
3. El estado de selección vive en **dominio puro** (`src/domain/`), sin conocer
   React ni three.js. Escena y navegador son dos proyecciones de ese estado.
4. El hueso seleccionado se comunica por **tres canales simultáneos**: resaltado
   en la escena, estado activo en la lista, y su nombre escrito en el panel de
   identidad. El color nunca viaja solo.
5. **Diferido:** la opción (C) sigue viva. Si el peso o el rendimiento en móvil
   obligan a abandonar WebGL, el catálogo no cambia —ancla por nombre de malla,
   no por tecnología de render— y solo se sustituye la escena.

## Consequences

**Positive:**

- `must-a11y-005` se satisface por construcción y no por remiendo: la vía
  accesible existe antes que la escena.
- El grueso de la lógica queda **probable en jsdom**, porque vive en dominio y en
  DOM real. Un canvas WebGL no se puede probar ahí, y esta decisión hace que eso
  importe poco.
- Si la escena 3D falla o resulta demasiado pesada, la aplicación **sigue siendo
  usable**: degradación ordenada en vez de pantalla en blanco.
- Cumple `RF-01` y `RF-02` sin sacrificar a quien navega con teclado.

**Negative / costs:**

- **Dos vistas que mantener sincronizadas.** Toda selección tiene que reflejarse
  en ambas; es superficie donde caben errores de sincronía que ninguna de las dos
  muestra por separado.
- **El canvas queda fuera de la cobertura automática.** Lo que ocurre dentro de
  WebGL se verifica a mano; los tests cubren dominio y DOM. Se acepta a
  conciencia y se compensa con pruebas de integración manuales explícitas.
- **three.js pesa.** Se suma a los 1,86 MB del modelo. Se mide antes de
  optimizar, pero el coste es real.
- **Duplicidad aparente para el usuario vidente:** verá una lista que quizá no
  necesita. Es el precio de que la accesibilidad no sea un modo aparte.

## Alternatives considered

- **(A) Solo 3D:** rechazada por violar `must-a11y-005`, que es un `must`.
- **(B) Solo lista:** rechazada por incumplir `RF-01` — sin forma ni posición no
  se aprende a reconocer un hueso, solo a recitar una lista.
- **(C) Siluetas SVG proyectadas:** **diferida, no rechazada**. Exige un spike
  que mida la legibilidad de las siluetas. La decisión (D) la mantiene barata:
  cambiar de render no toca el catálogo.
