import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import skeletonUrl from '../data/skeleton.glb?url'

/**
 * El decodificador Draco, servido desde este mismo sitio.
 * No es una preferencia: `must-privacy-006` prohíbe cualquier petición de red en
 * tiempo de ejecución, y el CDN que traen los ejemplos de three sería una.
 */
const DRACO_PATH = '/draco/'

/**
 * El modelo solo contiene el hemicuerpo derecho más las piezas impares, así que
 * el esqueleto completo se compone dibujándolo dos veces, la segunda espejada.
 * El espejo es **transformación visual**: no altera ninguna entrada del catálogo
 * ni el hueso seleccionado.
 */
function SkeletonModel() {
  const { scene } = useGLTF(skeletonUrl, DRACO_PATH)

  return (
    <group>
      <primitive object={scene} />
      <primitive object={scene.clone(true)} scale={[-1, 1, 1]} />
    </group>
  )
}

/** Lo que se ve mientras el modelo llega. Anunciado, no solo dibujado. */
function LoadingNotice() {
  return (
    <mesh>
      <boxGeometry args={[0.01, 0.01, 0.01]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

export function SkeletonScene() {
  return (
    <div className="relative h-full w-full">
      <Canvas camera={{ position: [0, 0.2, 3], fov: 45 }} aria-label="Esqueleto humano en 3D">
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} />
        <Suspense fallback={<LoadingNotice />}>
          <SkeletonModel />
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
