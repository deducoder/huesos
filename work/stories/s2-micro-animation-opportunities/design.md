# Story s2: Micro-animation opportunities — Design

> Complexity: complex (6 componentes, sin patrón previo que seguir)

## 1 · What & why

**Problem:** ningún cambio de estado de la interfaz tiene transición hoy —
`grep -rniE "transition|animat|@keyframes"` sobre `src/**/*.{ts,tsx,css}` da
cero coincidencias. Varios de esos cambios ya *señalan* que deberían animarse
(la flecha de `FichasAccordion` gira con una clase condicional que no lleva
transición) y aun así saltan de golpe.

**Value:** los cambios de estado (acordeón, modal, tarjeta de identidad,
retroalimentación del test) se vuelven legibles como cambios en vez de saltos,
sin tocar la responsividad que `should-perf-007` ya midió ni sumar una
dependencia nueva.

## 2 · Approach

Declarar un vocabulario mínimo de motion en `@theme` (mismo mecanismo que ya
gobierna color y radio, ADR-007) y aplicar transiciones CSS puras a las 6
oportunidades que sobrevivieron el gate de `find-animation-opportunities`
(ver el reporte completo en la conversación de diseño de esta historia). El
resaltado de color del hueso en la escena 3D y el encuadre de cámara quedan
explícitamente fuera — están aparcados, no descartados, como un hallazgo con
destino propio (ver `Must NOT`).

**Components affected:**

- `src/index.css`: modify — agrega tokens de motion al bloque `@theme`
  (`--duration-rapida`, `--duration-base`, `--duration-panel`,
  `--ease-salida`) y una regla global de `prefers-reduced-motion`.
- `src/components/FichasAccordion.tsx`: modify — la flecha gana
  `transition-transform`; el contenido deja de desmontarse condicionalmente
  y pasa al truco `grid-template-rows` para animar apertura/cierre, con
  `inert` mientras está colapsado.
- `src/components/AboutPanel.tsx`: modify — entrada del overlay y el diálogo
  vía `@starting-style`.
- `src/features/explore/ExploreView.tsx`: modify — entrada de la tarjeta de
  identidad flotante en su primera aparición.
- `src/features/test/TestQuestion.tsx`: modify — entrada del panel de
  resultado; retroalimentación de prensado en los botones de opción.
- `src/App.tsx` (`Pestanas`): modify — transición de color en la píldora
  activa.

**Legacy sweep:** nada — net-new. No existe código de animación previo que
reemplazar o retirar (confirmado por el grep de la sección anterior).

## 3 · Interface / examples

### Tokens (`src/index.css`, dentro de `@theme`)

```css
@theme {
  /* ...tokens existentes... */
  --duration-rapida: 140ms; /* prensado, retroalimentación inmediata */
  --duration-base: 220ms;   /* color, fondo, panel de resultado */
  --duration-panel: 300ms;  /* tarjetas y overlays que entran */
  --ease-salida: cubic-bezier(0.23, 1, 0.32, 1);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

Tailwind 4 lee el namespace `--duration-*`/`--ease-*` igual que cualquier
otro y emite `duration-rapida`, `duration-base`, `duration-panel`,
`ease-salida` — el mismo mecanismo que ya da `rounded-suave` desde
`--radius-suave`. La regla de `prefers-reduced-motion` es global y a cero
(no "más suave"): más simple de verificar con un solo test, documentado como
decisión de alcance en `Must NOT`.

### `FichasAccordion.tsx` — flecha y contenido

```tsx
<span
  aria-hidden="true"
  className={`transition-transform duration-base ease-salida ${expandida ? 'rotate-180' : ''}`}
>
  ⌄
</span>
{/* Antes: {expandida && (<div className="mt-2 ...">...)}
    Después: siempre montado, animado por la fila del grid — necesario para
    que la transición tenga un estado inicial y uno final que interpolar. */}
<div
  inert={!expandida}
  className={`grid transition-[grid-template-rows] duration-panel ease-salida ${
    expandida ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
  }`}
>
  <div className="mt-2 flex min-h-0 flex-col gap-3 overflow-hidden">
    {/* ...regiones de la categoría, sin cambios... */}
  </div>
</div>
```

`inert` es la pieza que evita el atrapa-foco: sin ella, un botón dentro de
una categoría colapsada seguiría siendo alcanzable por teclado aunque mida
cero de alto.

### `AboutPanel.tsx` — entrada del overlay y el diálogo

```tsx
<div className="fixed inset-0 z-50 ... transition-opacity duration-base ease-salida [@starting-style]:opacity-0" ...>
  {/* backdrop */}
