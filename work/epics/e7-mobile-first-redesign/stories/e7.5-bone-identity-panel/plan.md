# Story e7.5: Panel de identidad — Plan

> Size: S

Dos frases de retrospectivas anteriores, aplicadas: la cifra final se mide
sobre el componente real, no sobre un supuesto (e7.4); y las cifras táctiles
se verifican en navegador tras `npx vite build`, con el `vite preview` del
túnel corriendo (e7.2/e7.3).

## Tasks

### T1 · `siblingId` compartido, y `navigator-rows.ts` lo consume

- **Files:** create `src/domain/side-pairing.ts`,
  `src/domain/side-pairing.test.ts`; modify `src/domain/navigator-rows.ts`.
- **TDD:** RED `side-pairing.test.ts` — `siblingId` en las dos direcciones y
  con un impar (`null`); `isSideIrrelevant` con `malleus-right` (`true`),
  `femur-right` (`false`) y un opuesto inexistente (`false`, no oculta ante la
  duda) — falla porque el módulo no existe → GREEN la implementación del
  design → REFACTOR `navigator-rows.ts` reemplaza su regex propia por
  `siblingId`, sin cambiar su comportamiento.
- **Satisfies:** Must 3, Must NOT 3 del design.
- **Verify:** `./scripts/check` — incluye `navigator-rows.test.ts` **sin
  tocarlo**, que es la prueba de que el refactor no cambió nada observable.
- **Commit:** `refactor(domain): extract siblingId, shared by navigator and identity`
- **Por qué primero:** es la pieza de la que depende T2, y su riesgo es tocar
  un archivo que e7.4 ya cerró — se verifica solo, antes de construir nada
  visual encima.

### T2 · El campo «Lado» respeta `isSideIrrelevant`

- **Files:** modify `src/components/BoneIdentity.tsx`,
  `src/components/BoneIdentity.test.tsx`.
- **TDD:** RED dos pruebas nuevas —`malleus-right` no muestra «Lado» ni lo
  anuncia en el estado vivo; `femur-right` lo sigue mostrando— fallan porque el
  componente no consulta `isSideIrrelevant` todavía → GREEN el `ocultarLado`
  del design, aplicado en el campo visible y en el anuncio → REFACTOR ninguno.
- **Satisfies:** Must 4; los criterios 3 y 4 del scope.
- **Verify:** `./scripts/check` — los 11 tests existentes de
  `BoneIdentity.test.tsx` siguen verdes sin tocarse.
- **Commit:** `feat(identity): hide side for fully-absent pairs`

### T3 · Botón, tipografía y bordes al contrato del rediseño

- **Files:** modify `src/components/BoneIdentity.tsx`;
  modify `e2e/mobile-shell.spec.ts`.
- **TDD:** RED una prueba de navegador — el botón «ver ficha completa» mide
  ≥44×44 px, y la familia computada del `h2` contiene `Fredoka` — falla con
  34 px y la pila del sistema → GREEN los tres cambios mecánicos del design
  (`min-h-tactil border-2 rounded-suave` en el botón, `font-display` en el
  `h2`, `border-2 rounded-suave` en el aviso) → REFACTOR ninguno.
- **Satisfies:** Must 1, Must 2, Should 1; los dos primeros criterios Gherkin
  del scope.
- **Verify:** `npx vite build` (hay un `vite preview` del túnel corriendo) y
  luego `npx playwright test e2e/mobile-shell.spec.ts`.
- **Commit:** `feat(identity): thumb-sized button and display title`

### T4 · Manual integration test

- Con la aplicación por el túnel, en el teléfono: seleccionar «fémur» y
  confirmar el botón, la tipografía y el campo «Lado»; seleccionar «martillo»
  desde la lista y confirmar que el panel no menciona lado; abrir la ficha
  completa desde el botón y confirmar que el panel se ve igual ahí.
- **Verify:** los dos usos del componente —`ExploreView`, `BoneDetailView`—
  se ven y se comportan igual. Antes de cerrar, `./scripts/check-integration`.

## Order & risks

- **Execution order:** T1 → T2 → T3 → T4. T1 antes que T2 por dependencia
  dura: `isSideIrrelevant` no existe hasta T1. T3 va después de T2 y no antes
  porque toca el mismo archivo (`BoneIdentity.tsx`) y separar por
  responsabilidad —lógica primero, forma después— deja cada commit revisable
  por separado.
- **Dependencies:** secuencial.
- **Risks:**
  - *El refactor de `navigator-rows.ts` cambia su comportamiento sin
    querer* → su propia suite, ya escrita en e7.4, corre sin tocarse en T1; si
    se pone roja, es la señal de parar la línea.
  - *`isSideIrrelevant` oculta el lado de un hueso que sí lo necesita, por un
    bug en la búsqueda del opuesto* → el caso de "opuesto inexistente → no
    oculta" está en el RED de T1, no es una ocurrencia tardía.
  - *Medir contra un build viejo* → `npx vite build` antes de T3.
