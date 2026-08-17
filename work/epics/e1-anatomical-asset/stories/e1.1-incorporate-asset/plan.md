# Story e1.1: Incorporate asset — Plan

> Size: S

## Tasks

One commit per task, in execution order (riskiest first).

### T1 · Podar las texturas del modelo e incorporarlo

- **Files:** create `scripts/strip-textures.mjs`, `src/data/skeleton.glb`,
  `src/data/skeleton.integrity.test.ts`
- **TDD:** RED — un test que abre `src/data/skeleton.glb`, exige cero imágenes y
  cero texturas, y las 144 mallas nombradas; falla porque el archivo no existe →
  GREEN — el script de poda, ejecutado sobre el original, produce el archivo →
  REFACTOR — extraer el lector de GLB si el test y el script lo duplican.
- **Satisfies:** los tres escenarios del scope — sin texturas, mallas intactas.
- **Verify:** `npx vitest run src/data/skeleton.integrity.test.ts` y luego
  `./scripts/check`.
- **Commit:** `feat(data): add skeleton model stripped of NC textures`

### T2 · Declarar la atribución

- **Files:** create `src/data/ATTRIBUTION.md`
- **TDD:** sin ciclo — es documentación, y fabricar un test que compruebe que un
  archivo de texto existe no aporta señal. Se declara aquí en vez de simularlo.
- **Satisfies:** el tercer escenario del scope.
- **Verify:** `./scripts/check`.
- **Commit:** `docs(data): attribute the skeleton model`

### T3 · Manual integration test

- Abrir el `.glb` podado con un lector independiente del que escribió el test
  —parsear el chunk JSON a mano— y comprobar que la lista de nombres de malla es
  idéntica, elemento a elemento, a la del original descargado.
- **Verify:** las 144 mallas del original están en el podado, sin faltar ninguna
  y sin nombres cambiados; el archivo pesa menos que el original.

## Order & risks

- **Execution order:** T1 primero porque concentra todo el riesgo: si podar las
  texturas alterase la geometría o los nombres, el activo no sirve y ADR-001 se
  tambalea. T2 es documentación y no puede fallar.
- **Dependencies:** T1 → T3. T2 es independiente.
- **Risks:**
  - *Podar rompe los materiales y el modelo deja de cargar* → los materiales se
    conservan enteros; solo se quitan sus referencias `normalTexture`, que
    ningún material usa como color base.
  - *El test y el script duplican el parseo del GLB* → si ocurre, el REFACTOR de
    T1 lo extrae a un único lector.
