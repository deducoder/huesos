import { useState } from 'react'
import { BoneIdentity } from '../../components/BoneIdentity'
import { BoneNavigator } from '../../components/BoneNavigator'
import { SkeletonScene } from '../../components/SkeletonScene'
import { catalog } from '../../data/catalog'
import { findBone, type SelectionId, toggleSelection } from '../../domain/selection'

/**
 * La vista de estudio: un solo estado de selección, proyectado en el navegador
 * accesible y en el panel de identidad. La escena 3D se suma en e2.6 como una
 * tercera proyección del mismo estado, nunca como dueña de él.
 */
export function ExploreView() {
  const [selected, setSelected] = useState<SelectionId>(null)

  return (
    <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[20rem_1fr_22rem]">
      <div className="min-h-0 overflow-y-auto border-slate-800 border-r py-2">
        <BoneNavigator
          bones={catalog}
          selected={selected}
          onSelect={(id) => setSelected((actual) => toggleSelection(actual, id))}
        />
      </div>
      <div className="min-h-0 bg-slate-900">
        <SkeletonScene
          bones={catalog}
          selected={selected}
          onPick={(id) => setSelected((actual) => toggleSelection(actual, id))}
        />
      </div>
      <div className="min-h-0 overflow-y-auto border-slate-800 border-l">
        <BoneIdentity bone={findBone(catalog, selected)} />
      </div>
    </div>
  )
}
