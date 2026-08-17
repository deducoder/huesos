import { BoneIdentity } from '../../components/BoneIdentity'
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
 * La vista de estudio, visual primero (ADR-009): el lienzo 3D a pantalla
 * completa, con la identidad del hueso elegido flotando encima. La vía por
 * teclado ya no convive acá — vive completa en la pestaña «Fichas», que
 * lleva a la ficha de cualquier hueso con su propia escena y su propio panel
 * de identidad. `BoneNavigator` no se toca; solo deja de montarse en esta
 * vista.
 *
 * El estado vive en `App` (e3.2), no acá: al volver de la ficha completa, la
 * selección tiene que sobrevivir, y eso exige que quien decide qué vista
 * montar sea también quien la posea.
 */
export function ExploreView({ selected, onSelect, onViewDetail }: Props) {
  const bone = findBone(catalog, selected)
  return (
    <div className="relative h-full min-h-0 bg-lienzo">
      <div className="absolute inset-0">
        <SkeletonScene
          bones={catalog}
          selected={selected}
          onPick={onSelect}
          accessibleHint="Vista tridimensional del esqueleto. Para elegir un hueso sin usar el ratón, abrí la pestaña Fichas: ahí está la lista completa por región."
        />
      </div>
      {bone && (
        <div className="absolute inset-x-4 bottom-4 max-h-[45vh] overflow-y-auto rounded-tarjeta border-2 border-tinta bg-panel shadow-dura">
          <BoneIdentity bone={bone} onViewDetail={onViewDetail} />
        </div>
      )}
    </div>
  )
}
