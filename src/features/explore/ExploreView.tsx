import { BoneIdentity } from '../../components/BoneIdentity'
import { BoneNavigator } from '../../components/BoneNavigator'
import { SkeletonScene } from '../../components/SkeletonScene'
import { catalog } from '../../data/catalog'
import { findBone, type SelectionId } from '../../domain/selection'

interface Props {
  selected: SelectionId
  onSelect: (id: string) => void
  /** Si se pasa, ofrece abrir la ficha completa del hueso elegido (RF-03, e3.2). */
  onViewDetail?: (id: string) => void
}

/**
 * La vista de estudio: un solo estado de selección, proyectado en el navegador
 * accesible y en el panel de identidad. La escena 3D se suma en e2.6 como una
 * tercera proyección del mismo estado, nunca como dueña de él.
 *
 * El estado vive en `App` (e3.2), no acá: al volver de la ficha completa, la
 * selección tiene que sobrevivir, y eso exige que quien decide qué vista
 * montar sea también quien la posea.
 */
export function ExploreView({ selected, onSelect, onViewDetail }: Props) {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[20rem_1fr_22rem]">
      <div className="min-h-0 overflow-y-auto border-slate-800 border-r py-2">
        <BoneNavigator bones={catalog} selected={selected} onSelect={onSelect} />
      </div>
      <div className="min-h-0 bg-slate-900">
        <SkeletonScene bones={catalog} selected={selected} onPick={onSelect} />
      </div>
      <div className="min-h-0 overflow-y-auto border-slate-800 border-l">
        <BoneIdentity bone={findBone(catalog, selected)} onViewDetail={onViewDetail} />
      </div>
    </div>
  )
}
