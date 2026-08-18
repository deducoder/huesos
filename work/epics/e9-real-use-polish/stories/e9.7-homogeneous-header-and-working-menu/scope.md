# Story e9.7: Homogeneous header, and a menu that opens — Scope

## User story

As a quien usa la aplicación,
I want que la cabecera de la ficha se vea como el resto de las cajas de la
interfaz, y que el botón de menú abra algo de verdad,
so that la aplicación se sienta terminada, y pueda leer de dónde sale el
modelo 3D y qué pasa con mi progreso sin tener que abrir el repositorio.

## Acceptance criteria

```gherkin
Given que estoy viendo la ficha completa de un hueso
When miro su cabecera
Then tiene el mismo lenguaje visual que el resto de las cajas de la
     aplicación — esquina redondeada, borde y sombra —, no una barra plana

Given cualquier vista que no sea la ficha
When toco el botón de menú (el ícono de tres líneas)
Then se abre un panel con la atribución del modelo, su licencia, y el
     aviso de privacidad

Given el panel de menú abierto
When leo la atribución
Then aparece la fórmula literal que BodyParts3D exige, sin parafrasear

Given el panel de menú abierto
When leo el aviso de privacidad
Then dice lo que `must-privacy-006` ya garantiza — que el progreso no sale
     del navegador —, sin prometer nada que el código no cumpla

Given el panel de menú abierto
When lo cierro
Then vuelvo exactamente a la vista donde estaba, sin que cambie el modo
     ni el historial de "atrás" del sistema (ADR-013)

Given que navego con el teclado
When abro el panel de menú
Then el foco entra al panel y `Escape` (o cerrarlo) lo devuelve a donde
     estaba
```

## Example

Gemba sobre `src/App.tsx` y `src/data/ATTRIBUTION.md`:

| Elemento | Estado hoy |
|----------|-----------|
| Cabecera de la ficha | `border-tinta border-b-2 bg-panel` — barra plana sin esquina, sin sombra. El resto de la interfaz usa `rounded-suave border-2 border-tinta shadow-dura` (la píldora de pestañas, el logo, el propio menú). |
| `MenuIcono` | Envuelto en `IconoCuadrado`, un `<div aria-hidden="true">` — decorativo a propósito, "sin destino (no hay drawer ni ajustes construidos)", según el propio comentario del código. |
| Atribución | `src/data/ATTRIBUTION.md` existe, completo y correcto, pero nadie lo importa — vive solo en el repositorio. |
| Fórmula literal exigida | «BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan» — tiene que aparecer tal cual, no traducida ni parafraseada. |
| Aviso de privacidad | No existe como copy en la interfaz. `must-privacy-006` (RF-09) ya lo garantiza técnicamente: el progreso vive en `localStorage`, sin backend ni telemetría — el texto describe eso, no promete algo nuevo. |
| Advertencia de exactitud | Ya escrita en `ATTRIBUTION.md`: los autores del modelo no garantizan su exactitud anatómica. |
| Patrón de panel modal | No existe ninguno en la aplicación — es territorio nuevo, a decidir en el diseño (nativo `<dialog>` vs. un overlay propio). |

## In scope

- **La cabecera de la ficha** pasa a usar el mismo lenguaje visual que el
  resto de las cajas flotantes de la aplicación.
- **El botón de menú deja de ser un `<div aria-hidden="true">`** y pasa a
  ser un control real, accesible por teclado, que abre un panel.
- **El panel de menú** muestra, como mínimo: la fórmula de atribución
  literal que BodyParts3D exige, la licencia (CC BY-SA 4.0, con enlace), el
  aviso de privacidad (`must-privacy-006`/RF-09), y la advertencia de
  exactitud que los autores del modelo declaran.
- **Cerrar el panel** vuelve exactamente a donde estaba, sin tocar el modo
  ni empujar una entrada de historial — no es una vista más de ADR-013,
  es una capa encima de la vista actual.
- El botón de menú **no aparece en el modo `'ficha'`** — la cabecera de la
  ficha ya no monta `Pestanas`/`LogoIcono`/`MenuIcono`, solo "Volver"; si
  el diseño decide que el menú también debería estar disponible ahí, se
  declara explícitamente con su razón.

## Out of scope

- **Convertir la aplicación en PWA** — rabbit hole del brief de la épica.
- **Ajustes de usuario** (tema, idioma, etc.) — el menú de este scope es
  informativo, no un panel de configuración; nada de los nueve puntos lo
  pide.
- **Traducir o resumir la fórmula de atribución** — tiene que ir literal.
- **Cambiar `ATTRIBUTION.md`** — es la fuente; esta historia la muestra en
  la interfaz, no la reescribe.
- **Un enlace profundo al panel de menú** (por ejemplo, abrirlo desde una
  URL) — ADR-013 ya decidió que el historial transporta estado, no
  direcciones, y el panel no es un modo de `App`.

## Done when

- La cabecera de la ficha se ve con el mismo lenguaje visual —esquina
  redondeada, borde, sombra— que el resto de la interfaz.
- El botón de menú, en cualquier vista donde aparece, abre un panel real
  con la atribución literal, la licencia, el aviso de privacidad y la
  advertencia de exactitud.
- La atribución de BodyParts3D aparece con su fórmula exacta, sin
  parafrasear.
- Cerrar el panel no cambia el modo de la aplicación ni agrega una entrada
  al historial.
- El panel es alcanzable y cerrable por teclado.
- `./scripts/check` y `./scripts/check-integration` en verde.
- Verificado a mano en el teléfono: abrir el menú desde distintas vistas,
  leer el contenido, cerrarlo, confirmar que "atrás" del sistema sigue
  comportándose como antes de esta historia.

## Notes

- **Es la última historia de E9.** Cierra el incumplimiento de licencia
  que motivó parte de la épica —hoy la atribución solo vive en el
  repositorio— y el `scope.md` de la épica lo pone entre sus "Done when":
  atribución legible desde la interfaz.
- **`App.tsx` es el archivo que e9.6 reorganizó** alrededor de un único
  punto de navegación (`navegar`). El design tiene que decidir si el panel
  de menú es un estado local de `App` (un `useState<boolean>` propio) o
  algo más — sin inventar un mecanismo de navegación paralelo a
  `navegar`/ADR-013 para algo que no es un modo.
