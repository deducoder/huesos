import type { Bone } from '../data/bone'
import { toNavigatorRows } from '../domain/navigator-rows'
import { groupByRegion } from '../domain/regions'
import { fullName, shortName, sideLabel, visibleName } from './bone-name'
import { REGION_LABEL } from './labels'

/** Las clases de una píldora o de una fila simple, según su selección. */
function claseObjetivo(elegido: boolean): string {
  return elegido
    ? 'bg-acento font-semibold text-panel shadow-dura'
    : 'bg-panel text-tinta hover:bg-acento-suave'
}

interface Props {
  bones: readonly Bone[]
  selected: string | null
  onSelect: (id: string) => void
}

/**
 * La vía de acceso por teclado al esqueleto, equivalente a la escena y no
 * subordinada a ella (ADR-002). Funciona sin que exista una sola línea de WebGL.
 *
 * Cada hueso par comparte fila con su opuesto (e7.4): el nombre común más dos
 * píldoras de lado, `min-h-tactil` cada una. El alto de la fila lo fija la
 * píldora, no el nombre — un nombre largo envuelve a dos líneas **dentro**
 * de esos 44 px en vez de agrandar la fila, así que el navegador entero
 * recorre más corto que antes de e7.4, no más largo, pese al mínimo táctil.
 */
export function BoneNavigator({ bones, selected, onSelect }: Props) {
  return (
    <nav aria-label="Huesos del esqueleto" className="overflow-y-auto">
      {groupByRegion(bones).map((grupo) => {
        const titleId = `region-${grupo.region}`
        return (
          <section key={grupo.region} className="mb-4">
            <h2 id={titleId} className="sticky top-0 bg-panel px-3 py-1 text-sm font-semibold">
              {REGION_LABEL[grupo.region]}
              <span className="ml-2 font-normal text-tinta-suave">{grupo.bones.length}</span>
              {!grupo.representable && (
                <span className="ml-2 font-normal text-aviso">· no representable</span>
              )}
            </h2>
            {/* La lista lleva el nombre accesible: un lector anuncia «lista, N elementos»
                con el nombre de la región, que es más informativo que un grupo genérico. */}
            <ul aria-labelledby={titleId} className="px-2">
              {toNavigatorRows(grupo.bones).map((fila) => {
                if (fila.kind === 'single') {
                  const bone = fila.bone
                  const descriptionId = bone.meshName === null ? `${bone.id}-missing` : undefined
                  return (
                    <li key={bone.id}>
                      <button
                        type="button"
                        aria-pressed={selected === bone.id}
                        aria-label={fullName(bone)}
                        aria-describedby={descriptionId}
                        onClick={() => onSelect(bone.id)}
                        className={`min-h-tactil w-full rounded-suave px-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento ${claseObjetivo(selected === bone.id)}`}
                      >
                        {selected === bone.id && <span aria-hidden="true">▸ </span>}
                        {visibleName(bone)}
                        {bone.meshName === null && <span aria-hidden="true"> ·</span>}
                      </button>
                      {descriptionId && (
                        <span id={descriptionId} className="sr-only">
                          {bone.missingReason}
                        </span>
                      )}
                    </li>
                  )
                }
                // Ningún lado tiene malla: los dos son indistinguibles en todo
                // lo que se puede ver —mismo motivo, nunca aparecen en la
                // escena, y `pickTestableBone` ya los excluye del modo test.
                // Elegir lado no distingue nada observable, así que la fila
                // colapsa a un solo objetivo. Se selecciona el lado derecho
                // por convención: alguna entrada concreta tiene que ir a
                // `BoneIdentity`, y es el mismo lado de referencia que ya usa
                // el dominio en otros lugares (`mesh-lookup`).
                if (fila.right.meshName === null && fila.left.meshName === null) {
                  const descriptionId = `${fila.right.id}-missing`
                  return (
                    <li key={fila.right.id}>
                      <button
                        type="button"
                        aria-pressed={selected === fila.right.id}
                        aria-label={fila.name}
                        aria-describedby={descriptionId}
                        onClick={() => onSelect(fila.right.id)}
                        className={`min-h-tactil w-full rounded-suave px-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento ${claseObjetivo(selected === fila.right.id)}`}
                      >
                        {shortName(fila.name)}
                        <span aria-hidden="true"> ·</span>
                      </button>
                      <span id={descriptionId} className="sr-only">
                        {fila.right.missingReason}
                      </span>
                    </li>
                  )
                }

                return (
                  <li key={fila.right.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="min-w-20 flex-1">{shortName(fila.name)}</span>
                    {[fila.right, fila.left].map((bone) => {
                      const descriptionId =
                        bone.meshName === null ? `${bone.id}-missing` : undefined
                      return (
                        <span key={bone.id}>
                          <button
                            type="button"
                            aria-pressed={selected === bone.id}
                            aria-label={fullName(bone)}
                            aria-describedby={descriptionId}
                            onClick={() => onSelect(bone.id)}
                            className={`min-h-tactil min-w-16 rounded-tarjeta border-2 border-tinta px-3 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento ${claseObjetivo(selected === bone.id)}`}
                          >
                            <span>
                              {sideLabel(bone.side, bone.gender)}
                              {bone.meshName === null && <span aria-hidden="true"> ·</span>}
                            </span>
                          </button>
                          {descriptionId && (
                            <span id={descriptionId} className="sr-only">
                              {bone.missingReason}
                            </span>
                          )}
                        </span>
                      )
                    })}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </nav>
  )
}
