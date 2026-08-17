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

## T2 · Leer y guardar el registro completo

Cuatro tests del camino normal: primera visita, ida y vuelta, escritura real
comprobada con un segundo almacén sobre los mismos datos, y el registro
completo de los 206 huesos del catálogo real.

**Desviación: no hubo RED.** Los cuatro pasaron sin escribir una línea de
código, porque T1 ya había tenido que traer `read`/`write` con su serialización
JSON — probar la degradación a memoria exige que guardar y leer existan. **El
corte T1/T2 del plan era artificial**: ordenar por riesgo puso primero una
tarea que no podía existir sin la segunda. Los tests se quedan igual —fijan el
camino normal y valen por sí solos— pero se commitearon como `test(...)` y no
como `feat(...)`, que es lo que son.

Gate: `./scripts/check` verde — 160 tests.

## T3 · Validar la forma de lo que vuelve

`esRegistroDeProgreso`, un guarda de tipo que rechaza lo que no sea un objeto
de contadores enteros no negativos, y descarta el **registro entero** ante
cualquier entrada mala en vez de repararlo a medias.

RED: 4 tests fallando — hoy cualquier JSON válido entraba al dominio tal cual,
incluidos `"hola"`, `42`, `[1,2,3]`, contadores negativos y no enteros.

Gate: **rojo al primer intento y committeado igual** — una línea en blanco de
más que dejó la inserción del validador, que el formateador rechazó. Tipos y
tests estaban verdes; solo `format:check` falló.

**Es una infracción de disciplina, no un detalle**: encadené el gate y el
commit en la misma tanda y no me detuve a leer el resultado antes de
commitear. El método dice que una tarea no está hecha hasta que el gate pasa,
y aquí el commit se hizo primero. Se arregló con un commit propio
(`style(storage): apply the formatter to the shape validator`) en vez de
enmendar la historia, porque esconder un commit rojo es peor que mostrarlo.
Gate verde tras el arreglo — 166 tests.
