# Story e7.2: El lienzo en pantalla chica — Design

> Complexity: moderate

## 1 · What & why

**Problem:** en 390×844 el lienzo del esqueleto mide `390×150` y empieza en
`y=574`: es la altura intrínseca de un `<canvas>` que nadie dimensionó, colocada
detrás de los 206 huesos del navegador. El modelo se dibuja a unos 60 px de
ancho, media pantalla más abajo de donde mira quien abre la aplicación.

**Value:** el modelo 3D es la razón de ser de la aplicación y hoy en un teléfono
es decorativo. Al terminar ocupa una porción útil de la pantalla y está visible
al cargar, medido por la suite de navegador.

## 2 · Approach

Darle altura de fila al contenedor del lienzo en pantalla chica —donde la causa
está: `grid-cols-1` apila y ninguna fila tiene altura declarada— y darle al
lienzo una superficie propia que separe el hueso de su fondo. Nada de esto toca
la escena: `SkeletonScene` e `IsolatedBoneScene` ya piden `h-full`, y lo que les
falta es un padre que tenga alto.

**Components affected:**

- `src/features/explore/ExploreView.tsx`: modify — filas con altura en móvil,
  anuladas en `md:`. El lienzo pasa a llevarse la mitad del alto disponible.
- `src/features/bone-detail/BoneDetailView.tsx`: modify — lo mismo con dos
  zonas en vez de tres; misma causa, mismo arreglo.
- `src/index.css`: modify — un token nuevo, `--color-lienzo`, la superficie
  sobre la que se dibuja el esqueleto.
- `e2e/mobile-shell.spec.ts`: modify — mide el lienzo en 390×844 junto a lo que
  ya mide del shell. Es el archivo que ya existe con ese viewport; crear otro
  duplicaría el `test.use`.

**No se tocan** `SkeletonScene.tsx` ni `IsolatedBoneScene.tsx`. Su `h-full
w-full` es correcto y el defecto está en el padre. Es la comprobación que
ahorra la historia entera: el arreglo son cuatro clases, no un cambio de escena.

**Legacy sweep:** nada queda huérfano. No se borra ni se crea ningún
componente; cambian clases de dos contenedores y nace un token.

## 3 · Interface / examples

### El reparto vertical en móvil

```tsx
// ExploreView — antes: tres zonas apiladas, ninguna con altura
<div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[20rem_1fr_22rem]">

// después: en móvil el alto se reparte 1/2/1; en md: vuelve a una sola fila
<div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:grid-cols-[20rem_1fr_22rem] md:grid-rows-none">
```

`minmax(0,Nfr)` y no `Nfr` a secas: sin el mínimo en 0, una fila de grid no baja
del tamaño de su contenido, y el navegador de 206 huesos reclamaría su alto
entero — que es exactamente el defecto de hoy visto desde otro ángulo.

```tsx
// BoneDetailView — misma causa, dos zonas: el lienzo se lleva 3 de 5
<div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,3fr)_minmax(0,2fr)] md:grid-cols-[1fr_22rem] md:grid-rows-none">
```

### La superficie del lienzo

```css
/* src/index.css */
--color-lienzo: #ded8cc;  /* la superficie bajo el esqueleto */
```

```tsx
<div className="min-h-0 bg-lienzo">   {/* antes: bg-panel */}
```

El hueso del modelo es un beige muy claro y sobre `--color-panel` (blanco puro)
se distingue poco — comprobado en captura al arrancar la historia. Un gris cálido
algo más oscuro lo separa sin tocar el activo, que es un no-go del brief. **El
valor exacto se valida con captura en su tarea**: es una decisión de contraste
entre dos superficies, no entre texto y fondo, así que WCAG no la arbitra y hay
que verla.

### Lo que la medición tiene que decir

```ts
// e2e/mobile-shell.spec.ts
test('el lienzo ocupa una porción útil de la pantalla', async ({ page }) => {
  await page.goto('/')
  const caja = await page.locator('canvas').first().boundingBox()
  const alto = page.viewportSize()?.height ?? 0

  expect(caja?.height ?? 0).toBeGreaterThan(alto * 0.3)   // hoy: 150 de 844 = 17.8%
  expect(caja?.y ?? Number.MAX_SAFE_INTEGER).toBeLessThan(alto) // hoy: y=574, dentro; tras dar alto podría salirse
})
```

Salida esperada hoy (RED) y al terminar (GREEN):

```
Error: expect(received).toBeGreaterThan(expected)
  Expected: > 253.2
  Received:   150

PASS   el lienzo ocupa una porción útil de la pantalla   (al terminar)
```

## 4 · Acceptance criteria

- **Must:**
  1. En 390×844 el lienzo de la vista Explorar mide más del 30% del alto del
     viewport, contra el 17.8% de hoy.
  2. Su borde superior queda dentro de la primera pantalla, sin desplazar.
  3. El lienzo de la ficha completa se dimensiona con el mismo criterio.
  4. En 1400×900 el lienzo no es más chico que hoy — la suite de escritorio ya
     lo comprueba (`lienzo?.width > 200`) y sigue verde sin reescribirse.
  5. El esqueleto se distingue de su superficie, verificado sobre captura.
- **Should:**
  1. El navegador de huesos conserva su scroll propio dentro de su fila; acotar
     su alto no debe cortar la lista.
- **Must NOT:**
  1. No se toca `skeleton.glb`, ni el material ni la geometría del activo —
     no-go del brief. Si el contraste no alcanzara con la superficie, es un
     hallazgo para el parking lot.
  2. No se toca `SkeletonScene.tsx` ni `IsolatedBoneScene.tsx`: el defecto está
     en el padre, y `SkeletonScene.test.tsx` comprueba ese fuente con
     expresiones regulares.
  3. No se decide el layout definitivo de móvil — el reparto es provisional y
     e7.6 puede cambiarlo entero.
  4. No se reordenan las zonas: dejar el navegador primero es lo que mantiene
     esta historia dentro de su alcance.

### Scenarios (delta over the scope)

```gherkin
Given el riesgo que la épica declaró más caro — que el esqueleto se pierda
      sobre fondo claro y obligue a tocar el material del activo
When se captura el lienzo en 390x844 sobre el tema claro ya integrado
Then el esqueleto se distingue: el riesgo se reduce a mejorar contraste con una
     superficie propia, y no llega a rozar el no-go

Given `SkeletonScene` e `IsolatedBoneScene`, que el scope daba por candidatos
When se leen sus contenedores
Then los dos ya piden `h-full w-full` y el defecto está en el padre — la
     historia no toca ninguna escena

Given `should-perf-007`, que exige responder a la selección en menos de 100 ms
When el lienzo pasa de 390x150 a unos 390x357
Then se dibujan unas 2,4 veces más píxeles por cuadro. No lo mide esta historia
     —es e7.10— pero si esa medición sale mal, este cambio es el primer
     sospechoso y conviene que quede escrito acá

Given `minmax(0,Nfr)` frente a `Nfr` a secas
When se reparte el alto entre tres filas
Then sin el mínimo en 0 la fila del navegador no baja del alto de sus 206
     elementos, y el reparto no ocurre
```
