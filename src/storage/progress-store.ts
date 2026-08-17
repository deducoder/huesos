import { type BoneProgress, EMPTY_PROGRESS, type ProgressRecord } from '../domain/progress'

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

/** Un contador válido: entero y no negativo. */
function esContador(valor: unknown): valor is number {
  return typeof valor === 'number' && Number.isInteger(valor) && valor >= 0
}

/**
 * Si lo que volvió del almacén es un registro de progreso.
 *
 * Lo guardado es texto que escribió cualquiera: una versión anterior de la
 * aplicación, otra pestaña, o el propio usuario desde la consola. Lo que entra
 * al dominio se valida aquí o el dominio deja de poder confiar en sus tipos.
 *
 * Si una entrada no vale, se descarta el **registro entero** en vez de
 * repararlo a medias: si un texto trae basura, no hay razón para confiar en el
 * resto de ese mismo texto, y un registro reparado a medias es un dato
 * inventado con aspecto de dato real.
 */
function esProgresoDeHueso(valor: unknown): valor is BoneProgress {
  // Se estrecha con `in` en vez de con `as`: `must-type-004` prohíbe usar
  // aserciones de tipo para callar al compilador, y aquí no hacen falta —
  // `'correct' in valor` estrecha lo suficiente para leer la propiedad.
  return (
    typeof valor === 'object' &&
    valor !== null &&
    'correct' in valor &&
    'incorrect' in valor &&
    esContador(valor.correct) &&
    esContador(valor.incorrect)
  )
}

function esRegistroDeProgreso(valor: unknown): valor is ProgressRecord {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) return false
  return Object.values(valor).every(esProgresoDeHueso)
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
      if (crudo === null) return EMPTY_PROGRESS
      const analizado: unknown = JSON.parse(crudo)
      return esRegistroDeProgreso(analizado) ? analizado : EMPTY_PROGRESS
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

/**
 * El almacén de progreso de la aplicación. **Uno solo, creado una vez.**
 *
 * No es una comodidad: la degradación a memoria de `createProgressStore` es
 * estado de la instancia devuelta. Un almacén por render estrenaría una caché
 * vacía en cada uno y dejaría de degradar exactamente cuando hace falta —
 * cuando el navegador rechaza las escrituras.
 *
 * Fluye por props como ya fluye `catalog`: las vistas concretas lo pasan y
 * `TestQuestion` lo recibe, así que las pruebas inyectan un doble sin tocar
 * esta instancia.
 */
export const progressStore: ProgressStore = createProgressStore()
