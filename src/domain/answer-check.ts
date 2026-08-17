import type { Bone } from '../data/bone'

const ARTICULO_INICIAL = /^(el|la|los|las)\s+/

/**
 * Reemplazos explícitos de vocales acentuadas del español, no
 * `normalize('NFD')` + strip de diacríticos: esa vía descompondría también la
 * "ñ" en "n" + tilde combinante, y la "ñ" no es una vocal acentuada — es una
 * letra distinta ("cuña" ≠ "cuna"). Reemplazar solo lo que RF-06 pide tolerar
 * deja la "ñ" intacta por construcción, sin necesitar un marcador aparte.
 */
const VOCALES_ACENTUADAS: ReadonlyArray<readonly [RegExp, string]> = [
  [/[áàäâ]/g, 'a'],
  [/[éèëê]/g, 'e'],
  [/[íìïî]/g, 'i'],
  [/[óòöô]/g, 'o'],
  [/[úùüû]/g, 'u'],
]

/**
 * Normaliza una respuesta escrita para compararla sin distinguir mayúsculas,
 * tildes, espacios sobrantes ni un artículo inicial (`RF-06`) — conservando
 * la "ñ", que no es una tilde.
 *
 * Se aplica igual a lo que escribe el estudiante y a los nombres del
 * catálogo, para que la comparación sea siempre entre formas normalizadas —
 * mismo criterio que `governance/architecture/system-design.md` ya
 * declaraba para la validación de respuestas.
 */
export function normalizeAnswer(texto: string): string {
  const sinEspaciosSobrantes = texto.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es')
  const sinTildes = VOCALES_ACENTUADAS.reduce(
    (acumulado, [patron, reemplazo]) => acumulado.replace(patron, reemplazo),
    sinEspaciosSobrantes,
  )
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
