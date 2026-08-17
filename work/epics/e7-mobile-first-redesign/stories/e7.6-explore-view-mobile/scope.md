# Story e7.6: Vista Explorar en móvil — Scope

## User story

As a estudiante que gira y toca el esqueleto en su teléfono,
I want ver el modelo 3D ocupando toda la pantalla y la identidad del hueso
elegido en una tarjeta flotante, sin una lista que ya no necesito mirar
mientras exploro,
so that la vista se sienta como mirar el esqueleto, no como usar un panel de
control con una ventana 3D adentro.

## Acceptance criteria

```gherkin
Given la vista Explorar en 390×844
When se mide el lienzo
Then ocupa el alto disponible completo bajo la cabecera y las pestañas —el
     navegador de huesos ya no vive en esta vista

Given ningún hueso elegido
When se abre Explorar
Then no hay panel ni tarjeta ocupando espacio del lienzo — o, si lo hay, no
     repite instrucciones que ya no son ciertas («recorré la lista»)

Given un hueso elegido, tocando el esqueleto
When aparece la tarjeta de identidad
Then flota sobre el lienzo, no lo reduce ni lo reparte en columnas

Given un usuario de teclado o lector de pantalla
When abre la aplicación buscando un hueso concreto
Then la pestaña «Fichas» sigue ofreciendo la lista completa, y desde ahí
     llega a la ficha de cualquier hueso con su propia escena y su panel de
     identidad — el camino accesible completo no pasa por Explorar

Given el texto que describe el lienzo a un lector de pantalla
When se lee en Explorar
Then no dice «usá la lista de huesos por región» —ya no existe ahí— sino que
     orienta hacia la pestaña Fichas
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Explorar, 390×844, nada elegido | medir el lienzo | ocupa el alto completo bajo cabecera/pestañas |
| Tocar «fémur» en la escena | ver la tarjeta | aparece flotando abajo, con «fémur», «Lado: derecho», el botón de ficha |
| Usuario de teclado, sin selección | leer el `sr-only` del lienzo | menciona la pestaña Fichas, no «la lista» |
| Pestaña Fichas → tocar «martillo» | navegar | abre `BoneDetailView` con su escena aislada e identidad, igual que hoy |

## In scope

- **Quitar `BoneNavigator` de `ExploreView`.** El lienzo pasa a ocupar el
  alto disponible completo. `BoneNavigator` no se toca ni se borra: sigue
  siendo la vía completa desde la pestaña «Fichas», sin cambios.
- **La identidad del hueso como tarjeta flotante**, con el tratamiento visual
  de `~/refs/cards.jpg` —borde negro, sombra dura, esquina muy redondeada—
  que `--radius-tarjeta` y `--shadow-dura` ya declaran desde e7.1/e7.4.
- **Corregir dos textos que dejan de ser ciertos**: el estado vacío de
  `BoneIdentity` («Podés recorrer la lista con el teclado…») y el `sr-only`
  por defecto del lienzo en `SkeletonScene` («usá la lista de huesos por
  región») — los dos asumen una lista que ya no está en esta vista.
- **Documentar la reorganización del camino accesible** en un ADR que
  reconoce lo que cambia respecto de ADR-002: la vía por teclado deja de
  convivir con la escena dentro de Explorar y pasa a vivir completa en
  Fichas → ficha, con su propia escena y su propio panel de identidad. Es una
  decisión consciente, verificada contra el camino real de `App.tsx`, no un
  vacío de accesibilidad.

## Out of scope

- **Tocar `BoneNavigator`, `BoneDetailView` o la lógica interna de
  `BoneIdentity`** — están terminados (e7.4, e7.5) y esta historia solo
  cambia dónde y cómo se monta `BoneIdentity` dentro de `ExploreView`.
- **El breakpoint de escritorio** — es e7.9. Esta historia se resuelve para
  390 px; en 1400×900 el layout puede seguir como hoy hasta esa historia.
- **Cambiar cómo se llega a la pestaña Fichas** — el navbar
  Explorar/Fichas/Test sigue como está, sin tocar `App.tsx` más allá de lo
  que el cambio de `ExploreView` exija.
- **Medir el rendimiento del lienzo a pantalla completa** — es `e7.10`.

## Done when

- En 390×844, el lienzo de Explorar mide el alto disponible completo, sin la
  columna del navegador.
- La tarjeta de identidad aparece flotando al elegir un hueso, con el
  tratamiento visual de la referencia de píldoras.
- Ni el estado vacío de `BoneIdentity` ni el `sr-only` del lienzo en Explorar
  mencionan una lista que ya no está ahí.
- Existe un ADR que documenta el cambio de camino accesible, verificado
  contra `App.tsx`: Fichas → ficha ofrece escena aislada e identidad completa
  para cualquier hueso, por teclado.
- `./scripts/check` en verde; los tests de `BoneNavigator`, `BoneIdentity` y
  `BoneDetailView` siguen verdes sin tocarse.

## Notes

- **Decisión tomada con el usuario antes de escribir este scope**: la
  primera versión del pedido —lienzo a pantalla completa, tarjeta flotante,
  sin lista en Explorar— chocaba con `must-a11y-005` y con el no-go explícito
  del brief de la épica («no se degrada la accesibilidad para conseguir la
  estética — nunca»), porque un `<canvas>` WebGL no tiene nada que un lector
  de pantalla pueda enfocar. Se preguntó, y la resolución del usuario es:
  el navbar (Explorar/Fichas/Test) queda arriba siempre, la lista se elimina
  de Explorar definitivamente, y sobrevive completa en Fichas.
- **Esa resolución se verificó, no se dio por buena.** `App.tsx` confirma que
  la pestaña «Fichas» monta `BoneNavigator` a lista completa, y que
  seleccionar cualquier hueso ahí —representable o no— abre `BoneDetailView`
  con su propia escena aislada (ya dimensionada correctamente desde e7.2) y su
  propio `BoneIdentity` (ya con mínimo táctil y tipografía display desde
  e7.5). El camino accesible completo existe y es independiente de Explorar.
- Gemba del 2026-08-17: `BoneIdentity` en su estado vacío dice «Podés recorrer
  la lista con el teclado o girar el esqueleto y hacer clic»; `SkeletonScene`
  usa por defecto (`ExploreView` no lo sobreescribe) «Para elegir un hueso sin
  usar el ratón, usá la lista de huesos por región». Los dos quedan falsos si
  la lista desaparece de esta vista.
- Referencias: `~/refs/cards.jpg` (aportada probando e7.2, parqueada para esta
  historia), ADR-002 (a superseder parcialmente), el no-go de accesibilidad
  del brief de E7, la retrospectiva de e7.5 («revisar `~/refs/cards.jpg`
  antes de cortar el diseño»).
