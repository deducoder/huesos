# Story e7.3: Tipografía empaquetada — Scope

## User story

As a estudiante que abre la aplicación en su teléfono,
I want que los títulos tengan la voz visual que el rediseño promete, y que la
aplicación cargue sin pedirle nada a nadie,
so that la interfaz se vea como debe sin que mi navegación salga del navegador
ni dependa de que un tercero esté disponible.

## Acceptance criteria

```gherkin
Given la aplicación cargada
When se observan las peticiones de red
Then no hay ninguna a un dominio de terceros — la fuente se sirve del propio
     origen, como exige `must-privacy-006`

Given un título de la interfaz
When se mira en pantalla
Then usa la familia display elegida, no la pila del sistema

Given el cuerpo de texto
When se mira en pantalla
Then sigue usando una sans, y la display no invade párrafos ni listas

Given cualquier texto que la aplicación muestre — nombres en español con
      tildes y eñes, nombres en latín, signos de apertura
When se renderiza con la familia empaquetada
Then no aparece ningún carácter sin glifo

Given el archivo de fuente servido
When se mide su tamaño
Then está dentro del presupuesto declarado en el diseño, y el diseño dice cuál
     es y por qué

Given la licencia de la familia elegida
When se busca en el repositorio
Then su texto está incluido junto al archivo de fuente
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| `huesos-mono` en la cabecera | mirar | display pesada, no la del sistema |
| «hueso cigomático izquierdo · ¿Qué hueso es?» | renderizar | sin cuadros vacíos en `á í ó ú ñ ¿` |
| `public/fonts/` | listar | el `.woff2` de la display y su licencia |
| DevTools → Network | cargar la aplicación | cero peticiones fuera del propio origen |

## In scope

- **Elegir una familia display de licencia libre**, comparando candidatas
  reales renderizadas — el brief pide «display muy pesada y redondeada» y lo
  ancla a referencias, no a un nombre.
- **Un ADR** con la elegida, las descartadas y el porqué de cada descarte.
- **Servirla del propio bundle**, subseteada a los caracteres que la aplicación
  necesita, con su licencia incluida.
- **Conectarla al token tipográfico**, de modo que ningún componente nombre una
  familia a mano — el mismo contrato que e7.1 estableció para el color.
- **Un presupuesto de peso declarado y verificado**, porque la épica sirve a un
  móvil de gama media y `should-perf-007` sigue sin medición hasta e7.10.

## Out of scope

- **Cambiar la familia del cuerpo de texto.** La pila del sistema no cuesta
  ninguna descarga y se lee bien; el brief solo pide display en títulos. Si más
  adelante desentona, es una decisión con su propio coste.
- **Ajustar la escala tipográfica de cada vista** — qué tamaño lleva cada
  título es de la historia de esa vista (e7.4 a e7.8). Acá se define la familia
  y su token, no dónde se aplica cada medida.
- **Iconos, emoji o cualquier otro activo de terceros** — no-go del brief; esta
  historia no abre esa puerta por traer un archivo nuevo.
- **Medir el impacto en el arranque** — es `should-perf-007` y lo mide e7.10.
  Acá se declara el presupuesto y se comprueba el tamaño del archivo, que es lo
  que sí se puede verificar hoy.

## Done when

- `public/fonts/` contiene la familia display y el texto de su licencia.
- La aplicación declara la fuente con `@font-face` desde el propio origen, y el
  token tipográfico la nombra en un solo sitio.
- La prueba de navegador de `must-privacy-006` sigue verde con la fuente ya
  empaquetada: cero peticiones a terceros.
- Ningún carácter que la aplicación pueda mostrar queda sin glifo, verificado
  contra el catálogo real de 206 huesos y no contra una muestra.
- El archivo servido está dentro del presupuesto declarado.
- Existe el ADR con la elegida y las descartadas.
- `./scripts/check` en verde.

## Notes

- Gemba del 2026-08-17 al arrancar: **no hay ninguna declaración tipográfica en
  el proyecto** — ni `font-family` en `src/index.css` ni en `index.html`; la
  aplicación usa la pila por defecto de Tailwind. `--text-titulo` existe desde
  e7.1 pero solo fija tamaño.
- **No hay herramientas de subsetting instaladas** (`pyftsubset`/`fontTools`
  ausentes). Cómo se obtiene un archivo ya subseteado sin añadir andamiaje es
  una decisión del diseño, no una tarea a improvisar.
- `public/draco/` es el precedente exacto de esta historia: un activo de un
  tercero servido desde el propio origen para no violar `must-privacy-006`,
  con la razón escrita en el código que lo carga.
- Las dos frases que la retrospectiva de e7.2 dejó para este plan: **verificar
  las candidatas en un teléfono real, no en captura**, y **reconstruir antes de
  medir** si queda un servidor levantado a mano.
