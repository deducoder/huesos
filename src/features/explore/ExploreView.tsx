import { BoneIdentity } from '../../components/BoneIdentity'
import { BoneNavigator } from '../../components/BoneNavigator'
import { SkeletonScene } from '../../components/SkeletonScene'
import { catalog } from '../../data/catalog'
import { findBone, type SelectionId } from '../../domain/selection'

interface Props {
  selected: SelectionId
  onSelect: (id: string) => void
  /** Abre la ficha completa del hueso elegido (RF-03, e3.2). Requerida: ver `BoneIdentity`. */
  onViewDetail: (id: string) => void
}

/**
 * La vista de estudio: lienzo 3D a pantalla completa, con la identidad del
 * hueso elegido flotando encima (e7.6). `BoneNavigator` sigue siendo la vía
 * de teclado y lector de pantalla que ADR-002 estableció —sigue montado,
 * con los mismos `aria-pressed` y nombres accesibles— pero visualmente
 * oculto en mobile (`sr-only`, ADR-010): quien ve la pantalla ve el
 * esqueleto, quien navega por teclado sigue teniendo la lista completa.
 *
 * A partir de `md:` (e7.9) el navegador deja de estar oculto y pasa a ser
 * la primera columna de una grilla de dos —mismo ancho fijo que la columna
 * de identidad de `BoneDetailView`, por consistencia—; la escena y la
 * tarjeta flotante viven en su propio contenedor `relative` para que sus
 * hijos `absolute` se ubiquen respecto a esa columna y no a las dos.
 *
 * El estado vive en `App` (e3.2), no acá: al volver de la ficha completa, la
 * selección tiene que sobrevivir, y eso exige que quien decide qué vista
 * montar sea también quien la posea.
 */
export function ExploreView({ selected, onSelect, onViewDetail }: Props) {
  const bone = findBone(catalog, selected)
  return (
    <div className="h-full min-h-0 bg-lienzo md:grid md:grid-cols-[22rem_1fr]">
      <div className="sr-only md:not-sr-only md:h-full md:overflow-y-auto md:border-tinta md:border-r-2 md:bg-panel md:py-2">
        <BoneNavigator bones={catalog} selected={selected} onSelect={onSelect} />
      </div>
      <div className="relative h-full min-h-0">
        <div className="absolute inset-0">
          <SkeletonScene bones={catalog} selected={selected} onPick={onSelect} />
        </div>
        {bone && (
          // Alto dinámico, según el contenido de cada hueso (e8.5, iteración
          // informal) — un alto fijo (probado y descartado) dejaba un hueco
          // vacío incómodo en los casos cortos. `max-h-[45vh]` es el único
          // techo, para el caso más largo del catálogo (`hioides`). El salto
          // de alto entre huesos queda para una animación futura, no para
          // esta pasada.
          <div
            data-testid="tarjeta-identidad"
            className="absolute inset-x-4 bottom-4 max-h-[45vh] overflow-y-auto rounded-tarjeta border-2 border-tinta bg-panel shadow-dura transition-[opacity,transform] duration-panel ease-salida starting:translate-y-3 starting:opacity-0 md:inset-x-auto md:left-4 md:right-auto md:w-full md:max-w-sm"
          >
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => onSelect(bone.id)}
              className="absolute top-3 right-3 flex min-h-tactil min-w-tactil items-center justify-center rounded-full border-2 border-tinta bg-panel text-tinta"
            >
              <span aria-hidden="true">✕</span>
            </button>
            <BoneIdentity bone={bone} onViewDetail={onViewDetail} />
          </div>
        )}
      </div>
    </div>
  )
}
