import { readdirSync, readFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * `must-privacy-006`: el progreso del estudiante no sale del navegador — sin
 * backend, sin telemetría, sin peticiones de red en tiempo de ejecución.
 *
 * El guardrail declaraba esta comprobación desde el principio del proyecto y
 * **no existía**: solo había un grep de URLs sobre un componente y la prueba de
 * navegador de s1. E5 es la épica que introduce persistencia, así que es donde
 * "el progreso no sale de acá" deja de ser una promesa y pasa a ser un gate.
 *
 * Se recorre **solo el código propio** (`src/`). Analizar el bundle construido
 * daría falsos positivos: trae código de terceros que nunca se ejecuta.
 */

/** Las formas de salir a la red que el guardrail prohíbe. */
const SALIDAS_A_LA_RED = [
  { nombre: 'fetch', patron: /(?<![\w.])fetch\s*\(/ },
  { nombre: 'XMLHttpRequest', patron: /XMLHttpRequest/ },
  { nombre: 'navigator.sendBeacon', patron: /sendBeacon/ },
  { nombre: 'WebSocket', patron: /new\s+WebSocket/ },
]

/** Todos los archivos de código bajo `src/`, sin pruebas. */
function fuentesDeLaAplicacion(directorio = resolve('src')): string[] {
  return readdirSync(directorio, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(directorio, entrada.name)
    if (entrada.isDirectory()) return fuentesDeLaAplicacion(ruta)
    if (!['.ts', '.tsx'].includes(extname(entrada.name))) return []
    if (entrada.name.includes('.test.')) return []
    return [ruta]
  })
}

describe('must-privacy-006: la aplicación no sale a la red', () => {
  it('ningún archivo de `src/` escribe una salida a la red', () => {
    const infracciones = fuentesDeLaAplicacion().flatMap((ruta) => {
      const codigo = readFileSync(ruta, 'utf8')
      return SALIDAS_A_LA_RED.filter(({ patron }) => patron.test(codigo)).map(
        ({ nombre }) => `${ruta.replace(`${resolve('.')}/`, '')} usa ${nombre}`,
      )
    })

    expect(infracciones, 'must-privacy-006: el progreso no sale del navegador').toEqual([])
  })

  it('recorre de verdad los archivos de la aplicación', () => {
    // Sin esto, un error en el recorrido daría una lista vacía y la prueba
    // anterior pasaría sin haber mirado nada — verde por no haber buscado.
    const fuentes = fuentesDeLaAplicacion()
    expect(fuentes.length).toBeGreaterThan(15)
    expect(fuentes.some((ruta) => ruta.endsWith('App.tsx'))).toBe(true)
    expect(fuentes.every((ruta) => !ruta.includes('.test.'))).toBe(true)
  })
})
