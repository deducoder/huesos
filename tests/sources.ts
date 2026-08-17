import { readdirSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

/**
 * Todos los archivos de código bajo `src/`, sin pruebas.
 *
 * Vive acá porque la usan dos guardrails que recorren lo mismo —
 * `privacy.test.ts` (`must-privacy-006`) y `design-tokens.test.ts` (ADR-007)—
 * y copiarla habría dejado dos recorridos que envejecen por separado.
 */
export function fuentesDeLaAplicacion(directorio = resolve('src')): string[] {
  return readdirSync(directorio, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(directorio, entrada.name)
    if (entrada.isDirectory()) return fuentesDeLaAplicacion(ruta)
    if (!['.ts', '.tsx'].includes(extname(entrada.name))) return []
    if (entrada.name.includes('.test.')) return []
    return [ruta]
  })
}
