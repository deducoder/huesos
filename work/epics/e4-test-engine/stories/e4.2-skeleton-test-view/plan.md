# Story e4.2: Modo test sobre el esqueleto completo — Plan

> Size: M

## Tasks

### T1 · `TestQuestion`: el flujo pregunta → respuesta → siguiente

- **Files:** create `src/features/test/TestQuestion.tsx`; test
  `src/features/test/TestQuestion.test.tsx`
- **TDD:** RED —
  1. **`must-data-003`, el caso que más importa**: al montar, ningún string
     del catálogo completo (`es`, `la`, cualquier `synonym`, de los 206)
     aparece en `document.body.textContent` antes de responder;
  2. hay exactamente un `data-testid` de "escena" montado (vía
     `renderScene`, sustituida por un doble en el test);
  3. escribir la respuesta correcta y enviar muestra el texto "Correcto";
     una incorrecta muestra "Incorrecto" — nunca solo color;
  4. "Siguiente pregunta" (visible recién tras responder) cambia el
     `boneId` pasado a `renderScene`, y nunca repite el anterior en 50
     corridas
  → GREEN: `TestQuestion({ bones, renderScene })` con estado propio
  (`bone`, `respuesta`, `resultado`), usando `pickTestableBone` e
  `isCorrectAnswer` de e4.1 → REFACTOR
- **Satisfies:** los cuatro escenarios Gherkin del scope
- **Verify:** `npx vitest run src/features/test/TestQuestion.test.tsx && ./scripts/check`
- **Commit:** `feat(test): ask a question and validate the written answer`

### T2 · `SkeletonTestView`: compone `TestQuestion` + `SkeletonScene`

- **Files:** create `src/features/test/SkeletonTestView.tsx`; test
  `src/features/test/SkeletonTestView.test.tsx`
- **TDD:** RED — con `SkeletonScene` sustituida por un doble (WebGL no
  existe en jsdom, mismo criterio que `ExploreView.test.tsx`), montar
  `SkeletonTestView` y confirmar que ni `BoneNavigator` ni `BoneIdentity`
  están presentes (ninguna vía con nombre) y que el doble de la escena
  recibe el `boneId` de la pregunta activa → GREEN: composición directa →
  REFACTOR
- **Satisfies:** "sin ninguna vía con nombre visible" del scope
- **Verify:** `npx vitest run src/features/test/SkeletonTestView.test.tsx && ./scripts/check`
- **Commit:** `feat(test): wire the full-skeleton test view`

### T3 · Prueba manual de integración

- Levantar `npm run dev`, montar `SkeletonTestView` (temporalmente desde
  `App.tsx`, retirado antes del commit final — mismo patrón de e3.1 T3):
  confirmar a ojo que un hueso queda resaltado sin ningún nombre visible en
  ninguna parte de la pantalla, responder correcta e incorrectamente,
  "Siguiente pregunta" varias veces seguidas sin repetir.
- **Verify:** confirmado a ojo, sin errores en consola del navegador.

## Order & risks

- **Execution order:** T1 (todo el riesgo real: el guardrail `must-data-003`
  vive acá) → T2 (composición, bajo riesgo) → T3 (confirma en navegador
  real).
- **Dependencies:** T2 depende de que `TestQuestion` de T1 exista; T1 no
  depende de nada nuevo (usa `domain/answer-check.ts` y `domain/quiz.ts` de
  e4.1, ya mergeados en `main`).
- **Risks:**
  - Que `renderScene` termine recibiendo más que el `boneId` (por ejemplo,
    el objeto `Bone` completo "por comodidad") y algún consumidor futuro lo
    use para mostrar el nombre sin darse cuenta de que rompe
    `must-data-003` → mitigación: la firma de `renderScene` es
    `(boneId: string) => ReactNode`, nunca `(bone: Bone) => ReactNode` —
    decisión de tipos, no de disciplina.
