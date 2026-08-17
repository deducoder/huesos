import { describe, expect, it } from 'vitest'
import { catalog } from '../data/catalog'
import { EMPTY_PROGRESS, recordAnswer } from '../domain/progress'
import { createProgressStore, type KeyValueStorage, progressStore } from './progress-store'

/**
 * Un almacén que se porta bien. **Comparte** el objeto en vez de copiarlo: así
 * dos almacenes sobre los mismos datos se ven el uno al otro, que es lo que
 * hace falta para comprobar que algo se escribió de verdad y no solo se
 * recordó en memoria.
 */
function almacenEnMemoria(datos: Record<string, string> = {}): KeyValueStorage {
  return {
    getItem: (clave) => datos[clave] ?? null,
    setItem: (clave, valor) => {
      datos[clave] = valor
    },
  }
}

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

describe('el almacén de progreso en su camino normal', () => {
  it('devuelve el registro vacío en la primera visita', () => {
    expect(createProgressStore(almacenEnMemoria()).read()).toEqual({})
  })

  it('devuelve lo guardado tras guardarlo', () => {
    const store = createProgressStore(almacenEnMemoria())
    store.write(recordAnswer({}, 'frontal', false))

    expect(store.read()).toEqual({ frontal: { correct: 0, incorrect: 1 } })
  })

  it('escribe de verdad en el almacén, no solo en memoria', () => {
    // Un almacén nuevo sobre los MISMOS datos: si solo se hubiera recordado en
    // memoria, este segundo no vería nada.
    const datos: Record<string, string> = {}
    createProgressStore(almacenEnMemoria(datos)).write(recordAnswer({}, 'sacrum', true))

    expect(createProgressStore(almacenEnMemoria(datos)).read()).toEqual({
      sacrum: { correct: 1, incorrect: 0 },
    })
  })

  it('sobrevive a los 206 huesos del catálogo real', () => {
    const datos: Record<string, string> = {}
    let registro = EMPTY_PROGRESS
    for (const bone of catalog) registro = recordAnswer(registro, bone.id, false)
    createProgressStore(almacenEnMemoria(datos)).write(registro)

    const leido = createProgressStore(almacenEnMemoria(datos)).read()
    expect(Object.keys(leido)).toHaveLength(catalog.length)
    for (const bone of catalog) expect(leido[bone.id]).toEqual({ correct: 0, incorrect: 1 })
  })
})

describe('el almacén de progreso ante un valor guardado que no vale', () => {
  const guardado = (valor: string) => almacenEnMemoria({ 'huesos-mono:progress': valor })

  it('descarta un valor que no es JSON', () => {
    expect(createProgressStore(guardado('no-soy-json{')).read()).toEqual({})
  })

  it('descarta un JSON válido que no es un objeto', () => {
    expect(createProgressStore(guardado('"hola"')).read()).toEqual({})
    expect(createProgressStore(guardado('42')).read()).toEqual({})
    expect(createProgressStore(guardado('null')).read()).toEqual({})
    expect(createProgressStore(guardado('[1,2,3]')).read()).toEqual({})
  })

  it('descarta un registro cuyas entradas no son contadores', () => {
    expect(createProgressStore(guardado('{"frontal":"hola"}')).read()).toEqual({})
    expect(createProgressStore(guardado('{"frontal":{"correct":1}}')).read()).toEqual({})
  })

  it('descarta contadores negativos o no enteros', () => {
    expect(
      createProgressStore(guardado('{"frontal":{"correct":-1,"incorrect":0}}')).read(),
    ).toEqual({})
    expect(
      createProgressStore(guardado('{"frontal":{"correct":1.5,"incorrect":0}}')).read(),
    ).toEqual({})
  })

  it('descarta el registro entero, no solo la entrada mala', () => {
    // Reparar a medias es cómo se cuela un dato inventado: si una entrada no
    // vale, no hay razón para confiar en las demás del mismo texto.
    const mezclado = '{"frontal":{"correct":1,"incorrect":2},"sacrum":"basura"}'
    expect(createProgressStore(guardado(mezclado)).read()).toEqual({})
  })

  it('acepta un registro bien formado', () => {
    const bueno = '{"frontal":{"correct":1,"incorrect":2}}'
    expect(createProgressStore(guardado(bueno)).read()).toEqual({
      frontal: { correct: 1, incorrect: 2 },
    })
  })
})

describe('la instancia compartida', () => {
  it('es una sola para toda la aplicación', () => {
    // La degradación a memoria es estado de la instancia: un almacén por
    // render estrenaría una caché vacía y dejaría de degradar justo cuando
    // hace falta. Por eso hay exactamente uno.
    expect(progressStore).toBe(progressStore)
    expect(typeof progressStore.read).toBe('function')
    expect(typeof progressStore.write).toBe('function')
  })
})
