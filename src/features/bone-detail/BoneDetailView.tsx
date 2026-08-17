import { BoneIdentity } from '../../components/BoneIdentity'
import { IsolatedBoneScene } from '../../components/IsolatedBoneScene'
import { catalog } from '../../data/catalog'
import { findBone } from '../../domain/selection'

interface Props {
  boneId: string
  onBack: () => void
}

/**
 * La ficha completa de un hueso (RF-03): la escena aislada de e3.1 junto a
 * su identidad, de solo lectura — sin `onViewDetail`, para no ofrecer un
 * segundo botón hacia sí misma.
 */
export function BoneDetailView({ boneId, onBack }: Props) {
  const bone = findBone(catalog, boneId)

  return (
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[1fr_22rem]">
      <div className="min-h-0 bg-slate-900">
        <IsolatedBoneScene bones={catalog} boneId={boneId} />
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
