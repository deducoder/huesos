import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas, type ThreeEvent, useThree } from '@react-three/fiber'
import { useCallback, useLayoutEffect, useMemo, useRef, useState, Suspense } from 'react'
import {
  Box3,
  Color,
  type Mesh,
  MeshStandardMaterial,
  type Object3D,
  type PerspectiveCamera as PerspectiveCameraImpl,
  Vector3,
} from 'three'
import type { Bone } from '../data/bone'
import { FixTouchAction } from './FixTouchAction'
import skeletonUrl from '../data/skeleton.glb?url'
import { distanceToFit, frameObject } from '../domain/framing'
import { boneIdForMesh, type SceneHalf } from '../domain/mesh-lookup'
import { stripMidline } from '../domain/mirroring'

/**
 * El decodificador Draco, servido desde este mismo sitio.
 * No es una preferencia: `must-privacy-006` prohíbe cualquier petición de red en
 * tiempo de ejecución, y el CDN que traen los ejemplos de three sería una.
 */
const DRACO_PATH = '/draco/'

/**
 * El resaltado del hueso elegido, leído de `--color-acento` (ADR-007) en vez
 * de un hex propio: es el mismo "selección" que la píldora del navegador y el
 * panel de identidad usan, y `three.js` no puede referenciar un token CSS por
 * su cuenta — hay que resolverlo a mano contra el elemento raíz.
 */
function colorDeSeleccion(): Color {
  const valor = getComputedStyle(document.documentElement).getPropertyValue('--color-acento')
  return new Color(valor.trim())
}

interface HalfProps {
  bones: readonly Bone[]
  /**
   * El **hueso** seleccionado, no su malla.
   *
   * Una malla es dos huesos cuando el modelo la trae una sola vez para un par,
   * así que comparar por nombre de malla encendería los dos lados. Cada mitad
   * resuelve qué hueso le corresponde a cada malla y compara ids.
   */
  selected: string | null
  half: SceneHalf
  onPick: (id: string) => void
  /**
   * La caja mundial del hueso `selected` si su malla está en esta mitad, o
   * `null` si no (e9.4). Reutiliza `esteHueso`, la misma resolución por
   * mitad que ya decide el resaltado de color — una segunda comparación por
   * nombre de malla reintroduciría el bug de b2.1 con los pares que
   * comparten una sola malla.
   */
  onSelectedBox?: (box: Box3 | null) => void
}

/**
 * Una de las dos copias del esqueleto. La original dibuja el modelo entero tal
 * como viene; la espejada completa el hemicuerpo izquierdo.
 *
 * La espejada **no** dibuja el modelo entero: se le quita el grupo de línea
 * media (b2.3). El modelo no es medio cuerpo —esa premisa costó 36 mallas
 * duplicadas— sino un hemicuerpo derecho *más* las piezas que viven sobre el
 * eje y el único par que ya trae completo. Espejar eso no lo mueve al otro
 * lado: lo copia encima de sí mismo.
 */
