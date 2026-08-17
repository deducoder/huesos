# Story e3.3: Acceso a la ficha sin el esqueleto completo — Plan

> Size: XS

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · `App.tsx`: pestañas, modo "Fichas" y origen de "Volver"

- **Files:** modify `src/App.tsx`; test `src/App.test.tsx`
- **TDD:** RED —
  1. desde el arranque, la pestaña "Fichas" muestra la lista de 206 huesos
     (agrupada por región) sin que la escena de `ExploreView` esté montada;
  2. elegir un hueso de esa lista abre `BoneDetailView` para ese hueso;
  3. "Volver" desde ahí regresa a la lista de fichas, no a `ExploreView`;
  4. el camino existente (e3.2: seleccionar en `ExploreView` → "Ver ficha
     completa" → "Volver") sigue regresando a `ExploreView` con su
     selección — regresión explícita, no se vuelve a escribir el escenario
     de e3.2, se reusa el mismo assert que su test ya probó
  → GREEN: `Modo` gana un tercer caso `{ tipo: 'fichas' }` y el de ficha
  gana un campo `origen: 'explorar' | 'fichas'`; pestañas de nivel superior
  que solo aparecen fuera del modo `'ficha'`; el modo `'fichas'` reutiliza
  `BoneNavigator` con `selected={null}` y `onSelect` que navega en vez de
  alternar → REFACTOR
- **Satisfies:** los cuatro escenarios del scope
- **Verify:** `npx vitest run src/App.test.tsx && ./scripts/check`
- **Commit:** `feat(app): reach a bone's detail without the full scene`

### T2 · Prueba manual de integración

- Levantar `npm run dev`: desde el arranque, abrir la pestaña "Fichas" sin
  haber tocado "Explorar"; confirmar que no hay ninguna petición ni consola
  relacionada con el modelo 3D hasta elegir un hueso; abrir la ficha de un
  hueso par y de uno impar; "Volver" desde ahí a la lista; luego repetir el
  camino de e3.2 (Explorar → seleccionar → ficha → Volver) y confirmar que
  sigue intacto.
- **Verify:** confirmado a ojo, sin errores en consola del navegador.

## Order & risks

- **Execution order:** T1 único (todo el cambio cabe en `App.tsx`, sin
  componente nuevo) → T2 confirma en navegador real.
- **Dependencies:** ninguna — T1 reutiliza `BoneNavigator` y
  `BoneDetailView` sin modificarlos.
- **Risks:**
  - Que "Fichas" termine montando `SkeletonScene` de pasada (por ejemplo,
    si `ExploreView` queda montada oculta en vez de condicional) rompería
    el propio punto de la historia → mitigación: el test de T1 verifica
    explícitamente que el doble de `SkeletonScene` no aparece en el modo
    `'fichas'`, no solo que la lista aparece.
