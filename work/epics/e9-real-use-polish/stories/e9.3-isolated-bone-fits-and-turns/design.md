# Story e9.3: The isolated bone fits and turns — Design

> Complexity: moderate

## 1 · What & why

**Problem:** el encuadre del hueso aislado ignora dos cosas. Ignora el
**ancho**: `distanceToFit` recibe `max(x, y, z)` y lo trata como altura
contra un FOV vertical, así que en un lienzo de teléfono —donde el campo
horizontal es más estrecho que el vertical— la clavícula (0,140 de ancho,
0,033 de alto) se sale por los lados. E ignora la **tarjeta**, que flota
sobre el lienzo y tapa la mitad inferior donde el hueso queda centrado.
Además, la escena aislada no tiene controles: el hueso no se puede girar.

**Value:** un hueso que se ve entero y se puede girar es la única cosa que
esta vista tiene para enseñar que no está ya escrita en la ficha.

## 2 · Approach

Una función pura nueva, `frameObject`, que calcula distancia **y**
desplazamiento vertical a partir del tamaño real del objeto, el aspecto del
lienzo y la fracción que la tarjeta reserva abajo. Más controles de órbita
solo-rotación en la escena aislada, con el vigilante de `touch-action`
extraído para no duplicarlo.

**Components affected:**

- `src/domain/framing.ts`: modify — se añade `frameObject`, que **reutiliza**
  `distanceToFit` en vez de reemplazarla.
- `src/components/FixTouchAction.tsx`: create — movido tal cual desde
  `SkeletonScene.tsx`, sin cambiar una línea de su lógica.
- `src/components/SkeletonScene.tsx`: modify — solo pierde la definición de
  `FixTouchAction` y la importa. Su encuadre y sus controles no se tocan.
- `src/components/IsolatedBoneScene.tsx`: modify — mide el ancho además del
  alto, usa `frameObject`, monta `<OrbitControls>` de solo rotación y
  `<FixTouchAction />`.
- `src/features/bone-detail/BoneDetailView.tsx`: modify — mide el alto real
  de la tarjeta y lo pasa como fracción reservada.
- `src/features/test/BoneTestView.tsx`: modify — pasa la fracción que su
  barra de respuesta ocupa.

**Corrección al scope.** El `scope.md` anticipaba endurecer la firma de
`distanceToFit` para que «el compilador nombre a sus dos llamadores». El
gemba lo desaconseja: uno de esos llamadores es `SkeletonScene`, que el
propio scope declara **fuera de alcance**, y su caso —un esqueleto de 1,7
alto y estrecho— no sufre el defecto. Cambiar su firma obligaría a tocarlo
sin motivo y a reescribir sus cinco pruebas. `frameObject` se apoya en
`distanceToFit` en lugar de sustituirla: la aritmética no se duplica y lo
que funciona no se mueve.

**Legacy sweep:** nada queda huérfano. `distanceToFit` conserva sus cinco
pruebas y su llamador en `SkeletonScene`; `FixTouchAction` se mueve de
archivo con su comentario íntegro —donde está escrito *por qué* existe, que
es la parte cara de reconstruir— y pasa de tener un consumidor a dos.

## 3 · Interface / examples

### Usage

```ts
// src/domain/framing.ts — aritmética pura, testeable sin navegador.
export interface Framing {
  /** A qué distancia poner la cámara sobre el eje Z. */
  distance: number
  /** Cuánto bajar la cámara para que el objeto suba a la franja visible. */
  shiftY: number
}

export function frameObject(
  size: { width: number; height: number },
  view: { fovDegrees: number; aspect: number; reservedBottom: number },
  margin?: number,
): Framing
```

```tsx
// El consumidor mide su propia reserva y la pasa. La prop es REQUERIDA:
// con default, un llamador que la olvide recibe en silencio el encuadre
// que esta historia está arreglando.
<IsolatedBoneScene bones={catalog} boneId={boneId} reservedBottom={fraccionTarjeta} />
```

### Expected output (success + error)

