# Story e5.2: Browser persistence — Plan

> Size: M

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · Degradar a memoria cuando el almacén falla

La tarea más riesgosa va primera: es la que el `plan.md` de la épica señala
como riesgo de mayor impacto (`localStorage` lanza en modo privado y se lleva
puesto el modo test), y la que el diseño afinó respecto del scope.

- **Files:** create `src/storage/progress-store.ts`,
  `src/storage/progress-store.test.ts`
- **TDD:** RED — con un doble cuyo `setItem` lanza `QuotaExceededError`,
  `write()` no debe lanzar y el `read()` siguiente debe devolver lo recién
  escrito → GREEN — `createProgressStore(storage?)` con caché en memoria que se
  antepone a la lectura tras un fallo de escritura → REFACTOR.
- **Satisfies:** el escenario delta del diseño, más "Given un almacenamiento que
  lanza al escribir" y "…al leer" del scope.
- **Verify:** `npx vitest run src/storage/progress-store.test.ts` ·
  `./scripts/check`
- **Commit:** `feat(storage): keep progress in memory when the browser store fails`

### T2 · Leer y guardar el registro completo

- **Files:** modify `src/storage/progress-store.ts`, su test
- **TDD:** RED — guardar un registro y leerlo debe devolver uno equivalente;
  leer sin nada guardado debe devolver `{}` → GREEN — serialización JSON bajo
  una sola clave (ADR-004) → REFACTOR.
- **Satisfies:** "Given un navegador sin nada guardado" y "Given un registro de
  progreso / When se guarda y después se lee".
- **Verify:** `npx vitest run src/storage/progress-store.test.ts` ·
  `./scripts/check`
- **Commit:** `feat(storage): persist the whole progress record under one key`

### T3 · Validar la forma de lo que vuelve

- **Files:** modify `src/storage/progress-store.ts`, su test
- **TDD:** RED — un valor guardado que no es JSON, y un JSON válido con forma
  inesperada (`{"frontal":"hola"}`, contadores negativos, contadores no
  enteros), deben dar `{}` en vez de lanzar o dejar pasar basura al dominio →
  GREEN — un validador de forma que descarta el registro entero → REFACTOR.
- **Satisfies:** los dos escenarios de dato corrupto del scope.
- **Verify:** `npx vitest run src/storage/progress-store.test.ts` ·
  `./scripts/check`
- **Commit:** `feat(storage): reject a stored value that is not a progress record`

### T4 · Prueba de integración manual — el `localStorage` de verdad

Los tests corren contra dobles a propósito, así que nada ha tocado todavía el
`localStorage` real. Esta tarea lo hace, en un navegador de verdad:

- Con la aplicación construida y servida, desde la consola del navegador:
  guardar un registro con el almacén real, recargar, y leerlo.
- Comprobar el comportamiento con la clave escrita a mano con basura.
- **Verify:** el registro sobrevive a la recarga; una clave corrupta no rompe
  la lectura. Es la primera vez que el camino real se ejerce de punta a punta,
  y la única forma de saber que la interfaz mínima que se inventó coincide con
  la que `localStorage` expone de verdad.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T1 primero por riesgo, no por
  dependencia: podría escribirse después, pero es donde está lo que puede
  invalidar el diseño.
- **Dependencies:** T2 y T3 dependen del módulo que crea T1. T4 necesita las
  tres.
- **Risks:**
  - *Escribir el adaptador contra una idea de `localStorage` en vez de contra el
    real.* Toda la historia se prueba con dobles que yo mismo escribo, así que
    los dobles pueden coincidir con mi idea equivocada de la API. → T4 existe
    exactamente por eso. Es el mismo patrón que
    `test-the-data-after-the-library`, ahora aplicado a una API del navegador.
  - *La caché en memoria y el almacén persistente se desincronizan* y `read()`
    devuelve un valor viejo tras un `write()` exitoso. → El escenario delta del
    diseño lo cubre; el test compara contra lo **recién escrito**, no contra lo
    que hubiera antes.
