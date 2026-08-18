import { useState } from 'react'
import type { Bone } from '../data/bone'
import { toNavigatorRows } from '../domain/navigator-rows'
import { groupByRegion } from '../domain/regions'
import { groupByCategory } from './categories'
import { REGION_LABEL, SIDE_LABEL } from './labels'

/**
 * El nombre que oye un lector de pantalla: el hueso y, si es par, su lado.
 *
 * Duplica la función homónima de `BoneNavigator.tsx` a propósito — ADR-011
 * (`work/epics/e8-redesign-mockup-follow-ups/design.md`) decide no tocar
 * `BoneNavigator.tsx` ni una línea, así que exportarla desde ahí no es una
 * opción. Tres líneas de duplicación es el costo ya aceptado en ese ADR.
 */
function accessibleName(bone: Bone): string {
  return bone.side === null ? bone.es : `${bone.es} ${SIDE_LABEL[bone.side]}`
}

/** El sub-nombre de un subgrupo dentro de una categoría (el texto después de "—"). */
function subLabel(region: keyof typeof REGION_LABEL): string {
  const etiqueta = REGION_LABEL[region]
  const guion = etiqueta.indexOf('—')
  return guion === -1 ? etiqueta : etiqueta.slice(guion + 1).trim()
}

interface Props {
  bones: readonly Bone[]
  onSelect: (id: string) => void
}

/**
 * Fichas por categoría → subgrupo → grilla de etiquetas (e8.2, ADR-011),
 * en vez de la lista plana de 10 regiones que `BoneNavigator` mantiene
 * para su vía oculta en `ExploreView` (ADR-010, sin tocar). Reutiliza
 * `toNavigatorRows` para el mismo criterio de pares que e7.4/e7.5 ya
 * resolvieron — un par sin geometría en ningún lado colapsa a una sola
 * etiqueta.
 *
 * A diferencia de `BoneNavigator`, no recibe `selected`: tocar una
 * etiqueta navega de inmediato a la ficha completa, no hay "hueso actual"
 * que resaltar en esta vista.
 */
export function FichasAccordion({ bones, onSelect }: Props) {
  const [expandidas, setExpandidas] = useState<ReadonlySet<string>>(new Set())

  const alternar = (categoria: string) => {
    setExpandidas((actual) => {
      const siguiente = new Set(actual)
      if (siguiente.has(categoria)) siguiente.delete(categoria)
      else siguiente.add(categoria)
      return siguiente
    })
  }

  const categorias = groupByCategory(groupByRegion(bones))

  return (
    <div className="overflow-y-auto px-2">
      {categorias.map((cat) => {
        const expandida = expandidas.has(cat.category)
        const total = cat.regions.reduce((suma, r) => suma + r.bones.length, 0)
        return (
          <div key={cat.category} className="mb-3">
            <button
              type="button"
              aria-expanded={expandida}
              onClick={() => alternar(cat.category)}
              className="min-h-tactil flex w-full items-center justify-between rounded-suave border-2 border-tinta bg-panel px-3 text-left font-display font-semibold text-sm shadow-dura hover:bg-acento-suave"
            >
              <span>
                {cat.category}
                <span className="ml-2 font-normal text-tinta-suave">{total}</span>
              </span>
              <span aria-hidden="true" className={expandida ? 'rotate-180' : ''}>
                ⌄
              </span>
            </button>
            {expandida && (
              <div className="mt-2 flex flex-col gap-3 pl-2">
                {cat.regions.map((grupo) => (
                  <section key={grupo.region}>
                    <h3 className="mb-2 flex items-baseline gap-2 font-display font-semibold text-sm">
                      {subLabel(grupo.region)}
                      <span className="font-normal text-tinta-suave text-xs">
                        {grupo.bones.length}
                      </span>
                      {!grupo.representable && (
                        <span className="text-aviso text-xs">· no representable</span>
                      )}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {toNavigatorRows(grupo.bones).map((fila) => {
                        if (fila.kind === 'single') {
                          const bone = fila.bone
                          const descriptionId =
                            bone.meshName === null ? `${bone.id}-missing` : undefined
                          return (
                            <span key={bone.id}>
                              <button
                                type="button"
                                aria-describedby={descriptionId}
                                onClick={() => onSelect(bone.id)}
                                className="min-h-tactil w-full rounded-tarjeta border-2 border-tinta bg-panel px-2 text-left text-sm hover:bg-acento-suave focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento"
                              >
                                {accessibleName(bone)}
                                {bone.meshName === null && <span aria-hidden="true"> ·</span>}
                              </button>
                              {descriptionId && (
                                <span id={descriptionId} className="sr-only">
                                  {bone.missingReason}
                                </span>
                              )}
                            </span>
                          )
                        }

                        // Ningún lado tiene malla: colapsa a una sola etiqueta,
                        // mismo criterio que BoneNavigator (e7.4) — elegir lado
                        // no distingue nada observable.
                        if (fila.right.meshName === null && fila.left.meshName === null) {
                          const descriptionId = `${fila.right.id}-missing`
                          return (
                            <span key={fila.right.id}>
                              <button
                                type="button"
                                aria-describedby={descriptionId}
                                onClick={() => onSelect(fila.right.id)}
                                className="min-h-tactil w-full rounded-tarjeta border-2 border-tinta bg-panel px-2 text-left text-sm hover:bg-acento-suave focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento"
                              >
                                {fila.name}
                                <span aria-hidden="true"> ·</span>
                              </button>
                              <span id={descriptionId} className="sr-only">
                                {fila.right.missingReason}
                              </span>
                            </span>
                          )
                        }

                        return [fila.right, fila.left].map((bone) => {
                          const descriptionId =
                            bone.meshName === null ? `${bone.id}-missing` : undefined
                          return (
                            <span key={bone.id}>
                              <button
                                type="button"
                                aria-describedby={descriptionId}
                                onClick={() => onSelect(bone.id)}
                                className="min-h-tactil w-full rounded-tarjeta border-2 border-tinta bg-panel px-2 text-left text-sm hover:bg-acento-suave focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento"
                              >
                                {accessibleName(bone)}
                                {bone.meshName === null && <span aria-hidden="true"> ·</span>}
                              </button>
                              {descriptionId && (
                                <span id={descriptionId} className="sr-only">
                                  {bone.missingReason}
                                </span>
                              )}
                            </span>
                          )
                        })
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
