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

## T4 · Prueba de integración manual — el `localStorage` de verdad

Ejecutado en Chromium contra el build servido. Las cuatro asunciones que el
adaptador hace sobre una API que nunca había tocado, confirmadas:

1. **`getItem` de una clave ausente devuelve `null`**, no `undefined` —
   `setItem` devuelve `undefined`. La comprobación `crudo === null` del
   adaptador es la correcta; `?? null` habría sido igual de válido pero por
   casualidad.
2. **El valor sobrevive a `page.reload()`** — el observable de `RF-09` a nivel
   de almacén, un paso antes de que `e5.3` lo conecte al motor de test.
3. **Un valor corrupto hace lanzar `SyntaxError` a `JSON.parse`**, no devuelve
   `null` ni `undefined`. El `try/catch` del adaptador está puesto donde hace
   falta; sin esta comprobación no había forma de saberlo sin ejecutarlo.
4. **206 entradas escritas y releídas del `localStorage` real vuelven
   equivalentes**, ocupando 8.131 bytes — del mismo orden que los 9.822 medidos
   en Node sobre los ids reales del catálogo (la diferencia es que aquí los ids
   son sintéticos y más cortos).

Ninguna asunción resultó equivocada, que es un resultado y no una formalidad:
el riesgo que el plan nombraba —"escribir el adaptador contra una idea de
`localStorage` en vez de contra el real"— era real y quedó descartado con
evidencia en vez de con confianza.

## Finalize

- Full gate set: `./scripts/check` verde — **166 tests** (151 al empezar la
  historia, 15 nuevos en `progress-store.test.ts`).
- Orphaned-test check: limpio — ningún test fuera de esta historia importa
  `src/storage/progress-store`; el módulo es nuevo y su consumidor llega en
  `e5.3`.
- Dirección de la dependencia verificada: la única aparición de "storage" bajo
  `src/domain/` es un comentario que la explica. Ningún `import`.
- Acceptance criteria: los seis escenarios del `scope.md` y el escenario delta
  del `design.md`, cumplidos y con test propio. Los cinco `Done when`
  cumplidos.
