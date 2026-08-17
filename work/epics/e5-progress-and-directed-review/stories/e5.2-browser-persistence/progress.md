# Story e5.2: Browser persistence — Progress

## T1 · Degradar a memoria cuando el almacén falla

`src/storage/progress-store.ts` con `createProgressStore(storage?)`,
`KeyValueStorage` (la superficie mínima de `localStorage` que se usa de verdad,
declarada en vez de heredada) y la caché en memoria que se antepone a la
lectura tras un `write` rechazado.

RED: cuatro tests fallando por módulo inexistente, todos del camino de fallo —
`setItem` que lanza `QuotaExceededError`, `getItem` que lanza `SecurityError`,
y la acumulación de dos escrituras rechazadas seguidas.

Gate: `./scripts/check` verde — 156 tests.

**Dos desviaciones, ambas por tests que no valían nada:**

1. Escribí un test —"usa el almacén cuando sí funciona, no la memoria"— cuya
   aserción pasaba trivialmente: el doble copiaba el objeto inicial con
   `{...inicial}`, así que el segundo almacén nunca podía ver lo que escribió
   el primero, y la aserción `toEqual({})` se cumplía por construcción. Se
   eliminó antes de commitear; la comprobación real de ida y vuelta es T2, con
   un doble que **comparte** el almacén en vez de copiarlo.
2. Ese doble compartido quedó sin usar en T1 y el gate lo rechazó
   (`noUnusedVariables` + `TS6133`). Se retiró hasta T2, que es donde lo usa.
   El gate hizo de red exactamente donde tenía que hacerla.
