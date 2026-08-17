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
 * La vista de estudio: lienzo 3D a pantalla completa, con la identidad del
 * hueso elegido flotando encima (e7.6). `BoneNavigator` sigue siendo la vía
 * de teclado y lector de pantalla que ADR-002 estableció —sigue montada,
 * con los mismos `aria-pressed` y nombres accesibles— pero visualmente
 * oculta (`sr-only`, ADR-010): quien ve la pantalla ve el esqueleto, quien
 * navega por teclado sigue teniendo la lista completa.
 *
 * El estado vive en `App` (e3.2), no acá: al volver de la ficha completa, la
 * selección tiene que sobrevivir, y eso exige que quien decide qué vista
 * montar sea también quien la posea.
 */
export function ExploreView({ selected, onSelect, onViewDetail }: Props) {
  const bone = findBone(catalog, selected)
  return (
    <div className="relative h-full min-h-0 bg-lienzo">
      <div className="sr-only">
        <BoneNavigator bones={catalog} selected={selected} onSelect={onSelect} />
      </div>
      <div className="absolute inset-0">
        <SkeletonScene bones={catalog} selected={selected} onPick={onSelect} />
      </div>
      {bone && (
        <div
          data-testid="tarjeta-identidad"
          className="absolute inset-x-4 bottom-4 max-h-[45vh] overflow-y-auto rounded-tarjeta border-2 border-tinta bg-panel shadow-dura"
        >
          <BoneIdentity bone={bone} onViewDetail={onViewDetail} />
        </div>
      )}
    </div>
  )
}
