# Story e9.4: The skeleton test zooms to what it asks — Design

> Complexity: complex

## 1 · What & why

**Problem:** en el modo test de esqueleto completo, la cámara muestra las
206 piezas a distancia fija siempre. El hueso que hay que reconocer es uno
diminuto entre todos los demás, en la pantalla de un teléfono.

**Value:** quien responde ve el detalle que tiene que juzgar, sin perder de
vista que sigue siendo el esqueleto completo (a diferencia del hueso
aislado, e3.1/e9.3, que lo saca de contexto).

## 2 · Approach

**Zoom por opt-in, sin tocar `ExploreView`.** `SkeletonScene` gana un prop
opcional `zoom?: { reservedBottom: number }`: ausente, comportamiento de
hoy sin ningún cambio (el caso de `ExploreView`, fuera de alcance por
decisión del scope); presente, la cámara se recalcula sobre la zona del
`selected` en vez del esqueleto entero. Agrupar `reservedBottom` **dentro**
de `zoom` en vez de como prop suelta es lo que impide "activar el zoom y
olvidar la reserva": no hay forma de pasar uno sin el otro.

Reutiliza `frameObject`/`distanceToFit` (e9.3, sin cambios) y el patrón
`<PerspectiveCamera>` + `setViewOffset` de `IsolatedBoneScene.tsx` (mismo
mecanismo, ver Key contracts). La malla del hueso señalado se ubica por
`bone.meshName`, no por texto: cada `SkeletonHalf` ya resuelve
`boneIdForMesh` por malla en su propio recorrido de color (b2.1); esta
historia añade, en el mismo recorrido, reportar la caja del hueso
coincidente hacia el componente que lo contiene.

**Components affected:**

- `src/components/SkeletonScene.tsx`: modify — `SkeletonHalf` reporta la
  caja del hueso seleccionado si lo encuentra en su mitad;
  `CenteredSkeleton` combina el reporte de las dos mitades, calcula el
  encuadre con `frameObject` y lo expone; `SkeletonScene` reemplaza la
  prop `camera` de `Canvas` por un `<PerspectiveCamera>` controlado.
- `src/features/test/SkeletonTestView.tsx`: modify — consume el segundo
  argumento de `renderScene` (`reservedBottom`, que e9.2 ya calcula y que
  hoy se ignora) y pasa `zoom={{ reservedBottom }}`.
- `src/components/SkeletonScene.test.tsx`: modify — nuevas afirmaciones de
  código fuente, mismo patrón que el resto del archivo.

