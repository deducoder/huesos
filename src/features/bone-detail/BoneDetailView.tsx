import { useLayoutEffect, useRef, useState } from 'react'
import { IsolatedBoneScene } from '../../components/IsolatedBoneScene'
import { catalog } from '../../data/catalog'
import { findBone } from '../../domain/selection'
import { BoneSheet } from './BoneSheet'

interface Props {
  boneId: string
}

/**
 * Lo que ocupa el lugar de la escena cuando el modelo no trae ese hueso.
 *
 * No es un estado de error: la entrada del catálogo es correcta y completa
 * (ADR-006), lo que falta es geometría. Sin esto, `IsolatedBoneScene` monta un
 * lienzo sin cámara —no hay malla visible que encuadrar— y el estudiante ve un
 * panel negro junto a un texto correcto, que parece una aplicación rota.
 */
function AusenciaEnElModelo() {
  return (
    <div className="flex h-full flex-col items-center gap-3 p-8 pt-16 text-center">
      <p className="font-semibold text-panel">Este hueso no está en el modelo 3D</p>
      <p className="max-w-md text-panel/80 text-sm">
        Forma parte de los 206 huesos del esqueleto y su ficha está completa; lo único que falta es
        su geometría. El motivo está escrito en la ficha.
      </p>
    </div>
  )
}

/**
 * La ficha completa de un hueso (RF-03): la escena aislada de e3.1 sobre su
 * ficha, de solo lectura — sin `onViewDetail`, para no ofrecer un segundo botón
 * hacia sí misma.
 *
 * "Volver" no vive acá sino en la cabecera de la aplicación (e8.5, mockup):
 * mientras la ficha está abierta, esa cabecera **es** la salida, y el botón no
 * puede estar en dos lugares.
 *
 * La ficha es una tarjeta flotante abajo, con las mismas medidas que la de
 * `ExploreView` (e8.5): la escena se queda con la pantalla entera y el hueso
 * aislado —lo único que esta vista tiene para mostrar que no esté escrito— se
 * ve lo más grande posible. Cuando el hueso no tiene geometría, el lugar de la
 * escena lo ocupa la explicación de la ausencia: **no se monta ningún
 * lienzo**, así que tampoco hay etiqueta accesible anunciando una vista
 * tridimensional inexistente.
 */
/**
 * Qué fracción del alto de la vista cubre la tarjeta flotante.
 *
 * Se **mide**, no se supone: la tarjeta declara `max-h-[45vh]` pero su alto
 * real depende de cuánto tenga escrito cada hueso, y reservar siempre el
 * máximo encogería el hueso sin motivo en las fichas cortas. `ResizeObserver`
 * dispara después del layout por definición, que es justo lo que hace falta
 * — medir antes da el tamaño intrínseco y no el real.
 */
function useFraccionCubierta(
  contenedor: React.RefObject<HTMLDivElement | null>,
  tarjeta: React.RefObject<HTMLDivElement | null>,
): number {
  const [fraccion, setFraccion] = useState(0)

  useLayoutEffect(() => {
    const raiz = contenedor.current
    const flotante = tarjeta.current
    if (!raiz || !flotante) return

    const medir = () => {
      const alto = raiz.clientHeight
      if (alto === 0) return
      // Desde donde empieza la tarjeta hasta el borde inferior de la vista:
      // todo eso queda por debajo de ella, incluido el aire de `bottom-4`.
      const cubierto = raiz.getBoundingClientRect().bottom - flotante.getBoundingClientRect().top
      setFraccion(Math.min(Math.max(cubierto / alto, 0), 0.9))
    }

    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(raiz)
    observador.observe(flotante)
    return () => observador.disconnect()
  }, [contenedor, tarjeta])

  return fraccion
}

export function BoneDetailView({ boneId }: Props) {
  const bone = findBone(catalog, boneId)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const tarjetaRef = useRef<HTMLDivElement>(null)
  const fraccionCubierta = useFraccionCubierta(contenedorRef, tarjetaRef)

  if (!bone) {
    return <p className="p-6 text-tinta-suave">No encontré ese hueso en el catálogo.</p>
  }

  return (
    <div ref={contenedorRef} className="relative h-full min-h-0 bg-lienzo">
      <div className="absolute inset-0">
        {bone.meshName === null ? (
          <AusenciaEnElModelo />
        ) : (
          <IsolatedBoneScene bones={catalog} boneId={boneId} reservedBottom={fraccionCubierta} />
        )}
      </div>
      <div
        ref={tarjetaRef}
        data-testid="tarjeta-ficha"
        className="absolute inset-x-4 bottom-4 max-h-[45vh] overflow-y-auto rounded-tarjeta border-2 border-tinta bg-panel shadow-dura md:inset-x-auto md:left-4 md:right-auto md:w-full md:max-w-sm"
      >
        <BoneSheet bone={bone} />
      </div>
    </div>
  )
}
