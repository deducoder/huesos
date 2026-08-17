import { EMPTY_PROGRESS, type ProgressRecord } from '../domain/progress'

/**
 * La persistencia del progreso (`RF-09`, ADR-004).
 *
 * La dirección de la dependencia es **almacenamiento → dominio**: este módulo
 * importa de `src/domain/`, y `src/domain/` no sabe que esto existe.
 */

/** La clave única bajo la que vive todo el registro (ADR-004). */
const CLAVE = 'huesos-mono:progress'

/**
 * Lo mínimo de `localStorage` que este adaptador usa.
 *
 * Se declara la parte que se necesita en vez de depender del `Storage` del DOM
 * entero: hace explícita la superficie real y permite pasar un doble en las
 * pruebas sin fingir un objeto de veinte miembros.
 */
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface ProgressStore {
  read(): ProgressRecord
  write(record: ProgressRecord): void
}

/**
 * El almacenamiento del navegador, o `null` donde no lo haya —Node, un
 * navegador con el almacenamiento bloqueado, una prueba sin DOM—.
 *
 * Acceder a `localStorage` puede **lanzar**, no solo devolver `undefined`, así
 * que la comprobación va dentro de un `try`.
 */
function almacenamientoDelNavegador(): KeyValueStorage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

/**
 * Un almacén de progreso sobre el almacenamiento dado, o sobre el del
 * navegador si no se pasa ninguno.
 *
 * Cuando el almacenamiento falla —modo privado, cuota agotada, acceso
 * bloqueado— **degrada a memoria**: la sesión sigue coherente y el progreso se
 * pierde al recargar, en vez de romper el modo test entero. La degradación
 * vive aquí y en ningún otro sitio; ni el dominio ni los componentes conocen
 * esa posibilidad.
 */
export function createProgressStore(storage?: KeyValueStorage): ProgressStore {
  const almacen = storage ?? almacenamientoDelNavegador()

  /**
   * Lo último que se intentó escribir, cuando el almacén lo rechazó.
   *
   * Se antepone a la lectura: sin esto, tras un `write` fallido el estudiante
   * vería **retroceder** su progreso al valor anterior del almacén, que es
   * peor que no guardarlo.
   */
  let enMemoria: ProgressRecord | null = null

  const read = (): ProgressRecord => {
    if (enMemoria !== null) return enMemoria
    if (almacen === null) return EMPTY_PROGRESS
    try {
      const crudo = almacen.getItem(CLAVE)
      return crudo === null ? EMPTY_PROGRESS : (JSON.parse(crudo) as ProgressRecord)
    } catch {
      return EMPTY_PROGRESS
    }
  }

  const write = (record: ProgressRecord): void => {
    if (almacen === null) {
      enMemoria = record
      return
    }
    try {
      almacen.setItem(CLAVE, JSON.stringify(record))
      enMemoria = null
    } catch {
      enMemoria = record
    }
  }

  return { read, write }
}
