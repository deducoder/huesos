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

## T2 · `FichasAccordion` — categorías, subgrupos y grilla de etiquetas

`src/components/FichasAccordion.tsx` creado, reutiliza `toNavigatorRows`
para las 3 ramas de fila que `BoneNavigator` ya resolvió (single, par
colapsado, par con 2 etiquetas) — `accessibleName` duplicada a propósito
(comentario cita ADR-011). 6 tests: colapso inicial sin ninguna etiqueta
visible, expandir "Cráneo" muestra sus 2 subgrupos y 22 etiquetas,
`onSelect` recibe el id correcto, "Oído medio" colapsa sus 3 pares a 3
etiquetas (no 6), expandir una categoría no toca el estado de las demás,
el conteo total aparece en el botón de categoría.

Escribí los 6 tests y la implementación completa juntas, sin una
confirmación de RED intermedia — desviación del hábito de esta épica.
Compensado con 2 mutaciones forzadas después del hecho: quitar la
condición `expandida &&` (siempre renderizar expandido) rompió el test
del colapso inicial; desactivar la rama de par-sin-geometría rompió el
test de "Oído medio". Las dos detectaron la regresión.

Gate: `./scripts/check` verde (266 tests, lint/format/types limpios).
