/**
 * Los grupos con los que el activo declara su propia lateralidad.
 *
 * El modelo reparte sus 144 mallas en tres raíces: `Bones` (36), `Bones_right`
 * (98) y `Cartilages_right` (10). El sufijo `_right` no es decorativo — dice
 * qué mitad del cuerpo contiene cada rama, y por tanto qué admite espejo.
 *
 * b2.3 existió por no leer esto. La escena espejaba el modelo entero bajo la
 * premisa de que traía «solo el hemicuerpo derecho», y `Bones` no es hemicuerpo:
 * son las piezas de línea media —columna, esternón, mandíbula, frontal,
 * occipital, esfenoides, etmoides, vómer— más el único par que el modelo trae
 * completo, los parietales. Espejarlas no las mueve al otro lado: las duplica.
 */
export const MIDLINE_GROUP = 'Bones'