function SkeletonHalf({ bones, selected, half, onPick, onSelectedBox }: HalfProps) {
  const { scene } = useGLTF(skeletonUrl, DRACO_PATH)
  const copia = useMemo(() => {
    const clon = scene.clone(true)
    return half === 'mirrored' ? stripMidline(clon) : clon
  }, [scene, half])
  // El color del activo, por material propio. Teñir no tiene un neutro al
  // que volver —a diferencia de `emissive`, que vuelve a negro— así que hace
  // falta guardar contra qué restaurar. Un `WeakMap` propio, en vez de
  // `userData` (tipado `any` en three.js), es lo que evita un `as` sin red:
  // el compilador sigue sabiendo que esto es un `Color` o nada.
  const coloresBase = useRef(new WeakMap<MeshStandardMaterial, Color>())

  useLayoutEffect(() => {
    // Se acumula acá, no en una variable booleana: `expandByObject` necesita
    // la malla completa, y una sola mitad puede tener más de una malla para
    // el mismo hueso solo en teoría (el catálogo de hoy no lo hace, pero
    // nada en `boneIdForMesh` lo prohíbe) — expandir, no reasignar, cubre
    // ambos casos con el mismo código.
    const cajaSeleccion = new Box3()
    let encontrada = false
    // `expandByObject` lee `matrixWorld`, y react-three-fiber la recalcula en
    // su propio ciclo de render — no necesariamente antes de que este efecto
    // corra. Mismo motivo que `IsolatedGroup` ya documenta para su propia
    // caja.
    copia.updateMatrixWorld(true)

    copia.traverse((objeto: Object3D) => {
      const malla = objeto as Mesh
      if (!malla.isMesh) return
      const material = malla.material
      if (Array.isArray(material) || !(material instanceof MeshStandardMaterial)) return
      // Cada copia necesita su propio material: compartirlo resaltaría ambos lados.
      if (!malla.userData.ownMaterial) {
        const clonado = material.clone()
        malla.material = clonado
        malla.userData.ownMaterial = true
        coloresBase.current.set(clonado, material.color.clone())
      }
      const propio = malla.material as MeshStandardMaterial
      // El nombre llega ya saneado por el cargador; `boneIdForMesh` normaliza
      // ambos lados, y la mitad decide el lado del hueso par.
      const esteHueso = boneIdForMesh(bones, malla.name, half)
      const resaltado = esteHueso !== null && esteHueso === selected
      const base = coloresBase.current.get(propio)
      propio.color = resaltado ? colorDeSeleccion() : (base ?? propio.color)
      if (resaltado) {
        cajaSeleccion.expandByObject(malla)
        encontrada = true
      }
    })

    onSelectedBox?.(encontrada ? cajaSeleccion : null)
  }, [copia, selected, bones, half, onSelectedBox])

  const handleClick = (evento: ThreeEvent<MouseEvent>) => {
    evento.stopPropagation()
    const id = boneIdForMesh(bones, evento.object.name, half)
    if (id !== null) onPick(id)
  }

  return (
    // `primitive` no es un elemento HTML sino un nodo de three.js: su `onClick` lo resuelve el
    // raycaster de la escena, no el DOM, así que no existe un rol ni un tabindex que ponerle. La
    // vía accesible equivalente es el navegador de huesos, que ADR-002 exige como primera clase.
    // biome-ignore lint/a11y/noStaticElementInteractions: nodo de three.js, no elemento del DOM
    <primitive
      object={copia}
      scale={half === 'mirrored' ? [-1, 1, 1] : [1, 1, 1]}
      onClick={handleClick}
    />
  )
}

/** Campo de visión de la cámara, en grados. */
const FOV = 45

/**
 * Altura a la que se normaliza el esqueleto, en unidades de escena.
 *
 * El modelo se **escala** a esta altura en vez de mover la cámara hacia él. Es
 * deliberado: `<Canvas camera={...}>` solo lee esos valores al montar, así que
 * calcular la distancia después no reencuadra nada — comprobado en navegador
 * durante b2.2, donde una versión anterior de este arreglo aparentaba ajustarse
 * y no lo hacía. Normalizando el modelo, la cámara es una constante y el
 * encuadre no depende de la escala del activo.
 */
const TARGET_HEIGHT = 1.7

/** El encuadre de la cámara: distancia, descentrado y a qué punto mirar. */
interface Framing {
  distance: number
  viewOffsetY: number
  center: Vector3
}

/** El encuadre del esqueleto completo, sin selección — el de siempre. */
function encuadrePorDefecto(): Framing {
  return {
    distance: distanceToFit(TARGET_HEIGHT, FOV),
    viewOffsetY: 0,
    center: new Vector3(0, 0, 0),
  }
}

