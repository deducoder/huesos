# Story e7.1: Tokens y shell — Scope

## User story

As a estudiante que abre la aplicación en su teléfono,
I want que el marco de la aplicación —cabecera y pestañas— ocupe la pantalla
real y se pueda pulsar con el pulgar,
so that pueda cambiar de modo de estudio sin apuntar ni pinzar, y vea desde el
primer momento la dirección visual que el resto de la épica va a extender.

## Acceptance criteria

```gherkin
Given la aplicación abierta en un viewport de 390x844
When se miden las tres pestañas de nivel superior
Then cada una mide 44x44 px o más

Given la aplicación abierta en un móvil donde la barra de URL ocupa alto
When se mira el pie de la pantalla
Then el contenido no queda cortado por debajo del borde visible: el alto se
     calcula con la unidad dinámica, no con 100vh

Given `src/index.css`
When se lee el archivo
Then declara en `@theme` los tokens de color, borde, sombra dura, radio y
     mínimo táctil que fija ADR-007

Given cualquier componente de `src/components` o `src/features`
When se busca una utilidad de color literal de la paleta vieja
     (`slate-*`, `sky-*`, `amber-*`)
Then no aparece ninguna

Given la suite unitaria y la de navegador
When se ejecutan tras el cambio
Then siguen en verde sin reescribir ningún test: ningún rol ni nombre
     accesible cambió
```

## Example

| Input | Action | Expected output |
|-------|--------|-----------------|
| Viewport 390×844, pestaña «Fichas» | medir su caja | alto y ancho ≥ 44 px (hoy: `py-1.5 text-sm`, ~30 px de alto) |
| `src/index.css` | leerlo | más de una línea: `@import "tailwindcss"` + bloque `@theme` con los tokens |
| `grep -rE "slate-|sky-|amber-" src/components src/features` | ejecutarlo sobre el código de producción | cero resultados (hoy: 23 líneas en 5 archivos) |
| `main` en `App.tsx` | leer su clase de alto | `dvh`, no `h-screen` |

## In scope

- **Los tokens en `@theme`** de `src/index.css`: paleta clara, borde negro,
  sombra dura sin desenfoque, radios generosos y el mínimo táctil de 44 px,
  según ADR-007. Es la fuente única que las nueve historias siguientes
  consumen.
- **El shell rediseñado** en `App.tsx`: cabecera y pestañas con los tokens
  nuevos, con las pestañas por encima del mínimo táctil.
- **`h-screen` → unidad dinámica (`dvh`)**, el defecto que solo se ve en un
  teléfono.
- **La suite de navegador puede medir en 390×844.** Hoy corre con viewport fijo
  `1400×900`, así que ninguna afirmación de esta historia sobre el móvil es
  verificable sin esto. Es infraestructura mínima, no una suite nueva.
- **Sustituir los 23 colores literales de las vistas por tokens, sin
  rediseñarlas.** No es adelanto de trabajo ajeno: al invertir el fondo a
  claro, `text-slate-200/300/400/500`, `text-sky-300` y `text-amber-200`
  quedan ilegibles sobre claro. Cada vista conserva su forma actual —
  distribución, tamaños, jerarquía — y solo cambia de qué sale su color.

## Out of scope

- **El dimensionado del lienzo 3D y cómo se lee el esqueleto beige sobre fondo
  claro** — es e7.2, y es el riesgo más caro de la épica; se decide con la
  escena delante.
- **La tipografía display** — es e7.3. Este scope declara la escala tipográfica
  como token, no la familia; hasta e7.3 el token apunta a la pila del sistema.
- **El rediseño de cada vista** — navegador (e7.4), identidad (e7.5), explorar
  (e7.6), ficha (e7.7), test (e7.8). Aquí solo cambia el origen de su color,
  nunca su forma. Incluye `ElegirVarianteDeTest`, que vive en `App.tsx` por
  residencia pero pertenece a e7.8.
- **Los breakpoints hacia escritorio** — es e7.9. Esta historia mira solo a
  390 px; que el escritorio no empeore se comprueba, que mejore no.
- **Los objetivos táctiles que no son del shell** — los 206 botones del
  navegador son e7.4. Aquí se miden las pestañas, no el catálogo.

## Done when

- En 390×844, medido por la suite de navegador: ningún objetivo interactivo del
  shell queda por debajo de 44×44 px.
- `src/index.css` declara los tokens en `@theme`, y una búsqueda de utilidades
  de color literales sobre `src/components` y `src/features` no devuelve nada.
- `App.tsx` calcula el alto con la unidad dinámica.
- La aplicación es legible de punta a punta sobre el fondo claro: ninguna vista
  queda con texto claro sobre claro a la espera de su historia.
- Los 201 tests unitarios y los 4 de navegador siguen verdes **sin
  reescribirse**.
- `./scripts/check` en verde.

## Notes

- Gemba del 2026-08-17, al arrancar la historia: **ningún componente pone el
  fondo global** — lo da `main` en `App.tsx` (`bg-slate-950`), y los cinco
  componentes con color solo escriben texto y bordes. Invertir el shell a claro
  sin tocarlos no dejaría dos estéticas conviviendo, como preveía ADR-007:
  dejaría la aplicación ilegible durante ocho historias. De ahí que el cambio
  mecánico de color entre en esta historia y el rediseño no.
- Los dos `bg-slate-900` que sí existen (`ExploreView`, `BoneDetailView`) son
  el fondo del panel del lienzo. Cambian a token aquí; **qué superficie lleva
  el lienzo para que el hueso se lea es de e7.2**, y puede volver a tocarlos.
- El `sticky top-0 bg-slate-900` de los encabezados de región depende del color
  de fondo para no dejar ver el texto por debajo. Al pasar a token hay que
  conservar esa opacidad — el design de la épica lo señala como fácil de
  olvidar.
- `SkeletonScene.test.tsx` comprueba el fuente con expresiones regulares
  (`stripMidline\(`, `half="mirrored"`, `[-1, 1, 1]`). Esta historia no toca
  ese archivo; si una de esas pruebas se pone roja, es señal de haber tocado
  algo declarado fuera de alcance.
- Referencias: `records/decisions/adr-007-visual-direction-and-tokens.md`,
  `work/epics/e7-mobile-first-redesign/design.md` (Gemba findings, Key
  contracts), `plan.md` (e7.1 va primera por bloqueo duro, no por riesgo).
