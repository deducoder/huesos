# Story e9.6: The system back button walks the app — Scope

## User story

As a quien estudia con la aplicación en su teléfono,
I want que el «atrás» del sistema me devuelva a la vista anterior,
so that pueda salir de una ficha o de un test con el gesto que ya uso en
todas las demás aplicaciones, en vez de perder la sesión entera.

## Acceptance criteria

```gherkin
Given que abrí la ficha del fémur desde Fichas
When pulso el «atrás» del sistema
Then vuelvo a Fichas y sigo dentro de la aplicación

Given que abrí la ficha del fémur desde Explorar
When pulso el «atrás» del sistema
Then vuelvo a Explorar, no a Fichas

Given que estoy en el test de esqueleto completo, al que llegué eligiendo variante
When pulso el «atrás» del sistema
Then vuelvo a la elección de variante

Given que acabo de cargar la aplicación y estoy en Explorar
When pulso el «atrás» del sistema
Then salgo del sitio, porque no hay historial propio que recorrer

Given que volví de la ficha con el botón «← Volver» de la aplicación
When pulso el «atrás» del sistema
Then no reentro a la ficha que acabo de abandonar

Given que tenía el fémur seleccionado en Explorar y abrí su ficha
When vuelvo con el «atrás» del sistema
Then el fémur sigue seleccionado
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Explorar, fémur derecho seleccionado | «Ver ficha completa», luego «atrás» del sistema | Explorar, con el fémur derecho todavía seleccionado |
| Fichas → ficha del fémur | «atrás» del sistema | Fichas, no Explorar |
| Test → esqueleto completo | «atrás» del sistema | La elección de variante de test |
| Explorar recién cargada | «atrás» del sistema | La aplicación se abandona |

## In scope

- Cada transición de modo empuja una entrada de historial que lleva el
  `Modo` de destino en su `state` (ADR-013).
- Un escucha de `popstate` restituye el `Modo` que la entrada trae.
- Los botones que **ya significan «atrás»** —«← Volver» de la ficha y
  «← cambiar modo» del test— retroceden en el historial en vez de empujar
  una entrada nueva. Si empujaran, el «atrás» del sistema reentraría a la
  vista recién abandonada.
- Las transiciones de modo pasan a concentrarse en un único punto, que es
  lo que ADR-013 exige y lo que deja ver de un vistazo qué caminos existen.
- Una prueba de navegador con `page.goBack()`, porque la unitaria no
  alcanza.

## Out of scope

- **URLs propias por hueso, enlaces compartibles y marcadores** — ADR-013
  decide que el historial transporta estado, no direcciones. El día que un
  requisito pida un enlace compartible, es otro ADR.
- **Que la selección de hueso retroceda con el historial** — vive en `App`
  desde e3.2 precisamente para sobrevivir al ida y vuelta; que sobreviva es
  criterio de aceptación, no algo a corregir.
- **Que recargar la página conserve la vista** — sigue devolviendo a
  Explorar, igual que hoy.
- **El botón «adelante» del navegador** — lo que funcione, funciona; no se
  diseña ni se prueba en esta historia.

## Done when

- Desde una ficha abierta, el gesto «atrás» devuelve al origen correcto
  —Explorar o Fichas, según de dónde se entró— sin abandonar el sitio.
- Desde una variante de test, el gesto «atrás» devuelve a la elección de
  variante.
- Desde Explorar recién cargada, el gesto «atrás» abandona el sitio: el
  historial propio está agotado y no se secuestra.
- Volver con el botón de la aplicación y pulsar «atrás» a continuación no
  reentra a la vista abandonada.
- La selección de hueso sobrevive al ida y vuelta por la ficha.
- Comprobado con `page.goBack()` en Playwright **y** a mano en el teléfono
  a través del túnel. Ninguno de los dos solo.

## Notes

- **ADR-013** (`records/decisions/adr-013-system-back-button-walks-the-mode-selector.md`)
  gobierna esta historia: History API sobre el selector de modo, sin
  adoptar un router. Extiende ADR-003, no lo supersede.
- **El verde de la suite unitaria no prueba nada acá.** `popstate` en jsdom
  no reproduce el gesto de un teléfono; es el riesgo que el plan de la
  épica registró como alto. Una prueba que solo pase en jsdom deja la
  historia sin verificar.
- Es la primera historia de E9 y hace de walking skeleton: establece cómo
  se verifica el resto de la épica (navegador real más dispositivo).
- El dev server y su túnel están vivos y se dejan así; la comprobación
  manual va por ahí.
