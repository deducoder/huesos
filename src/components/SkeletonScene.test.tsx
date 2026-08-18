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

  it('espeja la parte lateral, que el modelo solo trae del lado derecho', () => {
    expect(fuente).toMatch(/\[-1, 1, 1\]/)
    expect(fuente).toMatch(/half="mirrored"/)
  })

  it('no espeja lo que el modelo ya trae en su sitio', () => {
    // b2.3: espejar el modelo entero duplicaba 36 mallas —la línea media y los
    // parietales— encima de sí mismas, y las dejaba pulsables en el hemisferio
    // contrario aunque no se vieran.
    expect(fuente).toMatch(/stripMidline\(/)
  })

  it('resuelve el lado por la mitad de la escena, no por el nombre de la malla', () => {
    expect(fuente).toMatch(/boneIdForMesh\(bones, evento\.object\.name, half\)/)
  })

  it('da a cada copia su propio material, para no resaltar los dos lados a la vez', () => {
    expect(fuente).toMatch(/ownMaterial/)
  })

  it('resalta comparando el hueso resuelto por mitad, no el nombre de la malla', () => {
    // b2.1: comparar nombres de malla encendía los dos lados de un hueso par,
    // y además nunca casaba porque el cargador sanea los nombres.
    expect(fuente).toMatch(/const esteHueso = boneIdForMesh\(bones, malla\.name, half\)/)
    expect(fuente).not.toMatch(/malla\.name === selected/)
  })

  it('toma el color de resaltado del token de diseño, no de un hex fijo', () => {
    // epic-review e7: `--color-acento` (ADR-007) es "selección" en toda la
    // aplicación, pero el resaltado 3D seguía con el `#38bdf8` de antes del
    // rediseño — dos azules distintos para el mismo concepto.
    expect(fuente).not.toMatch(/#38bdf8/)
    expect(fuente).toMatch(/--color-acento/)
  })

  it('tiñe el material del hueso resaltado en vez de emitir luz', () => {
    // La emisión suma luz sobre un material ya beige claro: ni el blanco
    // puro al máximo llega a lo que teñir el color consigue con el mismo
    // acento (design de e9.1, medido: suma 152 contra 282). El resaltado se
    // aplica al `color` del material, no a `emissive`.
    expect(fuente).toMatch(/propio\.color = resaltado \? colorDeSeleccion\(\)/)
  })

  it('no deja el mecanismo viejo conviviendo con el nuevo', () => {
    // Una migración a medias — `color` nuevo y `emissiveIntensity` todavía
    // presente — no sería un tinte: seguiría sumando luz sobre el tinte.
    expect(fuente).not.toMatch(/emissiveIntensity/)
  })

  it('reporta la caja del hueso señalado reutilizando la resolución por mitad', () => {
    // e9.4: el mismo `esteHueso` que ya decide el resaltado de color decide
    // qué malla expandir — no una segunda comparación que podría reintroducir
    // el bug de b2.1 (mallas compartidas entre pares, comparadas por nombre).
    expect(fuente).toMatch(/onSelectedBox\?\.\(/)
    expect(fuente).not.toMatch(/malla\.name === selected/)
  })
})
