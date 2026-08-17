# Story e5.2: Browser persistence — Design

> Complexity: moderate

## 1 · What & why

**Problem:** el registro de `e5.1` vive solo en memoria. `RF-09` exige que
sobreviva a una recarga en el mismo navegador, y hoy el proyecto no tiene
ninguna capa de almacenamiento — `grep` de `localStorage`, `sessionStorage` e
`indexedDB` sobre `src/` no devuelve nada.

**Value:** es la mitad del observable literal de `RF-09` ("responder, recargar,
y que el registro siga ahí"). Sin esto, `e5.4` puede priorizar dentro de una
sesión y nada más, que es casi no priorizar.

## 2 · Approach

Un adaptador con dos operaciones —leer y guardar el registro completo— sobre una
interfaz mínima de almacenamiento que se **inyecta**, con `localStorage` como
valor por defecto cuando existe y un almacén en memoria cuando no.

Inyectar en vez de importar `localStorage` directamente es lo que sigue la casa:
`pickTestableBone` recibe `bones`, `TestQuestion` recibe `bones` y `renderScene`.
Ninguna función de este proyecto va a buscar sus dependencias por su cuenta, y
además es lo que permite probar el camino de fallo sin poder provocarlo de
verdad (no se puede "poner el navegador en modo privado" desde vitest).

**Components affected:**

- `src/storage/progress-store.ts`: create — el adaptador y la interfaz mínima.
- `src/storage/progress-store.test.ts`: create — contra dobles, incluido uno
  que lanza.

**Legacy sweep:** nothing — net-new. `src/storage/` es un directorio nuevo.

## 3 · Interface / examples

### Usage (API)

```ts
// En la aplicación: sin argumento, resuelve localStorage si está disponible.
const store = createProgressStore()
const progreso = store.read()
store.write(recordAnswer(progreso, 'frontal', false))

// En las pruebas: se le pasa el doble, incluido uno que lanza.
const store = createProgressStore(unAlmacenQueLanza())
```

### Expected output (success + error)

```
read()  sin nada guardado      -> {}
read()  con JSON corrupto      -> {}
read()  con forma inesperada   -> {}
read()  con almacén que lanza  -> {}
write() con almacén que lanza  -> no lanza; read() sigue devolviendo lo escrito
```

### Key data structures

```ts
/** Lo mínimo de `localStorage` que este adaptador usa. */
export interface KeyValueStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface ProgressStore {
  read(): ProgressRecord
  write(record: ProgressRecord): void
}

export function createProgressStore(storage?: KeyValueStorage): ProgressStore
```

## 4 · Acceptance criteria

- **Must:**
  - `read()` devuelve siempre un `ProgressRecord` válido: vacío ante ausencia,
    JSON inválido, forma inesperada o almacén que lanza.
  - `write()` nunca propaga una excepción del almacén.
  - Tras un `write()` que el almacén rechazó, `read()` sigue devolviendo lo
    escrito **durante esa sesión** — la degradación mantiene la sesión coherente
    en vez de fingir que no pasó nada y devolver datos viejos.
  - `src/domain/` sigue sin importar nada de `src/storage/`.
- **Should:**
  - La validación de forma acepta contadores enteros no negativos y descarta el
    registro entero si no valida, en vez de intentar reparar entradas sueltas:
    reparar a medias es cómo se cuela un dato inventado.
- **Must NOT:**
  - No toca el `localStorage` real en las pruebas unitarias.
  - No expone la interfaz de almacenamiento fuera de `src/storage/`.
  - No avisa al usuario ni registra nada en consola en el camino de fallo —
    interfaz está fuera de alcance, y un `console.error` en producción es ruido
    que nadie lee.

### Scenarios (delta over the scope)

```gherkin
Given un almacenamiento que lanza al escribir     # sharpened
When se guarda el progreso y después se lee
Then lo leído es lo recién escrito, servido desde memoria — no el valor
     anterior del almacén, que dejaría la sesión mostrando datos que el
     estudiante ya cambió
```

El `scope.md` decía "lo guardado sigue disponible durante la sesión". El gemba
lo afila: la caída a memoria tiene que **anteponerse** al almacén persistente
para las lecturas posteriores de esa sesión, o el estudiante ve retroceder su
progreso.
