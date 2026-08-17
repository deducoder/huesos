import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { Suspense, useLayoutEffect, useMemo } from 'react'
import { Color, type Mesh, MeshStandardMaterial, type Object3D } from 'three'
import type { Bone } from '../data/bone'
import { boneIdForMesh, type SceneHalf } from '../domain/mesh-lookup'
import skeletonUrl from '../data/skeleton.glb?url'

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
  selectedMesh: string | null
  half: SceneHalf
  onPick: (id: string) => void
}

/**
 * Una de las dos copias del esqueleto. La original es el hemicuerpo derecho tal
 * como viene el modelo; la espejada completa el izquierdo.
 */
function SkeletonHalf({ bones, selectedMesh, half, onPick }: HalfProps) {
  const { scene } = useGLTF(skeletonUrl, DRACO_PATH)
  const copia = useMemo(() => scene.clone(true), [scene])

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
      propio.emissive = malla.name === selectedMesh ? HIGHLIGHT : new Color('#000000')
      propio.emissiveIntensity = malla.name === selectedMesh ? 0.6 : 0
    })
  }, [copia, selectedMesh])

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

/** Lo que se dibuja mientras el modelo llega: nada visible, sin romper la escena. */
function LoadingNotice() {
  return (
    <mesh>
      <boxGeometry args={[0.01, 0.01, 0.01]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

interface Props {
  bones: readonly Bone[]
  /** Malla del hueso seleccionado, o `null`. La escena no conoce ids: solo mallas. */
  selectedMesh: string | null
  onPick: (id: string) => void
}

export function SkeletonScene({ bones, selectedMesh, onPick }: Props) {
  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 0.2, 3], fov: 45 }} aria-label="Esqueleto humano en 3D">
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} />
        <Suspense fallback={<LoadingNotice />}>
          <SkeletonHalf bones={bones} selectedMesh={selectedMesh} half="original" onPick={onPick} />
          <SkeletonHalf bones={bones} selectedMesh={selectedMesh} half="mirrored" onPick={onPick} />
        </Suspense>
        <OrbitControls enablePan enableZoom makeDefault />
      </Canvas>
      <p className="sr-only">
        Vista tridimensional del esqueleto. Para elegir un hueso sin usar el ratón, usá la lista de
        huesos por región.
      </p>
    </div>
  )
}

useGLTF.preload(skeletonUrl, DRACO_PATH)
