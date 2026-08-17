import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Lo que ocurre dentro de un canvas WebGL no existe en jsdom, así que esta
 * prueba **no** verifica que el esqueleto se vea: verifica lo que sí es
 * observable y lo que un guardrail exige.
 */
describe('la escena del esqueleto', () => {
  const fuente = readFileSync(resolve('src/components/SkeletonScene.tsx'), 'utf8')

  it('no pide nada a ningún tercero, como exige must-privacy-006', () => {
    const urls = fuente.match(/https?:\/\/[^\s'"`]+/g) ?? []
    expect(urls, 'URLs externas en el código de la escena').toEqual([])
  })

  it('sirve el decodificador Draco desde el propio sitio', () => {
    expect(fuente).toMatch(/\/draco\//)
    expect(existsSync(resolve('public/draco/draco_decoder.js'))).toBe(true)
    expect(existsSync(resolve('public/draco/draco_decoder.wasm'))).toBe(true)
  })

  it('carga el activo del repositorio, no una copia suelta', () => {
    expect(fuente).toMatch(/data\/skeleton\.glb/)
  })

  it('espeja el hemicuerpo, porque el modelo solo trae el derecho', () => {
    expect(fuente).toMatch(/scale=\{\[-1, 1, 1\]\}|MIRROR/)
  })
})
