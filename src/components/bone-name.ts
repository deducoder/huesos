/**
 * El nombre de un hueso tal como se muestra y tal como se anuncia.
 *
 * Capa de vista, no dominio: depende de etiquetas en español, igual que
 * `labels.ts` y `categories.ts`. El catálogo guarda el nombre entero y en
 * minúscula —correcto dentro de una frase— y esta derivación lo prepara para
 * encabezar un botón o un título (ADR-014).
 */

/**
 * Los ordinales escritos que aparecen en el catálogo, en cifra. El género
 * sale de la propia palabra —«primera costilla» es femenino y «primer
 * metacarpiano» masculino— así que esta tabla no consulta al hueso.
 */
const ORDINALES: Record<string, string> = {
  primer: '1.º',
  primera: '1.ª',
  segundo: '2.º',
  segunda: '2.ª',
  tercer: '3.º',
  tercera: '3.ª',
  cuarto: '4.º',
  cuarta: '4.ª',
  quinto: '5.º',
  quinta: '5.ª',
  sexta: '6.ª',
  séptima: '7.ª',
  octava: '8.ª',
  novena: '9.ª',
  décima: '10.ª',
  undécima: '11.ª',
  duodécima: '12.ª',
}

/**
 * El techo de un nombre corto. El más largo del catálogo derivado mide 25
 * («Falange proximal 5.º mano»), y el techo va ajustado a propósito: es lo que
 * convierte a una regla futura que borre un discriminante en un rojo, y el
 * catálogo está cerrado en 206 entradas (ADR-006), así que nada legítimo
 * crece contra él.
 */
export const TECHO_NOMBRE_CORTO = 26

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/**
 * El nombre visible de un hueso, derivado del `es` del catálogo: sin el rodeo
 * que hace ilegible a una falange en un botón de teléfono, con el ordinal en
 * cifra y capitalizado.
 *
 * «falange proximal del segundo dedo de la mano» → «Falange proximal 2.º mano»
 */
export function shortName(es: string): string {
  const sinRodeo = es
    .replace(/\bdel (\S+) dedo de la mano\b/, '$1 mano')
    .replace(/\bdel (\S+) dedo del pie\b/, '$1 pie')
  const enCifras = sinRodeo.replace(/\p{L}+/gu, (palabra) => ORDINALES[palabra] ?? palabra)
  return capitalizar(enCifras)
}
