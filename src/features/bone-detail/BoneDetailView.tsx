import { BoneIdentity } from '../../components/BoneIdentity'
import { IsolatedBoneScene } from '../../components/IsolatedBoneScene'
import { catalog } from '../../data/catalog'
import { findBone } from '../../domain/selection'

interface Props {
  boneId: string
  onBack: () => void
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
      <p className="font-semibold text-slate-200">Este hueso no está en el modelo 3D</p>
      <p className="max-w-md text-slate-400 text-sm">
        Forma parte de los 206 huesos del esqueleto y su ficha está completa; lo único que falta es
        su geometría. El motivo está en la ficha, al lado.
      </p>
    </div>
  )
}

/**
 * La ficha completa de un hueso (RF-03): la escena aislada de e3.1 junto a
 * su identidad, de solo lectura — sin `onViewDetail`, para no ofrecer un
 * segundo botón hacia sí misma.
 *
 * Cuando el hueso no tiene geometría, el lugar de la escena lo ocupa la
 * explicación de la ausencia: **no se monta ningún lienzo**, así que tampoco
 * hay etiqueta accesible anunciando una vista tridimensional inexistente.
 */
export function BoneDetailView({ boneId, onBack }: Props) {
  const bone = findBone(catalog, boneId)

  return (
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[1fr_22rem]">
      <div className="min-h-0 bg-slate-900">
        {bone && bone.meshName === null ? (
          <AusenciaEnElModelo />
        ) : (
          <IsolatedBoneScene bones={catalog} boneId={boneId} />
        )}
      </div>
      <div className="min-h-0 overflow-y-auto border-slate-800 border-l">
        <div className="p-6 pb-0">
          <button
            type="button"
            onClick={onBack}
            className="rounded border border-slate-700 px-3 py-1.5 text-slate-300 text-sm hover:bg-slate-800"
          >
            ← Volver
          </button>
        </div>
        <BoneIdentity bone={bone} />
      </div>
    </div>
  )
}
