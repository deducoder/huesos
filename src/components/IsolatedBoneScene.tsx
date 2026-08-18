import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Box3, type Group, type Mesh, type Object3D, Vector3 } from 'three'
import type { Bone } from '../data/bone'
import skeletonUrl from '../data/skeleton.glb?url'
import { frameObject } from '../domain/framing'
import { visibleForIsolation } from '../domain/isolation'
import { stripMidline } from '../domain/mirroring'
import type { SceneHalf } from '../domain/mesh-lookup'
import { findBone } from '../domain/selection'

const DRACO_PATH = '/draco/'
const FOV = 45

/** Encuadre calculado para lo que quedó visible, o `null` mientras no hay nada que mostrar. */
interface Framing {
  distance: number
  shiftY: number
  center: Vector3
}

interface GroupProps {
  bones: readonly Bone[]
  boneId: string
  reservedBottom: number
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
 *
 * La mitad espejada se prepara con `stripMidline`: lo que el modelo ya trae en
 * su sitio no se espeja, o el hueso aislado aparecería dos veces.
 */
function IsolatedGroup({ bones, boneId, reservedBottom, onFramed }: GroupProps) {
  const { scene } = useGLTF(skeletonUrl, DRACO_PATH)
  const original = useMemo(() => scene.clone(true), [scene])
  // Misma preparación que `SkeletonScene` y por la misma razón (b2.3): sin
  // esto, aislar un hueso de línea media —o un parietal— mostraba DOS copias,
  // la del modelo y su espejo, y el encuadre se calculaba sobre las dos.
  const mirrored = useMemo(() => stripMidline(scene.clone(true)), [scene])
  const groupRef = useRef<Group>(null)
  // El tamaño real del lienzo, ya resuelto por react-three-fiber después del
  // layout: un `<canvas>` mide 300x150 hasta que alguien lo dimensiona, y esa
  // carrera la pierde la máquina rápida.
  const size = useThree((estado) => estado.size)

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
    // El ancho es `x` y `z` a la vez: la cámara mira por -Z sin rotar, pero el
    // hueso puede girarse, así que lo que puede quedar de lado a lado es la
    // mayor de las dos. El alto es `y`.
    const ancho = Math.max(tamano.x, tamano.z, 0.001)
    const alto = Math.max(tamano.y, 0.001)
    const encuadre = frameObject(
      { width: ancho, height: alto },
      { fovDegrees: FOV, aspect: size.width / Math.max(size.height, 1), reservedBottom },
    )
    onFramed({ ...encuadre, center: centro })
  }, [original, mirrored, bones, boneId, onFramed, reservedBottom, size.width, size.height])

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
   * Qué fracción del alto del lienzo, contando desde abajo, tiene algo
   * encima — la tarjeta de la ficha, la barra de respuesta del test.
   *
   * **Requerida a propósito**, no opcional con default 0: un llamador que la
   * olvidara recibiría en silencio el hueso centrado detrás de lo que flota
   * sobre él, que es justamente el defecto que esta prop existe para
   * corregir. Con la prop obligatoria, olvidarla es un error de tipos.
   */
  reservedBottom: number
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
export function IsolatedBoneScene({ bones, boneId, reservedBottom, accessibleLabel }: Props) {
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
          <IsolatedGroup
            bones={bones}
            boneId={boneId}
            reservedBottom={reservedBottom}
            onFramed={onFramed}
          />
          {framing && (
            // Sin `lookAt`: con rotación por defecto, la cámara ya mira hacia
            // -Z, así que colocarla en el mismo X/Y del centro y desplazada
            // en Z alcanza el centro sin necesitar orientarla a mano.
            <PerspectiveCamera
              makeDefault
              fov={FOV}
              // El plano cercano por defecto de three.js (0.1) recorta huesos
              // diminutos: `distanceToFit` acerca la cámara por debajo de esa
              // distancia para una falange, y el lienzo queda en blanco sin
              // ningún error — verificado en e4.4 con "falange proximal del
              // quinto dedo de la mano".
              near={0.001}
              // Bajar la cámara sube el hueso en pantalla, que es como se esquiva
              // lo que flota sobre el lienzo sin recortar el lienzo mismo.
              position={[
                framing.center.x,
                framing.center.y - framing.shiftY,
                framing.center.z + framing.distance,
              ]}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(skeletonUrl, DRACO_PATH)