</div>
<div
  className="relative ... transition-[opacity,transform] duration-panel ease-salida [@starting-style]:opacity-0 [@starting-style]:translate-y-4"
  ...
>
  {/* diálogo */}
</div>
```

Solo entrada: `onClose` desmonta `AboutPanel` de inmediato (`App.tsx:386`,
`{menuAbierto && <AboutPanel .../>}`), y animar la salida exigiría retrasar
ese desmontaje (un `setTimeout` o un estado de "cerrando") — costo que no se
justifica para un panel que se abre pocas veces por sesión. Ver `Must NOT`.

### `ExploreView.tsx` — primera aparición de la tarjeta de identidad

```tsx
{bone && (
  <div
    data-testid="tarjeta-identidad"
    className="absolute inset-x-4 bottom-4 ... transition-[opacity,transform] duration-panel ease-salida [@starting-style]:opacity-0 [@starting-style]:translate-y-3"
  >
```

Solo la primera aparición anima (el navegador aplica `@starting-style` en el
momento del mount). Cambiar de un hueso a otro con la tarjeta ya montada
sigue siendo instantáneo — decisión explícita, ver Part 2 del reporte de
oportunidades.

### `TestQuestion.tsx` — panel de resultado y opciones

```tsx
{resultado !== 'pendiente' && (
  <div role="status" className="transition-opacity duration-base ease-salida [@starting-style]:opacity-0">
    ...
  </div>
)}

<button
  ...
  className={`... active:scale-[0.97] transition-transform duration-rapida ease-salida ...`}
>
```

### `App.tsx` (`Pestanas`) — píldora activa

```tsx
<button
  ...
  className={`... transition-colors duration-base ease-salida ${on ? 'text-tinta' : 'bg-transparent text-tinta-suave'}`}
>
```

`transition-colors` queda siempre presente en la clase (no condicional), para
que ambas direcciones (activar/desactivar) interpolen.

## 4 · Acceptance criteria

**Distinto de** los criterios base de `scope.md`, que siguen siendo la
autoridad. Esto es el delta que el gemba walk agregó.

- **Must:**
  - Las 6 transiciones usan los tokens nuevos de `@theme`
    (`duration-rapida`/`duration-base`/`duration-panel`/`ease-salida`) —
    ningún valor de duración o curva a mano en un componente.
  - Cada transición anima solo `transform`/`opacity`/`background-color`
    (la excepción declarada es `grid-template-rows` del acordeón, la técnica
    recomendada para no animar `height` de contenido variable).
  - Con `prefers-reduced-motion: reduce` activo, ninguna de las 6
    transiciones se percibe.
  - El contenido colapsado de una categoría en `FichasAccordion` no es
    alcanzable por teclado (`inert`).
  - `./scripts/check` sigue en verde, incluida `tests/design-tokens.test.ts`
    (los tokens nuevos entran por `@theme`, igual que cualquier color).
- **Should:**
  - Las opciones del test dan retroalimentación de prensado (`:active`
    scale) además del cambio de color al elegir.
  - La píldora de pestaña activa transiciona el color de fondo en vez de
    saltar.
- **Must NOT:**
  - Ninguna transición depende de una librería externa — CSS puro; no hay
    ninguna instalada hoy y agregar una para 6 transiciones de este tamaño
    sería desproporcionado (YAGNI).
  - Esta historia **no** anima la escena 3D (resaltado de color del hueso ni
    encuadre de cámara en `SkeletonScene.tsx`/`IsolatedBoneScene.tsx`) — el
    costo de un lazo de frames de WebGL y el riesgo directo sobre
    `should-perf-007` la sacan de este alcance. Queda como hallazgo aparcado
    para una historia futura (con spike previo que verifique el costo real).
  - `AboutPanel` no anima su salida — solo entrada (ver la nota en la
    sección de ejemplos).
  - Ninguna transición supera 300ms (`--duration-panel`, el techo más alto
    de los tokens declarados).

### Scenarios (delta over the scope)

```gherkin
Given una categoría cerrada en la pestaña Fichas
When el usuario la toca para expandirla
Then el contenido crece y se desvanece hacia adentro (no aparece de golpe),
  la flecha gira con transición, y una vez colapsada de nuevo su contenido
  no es alcanzable por teclado

Given un usuario con `prefers-reduced-motion` activado en el sistema
When abre el panel de menú, expande una categoría de fichas, o responde una
  pregunta del test
Then no percibe ninguna de las transiciones introducidas por esta historia
```
