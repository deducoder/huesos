import type { RegionGroup } from '../domain/regions'
import { REGION_LABEL } from './labels'

/**
 * La categoría de Fichas para una región: el prefijo de su etiqueta antes
 * de "—" (p. ej. `REGION_LABEL.cranium === 'Cráneo — neurocráneo'` →
 * `'Cráneo'`), o la etiqueta completa cuando no hay "—" — la mayoría de las
 * regiones son, cada una, su propia categoría de un solo subgrupo.
 *
 * Vive en `src/components/`, no en `src/domain/`: depende de `REGION_LABEL`,
 * una traducción de la capa de vista (`labels.ts`) — el dominio guarda
 * claves estables, nunca etiquetas en español.
 */
function categoryLabel(grupo: RegionGroup): string {
  const etiqueta = REGION_LABEL[grupo.region]
  const guion = etiqueta.indexOf('—')
  return guion === -1 ? etiqueta : etiqueta.slice(0, guion).trim()
}

export interface CategoryGroup {
  category: string
  regions: RegionGroup[]
}

/**
 * Agrupa las regiones de `groupByRegion` en categorías de Fichas (e8.2,
 * ADR-011), fusionando regiones **adyacentes** que comparten categoría —
 * el orden de `groupByRegion` ya pone contiguas `cranium` y `face`, así que
 * no hace falta reordenar ni agrupar por índice.
 */
export function groupByCategory(regionGroups: readonly RegionGroup[]): CategoryGroup[] {
  const categorias: CategoryGroup[] = []
  for (const grupo of regionGroups) {
    const categoria = categoryLabel(grupo)
    const ultima = categorias[categorias.length - 1]
    if (ultima !== undefined && ultima.category === categoria) {
      ultima.regions.push(grupo)
    } else {
      categorias.push({ category: categoria, regions: [grupo] })
    }
  }
  return categorias
}
