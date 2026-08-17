import { describe, expect, it } from 'vitest'
import { recordAnswer } from '../domain/progress'
import { createProgressStore, type KeyValueStorage } from './progress-store'

/** Modo privado, cuota agotada, almacenamiento bloqueado: `setItem` lanza. */
function almacenQueLanzaAlEscribir(): KeyValueStorage {
  return {
    getItem: () => null,
    setItem: () => {
      throw new DOMException('cuota agotada', 'QuotaExceededError')
    },
  }
}

/** Algunos navegadores lanzan también al leer con el almacenamiento bloqueado. */
function almacenQueLanzaAlLeer(): KeyValueStorage {
  return {
    getItem: () => {
      throw new DOMException('acceso denegado', 'SecurityError')
    },
    setItem: () => {},
  }
}

describe('el almacén de progreso cuando el navegador falla', () => {
  it('no lanza al guardar aunque el almacén lance', () => {
    const store = createProgressStore(almacenQueLanzaAlEscribir())
    expect(() => store.write(recordAnswer({}, 'frontal', false))).not.toThrow()
  })

  it('sigue sirviendo lo recién escrito durante la sesión', () => {
    // El punto afilado en el diseño: la caída a memoria se antepone a las
    // lecturas posteriores. Si no, el estudiante ve retroceder su progreso.
    const store = createProgressStore(almacenQueLanzaAlEscribir())
    store.write(recordAnswer({}, 'frontal', false))

    expect(store.read()).toEqual({ frontal: { correct: 0, incorrect: 1 } })
  })

  it('devuelve el registro vacío si el almacén lanza al leer', () => {
    expect(createProgressStore(almacenQueLanzaAlLeer()).read()).toEqual({})
  })

  it('no confunde el fallo de escritura con no tener nada guardado', () => {
    const store = createProgressStore(almacenQueLanzaAlEscribir())
    store.write(recordAnswer({}, 'frontal', false))
    store.write(recordAnswer(store.read(), 'frontal', false))

    expect(store.read()).toEqual({ frontal: { correct: 0, incorrect: 2 } })
  })
})
