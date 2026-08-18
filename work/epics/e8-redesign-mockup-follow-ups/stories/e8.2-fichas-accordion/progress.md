# Story e8.2: Fichas accordion — Progress

## T1 · `groupByCategory` — función pura

`src/components/categories.ts` creado con `groupByCategory`/`CategoryGroup`.
5 tests: "Cráneo" con 2 regiones en orden, 9 categorías totales, las 8
restantes con 1 región cada una, orden anatómico conservado, lista vacía
→ `[]`. Mutación forzada (fusionar por índice fijo en vez de por
etiqueta) confirmó que el test de "Oído medio" (y las demás 7) lo
detecta.

Gate: `./scripts/check` verde (260 tests, lint/format/types limpios).
Ninguna desviación del plan.
