---
type: adr
id: ADR-016
title: "El panel de menú es un overlay con role=\"dialog\" propio, no el elemento nativo <dialog>"
status: accepted
date: 2026-08-18
epic: e9
---

# ADR-016: El panel de menú es un overlay con `role="dialog"` propio, no el elemento nativo `<dialog>`

## Status

Accepted

## Context

`e9.7` necesita un panel modal por primera vez en la aplicación —no hay
ningún overlay ni diálogo previo de qué copiar el patrón—, para mostrar la
atribución del modelo 3D, su licencia, el aviso de privacidad y créditos.
El candidato obvio es el elemento nativo `<dialog>`: foco atrapado y
bloqueo del fondo gratis, sin JavaScript propio.

El proyecto fija `jsdom` en la versión `30.0.1` (`package.json`), y esa
versión **no implementa** `HTMLDialogElement.prototype.showModal` —
verificado ejecutando `node` fuera del harness de test, no leído de la
documentación de jsdom, que documenta versiones más nuevas. Sin
`showModal`, `<dialog>` se comporta en jsdom como un `<div>` con un
atributo `open`: no atrapa el foco, no bloquea el fondo, y `document.
activeElement` no entra al panel. Cualquier prueba de foco o de
`aria-modal` implícito pasaría o fallaría por una razón ajena al
comportamiento real del navegador.

Options:

- **(A) `<dialog>` nativo con `showModal()`** — cero JavaScript propio de
  foco/backdrop en un navegador real, pero intestable con Testing Library
  bajo la versión de jsdom que el proyecto fija: la prueba tendría que
  mockear el propio mecanismo que se quiere verificar, degradando la
  suite a pruebas de código fuente —el mismo problema, por una razón
  distinta, que ya fuerza a las escenas 3D a probarse por lectura del
  archivo en vez de comportamiento.
- **(B) Overlay propio con `role="dialog"`, `aria-modal="true"`, foco
  gestionado por `useEffect` y `Escape` por un listener de `keydown`** —
  DOM plano, sin dependencia de una API del navegador que el harness de
  pruebas no reproduce. Se puede probar de verdad con Testing Library:
  `toHaveFocus()`, `user.keyboard('{Escape}')`, clic en el backdrop.
- **(C) Una librería de diálogos (Radix, Headless UI, etc.)** — resuelve
  foco/backdrop/`aria` con más superficie probada que un overlay propio,
  pero es una dependencia nueva para un solo panel, en un proyecto que ya
  evitó un router entero (ADR-003) por el mismo criterio de tamaño.

## Decision

**(B)**. `AboutPanel` (`src/components/AboutPanel.tsx`) es un `<div
role="dialog" aria-modal="true">` con `tabIndex={-1}`, un `useRef` que
recibe el foco al montar (`panelRef.current?.focus()`), y un listener de
`keydown` que llama a `onClose` en `Escape`. El backdrop es un `<div>`
independiente, `aria-hidden`, con su propio `onClick={onClose}`.

No usa `<dialog>` ni una librería. El costo que evita —reimplementar
manualmente lo que `showModal()` da gratis— es menor que el costo que
paga la alternativa: una suite que no puede verificar el mecanismo que
implementa.

## Consequences

- El panel se puede probar con comportamiento real, no con lectura de
  código fuente: las 10 pruebas de `AboutPanel.test.tsx` ejercitan foco,
  teclado y clic, no aserciones sobre el archivo.
- `AboutPanel` reimplementa a mano lo que `<dialog>` daría gratis en un
  navegador real: atrapar el foco (parcialmente — entra al montar, pero
  nada impide que `Tab` lo saque del panel; no hay foco-trampa cíclico),
  cerrar con `Escape`, y bloquear la interacción con el fondo por z-index
  y backdrop, no por un mecanismo de la plataforma.
- El patrón —overlay propio, no `<dialog>`— es el que cualquier futuro
  modal de esta aplicación debería copiar, no reabrir la misma pregunta.
- Si el proyecto sube la versión de `jsdom` más adelante y esa versión
  implementa `showModal`, la razón que rechazó (A) desaparece; no es un
  rechazo permanente de `<dialog>`, es un rechazo bajo la versión fijada
  hoy.

## Alternatives considered

**(A) `<dialog>` nativo.** Rechazada porque la versión de `jsdom` que el
proyecto fija no implementa `showModal`, y probar un panel modal sin
poder ejercitar su propio mecanismo de foco/bloqueo no es una prueba de
comportamiento — sería una prueba de que el componente existe.

**(C) Una librería de diálogos.** Rechazada por tamaño: un panel de
contenido fijo, sin foco-trampa cíclico exigido por ningún `must-a11y-XXX`
ni por el `scope.md` de `e9.7`, no justifica una dependencia nueva. El
mismo criterio que llevó a ADR-003 a rechazar un router para seis modos.
