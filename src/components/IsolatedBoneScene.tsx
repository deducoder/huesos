import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Box3, type Group, type Mesh, type Object3D, Vector3 } from 'three'
import type { Bone } from '../data/bone'
import { distanceToFit } from '../domain/framing'
import { visibleForIsolation } from '../domain/isolation'
import type { SceneHalf } from '../domain/mesh-lookup'
import { findBone } from '../domain/selection'
import skeletonUrl from '../data/skeleton.glb?url'

const DRACO_PATH = '/draco/'
const FOV = 45

/** Encuadre calculado para lo que quedó visible, o `null` mientras no hay nada que mostrar. */
interface Framing {
  distance: number
  center: Vector3
}

interface GroupProps {
  bones: readonly Bone[]
  boneId: string
  onFramed: (framing: Framing | null) => void
}

/**
 * Las dos mitades del modelo, con la visibilidad de cada malla decidida por
 * `visibleForIsolation` en vez de por su material —a diferencia de
 * `SkeletonScene`, acá no hay resaltado que aplicar, solo mostrar u ocultar.
 *
 * El encuadre se recalcula tras aplicar la visibilidad, a partir de la caja
 * de **las mallas visibles únicamente**: `Box3` no excluye objetos ocultos
 * por sí sola, así que se filtra a mano en el propio recorrido.
 */
function IsolatedGroup({ bones, boneId, onFramed }: GroupProps) {
  const { scene } = useGLTF(skeletonUrl, DRACO_PATH)
  const original = useMemo(() => scene.clone(true), [scene])
  const mirrored = useMemo(() => scene.clone(true), [scene])
  const groupRef = useRef<Group>(null)

  useLayoutEffect(() => {
    const aplicarVisibilidad = (raiz: Object3D, half: SceneHalf) => {
      raiz.traverse((objeto: Object3D) => {
        const malla = objeto as Mesh
        if (!malla.isMesh) return
        malla.visible = visibleForIsolation(bones, malla.name, half, boneId)
      })
    }
    aplicarVisibilidad(original, 'original')
    aplicarVisibilidad(mirrored, 'mirrored')

    const grupo = groupRef.current
    if (!grupo) return
    grupo.updateMatrixWorld(true)

    const caja = new Box3()
    let algunaVisible = false
    grupo.traverse((objeto: Object3D) => {
      const malla = objeto as Mesh
      if (!malla.isMesh || !malla.visible) return
      algunaVisible = true
      caja.expandByObject(malla)
    })

    if (!algunaVisible) {
      onFramed(null)
      return
    }
    const tamano = caja.getSize(new Vector3())
    const centro = caja.getCenter(new Vector3())
    const mayorDimension = Math.max(tamano.x, tamano.y, tamano.z, 0.001)
    onFramed({ distance: distanceToFit(mayorDimension, FOV), center: centro })
  }, [original, mirrored, bones, boneId, onFramed])

  return (
    <group ref={groupRef}>
      <primitive object={original} />
      <primitive object={mirrored} scale={[-1, 1, 1]} />
    </group>
  )
}

interface Props {
  bones: readonly Bone[]
  /** El `id` del hueso a aislar. Un `id` sin geometría en el modelo no muestra nada. */
  boneId: string
  /**
   * El `aria-label` del lienzo. Configurable porque el valor por defecto
   * nombra el hueso —correcto en `BoneDetailView` (e3.2), donde ya se eligió
   * a la vista— pero filtraría la respuesta en el modo test (e4.4, RF-05),
   * donde nombrarlo antes de responder es justo lo que `must-data-003`
   * prohíbe. Un `aria-label` no aparece en `textContent`: una prueba que
   * solo mire el texto del documento no lo vería.
   */
  accessibleLabel?: string
}

/**
 * Un solo hueso, aislado del resto del esqueleto compartido.
 *
 * Reutiliza el mismo activo y decodificador que `SkeletonScene` — no hay un
 * modelo por hueso, el brief de e3 lo excluye a propósito —, pero en vez de
 * resaltar por material, oculta toda malla que no sea la buscada.
 */
export function IsolatedBoneScene({ bones, boneId, accessibleLabel }: Props) {
  const [framing, setFraming] = useState<Framing | null>(null)
  const onFramed = useCallback((f: Framing | null) => setFraming(f), [])
  const bone = findBone(bones, boneId)
  const label = accessibleLabel ?? (bone ? `${bone.es}, aislado en 3D` : 'Hueso aislado en 3D')

  return (
    <div className="relative h-full w-full">
      <Canvas aria-label={label}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} />
        <Suspense fallback={null}>
          <IsolatedGroup bones={bones} boneId={boneId} onFramed={onFramed} />
          {framing && (
            // Sin `lookAt`: con rotación por defecto, la cámara ya mira hacia
            // -Z, así que colocarla en el mismo X/Y del centro y desplazada
            // en Z alcanza el centro sin necesitar orientarla a mano.
            <PerspectiveCamera
              makeDefault
              fov={FOV}
              position={[framing.center.x, framing.center.y, framing.center.z + framing.distance]}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(skeletonUrl, DRACO_PATH)
