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

## T3 · Reemplazar `BoneNavigator` en `App.tsx` — y su fallout real

`App.tsx` monta `<FichasAccordion>` en el modo `'fichas'`. RED confirmado
en los 3 tests de `App.test.tsx` que clicaban "fémur derecho" sin
expandir nada — actualizados para expandir "Miembro inferior" primero,
mismo patrón que `BoneNavigator.test.tsx` ya usa.

El grep de `e2e/` hecho **antes** de esta tarea (en `plan.md`) encontró
los 3 puntos exactos que iban a romper, y los 3 rompieron efectivamente
al correr `check-integration`:

1. `desktop-scale-up.spec.ts`, "en Fichas, la fila de un par..." —
   reescrito para medir el botón de categoría directamente (`w-full`
   dentro del `md:max-w-2xl` de `App.tsx`) en vez del rodeo por
   `xpath=ancestor::li[1]` que el layout viejo necesitaba.
2. `mobile-shell.spec.ts`, "las filas del navegador..." — reescrito para
   expandir "Miembro inferior" y "Cráneo" antes de medir.
3. `mobile-shell.spec.ts`, "el nombre más largo..." — **encontré algo que
   el grep no había anticipado**: el test buscaba el nombre del hueso
   *sin* el lado (`getByText(..., {exact: true})`), porque
   `BoneNavigator` mostraba el nombre común una sola vez, separado de las
   píldoras de lado. `FichasAccordion` usa `accessibleName` (nombre +
   lado en un solo string) en cada etiqueta — el texto exacto sin lado ya
   no existe como nodo propio. Cambiado a búsqueda por substring
   (`exact` por defecto). El guardia de regresión de alto total
   (`≤ 6.208px`, contra la lista plana de antes de e7.4) se **retira, no
   se porta** — con categorías colapsadas por defecto ya no protege nada
   real, según lo previsto en `plan.md`.

Suite de integración completa: 21/21 en verde
(`./scripts/check-integration`), incluido `explore.spec.ts` sin tocarse
— ADR-010/ADR-011 se sostuvieron. Gate rápido verde (266 tests).

## T4 · Verificación manual — recorrido real en el navegador

Build + `vite preview` en puerto propio (matado al terminar, verificado
libre), recorrido con Playwright real:

- 9 categorías colapsadas al montar Fichas.
- Expandir "Cráneo" muestra "hueso frontal"; activarlo navega a la ficha
  (aparece "Volver").
- **"Volver" deja "Cráneo" colapsado otra vez** (`aria-expanded: false`)
  — confirma la decisión ya tomada en `scope.md`/`design.md` ("el estado
  de categorías expandidas es local a `FichasAccordion`"): al desmontar
  y remontar el componente, el estado se pierde. No es un olvido, es la
  consecuencia directa de la decisión — dicha en voz alta acá, como el
  plan pedía.
- Teclado: `Tab` alcanza un botón de categoría, `Enter` lo activa
  (`aria-expanded` pasa a `true`) — alcanzable sin mouse.

`explore.spec.ts` corrido por separado, en verde, sin haberse tocado.

## Finalize

- Full gate set: verde (`./scripts/check` — 266 tests;
  `./scripts/check-integration` — 21/21).
- Orphaned-test check: `BoneNavigator.tsx` confirmado sin diferencias
  contra `main` (`git diff main -- src/components/BoneNavigator.tsx` →
  vacío) — ADR-011 se cumplió al pie de la letra. `FichasAccordion.tsx`
  solo menciona `BoneNavigator` en comentarios, ningún import real.
  Ningún otro archivo fuera de los tocados importa `categories.ts` o
  `FichasAccordion.tsx`.
- Acceptance criteria: cumplidas de punta a punta.
