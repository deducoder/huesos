# Story e7.1: Tokens y shell — Design

> Complexity: moderate

## 1 · What & why

**Problem:** la aplicación no tiene un solo sitio donde viva su aspecto —
`src/index.css` es una línea y el color está escrito a mano en 35 sitios — y su
marco no es usable con el pulgar: las pestañas miden ~30 px de alto y el alto
total se calcula con `100vh`, que en un móvil cuenta la barra de URL.

**Value:** al terminar, cambiar el aspecto de la aplicación es cambiar un
archivo, las nueve historias siguientes tienen de dónde consumir, y el marco ya
se puede pulsar con el pulgar en 390×844. Es medible: `min-h-tactil` en las
pestañas y cero utilidades de color literal bajo `src/`.

## 2 · Approach

Declarar los tokens de ADR-007 en `@theme` de `src/index.css`, rediseñar el
shell de `App.tsx` sobre ellos, y sustituir las 35 utilidades de color literal
por tokens **sin tocar la forma de ninguna vista**. Dos gates nuevos hacen
verificable lo que hoy sería una revisión a ojo: un test que falla ante
cualquier color literal en `src/`, y una prueba de navegador en 390×844 que
mide los objetivos del shell.

**Components affected:**

- `src/index.css`: modify — de `@import "tailwindcss"` a esa línea más el
  bloque `@theme` con color, radio, sombra, mínimo táctil y escala tipográfica.
- `src/App.tsx`: modify — cabecera y pestañas rediseñadas sobre tokens;
  `h-screen` → `h-dvh`; `ElegirVarianteDeTest` solo cambia de origen de color.
- `src/components/BoneNavigator.tsx`: modify — 6 líneas de color a token,
  conservando la opacidad del `sticky`.
- `src/components/BoneIdentity.tsx`: modify — 9 líneas de color a token.
- `src/features/bone-detail/BoneDetailView.tsx`: modify — 5 líneas.
- `src/features/explore/ExploreView.tsx`: modify — 3 líneas.
- `src/features/test/TestQuestion.tsx`: modify — 5 líneas.
- `tests/sources.ts`: create — `fuentesDeLaAplicacion`, extraída de
  `tests/privacy.test.ts`, que hoy la tiene privada. La necesitan dos gates.
- `tests/privacy.test.ts`: modify — importa el helper en vez de declararlo.
  Cambio mecánico; su aserción no cambia.
- `tests/design-tokens.test.ts`: create — el gate anti-literales.
- `e2e/mobile-shell.spec.ts`: create — `test.use({ viewport: 390×844 })` y la
  medición del mínimo táctil del shell.

**Legacy sweep:** nada queda huérfano. Las 35 utilidades de color literal
desaparecen sustituidas, no duplicadas, y `tests/design-tokens.test.ts` impide
que vuelvan. `fuentesDeLaAplicacion` se **extrae antes de duplicarse**: hoy vive
privada en `privacy.test.ts` y el gate nuevo la necesita igual. Ningún archivo
se borra; ningún componente se crea.

## 3 · Interface / examples

### Los tokens — verificado contra Tailwind 4.3.3 del propio proyecto

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-superficie: #FAF7F2;      /* fondo de la aplicación — crema */
  --color-panel: #FFFFFF;           /* tarjetas y paneles */
  --color-tinta: #17150F;           /* texto y borde negro */
  --color-tinta-suave: #5A554A;     /* texto secundario */
  --color-acento: #2F5FE0;          /* selección — hereda el rol de sky-700 */
  --color-acento-suave: #DCE6FF;    /* fondo pastel del estado activo */
  --color-aviso: #B4560A;           /* borde de ausencia — hereda amber-700 */
  --color-aviso-fondo: #FFF1DC;
  --color-aviso-tinta: #5C3200;

  --radius-suave: 0.75rem;          /* 12 px */
  --radius-tarjeta: 1.25rem;        /* 20 px — el rango de ADR-007 es 12-24 */
  --shadow-dura: 3px 3px 0 0 #17150F;   /* desplazada, sin desenfoque */

  --spacing-tactil: 44px;           /* el mínimo táctil, como token */
  --text-titulo: 1.75rem;
}
```

Comprobado ejecutando el compilador de Tailwind del proyecto sobre este bloque:
cada namespace emite la utilidad esperada — `bg-superficie`, `text-tinta`,
`border-tinta`, `rounded-tarjeta`, `shadow-dura`, `min-h-tactil`, `min-w-tactil`,
`p-tactil`, `text-titulo`. `border-2`, `border-3`, `h-dvh` y `min-h-dvh` ya
existen de fábrica; el ancho de borde no necesita token propio.

Contraste calculado sobre estos valores (WCAG 2.1, texto normal exige 4.5):

| Par | Ratio |
|---|---:|
| tinta sobre superficie | 17.08 |
| tinta sobre panel | 18.25 |
| tinta-suave sobre superficie | 6.94 |
| blanco sobre acento | 5.48 |
| tinta sobre acento-suave | 14.61 |
| aviso-tinta sobre aviso-fondo | 9.87 |
| acento sobre superficie (el latín en cursiva) | 5.13 |

### El shell

```tsx
// src/App.tsx — antes
<main className="flex h-screen flex-col bg-slate-950 text-slate-100">
  <header className="border-slate-800 border-b px-6 py-3">

// después
<main className="flex h-dvh flex-col bg-superficie text-tinta">
  <header className="border-tinta border-b-2 px-4 py-3">
