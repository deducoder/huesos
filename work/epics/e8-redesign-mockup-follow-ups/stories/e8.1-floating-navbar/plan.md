# Story e8.1: Merged navbar — Plan

> Size: S

## Tasks

### T1 · Fundir cabecera y pestañas en una sola fila

- **Files:** modify `src/App.tsx`, `src/App.test.tsx`
- **TDD:** RED — dos tests: (a) el título "huesos-mono" y el
  `nav[aria-label="Modo de estudio"]` (por su rol `navigation`) viven
  dentro del mismo `role="banner"`; (b) en modo `'ficha'`, el `banner`
  sigue mostrando el título pero no el `navigation` — mismo
  comportamiento que hoy, ahora verificado explícito porque antes eran
  dos elementos hermanos sin relación de contención → GREEN — fundir
  `<header>` y el bloque de `Pestanas` en un solo `<header>` flex; el
  título baja de `text-titulo` a un tamaño que quepa junto a las tres
  pestañas (ajustado en T2 con medición real, acá alcanza con que
  compile y pase jsdom) → REFACTOR.
- **Satisfies:** el escenario base del scope ("una sola fila, no dos").
- **Verify:** propiedad — el `navigation` está siempre dentro del mismo
  `banner` que el `heading`, nunca como hermano suelto; forced mutation:
  volver a renderizar `Pestanas` fuera del `<header>` → el test (a) debe
  fallar. Luego `npx vitest run src/App.test.tsx` · `./scripts/check`.
- **Commit:** `feat(app): merge the header and mode tabs into one row`

### T2 · Medir en un navegador real, ajustar y barrer el token huérfano

- Con la aplicación construida y servida, en 390×844: confirmar que el
  título y las tres pestañas entran en una fila sin desbordar, que las
  pestañas conservan 44px de mínimo táctil, y —el riesgo nombrado en
  `design.md`— que `nav[aria-label="Modo de estudio"]`
  `.getBoundingClientRect().bottom` coincide con el borde inferior real
  de la cabecera (si no coincide, `items-stretch` en vez de
  `items-center` en el contenedor flex, o el ajuste que la medición real
  pida).
- Correr `e2e/mobile-shell.spec.ts` completo — "el título usa la familia
  display empaquetada" y "el lienzo de Explorar ocupa toda la pantalla
  disponible" son los dos que este cambio puede romper sin que
  `./scripts/check` lo vea.
- Si `--text-titulo` (`src/index.css`) queda sin ningún consumidor tras
  el ajuste de tamaño, borrarlo — legacy sweep, no dejarlo como token
  fantasma.
- **Files:** modify `src/App.tsx` (solo si la medición real pide ajustar
  clases), `src/index.css` (si el token queda huérfano)
- **Verify:** `npx playwright test e2e/mobile-shell.spec.ts` en verde;
  medición manual sin desborde a 390px; `grep -rn "text-titulo" src`
  vacío si se borra el token, o justificado si se mantiene.
- **Commit:** `fix(app): keep the merged navbar row aligned in a real browser` (si hace falta ajuste) más `chore(app): remove the unused title token` (si el token queda huérfano) — dos commits solo si ambos aplican, uno solo si alcanza.

## Order & risks

- **Execution order:** T1 → T2. T2 depende de que T1 exista para medirlo.
- **Dependencies:** secuencial.
- **Riesgos:** el único riesgo real de la historia —la desalineación de
  `nav.bottom` si título y pestañas quedan centrados con alturas
  distintas— está nombrado desde el diseño, no se descubre en T2, se
  confirma o se descarta ahí.
