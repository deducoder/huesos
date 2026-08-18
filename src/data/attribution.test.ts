import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ATRIBUCION_LITERAL, LICENCIA_URL } from './attribution'

describe('la atribución del modelo 3D', () => {
  it('la fórmula literal es la que BodyParts3D exige', () => {
    expect(ATRIBUCION_LITERAL).toBe(
      'BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan',
    )
  })

  it('el enlace de licencia apunta a CC BY-SA 4.0', () => {
    expect(LICENCIA_URL).toBe('https://creativecommons.org/licenses/by-sa/4.0/')
  })

  // No basta con que la constante sea correcta por sí sola: si alguien
  // corrige `ATTRIBUTION.md` (la fuente) sin tocar esta constante, o al
  // revés, las dos formas del mismo texto se desincronizan en silencio.
  // Leído del archivo real, no citado de memoria.
  it('ATTRIBUTION.md contiene exactamente esa misma fórmula', () => {
    const fuente = readFileSync(resolve('src/data/ATTRIBUTION.md'), 'utf8')
    // El `.md` envuelve la cita en varias líneas de `>` por prolijidad
    // editorial — el mismo texto, no uno distinto. Se extrae el bloque de
    // cita y se reúne en una sola línea antes de comparar, en vez de
    // debilitar la comparación a una que tolere cualquier fragmento.
    const bloqueCita = fuente
      .split('\n')
      .filter((linea) => linea.startsWith('> '))
      .map((linea) => linea.slice(2))
      .join(' ')
    expect(bloqueCita).toBe(ATRIBUCION_LITERAL)
  })
})
