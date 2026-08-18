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
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
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
 * En pantalla angosta el 3D toma un alto fijo y la ficha se lee debajo, como el
 * mockup; en pantalla ancha sigue siendo la columna lateral que e7.9 dejó.
 * Cuando el hueso no tiene geometría, el lugar de la escena lo ocupa la
 * explicación de la ausencia: **no se monta ningún lienzo**, así que tampoco
 * hay etiqueta accesible anunciando una vista tridimensional inexistente.
 */
export function BoneDetailView({ boneId }: Props) {
  const bone = findBone(catalog, boneId)

  if (!bone) {
    return <p className="p-6 text-tinta-suave">No encontré ese hueso en el catálogo.</p>
  }

  return (
    <div className="grid h-full min-h-0 grid-rows-[16rem_1fr] md:grid-cols-[1fr_22rem] md:grid-rows-1">
      <div className="min-h-0 border-tinta border-b-2 bg-lienzo md:border-r-2 md:border-b-0">
        {bone.meshName === null ? (
          <AusenciaEnElModelo />
        ) : (
          <IsolatedBoneScene bones={catalog} boneId={boneId} />
        )}
      </div>
      <div className="min-h-0 overflow-y-auto">
        <BoneSheet bone={bone} />
      </div>
    </div>
  )
}