```

```tsx
// las pestañas — antes: `px-3 py-1.5 text-sm`, ~30 px de alto
const clase = (activa: boolean) =>
  `rounded px-3 py-1.5 text-sm ${activa ? 'bg-sky-700 font-semibold text-white' : 'text-slate-300 hover:bg-slate-800'}`

// después: el mínimo táctil sale del token, no de un valor por componente
const clase = (activa: boolean) =>
  `inline-flex min-h-tactil min-w-tactil items-center justify-center rounded-suave border-2 border-tinta px-4 ${
    activa ? 'bg-acento font-semibold text-panel shadow-dura' : 'bg-panel text-tinta'
  }`
```

### El gate anti-literales

```ts
// tests/design-tokens.test.ts — falla con el código de hoy, pasa al terminar
const PALETA_DE_FABRICA =
  /\b(?:bg|text|border|outline|ring|fill|stroke|from|via|to|decoration|shadow|accent|caret|divide|placeholder)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b|\b(?:bg|text|border)-(?:white|black)\b/

it('ningún componente escribe un color a mano', () => {
  const infractores = fuentesDeLaAplicacion()
    .flatMap((ruta) => /* línea a línea */ [])
  expect(infractores).toEqual([])
})
```

Salida esperada hoy (RED) y al cerrar la historia (GREEN):

```
FAIL  tests/design-tokens.test.ts
  ningún componente escribe un color a mano
  - Expected: []
  + Received: [ 'src/App.tsx:37 bg-sky-700', 'src/App.tsx:37 text-slate-300', … 35 líneas ]

PASS  tests/design-tokens.test.ts   (al terminar)
```

### La medición móvil

```ts
// e2e/mobile-shell.spec.ts
test.use({ viewport: { width: 390, height: 844 } })

test('todo objetivo del shell se puede pulsar con el pulgar', async ({ page }) => {
  await page.goto('/')
  for (const nombre of ['Explorar', 'Fichas', 'Test']) {
    const caja = await page.getByRole('button', { name: nombre, exact: true }).boundingBox()
    expect(caja?.height ?? 0, `alto de "${nombre}"`).toBeGreaterThanOrEqual(44)
    expect(caja?.width ?? 0, `ancho de "${nombre}"`).toBeGreaterThanOrEqual(44)
  }
})
```

Hoy falla con `alto de "Explorar": 30`. `test.use` a nivel de archivo basta:
no hace falta un proyecto nuevo en `playwright.config.ts`, cuyo viewport
`1400×900` sigue gobernando `explore.spec.ts`.

## 4 · Acceptance criteria

- **Must:**
  1. `tests/design-tokens.test.ts` pasa de rojo a verde, y su rojo inicial lista
     las 35 líneas reales — un verde con la lista vacía por un recorrido roto no
     cuenta.
  2. En 390×844, las tres pestañas miden ≥ 44 px de alto y de ancho, medido por
     `e2e/mobile-shell.spec.ts`.
  3. `src/App.tsx` calcula el alto con `h-dvh`.
  4. Los 201 tests unitarios y los 4 de navegador siguen verdes **sin
     reescribirse**: ningún rol ni nombre accesible cambió (`must-a11y-005`).
  5. Todo par texto/fondo de los tokens supera 4.5:1, con el cálculo registrado.
- **Should:**
  1. Los encabezados de región del navegador conservan fondo opaco: el
     `sticky top-0` depende de él para no dejar ver el texto por debajo.
  2. El escritorio no empeora — se mira una vez en 1400×900; que mejore es e7.9.
- **Must NOT:**
  1. No se rediseña ninguna vista: distribución, tamaños y jerarquía quedan como
     están. Aquí solo cambia de dónde sale el color.
  2. No se toca `src/domain/`, `src/data/`, `skeleton.glb` ni las dos escenas 3D
     — `SkeletonScene.test.tsx` comprueba el fuente con expresiones regulares y
     ponerlo rojo sería la señal de haber salido del alcance.
  3. No se añade ninguna petición de red (`must-privacy-006`): la familia
     tipográfica sigue siendo la pila del sistema hasta e7.3.
  4. No se añade `tailwind.config.js` — ADR-007, alternativa (C).

### Scenarios (delta over the scope)

```gherkin
Given el conteo que el scope da por hecho — «23 líneas en 5 archivos»
When se cuentan los colores literales con un grep que no excluya
     `src/features/test/` por accidente
Then son 35 líneas en 6 archivos: el filtro del scope trataba `.test.` como
     expresión regular y el punto comodín se comía la ruta `/test/`

Given `App.tsx`, que el scope trata solo como shell
When se lee entero
Then contiene 7 de esas 35 líneas, y dos de ellas están en
     `ElegirVarianteDeTest`, cuya forma pertenece a e7.8: aquí cambia su color
     y nada más

Given `text-white` en `App.tsx:37` y `TestQuestion.tsx:73`
When se define el patrón del gate
Then también cuenta como color literal, aunque no pertenezca a la familia
     slate/sky/amber que el scope nombra

Given `tests/privacy.test.ts`, que ya recorre `src/` excluyendo pruebas
When el gate nuevo necesita el mismo recorrido
Then la función se extrae a `tests/sources.ts` y la usan los dos, en vez de
     copiarse — es el mismo criterio que en b2.1 llevó a usar `three` en vez de
     reimplementarlo
```
