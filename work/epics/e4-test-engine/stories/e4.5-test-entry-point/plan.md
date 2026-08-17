# Story e4.5: Acceso al modo test y guardrail de fuga — Plan

> Size: S

## Tasks

### T1 · `App.tsx`: pestaña "Test" con elección de variante

- **Files:** modify `src/App.tsx`; test `src/App.test.tsx`
- **TDD:** RED —
  1. desde el arranque, la pestaña "Test" muestra las dos opciones
     ("Esqueleto completo" / "Hueso aislado"), sin montar ninguna vista de
     pregunta todavía;
  2. elegir "Esqueleto completo" monta el doble de `SkeletonTestView`;
  3. elegir "Hueso aislado" monta el doble de `BoneTestView`;
  4. los tres modos existentes (regresión, reusando los asserts que
     `App.test.tsx` ya tiene) siguen intactos
  → GREEN: `Modo` gana `{ tipo: 'test-elegir' }`,
  `{ tipo: 'test-esqueleto' }`, `{ tipo: 'test-hueso' }`; `Pestanas` gana un
  tercer botón "Test" → REFACTOR
- **Satisfies:** los tres primeros escenarios Gherkin del scope
- **Verify:** `npx vitest run src/App.test.tsx && ./scripts/check`
- **Commit:** `feat(app): reach the test mode from the app's entry point`

### T2 · Confirmar `must-data-003` en el gate — sin reescribirlo

- No es código: correr `./scripts/check` y verificar en su salida que
  `TestQuestion.test.tsx` y `BoneTestView.test.tsx` (con sus pruebas de
  `must-data-003`) corrieron y pasaron. Si por algún motivo no corrieran
  (por ejemplo, un `.only` olvidado en otro archivo), es un hallazgo, no
  algo que arreglar acá con un parche.
- **Verify:** salida de `./scripts/check` muestra ambos archivos de test
  ejecutados, con sus casos de `must-data-003` en verde.
- **Commit:** ninguno — es verificación, no cambia código.

### T3 · Prueba manual de integración

- Levantar `npm run dev`: desde el arranque, abrir "Test", elegir cada
  variante, confirmar a ojo que cada una pregunta correctamente (sin
  nombres visibles, resaltado o aislamiento según corresponda), y que
  "Explorar"/"Fichas" siguen funcionando sin regresión.
- **Verify:** confirmado a ojo, sin errores en consola del navegador.

## Order & risks

- **Execution order:** T1 (único cambio de código) → T2 (confirmación, sin
  código) → T3 (navegador real).
- **Dependencies:** T1 reutiliza `SkeletonTestView` (e4.2) y `BoneTestView`
  (e4.4) sin tocarlos.
- **Risks:**
  - Que agregar el cuarto modo rompa alguno de los tres existentes por un
    error en la unión discriminada de `Modo` → mitigación: T1 reusa los
    asserts de regresión ya escritos en `App.test.tsx`, no los reescribe
    desde cero.
