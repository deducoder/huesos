# Story e8.2: Fichas accordion — Plan

> Size: M

## Tasks

### T1 · `groupByCategory` — función pura

- **Files:** create `src/components/categories.ts`, `src/components/categories.test.ts`
- **TDD:** RED — con el catálogo real: exactamente 9 categorías; "Cráneo"
  con 2 `regions` (`cranium`, `face`, en ese orden); las 8 restantes con 1
  región cada una, en el mismo orden que `groupByRegion` ya produce;
  catálogo vacío → `[]` → GREEN — recorrer `groupByRegion(bones)` y
  fusionar regiones **adyacentes** cuyo prefijo antes de "—" en
  `REGION_LABEL` coincida → REFACTOR.
- **Satisfies:** escenario del scope ("Categorías: ... agrupadas bajo
  'Cráneo'... cada una su propia categoría").
- **Verify:** propiedad — "Cráneo" tiene exactamente 2 `regions`, todas
  las demás exactamente 1; forced mutation: comparar por índice en vez
  de por el prefijo de la etiqueta (ej. fusionar siempre las dos
  primeras) → el test de "Oído medio" (que no debería fusionarse con
  nada) debe fallar. Luego
  `npx vitest run src/components/categories.test.ts` · `./scripts/check`.
- **Commit:** `feat(components): group regions into fichas categories`

### T2 · `FichasAccordion` — categorías, subgrupos y grilla de etiquetas

- **Files:** create `src/components/FichasAccordion.tsx`,
  `src/components/FichasAccordion.test.tsx`
- **TDD:** RED — al montar: 9 botones de categoría, todos
  `aria-expanded="false"`, ninguna etiqueta de hueso visible; activar
  "Cráneo" la expande (`aria-expanded="true"`) y muestra sus 2 subgrupos
  con su grilla (22 etiquetas entre los dos); activar una etiqueta llama
  `onSelect` con el id correcto; el subgrupo "Oído medio" expandido
  muestra 3 etiquetas (no 6) para sus 3 pares sin geometría, con
  `aria-describedby` explicando por qué — mismo criterio que
  `BoneNavigator.test.tsx` ya prueba para "martillo" → GREEN — estado
  `expandedCategories: ReadonlySet<string>`; reutiliza `toNavigatorRows`
  por subgrupo, reproduciendo las 3 ramas de `BoneNavigator` (single /
  par colapsado / par con 2 etiquetas) — `accessibleName` se duplica acá
  (comentario explícito citando `design.md`, no se toca
  `BoneNavigator.tsx`) → REFACTOR.
- **Satisfies:** los 3 primeros escenarios del scope y el de pares
  indistinguibles.
- **Verify:** propiedad — ninguna etiqueta de hueso está en el DOM antes
  de expandir su categoría; forced mutation: montar los subgrupos
  siempre expandidos (ignorar `expandedCategories`) → el test de
  "ninguna etiqueta visible al montar" debe fallar. Luego
  `npx vitest run src/components/FichasAccordion.test.tsx` ·
  `./scripts/check`.
- **Commit:** `feat(components): add the fichas category accordion`

### T3 · Reemplazar `BoneNavigator` en `App.tsx` — y su fallout real

`App.tsx` monta `FichasAccordion` en el modo `'fichas'`. **Aplicando el
aprendizaje de e8.4** (cambiar el DOM por defecto de una vía muy usada
rompe algo fuera de `./scripts/check`): un grep de `Fichas`/`hueso
parietal`/`nav\[aria-label` sobre `src/App.test.tsx` y `e2e/` antes de
dar la tarea por terminada, no después.

- **Files:** modify `src/App.tsx`, `src/App.test.tsx`,
  `e2e/desktop-scale-up.spec.ts`, `e2e/mobile-shell.spec.ts`
- **TDD:** RED — los 3 tests de `App.test.tsx` que clican "fémur derecho"
  apenas entran a Fichas (sin expandir nada) deben fallar contra el
  componente nuevo → GREEN — actualizarlos para expandir "Miembro
  inferior" antes de clicar, mismo patrón que `BoneNavigator.test.tsx` ya
  usa para localizar un hueso par por su nombre accesible → REFACTOR.
- **Satisfies:** el resto de los escenarios del scope (navegar a la
  ficha, "Volver" regresa a Fichas).
- **Verify:** propiedad — el recorrido completo (Fichas → expandir
  categoría → elegir hueso → ficha → Volver) sigue funcionando igual que
  con `BoneNavigator`; forced mutation: revertir `App.tsx` al
  `<BoneNavigator>` original → los 3 tests de `App.test.tsx` actualizados
  deben fallar (esperan el flujo con expansión, que `BoneNavigator` no
  tiene). Luego `npx vitest run src/App.test.tsx` · `./scripts/check`.
- **Commit:** `feat(app): mount the fichas accordion instead of the flat bone list`

Fallout esperado en `e2e/` (confirmado por grep antes de planear esta
tarea, no descubierto durante):

- `e2e/desktop-scale-up.spec.ts`, "en Fichas, la fila de un par no se
  estira": localizaba `hueso parietal derecho` por `<li>` ancestro —
  reescribir para expandir "Cráneo" primero y medir una etiqueta de la
  grilla nueva.
- `e2e/mobile-shell.spec.ts`, "las filas del navegador de huesos
  alcanzan el mínimo táctil": mismo ajuste, expandir antes de medir.
- `e2e/mobile-shell.spec.ts`, "el nombre más largo se lee completo...":
  la mitad "se lee completo, sin recortar" sigue siendo real — se
  reescribe para expandir la categoría de "Miembro superior" y buscar el
  nombre de 44 caracteres ahí. **La otra mitad —el guardia de regresión
  `scrollHeight ≤ 6208px` contra la lista plana de antes de e7.4— se
  retira, no se porta**: con categorías colapsadas por defecto, el alto
  total es trivialmente chico sin que eso proteja nada; comparar contra
  una cifra de una arquitectura de información que ya no existe deja de
  ser una guardia real. Se documenta la decisión en `progress.md`, no se
  hace en silencio.

### T4 · Verificación manual — recorrido real en el navegador

- Con la aplicación construida y servida: entrar a Fichas, confirmar 9
  categorías colapsadas; expandir "Cráneo" y "Miembro inferior";
  confirmar que los pares muestran 2 etiquetas y que "Oído medio" muestra
  3 (no 6); tocar una etiqueta y confirmar que abre la ficha completa;
  "Volver" regresa a Fichas con el mismo estado de expansión de antes (o,
  si no lo conserva, confirmar que es una decisión consciente, no un
  olvido).
- Con teclado: `Tab` alcanza los botones de categoría y, una vez
  expandida una, las etiquetas dentro — sin atajos rotos.
- Correr `explore.spec.ts` completo y confirmar que sigue en verde sin
  haberse tocado — la prueba de que ADR-010/ADR-011 se sostuvieron.
- **Verify:** recorrido completo sin errores en consola; `npx playwright
  test e2e/explore.spec.ts` en verde; `./scripts/check-integration`
  completo en verde (no solo los specs que esta historia tocó — mismo
  criterio que e8.4 dejó escrito en su retrospectiva).

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T2 consume T1; T3 consume T2;
  T4 valida todo junto.
- **Dependencies:** estrictamente secuencial.
- **Riesgos:**
  - El fallout de `e2e/` ya está mapeado antes de implementar (a
    diferencia de e8.4, donde se descubrió a mitad de T4) — el riesgo que
    queda es que el grep no haya sido exhaustivo. T4 corre la suite
    completa, no solo los specs identificados, para atraparlo si lo hay.
  - Duplicar `accessibleName` (3 líneas) entre `BoneNavigator.tsx` y
    `FichasAccordion.tsx` es una decisión ya tomada en `design.md`
    (ADR-011 lo anticipa como costo aceptado) — no es un olvido de DRY,
    no hace falta resolverlo acá.