**Legacy sweep:** `distanceToFit(TARGET_HEIGHT, FOV)` sigue usándose tal
cual para el encuadre por defecto (sin `zoom`, o sin `selected`) — el plan
de la épica ya anticipó este riesgo ("e9.3 y e9.4 comparten `framing.ts`…
la firma nueva hace que el compilador nombre al llamador pendiente") y el
llamador pendiente era exactamente `SkeletonScene.tsx`; hoy sigue llamando
a `distanceToFit` directo porque ese caso —altura fija, sin zona ni
reserva— no necesita `frameObject`. Nada queda huérfano: es el mismo
cálculo que ya existía, sin tocar. `ExploreView.tsx` no cambia ni una
línea — es la respuesta a la pregunta que el scope dejó abierta: el gemba
no encontró ninguna razón para incluirlo, y forzar `reservedBottom` ahí
habría exigido resolver el mismo problema de `tarjeta-identidad` tapando
el lienzo que nadie reportó entre los nueve puntos.

## 3 · Interface / examples

### Usage

```tsx
// src/features/test/SkeletonTestView.tsx
renderScene={(boneId, reservedBottom) => (
  <SkeletonScene
    bones={catalog}
    selected={boneId}
    onPick={() => {}}
    zoom={{ reservedBottom }}
    accessibleHint="Un hueso está señalado en el esqueleto. Elegí su nombre entre las 3 opciones."
  />
)}
```

```tsx
// src/features/explore/ExploreView.tsx — SIN CAMBIOS
<SkeletonScene bones={catalog} selected={selected} onPick={onSelect} />
// sin `zoom`: la cámara sigue fija en distanceToFit(TARGET_HEIGHT, FOV),
// exactamente el comportamiento de hoy.
```

### Expected output

| `selected` | `zoom` | Encuadre |
|---|---|---|
| `null` | — (o presente) | Esqueleto completo, distancia fija (comportamiento de hoy). |
| `'clavicle-right'` | ausente (Explorar) | Esqueleto completo — el zoom no aplica sin `zoom`. |
| `'clavicle-right'` | `{ reservedBottom: 0.35 }` | Cámara a `frameObject({width, height}, {fovDegrees: 45, aspect, reservedBottom: 0.35}).distance` del centro de la malla `Clavicle.r` en la mitad `original`. |
| `'clavicle-left'` | `{ reservedBottom: 0.35 }` | Mismo cálculo, pero sobre la mitad `mirrored` — mismo nombre de malla (`Clavicle.r`), lado resuelto por `boneIdForMesh` como ya lo hace el resaltado de color. |
| id sin geometría en las mitades renderizadas (no debería ocurrir: `pickTestableBone` excluye `meshName: null`) | cualquiera | Cae al encuadre por defecto — nunca una pantalla rota. |

### Key data structures

```ts
// src/components/SkeletonScene.tsx
interface Props {
  bones: readonly Bone[]
  selected: string | null
  onPick: (id: string) => void
  accessibleHint?: string
  /**
   * Si se pasa, la cámara se acerca a la zona del hueso seleccionado en vez
   * de mostrar el esqueleto entero. `reservedBottom` va agrupado adentro a
   * propósito: no hay forma de activar el zoom sin declarar cuánto tapa lo
   * que flota encima (mismo criterio que `IsolatedBoneScene`, ADR de e3.1).
   * Ausente: comportamiento de hoy — el caso de `ExploreView`.
   */
  zoom?: { reservedBottom: number }
}

// SkeletonHalf gana un reporte de caja, paralelo al de color
interface HalfProps {
  // … bones, selected, half, onPick, sin cambios
  /** La caja mundial del hueso `selected` si está en esta mitad, o `null`. */
  onSelectedBox?: (box: Box3 | null) => void
}
```

```ts
// El combinador en CenteredSkeleton, con las cajas de las dos mitades en
// refs — useLayoutEffect de hijo corre antes que el del padre en el mismo
// commit, así que las dos refs ya están escritas cuando este efecto lee.
const cajaOriginal = useRef<Box3 | null>(null)
const cajaMirrored = useRef<Box3 | null>(null)
useLayoutEffect(() => {
  const caja = cajaOriginal.current ?? cajaMirrored.current
  if (!zoom || !caja) {
    onFramed(ENCUADRE_POR_DEFECTO)
    return
  }
  const tamano = caja.getSize(new Vector3())
  const centro = caja.getCenter(new Vector3())
  const encuadre = frameObject(
    { width: Math.max(tamano.x, tamano.z, 0.001), height: Math.max(tamano.y, 0.001) },
    { fovDegrees: FOV, aspect: size.width / Math.max(size.height, 1), reservedBottom: zoom?.reservedBottom ?? 0 },
  )
  onFramed({ ...encuadre, center: centro })
}, [selected, zoom, size.width, size.height])
```

## 4 · Acceptance criteria

- **Must:**
  1. Con `zoom` presente y `selected` no nulo, la cámara encuadra la caja
     mundial de la malla del hueso señalado, calculada con `frameObject`.
  2. Sin `zoom` (cualquier `selected`) o con `selected: null`, el encuadre
     es exactamente el de hoy: `distanceToFit(TARGET_HEIGHT, FOV)`, sin
     desplazar la proyección.
  3. Un hueso par cuya malla comparte nombre con su opuesto (`clavicle-*`
     → `Clavicle.r`) encuadra la mitad correcta según `side`, no una
     mezcla ni la mitad equivocada.
  4. `ExploreView.tsx` no cambia — verificado por diff, no supuesto.
  5. `reservedBottom` de e9.2, que `SkeletonTestView` ignoraba, se conecta.
- **Should:**
  1. Cambiar de pregunta ("Siguiente pregunta") reencuadra sin remontar la
     escena ni perder el estado de `OrbitControls`.
- **Must NOT:**
  1. No se anima la transición de cámara (rabbit hole del brief).
  2. No se toca el activo 3D.
  3. El resaltado de color (e9.1) no cambia.

### Scenarios (delta over the scope)

```gherkin
# AÑADIDO — el scope dejó la decisión de ExploreView abierta; el gemba no
# encontró una malla compartida entre lados sin resolver ni una razón para
# incluirlo, así que la respuesta es no, con `zoom` como prop opcional.
Given ExploreView, que no pasa `zoom`
When se selecciona cualquier hueso
Then el encuadre del esqueleto completo no cambia

# AÑADIDO — el caso de malla compartida que e9.5 ya documentó para el
# nombre corto reaparece acá para el encuadre.
Given que el hueso señalado es «clavícula izquierda»
When la cámara se acerca a su zona
Then encuadra la posición de la mitad espejada, no la original —son la
     misma malla, en dos lugares distintos de la escena
```

## 5 · Governance

- Ningún guardrail nuevo aplica; `must-privacy-006` (sin red) y
  `must-a11y-005` (nombre accesible) no cambian — el zoom es puramente
  visual, y `SkeletonScene.tsx` sigue sin URLs externas.
