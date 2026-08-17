# Epic E7: Mobile-first redesign — Brief

## Hypothesis

Para los estudiantes de anatomía que llegan a la aplicación desde el teléfono
—su primer y muchas veces único punto de contacto—, un rediseño **mobile-first
con dirección neobrutalista suave** es una capa de presentación construida desde
la pantalla chica hacia arriba, que hace utilizable en el móvil lo que hoy solo
funciona en escritorio y le da a la herramienta un carácter propio.

A diferencia del front actual —oscuro, sin sistema de diseño y con dos únicos
breakpoints, donde en un teléfono el esqueleto 3D se dibuja en una franja de
150 px y ninguno de los 209 botones alcanza el mínimo táctil—, el rediseño parte
del móvil como caso base y trata el escritorio como la ampliación, no al revés.

## Success metrics

- **Leading:** en 390×844, el lienzo 3D ocupa una porción útil de la pantalla
  —no su altura intrínseca de 150 px— y ningún objetivo táctil interactivo queda
  por debajo de 44×44 px. Medible con una sonda de navegador en la primera
  historia, contra las cifras de hoy: canvas 390×150, 209 de 209 botones por
  debajo del mínimo.
- **Lagging:** las seis vistas comparten un sistema de tokens único —color,
  borde, sombra, radio, tipografía— en vez de utilidades repetidas a mano, y
  `should-perf-007` deja de ser un guardrail sin medición: se verifica la
  respuesta a la selección en un móvil de gama media, que es lo que el propio
  guardrail dice y nadie comprobó nunca.

## Appetite

L — 8-10 historias. Cubre el sistema de diseño y las seis vistas (explorar,
fichas, ficha, elegir test, test sobre esqueleto, test sobre hueso).

El tamaño es una decisión, no una estimación: dejar el modo test con la piel
anterior partiría la aplicación en dos estéticas, y el modo test es donde el
estudiante pasa el tiempo.

## Dirección visual

Anclada a tres referencias que el usuario aportó —dos de móvil, una de
escritorio— y no a la etiqueta «neobrutalismo», que cada quien rellena distinto.
Lo que las tres comparten:

| Rasgo | Lo observado |
|---|---|
| Borde | Negro sólido, 1,5-3 px, en casi todo contenedor |
| Sombra | Dura y desplazada, sin desenfoque |
| Esquinas | Redondeadas y generosas, 12-24 px — no esquina viva |
| Fondo | Claro siempre: blanco, gris casi blanco, crema |
| Acentos | Pasteles y saturados planos: azul cielo, amarillo, coral, teal, lila |
| Tipografía | Display muy pesada y redondeada en títulos; sans normal en cuerpo |
| Composición | Tarjetas y píldoras; en móvil, scroll vertical con carruseles |

Es neobrutalismo **suave**: borde y sombra dura con paleta amable, no el
brutalismo áspero de esquina viva. Implica invertir la aplicación entera, que
hoy es oscura (`slate-950`).

**Decidido al abrir la apuesta:** la tipografía display se **empaqueta** en el
bundle, con licencia libre revisada y subsetteada a latín. No es una preferencia
estética: `must-privacy-006` prohíbe cualquier petición de red en tiempo de
ejecución y ya hay una prueba de navegador que lo vigila, así que Google Fonts
está descartado por construcción.

## Scope boundaries

### No-gos

- **Ninguna petición de red en tiempo de ejecución** — nunca. `must-privacy-006`
  es un `must` con dos gates que lo vigilan. Ninguna fuente, icono, hoja de
  estilos ni imagen puede venir de un tercero, por bonito que quede.
- **No se degrada la accesibilidad para conseguir la estética** — nunca.
  `must-a11y-005` exige que toda región de hueso sea alcanzable y activable por
  teclado, exponga su nombre accesible, y que el color no sea nunca el único
  indicador de acierto o error. El neobrutalismo tiende a ayudar en contraste;
  donde no lo haga, gana el guardrail.
- **No se toca el motor ni el dominio** — nunca. `src/domain/`, `src/data/` y el
  activo 3D quedan fuera: esta épica es capa de presentación. El único punto de
  contacto admitido con la escena es el color de fondo del lienzo y su
  encuadre, que son decisiones de vista.
- **No se cambia la navegación por un router** — nunca en esta épica. ADR-003
  decidió montar vistas sin router y sigue vigente; reabrirlo es otra decisión,
  con su propio ADR.

### Rabbit holes

- **Rehacer el navegador de 206 huesos como una arquitectura de información
  nueva.** El tratamiento de tarjeta con borde y sombra no escala a 206
  elementos, y las tres referencias resuelven listas cortas, no largas. Hay una
  salida en los datos que ya existen —10 regiones anatómicas—, pero perseguir
  búsqueda, filtros o navegación por facetas es una épica distinta.
- **Animación y micro-interacción.** El kit de skills instalado invita a ello.
  Una transición mal puesta en un canvas WebGL cuesta rendimiento en el mismo
  móvil de gama media que `should-perf-007` vigila, y el objetivo de la épica es
  que la aplicación se pueda usar, no que se sienta viva.
- **Modo claro y oscuro.** Las referencias son claras; sostener dos temas
  duplica cada decisión de color antes de que la primera esté validada.
- **Perseguir la referencia píxel a píxel.** Son aplicaciones de audiolibros,
  puntos y cursos: ninguna tiene un lienzo 3D ni una lista de 206 elementos.
  Sirven de dirección, no de maqueta.
