import { useState } from 'react'
import type { Bone } from '../data/bone'
import { toNavigatorRows } from '../domain/navigator-rows'
import { groupByRegion } from '../domain/regions'
import { groupByCategory } from './categories'
import { fullName, shortName, visibleName } from './bone-name'
import { REGION_LABEL } from './labels'
import { REGION_ACCENT } from './region-accent'

/**
 * El sub-nombre de un subgrupo dentro de una categoría (el texto después de
 * "—"), capitalizado: las ocho regiones sin guion ya vienen con mayúscula
 * inicial desde `REGION_LABEL`, y solo «neurocráneo» y «cara» quedaban en
 * minúscula por ser la mitad derecha de «Cráneo — …».
 */
function subLabel(region: keyof typeof REGION_LABEL): string {
  const etiqueta = REGION_LABEL[region]
  const guion = etiqueta.indexOf('—')
  if (guion === -1) return etiqueta
  const sub = etiqueta.slice(guion + 1).trim()
  return sub.charAt(0).toUpperCase() + sub.slice(1)
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
        const primeraRegion = cat.regions[0]
        // La categoría toma el color de su primera región (e8.5, informal;
        // mockup real): "Cráneo" (neurocráneo + cara) se ve dorado, no dos
        // colores mezclados — el mockup nunca combina más de un `bg` por
        // categoría, aunque tenga varios subgrupos adentro.
        const acentoCategoria = primeraRegion ? REGION_ACCENT[primeraRegion.region] : undefined
        return (
          <div key={cat.category} className="mb-3">
            <button
              type="button"
              aria-expanded={expandida}
              onClick={() => alternar(cat.category)}
              style={acentoCategoria ? { backgroundColor: acentoCategoria.bg } : undefined}
              className="flex min-h-20 w-full items-center justify-between rounded-suave border-2 border-tinta px-4 py-3 text-left font-display font-semibold text-base shadow-dura"
            >
              <span>
                {cat.category}
                <span className="ml-2 font-normal text-tinta/70">{total}</span>
              </span>
              <span aria-hidden="true" className={expandida ? 'rotate-180' : ''}>
                ⌄
              </span>
            </button>
            {expandida && (
              <div className="mt-2 flex flex-col gap-3">
                {cat.regions.map((grupo) => {
                  const acentoGrupo = REGION_ACCENT[grupo.region]
                  return (
                    <section
                      key={grupo.region}
                      style={{ backgroundColor: acentoGrupo.bg }}
                      className="rounded-suave border-2 border-tinta p-4 shadow-dura"
                    >
                      <h3
                        className="mb-2 flex items-baseline gap-2 font-display font-semibold text-sm"
                        style={{ color: acentoGrupo.text }}
                      >
                        {subLabel(grupo.region)}
                        <span className="font-normal text-xs opacity-70">{grupo.bones.length}</span>
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
                                  aria-label={fullName(bone)}
                                  aria-describedby={descriptionId}
                                  onClick={() => onSelect(bone.id)}
                                  className="flex min-h-16 w-full items-center rounded-suave border-2 border-tinta bg-panel/75 px-3 py-2 text-left text-sm leading-snug hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento"
                                >
                                  {visibleName(bone)}
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
                                  aria-label={fila.name}
                                  aria-describedby={descriptionId}
                                  onClick={() => onSelect(fila.right.id)}
                                  className="flex min-h-16 w-full items-center rounded-suave border-2 border-tinta bg-panel/75 px-3 py-2 text-left text-sm leading-snug hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento"
                                >
                                  {shortName(fila.name)}
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
                                  aria-label={fullName(bone)}
                                  aria-describedby={descriptionId}
                                  onClick={() => onSelect(bone.id)}
                                  className="flex min-h-16 w-full items-center rounded-suave border-2 border-tinta bg-panel/75 px-3 py-2 text-left text-sm leading-snug hover:bg-panel focus-visible:outline focus-visible:outline-2 focus-visible:outline-acento"
                                >
                                  {visibleName(bone)}
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
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
