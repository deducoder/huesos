// Clasifica los nombres de malla del modelo. Herramienta de desarrollo: el
// catálogo se escribe a mano a partir de su salida, no se genera con ella.

/** Lo que una malla del modelo puede ser. Solo `bone` cuenta entre los 206. */
const NO_ES_HUESO = [
  [/sesamoid/i, 'sesamoid'],
  [/costal\s+cart/i, 'cartilage'],
  [/\b(incisor|canine|molar|premolar|tooth)\b/i, 'tooth'],
]

/**
 * Separa el lado del nombre base.
 * El modelo usa dos convenciones: el sufijo `.r` del hemicuerpo derecho y la
 * palabra `left` / `right` en los pocos huesos que trae por duplicado.
 */
function splitSide(name) {
  const limpio = name.replace(/\.$/, '')

  const sufijo = limpio.match(/^(.*)\.(r|l)$/i)
  if (sufijo) {
    return { side: sufijo[2].toLowerCase() === 'r' ? 'right' : 'left', base: sufijo[1] }
  }

  const palabra = limpio.match(/^(.*?)\s+(left|right)$/i)
  if (palabra) {
    return { side: palabra[2].toLowerCase(), base: palabra[1] }
  }

  return { side: null, base: limpio }
}

/**
 * Clasifica una malla por su nombre.
 * @returns {{kind: 'bone'|'tooth'|'cartilage'|'sesamoid', side: 'left'|'right'|null, base: string}}
 */
export function classifyMesh(name) {
  const { side, base } = splitSide(name)
  const kind = NO_ES_HUESO.find(([patron]) => patron.test(name))?.[1] ?? 'bone'
  return { kind, side, base }
}
