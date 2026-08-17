import type { Bone } from '../data/bone'
import { groupByRegion } from '../domain/regions'
import { REGION_LABEL, SIDE_LABEL } from './labels'

/** El nombre que oye un lector de pantalla: el hueso y, si es par, su lado. */
function accessibleName(bone: Bone): string {
  return bone.side === null ? bone.es : `${bone.es} ${SIDE_LABEL[bone.side]}`
}

interface Props {
  bones: readonly Bone[]
  selected: string | null
  onSelect: (id: string) => void
}

/**
 * La vía de acceso por teclado al esqueleto, equivalente a la escena y no
 * subordinada a ella (ADR-002). Funciona sin que exista una sola línea de WebGL.
 */
export function BoneNavigator({ bones, selected, onSelect }: Props) {
  return (
    <nav aria-label="Huesos del esqueleto" className="overflow-y-auto">
      {groupByRegion(bones).map((grupo) => {
        const titleId = `region-${grupo.region}`
        return (
          <section key={grupo.region} className="mb-4">
            <h2 id={titleId} className="sticky top-0 bg-slate-900 px-3 py-1 text-sm font-semibold">
              {REGION_LABEL[grupo.region]}
              <span className="ml-2 font-normal text-slate-400">{grupo.bones.length}</span>
              {!grupo.representable && (
                <span className="ml-2 font-normal text-amber-300">· no representable</span>
              )}
            </h2>
            {/* La lista lleva el nombre accesible: un lector anuncia «lista, N elementos»
                con el nombre de la región, que es más informativo que un grupo genérico. */}
            <ul aria-labelledby={titleId} className="px-2">
              {grupo.bones.map((bone) => {
                const descriptionId = bone.meshName === null ? `${bone.id}-missing` : undefined
                return (
                  <li key={bone.id}>
                    <button
                      type="button"
                      aria-pressed={selected === bone.id}
                      aria-describedby={descriptionId}
                      onClick={() => onSelect(bone.id)}
                      className={`w-full rounded px-2 py-1 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 ${
                        selected === bone.id
                          ? 'bg-sky-700 font-semibold text-white'
                          : 'text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {selected === bone.id && <span aria-hidden="true">▸ </span>}
                      {accessibleName(bone)}
                      {bone.meshName === null && <span aria-hidden="true"> ·</span>}
                    </button>
                    {descriptionId && (
                      <span id={descriptionId} className="sr-only">
                        {bone.missingReason}
                      </span>
                    )}
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
