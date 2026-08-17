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
    // En pantalla chica las tres zonas se apilan y ninguna declara alto, así que
    // el lienzo cae a los 150 px intrínsecos de un <canvas> y queda detrás de los
    // 206 huesos del navegador. `minmax(0,Nfr)` reparte el alto y —lo que importa—
    // deja que la fila de la lista baje del tamaño de su contenido; con `Nfr` a
    // secas reclamaría su alto entero y no habría reparto. En `md:` el grid vuelve
    // a ser de columnas y estas filas se anulan.
    <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:grid-cols-[20rem_1fr_22rem] md:grid-rows-none">
      <div className="min-h-0 overflow-y-auto border-tinta border-r py-2">
        <BoneNavigator bones={catalog} selected={selected} onSelect={onSelect} />
      </div>
      <div className="min-h-0 border-tinta border-y-2 bg-lienzo md:border-y-0">
        <SkeletonScene bones={catalog} selected={selected} onPick={onSelect} />
      </div>
      <div className="min-h-0 overflow-y-auto border-tinta border-l">
        <BoneIdentity bone={findBone(catalog, selected)} onViewDetail={onViewDetail} />
      </div>
    </div>
  )
}