/**
 * El esqueleto completo: el modelo y el espejo de su parte lateral, centrados
 * en el origen.
 *
 * El modelo viene **apoyado en el origen** —los pies en `Y ≈ 0`, la cabeza en
 * `Y ≈ 1.7`— y desplazado en X porque su parte lateral es un solo hemicuerpo.
 * Se mide con `Box3` en vez de descontar valores fijos, para que cambiar el
 * activo no vuelva a romper el encuadre (b2.2).
 *
 * Sin `zoom` (`ExploreView`), el encuadre es siempre el de por defecto. Con
 * `zoom` y una selección cuya malla aparece en alguna mitad, la cámara se
 * acerca a esa zona — el modo test de esqueleto completo (e9.4).
 */
function CenteredSkeleton({ bones, selected, onPick, zoom, onFramed }: CenteredProps) {
  const { scene } = useGLTF(skeletonUrl, DRACO_PATH)
  const size = useThree((estado) => estado.size)

  const { offset, scale } = useMemo(() => {
    const caja = new Box3().setFromObject(scene)
    const tamano = caja.getSize(new Vector3())
    const centro = caja.getCenter(new Vector3())
    const escala = TARGET_HEIGHT / Math.max(tamano.y, 0.001)
    // En X no se centra: el conjunto ya queda centrado porque el espejo
    // compensa el hemicuerpo lateral que trae el modelo.
    return { offset: new Vector3(0, -centro.y * escala, -centro.z * escala), scale: escala }
  }, [scene])

  // Cada mitad reporta su propia caja del hueso seleccionado (T1); acá se
  // combinan. Refs, no estado: `useLayoutEffect` de un hijo corre antes que
  // el del padre en el mismo commit, así que cuando el efecto de abajo lee
  // estas refs ya están escritas por las dos mitades de esta misma pasada.
  const cajaOriginal = useRef<Box3 | null>(null)
  const cajaMirrored = useRef<Box3 | null>(null)
  const onCajaOriginal = useCallback((caja: Box3 | null) => {
    cajaOriginal.current = caja
  }, [])
  const onCajaMirrored = useCallback((caja: Box3 | null) => {
    cajaMirrored.current = caja
  }, [])

  // `selected` no se lee dentro del efecto, pero es la señal de que hay que
  // recalcular: las cajas son refs que las dos mitades ya escribieron en
  // este mismo commit (su `useLayoutEffect` corre antes que el de este
  // padre), y mutar una ref no dispara este efecto por sí solo.
  // biome-ignore lint/correctness/useExhaustiveDependencies: ver el comentario de arriba
  useLayoutEffect(() => {
    const caja = cajaOriginal.current ?? cajaMirrored.current
    if (!zoom || !caja) {
      onFramed(encuadrePorDefecto())
      return
    }
    const tamano = caja.getSize(new Vector3())
    const centro = caja.getCenter(new Vector3())
    const encuadre = frameObject(
      { width: Math.max(tamano.x, tamano.z, 0.001), height: Math.max(tamano.y, 0.001) },
      {
        fovDegrees: FOV,
        aspect: size.width / Math.max(size.height, 1),
        reservedBottom: zoom?.reservedBottom ?? 0,
      },
    )
    onFramed({ ...encuadre, center: centro })
  }, [selected, zoom, size.width, size.height, onFramed])

  return (
    <group position={offset} scale={scale}>
      <SkeletonHalf
        bones={bones}
        selected={selected}
        half="original"
        onPick={onPick}
        onSelectedBox={onCajaOriginal}
      />
      <SkeletonHalf
        bones={bones}
        selected={selected}
        half="mirrored"
        onPick={onPick}
        onSelectedBox={onCajaMirrored}
      />
    </group>
  )
}

interface CenteredProps {
  bones: readonly Bone[]
  selected: string | null
  onPick: (id: string) => void
  zoom?: { reservedBottom: number }
  onFramed: (framing: Framing) => void
}