```
CLAVÍCULA DERECHA — el caso que hoy falla
  tamaño 0.140 × 0.033 · lienzo 390×760 (aspect 0.513) · reserva 0.30
  hoy:    distanceToFit(0.140, 45) = 0.194
          ancho visible a esa distancia = 2·0.194·tan(22.5°)·0.513 = 0.082
          0.140 > 0.082  →  SE SALE POR LOS DOS LADOS
  con frameObject: la distancia la fija el ancho, no el alto, y el objeto
          entra entero con su margen.

FÉMUR DERECHO — el caso que hoy ya funciona
  tamaño 0.116 × 0.451 · manda el alto, igual que antes
  →  el encuadre no empeora: es la comprobación de no-regresión.

FALANGE MEDIA DEL 5.º DEDO DEL PIE — el más chico (0.0084)
  la cámara se acerca por debajo del plano cercano por defecto de three
  →  `near={0.001}` sigue puesto; sin él, lienzo en blanco sin ningún error.

CASOS LÍMITE DE LA ARITMÉTICA
  reservedBottom = 0     →  shiftY = 0; se comporta como el encuadre de hoy
  reservedBottom → 1     →  se satura antes de dividir por cero
  width = height = 0     →  distancia positiva, nunca NaN ni Infinity
  aspect < 1 (teléfono)  →  manda el ancho en objetos anchos
  aspect > 1 (escritorio)→  manda el alto, como antes
```

### Key data structures

```tsx
// El aspecto y la reserva son datos del lienzo, no del hueso: se leen en la
// escena, donde el tamaño real se conoce después del layout.
const { size } = useThree()        // size.width / size.height, ya post-layout
```

## 4 · Acceptance criteria

- **Must:** `frameObject` deja entrar la clavícula (0,140 × 0,033) entera en
  un lienzo de aspecto 0,513, y no aleja al fémur (0,116 × 0,451) más de lo
  que `distanceToFit` ya lo alejaba.
- **Must:** `reservedBottom` es una prop **requerida** de
  `IsolatedBoneScene`. Sus dos llamadores la pasan y el compilador nombra a
  cualquiera que la olvide — no un default que devuelva en silencio el
  encuadre roto.
- **Must:** el alto reservado en la ficha se **mide**, no se supone: la
  tarjeta declara `max-h-[45vh]` pero su alto real depende del contenido de
  cada hueso, y reservar siempre el máximo encogería el hueso sin motivo.
- **Must:** arrastrar sobre el lienzo gira el hueso, y el lienzo conserva
  `touch-action: none` — el mismo vigilante que `SkeletonScene` ya usa, no
  una copia.
- **Must:** el encuadre de `SkeletonScene` no cambia: sus pruebas siguen
  verdes sin tocarlas, y `distanceToFit` conserva su firma.
- **Should:** el caso `reservedBottom = 0` produce exactamente el encuadre
  de hoy, para que la escena del modo test no cambie salvo por el ancho.
- **Must NOT:** ni zoom ni desplazamiento en la escena aislada — solo
  rotación. Añadirlos es alcance que el scope excluye.
- **Must NOT:** ningún cambio en `skeleton.glb` ni en sus materiales.
- **Must NOT:** medir el lienzo antes del layout. Un `<canvas>` mide 300×150
  hasta que alguien lo dimensiona, y esa carrera la pierde la máquina
  rápida.

### Scenarios (delta over the scope)

```gherkin
Given un hueso cuyo alto manda sobre su ancho, como el fémur
When se encuadra con `frameObject`
Then la distancia no es mayor que la que `distanceToFit` daba
  # el arreglo del caso ancho no puede empeorar el caso alto

Given una ficha cuyo contenido hace la tarjeta más baja que su máximo
When se encuadra el hueso
Then se reserva el alto real de esa tarjeta, no el 45 % declarado
```

## 5 · Governance

- `should-perf-007` (medido en e7.10, mediana 4,6 ms): los controles de
  órbita añaden trabajo por frame solo mientras se arrastra. La suite de
  perfil mide `SkeletonScene`, que esta historia no toca, así que el
  presupuesto no se mueve — pero conviene releer la medición al cerrar.
- `must-a11y-005`: la rotación es una mejora **visual**; no puede volverse
  la única vía a nada. El hueso aislado ya se identifica por texto en la
  ficha, y la escena no gana información que solo exista girándola.
