import type { Bone } from '../data/bone'

const ARTICULO_INICIAL = /^(el|la|los|las)\s+/

/**
 * Normaliza una respuesta escrita para compararla sin distinguir mayúsculas,
 * tildes, espacios sobrantes ni un artículo inicial (`RF-06`).
 *
 * Se aplica igual a lo que escribe el estudiante y a los nombres del
 * catálogo, para que la comparación sea siempre entre formas normalizadas —
 * mismo criterio que `governance/architecture/system-design.md` ya
 * declaraba para la validación de respuestas.
 */
export function normalizeAnswer(texto: string): string {
  const sinEspaciosSobrantes = texto.trim().replace(/\s+/g, ' ')
  const sinTildes = sinEspaciosSobrantes
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
  return sinTildes.replace(ARTICULO_INICIAL, '')
}

/** Toda forma válida para nombrar un hueso: español, latín y sus sinónimos. */
function formasValidas(hueso: Bone): string[] {
  return [hueso.es, hueso.la, ...hueso.synonyms]
}

/**
 * Si una respuesta escrita nombra correctamente al hueso, tolerando
 * mayúsculas, tildes, espacios y un artículo inicial, y aceptando el
 * español, el latín o cualquier sinónimo registrado (`RF-06`).
 */
export function isCorrectAnswer(respuesta: string, hueso: Bone): boolean {
  const normalizada = normalizeAnswer(respuesta)
  if (normalizada === '') return false
  return formasValidas(hueso).some((forma) => normalizeAnswer(forma) === normalizada)
}
