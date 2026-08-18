---
type: adr
id: ADR-013
title: "El «atrás» del sistema recorre el selector de modo mediante la History API, sin adoptar un router"
status: accepted
date: 2026-08-17
epic: e9
---

# ADR-013: El «atrás» del sistema recorre el selector de modo mediante la History API, sin adoptar un router

## Status

Accepted

Extiende ADR-003, no lo supersede: la decisión de no tener router sigue
vigente y esta la confirma bajo una exigencia que ADR-003 no conocía.

## Context

Usando la aplicación en un teléfono real, pulsar el «atrás» del sistema
—botón o gesto— **sale del sitio** en vez de volver a la vista anterior. No
es un defecto del DOM ni de ningún componente: `App.tsx` navega con un
`useState<Modo>`, y la aplicación nunca empuja una entrada de historial. El
navegador tiene una sola entrada, así que «atrás» la abandona. Es la
consecuencia directa y no anticipada de ADR-003, que eligió un selector de
modo en vez de un router porque `RF-03` no pedía enlaces profundos.

Lo que ADR-003 no evaluó es que en un teléfono el «atrás» **no es una
comodidad, es el gesto de salida principal**: quien abre una ficha espera
volver con él, no buscar un botón. Hoy sale de la aplicación y pierde la
selección.

Hay seis destinos alcanzables (`explorar`, `fichas`, `ficha`,
`test-elegir`, `test-esqueleto`, `test-hueso`), y las transiciones reales
que un estudiante recorre hacia atrás son pocas: de una ficha a su origen
—`explorar` o `fichas`, que el propio `Modo` ya distingue—, y de una
variante de test a la elección de variante.

Options:

- **(A) Adoptar un router de cliente** (`react-router`, `wouter`) — el
  «atrás» sale gratis, y además URLs compartibles. Pero es la dependencia
  que ADR-003 rechazó, trae rutas, 404 y configuración, y ningún `RF-XX`
  pide enlaces profundos ni marcadores. El brief de E9 lo declara no-go.
- **(B) History API sobre el selector de modo** — cada cambio de modo
  empuja una entrada con `history.pushState`, y un escucha de `popstate`
  restituye el modo que esa entrada lleva. Sin dependencia nueva, sin
  URLs que mantener, y el estado sigue siendo el mismo `Modo` que hoy.
- **(C) No hacer nada** — documentar que la aplicación se abandona con
  «atrás». Es lo que ocurre hoy, y es la razón por la que el punto entró
  a la épica.

## Decision

**(B)**. Cada transición de modo empuja una entrada de historial que lleva
el `Modo` de destino; `popstate` restituye el `Modo` que la entrada trae, y
el «atrás» del sistema recorre la aplicación hacia atrás sin salir de ella.
La URL no cambia y no hay rutas que declarar: el historial transporta
estado, no direcciones.

El `Modo` viaja en el `state` de la entrada, no se reconstruye desde la URL.
Eso mantiene intacto el motivo de ADR-003 —no hay direcciones que diseñar,
mantener ni resolver— y deja el comportamiento donde ya vive la navegación.

La primera entrada, la que carga la aplicación, se conserva: agotar el
historial propio y volver a salir del sitio es correcto. Lo que se corrige
es salir **desde una ficha**, no salir desde la vista inicial.

## Consequences

- El «atrás» del teléfono se vuelve la salida natural de la ficha y del
  test, que es lo que un estudiante ya intenta hacer.
- `App.tsx` gana un efecto que escucha `popstate` y una función que empuja;
  el `Modo` deja de mutarse con `setModo` suelto y pasa por un único punto.
  Ese punto es también donde se ve, de un vistazo, qué transiciones existen.
- **La selección de hueso no viaja en el historial.** Vive en `App` desde
  e3.2 justamente para sobrevivir al ir y volver de la ficha; meterla en la
  entrada la haría retroceder también, que no es lo pedido.
- No hay URLs compartibles ni recargables por hueso. Recargar la página
  sigue devolviendo a `explorar`, igual que hoy.
- La verificación real es de navegador: `popstate` en jsdom no reproduce el
  gesto del teléfono. El comportamiento se prueba en la suite de Playwright
  con `page.goBack()`, y se confirma a mano en el dispositivo.

## Alternatives considered

**(A) Router de cliente.** Rechazada por el no-go del brief y por el mismo
motivo de ADR-003: introduce una capa —rutas, historial, 404, configuración—
para resolver un problema que son dos llamadas de plataforma. El día que
`RF-XX` pida un enlace compartible por hueso, ese es el ADR que supersede a
ADR-003; hoy no existe ese requisito.

**(C) No hacer nada.** Rechazada: es el estado actual y es la razón de que
el punto exista. En un teléfono, perder la aplicación entera al pulsar el
gesto de retroceso no es una carencia de comodidad, es una pérdida de
trabajo — el progreso persiste, pero la sesión de estudio no.
