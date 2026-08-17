import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { Suspense, useLayoutEffect, useMemo } from 'react'
import { Box3, Color, type Mesh, MeshStandardMaterial, type Object3D, Vector3 } from 'three'
import type { Bone } from '../data/bone'
import skeletonUrl from '../data/skeleton.glb?url'
import { distanceToFit } from '../domain/framing'
import { boneIdForMesh, type SceneHalf } from '../domain/mesh-lookup'
import { stripMidline } from '../domain/mirroring'

/**
 * El decodificador Draco, servido desde este mismo sitio.
 * No es una preferencia: `must-privacy-006` prohíbe cualquier petición de red en
 * tiempo de ejecución, y el CDN que traen los ejemplos de three sería una.
 */
const DRACO_PATH = '/draco/'

/** El resaltado del hueso elegido. Acompaña al panel y a la lista; nunca informa solo. */
const HIGHLIGHT = new Color('#38bdf8')

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
function SkeletonHalf({ bones, selected, half, onPick }: HalfProps) {
  const { scene } = useGLTF(skeletonUrl, DRACO_PATH)
  const copia = useMemo(() => {
    const clon = scene.clone(true)
    return half === 'mirrored' ? stripMidline(clon) : clon
  }, [scene, half])

  useLayoutEffect(() => {
    copia.traverse((objeto: Object3D) => {
      const malla = objeto as Mesh
      if (!malla.isMesh) return
      const material = malla.material
      if (Array.isArray(material) || !(material instanceof MeshStandardMaterial)) return
      // Cada copia necesita su propio material: compartirlo resaltaría ambos lados.
      if (!malla.userData.ownMaterial) {
        malla.material = material.clone()
        malla.userData.ownMaterial = true
      }
      const propio = malla.material as MeshStandardMaterial
      // El nombre llega ya saneado por el cargador; `boneIdForMesh` normaliza
      // ambos lados, y la mitad decide el lado del hueso par.
      const esteHueso = boneIdForMesh(bones, malla.name, half)
      const resaltado = esteHueso !== null && esteHueso === selected
      propio.emissive = resaltado ? HIGHLIGHT : new Color('#000000')
      propio.emissiveIntensity = resaltado ? 0.6 : 0
    })
  }, [copia, selected, bones, half])

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

/**
 * El esqueleto completo: el modelo y el espejo de su parte lateral, centrados
 * en el origen.
 *
 * El modelo viene **apoyado en el origen** —los pies en `Y ≈ 0`, la cabeza en
 * `Y ≈ 1.7`— y desplazado en X porque su parte lateral es un solo hemicuerpo.
 * Se mide con `Box3` en vez de descontar valores fijos, para que cambiar el
 * activo no vuelva a romper el encuadre (b2.2).
 */
function CenteredSkeleton({ bones, selected, onPick }: CenteredProps) {
  const { scene } = useGLTF(skeletonUrl, DRACO_PATH)

  const { offset, scale } = useMemo(() => {
    const caja = new Box3().setFromObject(scene)
    const tamano = caja.getSize(new Vector3())
    const centro = caja.getCenter(new Vector3())
    const escala = TARGET_HEIGHT / Math.max(tamano.y, 0.001)
    // En X no se centra: el conjunto ya queda centrado porque el espejo
    // compensa el hemicuerpo lateral que trae el modelo.
    return { offset: new Vector3(0, -centro.y * escala, -centro.z * escala), scale: escala }
  }, [scene])

  return (
    <group position={offset} scale={scale}>
      <SkeletonHalf bones={bones} selected={selected} half="original" onPick={onPick} />
      <SkeletonHalf bones={bones} selected={selected} half="mirrored" onPick={onPick} />
    </group>
  )
}

interface CenteredProps {
  bones: readonly Bone[]
  selected: string | null
  onPick: (id: string) => void
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
}

export function SkeletonScene({
  bones,
  selected,
  onPick,
  accessibleHint = PISTA_POR_DEFECTO,
}: Props) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, distanceToFit(TARGET_HEIGHT, FOV)], fov: FOV }}
        aria-label="Esqueleto humano en 3D"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} />
        <Suspense fallback={<LoadingNotice />}>
          <CenteredSkeleton bones={bones} selected={selected} onPick={onPick} />
        </Suspense>
        <OrbitControls enablePan enableZoom makeDefault target={[0, 0, 0]} />
      </Canvas>
      <p className="sr-only">{accessibleHint}</p>
    </div>
  )
}

useGLTF.preload(skeletonUrl, DRACO_PATH)