/**
 * La cámara del esqueleto, con la proyección descentrada en vez de la cámara
 * desplazada — mismo mecanismo que `CamaraEncuadrada` en
 * `IsolatedBoneScene.tsx` (e9.3): `setViewOffset` mantiene el punto de
 * órbita en el objeto real, en vez de dejarlo flotando por debajo de él.
 */
function CamaraDelEsqueleto({ framing }: { framing: Framing }) {
  const camaraRef = useRef<PerspectiveCameraImpl>(null)
  const size = useThree((estado) => estado.size)

  const posicion = useMemo<[number, number, number]>(
    () => [framing.center.x, framing.center.y, framing.center.z + framing.distance],
    [framing],
  )

  useLayoutEffect(() => {
    const camara = camaraRef.current
    if (!camara) return
    if (framing.viewOffsetY === 0) camara.clearViewOffset()
    else {
      camara.setViewOffset(
        size.width,
        size.height,
        0,
        framing.viewOffsetY * size.height,
        size.width,
        size.height,
      )
    }
    camara.updateProjectionMatrix()
  }, [framing, size.width, size.height])

  return (
    <PerspectiveCamera
      ref={camaraRef}
      makeDefault
      fov={FOV}
      // El plano cercano por defecto de three.js (0.1) recorta huesos
      // diminutos: un hueso del tarso, encuadrado, midió `distance: 0.0588`
      // — detrás del plano, invisible. Mismo arreglo que
      // `IsolatedBoneScene.tsx` ya tiene y por el mismo motivo (e4.4).
      near={0.001}
      position={posicion}
    />
  )
}

/** Lo que se dibuja mientras el modelo llega: nada visible, sin romper la escena. */
function LoadingNotice() {
  return (
    <mesh>
      <boxGeometry args={[0.01, 0.01, 0.01]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

const PISTA_POR_DEFECTO =
  'Vista tridimensional del esqueleto. Para elegir un hueso sin usar el ratón, usá la lista de huesos por región.'

interface Props {
  bones: readonly Bone[]
  /** El `id` del hueso seleccionado, o `null`. */
  selected: string | null
  onPick: (id: string) => void
  /**
   * El texto para lectores de pantalla bajo el lienzo. Configurable porque
   * el mensaje por defecto remite a un navegador de huesos que no existe en
   * todo consumidor de esta escena — el modo test (`e4.2`) no lo monta.
   */
  accessibleHint?: string
  /**
   * Si se pasa, la cámara se acerca a la zona del hueso `selected` en vez
   * de mostrar el esqueleto entero (e9.4, modo test de esqueleto completo).
   * `reservedBottom` va agrupado adentro a propósito: no hay forma de
   * activar el zoom sin declarar cuánto tapa lo que flota encima, mismo
   * criterio que `IsolatedBoneScene` ya exige. Ausente: comportamiento de
   * hoy sin cambios — el caso de `ExploreView`.
   */
  zoom?: { reservedBottom: number }
}

export function SkeletonScene({
  bones,
  selected,
  onPick,
  accessibleHint = PISTA_POR_DEFECTO,
  zoom,
}: Props) {
  const [framing, setFraming] = useState<Framing>(encuadrePorDefecto)
  const onFramed = useCallback((f: Framing) => setFraming(f), [])

  return (
    <div className="relative h-full w-full">
      <Canvas aria-label="Esqueleto humano en 3D">
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} />
        <Suspense fallback={<LoadingNotice />}>
          <CenteredSkeleton
            bones={bones}
            selected={selected}
            onPick={onPick}
            zoom={zoom}
            onFramed={onFramed}
          />
        </Suspense>
        <CamaraDelEsqueleto framing={framing} />
        <OrbitControls
          enablePan
          enableZoom
          makeDefault
          target={[framing.center.x, framing.center.y, framing.center.z]}
        />
        <FixTouchAction />
      </Canvas>
      <p className="sr-only">{accessibleHint}</p>
    </div>
  )
}

useGLTF.preload(skeletonUrl, DRACO_PATH)
